import { ConferenceAdapterService, ConferenceAdapterData, ConferenceAdapterInput, JobAdapterInput, JobAdapterData } from "../modules";
import { Controller, HttpStatus , Get, Post, Body} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {ConferenceService, ConferenceData, ConferenceRankFootPrintsInput} from "../../conference"
import { SourceService, RankService } from "../../rank-source";
import { SourceData, SourceInput, SourceRanksInput, SourceRanksData } from "../../rank-source/model";
import { Decimal } from "@prisma/client/runtime/library";
import {Transactional} from "@nestjs-cls/transactional";
import { ConferenceAdapterPipe } from "../pipes/conference-adapter.pipe";

import { JobAdapterService} from "../modules";
import { ConferenceRankFootPrintsService } from "../../conference/service/conference-rank-footprints.service";
class ResponseMessage {
    constructor (
        public message : string,
        public newMongoInstance : boolean = false,
        public crawlJob : string = '',
        public newPgInstance : boolean = false,
    ){}
}

@Controller('/pipe-line/transfer')
@ApiTags('Crawl Pipeline')
export class ConferenceCrawlController {
    constructor(
        private readonly conferenceAdapterService: ConferenceAdapterService,
        private readonly conferenceService: ConferenceService,
        private readonly sourceService: SourceService,
        private readonly rankService: RankService,
        private readonly jobAdapterService : JobAdapterService,
        private readonly conferenceRankFootPrintService : ConferenceRankFootPrintsService,
    ){}

    @Get()
    @ApiOperation({ summary: 'Find conferences' })
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: ConferenceAdapterData })
    public async findAll(): Promise<ConferenceAdapterData[]> {
        return this.conferenceAdapterService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Create conference' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ConferenceAdapterData })
    public async create(@Body() input: ConferenceAdapterInput): Promise<ConferenceAdapterData> {
        return this.conferenceAdapterService.create(input);
    }

    @Post('/import')
    @Transactional()
    @ApiOperation({ summary: 'Import conference for job work' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMessage })
    public async importConference(@Body(ConferenceAdapterPipe) input :ConferenceAdapterInput ): Promise<{message : string}> {
        // check for exists conference in the database;
        

        return {message : 'Nothing change'};
    }
}

