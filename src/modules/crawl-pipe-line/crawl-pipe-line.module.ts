import { Module } from "@nestjs/common";
import { CommonModule } from "../common";
import { JobCrawlController, ConferenceCrawlController } from "./controllers";
import { RankSourceModule } from "../rank-source";
import {ScheduleModule} from '@nestjs/schedule'
import { JobScheduleService, CrawlConferenceService } from "./services";
import { ConferenceModule } from "../conference";
import { JobAdapterModule,MongodbModule, ConferenceAdapterModule } from "./modules";

@Module({
    imports: [
        CommonModule,
        MongodbModule,
        JobAdapterModule,
        ConferenceAdapterModule,
        RankSourceModule,
        ConferenceModule,
        ScheduleModule.forRoot()
    ],
    providers: [JobScheduleService, CrawlConferenceService],
    controllers: [ JobCrawlController, ConferenceCrawlController],
})
export class CrawlPipeLineModule {}
