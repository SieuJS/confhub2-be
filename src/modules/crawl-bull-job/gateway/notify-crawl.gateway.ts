import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CrawlConferenceService, ListenerService } from "../service";
import { Injectable } from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: "*", // Configure as per your needs
    },
})
@Injectable()
export class NotifyCrawlGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor (
        private readonly crawlConferenceService: CrawlConferenceService,

        private readonly listenerService : ListenerService
    ){}

    afterInit(server: Server) {
        console.log('Socket server initialized');
    }

    handleConnection(client: Socket) {
        console.log('a user connected: ' + client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('user disconnected: ' + client.id);
    }

    @SubscribeMessage('notify')
    handleNotify(client: Socket, message: string) {
        console.log('notify message received:', message);
        this.server.emit('notify', message);
    }

    @SubscribeMessage('crawl-new')
    async handleCrawl(client: Socket, conferenceId: string) {
        try {
            console.log('crawl-new message received:'+ conferenceId);
            const jobId = await this.crawlConferenceService.crawlNewConference(conferenceId);
             if(!jobId) {
            throw new Error("Job not created");
            }
            await this.listenerService.createOrAddToEvent(`watch-job-${jobId}`, client.id);
            console.log(`User ${client.id} watching job ${jobId}`);
            return {
                status : "Success",
                message : "Job created"
            }
        }
        catch (e) {
            return {
                status : "Error",
                message : e.message
            }
        }
    }

    public async notifyJob(jobId : string, status : string,message : string) {
        const users = await this.listenerService.getUsersForEvent(`watch-job-${jobId}`) as string[];
        if (users) {
            users.forEach(async user => {
                await console.log("Notifying user", user);
                this.server.to(user).emit('notify', {
                    jobId , 
                    status ,
                    message,
                });
            });
        }
    }



    public sendNotification(message: string) {
        this.server.emit('notify', message);
    }


}

export default NotifyCrawlGateway;