import { CrawlJobData } from "./crawl-job.data";
import { OmitType } from "@nestjs/swagger";

export class CrawlJobInput extends OmitType(CrawlJobData, ['id'] as const) {}