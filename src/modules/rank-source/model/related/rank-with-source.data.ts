import { SourceRanksData } from "../source_ranks.data";

import { SourceData } from "../source.data";
import { ApiProperty } from "@nestjs/swagger";

export class RankWithSourceData  extends SourceRanksData {
    @ApiProperty({description: 'Rank with source data', type : SourceData })
    sources : SourceData;
}