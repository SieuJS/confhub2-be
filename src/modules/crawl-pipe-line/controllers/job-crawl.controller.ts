import { Controller, Get, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobAdapterData , JobAdapterInput, JobAdapterService} from '../modules';
import { PagingResponse } from '../../common';
import { number } from 'joi';

@Controller('conf-crawler/job')
@ApiTags('Crawl Pipeline')
export class JobCrawlController {
    constructor(    
        private readonly jobService: JobAdapterService
    ) {}
    @Get()
    @ApiOperation({ summary: 'Get all jobs' })
    @ApiQuery({name: 'page', required: false, type: number})
    @ApiResponse({status : HttpStatus.OK, isArray: true, type: PagingResponse<JobAdapterData>})
    async findAll(@Query('page',ParseIntPipe) page:number, @Query('size',ParseIntPipe) size:number): Promise<PagingResponse<JobAdapterData>> {
        const offset = (page - 1) * size;
        const {total, jobs} = await this.jobService.getTotalJobsAndJobs(offset, size);

        return {
            maxRecords: total,
            maxPages: Math.ceil(total / size),
            size: size,
            currentPage: page,
            count: jobs.length,
            data: jobs
        };
    }
    @Post()
    @ApiOperation({ summary: 'Create job' })
    @ApiResponse({status : HttpStatus.CREATED, type: JobAdapterData})

    async create(input: JobAdapterInput): Promise<JobAdapterData> {
        return await this.jobService.create(input);
    }
}
