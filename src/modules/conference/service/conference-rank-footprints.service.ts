import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";
import { ConferenceRankFootPrintsData, ConferenceRankFootPrintsInput } from "../model";

@Injectable()
export class ConferenceRankFootPrintsService {
    public constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async find(filter: ConferenceRankFootPrintsData): Promise<ConferenceRankFootPrintsData[]> {
        const footprints = await this.prismaService.conference_rank_footprints.findMany({
            where: filter
        });

        return footprints.map(footprint => new ConferenceRankFootPrintsData(footprint));
    }

    public async create(data: ConferenceRankFootPrintsInput): Promise<ConferenceRankFootPrintsData> {
        const footprint = await this.prismaService.conference_rank_footprints.create({
            data
        });

        return new ConferenceRankFootPrintsData(footprint);
    }

}