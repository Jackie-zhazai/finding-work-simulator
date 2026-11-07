import {readFileSync} from 'node:fs';
import ts from 'typescript';
const compile=name=>ts.transpileModule(readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const world=url(compile('world'));
const bank=url(compile('event-bank').replace(/(['"])\.\/world\1/g,JSON.stringify(world)));
const practice=url(compile('practice'));
export const practiceModule=await import(practice);
export const gameModule=await import(url(compile('game').replace(/(['"])\.\/world\1/g,JSON.stringify(world)).replace(/(['"])\.\/event-bank\1/g,JSON.stringify(bank)).replace(/(['"])\.\/practice\1/g,JSON.stringify(practice))));
