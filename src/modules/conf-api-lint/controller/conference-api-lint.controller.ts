import { Controller, Get, Query } from "@nestjs/common";
import {  ApiTags } from "@nestjs/swagger";
import {  ConferenceApiLintParams, ConfernceApiLintResponseData } from "../model/conference-api-lint.data";
import { ConferenceApiLintService } from "../service/conference-api-lint.service";
import { TransformationConfParamsPipe } from "../pipe/transfomation-conf-params.pipe";

@Controller(
    'conference-lint'
)
@ApiTags('Conference Lint')
export class ConferenceApiLintController {
    constructor(
        private readonly conferenceApiLintService: ConferenceApiLintService

    ) {
    }

    @Get()
    async getConferenceData(@Query(TransformationConfParamsPipe) searchParams : ConferenceApiLintParams ) : Promise<ConfernceApiLintResponseData> {
        return this.conferenceApiLintService.getConferenceData(searchParams);

    }
}