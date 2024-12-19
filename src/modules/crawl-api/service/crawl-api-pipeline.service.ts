import { Injectable, HttpException } from "@nestjs/common";
import { ConferenceCrawlData, ConferenceCrawlInput } from "../model";

const CRAWL_API_URL = "http://172.188.50.15:8080/upload";

@Injectable()
export class CrawlApiPipelineService {
    constructor() {
    }
    async transferToCrawlApi(inputs : ConferenceCrawlInput[]) : Promise<ConferenceCrawlData[]> {
        const response = await fetch(CRAWL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'from-server': 'true',
            },
            body: JSON.stringify(inputs),
        });
        const responseData = await response.json();
        if(response.status !== 200) {
            throw new HttpException(responseData, response.status);
        }
        return responseData.data as ConferenceCrawlData[];
    }   
}