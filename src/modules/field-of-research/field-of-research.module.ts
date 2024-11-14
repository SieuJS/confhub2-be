import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FieldOfResearchService } from './service/for.service';
import { FieldOfResearchController } from './controller';

@Module({
    imports: [CommonModule],
    providers: [FieldOfResearchService],
    controllers: [FieldOfResearchController],
    exports: [FieldOfResearchService],
})
export class FieldOfResearchModule {}
