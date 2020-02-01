import { RollupOptions } from 'rollup';
import cleanup           from 'rollup-plugin-cleanup';
import typescript        from 'rollup-plugin-typescript2';


export default {
    input: 'src/*.ts',
    plugins: [
        cleanup({include:['umd','module','es6','esm','cjs']}),
        typescript({
            tsconfig: 'tsconfig.build.json'
        })
    ],
    output: [
        {dir: 'esm', format: 'esm', esModule:true, name:'@radic/utils' }
    ]
} as RollupOptions
