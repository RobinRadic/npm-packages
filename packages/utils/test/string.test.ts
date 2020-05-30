import { suite, test } from 'mocha-typescript';
import { TestCase }    from './TestCase';
import stripLeft       from '../src/stripLeft';
import stripRight      from '../src/stripRight';
import ensureRight     from '../src/ensureRight';
import ensureLeft      from '../src/ensureLeft';


@suite('String')
class StringTest extends TestCase {

    @test('stripLeft()') testStripLeft() {
        stripLeft('asdffoo', 'asdf').should.equal('foo');
        stripLeft('asdffoo', 'foo').should.equal('asdffoo');
    }

    @test('stripRight()') testStripRight() {
        stripRight('asdffoo', 'foo').should.equal('asdf');
        stripRight('asdffoo', 'asdf').should.equal('asdffoo');
    }

    @test('ensureLeft()') testEnsureLeft() {
        ensureLeft('foo', 'asdf').should.equal('asdffoo');
        ensureLeft('asdffoo', 'asdf').should.equal('asdffoo');
    }

    @test('ensureRight()') testEnsureRight() {
        ensureRight('asdf', 'foo').should.equal('asdffoo');
        ensureRight('asdffoo', 'foo').should.equal('asdffoo');
    }

}
