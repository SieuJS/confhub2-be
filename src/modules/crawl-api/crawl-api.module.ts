import { Module } from '@nestjs/common';
import { CrawlApiPipelineService } from './service';
import { CommonModule } from '../common';
@Module({
    imports: [CommonModule],
    providers: [CrawlApiPipelineService],
    controllers: [],
    exports: [CrawlApiPipelineService],
})
export class CrawlApiModule {}
