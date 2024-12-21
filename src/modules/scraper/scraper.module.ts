import { Module } from '@nestjs/common';
import { ScraperService } from './service';
import { ScraperController } from './controller';

@Module({
    providers : [ScraperService ],
    controllers : [ScraperController],
    exports : [ScraperService]
})
export class ScraperModule {}
