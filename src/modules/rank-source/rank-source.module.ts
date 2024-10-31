import { Module } from '@nestjs/common';
import { RankService, SourceService } from './services';
import { RankController, SourceController } from './controllers';

@Module({
  controllers: [RankController, SourceController],
  providers: [RankService, SourceService]
})
export class RankSourceModule {}
