import { resolve } from "path";


export class Paths {
    static sitesDir = 'sites';

    static cwd(...parts) {return resolve(process.cwd(), ...parts); }

}
