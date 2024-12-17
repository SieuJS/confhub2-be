import { OmitType } from "@nestjs/swagger";
import { JobWatcherData } from "./job-watcher.data";

export class JobWatcherInput extends OmitType(JobWatcherData, ['id'] as const) {}