import { Module } from '@nestjs/common';
import { PaginateModule } from '../paginate/paginate.module';
import { CommonModule } from '../common';
import { ConferenceApiLintController } from './controller';

@Module({
    imports : [PaginateModule, CommonModule],
    controllers : [ConferenceApiLintController],
    providers : [],
    exports : [] 

})
export class ConfApiLintModule {}
