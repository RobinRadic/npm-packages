/// <reference types="@types/chai" />
/// <reference types="mocha-typescript" />
// import {  }    from 'mocha-typescript';
import { TestCase }                       from './TestCase';
import { Input }                          from '../src';
import { createPromptModule }             from 'inquirer';
import { ReadableStream, WritableStream } from 'memory-streams';

@suite('Input')
class InputTest extends TestCase {
    input: ReadableStream;
    output: WritableStream;

    before() {
        // this.input   = new ReadableStream('');
        // this.output  = new WritableStream({});
        // Input.prompt = createPromptModule({
        //     input : this.input as any,
        //     output: this.output as any,
        // });
    }

    @test('methods')
    async testInput() {
        const methods = [
            'question',
            'input',
            'confirm',
            'checkbox',
            'list',
            'path',
            'directory',
            'editor',
        ];
        for ( const method of methods ) {
            expect(Input[ method ]).instanceOf(Function);
        }
    }
}

