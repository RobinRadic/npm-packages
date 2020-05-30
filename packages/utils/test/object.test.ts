import { suite, test } from 'mocha-typescript';
import { spy }         from 'sinon';
import { TestCase }    from './TestCase';
import has             from '../src/has';
import get             from '../src/get';
import set             from '../src/set';
import {assert}     from 'chai';

// app list <type> [search]
//
// @command('list {type} {search?}')
// class ListCommand {
//     @option({
//         description: 'Show compact list',
//         char: 'c',
//         required: false
//     })
//     @option.required({
//         description: 'Show compact list',
//         char: 'c',
//     })
//     @option.required('Show compact list', 'c')
//     @option('Show compact list', 'c')
//     compact:boolean = false;
//
//     handle(){
//         if(this.compact){
//
//         }
//     }
// }

@suite('Object')
class ObjectTest extends TestCase {
    obj: any;

    before() {
        this.obj = {
            foo : {
                bar: true,
                car: {
                    engine: 1,
                },
            },
            bike: {
                wheels      : 4,
                transmission: 'manual',
            },
            name: 'test',
        };
    }

    @test('has()') testHas() {
        has(this.obj, 'foo.bar').should.equal(true, 'has("foo.bar")');
        has(this.obj, 'name').should.equal(true, 'has("name")');
        let hasSpy = spy(has);
        try {
            hasSpy(this.obj, 1 as any);
        } catch ( e ) {}
        hasSpy.threw('Error');
    }

    @test('get()') testGet() {
        get(this.obj, 'foo.bar').should.equal(true);
        get(this.obj, 'name').should.equal('test');
        assert.isUndefined(get(this.obj, 'does.not.exist'))
        get(this.obj, 'should.return.defaultValue', 'test').should.equal('test')
    }

    @test('set() override existing item') testSetOverrideExistingItem() {
        set(this.obj, 'foo.bar', 'test');
        this.obj.foo.bar.should.equal('test');
    }

    @test('set() new deeply item') testSetItem() {
        set(this.obj, 'deeply.created.item', 2);
        this.obj.deeply.created.item.should.equal(2);
    }

    @test('set() new deeply object') testSetObject() {
        set(this.obj, 'deeply.created.object', {
            first : true,
            second: 2,
        });
        this.obj.deeply.created.object.first.should.equal(true);
        this.obj.deeply.created.object.second.should.equal(2);
    }


}
