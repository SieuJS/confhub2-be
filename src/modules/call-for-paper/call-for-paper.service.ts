
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common';
import { CallForPaperData, CallForPaperInput , ImportantDateData } from './model';

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
            data : {
                ...data
            }
        });

        return new CallForPaperData(callForPaper);
    }
    public async getCFPImportantdates(cfp_id : string): Promise<ImportantDateData[]> {
        const importantDates = await this.prismaService.important_dates.findMany({
            include : {
                call_for_papers : true
            },
            where : {
                cfp_id
            }
        });
        return importantDates.map(importantDate => new ImportantDateData(importantDate));
    }
    public async addCFPImportantdates(cfp_id : string, data: ImportantDateData): Promise<ImportantDateData> {
        const importantDate = await this.prismaService.important_dates.create({
            data : {
                ...data,
                cfp_id,
                date_value : (new Date(data.date_value as string)).toISOString()
            }
        });
        return new ImportantDateData(importantDate);
    } 
}
