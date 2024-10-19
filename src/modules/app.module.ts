import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { ConferenceModule } from './conference/conference.module';
import { CallForPaperModule } from './call-for-paper/call-for-paper.module';

@Module({
    imports: [
        CommonModule,
        ConferenceModule,
        CallForPaperModule,
    ],
})
export class ApplicationModule {}
