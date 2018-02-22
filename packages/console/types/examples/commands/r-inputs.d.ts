import { InputHelper, OutputHelper } from '../../';
export default class InputsCmd {
    ask: InputHelper;
    out: OutputHelper;
    handle(): Promise<void>;
}
