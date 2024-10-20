import { call_for_paper_details } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CfpDetailData {
    @ApiProperty({description: 'Unique identifier of the call for paper detail.', example: '75442486-0878-440c-9db1-a7006c25a39f'})
    id: string;
    @ApiProperty({description : 'CFP that has this details', example: '22132321-0878-440c-9db1-a7006c25a39f'})
    cfp_id: string | null;
    @ApiProperty({description: 'Start date of the CFP', example: '2021-09-01'})
    start_date: string;
    @ApiProperty({description: 'End date of the CFP', example: '2021-09-01'})
    end_date: string;
    @ApiProperty({description : "Access type of cfp", example : "online"}) 
    access_type: string | null;
    @ApiProperty ({description : "location of cfp", example : "HCMC"})
    location: string | null;
    @ApiProperty({description : "Country of cfp", example : "Vietnam"})
    country: string | null;

    constructor (entity: call_for_paper_details) {
        this.id = entity.id;
        this.cfp_id = entity.cfp_id;
        this.start_date = new Date(entity.start_date as Date).toDateString();
        this.end_date = new Date(entity.end_date as Date).toDateString();
        this.access_type = entity.access_type;
        this.location = entity.location;
        this.country = entity.country;
    }
}