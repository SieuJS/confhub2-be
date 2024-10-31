import { Injectable } from '@nestjs/common';
import {  ConferenceAdapterService, ConferenceAdapterData, ConferenceAdapterInput } from '../modules';


@Injectable() 
export class CrawlConferenceService {
    constructor (
        private readonly conferenceAdapterService: ConferenceAdapterService,
    ){

    }
    async transferCrawl(conferenceAdapterInput : ConferenceAdapterInput) : Promise<ConferenceAdapterData> {
        return await this.conferenceAdapterService.create(conferenceAdapterInput);
    }

}
