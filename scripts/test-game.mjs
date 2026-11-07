import assert from 'node:assert/strict';
import {gameModule} from './load-game.mjs';
const {createGame,eventFor,applyChoice,signature,TOTAL_STEPS,EVENT_COUNT,ending}=gameModule;
const routes=new Set(),events=new Set(),cities=new Set(),profiles=new Set(),names=new Set();
for(const grade of ['大二','大三','大四','研一','研二','研三'])for(let seed=1;seed<=100;seed++){
 let g=createGame('random',{grade},seed*293+7),previous=0;
 assert.deepEqual(g,createGame('random',{grade},seed*293+7));
 profiles.add(signature(g.profile));names.add(g.profile.name);cities.add(g.city);
 while(!g.complete){const original=JSON.stringify(g),ev=eventFor(g);assert.equal(ev.options.length,4);events.add(ev.id);const next=applyChoice(g,(seed+g.step*7)%4);assert.equal(JSON.stringify(g),original);assert.ok(next.month>=previous);previous=next.month;assert.equal(next.history.length,g.history.length+1);for(const[k,v]of Object.entries(next.stats)){assert.ok(Number.isFinite(v));if(k!=='money')assert.ok(v>=0&&v<=100);}g=next;routes.add(g.route);assert.ok(g.step<=TOTAL_STEPS);}
 assert.equal(g.history.length,TOTAL_STEPS);assert.equal(new Set(g.history.map(h=>h.eventId)).size,TOTAL_STEPS,'no duplicate events per run');assert.equal(g.month,g.gradMonth+24);assert.deepEqual(applyChoice(g,0),g);assert.ok(ending(g).summary.includes(g.city));
}
assert.ok(EVENT_COUNT>=100);assert.ok(events.size>=75,`event coverage ${events.size}`);assert.ok(profiles.size>580);assert.ok(cities.size>=20);assert.ok(routes.size>=8);
let recent={names:[],signatures:[],events:[]};for(let n=1;n<=100;n++){const g=createGame('random',{},n,recent);assert.ok(!recent.names.includes(g.profile.name));recent.names.push(g.profile.name);recent.signatures.push(signature(g.profile));}
let g=createGame('custom',{grade:'大四',city:'沈阳',family:'单亲家庭，家人支持但预算有限',direction:'游戏开发',school:'普通二本'},789);assert.equal(g.city,'沈阳');assert.equal(g.profile.direction,'游戏开发');while(g.step<10)g=applyChoice(g,0);const grad=g.gradMonth;g=applyChoice(g,2);assert.equal(g.gradMonth,grad+36);assert.equal(g.degree,'硕士');while(!g.complete)g=applyChoice(g,0);assert.equal(g.month,g.gradMonth+24);
let move=createGame('random',{city:'北京',hometown:'武汉'},91);while(move.step<11)move=applyChoice(move,0);const ev=eventFor(move);const mi=ev.options.findIndex(o=>o.action==='move-next');const moved=applyChoice(move,mi);assert.notEqual(moved.city,move.city);assert.ok(moved.stats.money<move.stats.money);assert.ok(moved.history.at(-1).outcome.includes('搬迁'));
const deterministic=createGame('random',{},13);assert.deepEqual(eventFor(deterministic),eventFor(deterministic));assert.throws(()=>applyChoice(deterministic,99));
console.log(JSON.stringify({passed:true,simulatedGames:600,totalSteps:TOTAL_STEPS,eventBank:EVENT_COUNT,eventsReached:events.size,uniqueProfiles:profiles.size,uniqueNames:names.size,cities:cities.size,routes:[...routes],checks:['seed reproducibility','immutable state','no repeated events','timeline','study','migration cost','locked fields','recent name dedup','detailed ending']},null,2));
