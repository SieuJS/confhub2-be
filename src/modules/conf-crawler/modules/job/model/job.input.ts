import { OmitType } from "@nestjs/swagger";
import  {JobData} from "./job.data";

export class JobInput extends OmitType(JobData, [] ){}