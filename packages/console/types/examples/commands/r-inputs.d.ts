import { InputHelper, OutputHelper } from '@radic/console';
export default class InputsCmd {
    ask: InputHelper;
    out: OutputHelper;
    handle(): Promise<void>;
}
