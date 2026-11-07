import {GRADES,DIRECTIONS,SCHOOLS,CITIES,cityInfo,FAMILIES,SUPPORTS,INTERNSHIPS,PROJECTS,COMPETITIONS,RESEARCH,GOALS,LIVING} from './world';
import {PLAN,selectEvent,EVENT_COUNT} from './event-bank';
import {practiceEvent,type PracticeBrief} from './practice';
export {GRADES,DIRECTIONS,SCHOOLS,CITIES,FAMILIES,SUPPORTS,INTERNSHIPS,PROJECTS,COMPETITIONS,RESEARCH,GOALS,EVENT_COUNT};
export const TOTAL_STEPS=PLAN.length;
export type Mode='random'|'custom';
export type Stats={skill:number;project:number;interview:number;energy:number;money:number;stress:number;research:number};
export type Profile={name:string;grade:string;school:string;gender:string;direction:string;internship:string;support:string;reality:string;degree:string;hometown:string;city:string;family:string;gpa:string;project:string;competition:string;research:string;goal:string;living:string;trait:string};
export type Choice={label:string;hint?:string;effects:Partial<Stats>;action?:string;route?:string;flag?:string;city?:string;result?:string};
export type GameEvent={id:string;tag:string;title:string;body:string;options:Choice[];question?:string};
export type RecordItem={id:string;eventId:string;date:string;title:string;choice:string;outcome:string;before:Stats;after:Stats;city:string;route:string};
export type Job={title:string;company:string;city:string;monthly:number;cost:number;arrangement:string;content:string;stage:'实习'|'正式工作'|'自由协作'|'过渡工作'};
export type Game={version:number;id:string;seed:number;mode:Mode;profile:Profile;stats:Stats;step:number;month:number;gradMonth:number;route:string;degree:string;city:string;job:string;employment:Job|null;offers:number;history:RecordItem[];complete:boolean;flags:string[];recentEvents:string[];studyAdded:boolean;randomFields:string[];practice?:PracticeBrief};
export type Recent={names:string[];signatures:string[];events:string[];genders?:string[]};
const schoolWeights=[5,9,8,31,29,12,6];
const internshipWeights:Record<string,number[]>={
 大二:[69,19,4,2,2,1,1,2],大三:[49,18,9,6,6,5,3,4],大四:[35,14,14,9,9,8,5,6],
 研一:[45,10,8,4,6,7,4,16],研二:[29,8,10,5,9,12,7,20],研三:[24,7,11,6,10,13,9,20],
};
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export function random(g:Game){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296;}
export function signature(p:Profile){return [p.grade,p.school,p.city,p.family,p.support,p.direction,p.internship,p.project].join('|');}
export function createGame(mode:Mode,input:Partial<Profile>={},seed=Date.now()>>>0,recent:Partial<Recent>={},practice?:PracticeBrief):Game{
 const g:Game={version:2,id:'fw-'+seed.toString(36),seed,mode,profile:{} as Profile,stats:{skill:0,project:0,interview:0,energy:0,money:0,stress:0,research:0},step:0,month:0,gradMonth:20,route:'开发',degree:'本科',city:'武汉',job:'',employment:null,offers:0,history:[],complete:false,flags:[],recentEvents:recent.events?.slice(-120)||[],studyAdded:false,randomFields:[]};
 if(mode==='custom'&&practice)g.practice=practice;
 const pick=<T,>(a:readonly T[])=>a[Math.floor(random(g)*a.length)];
 const chosen=(v:string|undefined,values:string[])=>v&&v!=='随机'?v:pick(values);
 const weighted=(values:string[],weights:number[])=>{
  let roll=random(g)*weights.reduce((sum,n)=>sum+n,0);
  return values.find((_,i)=>(roll-=weights[i])<0)??values[0];
 };
 const grade=chosen(input.grade,GRADES),degree=grade.startsWith('研')?'硕士':'本科';
 const graduate=degree==='硕士';
 const genderBag=['男','男','男','女','女'];
 const pastGenders=recent.genders||[];
 const batchCount=pastGenders.length%5;
 for(const gender of pastGenders.slice(pastGenders.length-batchCount)){
  const index=genderBag.indexOf(gender);
  if(index>=0)genderBag.splice(index,1);
 }
 const lastGenders=recent.genders?.slice(-2)||[];
 const otherGender=genderBag.filter(gender=>gender!==lastGenders[0]);
 const gender=chosen(input.gender,lastGenders.length===2&&lastGenders[0]===lastGenders[1]&&otherGender.length?otherGender:genderBag);
 const surnames='陈林李王张刘周黄赵吴徐孙胡朱高何郭马罗梁宋郑谢韩唐许邓冯曹彭曾萧田董袁潘蒋蔡余杜叶程苏魏吕丁任沈姚卢姜崔钟谭陆汪范金石廖贾夏韦傅方白邹孟熊秦邱江尹薛阎段雷侯龙史陶黎贺顾毛郝龚邵万钱严覃武戴莫孔向汤';
 const given=['予安','知远','沐晴','一然','可欣','子衡','嘉宁','星河','明哲','亦舟','若溪','书言','思源','景行','安禾','清和','晓川','雨桐','承宇','青禾','念初','泽','可','言','宁','澄','岚','笙','桐','川','熙','晏','茵','遥','望舒','怀瑾','云舒','序','时雨','允之','初阳','以南','闻溪','若谷','庭安','语棠','逸帆','沛然','锦书','见山'];
 let name=input.name&&input.name!=='随机'?input.name:'';
 for(let i=0;!name&&i<40;i++){const candidate=pick([...surnames])+pick(given);if(!recent.names?.includes(candidate))name=candidate;}
 if(!name)name=pick([...surnames])+pick(given);
 const family=chosen(input.family,FAMILIES);
 const supportWeights=/宽裕|积蓄/.test(family)?[30,5,65]:/负债|支出|预算有限|照护/.test(family)?[44,52,4]:[68,22,10];
 const select=(key:keyof Profile,values:string[],weights:number[])=>input[key]&&input[key]!=='随机'?input[key]!:weighted(values,weights);
 const support=select('support',SUPPORTS,supportWeights);
 const hometown=chosen(input.hometown,CITIES);
 const campusCities=CITIES.filter(city=>city!==hometown&&cityInfo(city).region===cityInfo(hometown).region);
 const campusPool=random(g)<.24?[hometown]:random(g)<.54&&campusCities.length?campusCities:CITIES;
 const city=chosen(input.city,campusPool);
 const project=()=>select('project',PROJECTS,grade==='大二'?[7,7,7,2,3,5,5,2,5,3,54]:[8,9,8,8,6,6,9,graduate?12:4,7,7,graduate?10:22]);
 const internship=()=>select('internship',INTERNSHIPS,internshipWeights[grade]||internshipWeights.大三);
 const profile:Profile={name,grade,degree,school:select('school',SCHOOLS,graduate?[10,15,12,34,24,5,0]:schoolWeights),gender,direction:chosen(input.direction,DIRECTIONS),internship:internship(),support,reality:input.reality||'假设角色',hometown,city,family,gpa:select('gpa',['前10%','前10%—30%','中等','课程有短板','有挂科待补'],[10,20,49,16,5]),project:project(),competition:select('competition',COMPETITIONS,[grade==='大二'?71:57,16,4,6,4,3,4,3]),research:select('research',RESEARCH,graduate?(grade==='研一'?[13,35,26,17,7,2]:[5,10,23,27,24,11]):grade==='大二'?[87,10,2,1,0,0]:[71,16,8,3,2,0]),goal:chosen(input.goal,GOALS),living:select('living',LIVING,[graduate?66:82,city===hometown?17:0,11,graduate?10:4]),trait:chosen(input.trait,['喜欢独立钻研','擅长沟通协作','行动快但容易分散','谨慎，需要更多信息','喜欢可见的交付','节奏稳定，重视生活'])};
 // Locked fields remain locked; reroll only unlocked parts of an accidentally repeated combination.
 for(let i=0;i<12&&recent.signatures?.includes(signature(profile));i++){profile.project=project();profile.internship=internship();}
 g.profile=profile;g.city=profile.city;g.degree=degree;g.randomFields=Object.keys(profile).filter(k=>!input[k as keyof Profile]||input[k as keyof Profile]==='随机');
 g.gradMonth=({大二:32,大三:20,大四:8,研一:32,研二:20,研三:8} as Record<string,number>)[grade]||20;
 const hasIntern=profile.internship!=='暂无实习'&&profile.internship!=='校园团队项目协作';
 g.stats={skill:22+Math.floor(random(g)*24)+(hasIntern?8:0),project:15+Math.floor(random(g)*25)+(hasIntern?12:0),interview:18+Math.floor(random(g)*25),energy:62+Math.floor(random(g)*30),money:support==='需要尽早获得收入'?1800+Math.floor(random(g)*3000):support==='有一定试错空间'?11000+Math.floor(random(g)*19000):4500+Math.floor(random(g)*6000),stress:12+Math.floor(random(g)*25),research:degree==='硕士'?35+Math.floor(random(g)*25):8+Math.floor(random(g)*20)};
 if(profile.project.includes('尚无'))g.stats.project=Math.max(8,g.stats.project-12);
 if(profile.gpa==='前10%')g.stats.skill+=6;
 if(profile.gpa.includes('挂科')){g.stats.research=Math.max(5,g.stats.research-8);g.stats.stress+=6;}
 return g;
}
export const eventFor=(game:Game)=>practiceEvent(game)??selectEvent(game);
export function dateLabel(month:number){const d=new Date(Date.UTC(2026,8+month,1));return `${d.getUTCFullYear()}.${String(d.getUTCMonth()+1).padStart(2,'0')}`;}
function nextMonth(g:Game){if(g.step<=16)return Math.floor(g.gradMonth*g.step/16);return g.gradMonth+Math.round(24*(g.step-16)/(TOTAL_STEPS-16));}
export function jobTrack(title:string){
 if(/测试|质量/.test(title))return '测试 / 质量';
 if(/实施|运维|数据支持/.test(title))return '其他技术';
 if(/研究工程/.test(title))return '研究 / 深造';
 if(/公共服务/.test(title))return '考试与公共服务';
 if(/产品|运营/.test(title))return '产品 / 运营';
 if(/解决方案|客户成功|业务分析|技术销售/.test(title))return '行业转向';
 if(/小型项目协作/.test(title))return '自由职业';
 if(/过渡/.test(title))return '过渡就业';
 return '开发';
}
export function applicationTrack(route:string,action:string){
 if(action==='apply-research')return '研究 / 深造';
 if(action==='apply-adjacent')return '其他技术';
 if(action==='apply-quality')return '测试 / 质量';
 if(action==='apply-public')return '考试与公共服务';
 if(action==='apply-other')return route==='产品 / 运营'?route:'行业转向';
 if(action==='apply-hard'||action==='apply-development')return '开发';
 return ['测试 / 质量','其他技术','研究 / 深造','产品 / 运营','行业转向','考试与公共服务'].includes(route)?route:'开发';
}
function jobFor(g:Game,track:string):Job{
 const pick=<T,>(a:T[])=>a[Math.floor(random(g)*a.length)];
 const stage=g.step<16?'实习':'正式工作';
 let title=g.profile.direction==='尚未确定'?'软件开发':g.profile.direction;
 let content='完成需求实现、测试、联调与维护';
 if(track==='其他技术'){
  [title,content]=pick([['数据支持','整理数据口径，维护报表与数据质量'],['实施工程','配置系统、协助上线并培训使用者'],['运维支持','巡检系统、定位告警并协助恢复']]);
 }
 else if(track==='研究 / 深造'){title='研究工程助理';content='复现实验、整理数据并实现研究原型';}
 else if(track==='测试 / 质量'){title=g.stats.skill>=55&&g.flags.includes('tested')?'测试开发':'质量工程';content=title==='测试开发'?'维护自动化框架、编写回归脚本并定位故障':'设计用例、复现问题并完善回归检查';}
 else if(track==='考试与公共服务'){title='公共服务项目协作';content='承担信息整理与服务执行；这不代表通过编制考试';}
 else if(track==='产品 / 运营'||track==='行业转向'){title=track==='行业转向'?pick(['行业解决方案','客户成功','业务分析','技术销售']):pick(['产品助理','内容运营','业务运营']);content='理解用户与业务，协调交付并验证效果';}
 const scale=pick(['本地小型团队','中型业务团队','行业软件企业','制造企业信息化部门','大型企业业务组','服务交付团队']);
 const quality=g.stats.skill*.35+g.stats.project*.35+g.stats.interview*.3;
 const monthly=stage==='实习'?Math.round((2200+quality*35+random(g)*1100)/100)*100:Math.round((4200+quality*75+random(g)*2100+(cityInfo(g.city).cost>3500?1200:0))/100)*100;
 return {title,company:scale,city:g.city,monthly,cost:cityInfo(g.city).cost,arrangement:pick(['任务节奏较稳定','阶段性忙碌，需要协调边界','沟通较多，任务切换频繁','独立任务较多，需主动寻求反馈']),content,stage};
}
export function applyChoice(input:Game,index:number):Game{
 if(input.complete)return input;if(input.version!==2)throw Error('旧版存档请重新开始');
 const g:Game=JSON.parse(JSON.stringify(input)),ev=eventFor(g),option=ev.options[index];if(!option)throw Error('无效选项');const before={...g.stats};
 let outcome=option.result||'';
 for(const [key,value]of Object.entries(option.effects)){const k=key as keyof Stats;g.stats[k]=k==='money'?g.stats.money+(value||0):clamp(g.stats[k]+(value||0));}
 if(option.flag&&!g.flags.includes(option.flag))g.flags.push(option.flag);
 if(option.route)g.route=option.route;
 if(option.action==='study'&&!g.studyAdded){const years=g.degree==='本科'?3:4;g.degree=g.degree==='本科'?'硕士':'博士';g.gradMonth+=years*12;g.studyAdded=true;outcome+=`你选择继续攻读${g.degree}，毕业节点后移${years}年。后续会经过研究与毕业协调。`;}
 if(option.action==='delay'){g.gradMonth+=6;outcome+='你主动延长半年完成学业，时间和生活成本一并增加。';}
 if(option.action?.startsWith('direction:')){g.profile.direction=option.action.split(':')[1];outcome+=`你把下一阶段方向收敛到${g.profile.direction}，已有经历部分可迁移。`;}
 if(option.action==='direction-next'){g.profile.direction=DIRECTIONS[(DIRECTIONS.indexOf(g.profile.direction)+1)%7];outcome+=`开始探索${g.profile.direction}，需要补相应技能。`;}
 if(option.action==='move-next'||option.action==='home'){
  const previous=g.city;g.city=option.action==='home'?g.profile.hometown:option.city||CITIES[(CITIES.indexOf(g.city)+5)%CITIES.length];
  if(g.city!==previous){const cost=option.action==='home'?600:Math.round(cityInfo(g.city).cost*.7+600);g.stats.money-=cost;g.flags.push('moved');outcome+=`从${previous}迁往${g.city}，本次模拟搬迁支出¥${cost}。新城市的岗位仍需要申请。`;if(g.employment){g.employment=null;g.job='';outcome+='原岗位经历保留在时间线，当前重新进入求职阶段。';}}else outcome+='你保留当前城市，继续比较具体团队。';
 }
 if(option.action==='bridge'){g.employment={title:'过渡工作',company:'本地服务团队',city:g.city,monthly:3800,cost:cityInfo(g.city).cost,arrangement:'收入相对固定，准备时间需要另行安排',content:'承担日常服务与执行任务',stage:'过渡工作'};g.job='过渡工作';outcome+='你接受过渡工作，先稳定收入，未来仍可以调整。';}
 if(option.action==='freelance'){g.employment={title:'小型项目协作',company:'独立客户',city:g.city,monthly:3000+Math.floor(random(g)*2500),cost:cityInfo(g.city).cost,arrangement:'项目收入有波动，不等同固定工资',content:'需求沟通、实现、验收与维护',stage:'自由协作'};g.job=g.employment.title;outcome+='获得一笔模拟项目，收入仍取决于持续获客与交付。';}
 if(option.action==='rest'){outcome+='你留出休整时间；当前记录描述的是阶段安排，不是永久退出。';}
 if(option.action==='leave'){g.employment=null;g.job='';outcome+='你离开当前岗位，安排了一段恢复和重新评估的时间。';}
 if(option.action==='intern'){g.flags.push('internship');g.stats.project=clamp(g.stats.project+5);outcome+='这段实习增加了实践接触，但不自动保证转正。';}
 if(option.action?.startsWith('apply')){
  const track=applicationTrack(g.route,option.action),hard=option.action==='apply-hard';
  const {skill,project,interview,research}=g.stats;
  const prep=track==='开发'?skill*.48+project*.34+interview*.18
   :track==='测试 / 质量'?skill*.36+project*.38+interview*.26+(g.flags.includes('tested')?7:0)
   :track==='其他技术'?skill*.24+project*.34+interview*.42
   :track==='研究 / 深造'?research*.5+skill*.24+project*.26
   :track==='考试与公共服务'?research*.37+interview*.43+project*.2
   :interview*.58+project*.42+(g.flags.includes('user-research')?5:0);
  const chance=Math.max(.12,Math.min(.8,.04+prep/137+(g.stats.energy-50)/550-(hard?.18:0)+(g.flags.includes('evidence')?.045:0)));
  const roll=random(g);
  if(roll<.07){outcome+='本批岗位临时冻结，已经投入的准备可以用于其他机会。';g.stats.stress=clamp(g.stats.stress+3);}
  else if(roll<chance){const job=jobFor(g,track);g.employment=job;g.job=job.title;g.offers++;if(job.stage==='实习')g.flags.push('internship');g.stats.money+=job.stage==='实习'?1000:1800;outcome+=`你接受了${job.city}的${job.company}「${job.title}」${job.stage}。模拟月收入¥${job.monthly}，${job.arrangement}。`;}
  else{outcome+='本轮未进入下一步。准备、岗位匹配与招聘波动共同参与，不能由拒信确定现实原因。';g.stats.stress=clamp(g.stats.stress+4);}
 }
 if(!outcome){const effect=Object.entries(option.effects).filter(([k])=>k!=='money').sort((a,b)=>(b[1]||0)-(a[1]||0))[0];const names:Record<string,string>={skill:'技术准备',project:'项目证据',interview:'表达与沟通',research:'学业进度',energy:'精力恢复',stress:'压力'};outcome=`你选择「${option.label}」。${effect&&(effect[1]||0)>0?`${names[effect[0]]}得到推进。`:''}${option.flag?'这段经历会被后续事件与解析引用。':'投入已经记录，机会仍需要继续验证。'}`;}
 // Weeks/months contain recovery; repeated choices should not turn every route into forced exhaustion.
 g.stats.energy=clamp(g.stats.energy+3);g.stats.stress=clamp(g.stats.stress-1);
 if(g.stats.energy<20){g.stats.stress=clamp(g.stats.stress+4);outcome+=' 精力偏低，下一阶段需要留意负担。';}
 if(g.stats.money<0){g.stats.stress=clamp(g.stats.stress+5);outcome+=' 储备不足，近期收入与支持变得更紧迫。';}
 g.history.push({id:`${g.id}-c${g.step}`,eventId:ev.id,date:dateLabel(g.month),title:ev.title,choice:option.label,outcome,before,after:{...g.stats},city:g.city,route:g.route});
 g.step++;g.month=Math.max(input.month,nextMonth(g));
 if(input.month>=input.gradMonth){const months=Math.max(0,g.month-input.month);const budget=cityInfo(g.city).cost;const income=g.employment?.monthly||0;const net=(income-budget)*months;g.stats.money+=net;g.history[g.history.length-1].outcome+=` 随后${months}个月按模拟月收入¥${income}、生活预算¥${budget}结算，净变化${net>=0?'+':''}¥${net.toLocaleString()}。`;g.history[g.history.length-1].after={...g.stats};}
 if(g.step===16&&g.employment?.stage==='实习'){g.flags.push('completed-internship');g.employment=null;g.job='';}
 if(g.step>=TOTAL_STEPS){g.complete=true;g.month=g.gradMonth+24;}
 return g;
}
export function ending(g:Game){
 const job=g.employment;
 const fit=g.profile.goal==='收入优先'?(job&&job.monthly-job.cost>3500?'现金流与最初目标较接近':'收入与生活成本仍需权衡'):g.profile.goal==='城市与家人距离'?(g.city===g.profile.hometown?'回到了家乡，距离目标有所实现':'留在异地，需要继续权衡距离'):g.profile.goal==='稳定与生活节奏'?(g.stats.energy>50&&g.stats.stress<50?'目前节奏相对可持续':'当前负担与稳定目标仍有差距'):'方向在过程中逐渐具体，还可以继续验证';
 const track=job?jobTrack(job.title):g.route==='休整与探索'?'休整与探索':g.studyAdded&&g.route==='研究 / 深造'?'完成深造':'继续求职';
 const titles:Record<string,string>={'开发':'你进入了开发团队','测试 / 质量':'你走向了质量工程','其他技术':'你找到了另一种技术岗位','产品 / 运营':'你开始做产品或运营','行业转向':'你换了一个行业入口','研究 / 深造':'你开始做研究工程','考试与公共服务':'你在公共服务项目中工作','自由职业':'你开始接独立项目','过渡就业':'你用一份过渡工作稳住收入','休整与探索':'你给自己留出一段休整时间','继续求职':'你还在寻找合适的机会'};
 const study=g.studyAdded?`你在这段经历中完成了${g.degree}阶段。`:'';
 const current=job?`你在${g.city}从事${job.company}的${job.title}，主要${job.content}。`:`你目前在${g.city}，尚未落实固定岗位。`;
 const intent=g.route!==track&&g.route!=='开发'?`你还在探索${g.route}。`:'';
 return {title:track==='完成深造'?`你完成了${g.degree}阶段`:titles[track],track,subtitle:job?`${job.city} · ${job.title}`:g.route==='考试与公共服务'?'正在准备考试，尚未录取':study?`${g.degree}毕业 · 继续探索`:track,summary:study+current+intent+fit+'。',fit};
}
