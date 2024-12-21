import { Injectable, HttpException } from "@nestjs/common";
import { ConferenceCrawlData, ConferenceCrawlInput, ParsedDates } from "../model";
import  parser from  'any-date-parser'

const CRAWL_API_URL = "http://172.188.50.15:8080";

@Injectable()
export class CrawlApiPipelineService {
    constructor(

    ) {
    }
    async transferToCrawlApi(input: ConferenceCrawlInput) : Promise<ConferenceCrawlData | undefined> {
    try {
        const response = await fetch(CRAWL_API_URL + "/upload", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'from-server': 'true',
            },
            body: JSON.stringify([input]),
        });
        const responseData = await response.json();
        if(response.status !== 200) {
            throw new HttpException(responseData, response.status);
        }
        const crawlData : ConferenceCrawlData[] = responseData.data;
        return crawlData.pop() ;

    }
    catch (error) {
        console.log(error);
        throw new HttpException(error.message, 500);
    }
        
    }

    async crawlByLink(input: ConferenceCrawlInput) : Promise<ConferenceCrawlData | undefined> {
        try {
            const response = await fetch(CRAWL_API_URL+ "/crawl_from_links", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'from-server': 'true',
                },
                body: JSON.stringify([input]),
            });
            const responseData = await response.json();
            if(response.status !== 200) {
                throw new HttpException(responseData, response.status);
            }
            const crawlData : ConferenceCrawlData[] = responseData.data;
            return crawlData.pop() ;
    
        }
        catch (error) {
            console.log(error);
            throw new HttpException(error.message, 500);
        }
    }

    async fakeCrawlApi(input: ConferenceCrawlInput) : Promise<ConferenceCrawlData | undefined> {
        await new Promise(resolve => setTimeout(resolve, 15000));
        return {
            "Name": "National Conference of the American Association for Artificial Intelligence",
            "Acronym": "AAAI_Diff",
            "Link": "https://aaai.org/conference/aaai/aaai-25/",
            "Information": "Conference dates: February 25 – March 4, 2025\nLocation: Philadelphia, Pennsylvania, USA\nType: Offline (in-person)\nAAAI-25 web site open for paper submission: July 8, 2024\nAbstracts due: August 7, 2024\nFull papers due: August 15, 2024\nSupplementary material and code due: August 19, 2024\nNotification of Phase 1 rejections: October 14, 2024\nAuthor feedback window: November 4-8, 2024\nNotification of final acceptance or rejection (Main Technical Track): December 9, 2024\nSubmission of camera-ready files (Main Technical Track): December 19, 2024\nTopics: Artificial Intelligence, Machine Learning, Natural Language Processing, Computer Vision, Data Mining, Multiagent Systems, Knowledge Representation, Human-in-the-loop AI, Search, Planning, Reasoning, Robotics and Perception, Ethics, AI for Social Impact, AI Alignment",
            "Conference dates": "February 25 – March 4, 2025",
            "Location": "Philadelphia, Pennsylvania, USA",
            "Type": "Offline (in-person)",
            "Submission date": "AAAI-25 web site open for paper submission: July 8, 2024\nAbstracts due: August 7, 2024\nFull papers due: August 15, 2024\nSupplementary material and code due: August 19, 2024",
            "Notification date": "Notification of Phase 1 rejections: October 14, 2024\nNotification of final acceptance or rejection (Main Technical Track): December 9, 2024",
            "Camera-ready date": "Submission of camera-ready files (Main Technical Track): December 19, 2024",
            "Registration date": "",
            "Topics": "Artificial Intelligence, Machine Learning, Natural Language Processing, Computer Vision, Data Mining, Multiagent Systems, Knowledge Representation, Human-in-the-loop AI, Search, Planning, Reasoning, Robotics and Perception, Ethics, AI for Social Impact, AI Alignment",
            "Others": "Author feedback window: November 4-8, 2024"
        } as unknown as ConferenceCrawlData;
    }

    public parseDates(data: ConferenceCrawlData): ParsedDates {
        const parsedDates: ParsedDates = {
            "Submission date": [],
            "Notification date": [],
            "Camera-ready date": [],
            "Registration date": [],
            "Others": []
        };
        
        for (const [key, value] of Object.entries(data)) {
            if (value) {
                const matches = value.match(/(\w+ \d{1,2}, \d{4})/g);
                if (matches) {
                    parsedDates[key as keyof ParsedDates] = matches.map((dateStr : string) => parser.fromString(dateStr).toDateString());
                }
            }
        }

        return parsedDates;
    }
}