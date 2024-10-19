import { PickType } from "@nestjs/swagger";
import { ConferenceData } from "./conference.data";

export class ConferenceInput extends PickType(ConferenceData, ['name', 'acronym'] as const) {}