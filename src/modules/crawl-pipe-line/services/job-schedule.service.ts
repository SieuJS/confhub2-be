import { Injectable } from "@nestjs/common";
import { JobAdapterInput, JobAdapterService } from "../modules";
import { Cron } from "@nestjs/schedule";
import { ConferenceAdapterService } from "../modules";
@Injectable()
export class JobScheduleService {
    constructor( private jobService: JobAdapterService, 
        private conferenceAdapterService: ConferenceAdapterService
    ) {
        this.jobService = jobService
    }
    @Cron('10 10 10 * * *')
    async handleCron() {
        console.log('Called when the current second is 10');
        let confs = await this.conferenceAdapterService.findAll();
        confs.forEach(async conf => {
            this.jobService.create({
                conf_id: conf._id,
                type : "update" ,
                status : "pending"
            } as JobAdapterInput)
        })
        
        console.log('JobService', this.jobService);
        
        await this.jobService.findAll();
    }
    
}