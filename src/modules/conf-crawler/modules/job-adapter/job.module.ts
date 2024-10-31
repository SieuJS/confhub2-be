import { Module } from "@nestjs/common";
import { JobService } from "./job.service";
import { MongodbModule } from "../mongodb/mongodb.module";
import { JobAdapterProviders } from "./job.provider";


@Module({
    imports: [MongodbModule],
    providers: [ ...JobAdapterProviders, JobService],
    exports: [...JobAdapterProviders, JobService]
})
export class JobModule {}
