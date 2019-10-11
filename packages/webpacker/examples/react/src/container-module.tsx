import { ContainerModule } from 'inversify';
import { Store } from './components/Store';


export const containerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(Store).toSelf().inSingletonScope();
})
