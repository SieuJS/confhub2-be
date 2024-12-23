import { Module } from '@nestjs/common';
import { PaginateModule } from '../paginate/paginate.module';
import { CommonModule } from '../common';
import { ConferenceApiLintController } from './controller';
import { ConferenceApiLintService } from './service/conference-api-lint.service';

@Module({
    imports : [PaginateModule, CommonModule],
    controllers : [ConferenceApiLintController],
    providers : [ConferenceApiLintService],
    exports : [] 

})
export class ConfApiLintModule {}
