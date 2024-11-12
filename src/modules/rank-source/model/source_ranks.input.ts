import { OmitType } from '@nestjs/swagger';
import { SourceRanksData } from './source_ranks.data';

export class SourceRanksInput extends OmitType(SourceRanksData, ['id']) {}