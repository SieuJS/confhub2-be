import { Module } from "@nestjs/common";
import { CommonModule } from "../common";
import { JobCrawlController, TransferCrawlController, RetrieverCrawlController } from "./controllers";
import { RankSourceModule } from "../rank-source";
import {ScheduleModule} from '@nestjs/schedule'
import {  CrawlConferenceService, JobScheduleService } from "./services";
import { ConferenceModule } from "../conference";
import { JobAdapterModule,MongodbModule, ConferenceAdapterModule } from "./modules";
import { CallForPaperModule } from "../call-for-paper";
import { FieldOfResearchModule } from "../field-of-research/field-of-research.module";
@Module({
    imports: [
        CommonModule,
        MongodbModule,
        JobAdapterModule,
        ConferenceAdapterModule,
        RankSourceModule,
        ConferenceModule,
        CallForPaperModule,
        FieldOfResearchModule,
        ScheduleModule.forRoot()
    ],
    providers: [ CrawlConferenceService, JobScheduleService],
    controllers: [ JobCrawlController, RetrieverCrawlController, TransferCrawlController],
})
export class CrawlPipeLineModule {}
