class ExitHandler {
    protected static initialized = false;
    protected static handlers: Function[] = [];

    public static addHandler(handler: Function) {
        this.handlers.push(handler);
        return this
    }

    protected static  exitHandler(options, exitCode) {
        if ( options.cleanup ) console.log('clean');
        while(this.handlers.length){
            this.handlers.shift().call(null)
        }
        if ( exitCode || exitCode === 0 ) console.log(exitCode);
        if ( options.exit ) process.exit();
    }

    public static initialize() {
        if ( this.initialized ) {
            return this;
        }
        this.initialized = true;

        process.stdin.resume();//so the program will not close instantly
        process.on('exit', this.exitHandler.bind(this, { cleanup: true }));//do something when app is closing
        process.on('SIGINT', this.exitHandler.bind(this, { exit: true }));//catches ctrl+c event
        process.on('SIGUSR1', this.exitHandler.bind(this, { exit: true }));// catches "kill pid" (for example: nodemon restart)
        process.on('SIGUSR2', this.exitHandler.bind(this, { exit: true }));// catches "kill pid" (for example: nodemon restart)
        process.on('uncaughtException', this.exitHandler.bind(this, { exit: true }));//catches uncaught exceptions
    }

}

export function createExitHandler(handler: Function) {
    ExitHandler.addHandler(handler);
}
