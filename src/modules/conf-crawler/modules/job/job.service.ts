import { Body, Inject, Injectable} from '@nestjs/common';
import { Job, JobData, JobInput } from './model';
import { Model } from 'mongoose';
import { MongoService } from '../../token';
@Injectable()
export class JobService {
    constructor (
        @Inject(MongoService.JOB_TOKEN)
        private readonly jobModel: Model<Job>,
    ){};

    async create(@Body() job: JobInput): Promise<JobData> {
        return await this.jobModel.create(job);
    }

    async findAll(): Promise<JobData[]> {
        return await this.jobModel.find();
    }
}
