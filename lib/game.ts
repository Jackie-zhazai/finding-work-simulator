export type Mode = 'random' | 'custom';
export type Stats = {skill:number; project:number; interview:number; energy:number; money:number; stress:number; research:number};
export type Profile = {name:string; grade:string; school:string; gender:string; direction:string; internship:string; support:string; reality:string};
export type Choice = {label:string; hint:string; effects:Partial<Stats>; action?:string; route?:string};
export type GameEvent = {id:string; tag:string; title:string; body:string; options:Choice[]};
export type RecordItem = {id:string; date:string; title:string; choice:string; outcome:string; before:Stats; after:Stats};
export type Game = {version:number; id:string; seed:number; mode:Mode; profile:Profile; stats:Stats; step:number; month:number; gradMonth:number; route:string; job:string; offers:number; history:RecordItem[]; complete:boolean};
export const GRADES=['大二','大三','大四','研一','研二','研三'];
export const DIRECTIONS=['后端开发','前端开发','移动端开发','尚未确定'];
export const SCHOOLS=['研究型高校','普通一本','其他本科院校'];
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export function random(g:Game){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296;}
export function createGame(mode:Mode, input:Partial<Profile>={}, seed=Date.now()>>>0):Game{
 const g:Game={version:1,id:'fw-'+seed.toString(36),seed,mode,profile:{} as Profile,stats:{skill:35,project:25,interview:25,energy:78,money:6500,stress:25,research:25},step:0,month:0,gradMonth:12,route:'开发',job:'',offers:0,history:[],complete:false};
 const pick=<T,>(arr:T[])=>arr[Math.floor(random(g)*arr.length)];
 const grade=input.grade&&input.grade!=='随机'?input.grade:pick(GRADES);
 g.profile={name:input.name||pick(['林予','陈一然','许知远','周可','沈言','陆星']),grade,school:input.school||pick(SCHOOLS),gender:input.gender|| (random(g)<.6?'男':'女'),direction:input.direction||pick(DIRECTIONS.slice(0,3)),internship:input.internship||pick(['暂无实习','小团队开发实习','有相关开发实习']),support:input.support||pick(['可支持基本生活','需要尽早获得收入','有一定试错空间']),reality:input.reality||'假设角色'};
 g.gradMonth=({大二:32,大三:20,大四:8,研一:32,研二:20,研三:8} as {[k:string]:number})[grade];
 if(g.profile.internship!=='暂无实习'){g.stats.skill+=12;g.stats.project+=18;}
 if(grade.startsWith('研')){g.stats.research+=22;g.stats.skill+=6;}
 g.stats.money=g.profile.support==='需要尽早获得收入'?2500:g.profile.support==='有一定试错空间'?14000:6500;
 return g;
}
const c=(label:string,hint:string,effects:Partial<Stats>,action?:string,route?:string):Choice=>({label,hint,effects,action,route});
export function eventFor(g:Game):GameEvent{
 const p=g.profile,s=g.stats;
 const list:GameEvent[]=[
 {id:'direction',tag:'方向探索',title:'先从哪里开始？',body:`${p.grade}的课表还没结束，身边已经有人开始准备实习。你想做${p.direction}，但能够投入的时间有限。这一阶段，你决定把重心放在哪里？`,options:[c('把一个项目真正做完','补齐功能、部署和文档，积累可解释的经历。',{project:18,skill:8,energy:-9,money:-300}),c('先补基础和算法','打牢基础，项目进度暂缓。',{skill:18,interview:6,energy:-12}),c('先了解岗位，再选方向','比较要求，向学长学姐了解实际工作。',{interview:10,project:5,stress:-5}),c('先照顾生活节奏','恢复精力，为下一阶段保留空间。',{energy:18,stress:-12,money:-300})]},
 {id:'project',tag:'能力积累',title:'项目不只是写在简历上',body:'你做的项目能够运行，但面试官可能会追问：为什么这么设计？谁会使用它？目前还有一段时间可以调整。',options:[c('补测试、部署与技术说明','把现有作品做得可信。',{project:16,interview:9,energy:-10}),c('再学一个热门框架','拓宽技术接触面，但不会自动形成项目经历。',{skill:13,project:4,energy:-10}),c('找真实需求，小范围交付','练习沟通和交付，也承担返工。',{project:17,interview:7,money:400,energy:-15}),c('兼顾课程与毕业任务','减少眼前冲突。',{research:13,energy:4,stress:-7})]},
 {id:'first-apply',tag:'实习投递',title:'第一批简历，投向哪里？',body:`你开始投递开发实习。${p.internship==='暂无实习'?'这是你第一次真正进入招聘流程。':'已有经历可以写进简历，但相关性仍然重要。'}以下机会来自虚构岗位，筛选结果由本局准备与模拟招聘条件共同产生。`,options:[c('集中投大型企业开发岗','准备要求较高，竞争与不确定性更大。',{energy:-12,stress:5},'apply-hard'),c('投递与项目匹配的中小团队','更关注能否解释并完成具体业务。',{energy:-8},'apply'),c('先改简历，下一批再投','积累表达，消耗一个机会窗口。',{interview:17,project:5,stress:3}),c('尝试测试、数据或技术支持机会','探索邻近方向，不等于放弃技术。',{skill:5,interview:9},'apply-adjacent','其他技术')]},
 {id:'interview',tag:'面试现场',title:'“讲一个你真正解决的问题”',body:'面试官没有直接问框架名称，而是追问项目中的一次故障、你的判断和最终结果。你决定如何准备接下来的面试？',options:[c('复盘项目，明确自己的贡献','承认边界，把过程讲清楚。',{interview:17,project:8,energy:-8}),c('集中刷题和模拟技术问答','提高基础题的熟练度。',{skill:13,interview:9,energy:-12}),c('找人做一次模拟面试','接收反馈，暴露不熟悉的部分。',{interview:19,money:-300,stress:-5}),c('减少投递，先恢复状态','面试准备也需要精力。',{energy:20,stress:-15})]},
 {id:'crossroad',tag:'路径选择',title:'你还想沿着这条路走吗？',body:`几轮体验之后，你发现自己${s.project>s.skill?'更喜欢把一个东西交付出来。':'还在寻找适合自己的工作方式。'}继续开发、换一种工作，或继续深造，都需要新的投入。`,options:[c('继续开发，把准备做深','保留目前积累，收敛目标。',{skill:10,project:10,energy:-9},undefined,'开发'),c('转向产品、运营等岗位','开始补用户分析与沟通的实践。',{interview:15,project:5,energy:-8},undefined,'产品 / 运营'),c(p.grade.startsWith('研')?'申请博士，继续研究':'准备读研，重新安排时间','延长在校时间，增加研究与毕业要求。',{research:20,money:-1200,stress:8},'study','升学'),c('尝试自由职业或小型业务','先验证小需求，承担收入波动。',{project:10,money:-500,energy:-8},undefined,'自由职业')]},
 {id:'constraint',tag:'现实边界',title:'机会和生活，并不总在同一个地方',body:p.support==='需要尽早获得收入'?'生活费逐渐紧张。一份有收入但相关性一般的工作，和一份需要异地投入的机会同时出现。':'一个异地机会需要搬家，也会打乱课程或研究安排。你需要决定可以承受多少试错成本。',options:[c('优先本地且有收入的机会','缩小范围，减少现金压力。',{money:2300,project:5,energy:-8}),c('为相关机会承担搬迁成本','是否获得机会仍有不确定性。',{money:-1500,interview:8,stress:6},'apply'),c('协商时长、地点和任务','协商不一定成功，但能明确边界。',{interview:11,energy:-5,stress:-4}),c('暂停投递，先完成学业要求','为毕业保留确定进度。',{research:18,stress:-5,money:-500})]},
 {id:'screen',tag:'岗位筛选',title:'有些门槛，不靠多刷一道题改变',body:p.school==='研究型高校'?'某虚构集团的岗位限定毕业批次和相关研究方向。学校背景让你进入初筛，但不能代替接下来的评价。':'某虚构集团的本批岗位设置了院校筛选，你未进入下一轮。这只代表这个岗位的规则，不能推断所有企业。',options:[c('调整目标，扩大匹配岗位','把有限时间用在可进入的流程。',{interview:7,energy:-7},'apply'),c('询问其他岗位或补充材料','争取解释机会，不保证改变硬门槛。',{interview:8,energy:-5,stress:3}),c('补足作品，等待下一轮','项目仍可迁移到其他机会。',{project:13,skill:5,money:-400}),c('重新评估方向与城市','接受目标变化，探索另一种安排。',{interview:10,stress:-8},undefined,'其他技术')]},
 {id:'graduate',tag:'毕业节点',title:'从校园走向下一段生活',body:g.route==='升学'?'你选择延长学术路径。课程、研究与毕业任务并不会自动完成，需要重新平衡。时间线将以摘要跳过平淡学期。':'毕业要求、求职流程和离校安排同时临近。毕业本身也需要投入，不只是求职背景中的一个日期。',options:[c('优先把毕业条件完成','为离校或继续研究建立基础。',{research:22,energy:-10,stress:-7}),c('协调求职与毕业任务','同时推进，精力消耗更大。',{research:12,interview:9,energy:-16},'apply'),c('争取延期，换取准备空间','推迟毕业半年，增加生活成本。',{research:15,skill:10,money:-900,stress:5},'delay'),c('重新安排路线，先获得收入','接受过渡安排，继续保留调整机会。',{money:1600,interview:6,energy:-9},undefined,'过渡就业')]},
 {id:'first-job',tag:'进入行业',title:g.job?'第一份经历，接下来怎么用？':'离开校园后，还在寻找机会',body:g.job?`你目前的机会是「${g.job}」。岗位名称不等于每天的内容，你开始看到工作节奏与真实任务。`:'你还没有落实合适的岗位。继续准备、接受过渡工作或换方向，各自意味着不同的成本。',options:[c('继续投递匹配岗位','以已经积累的准备参加新流程。',{interview:5,energy:-10},'apply'),c('接受过渡工作，保住现金流','为后续调整保留生活条件。',{money:4000,energy:-12},'bridge'),c('聚焦一个可交付作品','用有限时间补充实践证据。',{project:18,skill:8,money:-600,energy:-10}),c('尝试产品、运营方向','重新理解岗位要求，不承诺一转就成。',{interview:14,energy:-9},'apply-other','产品 / 运营')]},
 {id:'work',tag:'工作与成长',title:'工作之后，问题也会变化',body:g.job?'任务越来越熟悉，但你想知道自己是在积累能力，还是只是在重复。':'没有固定岗位，并不意味着这段时间什么都没有发生。你需要决定如何继续安排。',options:[c('争取完整负责一件事','积累具体成果，承担更多责任。',{project:18,skill:9,energy:-14,money:1800}),c('系统补足基础','为之后转岗或求职做准备。',{skill:18,interview:6,money:-500,energy:-9}),c('建立稳定的生活节奏','保留长期行动的空间。',{energy:23,stress:-16,money:800}),c('做一笔小型自由业务','学习寻找需求、交付和收款。',{project:11,money:2200,energy:-12},undefined,'自由职业')]},
 {id:'change',tag:'再次选择',title:'你可以改变最初的方向',body:'一年左右过去了。你对工作、收入和生活的理解，比开局时具体了。原来的目标可以保留，也可以修改。',options:[c('留在当前路径继续积累','继续改善具体短板。',{skill:11,project:11,money:1600,energy:-8}),c('尝试新的开发或技术岗位','已有经验部分迁移，重新参加筛选。',{interview:8,energy:-10},'apply-adjacent','其他技术'),c('转向非开发岗位','补沟通与业务理解，接受重新适应。',{interview:10,energy:-10},'apply-other','产品 / 运营'),c('暂时休整，再作决定','减少压力，也需要生活储备。',{energy:24,stress:-22,money:-1500},undefined,'休整与探索')]},
 {id:'settle',tag:'两年之后',title:'你希望留下怎样的生活？',body:'临近这段模拟的终点，下一次选择不会决定你的一生。它只代表你目前愿意优先守住的东西。',options:[c('继续争取更匹配的工作','再试一个机会，接受不确定。',{interview:7,energy:-8},'apply'),c('稳定收入与日常生活','把可持续性放在前面。',{money:2200,energy:12,stress:-9}),c('为长期转向准备作品','结局仍然允许未完成的探索。',{project:16,skill:7,money:-600}),c('接受阶段结果，给自己空间','不把一次模拟当作最终判决。',{energy:15,stress:-18})]}
 ];
 return list[Math.min(g.step,list.length-1)];
}
export function dateLabel(month:number){const d=new Date(Date.UTC(2026,8+month,1));return `${d.getUTCFullYear()}.${String(d.getUTCMonth()+1).padStart(2,'0')}`;}
export function applyChoice(input:Game,index:number):Game{
 if(input.complete)return input;
 const g:Game=JSON.parse(JSON.stringify(input));const ev=eventFor(g),o=ev.options[index];if(!o)throw Error('无效选项');
 const before={...g.stats};
 for(const [k,v]of Object.entries(o.effects)){const key=k as keyof Stats;g.stats[key]=key==='money'?g.stats.money+(v||0):clamp(g.stats[key]+(v||0));}
 if(o.route)g.route=o.route;
 let outcome='这次投入已记入经历，部分影响会在之后出现。';
 if(o.action==='study'){g.gradMonth+=g.profile.grade.startsWith('研')?48:36;outcome='升学路线已记录。毕业节点后移，未来研究阶段将以关键事件与摘要推进。';}
 if(o.action==='delay'){g.gradMonth+=6;outcome='毕业节点延后半年。准备空间增加，生活成本也继续累积。';}
 if(o.action==='bridge'){g.job='过渡岗位';outcome='你接受了过渡工作。现金流改善，未来仍可以调整。';}
 if(o.action?.startsWith('apply')){
 const adjacent=o.action==='apply-adjacent',other=o.action==='apply-other',hard=o.action==='apply-hard';
 const preparedness=other?(g.stats.interview*.6+g.stats.project*.4):(g.stats.skill*.35+g.stats.project*.35+g.stats.interview*.3);
 const chance=Math.max(.1,Math.min(.86,.12+preparedness/120+(g.stats.energy-50)/400-(hard?.2:0)));
 const roll=random(g);
 if(roll<.08){outcome='该虚构岗位临时取消。本轮没有进入交付，这部分来自外部变化。';g.stats.stress=clamp(g.stats.stress+5);}
 else if(roll<chance){g.offers++;g.job=other?'产品 / 运营岗位':adjacent?'相关技术岗位':g.route==='自由职业'?'项目协作机会':`${g.profile.direction==='尚未确定'?'开发':g.profile.direction}${g.step<7?'实习':'岗位'}`;g.stats.money+=g.step<7?1800:3500;outcome=`本轮获得「${g.job}」机会。准备与匹配增加了可能性，招聘随机性仍参与了结果。`;}
 else {g.stats.stress=clamp(g.stats.stress+7);outcome='本轮未获得机会。模拟综合了准备、匹配和招聘波动；仅凭拒绝不能确定现实中的原因。';}
 }
 if(g.stats.energy<25){g.stats.stress=clamp(g.stats.stress+8);outcome+=' 精力偏低，持续投入开始增加压力。';}
 if(g.stats.money<0){g.stats.stress=clamp(g.stats.stress+8);outcome+=' 当前储备已不足，需要考虑收入与支持。';}
 g.history.push({id:`${g.id}-c${g.step}`,date:dateLabel(g.month),title:ev.title,choice:o.label,outcome,before,after:{...g.stats}});
 g.step++;
 const fractions=[0,.12,.24,.36,.48,.62,.78,.94];
 g.month=g.step<8?Math.floor(g.gradMonth*fractions[g.step]):g.gradMonth+[0,4,10,17,24][Math.min(4,g.step-8)];
 if(g.step>=12){g.complete=true;g.month=g.gradMonth+24;}
 return g;
}
export function ending(g:Game){return {title:g.route==='休整与探索'?'仍在寻找自己的节奏':g.route==='自由职业'?'把路走成自己的项目':g.job?'在不确定中，落下一站':'路还没有走完',subtitle:g.job||'继续求职与探索',summary:`从${g.profile.grade}出发，你走过了${g.history.length}个关键选择，经历${Math.floor(g.month/12)}年${g.month%12}个月。最终路线是${g.route}，当前${g.job?'拥有'+g.job+'经历':'仍在寻找适合的机会'}。这是模拟中的阶段处境，不是对真实未来的预测。`};}
