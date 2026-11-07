import type {Choice,Game,GameEvent} from './game';

export const FOCUSES=['投递没回应','项目与简历','笔试与面试','实习与转正','Offer 与合同','换技术方向或转行','升学与求职并行','现金流与异地求职','识别招聘风险'] as const;
export const HOURS=['每周 3 小时','每周 6 小时','每周 12 小时','每周 20 小时以上'];
export const DEADLINES=['两周内','一个月内','三个月内','时间暂时灵活'];
export type PracticeBrief={focus:typeof FOCUSES[number];hours:string;deadline:string};
type Case={situation:string;question:string;options:[string,string,string,string];feedback:[string,string,string,string];exercise:string;deliverable:string};
const cases:Record<PracticeBrief['focus'],Case>={
 '投递没回应':{
  situation:'投出 30 份申请，只有两次笔试。投递记录里混着不同岗位、地区和渠道，你暂时看不出哪一环出了问题。',
  question:'你更想先验证岗位匹配，还是简历里的证据？',
  options:['挑 5 个相似岗位，对照要求改一版简历再投','从有回应的岗位找共同点，缩小下一批目标','联系同学或校友，核实团队任务与投递入口','同时保留一批本地过渡岗位，先守住收入'],
  feedback:['有了可以比较的小批量样本，但需要等反馈才能判断改动效果。','你找到了值得继续验证的方向，但少量回复还不足以证明匹配。','你确认了几个入口，也发现有些岗位已经停止接受申请。','现金压力有了备选。主方向仍要留出固定投递时间。'],
  exercise:'同一批岗位有的没回复，有的到了笔试。按岗位、渠道和推进阶段记录，比较你能改变的因素。',
  deliverable:'一张投递实验表：岗位类型、版本、渠道、回复和下一次调整。'},
 '项目与简历':{
  situation:'你的简历写了「负责后端开发」，面试官却追问具体改了什么、怎么验证、哪些工作由你完成。',
  question:'你的项目里，哪一项贡献可以用代码、演示或测试证明？',
  options:['挑一个自己负责的功能，补演示和测试记录','重写项目描述，区分个人贡献和团队成果','做一个可在十分钟内跑起来的小样','减少不相关项目，突出岗位要求对应的证据'],
  feedback:['你有了可复现的材料。下一步是练习解释它解决了什么问题。','描述更清楚了，仍需准备一个能应对追问的例子。','小样容易展示，但只能证明它实际覆盖的能力。','简历重点更清晰，别删掉能证明核心能力的细节。'],
  exercise:'面试官追问功能失败时如何定位。先写清原问题、你做的动作和如何验证，再用一段话讲出来。',
  deliverable:'两条可核实的简历描述，以及一个两分钟项目讲解提纲。'},
 '笔试与面试':{
  situation:'笔试能做完一部分，但两次技术面都卡在项目追问和排查过程。下次面试还有五天。',
  question:'你最常卡在不知道答案，还是知道思路却说不清？',
  options:['复盘两道没讲清的问题，录一遍思路','按目标岗位做一轮计时模拟面试','把项目的一个失败案例整理成排查记录','先确认面试环节和可准备的范围'],
  feedback:['你有了可重复练的题目，下一次要验证能否在追问中说明边界。','模拟暴露了时间分配问题，可以据此调整练习重点。','失败案例有了证据，练习解释为何先排除某个可能。','流程更明确了，准备时间可以集中在最可能用得上的内容。'],
  exercise:'模拟追问：如果按你说的方式修了，线上还是出现同样的问题，下一步查什么？',
  deliverable:'一份五天面试练习表，带复盘问题和可检查的完成标准。'},
 '实习与转正':{
  situation:'实习做了六周，主要接零碎任务。导师说表现不错，但团队还没给出转正名额、流程和反馈日期。',
  question:'在决定继续等之前，你最需要团队确认哪条信息？',
  options:['约导师沟通转正标准、流程和反馈时间','争取一个能独立验收的交付，同时保留外投','争取轮岗体验，验证当前工作和目标方向的距离','设置等待截止日，准备不转正的备选'],
  feedback:['你拿到了可跟进的问题清单。口头反馈仍要和正式流程分开。','你开始积累能对内对外使用的证据，时间安排会更紧。','你看到了不同岗位的实际任务，接下来要确认能否持续参与。','你给等待设了边界，也需要给接下来的外投留时间。'],
  exercise:'主管表示月底才能确定名额。列出现在能确认的验收目标、决策人和你自己的等待边界。',
  deliverable:'一份导师沟通提纲，加一条转正反馈迟迟未到时的备选计划。'},
 'Offer 与合同':{
  situation:'本地团队要求后天答复，另一家仍在终面。第一家口头说偏开发，书面材料还没写清工作地点、实际任务和试用安排。',
  question:'地点、实际工作和入职确定性，哪一项会直接改变你的决定？',
  options:['先书面确认岗位任务、地点和合同主体','争取延长回复时间，并向另一家确认流程','做一张收入、通勤和工作内容对照表','给自己定底线，到期按已经确认的条件决定'],
  feedback:['你发出了具体确认项，最终取舍取决于对方的书面反馈。','可能争取到更多时间，也要准备对方不延长的方案。','你能看见两份机会的生活差异，但不能把未拿到的机会当成 Offer。','你有了可执行的决策规则。现在需要按时检查信息是否更新。'],
  exercise:'一家给了确定回复日期，另一家只说尽快。试写一句能发给招聘方的确认消息。',
  deliverable:'一份 Offer 对照表和一段可发送的书面确认话术。'},
 '换技术方向或转行':{
  situation:'你有前端课程和项目，但开始考虑数据开发、实施或产品。你只有几周能验证新方向，也不能把现有经历全推倒重来。',
  question:'你想转的是技术栈、日常工作，还是生活节奏？',
  options:['访谈一名从业者，核对岗位日常和入门门槛','复用现有项目做一个新方向的小任务','并行投少量旧方向和新方向岗位，对比反馈','先保留收入来源，设两周验证期和退出条件'],
  feedback:['日常任务有了更具体的描述。接下来用一次小交付验证自己是否喜欢。','你把旧经历转成了新方向的证据，但仍需了解团队实际要求。','你获得了两个方向的对照，样本不足时先记录过程差异。','你降低了试错压力，也需要把验证任务压缩到可以完成。'],
  exercise:'挑一个新方向真实需要交付的任务，用你已有的工具和项目做出能展示的最小版本。',
  deliverable:'一份可迁移经历清单和两周转向验证计划。'},
 '升学与求职并行':{
  situation:'两周内有毕业任务的阶段检查，也撞上招聘笔试。升学是备选，但你还没核对申请条件、准备周期和资金。',
  question:'接下来两周，哪项截止时间不可移动？',
  options:['先列毕业与求职的不可移动日期','与导师和招聘方分别确认可以协调的时间','把求职缩到少数适配岗位，集中准备关键节点','先查升学的实际要求和资金，再决定是否投入'],
  feedback:['时间冲突变得具体了，可以为高优先级事项留出缓冲。','你发出了协调请求，仍要准备两边都不能改期的方案。','并行负担降低了，但需要给投递留一个可执行的小目标。','你把深造从想法变成了待核实事项，再评估是否真的适合。'],
  exercise:'新增一个跟答辩冲突的面试时间。把可协商事项、备用日期和无法接受的代价分别列出来。',
  deliverable:'一张两周时间表，明确先做什么、何时切换以及需要联系谁。'},
 '现金流与异地求职':{
  situation:'一家外地团队邀请你到现场沟通，岗位和薪资尚未书面确认。来回交通、短租和押金会明显占用当前储备。',
  question:'你愿意为一次未确定的机会花多少时间和钱？',
  options:['先争取视频沟通，确认下一轮流程再买票','算交通、房租押金和空窗期的总成本','安排本地过渡收入，同时保留外地投递','把外地机会按确定性分级，只为高优先级出行'],
  feedback:['你减少了前置成本，下一步要确认远程沟通能不能推进流程。','你算出了所需缓冲，也能判断哪项支出可以推迟。','短期现金流更稳，但要守住准备时间。','你建立了出行门槛，仍需核实对方是否满足。'],
  exercise:'把一次性搬迁支出与每月开销分开，算清没有收入时还能等几周。',
  deliverable:'一张异地机会预算表和一个可以接受的求职空窗期限。'},
 '识别招聘风险':{
  situation:'对方以开发岗位邀请面试，随后称必须先付费培训或贷款才能入职，书面材料没有说清公司主体和用工安排。',
  question:'目前有哪些信息能独立核验？哪些只是对方的承诺？',
  options:['暂停流程，核实公司主体和官网发布渠道','要求对方书面确认岗位、费用和合同主体','保留招聘页面与沟通证据，向学校就业中心求证','退出当前流程，从可核验渠道重启投递'],
  feedback:['你没有继续付款或交材料，接下来核对招聘主体和信息来源。','对方答复可以作为记录，仍需要独立核验。','证据保留下来了，你可以和可信渠道一起判断下一步。','你终止了可疑流程，可以把核验步骤加入下一批投递。'],
  exercise:'核对招聘主体、费用要求、个人材料和合同安排，写清哪些信息没验证前先不行动。',
  deliverable:'一份招聘风险核验清单和一套可复用的询问话术。'},
};
const effects:Choice['effects'][]=[{project:10,energy:-3},{interview:10},{project:6,interview:6},{energy:7,stress:-5}];

