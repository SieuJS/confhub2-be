import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, PreconditionFailedException, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Config, LoggerService} from '../../common';
import {Service} from '../../tokens';
import { SourceService, RankService } from '../../rank-source';
import { CallForPaperInput, CallForPaperService } from '../../call-for-paper';
import { FieldOfResearchService } from '../../field-of-research/service';
import { ConferencePipe } from '../flow/conference.pipe';
import { ConferenceData, ConferenceInput, ConferenceWithCfpsRankFootprintsPaginateData} from '../model';
import { CrawlApiPipelineService } from '../../crawl-api';
import { ConferenceService } from '../service';
import { ConferenceCrawlData, ConferenceCrawlInput } from '../../crawl-api/model';
import { ConferenceRankFootPrintsService } from '../service';
import { CallForPaperData } from '../../call-for-paper';
import { splitDateRange } from '../../../utils';



@Controller('conference')
@ApiTags('Conference')
export class ConferenceController {
    public constructor (
        @Inject(Service.CONFIG)
        private readonly config: Config,
        private readonly logger: LoggerService,
        private readonly conferenceService: ConferenceService,
        private readonly crawlApiPipelineService: CrawlApiPipelineService,
        private readonly sourceService: SourceService,
        private readonly rankService: RankService,
        private readonly callForPaperService: CallForPaperService,
        private readonly fieldOfResearchService: FieldOfResearchService,
        private readonly conferenceRankFootPrintService: ConferenceRankFootPrintsService
    ){}

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type : ConferenceWithCfpsRankFootprintsPaginateData })
    public async find(@Query () {
        where , orderBy, pagination
    } : {
        where?: ConferenceData;
        orderBy?: { [key: string]: 'asc' | 'desc' };
        pagination?: { page: number; perPage: number };
    }): Promise<ConferenceWithCfpsRankFootprintsPaginateData> {
        return this.conferenceService.find({where, orderBy, pagination} );
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

    @Post('/to-crawl')
    @ApiOperation({ summary: 'Create conference to crawl' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ConferenceData })
    @ApiBody({type : ConferenceInput})
    public async createToCrawl(@Body() inputs: ConferenceInput): Promise<any> {
        const toSendData: ConferenceCrawlInput = {
            Title: inputs.name as string,
            Acronym: inputs.acronym as string
        };
        const existsConference = await this.conferenceService.findOrCreate({
            name: inputs.name,
            acronym: inputs.acronym,
        } as ConferenceInput);
        const existsSource = await this.sourceService.findOrCreate({
            name: inputs.source,
            link: '',
        });
        const existsRank = await this.rankService.createOrFindRankOfSource({
            source_id: existsSource.id,
            rank: inputs.rank,
            value: 0 as any,
        });

        inputs.fieldOfResearches.split(',').forEach(async (field) => {
            if(field === '') return;
            const newField = `${field}`.trim();
            const existForGroup = await this.fieldOfResearchService.findOrCreateGroup({
            code: newField,
            name: 'unknown'
            });

            await this.conferenceRankFootPrintService.findOrCreate({
            conference_id: existsConference.data.id,
            rank_id: existsRank.id,
            year: (parseInt(inputs.source.slice(-4), 10)) as any,
            for_id: existForGroup.id
            });
        });

        const existsCfp = await this.callForPaperService.find({
            conference_id: existsConference.data.id,
            status: true
        } as CallForPaperData);

        if (existsCfp.length !== 0) {
            throw new HttpException( 'Conference already has CFP', HttpStatus.BAD_REQUEST);
        }

        const responseData: ConferenceCrawlData = (await this.crawlApiPipelineService.transferToCrawlApi([toSendData]))[0];
        try {
        const {startDate , endDate} = splitDateRange(responseData['Conference dates']);

        const newCfp = await this.callForPaperService.create(
            {
                conference_id: existsConference.data.id as string,
                access_type: responseData.Type,
                start_date: new Date(startDate),
                end_date: new Date(endDate),
                status: true,
                link : responseData.Link ,
                location : responseData.Location, 
                content : responseData.Information,
            }  as CallForPaperInput);
            return newCfp;

        } catch (error) {
            throw new HttpException( 'Error when create CFP', HttpStatus.BAD_REQUEST);
        }
    }
}
