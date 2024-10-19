import { Module } from '@nestjs/common';
import { ConferenceController } from './controller'
import { ConferenceService } from './service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [ConferenceController],
  providers: [ConferenceService],
  exports : [ConferenceService]
})
export class ConferenceModule {}
