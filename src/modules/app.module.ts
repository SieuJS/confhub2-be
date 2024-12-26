import { Module } from '@nestjs/common';
import { CommonModule, Config } from './common';

import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional  } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { BullModule } from '@nestjs/bullmq';
import { ConferenceModule } from './conference/conference.module';
import { CallForPaperModule } from './call-for-paper/call-for-paper.module';
import { RankSourceModule } from './rank-source/rank-source.module';
import { JournalModule } from './journal/journal.module';
import { PrismaService } from './common';
import { FieldOfResearchModule } from './field-of-research/field-of-research.module';
import { ViewModule } from './view/view.module';
import { PaginateModule } from './paginate/paginate.module';
import { CrawlApiModule } from './crawl-api/crawl-api.module';
import { JobModule } from './job/job.module';
import { ScraperModule } from './scraper/scraper.module';
import { ConfApiLintModule } from './conf-api-lint/conf-api-lint.module';
import { Service } from './tokens';
import { CrawlBullJobModule } from './crawl-bull-job/crawl-bull-job.module';
import { CrawlJournalModule } from './crawl-journal/crawl-journal.module';
@Module({
    imports: [
        CommonModule,
        ClsModule.forRoot({
            plugins: [
                new ClsPluginTransactional({
                    imports: [
                      // module in which the PrismaClient is provided
                      CommonModule
                    ],
                    adapter: new TransactionalAdapterPrisma({
                        // the injection token of the PrismaClient
                        prismaInjectionToken: PrismaService,
                    }),
                }),
            ],
            global: true,
            middleware: { mount: true },
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client'),
            exclude: ['/api/(.*)'],
        }),
        BullModule.forRootAsync({
            imports : [CommonModule],
            inject : [Service.CONFIG],
            useFactory : async (config : Config) => ({
                connection : {
                    host : config.REDIS_HOST,
                    port : config.REDIS_PORT
                }
            })
        }),
        ConferenceModule,
        CallForPaperModule,
        RankSourceModule,
        JournalModule,
        FieldOfResearchModule,
        ViewModule,
        PaginateModule,
        CrawlApiModule,
        JobModule,
        ScraperModule,
        ConfApiLintModule,
        CrawlBullJobModule,
        CrawlJournalModule,
    ],
})
export class ApplicationModule {}
