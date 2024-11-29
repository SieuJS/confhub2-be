import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { ConferenceData, ConferenceInput, ConferenceRankFootPrintsData } from '../model';
import {TransactionHost} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
@Injectable()
export class ConferenceService {
    
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
    ) {}

    // public async getTotalAndConference(offset: number, size: number, filterCondition:ConferenceData): Promise<{ total: number, conference: ConferenceData[] }> {
    //     const total = await this.prismaService.conferences.count();
    //     const conference = await this.find(filterCondition);
    //     return { total, conference };

    // }
    public async getTotalAndConference(offset: number, limit: number, filterCondition: ConferenceData): Promise<{ total: number, conference: ConferenceData[] }> {
        const total = await this.prismaService.conferences.count();
        const conference = await this.find(filterCondition);
        return { total, conference };
    }
    

    public async find(filter : ConferenceData ): Promise<ConferenceData[]> {
        const conferences = await this.prismaService.conferences.findMany({
            where : {
                ...filter
            }
        });

        return conferences.map(conference => new ConferenceData(conference));
    }

    public async findOne(filter : ConferenceData): Promise<ConferenceData> {
        const conference = await this.prismaService.conferences.findFirst({
            where : {
                ...filter
            }
        });

        return new ConferenceData(conference as ConferenceData);
    }

    public async findManyWithRankFootprints(filter: ConferenceData): Promise<
    (ConferenceData & { rank_foot_prints: ConferenceRankFootPrintsData[] })[]> {
        const conferences = await this.prismaService.conferences.findMany({
            where: filter,
            include: {
                conference_rank_footprints: true
            }
        });

        return conferences.map(conference => {
            let rank_foot_prints: ConferenceRankFootPrintsData[] = conference.conference_rank_footprints.map(footprint => new ConferenceRankFootPrintsData(footprint));
            return {
                ...new ConferenceData(conference),
                rank_foot_prints
            };
        });
    }

    public async findOneWithRankFootprints(filter: ConferenceData): Promise<ConferenceData & { rank_foot_prints: ConferenceRankFootPrintsData[] }> {
        const conference = await this.prismaService.conferences.findFirst({
            where: filter,
            include: {
                conference_rank_footprints: true
            }
        });

        if(!conference) {
            return null as any;
        }

        let rank_foot_prints: ConferenceRankFootPrintsData[] = conference?.conference_rank_footprints.map(footprint => new ConferenceRankFootPrintsData(footprint)) as ConferenceRankFootPrintsData[];
        return {
            ...new ConferenceData(conference as ConferenceData),
            rank_foot_prints
        };
    }

    public async create(data: ConferenceInput): Promise<ConferenceData> {
        return this.txHost.tx.conferences.create({data});
    }

}
