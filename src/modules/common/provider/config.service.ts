import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { Injectable, Inject } from "@nestjs/common";
import { Service } from "../../tokens";
import { Config } from "../model";
@Injectable()
export class ConfigService {
    constructor (
        @Inject(Service.CONFIG)
        public readonly config: Config
    ){

    }
    changeFIELD_CODE_LOADED(value: string): void {
        const key = 'FIELD_CODE_LOADED'
        const environment_path = path.join(__dirname, '../../../../.env')
        const ENV_VARS = fs.readFileSync(environment_path, 'utf8').split(os.EOL)
    
        const line = ENV_VARS.find((line: string) => {
            return line.match(`(?<!#\\s*)${key}(?==)`)
        })
    
        if (line) {
            const target = ENV_VARS.indexOf(line as string)
            if (target !== -1) {
                ENV_VARS.splice(target, 1, `${key}=${value}`)
            } else {
                ENV_VARS.push(`${key}=${value}`)
            }
        }
        fs.writeFileSync(environment_path, ENV_VARS.join(os.EOL))
    }
}