import { Document } from "mongoose";
import { CrawlDateData } from "./crawl-date.data";
export interface ConferenceAdapter extends Document {
    Title: string;
    Acronym: string;
    Source: string;
    Rank: string;
    Note : string;
    DBLP: string;
    PrimaryFoR: string[];
    Comments: string;
    AverageRating: string;
    Links: string[];
    ConferenceDate: CrawlDateData[];
    SubmissonDate: CrawlDateData[];
    NotificationDate: CrawlDateData[];
    CameraReady: CrawlDateData[];
    CallForPaper: string;
    Location: string;
    Type: string;
    createdAt: Date;
    updatedAt: Date;
}