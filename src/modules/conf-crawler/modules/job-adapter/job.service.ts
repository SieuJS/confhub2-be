import { Body, Inject, Injectable} from '@nestjs/common';
import { JobAdapter, JobAdapterData, JobInput } from './model';
import { Model } from 'mongoose';
import { MongoService } from '../../token';
@Injectable()
export class JobService {
    constructor (
        @Inject(MongoService.JOB_TOKEN)
        private readonly jobModel: Model<JobAdapter>,
    ){};

    async create(@Body() job: JobInput): Promise<JobAdapterData> {
        return await this.jobModel.create(job);
    }

    async findAll(): Promise<JobAdapterData[]> {
        return await this.jobModel.find();
    }
}
