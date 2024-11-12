import { Module } from '@nestjs/common';
import { ConferenceAdapterService } from './conference-adapter.service';
import { ConferenceAdapterProviders } from './conference-adapter.providers';
import { MongodbModule } from '../mongodb/mongodb.module';
import { CommonModule } from '../../../common';
@Module({
  imports: [MongodbModule, CommonModule],
  providers: [ ...ConferenceAdapterProviders,ConferenceAdapterService,],
  exports : [...ConferenceAdapterProviders, ConferenceAdapterService],
})
export class ConferenceAdapterModule {}
