import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";
import * as fs from "fs";
import * as path from "path";

import { FoRDivisionData, FoRDivisionInput, FoRGroupData, FoRGroupInput } from "../model";

@Injectable()
export class FieldOfResearchService {
    constructor(private readonly prismaService: PrismaService) {}

    async loadFieldOfResearch() {
        try {
            const dataPath = path.join(__dirname, "../json/forcode.json");
            const rawData = await fs.readFileSync(dataPath, "utf-8");
            const entries = await JSON.parse(rawData);

            const divisionCache: Record<string, string> = {};

            for (const entry of entries) {
                const { code, for: name } = entry;
                if (String(code).length <=  3) {
                    // Handle `for_division`
                    const division =
                        await this.prismaService.for_division.upsert({
                            where: { code: String(code) },
                            update: { name },
                            create: { code: String(code), name },
                        });
                    divisionCache[String(code)] = division.id;
                } else if (String(code).length <= 6) {
                    // Handle `for_group`
                    const divisionCode = String(code).slice(0, 2); // Extract parent division code

                    if (!divisionCache[divisionCode]) {
                        console.error(
                            `Division not found for group with code ${code}`
                        );
                        continue;
                    }
                    await this.prismaService.for_group.upsert({
                        where: { code: String(code) },
                        update: {
                            name,
                            division_id: divisionCache[divisionCode],
                        },
                        create: {
                            code: String(code),
                            name,
                            division_id: divisionCache[divisionCode],
                        },
                    });
                } else {
                    console.error(`Unexpected code format: ${code}`);
                }
            }
            console.log("Data imported successfully!");
        } catch (error: any) {
            console.error("Failed to load field of research data", error);
        }
    }

    async findOrCreateDivision(input : FoRDivisionInput) : Promise<FoRDivisionData> {
        let divisionGroup = await this.prismaService.for_division.upsert({
            where: { code : input.code },
            update: {  },
            create:  input  ,
        });

        return divisionGroup as FoRDivisionData ;
    }

    async findOrCreateGroup(input : FoRGroupInput) : Promise<FoRGroupData> {
        let group = await this.prismaService.for_group.upsert({
            where: { code : input.code },
            update: {  },
            create:  input  ,
        });
        return group as FoRGroupData;
    }

    async findDivision(filter: FoRDivisionData): Promise<FoRDivisionData[]> {
        const divisions = await this.prismaService.for_division.findMany({
            where: filter,
            include : {
                for_group : true
            }
        });
        return divisions as FoRDivisionData[];
    }

    async findGroup(filter: FoRGroupData): Promise<FoRGroupData[]> {
        const groups = await this.prismaService.for_group.findMany({
            where: filter
        });
        return groups as FoRGroupData[];
    }

}
