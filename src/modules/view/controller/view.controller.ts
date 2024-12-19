import { Controller, Get , Res } from "@nestjs/common";
import { Response } from "express";
import { ConferenceService } from "../../conference";
import { FieldOfResearchService } from "../../field-of-research/service";


@Controller('/')
export class ViewController  {
    constructor (
        private readonly conferenceService: ConferenceService,
        private readonly fieldOfResearchService: FieldOfResearchService
    ){

    }

    @Get('/home')
    async root(@Res() res: Response) {
        const data = await this.conferenceService.find({});
        const forDivisions = await this.fieldOfResearchService.findDivision({} as any);
        const forGroups = await this.fieldOfResearchService.findGroup({} as any);

        return res.render('pages/public/home', {data , forDivisions , forGroups});
    }

    @Get('/browse')
    async browse(@Res() res: Response) {
        const data = await this.conferenceService.find({});

        return res.render('pages/public/browse', {data });
    }
    
    @Get('/post')
    async post(@Res() res: Response) {
        return res.render('pages/admin/manageConference');
    }

    @Get('/detail')
    async detail(@Res() res: Response) {
        return res.render('pages/public/conferenceDetail');
    }

    
}