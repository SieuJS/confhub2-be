import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { RankSourceModule } from '../rank-source';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';

@Module({
    imports : [CommonModule, RankSourceModule],
    controllers: [JournalController],
    providers: [JournalService]
})
export class JournalModule {

}
