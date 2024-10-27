import { ApiProperty } from "@nestjs/swagger";
import { call_for_papers as CallForPaper } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ImportantDateData } from "./";

export class CallForPaperData {
    public static readonly DESCRIPTION_LENGTH = 1000;
    @ApiProperty ({description: "Call for paper unique ID", example: "75442486-0878-440c-9db1-a7006c25a39f"})
    public readonly id : string;
    
    @ApiProperty({description: "Call for paper content", example: "This is call for paper"})
    public readonly content : string | null;

    @ApiProperty ({description : "Link of call for paper", example: "https://cita.vku.udn.vn/"})
    public readonly link : string | null;

    @ApiProperty ({description : "Owner of call for paper", example: "John"})
    public readonly owner : string | null;

    @ApiProperty ({description : "Status of call for paper", example: "true" as string})
    public readonly status : boolean | null;

    @ApiProperty ({description : "Total view on this call for paper", example: "100"})
    public readonly view_count : Decimal | null;


    public readonly importantDates : ImportantDateData | null;

    public constructor(entity: CallForPaper) {
        this.id = entity.id;
        this.content = entity.content;
        this.link = entity.link;
        this.owner = entity.owner;
        this.status = entity.status;
        this.view_count = entity.view_count;

    }

}