const get = require('request-promise');
const {compile} = require('json-schema-to-typescript');
const {writeFileSync} = require('fs');
const {resolve} = require('path');

const config = {
    schemaUrl : 'https://getcomposer.org/schema.json',
    outputFile: 'src/composer.json.ts',
};

async function generate() {
    const schemaJson = await get(config.schemaUrl);
    const schema = JSON.parse(schemaJson);
    const type = await compile(schema, 'ComposerJSON', {});
    writeFileSync(resolve(__dirname, config.outputFile), type);
    console.log('generated');
}

try {
    generate();
} catch (e) {
    console.log(e.message);
}