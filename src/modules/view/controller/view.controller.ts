import { Controller, Get , Res } from "@nestjs/common";
import { Response } from "express";


@Controller('view')
export class ViewController  {
    constructor (){}

    @Get('/')
    async root(@Res() res: Response) {
        return res.render('home');
    }
}