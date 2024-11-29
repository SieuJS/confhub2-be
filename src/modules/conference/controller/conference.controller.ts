import { Body, Controller, Get, HttpStatus, Inject, ParseIntPipe, Post, PreconditionFailedException, Query } from '@nestjs/common';
import {Config, LoggerService} from '../../common';
import {Service} from '../../tokens';
import { ConferencePipe } from '../flow/conference.pipe';
import { ConferenceData, ConferenceInput } from '../model';
import { ConferenceService } from '../service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagingResponse } from '../../common';

@Controller('conference')
@ApiTags('Conference')
export class ConferenceController {
    public constructor (
        @Inject(Service.CONFIG)
        private readonly config: Config,
        private readonly logger: LoggerService,
        private readonly conferenceService: ConferenceService 
    ){}

    @Get()
    @ApiOperation({ summary: 'Find conferences' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: PagingResponse<ConferenceData> })
    public async find(
        @Query('page', ParseIntPipe) page: number,
        @Query('size', ParseIntPipe) pageSize: number,
        @Body() filterCondition: ConferenceData
    ): Promise<PagingResponse<ConferenceData>> {
        const offset = (page - 1) * pageSize;
        const { total, conference } = await this.conferenceService.getTotalAndConference(offset, pageSize, filterCondition);
        return {
            maxRecords: total,
            maxPages: Math.ceil(total / pageSize),
            size: pageSize,
            currentPage: page,
            count: conference.length,
            data: conference
        };
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
}
