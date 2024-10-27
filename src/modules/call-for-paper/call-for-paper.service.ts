import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common';
import { CallForPaperData, CallForPaperInput, ImportantDateData, ImportantDateInput } from './model';
import { PaginatorTypes, getPaginatedResult} from '@nodeteam/nestjs-prisma-pagination'; 


@Injectable()
export class CallForPaperService {
    public constructor(
        private readonly prismaService: PrismaService,
    ) {}

    public async find({where , orderBy, page , perPage} : {where? : string , orderBy? :  string, page? : number , perPage? : number}): Promise<PaginatorTypes.PaginatedResult<CallForPaperData>> {
        const callForPapers = await this.prismaService.call_for_papers.findMany({});
        return  getPaginatedResult({
            data : callForPapers.map(callForPaper => new CallForPaperData(callForPaper)),
            pagination :  { page : page || 1, perPage : perPage || 1 , skip : 0},
            count : callForPapers.length 
        });
    }

    public async create(data: CallForPaperInput): Promise<CallForPaperData> {
        const callForPaper = await this.prismaService.call_for_papers.create({
            data: {
                ...data
            }
        });
        return new CallForPaperData(callForPaper);
    }

    public async getCFPImportantdates(cfp_id: string): Promise<ImportantDateData[]> {
        const importantDates = await this.prismaService.important_dates.findMany({
            include: {
                call_for_papers: true
            },
            where: {
                cfp_id
            }
        });
        return importantDates.map(importantDate => new ImportantDateData(importantDate));
    }

    public async addCFPImportantdates(cfp_id: string, data: ImportantDateInput): Promise<ImportantDateData> {
        const importantDate = await this.prismaService.important_dates.create({
            data: {
                ...data,
                cfp_id,
                date_value: (new Date(data.date_value as string)).toISOString()
            }
        });
        return new ImportantDateData(importantDate);
    }
}
