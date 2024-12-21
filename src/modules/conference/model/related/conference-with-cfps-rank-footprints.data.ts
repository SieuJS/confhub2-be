import { ApiProperty } from '@nestjs/swagger';
import { CfpWithImportantDatesData } from '../../../call-for-paper';
import { ConferenceData } from '../conference.data';
import { ConferenceRankFootPrintWithRanksData } from './conference-rank-footprints-with-rank-source.data';

export class ConferenceWithCfpsRankFootprintsData extends ConferenceData {

    @ApiProperty({description: 'Conference rank footprints with ranks data', type: ConferenceRankFootPrintWithRanksData, isArray: true})
    public conference_rank_footprints: ConferenceRankFootPrintWithRanksData[];

    @ApiProperty({description: 'Conference call for papers with important dates data', type: CfpWithImportantDatesData, isArray: true})
    public call_for_papers : CfpWithImportantDatesData[];

    public constructor(init?: Partial<ConferenceWithCfpsRankFootprintsData>) {
        super(init as ConferenceData);
        Object.assign(this, init);
    }
}