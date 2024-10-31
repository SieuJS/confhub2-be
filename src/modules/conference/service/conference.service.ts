import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { ConferenceData, ConferenceInput } from '../model';

@Injectable()
export class ConferenceService {
    public constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async find(filter : ConferenceData ): Promise<ConferenceData[]> {
        const conferences = await this.prismaService.conferences.findMany({
            where : {
                ...filter
            }
        });

        return conferences.map(conference => new ConferenceData(conference));
    }

    public async findOne(filter : ConferenceData): Promise<ConferenceData> {
        const conference = await this.prismaService.conferences.findFirst({
            where : {
                ...filter
            }
        });

        return new ConferenceData(conference as ConferenceData);
    }

    public async create(data: ConferenceInput): Promise<ConferenceData> {
        const conference = await this.prismaService.conferences.create({
            data
        });

        return new ConferenceData(conference);
    }
    

}
