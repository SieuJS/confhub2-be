import { crawl_jobs } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CrawlJobData {
    @ApiProperty({description: 'Unique identifier of the crawl job.', example: '75442486-0878-440c-9db1-a7006c25a39f'})
    id: string;
    @ApiProperty({description: 'ID of the conf', example: "23231232-0878-440c-9db1-a7006c25a39f"})
    conference_id: string | null;
    @ApiProperty({description: 'Progress', example: '90'})
    progress_percent: number | null;
    @ApiProperty({description : 'detail of progress', example : 'get cfp link'})
    progress_detail: string | null;
    @ApiProperty({description: 'Status of the job', example: "RUNNING"})
    status: string | null;
    @ApiProperty({description : "Type of job", example : "CRAWL"})
    type : string | null;
    @ApiProperty({description : "durraion", example : "10"})
    duration : number | null;
    @ApiProperty({description: 'Created at', example: '2021-09-01T00:00:00.000Z'})
    created_at: Date | null;
    @ApiProperty({description: 'Updated at', example: '2021-09-01T00:00:00.000Z'})
    updated_at: Date | null;

    constructor (entity: crawl_jobs) {
        this.id = entity.id;
        this.conference_id= entity.conference_id;
        this.type = entity.type;
        this.progress_percent = entity.progress_percent;
        this.progress_detail = entity.progress_detail;
        this.duration = entity.duration;
        this.status = entity.status ;
        this.created_at = entity.created_at;
        this.updated_at = entity.updated_at;
    }
}
