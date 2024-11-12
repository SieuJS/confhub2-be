import { OmitType } from "@nestjs/swagger";
import {ConferenceAdapterData} from "./conference-adapter.data";
export class ConferenceAdapterInput extends OmitType(ConferenceAdapterData, ['_id'] ){}