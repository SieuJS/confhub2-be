import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ListenerService {
    constructor (
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    public async createOrAddToEvent(event : string, userId : string) {
        const exists = await this.cacheManager.get(event) as string[];
        if (exists) {
            await this.cacheManager.set(event, [...exists, userId]);
        } else {
            await this.cacheManager.set(event, [userId]);
        }
    }

    public async removeUserFromEvent(event : string, userId : string) {
        const exists = await this.cacheManager.get(event) as string[];
        if (exists) {
            await this.cacheManager.set(event, exists.filter(id => id !== userId));
        }
    }

    public async getUsersForEvent(event : string) {
        return await this.cacheManager.get(event) as string[];
    }

    public async clearJobEvent(jobId : string) {
        const conferenceId = await this.cacheManager.get(`job-${jobId}`) as string;
        await this.cacheManager.del(`watch-job-${jobId}`);
        await this.cacheManager.del(`crawl-job-for-${conferenceId}`);
        await this.cacheManager.del(`job-${jobId}`);


    }
}