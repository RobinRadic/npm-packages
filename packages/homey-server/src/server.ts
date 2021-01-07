import { createServer, IncomingMessage, ServerResponse } from 'http';
import { UserStorage }                                   from './UserStorage';
import moment                                            from 'moment';

type Handler = 'dop' | 'doplog' | 'clear_doplog'

interface ActionData {
    [ key: string ]: any
}

const handlerNames: Handler[] = [ 'dop', 'doplog', 'clear_doplog' ];
const isHandlerName           = (value: any): value is Handler => value && handlerNames.includes(value);


interface DoplogItem {
    time: string,
    timestamp: number,
    comment?: string
}

interface DoplogData {
    doppies: DoplogItem[]
}

class Doplog {
    static filePath = 'doplog.json';

    static clear() {
        UserStorage.removeFileIfExists(this.filePath);
        this.ensureFile();
    }

    static ensureFile() {
        if ( !UserStorage.exists(this.filePath) ) {
            this.write({ doppies: [] });
        }
    }

    static read(): DoplogData {
        this.ensureFile();
        let content = UserStorage.read(this.filePath);
        return JSON.parse(content);
    }

    static write(data: DoplogData) {
        const content = JSON.stringify(data, null, 4);
        UserStorage.write(this.filePath, content);
        return this;
    }

    static add(comment?: string) {
        let data = this.read();
        let date = moment(Date.now());
        data.doppies.push({
            time     : date.format('H:mm'),
            timestamp: Date.now(),
            comment,
        });
        this.write(data);
    }

    static getSize() {
        return this.read().doppies.length;
    }

    static getLast(ammount: number = 1) {
        return this.read().doppies.pop();
    }

    static getLatest(limit: number = 10) {
        return this.read().doppies.reverse().slice(0, limit);
    }
}

const handlers: Record<Handler, (data: ActionData, res: ServerResponse) => any> = {
    dop         : (data, res) => {
        Doplog.add();
        console.log('add dop', Doplog.getLast().time);
    },
    doplog      : (data, res) => {
        let now    = moment(Date.now());
        let result = Doplog.getLatest(3)
            .map(item => moment(item.timestamp))
            .map(timestamp => now.diff(timestamp, 'minutes'));
        let text   = Doplog.getLatest(3)
            .map(item => item.time)
            .join(' || ');
        return { result, text };
    },
    clear_doplog: (data, res) => {
        Doplog.clear();
        console.log('cleared doplog');
    },

};

const runHandler = async (name: Handler, data: ActionData, res: ServerResponse) => {
    let responseData = await handlers[ name ](data, res);
    return responseData || {};
};

export const server = createServer({}, (req: IncomingMessage, res: ServerResponse) => {
    let responseData               = { success: true };
    const { headers, method, url } = req;
    let handlerName                = url.replace(/^\//mi, '') as Handler;
    if ( !isHandlerName(handlerName) ) {
        res.writeHead(500, 'invalid route');
        res.end();
        return;
    }

    console.log(`request for handler "${handlerName}"`);

    let body: any = [];
    req
        .on('error', (err) => {
            console.error(err);
            res.writeHead(500, (err.message || err).toString());
            res.end();
        })
        .on('data', (chunk) => body.push(chunk))
        .on('end', async () => {
            body = Buffer.concat(body).toString();
            let data;
            try {
                data = JSON.parse(body) as ActionData;
            } catch ( e ) {
                data = {};
            }

            try {
                let responseData = await runHandler(handlerName, data, res);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(responseData, null, 4));
                console.log('response 200', { responseData });
                res.end();
            } catch ( e ) {
                console.log('response 500', e.message || e);
                res.writeHead(500, e.message || e);
                res.end();
            }
        });
});

