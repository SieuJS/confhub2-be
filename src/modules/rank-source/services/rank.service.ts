import { Injectable } from '@nestjs/common';
import { RankOfCfpData, SourceRanksData, SourceRanksInput  } from '../model';
import { PrismaService } from '../../common';
import {TransactionHost} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class RankService {
    public constructor (
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
    ) {}
    async findRankOfCfp(filter : RankOfCfpData): Promise<(RankOfCfpData & SourceRanksData)[]> {
        const ranksOfCfp = await this.prismaService.rank_of_cfp.findMany({
            where : filter,
            include :{
                ranks_of_source : true
            }
        });
        return ranksOfCfp.map(rankOfCfp => 
        {
            let rankOfCfpData = new RankOfCfpData(rankOfCfp)
            let sourceRanksData = new SourceRanksData(rankOfCfp.ranks_of_source as SourceRanksData)
            return {...rankOfCfpData, ...sourceRanksData}
        });
    }

    async findRankOfSource(filter : SourceRanksData): Promise<SourceRanksData[]> {
        const ranksOfSource = await this.prismaService.source_ranks.findMany({
            where : filter
        });
        return ranksOfSource.map(rankOfSource => new SourceRanksData(rankOfSource));
    }

    async createRankOfSource(data: SourceRanksInput): Promise<SourceRanksData> {

        return this.txHost.tx.source_ranks.create({data});

    }

    async createRankOfCfp(data: RankOfCfpData): Promise<RankOfCfpData> {

        return this.txHost.tx.rank_of_cfp.create({data});

    }
}