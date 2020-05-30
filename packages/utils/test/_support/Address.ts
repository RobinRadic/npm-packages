import { IAddress, IPerson } from './interfaces';

export class Address implements IAddress {
    public city: string;
    public number: number;
    public state: string;
    public street: string;

    static fromObject(data:IAddress, target?:Address){
        target = target || new this;
        Object.keys(data).forEach(key => {
            target[key] = data[key];
        })
        return target;
    }
}
