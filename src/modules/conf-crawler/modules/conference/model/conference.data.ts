import {Conference} from './conference.interface';
import { ApiProperty } from "@nestjs/swagger";

export class ConferenceData {
    @ApiProperty({description: 'name of the conference', example: 'ICSE 2021'})
    Title: string;
    @ApiProperty({description: 'acronym of the conference', example: 'ICSE'})
    Acronym: string;
    @ApiProperty({description: 'source of the conference', example: 'DBLP'})
    Source: string;
    @ApiProperty({description: 'rank of the conference', example: 'A'})
    Rank: string;
    @ApiProperty({description: 'note of the conference', example: ''})
    Note: string;
    @ApiProperty({description: 'DBLP of the conference', example: ''})
    DBLP: string;
    @ApiProperty({description: 'PrimaryFoR of the conference', example: []})
    PrimaryFoR: string[];
    @ApiProperty({description: 'comments of the conference', example: ''})
    Comments: string;
    @ApiProperty({description: 'average rating of the conference', example: ''})
    AverageRating: string;
    @ApiProperty({description: 'links of the conference', example: []})
    Links: string[];
    @ApiProperty({description: 'conference date of the conference', example: []})
    ConferenceDate: string[];
    @ApiProperty({description: 'submission date of the conference', example: []})
    SubmissonDate: string[];
    @ApiProperty({description: 'notification date of the conference', example: []})
    NotificationDate: string[];
    @ApiProperty({description: 'camera ready of the conference', example: []})
    CameraReady: string[];
    @ApiProperty({description: 'call for paper of the conference', example: ''})
    CallForPaper: string;
    @ApiProperty({description: 'location of the conference', example: ''})
    Location: string;
    @ApiProperty({description: 'type of the conference', example: ''})
    Type: string;
    @ApiProperty({description: 'created at', example: new Date()})
    createdAt: Date;
    @ApiProperty({description: 'updated at', example: new Date()})
    updatedAt: Date;
    
    constructor(conference: Conference) {
        this.Title = conference.Title;
        this.Acronym = conference.Acronym;
        this.Source = conference.Source;
        this.Rank = conference.Rank;
        this.Note = conference.Note;
        this.DBLP = conference.DBLP;
        this.PrimaryFoR = conference.PrimaryFoR;
        this.Comments = conference.Comments;
        this.AverageRating = conference.AverageRating;
        this.Links = conference.Links;
        this.ConferenceDate = conference.ConferenceDate;
        this.SubmissonDate = conference.SubmissonDate;
        this.NotificationDate = conference.NotificationDate;
        this.CameraReady = conference.CameraReady;
        this.CallForPaper = conference.CallForPaper;
        this.Location = conference.Location;
        this.Type = conference.Type;
        this.createdAt = conference.createdAt;
        this.updatedAt = conference.updatedAt;
    }
}
