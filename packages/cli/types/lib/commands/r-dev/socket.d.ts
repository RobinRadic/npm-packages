/// <reference types="node" />
import { Socket } from "dgram";
import { CommandArguments, Config, Dispatcher, InputHelper, OutputHelper } from "radical-console";
import { UDPSocketFactory } from "../../services/sockets.udp";
export declare class SocketCmd {
    events: Dispatcher;
    config: Config;
    input: InputHelper;
    sockets: UDPSocketFactory;
    protected out: OutputHelper;
    send: boolean;
    port: number;
    handle(args: CommandArguments): Promise<any>;
    communicateWith(socket: Socket, port: number, host?: string): any;
}
export default SocketCmd;
