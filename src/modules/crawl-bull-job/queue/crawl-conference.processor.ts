import {  Processor, WorkerHost } from "@nestjs/bullmq";
import { LoggerService } from "../../common";
import { Job } from "bullmq";
import { CrawlApiPipelineService } from "../../crawl-api";
import { ConferenceCrawlData, ConferenceCrawlInput } from "../../crawl-api/model";
import { Inject, Injectable } from "@nestjs/common";
import { ProcessCrawlToken } from "../token";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import parser from "any-date-parser";
import { Transactional } from "@nestjs-cls/transactional";
import { splitDateRange } from "../../../utils";
import { PrismaService } from "../../common";


type KeyDates = {
    date_type : string;
    date_value : Date;
    status : boolean;
}

@Injectable()
@Processor(ProcessCrawlToken.CRAWL_CONF_QUEUE_NAME)
export class CrawlConferenceProcessor extends WorkerHost {
    constructor(
        private readonly logger: LoggerService,
        private readonly crawlApiPipelineService: CrawlApiPipelineService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly prismaService: PrismaService
    ) {
        super();
    }
    
    async process(job: Job, token?: string): Promise<any> {
        let conference : ConferenceCrawlData | undefined;
        let conferenceId : string;
        switch(job.name){
            case ProcessCrawlToken.CRAWL_NEW_CONF_JOB_NAME:
                conference = await this.crawlNewConference(job.data);
                conferenceId = await this.cacheManager.get(`job-${job.id}`) as string;
                if (!conference) {
                    throw new Error("Conference not found");
                }
                const cfp = await this.importCallForPaperWithDates(conference, conferenceId);

                this.logger.info(`Conference ${JSON.stringify(cfp)} uploaded`);
                return conference;

            case ProcessCrawlToken.CRAWL_UPDATE_CONF_JOB_NAME:
                conference = await this.crawlUpdateConference(job.data);
                conferenceId = await this.cacheManager.get(`job-${job.id}`) as string;
                if (!conference) {
                    throw new Error("Conference not found");
                }
                const cfp_update = await this.updateCallForPaperWithDates(conference, conferenceId);
                return cfp_update;

            default: 
                throw new Error(`Unknown job name ${job.name}`);
        }
    }

    async crawlNewConference(input : ConferenceCrawlInput) :Promise<ConferenceCrawlData|undefined> {
		this.logger.info(`Processing crawl for ${input.Acronym}....`);
		return this.crawlApiPipelineService.crawlByLink(input);
    }

    async crawlUpdateConference(input : ConferenceCrawlInput) :Promise<ConferenceCrawlData|undefined> {
        this.logger.info(`Processing crawl for ${input.Acronym}....`);
        return this.crawlApiPipelineService.transferToCrawlApi(input);
    }


    @Transactional()
    public async importCallForPaperWithDates (crawlData : ConferenceCrawlData , conference_id : string) {
        const { startDate, endDate } = splitDateRange(crawlData["Conference dates"]);
        const { start_date, end_date } = {
            start_date: new Date(startDate),
            end_date: new Date(endDate),
        };

        const notification_dates = this.parseDates(crawlData["Notification date"]);

        const camera_ready_dates = this.parseDates(crawlData["Camera ready date"]);

        const submission_dates = this.parseDates(crawlData["Submission date"]);

        const registration_dates = this.parseDates(crawlData["Registration date"]);

        const cfp = await this.prismaService.call_for_papers.create({
            data: {
                conference_id: conference_id,
                start_date,
                end_date,
                link: crawlData.Link,
                location: crawlData.Location,
                content: crawlData.Information,
                access_type: crawlData.Type,
                status: start_date.getTime() > Date.now(),
                notification_dates : {
                    createMany : {
                        data : notification_dates
                    }
                },
                camera_ready_dates : {
                    createMany : {
                        data : camera_ready_dates
                    }
                },
                submission_dates : {
                    createMany : {
                        data : submission_dates
                    }
                },
                registration_dates : {
                    createMany : {
                        data : registration_dates
                    }
                }
            },

        } );
        return cfp;
    }

    public async updateCallForPaperWithDates (crawlData : ConferenceCrawlData , conference_id : string) {
        const { startDate, endDate } = splitDateRange(crawlData["Conference dates"]);
        const { start_date, end_date } = {
            start_date: new Date(startDate),
            end_date: new Date(endDate),
        };

        const notification_dates = this.parseDates(crawlData["Notification date"]);

        const camera_ready_dates = this.parseDates(crawlData["Camera ready date"]);

        const submission_dates = this.parseDates(crawlData["Submission date"]);

        const registration_dates = this.parseDates(crawlData["Registration date"]);

        const mainCfp = await this.prismaService.call_for_papers.findUnique({
            where : {
                conference_id_status : {
                    conference_id : conference_id,
                    status : true
                }
            }
        })

        await this.prismaService.camera_ready_dates.deleteMany({
            where : {
                cfp_id : mainCfp?.id
            },
        })

        await this.prismaService.notification_dates.deleteMany({
            where : {
                cfp_id : mainCfp?.id
            },
        })

        await this.prismaService.registration_dates.deleteMany({
            where : {
                cfp_id : mainCfp?.id
            },
        })

        await this.prismaService.submission_dates.deleteMany({
            where : {
                cfp_id : mainCfp?.id
            },
        })

        const cfp = await this.prismaService.call_for_papers.update({
            where : {
                conference_id_status : {
                    conference_id : conference_id,
                    status : true
                }
            },
            data: {
                start_date,
                end_date,
                link: crawlData.Link,
                location: crawlData.Location,
                content: crawlData.Information,
                access_type: crawlData.Type,
                status: start_date.getTime() > Date.now(),
                notification_dates : {
                    createMany : {
                        data : notification_dates
                    }
                },
                camera_ready_dates : {
                    createMany : {
                        data : camera_ready_dates
                    }
                },
                submission_dates : {
                    createMany : {
                        data : submission_dates
                    }
                },
                registration_dates : {
                    createMany : {
                        data : registration_dates
                    }
                }
            },

        } );
        return cfp;
    }


    public parseDates(dateStr : string) : KeyDates[] {
        if(!dateStr){
            return [];
        }
        const parsedDates = dateStr.split('\n').reduce((acc : KeyDates[] , line) => {
            const [key, value] = line.split(': ');
            if (key && value) {
                let date_type = key.trim();
                let date_value = new Date(parser.fromString(value.trim()).toDateString());
                let status = new Date(date_value).getTime() > Date.now();
            acc.push ({
                date_type,
                date_value,
                status
            } as KeyDates);
            }
            return acc;
        }, [] as {date_type : string , date_value : Date , status : boolean}[]);
        return parsedDates;
    }
}