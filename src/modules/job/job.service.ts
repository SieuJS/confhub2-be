import { Injectable } from '@nestjs/common';
import { CrawlJobData } from '../job/model';
import { CrawlJobInput } from '../job/model';
import { PrismaService } from '../common';

@Injectable()
export class JobService {
    constructor(private prisma: PrismaService) {}

    async createJob( data : CrawlJobInput) : Promise<CrawlJobData> {
        const crawlJob = await this.prisma.crawl_jobs.create({data}) ; 
        return new CrawlJobData(crawlJob);
    }

    async getJobById(id : string) : Promise<CrawlJobData | null> {
        const crawlJob = await this.prisma.crawl_jobs.findUnique({where : {id}}) ; 

        return crawlJob ? new CrawlJobData(crawlJob) : null ;
    }

    async updateJob(id : string , data : CrawlJobInput) : Promise<CrawlJobData> {
        const crawlJob = await this.prisma.crawl_jobs.update({where : {id} , data}) ; 
        return new CrawlJobData(crawlJob);
    }

}
