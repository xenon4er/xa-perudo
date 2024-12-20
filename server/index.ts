import express, { Express } from "express";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import { short } from "../src/utils/uuid";
import {
    clientMessageToJSON,
    serverMessageToString,
} from "../src/models/message.model";
import { networkInterfaces } from "os";
export type WebSocketExtra = {
    id?: string;
} & WebSocket;

const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const portIdx = process.argv.indexOf("--port");
const port = portIdx === -1 ? 3000 : parseInt(process.argv[portIdx + 1]);

let host = "localhost";
const hostIdx = process.argv.indexOf("--host");
if (hostIdx !== -1) {
    const nets = networkInterfaces();
    const externalIpv4 = Object.values(nets).reduce(
        (res: string[], interfaces) => {
            if (interfaces) {
                for (const i of interfaces) {
                    if (!i.internal && i.family === "IPv4") {
                        res.push(i.address);
                    }
                }
            }
            return res;
        },
        [],
    );

    console.info("External IPv4 addresses:", externalIpv4);
    if (externalIpv4?.length) {
        host = externalIpv4[0];
    }
}

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

server.listen(port, host, () => {
    console.log(`[server]: Server is running at http://${host}:${port}`);
});
