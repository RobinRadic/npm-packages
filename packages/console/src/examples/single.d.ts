import "reflect-metadata";
import { CommandArguments, OutputHelper } from "..";
export default class  {
    out: OutputHelper;
    handle(args: CommandArguments, argv: string[]): void;
}
