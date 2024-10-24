import { Body, Controller, Get, HttpStatus,  Param,  Post, PreconditionFailedException} from '@nestjs/common';
import { CallForPaperService } from './call-for-paper.service';
import { CallForPaperData, CallForPaperInput, ImportantDateData } from './model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('call-for-paper')
export class CallForPaperController {
    public constructor (
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
            return callForPaper;
        }catch(error) {
            // this.logger.error(`Error in creating call for papers ${error}`);
            console.log(error);
            throw new PreconditionFailedException('Some error occured when create call for papers');
        }
    }

    @Get(':cfp_id/important-dates')
    @ApiOperation({ summary: 'Find important dates of call for papers' })
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: CallForPaperData })
    public async getCFPImportantdates(@Param('cfp_id') cfp_id: string): Promise<ImportantDateData[]> {
        return  this.callForPaperService.getCFPImportantdates(cfp_id);
    }
    
    @Post(':cfp_id/important-dates')
    @ApiOperation({ summary: 'Add important dates of call for papers' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ImportantDateData })
    public async addCFPImportantdates(@Param('cfp_id') cfp_id: string, @Body() input: ImportantDateData): Promise<ImportantDateData> {
        try
        {
            const importantDate = await this.callForPaperService.addCFPImportantdates(cfp_id, input);
            return importantDate;
        }catch(error) {
            // this.logger.error(`Error in creating call for papers ${error}`);
            console.log(error);
            throw new PreconditionFailedException('Some error occured when create call for papers');
        }
    }
}
