import { Body, Controller, Get, HttpStatus,  Param,  Post, PreconditionFailedException, Query, ParseIntPipe, DefaultValuePipe} from '@nestjs/common';
import { CallForPaperService } from './call-for-paper.service';
import { CallForPaperData, CallForPaperInput, ImportantDateData } from './model';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatorTypes} from '@nodeteam/nestjs-prisma-pagination'; 
import { bool } from 'joi';



@Controller('call-for-paper')
@ApiTags('Call For Paper')
export class CallForPaperController {
    public constructor (
        private readonly callForPaperService: CallForPaperService 
    ){}

    @Get('/')
    @ApiOperation({ summary: 'Find call for papers' })
    @ApiQuery({name : 'status', required : false, type : bool})
    @ApiResponse({ status: HttpStatus.OK, type: CallForPaperData }) 
    public async find(
        @Query('page',new DefaultValuePipe(1), ParseIntPipe) page : number,
        @Query('perPage',new DefaultValuePipe(3), ParseIntPipe) perPage : number,
    ): Promise<PaginatorTypes.PaginatedResult<CallForPaperData>> {
        const callForPapers = await this.callForPaperService.getCallForPapers({
            page,
            perPage
        });
        return callForPapers;
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
