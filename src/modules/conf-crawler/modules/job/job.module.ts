import { Module } from "@nestjs/common";
import { JobService } from "./job.service";
import { MongodbModule } from "../mongodb/mongodb.module";
import { JobProviders } from "./job.provider";


@Module({
    imports: [MongodbModule],
    providers: [ ...JobProviders, JobService],
    exports: [...JobProviders, JobService]
})
export class JobModule {}
