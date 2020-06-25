/// <reference types="chai" />
// import {  }    from 'mocha-typescript';
import { TestCase }       from './TestCase';
import { Output }         from '../src';
import { WritableStream } from 'memory-streams';
import { Writable }       from 'stream';

interface StdoutMock {
    original: Writable,
    mock: WritableStream,

    read(): string

    done(): void
}

describe('Output', () => {
    @suite('instance')
    class OutputTest extends TestCase {
        output: Output;
        stdout: StdoutMock;

        before() {
            this.output = new Output();
            this.stdout = this.mockStdout();
        }

        after() {
            this.stdout.done();
        }

        mockStdout(): StdoutMock {
            const out                  = this.output;
            const stdout               = out.stdout;
            let writer: WritableStream = out.stdout = new WritableStream({}) as any;
            const mock: StdoutMock     = {
                original: stdout,
                mock    : writer,
                read    : () => writer.toString(),
                done    : () => {out.stdout = stdout; },
            };
            return mock;
        }

        @test('instantiate')
        testInstantiate() {
            const output = new Output();
            output.should.be.an.instanceOf(Output);
        }

        @test('line()')
        testLine() {
            this.output.line();
            this.output.stdout.toString().should.equal('\n');
        }

        @test('line("with text")')
        testLineWithText() {
            this.output.line('with text');
            this.output.stdout.toString().should.equal('with text\n');
        }

        @test('write("with text")')
        testWrite() {
            this.output.write('with text');
            this.output.stdout.toString().should.equal('with text');
        }
    }
});
