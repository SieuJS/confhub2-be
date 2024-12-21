import { Module } from '@nestjs/common';
import { ViewController } from './controller';
import { ConferenceModule } from '../conference';
import { FieldOfResearchModule } from '../field-of-research/field-of-research.module';
import { CallForPaperModule } from '../call-for-paper';
import { ConferenceRenderService } from './service/conference-render.service';
import { RankSourceModule } from '../rank-source';

@Module({
    imports: [ConferenceModule, FieldOfResearchModule, CallForPaperModule, RankSourceModule],
    controllers: [ViewController],
    providers : [ConferenceRenderService]
})
export class ViewModule {}
