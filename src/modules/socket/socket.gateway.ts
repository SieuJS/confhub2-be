import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Client } from "pg";
import { Config, LoggerService } from "../common";
import { Inject, OnModuleDestroy } from "@nestjs/common";
import { Service } from "../tokens";
import * as fs from 'fs'
import { join } from "path";
import { ChangeNotifyData } from "./model";
import { JobWatcherService } from "./service/job-watcher.service";
import { JobService } from "../job";
@WebSocketGateway({
    cors: {
        origin: "*", // Configure as per your needs
    },
})
export class SocketGateway  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
    @WebSocketServer() 
    server: Server
    private pgClient: Client

    constructor(
        @Inject(Service.CONFIG)
        private readonly config: Config,
        private loggerService : LoggerService,
        private jobWatcherService : JobWatcherService,
        private jobService : JobService
    ) {
        
    }

    afterInit (server : Socket) {
        this.loggerService.info('Socket server initialized');
        this.pgClient = new Client({
            host : this.config.DB_HOST,
            port : this.config.DB_PORT,
            user : this.config.DB_USER,
            password : this.config.DB_PASSWORD,
            database : this.config.DB_NAME,
            ssl : {
                ca : fs.readFileSync( join(__dirname, '../../../prisma/confhub.crt')).toString(),
            }
        });

        this.pgClient
            .connect()
            .then(() => this.setupPostgresListener())
            .catch((err: Error) =>
                console.error("Failed to connect to PostgreSQL:", err)
            );
    }

    handleConnection(client: Socket) {
        this.loggerService.info('Client connected '  + client.id);
    }

    handleDisconnect(client: Socket) {
        this.jobWatcherService.deleteWatcher(client.id);
        this.loggerService .info('Client disconnected ' + client.id);
    }

    // Set up PostgreSQL listener
    private setupPostgresListener() {
        this.pgClient.query("LISTEN crawl_job_change_channel");

        this.pgClient.on("notification", async (msg: any) => {
            const payload : ChangeNotifyData = JSON.parse(msg.payload);
            this.loggerService.info("Received change from PostgreSQL:" + payload.operation);
            const job = payload.data ;

            if(payload.operation === 'INSERT' ) {
                this.server.emit("table_change", payload);
                await this.jobWatcherService.handleInsertJob(job);
            }

            if (payload.operation === 'UPDATE') {
                const watchers = await this.jobWatcherService.findWatchersOfJob(job.id);
                if (!watchers) return;
                const jobData = await this.jobService.getJobById(job.id);
                for (const watcher of watchers) {
                    this.server.to(watcher.socket_id).emit("job_update", jobData);
                }
            }

            this.server.emit("table_change", payload);
        });

        this.loggerService.info("PostgreSQL listener is ready and waiting for changes...");
    }

    // Example WebSocket message listener
    @SubscribeMessage("job")
    handleEvent(client: Socket, job : string): string {
        this.loggerService.info("Received data from client: " + job);
        this.jobWatcherService.createWatcher({
            socket_id : client.id,
            job_id : job
        })

        return "Received data: " + job;
    }
    // Handle cleanup on gateway shutdown
    async onModuleDestroy() {
        await this.pgClient.end(); // Clean up PostgreSQL client connection
    }
}
