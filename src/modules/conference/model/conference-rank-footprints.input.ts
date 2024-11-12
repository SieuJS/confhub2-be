import { ConferenceRankFootPrintsData } from "./conference-rank-footprints.data";
import { OmitType } from "@nestjs/swagger";

export class ConferenceRankFootPrintsInput extends OmitType(ConferenceRankFootPrintsData, ['id'] as const) {}