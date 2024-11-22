import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";
import { ConferenceRankFootPrintsData, ConferenceRankFootPrintsInput } from "../model";
import {TransactionHost} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class ConferenceRankFootPrintsService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
    ) {}

    public async find(filter: ConferenceRankFootPrintsData): Promise<ConferenceRankFootPrintsData[]> {
        const footprints = await this.prismaService.conference_rank_footprints.findMany({
            where: filter
        });
        return footprints as ConferenceRankFootPrintsData[];
    }

    public async create(data: ConferenceRankFootPrintsInput): Promise<ConferenceRankFootPrintsData> {
        const footprint = await this.txHost.tx.conference_rank_footprints.create({
            data
        });
        return footprint as ConferenceRankFootPrintsData;
    }

    public async findOrCreate(input: ConferenceRankFootPrintsInput): Promise<ConferenceRankFootPrintsData> {
        const footprint = await this.prismaService.conference_rank_footprints.findUnique ({
            where : {
                conference_id_rank_id_for_id_year: {
                    conference_id: input.conference_id as string,
                    rank_id: input.rank_id as string,
                    for_id: input.for_id as string,
                    year: input.year 
                }
            }
        })

        if(footprint) {
            return footprint as ConferenceRankFootPrintsData;
        }
        else {
            return this.create(input);
        }
    }
}