import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional  } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { ConferenceModule } from './conference/conference.module';
import { CallForPaperModule } from './call-for-paper/call-for-paper.module';
import { RankSourceModule } from './rank-source/rank-source.module';
import { JournalModule } from './journal/journal.module';

import { PrismaService } from './common';
import { FieldOfResearchModule } from './field-of-research/field-of-research.module';
import { ViewModule } from './view/view.module';
import { PaginateModule } from './paginate/paginate.module';

@Module({
    imports: [
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
        ConferenceModule,
        CallForPaperModule,
        RankSourceModule,
        JournalModule,
        FieldOfResearchModule,
        ViewModule,
        PaginateModule,
    ],
})
export class ApplicationModule {}
