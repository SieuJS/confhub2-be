import { OmitType } from "@nestjs/swagger";
import { CallForPaperData } from "./call-for-paper.data";

export class CallForPaperInput extends OmitType(CallForPaperData, ['id'] as const) {}