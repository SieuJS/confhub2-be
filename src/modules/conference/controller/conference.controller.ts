import { Body, Controller, Get, HttpStatus, Inject, Post, PreconditionFailedException } from '@nestjs/common';
import {Config, LoggerService} from '../../common';

import {Service} from '../../tokens';

import { ConferencePipe } from '../flow/conference.pipe';
import { ConferenceData, ConferenceInput } from '../model';
import { ConferenceService } from '../service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: ConferenceData })
    public async find(): Promise<ConferenceData[]> {
        return this.conferenceService.find({} as ConferenceData);
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
