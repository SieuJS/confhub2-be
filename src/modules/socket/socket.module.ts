import { Module } from '@nestjs/common';
import { ConferenceModule } from '../conference';
import { CallForPaperModule } from '../call-for-paper';
import { JobModule } from '../job';
import { CrawlApiModule } from '../crawl-api';
import { SocketGateway } from './socket.gateway';
import { CommonModule } from '../common';
import { JobWatcherService } from './service/job-watcher.service';

@Module({
    imports : [CommonModule,ConferenceModule, CallForPaperModule, JobModule, CrawlApiModule], 
    controllers: [],
    providers: [SocketGateway, JobWatcherService],
})
export class SocketModule {}
