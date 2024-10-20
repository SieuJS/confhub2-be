import { OmitType } from "@nestjs/swagger";
import { CfpDetailData } from "./cfp-detail.data";

export class CfpDetailInput extends OmitType(CfpDetailData, ['id', 'cfp_id'] as const) {}