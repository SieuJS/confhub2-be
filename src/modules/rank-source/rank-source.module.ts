import { Module } from '@nestjs/common';
import { RankSourceController } from './rank-source.controller';
import { RankSourceService } from './rank-source.service';

@Module({
  controllers: [RankSourceController],
  providers: [RankSourceService]
})
export class RankSourceModule {}
