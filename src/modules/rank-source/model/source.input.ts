import { SourceData } from "./source.data";

import { PickType } from "@nestjs/swagger";

export class SourceInput extends PickType(SourceData, ['name', 'link'] as const) {}

