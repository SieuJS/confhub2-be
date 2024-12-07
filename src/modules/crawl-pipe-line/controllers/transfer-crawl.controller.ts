/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line max-classes-per-file
import { Controller, HttpStatus , Get, Post, Body} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Transactional} from '@nestjs-cls/transactional';

import { Decimal } from '@prisma/client/runtime/library';

import { CallForPaperData, CallForPaperService } from '../../call-for-paper';
import { ConferenceRankFootPrintsService, ConferenceService } from '../../conference';
import { FieldOfResearchService } from '../../field-of-research/service';
import {  RankService, SourceService } from '../../rank-source';
import { ConferenceAdapterService, ConferenceAdapterData, ConferenceAdapterInput, JobAdapterData } from '../modules';

import { JobAdapterService } from '../modules';
import { ConferenceAdapterPipe } from '../pipes/conference-adapter.pipe';

class ResponseMessage {
    public constructor (
        public message : string,
        public newMongoInstance : boolean = false,
        public crawlJob : string = '',
        public newPgInstance : boolean = false,

    ){}
}

@Controller('/pipe-line/transfer')
@ApiTags('Crawl Pipeline')
export class TransferCrawlController {
    public constructor(
        private readonly conferenceAdapterService: ConferenceAdapterService,
        private readonly conferenceService : ConferenceService,
        private readonly rankService : RankService,
        private readonly sourceService : SourceService,
        private readonly fieldOfReasearchService : FieldOfResearchService,
        private readonly conferenceRankFootPrintService : ConferenceRankFootPrintsService,
        private readonly callForPaperService : CallForPaperService,
        private readonly jobAdapterService : JobAdapterService
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
    @ApiOperation({ summary: 'Import conference for job work' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMessage })
    @Transactional()
    public async importConference(@Body(ConferenceAdapterPipe) input :ConferenceAdapterInput ): Promise<ResponseMessage> {
        // check for exists conference in the database;
        const existsConference = await this.conferenceService.findOrCreate({
            name : input.Title ,
            acronym : input.Acronym,
        });
        const existsSource = await this.sourceService.findOrCreate({
            name : input.Source,
            link : '',
        });
        const existsRank = await this.rankService.createOrFindRankOfSource({
            source_id : existsSource.id,
            rank : input.Rank,
            value :  new Decimal(0),
        });

        input.PrimaryFoR.forEach(async (field ) => {
            const newField = `${field}`.trim();
            const existForGroup = await this.fieldOfReasearchService.findOrCreateGroup({
                code: newField,
                name: 'unknown'
            });


            await this.conferenceRankFootPrintService.findOrCreate({
                conference_id: existsConference.data.id,
                rank_id: existsRank.id,
                year: new Decimal(parseInt(input.Source.slice(-4), 10)),
                for_id: existForGroup.id
            });
        });

        const existsCfp = await this.callForPaperService.find({
            conference_id : existsConference.data.id,
            status : true

        } as CallForPaperData) ;


        if (existsCfp.length !== 0) {
            return {message : 'Nothing change'} as ResponseMessage;
        }

        await this.callForPaperService.create({
            conference_id : existsConference.data.id,
            status : true
        } as CallForPaperData);


        const conferenceAdapter = await this.conferenceAdapterService.create(input);

        const job = await this.jobAdapterService.create({
            conf_id : conferenceAdapter._id,
            type : 'import conference',
            status : 'pending'
        } as JobAdapterData);

        return{
            message : 'Mode 2.0',
            newMongoInstance : true,
            crawlJob : job._id,
            newPgInstance : false
        };
    }
}

