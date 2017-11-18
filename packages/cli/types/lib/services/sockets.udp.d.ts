/// <reference types="node" />
import { Socket } from "dgram";
import { Log } from "radical-console";
import { RConfig } from "../core/config";
export interface SocketFactorySocket {
    id: string;
    socket: Socket;
}
export declare class UDPSocketFactory {
    protected sockets: SocketFactorySocket[];
    protected server: Socket;
    protected client: Socket;
    config: RConfig;
    log: Log;
    constructor();
    create(id?: string, port?: number): Socket;
    createServer(): Socket;
    createClient(): Socket;
    protected ensureBinds(client: Socket, port: number): void;
}
