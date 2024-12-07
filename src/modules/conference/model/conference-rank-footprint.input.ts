import { OmitType } from '@nestjs/swagger';

import { ConferenceRankFootPrintData } from './conference-rank-footprint.data';

export class ConferenceRankFootPrintInput extends OmitType(ConferenceRankFootPrintData, ['id'] as const) {}