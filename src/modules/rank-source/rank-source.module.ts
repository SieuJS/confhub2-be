import { Module } from '@nestjs/common';
import { RankService, SourceService } from './services';
import { RankController, SourceController } from './controllers';
import { CommonModule } from '../common';
@Module({
  imports: [CommonModule],
  controllers: [RankController, SourceController],
  providers: [RankService, SourceService],
  exports: [RankService, SourceService],
})
export class RankSourceModule {}
