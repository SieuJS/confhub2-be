import { Module } from '@nestjs/common';
import { ConferenceAdapterService } from './conference-adapter.service';
import { ConferenceAdapterProviders } from './conference-adapter.providers';
import { MongodbModule } from '../mongodb/mongodb.module';

@Module({
  imports: [MongodbModule],
  providers: [ ...ConferenceAdapterProviders,ConferenceAdapterService,],
  exports : [...ConferenceAdapterProviders, ConferenceAdapterService],
})
export class ConferenceModule {}
