import { context, suite, test } from 'mocha-typescript';
import { bootstrap } from './_support/bootstrap';
import { assert, should } from 'chai'
import { bootstrapRcli } from '../';
import { Cli } from '../';

bootstrap();


@suite
class BootstrapTest {
    @context mocha; // Set for instenace methods such as tests and before/after
    @context static mocha; // Set for static methods such as static before/after (mocha bdd beforeEach/afterEach)


    static before() {

    }


    before() {


    }

    @test
    bootstrapPromisesCliInstance() {
        bootstrapRcli().then((cli) =>{
            cli.should.be.instanceof(Cli);
        })
    }

}