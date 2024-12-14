import { Controller, Get , Res } from "@nestjs/common";
import { Response } from "express";


@Controller('/')
export class ViewController  {
    constructor (){}

    @Get('/home')
    async root(@Res() res: Response) {
        return res.render('pages/public/home');
    }

    @Get('/browse')
    async browse(@Res() res: Response) {
        return res.render('pages/public/browse');
    }
    
    @Get('/post')
    async post(@Res() res: Response) {
        return res.render('pages/admin/manageConference');
    }
}