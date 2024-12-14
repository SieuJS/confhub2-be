import { Controller, Get , Res } from "@nestjs/common";
import { Response } from "express";
import { ConferenceService } from "../../conference";


@Controller('/')
export class ViewController  {
    constructor (
        private readonly conferenceService: ConferenceService
    ){

    }

    @Get('/home')
    async root(@Res() res: Response) {
        const data = await this.conferenceService.find({});
        return res.render('pages/public/home', {data});
    }

    @Get('/browse')
    async browse(@Res() res: Response) {
        const data = await this.conferenceService.find({});
        return res.render('pages/public/browse', {data});
    }
    
    @Get('/post')
    async post(@Res() res: Response) {
        return res.render('pages/admin/manageConference');
    }
}