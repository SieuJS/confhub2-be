import { ApiProperty } from "@nestjs/swagger";

import { important_dates as ImportantDate } from "@prisma/client";

export class ImportantDateData {
    
    @ApiProperty({ description: "Important date unique ID", example: "75442486-0878-440c-9db1-a7006c25a39f" })
    public id : string ;
    @ApiProperty({ description: "Important date type", example: "Abstract Submission" })
    public date_type : string | null;
    @ApiProperty({ description: "Important date value", example: "2021-09-01" })
    public date_value : Date | null;
    @ApiProperty({ description: "Important date status", example: "true" as string })
    public status : boolean | null;
    @ApiProperty({ description: "Call for paper ID", example: "96d151b2-6a58-47df-a657-18a4b8b33b75" })
    public cfp_id : string | null;
    
    public constructor(entity: ImportantDate) {
        this.id = entity.id;
        this.date_type = entity.date_type;
        this.date_value = entity.date_value
        this.status = entity.status;
        this.cfp_id = entity.cfp_id;
    }
}