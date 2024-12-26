import { Body, Controller, Post } from "@nestjs/common";
import { CrawlConferenceService } from "../service/crawl-conference.service";
import { ConferenceCrawlInput } from "../../crawl-api/model";
import { ApiBody, ApiProperty } from "@nestjs/swagger";


class ConferenceBodyInput {
    @ApiProperty()
    Title : string ;
    @ApiProperty()
    Acronym : string ;
}

@Controller('bull-conf')
export class CrawlConferenceController {
    constructor(
        private readonly crawlConferenceService: CrawlConferenceService,
    ) {

    }

    @Post('upload')
    @ApiBody({type : ConferenceBodyInput})
    async uploadConference(
        @Body() input : ConferenceCrawlInput
    ) {
        return this.crawlConferenceService.uploadConference(input);
    }



}