import { Module } from '@nestjs/common';
import { CommonModule } from '../common';

import { CallForPaperController } from './call-for-paper.controller';
import { CallForPaperService } from './call-for-paper.service';

@Module({
  imports : [CommonModule],
  controllers: [CallForPaperController],
  providers: [CallForPaperService],
  exports : [CallForPaperService]
})
export class CallForPaperModule {}
