import { sources as Source } from "@prisma/client";

import { ApiProperty } from "@nestjs/swagger";

export class SourceData {
    @ApiProperty({description: 'Unique identifier of the source.', example: '75442486-0878-440c-9db1-a7006c25a39f'})
    id: string;
    @ApiProperty({description: 'Name of the source', example: 'TechCrunch'})
    name: string | null;
    @ApiProperty({description: 'URL of the source', example: 'https://techcrunch.com/'})
    link: string | null;

    constructor (entity: Source) {
        this.id = entity.id;
        this.name = entity.name;
        this.link = entity.link
    }

}