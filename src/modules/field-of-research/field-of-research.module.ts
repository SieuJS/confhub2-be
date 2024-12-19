import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FieldOfResearchService } from './service/field-of-research.service';
import { FieldOfResearchController } from './controller';

@Module({
    imports: [CommonModule],
    providers: [FieldOfResearchService],
    controllers: [FieldOfResearchController],
    exports: [FieldOfResearchService],
})
export class FieldOfResearchModule {}
