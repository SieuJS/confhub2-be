import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { SourceData } from '../model';

@Injectable()
export class SourceService{
    public constructor (
        private readonly prismaService: PrismaService,
    ) {}

    async find(filter: SourceData): Promise<SourceData[]> {
        const sources = await this.prismaService.sources.findMany({
            where: filter
        });
        return sources.map(source => new SourceData(source));
    }

    async create(data: SourceData): Promise<SourceData> {
        const source = await this.prismaService.sources.create({
            data
        });

        return new SourceData(source);
    }
}