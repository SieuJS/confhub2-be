import { OmitType } from "@nestjs/swagger";
import { ImportantDateData } from "./important-date.data";

export class ImportantDateInput extends OmitType(ImportantDateData, ['id'] as const) {}