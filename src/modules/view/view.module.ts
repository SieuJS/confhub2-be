import { Module } from '@nestjs/common';
import { ViewController } from './controller';

@Module({
    controllers: [ViewController],
})
export class ViewModule {}
