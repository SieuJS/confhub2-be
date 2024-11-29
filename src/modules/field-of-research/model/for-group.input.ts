import { OmitType } from "@nestjs/swagger";
import { FoRDivisionData } from "./for-division.data";
export class FoRGroupInput extends OmitType(FoRDivisionData, ['id']) {}