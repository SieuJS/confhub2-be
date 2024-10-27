import { Injectable,Inject } from '@nestjs/common';
import { MongoService } from '../../token';
import { Model } from 'mongoose';
import {Conference, ConferenceData, ConferenceInput} from './model';


@Injectable()
export class ConferenceService {
    constructor (
        @Inject(MongoService.CONFERENCE_TOKEN)
        private readonly conferenceModel: Model<Conference>,
    ){}

    async create(conference: ConferenceInput): Promise<ConferenceData> {
        return await this.conferenceModel.create(conference);
    }

    async findAll(): Promise<ConferenceData[]> {
        return await this.conferenceModel.find();
    }
}
