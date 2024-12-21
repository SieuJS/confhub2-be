import {  ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ConferenceAdapterInput, CrawlDateData } from "../modules";
import { ImportantDateInput } from "../../call-for-paper"


@Injectable()
export class ConferenceAdapterToImportantDatePipe implements PipeTransform {
    constructor () {}

    transform(input: ConferenceAdapterInput, metadata: ArgumentMetadata) : ImportantDateInput[] {
        const submissionDates = input.SubmissonDate.map((date : CrawlDateData) : ImportantDateInput => {
            return {
              cfp_id : null,
              date_type : 'submission',
              date_value : new Date(date.date),
              status : true ,   
            } ;
        });
        const notificationDates = input.NotificationDate.map((date : CrawlDateData) : ImportantDateInput => {
            return {
              cfp_id : null,
              date_type : 'notification',
              date_value : new Date(date.date),
              status : true ,   
            } ;
        })
        const cameraReadyDates = input.CameraReady.map((date : CrawlDateData) : ImportantDateInput => {
            return {
              cfp_id : null,
              date_type : 'camera_ready',
              date_value : new Date(date.date),
              status : true ,   
            } ;
        });


        return [...submissionDates, ...notificationDates, ...cameraReadyDates];
    }
}