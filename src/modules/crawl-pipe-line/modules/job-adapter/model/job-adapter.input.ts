import { OmitType } from "@nestjs/swagger";
import  {JobAdapterData} from "./job-adapter.data";

export class JobAdapterInput extends OmitType(JobAdapterData, [] ){}