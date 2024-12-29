import { WebSocket, WebSocketServer } from "ws";
import express, { Express } from "express";
import { networkInterfaces } from "os";
import http from "http";
import {
    clientMessageToJSON,
    serverMessageToString,
} from "./utils/message.utils";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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

const isDev = process.argv.indexOf("--prod") === -1;

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
    console.log("New connection");

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
            if (isDev) console.log(JSON.stringify(message, null, 2));
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

server.listen(port, "0.0.0.0", () => {
    console.log(`[server]: Server is running at http://${host}:${port}`);
});
