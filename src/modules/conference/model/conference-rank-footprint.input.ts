import { ConferenceRankFootPrintData } from "./conference-rank-footprint.data";
import { OmitType } from "@nestjs/swagger";

export class ConferenceRankFootPrintInput extends OmitType(ConferenceRankFootPrintData, ['id'] as const) {}