import { ApiProperty } from "@nestjs/swagger";
import { FoRGroupWithDivisionData } from "../../../field-of-research/model";
import { RankWithSourceData } from "../../../rank-source";
import { ConferenceRankFootPrintData } from "../conference-rank-footprint.data";

export class ConferenceRankFootPrintWithRanksData extends ConferenceRankFootPrintData {

    @ApiProperty({description: 'Rank with source data', type : RankWithSourceData })
    public ranks_of_source : RankWithSourceData;

    @ApiProperty({description: 'Field of research group with division data', type: FoRGroupWithDivisionData})
    public for_group : FoRGroupWithDivisionData;

    public constructor(init?: Partial<ConferenceRankFootPrintWithRanksData>) {
        super(init as ConferenceRankFootPrintData);
        Object.assign(this, init);
    }
}