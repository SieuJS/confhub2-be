import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { ConferenceModule } from './conference/conference.module';

@Module({
    imports: [
        CommonModule,
        ConferenceModule,
    ]
})
export class ApplicationModule {}
