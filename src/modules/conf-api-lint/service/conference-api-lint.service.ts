import { Injectable } from '@nestjs/common';
import { ConferenceApiLintAttributes } from '../model/conference-api-lint.data';
import { PrismaService } from '../../common';

@Injectable()
export class ConferenceApiLintService { 
    constructor(
        private readonly prismaService : PrismaService
    ) {
        
    }
    async getConferenceData(searchParams : ConferenceApiLintAttributes) {
        console.log(searchParams);
        
    }
}