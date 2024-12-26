import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Inject } from "@nestjs/common";
import {  Queue } from "bullmq";
import { ConferenceCrawlInput } from "../../crawl-api/model";
import { ConferenceService } from "../../conference";
import { CallForPaperService } from "../../call-for-paper";
import { CACHE_MANAGER , Cache } from "@nestjs/cache-manager";
import { ProcessCrawlToken } from "../token";

@Injectable()
export class CrawlConferenceService {
    constructor(
        @InjectQueue(ProcessCrawlToken.CRAWL_CONF_QUEUE_NAME)
        private readonly uploadQueue: Queue,
        private readonly conferenceService : ConferenceService,
        private readonly callForPaperService : CallForPaperService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {

    }
    async uploadConference(
        input : ConferenceCrawlInput
    )  {
        return await this.uploadQueue.add('upload-conference' , input);
    }

    async processCrawlJob (jobId : string) {
        const job = await this.uploadQueue.getJob(jobId);
        if (!job) {
            throw new Error("Job not found");
        }
        return job;
    }

    async crawlNewConference(conferenceId : string) : Promise<string | undefined> {
        const conference = await this.conferenceService.findById(conferenceId);
        if (!conference) {
            throw new Error("Conference not found");
        }

        const mainCfp = await this.callForPaperService.getMainCfp(conferenceId);

        if (mainCfp){
            throw new Error("Main CFP already exists");
        }

        const existsJobId  = await this.cacheManager.get(`crawl-job-for-${conferenceId}`)  as string;

        if (existsJobId) {
            return existsJobId;
        }

        const queueJob = await this.uploadQueue.add(ProcessCrawlToken.CRAWL_NEW_CONF_JOB_NAME , {
            Title : conference.name,
            Acronym : conference.acronym
        });

        await this.cacheManager.set(`crawl-job-for-${conferenceId}`, queueJob.id);
        await this.cacheManager.set(`job-${queueJob.id}`, conferenceId);

        return queueJob.id;

    }


}
