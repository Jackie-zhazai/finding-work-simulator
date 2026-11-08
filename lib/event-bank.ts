import type {Game,GameEvent,Choice,Stats} from './game';
import {CITIES,cityInfo} from './world';
export type Stage='explore'|'build'|'intern'|'interview'|'choice'|'region'|'academic'|'graduate'|'entry'|'growth'|'change'|'settle';
type Spec={id:string;stage:Stage;title:string;body:string;options:Choice[];when?:(g:Game)=>boolean;weight?:number};
const o=(label:string,effects:Partial<Stats>,action?:string,route?:string,hint='',flag?:string):Choice=>({label,effects,action,route,hint,flag});
const e=(id:string,stage:Stage,title:string,body:string,options:Choice[],when?:(g:Game)=>boolean):Spec=>({id,stage,title,body,options,when});
// Each tuple is a distinct situation with distinct actions; these are not name substitutions.
const raw:[string,Stage,string,string,Choice[]][]=[
 ['e01','explore','招聘要求，比想象中长','你收藏了几份开发岗要求，却分不清哪些是核心技能，哪些只是加分项。',[o('对照三个岗位，找共同要求',{interview:7,skill:3},undefined,undefined,'减少准备分散。','job-map'),o('先做一个小功能试试',{project:8,energy:-4},undefined,undefined,'','prototype'),o('请在职学长解释工作内容',{interview:8,energy:-2},undefined,undefined,'','contact'),o('把课程基础先补稳',{skill:8,energy:-4})]],
 ['e02','explore','同学都在学新框架','群里每天都有新技术名词。你的时间不足以每个方向都试一遍。',[o('选一个方向做两周实验',{skill:7,project:4,energy:-5},undefined,undefined,'','trial'),o('跟随同学一起学',{skill:6,stress:3}),o('访谈使用者，再挑问题',{interview:8,project:3},undefined,undefined,'','user-research'),o('暂缓比较，恢复生活节奏',{energy:12,stress:-7})]],
 ['e03','explore','第一次开源协作','一个开源项目标记了适合新人的问题，但仓库比课程作业复杂得多。',[o('从文档修正开始',{project:5,interview:3},undefined,undefined,'','open-source'),o('尝试复现并修一个问题',{skill:8,project:7,energy:-7},undefined,undefined,'需要额外阅读和沟通。','open-source'),o('先阅读测试与贡献规范',{skill:6,project:3}),o('回到自己的项目先做完整',{project:8,energy:-4})]],
 ['e04','explore','家里问起毕业之后','家人希望你早点稳定下来，而你还没想清楚想做什么。',[o('把可选路线和预算讲清楚',{interview:6,stress:-4},undefined,undefined,'','family-talk'),o('优先考虑离家近的机会',{stress:-5},'home'),o('争取一个有期限的探索期',{money:-400,project:6},undefined,undefined,'探索不是无限延期。'),o('先接短期工作补生活费',{money:900,energy:-6},undefined,'过渡就业')]],
 ['e05','explore','课表与实习时间冲突','你有连续三天课程，而不少岗位希望每周到岗四天。',[o('先投能协商出勤的岗位',{interview:7},'apply'),o('和老师确认课程安排',{research:6,interview:4}),o('等假期集中实习',{project:7,skill:4}),o('考虑短期项目协作',{money:500,project:6,energy:-5},undefined,'自由职业')]],
 ['e06','explore','方向还没确定，也能开始吗','你对开发、测试和产品都有兴趣，但不想凭岗位名字决定。',[o('做一次后端小任务',{skill:6,project:4},'direction:后端开发'),o('做一次前端交互页面',{skill:6,project:4},'direction:前端开发'),o('体验测试与复现问题',{skill:5,interview:4},undefined,'测试 / 质量'),o('访谈并画一个业务流程',{interview:8,project:3},undefined,'产品 / 运营')]],
 ['e07','explore','竞赛报名截止前','队友邀请你参加比赛，但准备会占用项目和投递时间。',[o('承担自己熟悉的模块',{project:8,energy:-6},undefined,undefined,'','competition'),o('挑战不熟悉的任务',{skill:9,energy:-8,stress:4}),o('只参与短期讨论',{interview:5,energy:-2}),o('婉拒，完成当前计划',{project:6,stress:-2})]],
 ['e08','explore','社团需要一个预约工具','需求很小，却需要真的有人使用和维护。',[o('先确认最小可用范围',{project:7,interview:5},undefined,undefined,'','scoped'),o('直接开始写完整系统',{project:9,energy:-9,stress:3}),o('用现有工具先验证需求',{interview:7,project:4},undefined,undefined,'','user-research'),o('和另一位同学分工交付',{project:7,interview:6,energy:-4})]],
 ['b01','build','项目能运行，别人却用不了','你的环境里一切正常，换到另一台电脑却启动失败。',[o('补部署脚本与说明',{project:10,skill:4,energy:-5},undefined,undefined,'','deployed'),o('先加一个亮眼功能',{project:6,skill:4,energy:-5}),o('找同学从零试运行',{project:8,interview:5},undefined,undefined,'','tested'),o('减少依赖，缩小范围',{project:7,stress:-3})]],
 ['b02','build','项目面临需求变更','使用者希望加上你最初没有答应的功能。',[o('重新确认交付边界',{interview:8,project:5},undefined,undefined,'','scoped'),o('全部答应，熬夜补齐',{project:9,energy:-15,stress:8},undefined,undefined,'可能增加交付量，也会透支精力。'),o('分两次交付',{project:8,interview:5,energy:-5}),o('请对方先排优先级',{interview:9,project:3})]],
 ['b03','build','简历上的“负责整个项目”','项目由三个人共同完成，你需要说明自己实际做过什么。',[o('明确拆分个人贡献',{interview:9,project:5},undefined,undefined,'','evidence'),o('补一个自己独立完成的模块',{project:10,energy:-7},undefined,undefined,'','ownership'),o('整理协作记录和技术决策',{interview:8,project:5},undefined,undefined,'','evidence'),o('先做一次模拟讲解',{interview:10,energy:-4})]],
 ['b04','build','测试比预想中难写','边界条件让原来顺畅的演示出现问题。',[o('先覆盖核心流程',{project:9,skill:5,energy:-5},undefined,undefined,'','tested'),o('研究自动化测试',{skill:9,project:4,energy:-6}),o('记录问题并分优先级',{project:7,interview:4}),o('暂缓新功能，修关键缺陷',{project:8,energy:-4})]],
 ['b05','build','云资源开始收费','免费额度用完，继续在线运行项目需要成本。',[o('缩小资源规格',{money:-150,project:6},undefined,undefined,'先控制月度支出。'),o('保留演示环境，补录屏',{project:6,interview:3}),o('学习成本监控与部署优化',{skill:8,project:7,energy:-5},undefined,undefined,'','deployed'),o('暂停服务，提供本地运行说明',{money:100,project:3})]],
 ['b06','build','一个难复现的故障','只在某些操作顺序下，程序会丢失数据。',[o('先记录日志与复现步骤',{skill:8,project:7,energy:-5},undefined,undefined,'','debugged'),o('请同学交叉复现',{interview:5,project:7}),o('重构相关模块',{skill:9,project:5,energy:-9}),o('先限制危险操作',{project:6,stress:-3})]],
 ['b07','build','作品没有用户反馈','你不断增加功能，却不确定解决了谁的问题。',[o('找三位同学实际使用',{interview:8,project:7},undefined,undefined,'','user-research'),o('删掉多余功能',{project:7,stress:-3}),o('写清使用场景与限制',{interview:7,project:5},undefined,undefined,'','evidence'),o('继续增加技术复杂度',{skill:9,energy:-7})]],
 ['b08','build','学习资料看了很多','收藏夹越来越长，但你还没有可以讲清的成果。',[o('限定一周做出小作品',{project:10,energy:-6}),o('复盘一个完整知识点',{skill:8,interview:4}),o('边写边记录失败原因',{skill:6,project:7},undefined,undefined,'','evidence'),o('清理计划，只留一个目标',{energy:8,stress:-6,project:3})]],
 ['i01','intern','一份没有写清职责的实习','招聘页写着开发，沟通后却主要是整理表格和维护内容。',[o('先问清实际任务和导师',{interview:8},undefined,undefined,'','verified-role'),o('接受，优先获得收入',{money:1600,energy:-6},'bridge'),o('争取加入一个开发任务',{project:5,interview:6},'apply'),o('放弃这次，继续匹配岗位',{energy:-5,stress:3},'apply')]],
 ['i02','intern','实习要求连续到岗六个月','这段时间可能与课程、毕业或下一轮招聘冲突。',[o('争取三个月，约定阶段交付',{interview:9,energy:-3},'apply-short'),o('申请六个月实习，拿到机会再确认',{energy:-5},'apply-long'),o('找短期或假期岗位',{energy:-5},'apply-short'),o('先完成毕业任务',{research:10,stress:-4})]],
 ['i03','intern','实习机会在另一座城','搬家和押金需要先支付，收入要到下个月才到账。',[o('确认合同与预算后再去',{interview:5,money:-1200},'apply',undefined,'前期支出明确，机会仍不确定。'),o('先找当地同学了解住宿',{interview:7,money:-300}),o('优先当前城市机会',{energy:-4},'apply'),o('尝试远程短期协作',{project:6,money:500},undefined,'自由职业')]],
 ['i04','intern','导师很忙，任务却不少','实习中遇到的问题无人立即回答，交付时间仍在接近。',[o('整理问题，约定集中沟通',{interview:8,project:6}),o('先独立定位最小问题',{skill:9,project:5,energy:-6},undefined,undefined,'','debugged'),o('明确风险并调整交付',{interview:9,stress:-3}),o('加班兜底全部任务',{project:10,energy:-14,stress:8})]],
 ['i05','intern','两份实习邀请','一份内容相关但补贴少，另一份收入较好但任务偏重复。',[o('选择相关任务，控制预算',{project:10,money:-500,energy:-6},'intern'),o('选择收入，另留学习时间',{money:1800,skill:4,energy:-8},'bridge'),o('进一步确认导师与转正规则',{interview:10}),o('继续寻找第三种安排',{stress:4,energy:-5},'apply')]],
 ['i06','intern','找不到第一段实习','几批投递没有推进，你开始怀疑简历中的证据是否足够。',[o('只改最薄弱的一个项目',{project:10,interview:5,energy:-5}),o('扩大公司类型与规模',{interview:4,energy:-6},'apply'),o('考虑测试或实施的入口',{interview:6,skill:4},'apply-adjacent'),o('休整几天，重新安排',{energy:12,stress:-10})]],
 ['i07','intern','转正标准一直没明确','同事说有机会，但并没有人承诺名额和考核方式。',[o('正式询问标准与时间',{interview:10},undefined,undefined,'','verified-role'),o('保留外部投递',{energy:-7,stress:3},'apply'),o('整理实习成果，争取反馈',{project:9,interview:7},undefined,undefined,'','evidence'),o('把转正当备选，完成学业',{research:8,stress:-3})]],
 ['i08','intern','外包项目的成长与边界','项目上线快，但你接触不到核心设计，也不确定是否适合自己。',[o('争取完整负责一个小模块',{project:10,skill:4,energy:-6},undefined,undefined,'','ownership'),o('记录交付流程与业务理解',{interview:7,project:6}),o('寻找研发或其他技术岗位',{energy:-6},'apply-adjacent','其他技术'),o('先稳定收入再作打算',{money:1800,stress:-3},'bridge')]],
 ['v01','interview','面试官追问一次失败','你准备了成功演示，但对方想听你怎么发现问题、缩小范围和验证修复。',[o('复盘日志和排查过程',{interview:10,skill:4},undefined,undefined,'','evidence'),o('补一次完整故障演练',{skill:8,project:7,energy:-6},undefined,undefined,'','debugged'),o('约模拟面试暴露盲点',{interview:12,money:-200}),o('先恢复状态再安排下一场',{energy:12,stress:-8})]],
 ['v02','interview','笔试与课程考试同一天','两件事都重要，但无法同时到场。',[o('申请调整笔试时间',{interview:6,stress:2}),o('优先课程，换一批岗位',{research:8},'apply'),o('准备同类岗位下一场',{skill:8,interview:5}),o('减少投递数量，集中准备',{energy:7,stress:-5})]],
 ['v03','interview','技术题会写，却讲不清楚','你能完成任务，但解释方案时容易跳过关键前提。',[o('练习从约束讲到取舍',{interview:12}),o('录音复盘自己的讲解',{interview:10,stress:-3}),o('画架构图辅助表达',{project:5,interview:8}),o('继续增加题量',{skill:9,energy:-6})]],
 ['v04','interview','岗位与项目不在同一领域','对方问的是业务系统，你准备的是算法实验。',[o('解释可以迁移的工程部分',{interview:9,project:4},'apply'),o('补一个小型业务原型',{project:11,energy:-7}),o('转投更相关的研究岗位',{research:7},'apply-research','研究 / 深造'),o('先问清岗位的核心评价',{interview:9})]],
 ['v05','interview','招聘流程突然冻结','已经通过的一轮并没有变成下一轮邀请，招聘方通知暂缓。',[o('保留联系，同时继续投递',{interview:4,energy:-5},'apply'),o('询问时间与其他岗位',{interview:8}),o('复盘已有反馈',{project:6,interview:6}),o('暂停几天处理焦虑',{energy:12,stress:-10})]],
 ['v06','interview','一次不公平的沟通','某虚构团队在沟通中表达与岗位能力无关的偏见。这是该团队的行为，不能推断所有岗位。',[o('结束流程，寻找其他团队',{stress:-4,energy:-4},'apply'),o('询问具体要求并保留记录',{interview:6,stress:3}),o('请学校就业支持渠道协助',{interview:4,stress:-5}),o('先恢复状态再继续',{energy:12,stress:-8})]],
 ['v07','interview','学历筛选挡住一条路','某虚构集团本批岗位限定院校或学历，你未满足这条条件。',[o('调整目标，投其他岗位',{interview:5,energy:-4},'apply'),o('询问其他批次或岗位',{interview:7}),o('增加作品证据用于别处',{project:10,energy:-5}),o('重新比较升学与就业成本',{research:6,interview:4})]],
 ['v08','interview','最后一轮谈到工作地点','招聘信息与沟通中的实际地点不同，你需要重新判断。',[o('确认地点、任务与合同',{interview:9},undefined,undefined,'','verified-role'),o('按现有预算选择留在本地',{stress:-4},'home'),o('扩大城市范围',{energy:-5},'move-next'),o('不着急答应，继续比较',{interview:5},'apply')]],
 ['a01','academic','论文进度和实习撞在一起','研究任务尚未完成，实习又希望你尽早到岗。',[o('和导师明确最低毕业要求',{research:11,interview:5},undefined,undefined,'','grad-plan'),o('协商缩短实习时间',{interview:8,project:5},'apply'),o('优先研究，保留招聘窗口',{research:15,energy:-6}),o('两边都做，承担精力压力',{research:7,project:7,energy:-13,stress:6})]],
 ['a02','academic','复现实验没有得到结果','你不知道差异来自实现、数据还是原论文中的条件。',[o('记录差异，逐项验证',{research:13,skill:5,energy:-6},undefined,undefined,'','research-evidence'),o('找同方向同学交叉检查',{research:10,interview:4}),o('与导师讨论调整范围',{research:9,stress:-4}),o('保留结果，准备工程岗位',{project:7,interview:5},undefined,'开发')]],
 ['a03','academic','升学之后，目标需要重写','延长的学制不会自动带来更好的岗位，新的研究和生活要求也开始出现。',[o('先把研究与毕业计划写清楚',{research:13},undefined,undefined,'','grad-plan'),o('保留工程实践',{project:9,skill:4,energy:-5}),o('了解行业研究岗位要求',{interview:8,research:5}),o('确认资助与生活预算',{money:700,stress:-4})]],
 ['a04','academic','课程项目可以变成作品吗','你想把作业整理成求职证据，但目前还缺真实使用场景。',[o('补一次小范围使用测试',{project:10,interview:5},undefined,undefined,'','tested'),o('独立实现关键模块',{project:11,energy:-7},undefined,undefined,'','ownership'),o('写清课程限制与个人贡献',{interview:10},undefined,undefined,'','evidence'),o('先完成学分要求',{research:11,stress:-3})]],
 ['a05','academic','毕业材料比预想中多','手续、答辩、住宿和求职时间交错在一起。',[o('列出截止日期逐项完成',{research:11,stress:-6},undefined,undefined,'','grad-plan'),o('与同学协作核对材料',{interview:5,research:8}),o('暂缓投递，完成毕业',{research:14,energy:-4}),o('协商入职时间',{interview:8,stress:-3})]],
 ['a06','academic','导师希望继续读博','你喜欢一部分研究，但担心周期、资助和职业选择。',[o('访谈在读博士，核对条件',{research:7,interview:6}),o('做一次较长期研究尝试',{research:14,energy:-7}),o('优先寻找行业研究机会',{research:5},'apply-research','研究 / 深造'),o('保留研究兴趣，先就业',{interview:6,project:5},'apply')]],
 ['a07','academic','家中临时需要照护','一段时间里，你需要重新分配学业、准备和家庭事务。',[o('与家人协商分工',{stress:-6,interview:5}),o('优先本地或弹性机会',{energy:-3},'home'),o('暂缓一个任务，保住毕业',{research:9,stress:-3}),o('寻求学校支持与资源',{energy:8,stress:-7})]],
 ['a08','academic','同学的 Offer 带来焦虑','比较让你怀疑原来的安排，也打乱了自己的进度。',[o('回到个人条件重排目标',{interview:7,stress:-7}),o('只补一个最明显的缺口',{skill:8,project:4}),o('和朋友交换实际经历',{interview:6,stress:-5}),o('休息一段时间',{energy:15,stress:-10})]],
 ['n01','entry','第一份工作的边界','入职后，实际任务与想象不同。你想知道是适应期还是长期安排。',[o('和负责人明确预期',{interview:9,stress:-3},undefined,undefined,'','verified-role'),o('先交付一个完整任务',{project:10,skill:4,energy:-6},undefined,undefined,'','ownership'),o('保留外部机会',{energy:-6},'apply'),o('比较转向其他岗位',{interview:6,project:3},undefined,'产品 / 运营')]],
 ['n02','entry','还没有合适的工作','离校后生活支出持续，求职也需要结构化安排。',[o('限定每周投递与复盘',{interview:8,energy:-5},'apply'),o('接受过渡工作保住生活',{money:2200,energy:-6},'bridge'),o('补一个有证据的项目',{project:12,money:-300,energy:-6}),o('扩大城市范围',{energy:-5},'move-next')]],
 ['n03','entry','试用期的反馈很模糊','对方说需要更主动，但没有说明具体标准。',[o('确认可观察的交付目标',{interview:10,project:4},undefined,undefined,'','scoped'),o('每周同步进展与问题',{interview:8,stress:-4}),o('主动承担完整小任务',{project:11,energy:-7}),o('准备备选，避免单点依赖',{interview:5,energy:-5},'apply')]],
 ['n04','entry','岗位要求先培训再收费','一家虚构机构把就业机会与付费课程绑定，却不能明确岗位和退款安排。',[o('拒绝不明确的收费承诺',{stress:-3}),o('核对合同与可验证信息',{interview:8},undefined,undefined,'','verified-role'),o('通过学校或公开渠道找岗位',{energy:-5},'apply'),o('用免费资料补基础',{skill:8,energy:-4})]],
 ['n05','entry','产品岗位的第一次任务','你需要理解使用者和业务指标，而不是先选技术框架。',[o('访谈并整理核心问题',{interview:11,project:5},undefined,'产品 / 运营',undefined,'user-research'),o('先做小原型验证',{project:10,energy:-5},undefined,'产品 / 运营'),o('学习数据与业务分析',{skill:7,interview:6}),o('确认自己是否喜欢这类任务',{stress:-5,interview:5})]],
 ['n06','entry','测试岗位不只是点按钮','你要从需求中设计用例，复现偶发问题并和开发沟通。',[o('搭建回归检查',{skill:9,project:7,energy:-5},undefined,undefined,undefined,'tested'),o('深入一个故障链路',{skill:10,project:5},undefined,undefined,'','debugged'),o('学习需求与风险分析',{interview:9,project:4}),o('继续准备开发转岗',{skill:8,energy:-5},'direction:后端开发','开发')]],
 ['n07','entry','接到第一笔小项目','客户希望先看到效果，再谈付款和维护。',[o('约定范围、阶段与付款',{interview:9,project:5},undefined,'自由职业',undefined,'scoped'),o('先做付费小样',{money:900,project:7,energy:-5},'freelance','自由职业'),o('核算成本再决定',{interview:8,stress:-3}),o('优先稳定岗位',{energy:-5},'apply')]],
 ['n08','entry','收到一份看起来稳定的机会','工作内容偏行业系统，技术栈并不热门，但地点和生活比较合适。',[o('确认内容后尝试',{energy:-4},'apply'),o('比较成长与收入的取舍',{interview:8}),o('继续找更相关岗位',{energy:-5,stress:3},'apply'),o('把稳定生活作为当前优先',{stress:-8,money:1200})]],
 ['g01','growth','重复任务里还能学什么','你已经熟悉日常工作，却担心停滞。',[o('争取独立负责一个模块',{project:11,skill:6,energy:-6},undefined,undefined,'','ownership'),o('把重复劳动自动化',{skill:10,project:7,energy:-5}),o('约一次成长反馈',{interview:9,stress:-3}),o('稳定生活，保持小步学习',{skill:5,energy:9,stress:-5})]],
 ['g02','growth','团队开始调整业务','你的任务被合并，未来安排还没明确。',[o('确认安排并整理成果',{interview:9,project:4},undefined,undefined,'','evidence'),o('启动外部面试',{energy:-6,stress:3},'apply'),o('寻找内部相邻岗位',{interview:6},'apply-adjacent','其他技术'),o('留出现金缓冲',{money:900,stress:-3})]],
 ['g03','growth','一份跨行业机会','新行业更看重业务知识，原来的技术经验仍有一部分可迁移。',[o('先做业务与岗位访谈',{interview:11},undefined,'行业转向'),o('完成一个行业样例',{project:10,skill:4,energy:-6},undefined,'行业转向'),o('尝试投递并验证反馈',{energy:-5},'apply-other','行业转向'),o('保留原岗位继续观察',{money:1200,stress:-3})]],
 ['g04','growth','收入上升，生活也更贵了','你开始重新计算工作收入、通勤和日常支出之间的关系。',[o('优化住宿与通勤',{money:800,energy:6}),o('为更近的住处多付成本',{money:-600,energy:12,stress:-4}),o('尝试其他城市岗位',{energy:-5},'move-next'),o('把精力留给工作外的生活',{energy:14,stress:-9})]],
 ['g05','growth','同事邀请你一起做副业','想法有趣，但交付、客户与收入尚未验证。',[o('先做一个有限试验',{project:8,money:-400,energy:-5},undefined,'自由职业'),o('明确分工和退出条件',{interview:10},undefined,undefined,'','scoped'),o('访谈潜在使用者',{interview:8,project:4},undefined,undefined,'','user-research'),o('暂不参与，稳定主业',{energy:9,stress:-4,money:700})]],
 ['g06','growth','一次生产故障','团队需要尽快恢复服务，同时找出原因。',[o('先止损，再记录复盘',{project:10,skill:6,energy:-7},undefined,undefined,'','debugged'),o('明确分工并同步风险',{interview:10,project:6}),o('补监控与回归检查',{skill:10,project:8,energy:-5},undefined,undefined,'','tested'),o('寻求有经验同事协助',{skill:6,interview:6,stress:-4})]],
 ['g07','growth','工作和兴趣开始分开','你发现自己擅长的内容，并不完全是最初想做的方向。',[o('争取内部轮岗',{interview:6},'apply-adjacent','其他技术'),o('工作外做小型尝试',{project:9,energy:-6}),o('转向更喜欢的非技术任务',{interview:10},'apply-other','产品 / 运营'),o('接受阶段安排，继续积累',{skill:6,money:900,stress:-5})]],
 ['g08','growth','长期加班开始影响状态','收入和成长都重要，但精力已经不足。',[o('明确优先级与交付范围',{interview:9,energy:8,stress:-6}),o('安排休息与交接',{energy:18,stress:-12}),o('寻找节奏更合适的团队',{energy:-4},'apply'),o('离开现岗位，整理生活',{energy:22,stress:-15,money:-1200},'leave','休整与探索')]],
 ['s01','settle','两年后的目标，和起点不同','你更清楚自己愿意为收入、兴趣和生活分别付出多少。',[o('守住现在适合的部分',{energy:9,stress:-7,money:900}),o('再试一个更匹配机会',{energy:-4},'apply'),o('为转向准备可验证作品',{project:11,energy:-4}),o('给自己一段不急着决定的时间',{energy:15,stress:-10,money:-500},'rest','休整与探索')]],
 ['s02','settle','回到家乡，还是留在外地','你不再只比较岗位名称，也开始比较日常生活。',[o('回家乡寻找可持续工作',{stress:-6},'home'),o('留在当前城市，调整生活',{money:-300,energy:10}),o('试试另一座区域中心',{energy:-4},'move-next'),o('先问清弹性工作条件',{interview:8},'apply')]],
 ['s03','settle','想重新开始，需要多少准备','转向并不是清空过去，但也不是零成本切换。',[o('列出可迁移的经历',{interview:10,project:4}),o('做一次小规模方向试验',{project:10,energy:-5},undefined,'行业转向'),o('开始邻近岗位申请',{energy:-4},'apply-adjacent','其他技术'),o('先保留收入，逐步调整',{money:1200,stress:-4})]],
 ['s04','settle','一份新 Offer 与现状','新机会并非每个维度都更好，需要重新衡量。',[o('比较内容、地点与生活成本',{interview:9}),o('尝试更匹配的机会',{energy:-4},'apply'),o('留在熟悉团队继续成长',{project:8,money:1000}),o('不急着选择，确认合同细节',{interview:9},undefined,undefined,'','verified-role')]],
 ['s05','settle','没有标准答案的阶段总结','一些目标达到了，一些还在路上。你想把下一步留给什么？',[o('用新作品再试开发岗',{skill:9,project:5},'apply-development','开发','可以验证准备成果，也会占用一轮求职时间。'),o('稳定收入与生活',{money:1400,energy:9,stress:-6}),o('扩大行业和岗位探索',{interview:8},undefined,'行业转向'),o('休整并重新确认目标',{energy:16,stress:-12},'rest','休整与探索')]],
 ['s06','settle','朋友提起考编与其他工作','你想了解另一类职业，但准备周期和岗位条件都需要重新核实。',[o('先了解资格与工作内容',{interview:8},undefined,'考试与公共服务'),o('申请公共服务项目，同时继续备考',{research:8,interview:5,energy:-5},'apply-public','考试与公共服务'),o('比较后继续当前路径',{skill:7,stress:-4}),o('先做一次真实任务体验',{project:7,interview:6},undefined,'行业转向')]],
 ['s07','settle','自由业务能否持续','有项目不等于有稳定收入，你需要考虑下一段时间。',[o('明确报价与维护范围',{interview:10,money:1200},undefined,'自由职业',undefined,'scoped'),o('接受一份有明确范围的独立项目',{project:8,interview:6},'freelance','自由职业'),o('把作品用于正式求职',{energy:-4},'apply'),o('控制支出，保留缓冲',{money:800,stress:-5})]],
 ['s08','settle','重新定义这一段经历','你可以承认失落，也可以保留已经积累的东西。',[o('整理具体成果与不足',{interview:8,project:4},undefined,undefined,'','evidence'),o('和信任的人交流',{energy:10,stress:-10}),o('列出一个月内可做的行动',{skill:5,project:5,stress:-4}),o('先把生活照顾好',{energy:17,stress:-12})]]
];
function scenarioCondition(id:string):Spec['when'] {
 if(id==='v06')return g=>g.profile.gender==='女';
 if(id==='v07')return g=>!['985高校','211高校','双一流非211高校'].includes(g.profile.school);
 if(id==='n01'||id==='n03')return g=>!!g.employment;
 if(id==='n02')return g=>!g.employment;
 if(id==='n05')return g=>g.route==='产品 / 运营'||/产品|运营/.test(g.job);
 if(id==='n06')return g=>g.route==='测试 / 质量'||/测试|质量/.test(g.job);
 return undefined;
}
export const EVENT_BANK:Spec[]=raw.map(([id,stage,title,body,options])=>e(id,stage,title,body,options,scenarioCondition(id)));
const challenges:[string,string,string,string][]=[
 ['前端开发','交互在手机上失效','桌面演示正常，手机键盘弹出后却挡住了操作。','响应式与可访问性'],
 ['前端开发','页面加载慢在哪里','接口、图片和渲染都可能影响体验，不能只凭感觉优化。','性能与测量'],
 ['后端开发','重复请求造成重复订单','接口重试暴露了幂等与数据一致性的问题。','接口与数据一致性'],
 ['后端开发','慢查询影响整个服务','需要区分查询、索引和业务访问方式的影响。','数据库与压测'],
 ['移动端开发','旧设备上的兼容问题','一部分设备启动缓慢，网络切换后状态也会异常。','生命周期与兼容性'],
 ['移动端开发','离线之后怎么恢复','页面状态与服务器状态需要重新同步。','缓存与同步'],
 ['游戏开发','玩法有趣，帧率却不稳定','你要定位资源加载、逻辑与渲染中的瓶颈。','性能与游戏循环'],
 ['游戏开发','内容做完，玩家却没看懂','关卡引导与反馈比增加素材更紧迫。','玩法验证与反馈'],
 ['嵌入式开发','硬件到货晚了','模拟环境正常，但真实设备调试时间被压缩。','硬件联调'],
 ['嵌入式开发','偶发的设备重启','电源、时序和程序都可能是原因，需要控制变量。','日志与时序'],
 ['数据开发','数据口径不一致','两个报表都能运行，数字却无法互相解释。','数据质量与口径'],
 ['数据开发','任务重跑产生重复数据','需要考虑重试、增量与数据恢复。','调度与可靠性'],
 ['算法工程','离线指标好，实际体验一般','数据分布、评价方式和部署条件都值得检查。','评估与工程化'],
 ['算法工程','复现结果与论文不同','实验设置和数据处理必须形成可验证记录。','实验复现'],
];
challenges.forEach(([direction,title,body,focus],i)=>EVENT_BANK.push(e('d'+i,'build',title,body,[o('先测量，再定位问题',{skill:9,project:7,energy:-5},undefined,undefined,`积累${focus}的证据。`,'debugged'),o('请别人复现并交叉检查',{interview:6,project:8},undefined,undefined,'','tested'),o('缩小范围，先保证核心可用',{project:9,stress:-3}),o('整理成一次可讲清的复盘',{interview:10,project:5},undefined,undefined,'','evidence')],g=>g.profile.direction===direction)));
const regions:[string,string,string][]=[['华北','离家与研究机会之间','新机会的任务更相关，但通勤与租住安排需要重新计算。'],['华东','行业项目与生活成本','不同城市的团队与生活方式差异，需要比较具体岗位。'],['华南','硬件现场还是应用团队','一些任务需要到现场联调，另一些更偏应用交付。'],['华中','留在熟悉的城市','朋友和学校资源就在附近，你也想了解外地机会。'],['西南','兴趣行业与稳定生活','行业吸引力之外，还需要确认工作内容和招聘条件。'],['西北','研究积累怎么进入行业','本地项目和异地机会需要不同的迁移准备。'],['东北','本地交付与跨城选择','行业软件、服务交付和异地岗位各有不同条件。']];
regions.forEach(([region,title,body],i)=>EVENT_BANK.push(e('r'+i,'region',title,body,[o('先核算预算和通勤',{interview:6,money:300},undefined,undefined,'查看城市预算，并不保证真实支出。'),o('迁往另一座城市尝试',{energy:-5},'move-next',undefined,'需要搬迁支出，岗位仍须重新匹配。'),o('回到家乡附近寻找',{stress:-5},'home'),o('优先远程项目协作',{project:7,interview:4,money:500},undefined,'自由职业')],g=>cityInfo(g.city).region===region)));
// A shared regional situation remains eligible for every profile.
EVENT_BANK.push(e('r-shared','region','城市不是岗位的全部','同一座城市也有不同团队。你准备把地区、工作内容和生活放在一起比较。',[o('比较真实任务与合同条件',{interview:8},undefined,undefined,'','verified-role'),o('尝试跨城机会',{energy:-5},'move-next',undefined,'搬迁会消耗储备。'),o('回家乡附近寻找',{stress:-5},'home'),o('保留当前城市，扩大岗位范围',{energy:-4},'apply-adjacent','其他技术')]));
EVENT_BANK.push(e('choose','choice','你还想沿着这条路走吗？','准备与接触岗位后，你可以继续开发、换方向、深造，或尝试其他职业。',[o('继续开发，把准备做深',{skill:12,project:9},undefined,'开发'),o('转向产品或运营',{interview:10,project:3},undefined,'产品 / 运营','需要补业务与沟通实践。','career-switch'),o('准备升学，延长研究路径',{research:13,money:-800},'study','研究 / 深造','毕业节点后移，增加研究与资金要求。'),o('专门准备质量工程岗位',{skill:6,interview:5},undefined,'测试 / 质量','需要练习用例设计、故障定位和自动化。','tested')]));
EVENT_BANK.push(e('graduate','graduate','毕业前的最后一段协调','毕业、求职和离校同时接近。当前毕业准备会影响是否需要延期。',[o('优先完成毕业条件',{research:17,energy:-5},undefined,undefined,'','grad-plan'),o('协调入职和答辩时间',{research:10,interview:6}),o('主动延期半年，补足准备',{research:14,skill:5,money:-700},'delay',undefined,'预计毕业时间后移半年。'),o('先安排收入，再逐项完成',{research:8,money:1000,energy:-5})]));
EVENT_BANK.push(e('change','change','新的选择，不必抹掉过去','工作一段时间后，你有了比最初更具体的判断。方向可以调整，但需要准备与验证。',[o('留在当前路径继续积累',{project:8,skill:5}),o('换一个技术方向试试',{skill:5,interview:5},'direction-next','开发','已有经验部分迁移，需要补新方向基础。'),o('转向产品、运营或其他行业',{interview:9,energy:-4},'apply-other','行业转向'),o('阶段性休整，再确认目标',{energy:20,stress:-14,money:-700},'rest','休整与探索')]));
// Route-specific follow-ups; they supplement shared situations, rather than isolating people into rigid stories.
const routeEvents:[string,string,string,string,string][]=[
 ['p01','产品 / 运营','用户说的，和使用时不同','访谈中的需求与实际行为有差异。','访谈、观察与验证'],['p02','产品 / 运营','活动数据没有达到预期','需要确认目标、渠道与数据口径。','复盘与业务指标'],['p03','行业转向','行业术语挡住了沟通','技术能解决部分问题，但你还不了解业务约束。','行业任务与迁移'],['p04','行业转向','从开发经历讲到新岗位','你需要说明已有经历在哪些部分有效。','可迁移证据'],
 ['q01','测试 / 质量','偶发问题如何变成用例','复现步骤和边界条件需要整理给团队。','质量与沟通'],['q02','测试 / 质量','自动化投入是否划算','不是每个重复操作都值得立刻写脚本。','优先级与回归'],
 ['f01','自由职业','客户拖延确认需求','不明确的范围增加返工与收款风险。','交付范围与合同'],['f02','自由职业','项目结束，维护还在继续','你需要决定哪些维护属于原约定。','维护边界'],['f03','自由职业','报价能否覆盖时间','收入必须扣除沟通、维护和空档成本。','成本与可持续性'],
 ['x01','研究 / 深造','研究方向需要缩小','原计划太大，短期难以形成可验证进展。','研究范围'],['x02','研究 / 深造','行业研究还是继续学术','研究兴趣、工程准备和毕业要求并不完全一致。','研究职业探索'],['x03','休整与探索','暂停之后如何恢复','你希望重新行动，但不想立即回到透支节奏。','小步恢复'],['x04','过渡就业','过渡工作占满准备时间','现金流改善，学习和求职时间却变少。','时间边界'],['x05','其他技术','岗位比名称具体','实施、运维、测试与数据支持的日常任务不同。','具体任务匹配'],['x06','考试与公共服务','另一条路也有门槛','报考资格、准备周期和工作内容需要核实。','资格与准备周期']
];
routeEvents.forEach(([id,route,title,body,focus])=>EVENT_BANK.push(e(id,'growth',title,body,[o('拆成一个可验证的小目标',{project:8,interview:5,energy:-4},undefined,undefined,`先确认${focus}。`,'scoped'),o('向从业者了解实际任务',{interview:10,stress:-3},undefined,undefined,'','contact'),o('尝试一份相关机会',{energy:-4},route==='自由职业'?'freelance':route==='休整与探索'?'apply-development':route==='过渡就业'?'bridge':'apply',route),o('保留生活缓冲再推进',{money:600,energy:8,stress:-4})],g=>g.route===route)));
export const PLAN:Stage[]=['explore','explore','build','build','intern','intern','interview','build','intern','interview','choice','region','academic','interview','academic','graduate','entry','entry','growth','growth','change','region','growth','settle','settle','settle'];
export const SHORT_STEPS=[0,2,4,6,8,10,11,12,15,16,17,18,20,21,22,25];
export const EVENT_COUNT=EVENT_BANK.length;
function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
export function selectEvent(g:Game):GameEvent{
 const step=g.shortRun?SHORT_STEPS[Math.min(g.step,SHORT_STEPS.length-1)]:Math.min(g.step,PLAN.length-1);
 const stage=PLAN[step];
 let pool=EVENT_BANK.filter(e=>e.stage===stage&&(!e.when||e.when(g))&&!g.history.some(h=>h.eventId===e.id));
 if(!pool.length)pool=EVENT_BANK.filter(e=>e.stage===stage&&(!e.when||e.when(g)));
 // Route follow-ups can replace shared growth moments, but are not compulsory every time.
 if(stage==='growth'){const special=pool.filter(e=>e.when);if(special.length&&hash(g.id+g.step)%3!==0)pool=special;}
 if(stage==='build'){const special=pool.filter(e=>e.id.startsWith('d'));if(special.length&&hash(g.id+g.step)%2===0)pool=special;}
 const fresh=pool.filter(e=>!g.recentEvents.includes(e.id));if(fresh.length)pool=fresh;
 const spec=pool[hash(g.id+'-'+g.step+'-'+g.route)%pool.length];
 let body=stage==='region'?`${spec.body} 你目前在${g.city}。`:spec.body;
 if(g.flags.includes('deployed')&&stage==='interview')body+=' 你已经有可运行的作品，可以用它说明实际贡献。';
 if(g.flags.includes('scoped')&&stage==='growth')body+=' 你之前练习过明确范围，这次可以用上。';

 let options=spec.options.map(c=>({...c,effects:{...c.effects}}));
 if(step===17)options[3]=o('按当前方向申请一次机会',{interview:6,energy:-4},'apply');
 if(step===22&&!g.employment)options[3]=o('再投一次当前方向的岗位',{interview:7,energy:-5},'apply');
 if((stage==='academic'||stage==='graduate')&&g.employment?.months===6){
  options[1]=o('协商缩短实习，完成交接后退出',{research:8,interview:4},'end-internship',undefined,'会释放毕业准备时间，但这份实习收入和转正机会会中止。');
 }
 if(spec.id==='choose'&&g.degree==='博士')options[2]=o('先验证行业研究岗位',{research:8,interview:5},'apply-research','研究 / 深造');
 if(spec.id==='choose'&&g.degree==='硕士')options[2].label='申请博士，继续研究';
 if(stage==='region'){const next=CITIES[(CITIES.indexOf(g.city)+5+hash(g.id)%7)%CITIES.length];options=options.map(c=>c.action==='move-next'?{...c,label:`去${next}尝试新的机会`,city:next}:c);}
 const showHint=hash(g.id+'hint'+g.step)%3===0;
 const hintIndex=showHint?options.findIndex(option=>option.hint):-1;
 options=options.map((option,index)=>index===hintIndex?option:{...option,hint:undefined});
 return {id:spec.id,tag:{explore:'探索起点',build:'积累证据',intern:'实习现场',interview:'招聘与面试',choice:'路线分岔',region:'城市与流动',academic:'学业与生活',graduate:'毕业节点',entry:'入行与尝试',growth:'工作与转向',change:'再次选择',settle:'两年之后'}[stage],title:spec.title,body,options};
}
