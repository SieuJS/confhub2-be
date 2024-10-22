import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common';
import { JournalData, JournalInput } from './model';

@Injectable()
export class JournalService {
    public constructor (
        private readonly prismaService: PrismaService,
    ){

    }

    public async find(): Promise<JournalData[]> {
        const journals = await this.prismaService.journals.findMany({});
        return journals.map(journal => new JournalData(journal));
    }

    public async create (data: JournalInput): Promise<JournalData> {
        const journal = await this.prismaService.journals.create({
            data: {
                ...data
            }
        });
        return new JournalData(journal);
    }
}