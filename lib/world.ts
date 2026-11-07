export const GRADES=['大二','大三','大四','研一','研二','研三'];
export const DIRECTIONS=['后端开发','前端开发','移动端开发','游戏开发','嵌入式开发','数据开发','算法工程','尚未确定'];
export const SCHOOLS=['985高校','211高校','双一流非211高校','普通一本','普通二本','民办本科','专升本院校'];
export const CITY_DATA=[
 {name:'北京',region:'华北',cost:4400,sector:'研究与企业服务'}, {name:'上海',region:'华东',cost:4700,sector:'金融与商业软件'},
 {name:'深圳',region:'华南',cost:4200,sector:'硬件与互联网'}, {name:'杭州',region:'华东',cost:3600,sector:'电商与平台业务'},
 {name:'广州',region:'华南',cost:3200,sector:'商业服务与游戏'}, {name:'成都',region:'西南',cost:2600,sector:'游戏与企业软件'},
 {name:'武汉',region:'华中',cost:2300,sector:'工业与数字服务'}, {name:'西安',region:'西北',cost:2200,sector:'研发与工业软件'},
 {name:'南京',region:'华东',cost:2800,sector:'企业软件与研发'}, {name:'苏州',region:'华东',cost:2600,sector:'制造与工业系统'},
 {name:'合肥',region:'华东',cost:2200,sector:'制造与研发'}, {name:'长沙',region:'华中',cost:2100,sector:'内容与企业服务'},
 {name:'重庆',region:'西南',cost:2300,sector:'制造与数字业务'}, {name:'郑州',region:'华中',cost:2000,sector:'本地商业系统'},
 {name:'济南',region:'华东',cost:2100,sector:'企业与公共服务'}, {name:'青岛',region:'华东',cost:2500,sector:'工业与商业软件'},
 {name:'沈阳',region:'东北',cost:1900,sector:'工业与本地服务'}, {name:'大连',region:'东北',cost:2200,sector:'软件服务与交付'},
 {name:'昆明',region:'西南',cost:2000,sector:'本地生活与文旅'}, {name:'南宁',region:'华南',cost:1800,sector:'本地商业与跨境服务'},
 {name:'福州',region:'华东',cost:2300,sector:'商业与行业软件'}, {name:'厦门',region:'华东',cost:2900,sector:'电商与应用服务'},
 {name:'兰州',region:'西北',cost:1800,sector:'本地行业服务'}, {name:'哈尔滨',region:'东北',cost:1800,sector:'工业与科研协作'}
];
export const CITIES=CITY_DATA.map(c=>c.name);
export const cityInfo=(city:string)=>CITY_DATA.find(c=>c.name===city)||CITY_DATA[6];
export const FAMILIES=['父母稳定就业，家庭收入普通','单亲家庭，家人支持但预算有限','个体经营家庭，收入有波动','农村家庭，主要依靠务农与务工','双职工家庭，有一定积蓄','与祖辈共同生活，需兼顾照护','家中有弟妹在读，支出较多','家庭经济宽裕，愿意支持探索','父母临近退休，希望工作稳定','家庭有负债，需要控制试错成本'];
export const SUPPORTS=['可支持基本生活','需要尽早获得收入','有一定试错空间'];
export const INTERNSHIPS=['暂无实习','校园团队项目协作','本地小公司开发实习','外包项目实习','制造企业信息化实习','中型互联网企业实习','大型企业开发实习','科研团队工程助理'];
export const PROJECTS=['课程管理系统','校园二手交易平台','个人网站与组件库','开源工具的小型贡献','物联网采集装置','小游戏原型','数据处理与可视化工具','实验室自动化脚本','家庭记账应用','预约与排班系统','只有课程作业，尚无完整项目'];
export const COMPETITIONS=['暂无竞赛经历','参加过校赛','省级程序设计竞赛','数学建模团队经历','创新创业项目经历','机器人或嵌入式竞赛','网络安全实践赛','设计与产品类比赛'];
export const RESEARCH=['暂无科研经历','阅读过方向论文','参与实验室工程项目','复现实验进行中','正在准备论文','已有阶段性研究成果'];
export const GOALS=['收入优先','成长与技术深度','城市与家人距离','稳定与生活节奏','兴趣匹配','尚在探索'];
export const LIVING=['校内宿舍','与家人同住','与同学合租','独自租住'];
export const SOURCE_NOTE='城市成本、岗位待遇、机会概率均为游戏情境参数，不是招聘信息或真实地区统计。';
