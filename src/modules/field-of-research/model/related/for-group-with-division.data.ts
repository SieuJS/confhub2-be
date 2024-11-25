import { FoRGroupData } from "../for-group.data";
import { FoRDivisionData } from "../for-division.data";
import { ApiProperty } from "@nestjs/swagger";

export class FoRGroupWithDivisionData extends FoRGroupData {
    @ApiProperty({description: 'Field of research division data', type: FoRDivisionData})
    for_division: FoRDivisionData;
    constructor (data: FoRGroupData & {division : FoRDivisionData}) {
        super(data);
        this.for_division = new FoRDivisionData(data.division);
    }
}