import { rank_of_cfp as RankOfCfp } from "@prisma/client";

import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";

export class RankOfCfpData {
    @ApiProperty({description: 'Unique identifier of the rank of cfp.', example: '75442486-0878-440c-9db1-a7006c25a39f'})
    id: string;
    @ApiProperty({description: 'ID Rank of the cfp', example: "23231232-0878-440c-9db1-a7006c25a39f"})
    rank_id: string | null;
    @ApiProperty({description: 'ID Cfp of the rank', example: '12313235-0878-440c-9db1-a7006c25a39f'})
    cfp_id: string | null;

    @ApiProperty({description: 'Year of rank', example: 2021})
    year: Decimal | null;

    constructor (entity: RankOfCfp) {
        this.id = entity.id;
        this.rank_id = entity.rank_id;
        this.cfp_id = entity.cfp_id;
        this.year = entity.year ;
    }
}