import { ApiProperty } from "@nestjs/swagger";

export class FoRGroupData {
    @ApiProperty({description: 'The id of the group', example : '2131230-123123-123123-123123'})
    id: string;

    @ApiProperty({description : "The code of the group", example : '4601'})
    code: string;

    @ApiProperty({description : "The name of the group", example : 'Mathematical Sciences'})
    name: string;

    constructor (data: any) {
        this.id = data.id;
        this.name = data.name as string;
        this.code = data.code as string;
    }
}