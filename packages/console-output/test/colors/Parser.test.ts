/// <reference types="chai" />
import { context, suite, test } from 'mocha-typescript';
// import { assert, should } from 'chai'
import { colors, Output } from '../../src';
import { TestCase }       from '../TestCase';

@suite()
class ParserTest extends TestCase {
    @context mocha; // Set for instenace methods such as tests and before/after
    @context static mocha; // Set for static methods such as static before/after (mocha bdd beforeEach/afterEach)
    text: string;
    parser: colors.ColorsParser;
output:Output


    before() {
        this.parser = new colors.ColorsParser(null);

        this.text = `
{bold.red.underline}This is bold, red and underlined.{/red} But we dropped the red.{reset} And just resetted the rest.{b:blue.red}teetete
{f:yellow.b:blue.bold}We can also mix openers and closers{/b:blue.b:yellow./bold./f:yellow.blue}And make it really silly.
{b:red.bold.underline.b:#333.b:rgb(2,1,3)}Hex #333{reset}
`;

    }

    @test
    itCanCleanAllTagsInAText() {
        let cleaned = this.parser.clean(this.text);
        let exp     = /{(.*?)}/g;
        exp.test(cleaned).should.be.false;
    }

    @test
    itCanParseAllTagsInAText() {

        let parsed = this.parser.parse(this.text);
        let exp    = /{(.*?)}/g;
        exp.test(parsed).should.be.false;
    }
}
