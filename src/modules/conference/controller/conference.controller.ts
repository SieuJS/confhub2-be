import { Body, Controller, Get, HttpStatus, Inject, Post, PreconditionFailedException, Query } from '@nestjs/common';
import {  ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Config, LoggerService} from '../../common';

import {Service} from '../../tokens';
import { ConferencePipe } from '../flow/conference.pipe';
import { ConferenceData, ConferenceFilter, ConferenceInput, ConferenceWithCfpsRankFootprintsPaginateData} from '../model';
import { ConferenceService } from '../service';
import { JobService } from '../../job/job.service';
import { CrawlJobInput } from '../../job/model';
import parser from 'any-date-parser';
import { PaginationArgs } from '../../paginate';

@Controller('conference')
@ApiTags('Conference')
export class ConferenceController {
    public constructor (
        @Inject(Service.CONFIG)
        private readonly config: Config,
        private readonly logger: LoggerService,
        private readonly conferenceService: ConferenceService,

        private readonly jobService: JobService
    ){}

    @Get()
    @ApiQuery({name : 'fromDate', type : 'string', required : false})
    @ApiQuery({name : 'toDate', type : 'string', required : false})
    @ApiQuery({name : 'location', type : 'string', required : false})
    @ApiQuery({name : 'name', type : 'string', required : false})
    @ApiQuery({name : 'acronym', type : 'string', required : false})
    @ApiQuery({name : 'source', type : 'string', required : false})
    @ApiQuery({name : 'rank', type : 'string', required : false})
    @ApiResponse({ status: HttpStatus.OK, type : ConferenceWithCfpsRankFootprintsPaginateData })
    public async find(@Query ()filter : ConferenceFilter , @Query() paginationArgs: PaginationArgs )
    : Promise<ConferenceWithCfpsRankFootprintsPaginateData> {
        filter = {
            ...filter , 
            fromDate : filter.fromDate ? parser.fromString(filter.fromDate).toDateString() : null,
            toDate : filter.toDate ? parser.fromString(filter.toDate).toDateString() : null
        }
        return this.conferenceService.find(filter,paginationArgs );
    }

    @Post()
    @ApiOperation({ summary: 'Create conference' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ConferenceData })
    public async create(@Body(ConferencePipe) input: ConferenceInput): Promise<ConferenceData> {
        if (this.config.CONFERENCES_ALLOWED === 'no') {
            throw new PreconditionFailedException('Not allowed to create conferences');
        }

        const conference = await this.conferenceService.create(input);
        this.logger.info(`Created new conference with ID ${conference.id}`);

        return conference;
    }


    @Get('/search')
    @ApiResponse({ status: HttpStatus.OK, type : ConferenceWithCfpsRankFootprintsPaginateData, isArray : true })

    public async search(@Query() filter: ConferenceFilter ) {
        return filter;
    }

    @Get('/update-crawl-conference')
    @ApiResponse({ status: HttpStatus.OK, type : CrawlJobInput })
    public async updateCrawl(@Query('id') id: string) {
        const job = await this.jobService.createJob({
            conference_id : id,
            status : "WAITING PROCESS",
            type : "UPDATE",
            progress_detail : "start",
            progress_percent : 10
        } as CrawlJobInput);

        return {
            message : "Conference created to crawl",
            job_id : job.id
        }
    }

    @Get('/create-conference')
    @ApiResponse({ status: HttpStatus.OK, type : ConferenceData })
    public async createConference(@Query('name') name: string, @Query('acronym') acronym: string) {
        const existsConference = await this.conferenceService.findOrCreate({
            name,
            acronym
        } as ConferenceInput);

        return existsConference;
    }


    @Post('/import')
    @ApiResponse({ status: HttpStatus.OK, type : ConferenceData })
    public async uploadConference(@Body() input: ConferenceInput) {
        const conference = await this.conferenceService.importConferenceFromCoreInput(input);
        if(!conference) {
            throw new PreconditionFailedException('Conference not found');
        }

        return {
            message : "Conference found",
            data : conference
        }
    }
}
