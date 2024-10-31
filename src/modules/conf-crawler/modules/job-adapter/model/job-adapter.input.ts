import { OmitType } from "@nestjs/swagger";
import  {JobAdapterData} from "./job-adapter.data";

export class JobInput extends OmitType(JobAdapterData, [] ){}