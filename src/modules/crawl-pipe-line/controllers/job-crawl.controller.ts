import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobAdapterData , JobAdapterInput, JobAdapterService} from '../modules';

@Controller('conf-crawler/job')
@ApiTags('Crawl Pipeline')
export class JobCrawlController {
    constructor(    
        private readonly jobService: JobAdapterService
    ) {}
    @Get()
    @ApiOperation({ summary: 'Get all jobs' })
    @ApiResponse({status : HttpStatus.OK, isArray: true, type: JobAdapterData})
    async findAll() {
        return await this.jobService.findAll();
    }
    @Post()
    @ApiOperation({ summary: 'Create job' })
    @ApiResponse({status : HttpStatus.CREATED, type: JobAdapterData})

    async create(input: JobAdapterInput): Promise<JobAdapterData> {
        return await this.jobService.create(input);
    }
}
