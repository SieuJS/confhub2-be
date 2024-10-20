import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { ConferenceModule } from './conference/conference.module';
import { CallForPaperModule } from './call-for-paper/call-for-paper.module';
import { RankSourceModule } from './rank-source/rank-source.module';

@Module({
    imports: [
        CommonModule,
        ConferenceModule,
        CallForPaperModule,
        RankSourceModule,
    ],
})
export class ApplicationModule {}
