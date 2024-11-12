import { PipeTransform,Injectable,ArgumentMetadata } from "@nestjs/common";
import { ConferenceAdapterInput } from "../modules";

@Injectable()
export class ConferenceAdapterPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) : ConferenceAdapterInput {
        if(value.title){
            return new ConferenceAdapterInput({
                Title : value.title,
                Acronym : value.acronym,
                Rank : value.rank,
                Source : value.source,
                PrimaryFoR : value.primaryFoR, 
            })
        }
        return value;

    }
}