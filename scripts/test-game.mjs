import assert from 'node:assert/strict';
import {gameModule,practiceModule} from './load-game.mjs';
const {createGame,eventFor,applyChoice,signature,totalSteps,outcomePath,RANDOM_STEPS,TOTAL_STEPS,EVENT_COUNT,ending}=gameModule;
for(const focus of practiceModule.FOCUSES){
 const brief={focus,hours:'每周 3 小时',deadline:'两周内'};
 let game=createGame('custom',{},17342,{},brief);
 while(!game.complete){
  const event=eventFor(game);
  if(!game.pendingOffer&&game.step===4){assert.equal(event.title,focus);assert.ok(event.question);assert.match(event.options[3].label,/一小时/);}
  if(!game.pendingOffer&&game.step===7)assert.match(event.body,/一小时做了初步验证/);
  if(!game.pendingOffer&&game.step===12)assert.ok(event.question);
  game=applyChoice(game,!game.pendingOffer&&game.step===4?3:0);
 }
 assert.equal(game.history.filter(entry=>entry.eventId.startsWith('practice-')).length,3);
 assert.ok(game.history.some(entry=>/^practice-\d+-plan$/.test(entry.eventId)));
}
const routes=new Set(),events=new Set(),cities=new Set(),profiles=new Set(),names=new Set();
for(const grade of ['大二','大三','大四','研一','研二','研三'])for(let seed=1;seed<=100;seed++){
 let g=createGame('random',{grade},seed*293+7),previous=0;
 assert.deepEqual(g,createGame('random',{grade},seed*293+7));
 profiles.add(signature(g.profile));names.add(g.profile.name);cities.add(g.city);
 while(!g.complete){const original=JSON.stringify(g),ev=eventFor(g);if(!g.pendingOffer){assert.equal(ev.options.length,4);events.add(ev.id);}const next=applyChoice(g,(seed+g.history.length*7)%ev.options.length);assert.equal(JSON.stringify(g),original);assert.ok(next.month>=previous);previous=next.month;assert.equal(next.history.length,g.history.length+1);for(const[k,v]of Object.entries(next.stats)){assert.ok(Number.isFinite(v));if(k!=='money')assert.ok(v>=0&&v<=100);}g=next;routes.add(g.route);assert.ok(g.step<=TOTAL_STEPS);}
 assert.equal(g.step,RANDOM_STEPS);assert.equal(g.step,totalSteps(g));assert.equal(new Set(g.history.map(h=>h.eventId)).size,g.history.length,'no duplicate events per run');assert.equal(new Set(g.history.map(h=>h.id)).size,g.history.length);assert.equal(g.month,g.gradMonth+24);assert.deepEqual(applyChoice(g,0),g);assert.ok(ending(g).summary.includes(g.city));
}
assert.ok(EVENT_COUNT>=100);assert.ok(events.size>=75,`event coverage ${events.size}`);assert.ok(profiles.size>580);assert.ok(cities.size>=20);assert.ok(routes.size>=8);
let recent={names:[],signatures:[],events:[]};for(let n=1;n<=100;n++){const g=createGame('random',{},n,recent);assert.ok(!recent.names.includes(g.profile.name));recent.names.push(g.profile.name);recent.signatures.push(signature(g.profile));}
let g=createGame('custom',{grade:'大四',city:'沈阳',family:'单亲家庭，家人支持但预算有限',direction:'游戏开发',school:'普通二本'},789);assert.equal(g.city,'沈阳');assert.equal(g.profile.direction,'游戏开发');while(g.step<10||g.pendingOffer)g=applyChoice(g,0);const grad=g.gradMonth;g=applyChoice(g,2);assert.equal(g.gradMonth,grad+36);assert.equal(g.degree,'硕士');while(!g.complete)g=applyChoice(g,0);assert.equal(g.month,g.gradMonth+24);
let move=createGame('custom',{city:'北京',hometown:'武汉'},91);while(move.step<11||move.pendingOffer)move=applyChoice(move,0);const ev=eventFor(move);const mi=ev.options.findIndex(o=>o.action==='move-next');const moved=applyChoice(move,mi);assert.notEqual(moved.city,move.city);assert.ok(moved.stats.money<move.stats.money);assert.ok(moved.history.at(-1).outcome.includes('搬迁'));
const deterministic=createGame('random',{},13);assert.deepEqual(eventFor(deterministic),eventFor(deterministic));assert.throws(()=>applyChoice(deterministic,99));
const genders=[];
for(let i=0;i<30;i++){
 const game=createGame('random',{},i*9351,{genders});
 genders.push(game.profile.gender);
 if(i%5===4)assert.equal(genders.slice(-5).filter(gender=>gender==='男').length,3);
}
assert.equal(createGame('custom',{gender:'女'},99,{genders:['女','女']}).profile.gender,'女');

