import { Controller, Post, HttpStatus, Body } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {Transactional} from "@nestjs-cls/transactional"
import { CallForPaperInput, CallForPaperService, ImportantDateInput } from "../../call-for-paper";

import { RankService } from "../../rank-source";

import { SourceService } from "../../rank-source";
import { ConferenceAdapterToCallForPaperPipe } from "../pipes";
import { ConferenceAdapterToImportantDatePipe } from "../pipes/conference-adapter-to-important-date.pipe";
import { ConferenceAdapterInput } from "../modules";
import { Decimal } from "@prisma/client/runtime/library";
import { FieldOfResearchService } from "../../field-of-research/service";
class ImportResponse {
    message: string;
}


@Controller('/pipe-line/retriever')
@ApiTags('Crawl Pipeline')
export class RetrieverCrawlController {
    constructor(
        private readonly callForPaperService: CallForPaperService,
        private readonly rankService: RankService,
        private readonly sourceService: SourceService,
        private readonly fieldOfReasearchService: FieldOfResearchService
    ) {}

    @Post('/import')
    @ApiOperation({ summary: 'Import conference from crawler' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ImportResponse })
    @ApiBody({ type: ConferenceAdapterInput })
    @Transactional()
    async importCallForPaper(@Body(ConferenceAdapterToCallForPaperPipe) input : CallForPaperInput , @Body(ConferenceAdapterToImportantDatePipe) importantDates : ImportantDateInput[], @Body() confAdapter : ConferenceAdapterInput  ) : Promise<ImportResponse> {
        const cfp = await this.callForPaperService.create(input);
        for (const importantDate of importantDates) {
            importantDate.cfp_id = cfp.id;
            await this.callForPaperService.createCFPImportantdates(importantDate);
        }

        const existsSource = await this.sourceService.findOrCreate({
            name : confAdapter.Source, 
            link : "",
        })
        const existsRank = await this.rankService.createOrFindRankOfSource({
            source_id : existsSource.id,
            rank : confAdapter.Rank,
            value :  new Decimal(0),
        })

        await confAdapter.PrimaryFoR.forEach(async field => {
            field = `${field}`.trim();
            const existForGroup = await this.fieldOfReasearchService.findOrCreateGroup({
                 code : field ,
                 name : "unknown"
            })

            console.log(new Decimal(parseInt(confAdapter.Source.slice(-4) as string)))

            await this.rankService.createRankOfCfp({
                cfp_id : cfp.id,
                rank_id : existsRank.id,
                year : new Decimal(parseInt(confAdapter.Source.slice(-4) as string)) ,
                for_group_id : existForGroup.id
            })
        })

        return {message : "Good"} ;
    }

    @Post('/import/test')
    @ApiResponse({ status: HttpStatus.CREATED, type: ImportResponse })
    @Transactional()
    async importCallForPaperTest(@Body(ConferenceAdapterToCallForPaperPipe) input : CallForPaperInput) : Promise<ImportResponse> {
        await this.callForPaperService.create(input);
        return {message : "Good"} ;
    }
}