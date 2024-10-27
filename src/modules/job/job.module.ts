import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { CommonModule } from '../common'
import {JobGateway} from './job.gateway';
@Module({
  imports: [CommonModule],
  providers: [JobService, JobGateway],
  controllers: [JobController]
})
export class JobModule {}
