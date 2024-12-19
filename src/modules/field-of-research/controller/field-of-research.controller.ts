import { Controller, HttpStatus, Inject, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Service } from "../../tokens";
import { Config } from "../../common";
import { FieldOfResearchService } from "../service/field-of-research.service";
import { ConfigService } from "../../common";
import { FoRDivisionData } from "../model";

@Controller("field-of-research")
@ApiTags("Field of Research")
export class FieldOfResearchController {
    public constructor(
        @Inject(Service.CONFIG)
        private readonly config: Config,
        private readonly fieldOfResearchService: FieldOfResearchService,
        private readonly configService: ConfigService
    ) {
        console.log(
            "Field of Research is read y" + this.config.FIELD_CODE_LOADED
        );
        if (this.config.FIELD_CODE_LOADED === "no") {
            console.log(
                "Field of Research is ready" + this.config.FIELD_CODE_LOADED
            );
            this.fieldOfResearchService.loadFieldOfResearch();
            this.configService.changeFIELD_CODE_LOADED("yes");
        }
    }

    @Get('/division') 
    @ApiResponse({status : HttpStatus.OK, type : FoRDivisionData, isArray : true})
    public async sendForDivision(): Promise<FoRDivisionData[]> {
        return this.fieldOfResearchService.findDivision({} as any);
    }

    @Get('/group')
    @ApiResponse({status : HttpStatus.OK, type : FoRDivisionData, isArray : true})
    public async sendForGroup(): Promise<FoRDivisionData[]> {
        return this.fieldOfResearchService.findGroup({} as any);
    }
}
