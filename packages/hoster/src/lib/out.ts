import { Output } from '@radic/console-output';

export class Out extends Output {

}

export interface OutputMacros {
    success(msg: string)
}

let out: Out & OutputMacros = new Out() as any;
out.setMacro('success', function (this: Out, msg: string) {
    this.writeln('{green}' + msg);
});
out = Out.macroProxy<OutputMacros>(out);


export { out };
