import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConferenceModule } from '../conference';
import { CrawlConferenceService, ListenerService } from './service';
import { CrawlConferenceController } from './controller';
import { CommonModule, Config } from '../common';
import { CrawlConferenceProcessor } from './queue';
import { CrawlApiModule } from '../crawl-api';
import { NotifyCrawlGateway } from './gateway';
import {CacheModule, CacheStore} from '@nestjs/cache-manager'
import { Service } from '../tokens';
import { redisStore } from 'cache-manager-redis-yet';
import { CallForPaperModule } from '../call-for-paper';
import { ProcessCrawlToken } from './token';
import { CrawlEventListener } from './service/crawl-event-listener.service';

@Module({
    imports :[BullModule.registerQueue({
        name : ProcessCrawlToken.CRAWL_CONF_QUEUE_NAME,
        prefix : ProcessCrawlToken.CRAWL_CONF_QUEUE_PREFIX
    }), ConferenceModule, CallForPaperModule , CommonModule, CrawlApiModule,
        CacheModule.registerAsync({
            imports : [CommonModule],
            inject : [Service.CONFIG],
            useFactory: async (config : Config) => {
                const store = await redisStore({
                  socket: {
                    host: config.REDIS_HOST,
                    port: config.REDIS_PORT,
                  },
                });
                
                return {
                  store: store as unknown as CacheStore,
                  ttl: 3 * 60000, // 3 minutes (milliseconds)
                };
              },
        
        })],
    controllers : [CrawlConferenceController],
    providers : [CrawlConferenceService , CrawlConferenceProcessor, NotifyCrawlGateway, ListenerService, CrawlEventListener]
})
export class CrawlBullJobModule {}
