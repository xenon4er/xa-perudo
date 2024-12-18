import express, { Express } from "express";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import { short } from "../src/utils/uuid";
import {
    clientMessageToJSON,
    serverMessageToString,
} from "../src/models/message.model";

export type WebSocketExtra = {
    id?: string;
} & WebSocket;

const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const port = process.argv[2] === "--port" ? process.argv[3] : 3000;

wss.on("connection", (ws: WebSocketExtra) => {
    console.log("New connection");

    ws.id = short();
    ws.send(
        serverMessageToString({
            type: "init",
            data: ws.id,
        }),
    );

    ws.on("message", (m) => {
        try {
            const message = clientMessageToJSON(m.toString());
            wss.clients.forEach((client: WebSocketExtra) => {
                if (
                    client.readyState === WebSocket.OPEN &&
                    client.id !== ws.id &&
                    (!message.to || client.id === message.to)
                ) {
                    client.send(
                        serverMessageToString({
                            type: "proxy",
                            data: message,
                        }),
                    );
                }
            });
            console.log(JSON.stringify(message, null, 2));
        } catch (e) {
            console.log(e);
        }
    });

    ws.on("error", (e) => {
        ws.send(
            serverMessageToString({
                type: "error",
                data: {
                    status: 500,
                    message: e.message,
                },
            }),
        );
    });

    ws.on("close", (code, reason) => {
        console.log(code, reason.toString());

        wss.clients.forEach((client: WebSocketExtra) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    serverMessageToString({
                        type: "leave",
                        data: ws.id!,
                    }),
                );
            }
        });
    });
});

server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
