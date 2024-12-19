import { Injectable } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import {TransactionHost} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { PrismaService } from '../../common';
import { ConferenceRankFootPrintData, ConferenceRankFootPrintInput } from '../model';


@Injectable()
export class ConferenceRankFootPrintsService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
    ) {}

    public async find(filter: ConferenceRankFootPrintData): Promise<ConferenceRankFootPrintData[]> {
        const footprints = await this.prismaService.conference_rank_footprints.findMany({
            where: filter
        });
        return footprints as ConferenceRankFootPrintData[];
    }

    public async create(data: ConferenceRankFootPrintInput): Promise<ConferenceRankFootPrintData> {
        const footprint = await this.txHost.tx.conference_rank_footprints.create({
            data
        });
        return footprint as ConferenceRankFootPrintData;
    }

    public async findOrCreate(input: ConferenceRankFootPrintInput): Promise<ConferenceRankFootPrintData> {
        const footprint = await this.prismaService.conference_rank_footprints.findUnique ({
            where : {
                conference_id_rank_id_for_id_year: {
                    conference_id: input.conference_id,
                    rank_id: input.rank_id,
                    for_id: input.for_id,
                    year: input.year
                }
            }
        });
        if(footprint) {
            return footprint as ConferenceRankFootPrintData;
        }
        else {
            return this.create(input);
        }
    }
}