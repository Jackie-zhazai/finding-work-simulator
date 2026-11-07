import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../lib/game.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {createGame,eventFor,applyChoice}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const routes=new Set();
for(const grade of ['大二','大三','大四','研一','研二','研三']){
 for(let seed=1;seed<=50;seed++){
  let g=createGame('random',{grade},seed),previous=0;
  const repeat=createGame('random',{grade},seed);assert.deepEqual(g,repeat);
  while(!g.complete){const before=JSON.stringify(g);const e=eventFor(g);assert.equal(e.options.length,4);const choice=(seed+g.step)%4;const next=applyChoice(g,choice);assert.equal(JSON.stringify(g),before,'immutable transition');assert.ok(next.month>=previous,'monotonic timeline');previous=next.month;assert.equal(next.history.length,g.history.length+1);for(const[k,v]of Object.entries(next.stats)){assert.ok(Number.isFinite(v));if(k!=='money')assert.ok(v>=0&&v<=100);}g=next;}
  assert.equal(g.history.length,12);assert.equal(g.month,g.gradMonth+24);assert.deepEqual(applyChoice(g,0),g);routes.add(g.route);
 }
}
let g=createGame('custom',{grade:'大四'},42);while(g.step<4)g=applyChoice(g,0);const grad=g.gradMonth;g=applyChoice(g,2);assert.equal(g.gradMonth,grad+36);while(!g.complete)g=applyChoice(g,0);assert.equal(g.month,g.gradMonth+24);
assert.throws(()=>applyChoice(createGame('random',{},4),99));
console.log('PASS: 300 seeded full games; six grades; immutable transitions; bounds; graduation/study; final state; invalid options.');
console.log('Routes reached:',[...routes].join(', '));
