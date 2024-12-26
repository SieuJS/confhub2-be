import { Controller, Get, Param, Query } from "@nestjs/common";
import {  ApiTags } from "@nestjs/swagger";
import {  ConferenceApiLintParams, ConfernceApiLintResponseData } from "../model/conference-api-lint.data";
import { ConferenceApiLintService } from "../service/conference-api-lint.service";
import { TransformationConfParamsPipe } from "../pipe/transfomation-conf-params.pipe";
import {  SingleConferenceResponse } from "../model/single-conference.data";

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

    @Get('/:id') 
    async getConferenceById(@Param('id') id : string ) : Promise<SingleConferenceResponse > {
        return { data : await this.conferenceApiLintService.getConferenceById(id)}
    }
}