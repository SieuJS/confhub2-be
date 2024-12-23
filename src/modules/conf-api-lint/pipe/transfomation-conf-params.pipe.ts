import { Injectable, PipeTransform } from "@nestjs/common";
import parser from "any-date-parser";
import { ConferenceApiLintParams } from "../model/conference-api-lint.data";

@Injectable()
export class TransformationConfParamsPipe implements PipeTransform {
    public transform(value: ConferenceApiLintParams) : ConferenceApiLintParams{
        return {
            ...value, 
            page : value.page ? parseInt(value.page as any) : undefined,
            perPage : value.perPage ? parseInt(value.perPage as any) : undefined,
            ...value.startDate && {startDate : parser.fromString(value.startDate as string).toISOString()},
            ... value.endDate && {endDate : parser.fromString(value.endDate as string).toISOString()},
        }
    }
}