import { Document } from "mongoose";
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
    ConferenceDate: string[];
    SubmissonDate: string[];
    NotificationDate: string[];
    CameraReady: string[];
    CallForPaper: string;
    Location: string;
    Type: string;
    createdAt: Date;
    updatedAt: Date;
}