import { suite, test } from "mocha-typescript";
// noinspection ES6UnusedImports
import { Intellij, getPsr4FoldersFromComposerFiles,xmlEdit} from "../intellij";
import { paths } from './_support/paths';
import { copySync } from 'fs-extra';
import { bootstrap } from './_support/bootstrap';



let defaultConfig = {
    foo     : 'bar',
    fooNum  : 1,
    fooBool : true
}
@suite
class ConfigTest {
    static getProjectIMLPath:Function;

    /** once before all tests */
    static before() {
        bootstrap();
        ConfigTest.getProjectIMLPath = Intellij.getProjectIMLPath;
        Intellij.getProjectIMLPath = () => paths.fixtures('intellij/.idea/project.iml')
    }

    /** every before each test */
    before() {
        copySync(Intellij.getProjectIMLPath() + '.original', Intellij.getProjectIMLPath());
    }

    @test testPrepareArgumentVariations() {

    }

    // @test testParseArgumentsSome() {
    //     let parsed = parseArguments([ 'foo', 'bar', 'laat', 'die' ], this.config.arguments);
    //     let a      = parsed.arguments
    //     a[ 'name' ].should.eq('foo');
    //     a[ 'projects' ].should.contain.ordered.members([ 'bar', 'laat', 'die' ])
    //
    //     a[ 'num' ].should.eq(123);
    //     a[ 'nums' ].should.contain.ordered.members([ 123, 321 ])
    //     a[ 'bool' ].should.eq(true)
    //     a[ 'bools' ].should.contain.ordered.members([ true, false, true ])
    // }
}
