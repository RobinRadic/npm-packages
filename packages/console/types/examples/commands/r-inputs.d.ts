import { InputHelper, OutputHelper } from 'radical-console';
export default class InputsCmd {
    ask: InputHelper;
    out: OutputHelper;
    handle(): Promise<void>;
}
