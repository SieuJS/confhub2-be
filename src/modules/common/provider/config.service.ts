import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { Injectable, Inject } from "@nestjs/common";
import { Service } from "../../tokens";
import { Config } from "../model";
import { cwd } from 'process';

@Injectable()
export class ConfigService {
    constructor (
        @Inject(Service.CONFIG)
        public readonly config: Config
    ){}
    changeFOR_READY(value: boolean): void {
        const key = 'FOR_READY'
        const environment_path = path.join(cwd.toString(), '/.env')
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