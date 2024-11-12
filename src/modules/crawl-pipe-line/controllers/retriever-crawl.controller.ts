import { Controller, Post } from "@nestjs/common";



@Controller('conf-transfer')
export class ConferenceTransferController {
    constructor() {}

    @Post('retrival-node')
    async retrive() {

        return;
    }
}