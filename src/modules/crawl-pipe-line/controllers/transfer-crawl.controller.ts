import { ConferenceAdapterService, ConferenceAdapterData, ConferenceAdapterInput, JobAdapterInput } from "../modules";
import { Controller, HttpStatus , Get, Post, Body} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import {ConferenceService, ConferenceData} from "../../conference"
import { SourceService, RankService } from "../../rank-source";
import { SourceData, SourceInput, SourceRanksInput, SourceRanksData } from "../../rank-source/model";
import { Decimal } from "@prisma/client/runtime/library";
import {Transactional} from "@nestjs-cls/transactional";
import { ConferenceAdapterPipe } from "../pipes/conference-adapter.pipe";

import { JobAdapterService} from "../modules";
class ResponseMessage {
    message : string ;
}

@Controller('/pipe-line/transfer')
export class ConferenceCrawlController {
    constructor(
        private readonly conferenceAdapterService: ConferenceAdapterService,
        private readonly conferenceService: ConferenceService,
        private readonly sourceService: SourceService,
        private readonly rankService: RankService,
        private readonly jobAdapterService : JobAdapterService,
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
        let newConference;
        let newSourceRank;
        let newSource; 
        let newJob ;
        let newConferenceAdapter; 
        let existsSourceRank ;
        let existsSource;
        let existsConferences = await this.conferenceService.findOneWithRankFootprints({
            acronym : input.Acronym, 
            name : input.Title,
        } as ConferenceData);


        if (!existsConferences){
            newConference = await this.conferenceService.create({
                acronym : input.Acronym,
                name : input.Title,
            } as ConferenceData);
        }

        existsSource = await this.sourceService.findOne({
            name : input.Source
        } as SourceData);

        if(!existsSource) {
            newSource = await this.sourceService.create({name : input.Source} as SourceInput) as SourceData;
            existsSource = newSource;
        }
        else {
            existsSourceRank = await this.rankService.findRankOfSource({
                source_id : existsSource.id,
                rank : input.Rank,
            } as SourceRanksData);
        }

        if(!existsSourceRank) {
            newSourceRank = 
            await this.rankService.createRankOfSource(
                {source_id : existsSource.id, rank : input.Rank, value : new Decimal(0) } as SourceRanksInput
            );
        }

        if(newConference || newSourceRank || newSource) {
            newConferenceAdapter = await this.conferenceAdapterService.create(input);
        }

        // if exists confernce , not have source , mode 1 
        // if exists conference, 
        if(newConferenceAdapter) {
            newJob = await this.jobAdapterService.create({
                conf_id : newConferenceAdapter.Id,
                type : 'import conference',
                status : 'pending',
            } as JobAdapterInput);
        }

        if (newJob) {
            return {message : 'Import conference success'};
        }
        return {message : 'Nothing change'};
    }
}

