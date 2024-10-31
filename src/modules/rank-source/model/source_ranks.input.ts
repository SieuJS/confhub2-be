import { SourceRanksData } from "./source_ranks.data";
import { OmitType } from "@nestjs/swagger";

export class SourceRanksInput extends OmitType(SourceRanksData, ['id']) {}