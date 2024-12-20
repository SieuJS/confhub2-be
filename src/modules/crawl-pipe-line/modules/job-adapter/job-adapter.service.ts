import {Inject, Injectable} from '@nestjs/common';
import { JobAdapter, JobAdapterData, JobAdapterInput } from './model';
import { Model } from 'mongoose';
import { MongoService } from '../../token';

@Injectable()
export class JobAdapterService {
    constructor (
        @Inject(MongoService.JOB_TOKEN)
        private readonly jobModel: Model<JobAdapter>,
    ){};

    async create( job: JobAdapterInput): Promise<JobAdapterData> {
        return new JobAdapterData(await this.jobModel.create(job)) ;
    }

    async findAll(): Promise<JobAdapterData[]> {
        return await this.jobModel.find();
    }
}
