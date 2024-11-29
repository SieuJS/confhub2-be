import { ApiProperty } from "@nestjs/swagger";
import { for_division } from "@prisma/client";

export class FoRDivisionData {
    @ApiProperty({description: 'The id of the division', example : '2131230-123123-123123-123123'})
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string; 

    constructor (data: for_division) {
        this.id = data.id;
        this.name = data.name as string;
        this.code = data.code as string;
    }
}