import { ApiProperty } from "@nestjs/swagger";
import { call_for_papers as CallForPaper } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class CallForPaperData {
    public static readonly DESCRIPTION_LENGTH = 1000;
    @ApiProperty ({description: "Call for paper unique ID", example: "75442486-0878-440c-9db1-a7006c25a39f"})
    public readonly id : string;
    
    @ApiProperty({description: "Call for paper content", example: "This is call for paper"})
    public readonly content : string | null;

    @ApiProperty ({description : "Conference belong to", example: "75442486-0878-440c-9db1-a7006c25a39f"})
    public readonly conference_id : string | null;

    @ApiProperty ({description : "Link of call for paper", example: "https://cita.vku.udn.vn/"})
    public readonly link : string | null;

    @ApiProperty ({description : "Owner of call for paper", example: "John"})
    public readonly owner : string | null;

    @ApiProperty ({description : "Status of call for paper", example: "true" as string})
    public readonly status : boolean | null;

    @ApiProperty ({description : "Total view on this call for paper", example: "100"})
    public readonly view_count : Decimal | null;

    @ApiProperty ({description : "Start date of call for paper", example: "2022-01-01"})
    public readonly start_date : Date | null;

    @ApiProperty ({description : "End date of call for paper", example: "2022-01-01"})
    public readonly end_date : Date | null;

    @ApiProperty ({description : "country of call for paper", example: "London" as string})
    public readonly country : string | null;

    @ApiProperty ({description : "avergae rating of call for paper", example: "4.5"})
    public readonly avg_rating : number | null;

    @ApiProperty ({description : "Acess type of call for paper ", example: "online" as string})
    public readonly access_type : string | null;

    @ApiProperty ({description : "Location of call for paper", example: "London" as string})
    public readonly location : string | null;


    public constructor(entity: CallForPaper) {
        this.id = entity.id;
        this.conference_id = entity.conference_id;
        this.content = entity.content;
        this.link = entity.link;
        this.owner = entity.owner;
        this.status = entity.status;
        this.view_count = entity.view_count;
        this.start_date = entity.start_date;
        this.end_date = entity.end_date;
        this.country = entity.country;
        this.avg_rating = entity.avg_rating;
        this.access_type = entity.access_type;
        this.location = entity.location
        this.status = entity.status;
    }

}