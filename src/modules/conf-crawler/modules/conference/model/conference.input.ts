import { OmitType } from "@nestjs/swagger";
import {ConferenceData} from "./conference.data";
export class ConferenceInput extends OmitType(ConferenceData, [] ){}