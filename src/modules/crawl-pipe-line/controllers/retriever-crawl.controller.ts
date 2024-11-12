import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@Controller('conf-transfer')
@ApiTags('Crawl Pipeline')
export class ConferenceTransferController {
    constructor() {}

    @Post('retrival-node')
    async retrive() {

        return;
    }
}