import { ApiProperty } from "@nestjs/swagger";

export class ConferenceFilter {
    @ApiProperty({description: 'The name of the conference' , example : 'Sieu dep trai'}) 
    name: string | null;

    @ApiProperty ({description : 'The acronym of the conference' , example : 'ICSE'})
    acronym: string | null;

    @ApiProperty ({description : "The rank of the conference" , example : "B"})
    rank: string | null;

    @ApiProperty({description : "The start date of cfp", example : "17/2/2024"})
    fromDate : string | null

    @ApiProperty({description : "The end date of cfp", example : "17/2/2024"})
    toDate : string | null

    @ApiProperty({description : "The location of the conference", example : "Vietnam"})
    location : string | null

    @ApiProperty({description : "The source of the conference", example : "CORE2023"})
    source : string | null


}