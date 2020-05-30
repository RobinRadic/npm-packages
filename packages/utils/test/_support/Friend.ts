import { IFriend, IPerson } from './interfaces';


export class Friend implements IFriend {
    public id: number;
    public name: string;

    static fromObject(data:IFriend, target?:Friend){
        target = target || new this;
        Object.keys(data).forEach(key => {
            target[key] = data[key];
        })
        return target;
    }
}
