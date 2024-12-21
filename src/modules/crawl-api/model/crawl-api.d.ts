export interface ConferenceCrawlData  {
    Link: string | null;
    Name : string ;
    Acronym : string ;
    "Information" : string ;
    "Conference dates" : string ;
    Location : string ;
    Type : string ;
    "Submission date" : string ;
    "Notification date" : string ;
    "Camera ready date" : string ;
    "Registration date" : string ;
    "Topics" : string ;
    Others : string ;
}

export interface ConferenceCrawlInput {
    Title : string ;
    Acronym : string ;
    Link? : string  ;
}

interface ParsedDates {
    "Submission date": string[];
    "Notification date": string[];
    "Camera-ready date": string[];
    "Registration date": string[];
    "Others": string[];
}


export interface CrawlApi {
    status : string ; 
    data : ConferenceCrawlData[];    
}