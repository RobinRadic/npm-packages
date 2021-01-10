import { bootstrap }        from './_support/bootstrap';
import { suite, test }      from 'mocha-typescript';
import { LaravelClearLogs } from '../../../lib';

describe('rt', () => {
    abstract class RCTestCase {
        // list: List<Person>;
        // persons:Person[]

        static before() { bootstrap(); }

        before() {
            // this.persons = _data.map(data => Person.fromObject(data));
            // this.list   = new List(...this.persons);
        }
    }


    @suite('Basics')
    class Basics {
        @test('instance') testInstance() {
            const lcl = new LaravelClearLogs();
            lcl.should.be.a.instanceOf(LaravelClearLogs)
        }
    }

});
