import { conference_rank_footprints } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";


export class ConferenceRankFootPrintData {
    @ApiProperty({description: 'Id of footprint', example: '23213-12312-12312-12312'})
    id: string;

    @ApiProperty({description: 'Conference id', example: '23213-12312-12312-12312'})
    conference_id: string;

    @ApiProperty({description : "Rank id ", example : "23213-12312-12312-12312"})
    rank_id : string;

    @ApiProperty({description : "Primary field of research id", example : 2021})
    for_id : string ;

    @ApiProperty ({description : "year of rank", example : 2021})
    year : Decimal;

    constructor (data : conference_rank_footprints) {
        this.id = data.id;
        this.conference_id = data.conference_id as string;
        this.rank_id = data.rank_id as string;
        this.year = data.year as Decimal;
        this.for_id = data.for_id as string;
    }
}