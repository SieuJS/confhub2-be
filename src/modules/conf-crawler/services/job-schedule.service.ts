import { Injectable } from "@nestjs/common";
import { JobService } from "../modules";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class JobScheduleService {
    constructor( private jobService: JobService) {
        this.jobService = jobService
    }
    @Cron('10 * * * * *')
    async handleCron() {
        console.log('Called when the current second is 10');
        console.log('JobService', this.jobService);
        await this.jobService.findAll();
    }
    
}