import {JobAdapter as Job, JobProgress} from "./job-adapter.interface";
import { ApiProperty } from "@nestjs/swagger";
export class JobAdapterData {
    @ApiProperty({description: "id of job", example: "5f7b7b7b7b7b7b7b7b7b7b7b"})
    _id : string ;
    @ApiProperty({description: 'status of the job', example: 'running'})
    status: string;
    @ApiProperty({description: 'conference id', example: '5f7b7b7b7b7b7b7b7b7b7b7b'})
    conf_id: string;
    @ApiProperty({description: 'type of the job', example: 'update now'})
    type: string;
    @ApiProperty({description: 'progress of the job', example: {percentage: 0, detail: 'start'}})
    progress: JobProgress;
    @ApiProperty({description: 'data of the job', example: {}})
    data: object;
    @ApiProperty({description: 'error message', example: ''})
    error: string;
    @ApiProperty({description: 'duration of the job', example: 0})
    duration: number;
    constructor(job: Job) {
        this._id = job._id.toString();
        this.status = job.status;
        this.conf_id = job.conf_id;
        this.type = job.type;
        this.progress = job.progress;
        this.data = job.data;
        this.error = job.error;
        this.duration = job.duration;
    }
}