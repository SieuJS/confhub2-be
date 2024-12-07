import { Injectable } from '@nestjs/common';

@Injectable()
export class CrawlConferenceService {


    public crawlConference() {
        return 'Crawling conference';
    }

}