import { OmitType } from "@nestjs/swagger";
import { FoRDivisionData } from "./for-division.data";

export class FoRDivisionInput extends OmitType(FoRDivisionData, ['id']) {}