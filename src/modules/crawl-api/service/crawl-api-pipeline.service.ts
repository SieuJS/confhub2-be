import { Injectable, HttpException } from "@nestjs/common";
import { ConferenceCrawlData, ConferenceCrawlInput } from "../model";


const CRAWL_API_URL = "http://172.188.50.15:8080/upload";

@Injectable()
export class CrawlApiPipelineService {
    constructor(

    ) {
    }
    async transferToCrawlApi(input: ConferenceCrawlInput) : Promise<ConferenceCrawlData | undefined> {

    
        const response = await fetch(CRAWL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'from-server': 'true',
            },
            body: JSON.stringify([input]),
        });
        const responseData : ConferenceCrawlData[] = await response.json();
        if(response.status !== 200) {
            throw new HttpException(responseData, response.status);
        }
        return responseData.pop() ;
        
    }

    async fakeCrawlApi(input: ConferenceCrawlInput) : Promise<ConferenceCrawlData | undefined> {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            Name: "International Conference on Ambient Systems, Networks and Technologies",
            "Acronym": "ANT",
            Link: "https://cs-conferences.acadiau.ca/edi40-25/",
            "Information": "Conference dates: April 22-24, 2025\nLocation: Patras, Greece\nType: Offline\nTopics: Emerging Data, Data Science, Big Data Analytics, Cyber-Physical Systems, Fog and Edge Computing, Internet of Everything\n",
            "Conference dates": "April 22-24, 2025",
            "Location": "Patras, Greece",
            "Type": "Offline",
            "Topics": "Emerging Data, Data Science, Big Data Analytics, Cyber-Physical Systems, Fog and Edge Computing, Internet of Everything",
            "Submission date": "",
            "Notification date": "",
            "Camera ready date": "",
            "Registration date": "",
        } as ConferenceCrawlData;
    }
    

    
}