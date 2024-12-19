import { Module } from '@nestjs/common';
import { ViewController } from './controller';
import { ConferenceModule } from '../conference';
import { FieldOfResearchModule } from '../field-of-research/field-of-research.module';

@Module({
    imports: [ConferenceModule, FieldOfResearchModule],
    controllers: [ViewController],
})
export class ViewModule {}
