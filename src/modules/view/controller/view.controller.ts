import { Controller, Get , Query, Res } from "@nestjs/common";
import { Response } from "express";
import { ConferenceFilter, ConferenceService, ConferenceWithCfpsRankFootprintsData } from "../../conference";
import { FieldOfResearchService } from "../../field-of-research/service";
import { ConferenceRenderService } from "../service/conference-render.service";
import { CallForPaperService } from "../../call-for-paper";
import { SourceService } from "../../rank-source";
import { RankService } from "../../rank-source";
import { ApiQuery } from "@nestjs/swagger";
import parser from "any-date-parser";
import { PaginationArgs } from "../../paginate";
@Controller('/')
export class ViewController  {
    constructor (
        private readonly conferenceService: ConferenceService,
        private readonly fieldOfResearchService: FieldOfResearchService,
        private readonly conferenceRenderService: ConferenceRenderService,
        private readonly callForPaperService: CallForPaperService,
        private readonly sourceService: SourceService,
        private readonly rankService: RankService

    ){

    }

    @Get('/home')
    async root(@Res() res: Response) {
        const data = await this.conferenceService.find();
        const forDivisions = await this.fieldOfResearchService.findDivision({} as any);
        const forGroups = await this.fieldOfResearchService.findGroup({} as any);

        const allSources = await this.sourceService.find({} as any);

        const allRanks = await this.rankService.findRankOfSource({} as any);

        return res.render('pages/public/home', {data , forDivisions , forGroups , allSources , allRanks});
    }

    @Get('/browse')
    @ApiQuery({name : 'fromDate', type : 'string', required : false})
    @ApiQuery({name : 'toDate', type : 'string', required : false})
    @ApiQuery({name : 'location', type : 'string', required : false})
    @ApiQuery({name : 'name', type : 'string', required : false})
    @ApiQuery({name : 'acronym', type : 'string', required : false})
    @ApiQuery({name : 'source', type : 'string', required : false})
    @ApiQuery({name : 'rank', type : 'string', required : false})
    async browse(@Res() res: Response, @Query ()filter : ConferenceFilter , @Query() paginationArgs: PaginationArgs ) {
        filter = {
            ...filter , 
            fromDate : filter.fromDate ? parser.fromString(filter.fromDate).toDateString() : null,
            toDate : filter.toDate ? parser.fromString(filter.toDate).toDateString() : null,
            acronym : filter.name
        }
        const data = await this.conferenceService.find(filter,paginationArgs );
        const forDivisions = await this.fieldOfResearchService.findDivision({} as any);
        const forGroups = await this.fieldOfResearchService.findGroup({} as any);

        const allSources = await this.sourceService.find({} as any);

        const allRanks = await this.rankService.findRankOfSource({} as any);
        return res.render('pages/public/browse', {data, filter , forDivisions , forGroups , allSources , allRanks});
    }
    
    @Get('/post')
    async post(@Res() res: Response) {
        return res.render('pages/admin/manageConference');
    }

    @Get('/detail')
    async detail(@Res() res: Response , @Query('id') id: string) {
        try{
        const conference = await this.conferenceService.getDetailWithId(id);
        const mainCfp = this.conferenceRenderService.getMainCfp(conference as ConferenceWithCfpsRankFootprintsData);

        const datesOfMainCfp = await this.callForPaperService.getCFPImportantdates(mainCfp.id);

        return res.render('pages/public/conferenceDetail' , {conference , importantDates: datesOfMainCfp});
        }
        catch(e){
            return res.redirect('/browse');
        }
    }

    @Get('/create')
    async create(@Res() res: Response) {
        return res.render('pages/admin/createConference');
    }

}