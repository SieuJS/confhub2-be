import { Module } from '@nestjs/common';
import { ConferenceController } from './controller'
import { ConferenceService, ConferenceRankFootPrintsService } from './service';
import { CommonModule } from '../common';
import { CrawlApiModule } from '../crawl-api/crawl-api.module';
import { RankSourceModule } from '../rank-source';
import { CallForPaperModule } from '../call-for-paper';
import { FieldOfResearchModule } from '../field-of-research/field-of-research.module';
@Module({
  imports: [CommonModule, CrawlApiModule, RankSourceModule, CallForPaperModule, FieldOfResearchModule],
  controllers: [ConferenceController],
  providers: [ConferenceService , ConferenceRankFootPrintsService],
  exports : [ConferenceService, ConferenceRankFootPrintsService]
})
export class ConferenceModule {}
