import { ApiProperty } from "@nestjs/swagger";
import { journals } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class JournalData {
    @ApiProperty({ description: "Journal unique ID", example: "75442486-0878-440c-9db1-a7006c25a39f" })
    public id : string ;

    @ApiProperty({description: "Journal name", example: "Journal of Computer Science"})
    public name : string | null;

    @ApiProperty ({description: "Journal country", example: "Indonesia"})
    public country : string | null;

    @ApiProperty ({description : "h_index", example: 10})
    public h_index : Decimal | null;

    @ApiProperty ({description : "publisher", example: "IEEE"})
    public publisher : string | null;

    @ApiProperty ({description : "Web home page of journal", example: "https://www.journal.com"})
    public home_page : string | null;

    @ApiProperty ({description : "ISSN", example: "1234-5678"})
    public issn : string | null;

    @ApiProperty ({description : "Scope of journal", example: "Computer Science"})
    public scope : string | null; 

    @ApiProperty({description : "email submission", example : "acm@student.com"})
    public email_submission : string | null;

    constructor (entity: journals) {
        this.id = entity.id;
        this.name = entity.name;
        this.country = entity.country;
        this.h_index = entity.h_index ;
        this.publisher = entity.publisher;
        this.home_page = entity.home_page;
        this.issn = entity.issn;
        this.scope = entity.scope;
        this.email_submission = entity.email_submission
    }
}