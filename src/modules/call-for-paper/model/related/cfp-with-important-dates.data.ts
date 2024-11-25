import { ApiProperty } from "@nestjs/swagger";
import { CallForPaperData } from "../call-for-paper.data";
import { ImportantDateData } from "../important-date.data";


export class CfpWithImportantDatesData extends CallForPaperData {
    @ApiProperty({description: "Important dates data", type: ImportantDateData, isArray: true})
    important_dates: ImportantDateData[];
    constructor (data: CallForPaperData & {importantDates : ImportantDateData[]}) {
        super(data);
        this.important_dates = data.importantDates
    }
}