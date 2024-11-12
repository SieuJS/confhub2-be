import { Injectable } from "@nestjs/common";
import { JobAdapterService } from "../modules";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class JobScheduleService {
    constructor( private jobService: JobAdapterService) {
        this.jobService = jobService
    }
    @Cron('10 * * * * *')
    async handleCron() {
        console.log('Called when the current second is 10');
        console.log('JobService', this.jobService);
        
        await this.jobService.findAll();
    }
    
}