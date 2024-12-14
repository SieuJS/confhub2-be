import { ApiProperty, PickType } from "@nestjs/swagger";
import { ConferenceData } from "./conference.data";

export class ConferenceInput extends PickType(ConferenceData, ['name', 'acronym'] as const) {
    @ApiProperty({description: 'Conference name', type: String})
    source : string ; 
    @ApiProperty({description: 'Conference rank', type: String})
    rank : string ; 
    @ApiProperty({description: 'List of Conference field of research', type: String})
    fieldOfResearches : string ;
}