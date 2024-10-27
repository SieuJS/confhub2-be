import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {JobService, JobData, JobInput} from '../modules';

@Controller('conf-crawler/job')
export class JobController {
    constructor(    
        private readonly jobService: JobService
    ) {}
    @Get()
    @ApiOperation({ summary: 'Get all jobs' })
    @ApiResponse({status : HttpStatus.OK, isArray: true, type: JobData})
    async findAll() {
        return await this.jobService.findAll();
    }
    @Post()
    @ApiOperation({ summary: 'Create job' })
    @ApiResponse({status : HttpStatus.CREATED, type: JobData})

    async create(input: JobInput): Promise<JobData> {
        return await this.jobService.create(input);
    }
}
