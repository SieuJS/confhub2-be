import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { CommonModule } from '../common'




@Module({
  imports: [CommonModule ],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
