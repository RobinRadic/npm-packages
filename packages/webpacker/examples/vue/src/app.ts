import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

export class Application extends Container{}

export const app = new Application()

export const {lazyInject: inject} = getDecorators(app);
