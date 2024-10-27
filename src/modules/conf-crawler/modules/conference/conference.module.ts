import { Module } from '@nestjs/common';
import { ConferenceService } from './conference.service';
import { ConferenceProviders } from './conference.providers';
import { MongodbModule } from '../mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  providers: [ ...ConferenceProviders,ConferenceService,],
  exports : [...ConferenceProviders, ConferenceService],
})
export class ConferenceModule {}
