import { Module } from "@nestjs/common";
import { CommonModule } from "../common";
import { JobController, ConferenceController } from "./controllers";
import {ScheduleModule} from '@nestjs/schedule'
import { JobScheduleService } from "./services";

import { JobModule,MongodbModule, ConferenceModule } from "./modules";

@Module({
    imports: [
        CommonModule,
        MongodbModule,
        JobModule,
        ConferenceModule,
        ScheduleModule.forRoot()
    ],
    providers: [JobScheduleService],
    controllers: [ JobController, ConferenceController],
})
export class ConfCrawlerModule {}