export function practiceEvent(game:Game):GameEvent|undefined{
 const brief=game.practice;
 if(game.mode!=='custom'||!brief||![4,7,12].includes(game.step))return;
 const scenario=cases[brief.focus];
 const base={tag:'求职实战',id:'practice-'+FOCUSES.indexOf(brief.focus)};
 const constraints=`你的准备时间是${brief.hours}，希望${brief.deadline}看到进展。`;
 if(game.step===4){
  const options=scenario.options.map((label,i)=>({label,effects:effects[i],flag:'practice-'+i,result:scenario.feedback[i]}));
  if(brief.hours===HOURS[0]||brief.deadline===DEADLINES[0]){
   options[3]={label:'先用一小时做一件可验证的小事',effects:{project:4,energy:2},flag:'practice-short',result:'你把投入压缩成一小时，先验证一个关键问题，再决定是否继续。'};
  }
  return {...base,title:brief.focus,body:scenario.situation+' '+constraints,question:scenario.question,options};
 }
 const choice=game.flags.find(flag=>/^practice-[0-3]$/.test(flag));
 const index=Number(choice?.at(-1)??0);
 const feedback=game.flags.includes('practice-short')?'你用一小时做了初步验证，先确认最影响决定的一个信息缺口。':scenario.feedback[index];
 if(game.step===7)return {...base,id:base.id+'-review',title:'带着反馈再试一次',body:feedback+' '+scenario.exercise,options:[
  {label:'先做一次最小验证',effects:{project:9},flag:'practice-verify',result:'你完成了小规模验证，下一步比较实际反馈与预期。'},
  {label:'先向对方确认缺失信息',effects:{interview:9},flag:'practice-confirm',result:'你列出了待确认项，并为回复设了一个时间点。'},
  {label:'缩减投入，保留一个备选',effects:{energy:8,stress:-4},flag:'practice-backup',result:'你压缩了本轮投入，留出了切换方向的余地。'},
  {label:'调整期限，给难点留时间',effects:{stress:-7,research:4},flag:'practice-reschedule',result:'你重新安排了期限，可以用一项可验证成果衡量进度。'},
 ]};
 const next=game.flags.includes('practice-verify')?'你已经做过一次小验证，把结果写进下一轮计划。':game.flags.includes('practice-confirm')?'你已经列出待确认的信息，为回复设一个检查点。':game.flags.includes('practice-backup')?'你给自己留了备选，写清什么时候切换。':'你调整了期限，选一个能检验是否有进展的标准。';
 return {...base,id:base.id+'-plan',title:'把这次选择变成行动单',body:next+' 建议带走：'+scenario.deliverable,question:'要不要一起把行动单拆成七天内能完成的任务？',options:[
  {label:'先交付一份可以检查的成果',effects:{project:8},result:'行动单已记下：安排第一项成果和验收标准。'},
  {label:'先确认决定所缺的关键信息',effects:{interview:9},result:'行动单已记下：列出要问的人、问题和最晚答复时间。'},
  {label:'为主路线和备选各留时间',effects:{energy:7},result:'行动单已记下：拆分时间，并写下触发切换的条件。'},
  {label:'从一个小动作开始，三天后复盘',effects:{stress:-8},result:'行动单已记下：三天后检查第一次反馈，再决定是否加码。'},
 ]};
}
