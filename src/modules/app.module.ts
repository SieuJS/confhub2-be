import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { PassengerModule } from './passenger/passenger.module';
import { ConferenceModule } from './conference/conference.module';

@Module({
    imports: [
        CommonModule,
        PassengerModule,
        ConferenceModule,
    ]
})
export class ApplicationModule {}
