import {  OnQueueEvent, QueueEventsHost, QueueEventsListener } from "@nestjs/bullmq";
import { ProcessCrawlToken } from "../token";
import { NotifyCrawlGateway } from "../gateway";
import { ListenerService } from "./listener.service";



@QueueEventsListener(ProcessCrawlToken.CRAWL_CONF_QUEUE_NAME) 
export class CrawlEventListener extends QueueEventsHost {

    constructor (
        private readonly socketGateway : NotifyCrawlGateway,
        private readonly listenerService : ListenerService

    ) {
        super();
    }

    @OnQueueEvent('added') 
    async onAdded(job: { jobId: string; prev?: string }) {
        await this.socketGateway.notifyJob(job.jobId as string, 'init', "Job has been added");
        console.log(`Job ${job.jobId} has been added`);
    }

    @OnQueueEvent('active')
    async onActive(job: { jobId: string; prev?: string }) {
        await this.socketGateway.notifyJob(job.jobId as string,'active', "Job is now active");
        console.log(`Job ${job.jobId} is now active`);
    }

    @OnQueueEvent('completed')
    async onCompleted(job: { jobId: string; prev?: string }) {
        await this.socketGateway.notifyJob(job.jobId as string,'completed', "Job has been completed");

        await this.listenerService.clearJobEvent(job.jobId as string);
    }

    @OnQueueEvent('failed')
    async onFailed(job: { jobId: string; prev?: string }) {
        await this.socketGateway.notifyJob(job.jobId as string,'failed', "Job has failed");

        await this.listenerService.clearJobEvent(job.jobId as string);
    }
}