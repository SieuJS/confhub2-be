export type SingleConferenceResponse = {
    data : SingleConferenceData | null ;
}

export type SingleConferenceData = {
    id: string;
    name: string;
    acronym: string;
    callForPapers: CallForPapersData;
    conferenceRanks: ConferenceRanks[];
    
}

export type DateData  = {
    dateType : string ;
    dateValue : string ; 
    status : string ;
}

export type CallForPapersData = {
    location : string ;
    startDate : string;
    endDate : string ;
    accessType : string ; 
    content : string ;
    submissionDates : DateData[]; 
    notificationDates : DateData[] ;
    registrationDates : DateData[] ;
    cameraReadyDates : DateData[] ;
    
}

export type ConferenceRanks = {
    year : number ; 
    source : string ; 
    rank : string ;
    fieldOfResearch : string[] ;
}

