import { kindOf }      from '../src';
import { suite, test } from 'mocha-typescript';
import { TestCase }    from './TestCase';
import isString        from '../src/isString';
import isArray         from '../src/isArray';
import isBoolean       from '../src/isBoolean';
import isDate          from '../src/isDate';
import isError         from '../src/isError';
import isFunction      from '../src/isFunction';
import isNumber        from '../src/isNumber';
import isObject        from '../src/isObject';
import isRegExp        from '../src/isRegExp';

describe('kindOf()', () => {
    @suite('comparisons')
    class KindOfComparisonsTest extends TestCase {
        @test('string') testString() {
            kindOf('abc').should.equal('string');
        }

        @test('number') testNumber() {
            kindOf(123).should.equal('number');
        }

        @test('boolean') testBoolean() {
            kindOf(true).should.equal('boolean');
            kindOf(false).should.equal('boolean');
            kindOf(1).should.not.equal('boolean');
            kindOf('').should.not.equal('boolean');
        }

        @test('function') testFunction() {
            kindOf(() => {}).should.equal('function');
            kindOf(class {}).should.equal('function');
        }

        @test('regexp') testRegexp() {
            kindOf(/foo/).should.equal('regexp');
            kindOf(new RegExp('foo')).should.equal('regexp');
            kindOf('').should.not.equal('regexp');
        }

        @test('array') testArray() {
            kindOf([ 'foo' ]).should.equal('array');
            kindOf({ 'foo': 'bar' }).should.not.equal('array');
        }

        @test('date') testDate() {
            kindOf(new Date(Date.now())).should.equal('date');
        }

        @test('error') testError() {
            kindOf(new Error('sup')).should.equal('error');
        }
    }

    @suite('functions')
    class KindOfFunctionsTest extends TestCase {
        @test('isString') testIsString() {
            isString('abc').should.equal(true);
        }

        @test('isArray') testIsArray() {
            isArray(['a']).should.equal(true);
        }

        @test('isBoolean') testIsBoolean() {
            isBoolean(false).should.equal(true);
        }

        @test('isDate') testIsDate() {
            isDate(new Date(Date.now())).should.equal(true);
        }

        @test('isError') testIsError() {
            isError(new Error('test')).should.equal(true);
        }

        @test('isFunction') testIsFunction() {
            isFunction(()=>{}).should.equal(true);
            isFunction(class {}).should.equal(true);
        }

        @test('isNumber') testIsNumber() {
            isNumber(2).should.equal(true);
        }

        @test('isObject') testIsObject() {
            isObject({is:'object'}).should.equal(true);
        }

        @test('isRegExp') testIsRegExp() {
            isRegExp(/foo/).should.equal(true);
            isRegExp(new RegExp('bar')).should.equal(true);
            isRegExp('bar').should.equal(false);
        }
    }
});
