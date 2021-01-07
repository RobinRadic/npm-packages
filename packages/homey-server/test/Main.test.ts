/// <reference types="chai" />
// import {  }    from 'mocha-typescript';
import { TestCase }       from './TestCase';
import { VERSION }        from '../src';
import { WritableStream } from 'memory-streams';
import { Writable }       from 'stream';

interface StdoutMock {
    original: Writable,
    mock: WritableStream,

    read(): string

    done(): void
}

@suite()
class MainTest extends TestCase {

    @test('version')
    testInstantiate() {
        VERSION.should.eq('1.0.0');
    }
}
