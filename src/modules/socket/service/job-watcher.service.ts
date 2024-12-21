import { Injectable } from "@nestjs/common";
import { CrawlJobData, CrawlJobInput } from "../../job/model";
import { ConferenceService } from "../../conference";
import { JobService } from "../../job";
import { CallForPaperInput, CallForPaperService } from "../../call-for-paper";
import { CrawlApiPipelineService } from "../../crawl-api";
import { ConferenceCrawlData, ConferenceCrawlInput, ParsedDates } from "../../crawl-api/model";
import { splitDateRange } from "../../../utils";
import { JobWatcherData } from "../model/job-watcher.data";
import { JobWatcherInput } from "../model/job-watcher.input";
import { PrismaService } from "../../common";
import { Transactional } from "@nestjs-cls/transactional";
import parser from 'any-date-parser';
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
        let crawlData;
        try {
            crawlData = await this.crawlApiPipelineService.transferToCrawlApi(
            input
        );
        }
        catch (error) {
            console.log("Error in insert crawl job", error);
            await this.jobService.updateJob(job.id, {
                status: "FAILED",
            } as CrawlJobInput);
            throw new Error("Error when crawl data");
        }
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

            await this.importCallForPaperWithDates(crawlData, conference_id as string);

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

    public async handleUpdateJob(job : CrawlJobData) {
        const conference_id = job.conference_id;
        const conferenceToCrawl = await this.conferenceService.findById(
            conference_id as string
        );

        if (!conferenceToCrawl) {
            throw new Error("Conference not found");
        }

        const cfpMain = await this.callForPaperService.getMainCfp(conference_id as string);
        const input: ConferenceCrawlInput = {
            Title: conferenceToCrawl.name as string,
            Acronym: conferenceToCrawl.acronym as string,
            Link : cfpMain?.link as string
        };

        await this.jobService.updateJob(job.id, {
            status: "PROCESSING",
            progress_percent: 10,
        } as CrawlJobInput);
        // Emit the change event to all connected Socket.IO clients
        let crawlData;
        try{
        crawlData = await this.crawlApiPipelineService.crawlByLink(
            input
        );
        }
        catch (error) {
            console.log("Error in update crawl job", error);
            await this.jobService.updateJob(job.id, {
                status: "FAILED",
            } as CrawlJobInput);
            throw new Error("Error when crawl data");
        }
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

            await this.updateCallForPaperWithDates(crawlData, cfpMain?.id as string);

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


    @Transactional()
    public async importCallForPaperWithDates (crawlData : ConferenceCrawlData , conference_id : string) {
        const { startDate, endDate } = splitDateRange(crawlData["Conference dates"]);
        const { start_date, end_date } = {
            start_date: new Date(startDate),
            end_date: new Date(endDate),
        };

        const cfp = await this.callForPaperService.create({
            conference_id: conference_id,
            start_date,
            end_date,
            link: crawlData.Link,
            location: crawlData.Location,
            content: crawlData.Information,
            access_type: crawlData.Type,
            status: start_date.getTime() > Date.now(),
        } as CallForPaperInput);

        const parsedDates: ParsedDates = {
            "Submission date": [],
            "Notification date": [],
            "Camera-ready date": [],
            "Registration date": [],
            "Others": []
        };

        for (const [key, value] of Object.entries(crawlData)) {
            if (key in parsedDates && value) {
                const matches = value.match(/(\w+ \d{1,2}, \d{4})/g);
                if (matches) {
                    await matches.forEach( async(dateStr : string) => {
                        const date = parser.fromString(dateStr);
                        await this.callForPaperService.createCFPImportantdates({
                            cfp_id : cfp.id,
                            date_value : date,
                            date_type : key,
                            status : date.getTime() > Date.now()
                        })
                    });
                }
            }
        }
        
        return cfp;
    }

    @Transactional()
    public async updateCallForPaperWithDates (crawlData : ConferenceCrawlData , cfpId : string) {
        const { startDate, endDate } = splitDateRange(crawlData["Conference dates"]);
        const { start_date, end_date } = {
            start_date: new Date(startDate),
            end_date: new Date(endDate),
        };

        const cfp = await this.callForPaperService.updateCfp(cfpId, {
            start_date,
            end_date,
            link: crawlData.Link,
            location: crawlData.Location,
            content: crawlData.Information,
            access_type: crawlData.Type,
            status: start_date.getTime() > Date.now(),
        } as CallForPaperInput);

        await this.callForPaperService.removeImportantDate(cfpId);

        const parsedDates: ParsedDates = {
            "Submission date": [],
            "Notification date": [],
            "Camera-ready date": [],
            "Registration date": [],
            "Others": []
        };


        for (const [key, value] of Object.entries(crawlData)) {
            if (key in parsedDates && value) {
                const matches = value.match(/(\w+ \d{1,2}, \d{4})/g);
                if (matches) {
                    await matches.forEach( async(dateStr : string) => {
                        const date = parser.fromString(dateStr);
                        await this.callForPaperService.createCFPImportantdates({
                            cfp_id : cfp.id,
                            date_value : date,
                            date_type : key,
                            status : date.getTime() > Date.now()
                        })
                    });
                }
            }
        }
        
        return cfp;
    }

}
