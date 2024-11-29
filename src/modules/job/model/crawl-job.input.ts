import { OmitType } from "@nestjs/swagger";
import { CrawlJobData } from "./crawl-job.data";

export class CrawlJobInput extends OmitType(CrawlJobData, ['id'] as const) {}