import { start }  from './index';
import { Server } from 'http';

start().then((server: Server) => {
    console.log(`Server started`);
});
