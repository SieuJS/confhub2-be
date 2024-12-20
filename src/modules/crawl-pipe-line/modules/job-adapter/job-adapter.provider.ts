import { Mongoose } from "mongoose";
import { JobSchema } from "./model";
import { MongoService } from "../../token";

export const JobAdapterProviders = [
    {
        provide: MongoService.JOB_TOKEN,
        useFactory: (mongoose: Mongoose) => mongoose.model("Job", JobSchema),
        inject: [MongoService.DATABASE_CONNECTION],
    },
];
