Console Output
==============

[Documentation](https://radic.io/npm-packages)

Install
-------
```bash
npm install -g @radic/console-output
```

Usage
-----

```typescript
import {Output} from '@radic/console-output';
const output=new Output()
output.line(`
{bold.red.underline}This is bold, red and underlined.{/red} But we dropped the red.{reset} And just resetted the rest.
{green.bgBlue.bold}We can also mix openers and closers{/bgBlue.bgYellow./bold./green.blue}And make it really silly.
{f(#333)}If support for 256 colors is present, you can use the RGB 0 - 6  values. Also, you can provide a fallback{f(#eee).bold.underline}

Fairly advanced things are possible
{b(green).f(red).bold.underline}Some text{/f.green./underline}greeen stuff{reset}
`)
```
