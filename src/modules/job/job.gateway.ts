import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Client } from "pg";
import { Config } from "../common";
import { Inject } from "@nestjs/common";
import { Service } from "../tokens";

@WebSocketGateway({
    cors: {
        origin: "*", // Configure as per your needs
    },
})
export class JobGateway {
    @WebSocketServer() 
    server: Server;
    private pgClient: Client;


    constructor(

        @Inject(Service.CONFIG)
        private readonly config: Config,

    ) {
        // Initialize PostgreSQL client
        this.pgClient = new Client({
            user: this.config.DB_USER,
            host: this.config.DB_HOST,
            database: this.config.DB_NAME,
            password: this.config.DB_PASSWORD,
            port: this.config.DB_PORT,
        });

        this.pgClient
            .connect()
            .then(() => this.setupPostgresListener())
            .catch((err: Error) =>
                console.error("Failed to connect to PostgreSQL:", err)
            );
    }

    // Set up PostgreSQL listener
    private setupPostgresListener() {
        this.pgClient.query("LISTEN table_change_channel");

        this.pgClient.on("notification", (msg: any) => {
            const payload = JSON.parse(msg.payload);
            console.log("Received change from PostgreSQL:", payload);

            // Emit the change event to all connected Socket.IO clients
            this.server.emit("table_change", payload);
        });

        console.log("PostgreSQL listener is ready and waiting for changes...");
    }

    // Example WebSocket message listener
    @SubscribeMessage("events")
    handleEvent(client: any, data: any): string {
        console.log("Received data from client:", data);
        return "Received data: " + data;
    }

    // Handle cleanup on gateway shutdown
    async onModuleDestroy() {
        await this.pgClient.end(); // Clean up PostgreSQL client connection
    }
}
