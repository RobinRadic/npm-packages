import { Output } from '@radic/console-output';


export interface Out {

    error(msg: string)

    success(msg: string)
}

export class Out extends Output {

}

let out = new Out();


out.setMacro('success', function (this: Out, msg: string) {
    this.writeln('{green}' + msg);
});
out.setMacro('error', function (this: Out, msg: string) {
    this.writeln('{red.bold}' + msg);
});
out = Out.macroProxy<any>(out);


export { out };
