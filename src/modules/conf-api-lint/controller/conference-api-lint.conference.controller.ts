import { Controller, Get, Query } from "@nestjs/common";
import {  ApiTags } from "@nestjs/swagger";
import { ConferenceApiLintAttributes } from "../model/conference-api-lint.data";


@Controller(
    'conference-lint'
)
@ApiTags('Conference Lint')
export class ConferenceApiLintController {
    constructor() {
    }

    @Get()
    async getConferenceData(@Query() searchParams : ConferenceApiLintAttributes) {
        console.log(searchParams);
        return 'Hello World!';
    }
}