import { Controller, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Service } from "../../tokens";
import { Config } from "../../common";
import { FieldOfResearchService } from "../service/for.service";
import { ConfigService } from "../../common";

@Controller("field-of-research")
@ApiTags("Field of Research")
export class FieldOfResearchController {
    public constructor(
        @Inject(Service.CONFIG)
        private readonly config: Config,
        private readonly fieldOfResearchService: FieldOfResearchService,
        private readonly configService: ConfigService
    ) {
        
        if (this.config.FIELD_CODE_LOADED === "no") {
            console.log(
                "Field of Research is ready" + this.config.FIELD_CODE_LOADED
            );
            this.fieldOfResearchService.loadFieldOfResearch();
            this.configService.changeFIELD_CODE_LOADED("yes");
        }
    }
}
