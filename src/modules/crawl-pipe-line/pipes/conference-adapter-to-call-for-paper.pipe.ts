import { Injectable, PipeTransform } from "@nestjs/common";
import { CallForPaperInput } from "../../call-for-paper";
import { ConferenceData, ConferenceService } from "../../conference";
import { ConferenceAdapterInput } from "../modules";
import { Decimal } from "@prisma/client/runtime/library";


@Injectable()
export class ConferenceAdapterToCallForPaperPipe implements PipeTransform {
    constructor(
        private readonly conferenceService: ConferenceService
    ) { }

    async transform(value: ConferenceAdapterInput, metadata: any): Promise<CallForPaperInput> {
        const existsConference = await this.conferenceService.findOne({name : value.Title, acronym : value.Acronym} as ConferenceData);
        console.log("Input Value", value);
        return {
            conference_id : existsConference.id,
            content : value.CallForPaper,
            link : value.Links[0],
            owner : 'crawler',
            status : true, 
            view_count :new Decimal(0),
            start_date : null,
            end_date :  null,
            country : value.Location,
            location : value.Location,
            avg_rating : parseFloat(value.AverageRating),
            access_type : value.Type,
        }
    }
}