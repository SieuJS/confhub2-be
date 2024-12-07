import { ApiProperty } from "@nestjs/swagger";
import { ConferenceWithCfpsRankFootprintsData } from "../related/conference-with-cfps-rank-footprints.data";
import { PaginatorTypes } from "@nodeteam/nestjs-prisma-pagination";


export class ConferenceWithCfpsRankFootprintsPaginateData implements PaginatorTypes.PaginatedResult<ConferenceWithCfpsRankFootprintsData> {
    @ApiProperty({description: 'Conference with call for papers and rank footprints data', type : ConferenceWithCfpsRankFootprintsData, isArray: true})
    data: ConferenceWithCfpsRankFootprintsData[];

    @ApiProperty({description: 'Meta information for pagination'  })
    meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
    };

}
