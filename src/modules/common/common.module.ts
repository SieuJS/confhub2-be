import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './controller';
import { LogInterceptor } from './flow';
import { configProvider, LoggerService, PrismaService, ConfigService } from './provider';

@Module({
    imports: [
        TerminusModule,
    ],
    providers: [
        configProvider,
        LoggerService,
        LogInterceptor,
        PrismaService,
        ConfigService
    ],
    exports: [
        configProvider,
        LoggerService,
        LogInterceptor,
        PrismaService,
        ConfigService
    ],
    controllers: [
        HealthController
    ],
})
export class CommonModule {}
