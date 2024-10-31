import { ConferenceAdapterService, ConferenceAdapterData, ConferenceAdapterInput } from "../modules";
import { Controller, HttpStatus , Get, Post, Body} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import {ConferenceService, ConferenceData} from "../../conference"

class ResponseMessage {
    message : string ;
}

@Controller('/conf-crawler/conference')
export class ConferenceController {
    constructor(
        private readonly conferenceAdapterService: ConferenceAdapterService,
        private readonly conferenceService: ConferenceService
    ){}

    @Get()
    @ApiOperation({ summary: 'Find conferences' })
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: ConferenceAdapterData })
    public async findAll(): Promise<ConferenceAdapterData[]> {
        return this.conferenceAdapterService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Create conference' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ConferenceAdapterData })
    public async create(@Body() input: ConferenceAdapterInput): Promise<ConferenceAdapterData> {
        return this.conferenceAdapterService.create(input);
    }

    @Post('/import')
    @ApiOperation({ summary: 'Import conference for job work' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMessage })
    public async importConference(@Body() input :ConferenceAdapterInput ): Promise<{message : string}> {

        // check for exists conference in the database;
        const existsConferences = await this.conferenceService.findOne({
            acronym : input.Acronym, 
            name : input.Title,
        } as ConferenceData);

        if(existsConferences) {
            return {message : 'Conference already exists'};
        }


        return {message : 'Conference imported successfully'};
    }
}

