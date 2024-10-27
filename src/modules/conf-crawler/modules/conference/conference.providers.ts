import { Mongoose } from "mongoose";
import { ConferenceSchema } from "./model";
import { MongoService } from "../../token";

export const ConferenceProviders = [
    {
        provide : MongoService.CONFERENCE_TOKEN,
        useFactory : (mongoose: Mongoose) => mongoose.model("Conference", ConferenceSchema),   
        inject : [MongoService.DATABASE_CONNECTION]
    }
];