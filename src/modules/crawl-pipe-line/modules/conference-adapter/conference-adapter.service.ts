import { Injectable,Inject } from '@nestjs/common';
import { MongoService } from '../../token';
import { Model } from 'mongoose';
import {ConferenceAdapter, ConferenceAdapterData, ConferenceAdapterInput} from './model';

@Injectable()
export class ConferenceAdapterService {
    constructor (
        @Inject(MongoService.CONFERENCE_TOKEN)
        private readonly conferenceModel: Model<ConferenceAdapter>,
    ){}

    async create(conference: ConferenceAdapterInput): Promise<ConferenceAdapterData> {
        const conferenceAdapter = await this.conferenceModel.create(conference)
        return new ConferenceAdapterData(conferenceAdapter); ;
    }

    async findAll(): Promise<ConferenceAdapterData[]> {
        return await this.conferenceModel.find();
    }

    async findExists(conference: ConferenceAdapterInput): Promise<ConferenceAdapterData> {
        return await this.conferenceModel.findOne(
            {
                Title : conference.Title
            }
        ) as ConferenceAdapterData; 
    }
    
}
