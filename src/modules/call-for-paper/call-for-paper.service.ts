
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common';
import { CallForPaperData, CallForPaperInput } from './model';

@Injectable()
export class CallForPaperService {
    public constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async find(): Promise<CallForPaperData[]> {
        const callForPapers = await this.prismaService.call_for_papers.findMany({});

        return callForPapers.map(callForPaper => new CallForPaperData(callForPaper));
    }

    public async create(data: CallForPaperInput): Promise<CallForPaperData> {
        const callForPaper = await this.prismaService.call_for_papers.create({
            data
        });

        return new CallForPaperData(callForPaper);
    }
}
