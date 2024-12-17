import { Injectable } from "@nestjs/common";
import { CrawlJobData, CrawlJobInput } from "../../job/model";
import { ConferenceService } from "../../conference";
import { JobService } from "../../job";
import { CallForPaperInput, CallForPaperService } from "../../call-for-paper";
import { CrawlApiPipelineService } from "../../crawl-api";
import { ConferenceCrawlInput } from "../../crawl-api/model";
import { splitDateRange } from "../../../utils";
import { JobWatcherData } from "../model/job-watcher.data";
import { JobWatcherInput } from "../model/job-watcher.input";
import { PrismaService } from "../../common";
@Injectable()
export class JobWatcherService {
    constructor(
        private conferenceService: ConferenceService,
        private jobService: JobService,
        private callForPaperService: CallForPaperService,
        private crawlApiPipelineService: CrawlApiPipelineService,
        private prismaService : PrismaService
    ) {}
    public watchDatabase() {
        return "Watching database";
    }
    public async handleInsertJob(job: CrawlJobData) {
        const conference_id = job.conference_id;
        const conferenceToCrawl = await this.conferenceService.findById(
            conference_id as string
        );

        if (!conferenceToCrawl) {
            throw new Error("Conference not found");
        }
        const input: ConferenceCrawlInput = {
            Title: conferenceToCrawl.name as string,
            Acronym: conferenceToCrawl.acronym as string,
        };
        await this.jobService.updateJob(job.id, {
            status: "PROCESSING",
            progress_percent: 10,
        } as CrawlJobInput);
        // Emit the change event to all connected Socket.IO clients
        const crawlData = await this.crawlApiPipelineService.fakeCrawlApi(
            input
        );
        if (!crawlData) {
            await this.jobService.updateJob(job.id, {
                status: "FAILED",
            } as CrawlJobInput);
            throw new Error("Error when crawl data");
        }
        try {
            await this.jobService.updateJob(job.id, {
                status: "PROCESSING",
                progress_percent: 70,
            } as CrawlJobInput);

            const { startDate, endDate } = splitDateRange(
                crawlData["Conference dates"]
            );
            const { start_date, end_date } = {
                start_date: new Date(startDate),
                end_date: new Date(endDate),
            };

            await this.callForPaperService.create({
                conference_id: conference_id,
                start_date,
                end_date,
                link: crawlData.Link,
                location: crawlData.Location,
                content: crawlData.Information,
                access_type: crawlData.Type,
                status: start_date.getTime() > Date.now(),
            } as CallForPaperInput);

            const crawlJob = await this.jobService.updateJob(job.id, {
                status: "SUCCESS",
                progress_percent: 100,
            } as CrawlJobInput);
            return crawlJob;
        } catch (error) {
            console.log("Error in insert crawl job", error);
            await this.jobService.updateJob(job.id, {
                status: "FAILED",
            } as CrawlJobInput);
            throw new Error("Error when crawl data");
        }
    }

    public async createWatcher(data : JobWatcherInput) : Promise<JobWatcherData> {
        return this.prismaService.job_watchers.create({data});
    }

    public async findWatchersOfJob(job : string) : Promise<JobWatcherData[] | null> {
        return this.prismaService.job_watchers.findMany({where : {
            job_id : job
        }});
    }

    public async deleteWatcher(socket_id : string) : Promise<void> {
        await this.prismaService.job_watchers.deleteMany({where : {
            socket_id
        }});
    }

    
}
