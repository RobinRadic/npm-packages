import { Cli } from "@radic/console";

require('../src').bootstrapRcli().then((cli: Cli) => {
    cli.start(__dirname + '/../src/commands/r')
})    .catch((reason) => {

    throw new Error(reason);
})

