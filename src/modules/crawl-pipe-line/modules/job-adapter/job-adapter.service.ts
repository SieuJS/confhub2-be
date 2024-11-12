import { Body, Inject, Injectable} from '@nestjs/common';
import { JobAdapter, JobAdapterData, JobAdapterInput } from './model';
import { Model } from 'mongoose';
import { MongoService } from '../../token';

@Injectable()
export class JobAdapterService {
    constructor (
        @Inject(MongoService.JOB_TOKEN)
        private readonly jobModel: Model<JobAdapter>,
    ){};

    async create(@Body() job: JobAdapterInput): Promise<JobAdapterData> {
        return await this.jobModel.create(job);
    }

    async findAll(): Promise<JobAdapterData[]> {
        return await this.jobModel.find();
    }

    async getTotalJobsAndJobs(offset:number, size:number): Promise<{total: number, jobs: JobAdapterData[]}> {
        const total = await this.jobModel.countDocuments();
        const jobs = await this.jobModel.find().skip(offset).limit(size);
        return {total, jobs};
    }
}
