import { Module } from "@nestjs/common";
import { JobAdapterService } from "./job-adapter.service";
import { MongodbModule } from "../mongodb/mongodb.module";
import { JobAdapterProviders } from "./job-adapter.provider";


@Module({
    imports: [MongodbModule],
    providers: [ ...JobAdapterProviders, JobAdapterService],
    exports: [...JobAdapterProviders, JobAdapterService]
})
export class JobAdapterModule {}
