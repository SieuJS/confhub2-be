import { Module } from '@nestjs/common';
import { ConferenceController } from './controller'
import { ConferenceService, ConferenceRankFootPrintsService } from './service';
import { CommonModule } from '../common';


@Module({
  imports: [CommonModule],
  controllers: [ConferenceController],
  providers: [ConferenceService , ConferenceRankFootPrintsService],
  exports : [ConferenceService, ConferenceRankFootPrintsService]
})
export class ConferenceModule {}
