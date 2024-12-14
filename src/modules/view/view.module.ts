import { Module } from '@nestjs/common';
import { ViewController } from './controller';
import { ConferenceModule } from '../conference';

@Module({
    imports: [ConferenceModule],
    controllers: [ViewController],
})
export class ViewModule {}
