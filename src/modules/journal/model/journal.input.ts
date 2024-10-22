import { OmitType } from "@nestjs/swagger";

import { JournalData } from "./journal.data";

export class JournalInput extends OmitType(JournalData, ['id']) {}