import {Body, Controller, Get, Post, PreconditionFailedException} from '@nestjs/common';

import {JournalService} from './journal.service';

import { JournalData,JournalInput } from './model';

@Controller('journal') 
export class JournalController {
    public constructor (
        private readonly journalService: JournalService 
    ){}

    @Get()
    public async find(): Promise<JournalData[]> {
        return  this.journalService.find();
    }

    @Post()
    public async create(@Body() input: JournalInput): Promise<JournalData> {
        try
        {
            const journal = await this.journalService.create(input);
            return journal;
        }catch(error) {
            console.log(error);
            throw new PreconditionFailedException('Some error occured when create journal');
        }
    }   
}