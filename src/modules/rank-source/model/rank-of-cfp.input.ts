import { RankOfCfpData } from "./rank-of-cfp.data";
import { OmitType } from "@nestjs/swagger";

export class RankOfCfpInput extends OmitType(RankOfCfpData, ['id']) {}