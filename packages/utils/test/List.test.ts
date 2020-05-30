import { List }        from '../src';
import { Person }      from './_support/Person';
import { bootstrap }   from './_support/bootstrap';
import _data           from './_support/data.json';
import { suite, test } from 'mocha-typescript';

describe('List', () => {
    abstract class ListTestCase {
        list: List<Person>;
        persons:Person[]

        static before() { bootstrap(); }

        before() {
            this.persons = _data.map(data => Person.fromObject(data));
            this.list   = new List(...this.persons);
        }
    }


    @suite('Array functionality')
    class ArrayFunctionality extends ListTestCase {
        @test('array access') testOnly() {
            for(let i=0; i<this.persons.length; i++) {
                this.list[ i ].should.equal(this.persons[ i ])
            }
        }
        @test('length') testWithout() {
            this.list.length.should.equal(this.persons.length)
        }
    }

    @suite('Simple methods')
    class SimpleMethods extends ListTestCase {
        @test('first()') testFirst() {
            this.list.first().should.equal(this.persons[0])
        }
        @test('last()') testLast() {
            this.list.last().should.equal(this.persons[this.persons.length-1])
        }
        @test('only()') testOnly() {
            let only = this.list.only([ this.list[0], this.list.last() ]);
        }
        @test('without()') testWithout() {
            let only = this.list.only([ this.list.first(), this.list.last() ]);
        }
        @test('isEmpty()') testisEmpty() {
            (new List()).isEmpty().should.be.true
            this.list.isEmpty().should.be.false
        }
        @test('isNotEmpty()') testisNotEmpty() {
            (new List()).isNotEmpty().should.be.false
            this.list.isNotEmpty().should.be.true
        }
    }

    @suite('Wrapping')
    class Wrap extends ListTestCase {

    }

    @suite('Where method variations')
    class Where extends ListTestCase {
        @test('test generic things') testVarious() {
            'a'.should.equal('a');
            this.list.firstWhere('address.number', '===', 409).name.should.equal('Lambert Sears');
            this.list.where('gender', '===', 'male').should.be.lengthOf(2, 'issue with comparison operator === ');
            this.list.where('gender', '!==', 'male').should.be.lengthOf(5, 'issue with comparison operator !== ');
            // this.list.get('foo').should.eq('bar')
            // this.list.get().should.keys(Object.keys(defaultConfig))
            // this.list.has('foo').should.be.true;
            // this.list.raw('foo').should.eq('bar');
            // this.list.merge({ foo: 'foobar' });
            // this.list.get('foo').should.eq('foobar');
            // this.list.set('foo', false);
            // this.list.get('foo', false).should.be.false;
        }

        @test('test comparison operator: ===') testWhereEqualStrict() {
            this.list.where('gender', '===', 'male').should.be.lengthOf(2);
        }

        @test('test comparison operator: !==') testWhereNotEqualStrict() {
            this.list.where('gender', '!==', 'male').should.be.lengthOf(5);
        }

        @test('test comparison operator: ==') testWhereEqual() {
            this.list.where('gender', '==', 'male').should.be.lengthOf(2);
        }

        @test('test comparison operator: !=') testWhereNotEqual() {
            this.list.where('gender', '!=', 'male').should.be.lengthOf(5);
        }


    }

});
