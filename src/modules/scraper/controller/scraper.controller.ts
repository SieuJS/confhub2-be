// src/conferences/conferences.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from '../service/';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly sraperService: ScraperService) {}

  @Get('search')
  async search(@Query('title') title: string, @Query('acronym') acronym: string) {
    if (!title || !acronym) {
      return { error: 'Title and acronym are required' };
    }
    return this.sraperService.searchConferences(title, acronym);
  }
}