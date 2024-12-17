import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { SourceData, SourceInput } from '../model';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class SourceService{
    public constructor (
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
    ) {}

    async find(filter: SourceData): Promise<SourceData[]> {
        const sources = await this.prismaService.sources.findMany({
            where: filter
        });
        return sources.map(source => new SourceData(source));
    }

    async findOne(filter: SourceData): Promise<SourceData> {
        const source = await this.prismaService.sources.findFirst({
            where: filter
        });
        return source as SourceData;
    }

    async create(data: SourceInput): Promise<SourceData> {
        
        return this.txHost.tx.sources.create({data});

    }

    async findOrCreate(data: SourceInput): Promise<SourceData> {
        return this.txHost.tx.sources.upsert({
            where: {
                name : data.name as string
            },
            update: {},
            create: data
        });
    }
}