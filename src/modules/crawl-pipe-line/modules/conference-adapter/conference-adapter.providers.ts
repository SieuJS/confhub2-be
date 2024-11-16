import { Mongoose } from "mongoose";
import { ConferenceAdapterSchema } from "./model";
import { MongoService } from "../../token";

export const ConferenceAdapterProviders = [
    {
        provide : MongoService.CONFERENCE_TOKEN,
        useFactory : (mongoose: Mongoose) => mongoose.model("Conference", ConferenceAdapterSchema),   
        inject : [MongoService.DATABASE_CONNECTION]
    }
];

