import { WebSocket, WebSocketServer } from "ws";
import express, { Express } from "express";
import { networkInterfaces } from "os";
import http from "http";
import {
    clientMessageToJSON,
    serverMessageToString,
} from "./utils/message.utils";

export type WebSocketExtra = {
    id?: string;
} & WebSocket;

const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const portIdx = process.argv.indexOf("--port");
const port =
    portIdx === -1
        ? process.env.SERVER_PORT
            ? parseInt(process.env.SERVER_PORT)
            : 3000
        : parseInt(process.argv[portIdx + 1]);

const isDev = process.env.NODE_ENV !== "production";

function log(message?: any, ...optionalParams: any[]): void {
    if (!isDev) {
        return;
    }
    console.log(message, optionalParams);
}

function getId(clients: Set<WebSocketExtra>): string {
    const clientsIds = new Set();
    clients.forEach((c) => clientsIds.add(c.id));

    let i = 0;
    while (clientsIds.has(i.toString())) {
        i++;
    }

    return i.toString();
}

app.get("/ping", function (req, res) {
    res.send("pong");
});

wss.on("connection", (ws: WebSocketExtra) => {
    log("New connection");

    ws.id = getId(wss.clients);
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
            log(JSON.stringify(message, null, 2));
        } catch (e) {
            console.error(e);
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
        log(code, reason.toString());

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

server.listen(port, "0.0.0.0", () => {
    const externalIpv4 = Object.values(networkInterfaces()).reduce(
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

    console.info(`[server]: Server is running at:`);
    console.info(`\thttp://localhost:${port}`);
    for (const ip of externalIpv4) {
        console.info(`\thttp://${ip}:${port}`);
    }
});
