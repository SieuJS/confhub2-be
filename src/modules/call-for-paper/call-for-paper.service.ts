/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';
import { PrismaService } from '../common';
import {
    CallForPaperData,
    CallForPaperInput,
    ImportantDateData,
    ImportantDateInput,
} from './model';

import { DetailedCfpData } from './model';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

/**
 * Parameters for searching call-for-paper entries.
 */
interface CallForPaperSearchParams {
    where?: CallForPaperInput;
    orderBy?: {
        key?: 'asc' | 'desc';
    };
    page?: number;
    perPage?: number;
}

@Injectable()
export class CallForPaperService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
    ) {}

    public async find(filter: CallForPaperData): Promise<CallForPaperData[]> {
        const callForPapers = await this.prismaService.call_for_papers.findMany(
            {
                where: {
                    ...filter,
                },
            }
        );

        return callForPapers as CallForPaperData[];
    }

    public async getCallForPapers({
        where,
        orderBy,
        page,
        perPage,
    }: CallForPaperSearchParams): Promise<
        PaginatorTypes.PaginatedResult<CallForPaperData>
    > {
        return paginate(
            this.prismaService.call_for_papers,
            {
                where,
                orderBy,
            },
            {
                page,
                perPage,
            }
        );
    }

    public async getDetailedCallForPapers({
        where,
        orderBy,
        page,
        perPage,
    }: {
        where?: CallForPaperInput;
        orderBy?: { [key: string]: 'asc' | 'desc' };
        page?: number;
        perPage?: number;
    }): Promise<PaginatorTypes.PaginatedResult<DetailedCfpData>> {
        return paginate(
            this.prismaService.call_for_papers,
            {
                where,
                orderBy,
                include: {
                    important_dates: true,
                    rank_of_cfp: true,
                    conferences: true,
                },
            },
            {
                page,
                perPage,
            }
        );
    }

    public async create(data: CallForPaperInput): Promise<CallForPaperData> {
        const callForPaper = await this.txHost.tx.call_for_papers.create({
            data: {
                ...data,
            },
        });
        return new CallForPaperData(callForPaper);
    }

    public async getCFPImportantdates(
        cfp_id: string
    ): Promise<ImportantDateData[]> {
        const importantDates =
            await this.prismaService.important_dates.findMany({
                where: {
                    cfp_id,
                },
            });
        return importantDates
        ;
    }

    public async createCFPImportantdates(
        data: ImportantDateInput
    ): Promise<ImportantDateData> {
        const importantDate = await this.prismaService.important_dates.create({
            data: {
                ...data,
                date_value: data.date_value,
            },
        });
        return new ImportantDateData(importantDate);
    }

    public async removeImportantDate(cfpId: string): Promise<void> {
        await this.prismaService.important_dates.deleteMany({
            where: {
                cfp_id: cfpId,
            },
        });
    }
    
    public async getMainCfp(
        conference_id: string
    ): Promise<CallForPaperData | null> {
        const cfp = await this.prismaService.call_for_papers.findFirst({
            where: {
                conference_id,
                status: true,
            },
        });
        return cfp ? new CallForPaperData(cfp) : null;
    }

    public async updateCfp (
        id: string,
        data: CallForPaperInput
    ): Promise<CallForPaperData> {
        const cfp = await this.prismaService.call_for_papers.update({
            where: {
                id,
            },
            data: {
                ...data,
            },
        });
        return new CallForPaperData(cfp);
    }
}
