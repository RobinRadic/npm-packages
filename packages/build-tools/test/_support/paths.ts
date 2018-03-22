import { resolve } from 'path';

export const paths = {
    fixtures: (...parts) => resolve(__dirname, '..', 'fixtures', ...parts)
}