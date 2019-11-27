import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';
import autoprefixer from 'autoprefixer';
import magicImporter from 'node-sass-magic-importer';
import { types } from 'sass';

const namespace             = 'smu';
export const config: Config = {
    namespace,
    globalStyle  : 'src/scss/supermenu.scss',
    globalScript : 'src/global.ts',
    hashFileNames: false,
    devInspector : true,
    plugins      : [
        postcss({
            plugins: [
                autoprefixer({}),
            ],
        }),
        sass({
            indentedSyntax: false,
            outputStyle   : 'expanded',

            importer: magicImporter({
                extensions: [ 'scss', '.scss' ],
            }),

            functions: {
                'namespace': function () {
                    return new types.String(namespace);
                },
            },
        }),
    ],
    outputTargets: [ {
        type         : 'dist',
        esmLoaderPath: '../loader',
    }, {
        type: 'docs-readme',
    }, {
        type         : 'www',
        serviceWorker: null, // disable service workers
    } ],
};
