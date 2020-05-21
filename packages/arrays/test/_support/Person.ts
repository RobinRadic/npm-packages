import { IPerson } from './interfaces';
import { Address } from './Address';
import { Friend }  from './Friend';

export class Person implements IPerson {
    public _id: string;
    public about: string;
    public address: Address;
    public age: number;
    public balance: string;
    public company: string;
    public email: string;
    public eyeColor: string;
    public favoriteFruit: string;
    public friends: Friend[];
    public gender: string;
    public greeting: string;
    public guid: string;
    public index: number;
    public isActive: boolean;
    public latitude: number;
    public longitude: number;
    public name: string;
    public phone: string;
    public picture: string;
    public registered: string;
    public tags: string[];

    static fromObject(data: IPerson, target?: Person) {
        target = target || new this;
        Object.keys(data).forEach(key => {
            if ( key === 'address' ) {
                return target[ key ] = Address.fromObject(data[ key ]);
            }
            if ( key === 'friends' ) {
                return target[ key ] = data[ key ].map(data => Friend.fromObject(data));
            }
            target[ key ] = data[ key ];
        });
        return target;
    }
}
