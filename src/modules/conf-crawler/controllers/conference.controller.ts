import { ConferenceService, ConferenceData, ConferenceInput } from "../modules";
import { Controller, HttpStatus , Get, Post, Body} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('/conf-crawler/conference')
export class ConferenceController {
    constructor(
        private readonly conferenceService: ConferenceService
    ){}

    @Get()
    @ApiOperation({ summary: 'Find conferences' })
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: ConferenceData })
    public async findAll(): Promise<ConferenceData[]> {
        return this.conferenceService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Create conference' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ConferenceData })
    public async create(@Body() input: ConferenceInput): Promise<ConferenceData> {
        return this.conferenceService.create(input);
    }
}

