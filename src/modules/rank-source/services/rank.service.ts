import { Injectable } from '@nestjs/common';
import { RankOfCfpData, SourceRanksData, SourceRanksInput  } from '../model';
import { PrismaService } from '../../common';

@Injectable()
export class RankService {
    public constructor (
        private readonly prismaService: PrismaService,
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

    async creeateRankOfSource(data: SourceRanksInput): Promise<SourceRanksData> {
        const rankOfSource = await this.prismaService.source_ranks.create({
            data
        });

        return new SourceRanksData(rankOfSource);
    }

    async createRankOfCfp(data: RankOfCfpData): Promise<RankOfCfpData> {
        const rankOfCfp = await this.prismaService.rank_of_cfp.create({
            data
        });

        return new RankOfCfpData(rankOfCfp);
    }
}