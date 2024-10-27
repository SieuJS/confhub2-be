import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { ConferenceModule } from './conference/conference.module';
import { CallForPaperModule } from './call-for-paper/call-for-paper.module';
import { RankSourceModule } from './rank-source/rank-source.module';
import { JournalModule } from './journal/journal.module';
import { JobModule } from './job/job.module';
import { ConfCrawlerModule } from './conf-crawler/conf-crawler.module';


@Module({
    imports: [
        CommonModule,
        ConferenceModule,
        CallForPaperModule,
        RankSourceModule,
        JournalModule,
        JobModule,
        ConfCrawlerModule,
    ],
})
export class ApplicationModule {}
