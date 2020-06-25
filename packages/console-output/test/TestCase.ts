import { bootstrap } from './_support/bootstrap';

export abstract class TestCase {
    static before() { bootstrap(); }
}
