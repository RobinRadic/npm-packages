import { Bithub } from './Bithub';
import { Driver, FullRepository, User } from './interfaces';

export abstract class BithubResponse<T> {
    constructor(protected driver:Driver, protected data:FullRepository) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get(): any {
                    return data[key]
                },
            })
        })
    }
}

export interface BithubRepository extends FullRepository{

}
export class BithubRepository extends BithubResponse<FullRepository>{

    createWebhook() {}

    isPackagistPackage() {}

    hasPackagistWebhook() {}

    createPackagistPackage() {}

    createPackagistWebhook() {}

    getFile(){}
}

export interface BithubUser extends User{

}
export class BithubUser extends BithubResponse<User>{

    createWebhook() {}

    isPackagistPackage() {}

    hasPackagistWebhook() {}

    createPackagistPackage() {}

    createPackagistWebhook() {}

    getFile(){}
}
