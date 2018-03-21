import { Dispatcher, InputHelper, Log, OutputHelper } from "@radic/console";
import { RConfig } from "./config";
import { Services } from "../services/Services";
import { ConnectHelper } from "../helpers/helper.connect";
export declare class BaseCommand {
    protected events: Dispatcher;
    protected log: Log;
    protected config: RConfig;
    protected out: OutputHelper;
    protected ask: InputHelper;
    protected returnError(msg: string, ...meta: any[]): boolean;
    protected returnInfo(msg: string, ...meta: any[]): boolean;
    protected returnLog(level: string, msg: string, ...meta: any[]): boolean;
    protected returnErrorLog(level: string, msg: string, ...meta: any[]): boolean;
    protected returnOk(msg?: string, level?: string, ...meta: any[]): boolean;
    protected promiseOk(msg?: string, level?: string, ...meta: any[]): Promise<boolean>;
    protected promiseLog(msg?: string, level?: string, ...meta: any[]): Promise<boolean>;
    protected promiseError(msg?: string, ...meta: any[]): Promise<never>;
}
export declare class BaseServiceCommand extends BaseCommand {
    protected services: Services;
    protected connect: ConnectHelper;
}