// Play full runs through the normal choices, starting without an internship or substantial project.
const weakEndings=new Set();
for(let seed=1;seed<=1400;seed++){
 const start=createGame('random',{grade:'大二',gpa:'课程有短板',internship:'暂无实习',project:'只有课程作业，尚无完整项目'},Math.imul(seed,1597334677)>>>0);
 if(start.stats.skill>34)continue;
 let game=start;
 while(!game.complete){
  const event=eventFor(game);
  const choice=(Math.imul(seed+game.history.length*37,0x9e3779b9)>>>22)%event.options.length;
  assert.ok(event.options.filter(option=>option.hint).length<=1);
  if(!/r-/.test(event.id))assert.ok(!event.body.includes('你现在在'));
  game=applyChoice(game,choice);
 }
 weakEndings.add(ending(game).track);
}
let student=createGame('random',{grade:'大二',internship:'暂无实习'},7309);
while(!student.complete){
 const options=eventFor(student).options;
 const safe=options.findIndex(option=>!option.route&&!/^(apply|bridge|freelance)/.test(option.action||''));
 student=applyChoice(student,student.pendingOffer?options.length-1:student.step===5?2:Math.max(0,safe));
}
weakEndings.add(ending(student).track);
for(const routeChoice of [1,2,3]){
 for(let seed=1;seed<=55;seed++){
  let game=createGame('random',{grade:'大二',internship:'暂无实习',project:'只有课程作业，尚无完整项目'},Math.imul(seed,1597334677)>>>0);
  if(game.stats.skill>34)continue;
  while(!game.complete){
   const event=eventFor(game);
   const focused=event.options.findIndex(option=>option.action==='apply');
   const stable=event.options.findIndex(option=>!option.route&&!option.action);
   const index=game.pendingOffer?0:game.step===5?routeChoice:game.step===10?3:game.step>=9&&focused>=0?focused:Math.max(0,stable);
   game=applyChoice(game,index);
  }
  weakEndings.add(ending(game).track);
 }
}
console.log('Weak-start endings:',[...weakEndings].sort().join('、'));
for(const track of ['开发','测试 / 质量','其他技术','产品 / 运营','行业转向','研究 / 深造','考试与公共服务','自由职业','过渡就业','休整与探索','继续求职','完成深造']){
 assert.ok(weakEndings.has(track),`Weak starting profiles could not reach ${track}`);
}
let offered;
for(let seed=1;seed<=100&&!offered;seed++){
 let run=createGame('random',{},seed*33133);
 while(!run.complete&&!(run.pendingOffer?.job.stage==='正式工作')){
  const options=eventFor(run).options;
  const apply=options.findIndex(option=>option.action?.startsWith('apply'));
  run=applyChoice(run,run.pendingOffer?options.length-1:Math.max(0,apply));
 }
 if(run.pendingOffer)offered=run;
}
assert.ok(offered?.pendingOffer);
const held=applyChoice(offered,1);
assert.ok(held.pendingOffer?.reviewed);
assert.equal(held.month,offered.month);
assert.deepEqual(held.employment,offered.employment);
const rejected=applyChoice(held,1);
assert.deepEqual(rejected.employment,offered.employment);
assert.equal(rejected.pendingOffer,undefined);
const accepted=applyChoice(held,0);
assert.equal(accepted.employment?.title,offered.pendingOffer.job.title);
assert.equal(accepted.employment?.monthly,offered.pendingOffer.job.monthly);
assert.ok(outcomePath(accepted).some(entry=>entry.id===accepted.employment.sourceId));
assert.ok(outcomePath(accepted).some(entry=>entry.id===accepted.employment.decisionId));
const legacy=createGame('random',{},393);delete legacy.shortRun;assert.equal(totalSteps(legacy),TOTAL_STEPS);
console.log(JSON.stringify({passed:true,simulatedGames:600,randomSteps:RANDOM_STEPS,customSteps:TOTAL_STEPS,eventBank:EVENT_COUNT,eventsReached:events.size,uniqueProfiles:profiles.size,uniqueNames:names.size,cities:cities.size,routes:[...routes],checks:['seed reproducibility','immutable state','no repeated events','timeline','study','migration cost','locked fields','recent name dedup','detailed ending']},null,2));
