import { ApiProperty } from "@nestjs/swagger";
import { source_ranks } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class SourceRanksData {
    @ApiProperty({description: 'Unique identifier of the rank of source.', example: '75442486-0878-440c-9db1-a7006c25a39f'})
    id: string;
    @ApiProperty({description: 'Rank of the source', example: "A+"})
    rank: string | null;
    @ApiProperty({description: 'Source of the rank', example: '12345678-0878-440c-9db1-a7006c25a39f'})
    source_id: string | null;
    @ApiProperty({description: 'Value of rank', example: 10})
    value: Decimal | null;

    constructor (entity: source_ranks) {
        this.id = entity.id;
        this.rank = entity.rank;
        this.source_id = entity.source_id;
        this.value = entity.value ;
    }
}