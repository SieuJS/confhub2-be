import { Document } from "mongoose"

export interface JobProgress { 
    percentage: number;
    detail: string;
}

export interface Job extends Document {
    readonly status: string; 
    readonly conf_id: string;
    readonly type: string;
    readonly progress: JobProgress;
    readonly data: object;
    readonly error: string;
    readonly duration: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}