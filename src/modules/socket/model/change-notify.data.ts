import { CrawlJobData } from "../../job/model/crawl-job.data";

export class ChangeNotifyData  {
    public readonly operation : 'DELETE' | 'INSERT' | 'UPDATE';
    public readonly data : CrawlJobData;
}