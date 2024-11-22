import { ApiProperty } from "@nestjs/swagger";

export class CrawlDateData {
    @ApiProperty({description : "datetime value", example : "2021-09-01"})
    readonly date : string ; 
    @ApiProperty({description : "keyword value", example : "Abstract Submission"})
    readonly keyword : string ;
    @ApiProperty({description : "Update_time", example : "2021-09-01"})
    readonly update_time : string ;

    constructor (data : CrawlDateData) {
        this.date = data.date;
        this.keyword = data.keyword;
        this.update_time = data.update_time;
    }
}