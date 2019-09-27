import { injectable } from 'inversify';
import { inject } from '../app';
import { Application } from '../classes/Application';
import { IConfig } from '../interfaces';
import { ApiDriver, DriverClass } from './interfaces';
// import Github from '@octokit/rest';




@injectable()
export class Bithub {
    @inject() app: Application;

    drivers: Record<string, ApiDriver> = {};

    driver(name: string): ApiDriver {
        return this.drivers[ name ];
    }

    register(name: string, cls: DriverClass) {
        const driver                = this.app.resolve<ApiDriver>(cls as any);
        driver.name                 = name;
        this.drivers[ driver.name ] = driver;
    };
}

@injectable()
export abstract class AbstractDriver {
    name?: string;
    @inject() app: Application;
    @inject() bithub: Bithub;
    @inject() config: IConfig;
}
