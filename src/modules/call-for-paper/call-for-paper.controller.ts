import { Body, Controller, Get, HttpStatus, Inject, Post, PreconditionFailedException} from '@nestjs/common';

import { LoggerService} from '../common';
import {Service} from '../tokens';
import { CallForPaperService } from './call-for-paper.service';
import { CallForPaperData, CallForPaperInput } from './model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('call-for-paper')
export class CallForPaperController {
    public constructor (
        @Inject(Service.CONFIG)
        private readonly logger: LoggerService,
        private readonly callForPaperService: CallForPaperService 
    ){}

    @Get()
    @ApiOperation({ summary: 'Find call for papers' })
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: CallForPaperData })
    public async find(): Promise<CallForPaperData[]> {
        return this.callForPaperService.find();
    }

    @Post()
    @ApiOperation({ summary: 'Create call for papers' })
    @ApiResponse({ status: HttpStatus.CREATED, type: CallForPaperData })
    public async create(@Body() input: CallForPaperInput): Promise<CallForPaperData> {
        try
        {
            const callForPaper = await this.callForPaperService.create(input);
            this.logger.info(`Created new call for papers with ID ${callForPaper.id}`);
            return callForPaper;
        }catch(error) {
            this.logger.error(`Error in creating call for papers ${error}`);
            throw new PreconditionFailedException('Some error occured when create call for papers');
        }
    }
}
