// 绿港小贴士数据中心
// 新增便利贴时，复制下面的模板，修改内容并放在 noteData 数组中即可。
// id 必须在全部便利贴中唯一，不能按分类重新编号；已有便利贴不要改号。
// 图片路径相对于 index.html，例如："assets/images/shore-power.svg"
// 本地配图须实际放入对应目录；发布到 GitHub 时保留目录结构及文件名大小写。
// 图片会完整缩放为预览，标题自动换行并撑高卡片；较长的背面详情可滚动查看。
// 多图使用 images: ["图片地址1", "图片地址2"]，按顺序显示并分别放大；非空 images 优先于 image。
// link 只填写网址；自定义按钮名称或多个链接请使用 links 数组。
// 普法便利贴使用 type: "law"，自动显示为浅紫色并计入普法筛选与分类人气。
// 政策和普法的 basis 填写依据文件名、章节或条款位置；留空时显示“待补充”。
// 行业黄页使用 type: "industry"；复制数组末尾的模板，每家机构用一个唯一 id。
// title 填常用中文名，organization 填机构资料；greenDirections 最多填写 3 个方向。
// links 分别填写官网、具体项目／报告链接；没有链接时留空，不填示例网址。
// verifiedDate 填实际核验日期，source 填官方资料名称与章节；项目阶段不能把计划写成投运。
// 填写并核验完成后将 isTemplate 改为 false，启用收藏、取用和排行榜。
// 岗位观察使用 type: "job"，jobProfile 填招聘单位、要求、工作方向、新人关注点、来源与招聘状态。
// date 是资料日期；jobProfile.verifiedDate 是实际核验日期，未核实须留空，截止日期未知时留空。
// 招聘平台首页不能当作具体岗位公告；links 标签应说明入口类型，有详情后再补充详情链接。
// 复制岗位样本时保留独立 id；每条岗位只代表一个样本，不直接推断集团战略或校招范围。
//
// {
//   id: 50, // 使用尚未占用的唯一编号
//   type: "policy", // policy（政策）、term（术语）、industry（行业黄页）、job（岗位观察）、law（普法）
//   title: "一句话标题",
//   icon: "📌",
//   detail: "详细解释文字",
//   basis: "",
//   link: "https://example.com/原文链接",
//   links: [
//     { label: "查看流程", url: "process.html" },
//     { label: "查看原文", url: "https://example.com/原文链接" }
//   ],
//   image: "assets/images/example.jpg",
//   qrLink: "https://example.com/二维码指向地址",
//   views: 0,
//   weekViews: 0,
//   monthViews: 0,
//   favorites: 0,
//   date: "2026-03-10"
// }

const noteData = [
  {
    id: 1,
    type: "policy",
    basis: "",
    title: "绿色港口等级评价指南",
    icon: "📘",
    detail: "评价围绕节能降碳、清洁能源、污染防治和资源循环等方向展开，港口可以按年度自评并申请相应等级。评价流程共 7 步：申请受理 → 企业自评 → 材料审查 → 现场评价 → 综合确定 → 公示授牌 → 后续监督。",
    link: "process.html",
    links: [
      { label: "查看流程", url: "process.html" },
      { label: "查看政策原文", url: "https://www.chinaports.org/site/content/259355.html" }
    ],
    image: "assets/images/green_video.jpg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 2,
    type: "policy",
    basis: "法典第二百三十五条",
    title: "岸电使用政策",
    icon: "⚓",
    detail: "船舶靠泊具备受电条件时，应优先使用岸电。岸电能减少靠港期间的噪声、硫氧化物和颗粒物排放。",
    link: "https://xxgk.mot.gov.cn/2020/gz/202505/W020250521605429342962.pdf",
    image: "assets/images/shore-power.svg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 3,
    type: "term",
    title: "岸电 Shore Power",
    icon: "🔌",
    detail: "船舶靠港时关闭自身发电机，改用岸上电力。它是港口减少船舶靠泊期间碳排放和空气污染物的重要方式。",
    link: "https://m.thepaper.cn/baijiahao_16725248",
    image: "https://ts1.tc.mm.bing.net/th/id/R-C.afc144992b2a35171234f80c864056e5?rik=arbqiXh7OlYJgg&riu=http%3a%2f%2fwenhui.whb.cn%2fu%2fcms%2fwww%2f202304%2f23184626pze3.jpg&ehk=GUlfVxcuh4gmOHwIKfN0GO4W6lyME%2f7VxEZTDNMt5zA%3d&risl=&pid=ImgRaw&r=0",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 4,
    type: "term",
    title: "碳足迹 Carbon Footprint",
    icon: "🌱",
    detail: "港口运营过程中直接和间接产生的温室气体总量，核算对象包括装卸设备、港区运输、建筑用能以及外购电力等。碳足迹是绿色港口核算排放和制定减排措施的基础。",
    link: "https://www.kepuchina.cn/article/articleinfo?business_type=100&ar_id=619924",
    image: "https://ts1.tc.mm.bing.net/th/id/R-C.c4a03db386ae2eac48239abcf9da52b9?rik=g0zJRM3XBRoj6Q&riu=http%3a%2f%2fi8.hexun.com%2f2023-11-02%2f210920551.png&ehk=aEWP8PQN1yvJL2wSKP2syU7LFAA7wX0f4V61l05SPJE%3d&risl=&pid=ImgRaw&r=0",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 37,
    type: "term",
    title: "智能调度 Smart Scheduling",
    icon: "🤖",
    detail: "智能调度是利用信息技术和算法优化港口作业计划，提高设备利用率和作业效率，减少能源消耗和排放。",
    links: [
      { label: "查看解析", url: "https://baike.baidu.com/item/智能调度" },
      { label: "查看政策原文", url: "https://www.news.cn/local/20260224/aad5761befd6488ab59e23eb29fffb64/c.html" }
    ],
    image: "assets/images/smart-scheduling.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 7,
    type: "term",
    title: "防风网 Windbreak Net",
    icon: "🌀",
    detail: "防风网是设置在煤堆场周围的大型网体，用于阻挡煤灰随风扩散，减少粉尘污染。",
    link: "https://baike.baidu.com/item/防风网",
    image: "https://ts1.tc.mm.bing.net/th/id/OIP-C.CsH19O2ODS21iyRo7AbJSAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 8,
    type: "term",
    title: "水水中转 Water Transfer",
    icon: "🛳️",
    detail: "水水中转是指货物由大船换装到小船，全程不经过陆地，减少集卡运输和尾气排放。",
    link: "https://baike.baidu.com/item/水水中转",
    image: "https://ts1.tc.mm.bing.net/th/id/OIP-C.ml0gCZq0NQKM7RxMz7lLZwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 9,
    type: "term",
    title: "海铁联运 Sea-Rail Intermodal Transport",
    icon: "🛤️",
    detail: "海铁联运是指货物下船后直接装上火车，由铁路完成后续运输，比公路运输更环保。",
    link: "https://baike.baidu.com/item/海铁联运",
    image: "https://ts1.tc.mm.bing.net/th/id/R-C.9967f6e84958e06a9fb9b51fc4698a6e?rik=Bser02UD6IRjxw&riu=http%3a%2f%2fvip-public.people.com.cn%2fphoto%2f2025%2f7%2f2%2f7c7f6886ba49491f9ebb2e002f52f938jsw6_m.jpg&ehk=b%2bRYN7eNq%2fhj3wH1ldg0xncnMFduts7%2bzgPp6Hyi9lE%3d&risl=&pid=ImgRaw&r=0",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 10,
    type: "term",
    title: "近零碳港区 Near-Zero Carbon Port Area",
    icon: "🌱",
    detail: "近零碳港区就是通过优化运输结构、用节能技术、替换清洁能源、加强碳管理，让整个港区一年的二氧化碳排放量几乎降到零。注意是\"趋近于零\"不是绝对零，就是能减的都减了，剩下少量再通过其他方式抵消。",
    link: "http://www.bzfxw.com/TB/1115512.html",
    image: "https://aka.doubaocdn.com/s/6X8gcDa1Pr",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 11,
    type: "term",
    title: "零碳码头 Zero-Carbon Terminal",
    icon: "🏗️",
    detail: "零碳码头就是码头所有作业设备（岸桥、场桥等）全用电，而且用的电全部来自风电、光伏等绿色能源，不需要烧煤烧油。",
    link: "https://paper.people.com.cn/rmrb/pc/content/202507/19/content_30088851.html",
    image: "https://aka.doubaocdn.com/s/EtOUWUzvtn",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 12,
    type: "term",
    title: "绿色航运走廊 Green Shipping Corridor",
    icon: "🛳️",
    detail: "绿色航运走廊不是一个港口，而是一条海上航线。这条航线的起点港和终点港都做绿色化改造（岸电、绿色燃料加注），船上也用零碳燃料，整条航线从头到尾都是低碳的。",
    link: "http://www.ningbo.gov.cn/col/col1229196404/art/2026/art_92dc89fa5a2668f275e465f2f5661bdb.html",
    image: "https://aka.doubaocdn.com/s/0Pf23UDqPQ",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 13,
    type: "term",
    title: "船舶排放控制区 Emission Control Area",
    icon: "🛳️",
    detail: "船舶排放控制区是指国际海事组织（IMO）规定的对船舶排放的硫氧化物（SOx）、氮氧化物（NOx）等污染物实施严格控制的海域，船舶在该区域内必须使用低硫燃料或采取其他减排措施，以减少对环境的影响。",
    link: "http://big5.www.gov.cn/gate/big5/www.gov.cn/zhengce/zhengceku/2018-12/31/content_5444672.html",
    image: "https://aka.doubaocdn.com/s/CEIynb2Hnv",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 14,
    type: "term",
    title: "码头油气回收 Terminal Oil and Gas Recovery",
    icon: "🛢️",
    detail: "油轮装原油或者汽油的时候，油在船舱里晃来晃去会挥发出很多油气，直接排到空气里既污染又浪费。油气回收就是用管道把这些挥发出来的油气收集起来，冷凝或者吸附后重新变成液体油回收利用。",
    link: "http://xxgk.mot.gov.cn/jigou/zhghs/202006/t20200630_3319803.html",
    image: "https://aka.doubaocdn.com/s/En8lh3ga6U",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
   {
    id: 15,
    type: "term",
    title: "港口粉尘治理 Port Dust Control",
    icon: "🛳️",
    detail: "煤炭、矿石码头卸货、堆存、装车的时候容易起灰，周边全是黑的。粉尘治理就是用各种办法把灰压住：堆场建防风抑尘网、洒水喷雾降尘、料口全封闭作业等。",
    link: "https://xxgk.mot.gov.cn/jigou/syj/202501/P020250107637549565318.pdf",
    image: "https://aka.doubaocdn.com/s/8d6sDVsgEv",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 16,
    type: "term",
    title: "港口分布式光伏 Port Distributed Photovoltaic",
    icon: "☀️",
    detail: "港口分布式光伏是指在港口区域内建设分布式光伏发电系统，通过利用港口闲置屋顶、堆场等空间安装光伏组件，实现清洁能源的就地消纳，降低港口碳排放，提升能源利用效率。",
    link: "https://www.yantai.gov.cn/art/2024/8/6/art_99959_73355.html",
    image: "https://aka.doubaocdn.com/s/BWleQ7i49X",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
   {
    id: 17,
    type: "term",
    title: "氢能港口 Port Hydrogen Energy Port",
    icon: "⚡",
    detail: "氢能港口就是把氢气作为能源，用在港口的各种设备上：氢能拖轮（拖船）、氢能集卡（集装箱卡车）。氢气燃烧只产生水，零污染。",
    link: "http://qdjt.qingdao.gov.cn/jtj_jtxw/202609/t20260922_10737545.shtml",
    image: "https://aka.doubaocdn.com/s/PigQKOibsT",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 18,
    type: "term",
    title: "港口单位吞吐量综合能耗 Port Comprehensive Energy Consumption per Unit Throughput",
    icon: "🛳️",
    detail: "这是衡量港口节能水平的核心指标。港口完成一万吨吞吐量，总共消耗了多少能源（折合成标准煤）。数值越低说明港口越节能。",
    link: "https://std.samr.gov.cn/gb/search/gbDetailed?id=B4C25880C4571CB3E05397BE0A0A92D0",
    image: "https://aka.doubaocdn.com/s/Ba7u6wU2Bu",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 19,
    type: "policy",
    basis: "",
    title: "绿色交通“十四五”发展规划",
    icon: "🟢",
    detail: "这是交通运输部2021年印发的五年规划，明确了“十四五”期间交通领域绿色低碳发展的目标和任务。其中港口部分重点提了：岸电设施全覆盖、港作机械电动化、港口光伏风电推广、干散货码头粉尘治理、油气回收等具体要求。",
    link: "https://xxgk.mot.gov.cn/2020/jigou/zhghs/202201/t20220121_3637584.html",
    image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.megcAYqCha-3qaYMEaXB4gHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 20,
    type: "policy",
    basis: "",
    title: "港口和船舶岸电管理办法",
    icon: "⚡",
    detail: "这是交通运输部发布的部门规章，规定了港口岸电设施的建设、使用和管理要求。简单说就是：哪些码头必须建岸电、哪些船靠港必须接岸电、不按规定用要罚多少钱。2025年最新修订版进一步强化了岸电使用的监管和处罚力度。",
    link: "https://xxgk.mot.gov.cn/2020/jigou/fgs/202505/t20250521_4169121.html",
    image: "https://jtw.sh.gov.cn/cmsres/58/58ead49c05aa430b846e0ba7a9df9f2f/cc1cbb912bcc14c891f78394b2f77928.jpg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 21,
    type: "policy",
    basis: "",
    title: "船舶大气污染物排放控制区实施方案",
    icon: "🌊",
    detail: "这个方案划定了沿海和内河的船舶排放控制区，在这些区域内航行的船舶必须使用低硫燃油（硫含量≤0.5%），或者安装尾气处理装置。相当于给船舶\"划了环保禁区\"，进了这个区域就必须烧更干净的油。",
    link: "https://xxgk.mot.gov.cn/2020/jigou/haishi/202008/t20200828_3457437.html",
    image: "https://ts1.tc.mm.bing.net/th/id/OIP-C.bE2SvuwfOo08pi2zGLYPfQHaF3?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 22,
    type: "policy",
    basis: "一、总体要求  |  2026-04-09（成文）",
    title: "2030年国际航行船舶碳强度目标下降至少15%",
    icon: "♻️",
    detail: "海事局2026年意见提出，到2030年，国际航行船舶碳排放强度比2025年下降至少15%。这是政策目标，关注单位运输活动的排放水平，不等于每艘船的排放总量都必须下降15%。",
    links: [
      { label: "查看政策原文", url: "https://policy.mofcom.gov.cn/claw/clawContent.shtml?id=106023" },
      { label: "官方补充", url: "https://www.mot.gov.cn/xinwen/jiaotongyaowen/202604/t20260416_4203782.html" }
    ],
    image: "assets/images/p02.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
   {
    id: 23,
    type: "policy",
    basis: "三（五）第1项  |  2021-10-24（成文）",
    title: "船舶低碳转型已纳入国家碳达峰行动",
    icon: "♻️",
    detail: "国家碳达峰行动把船舶更新、发展电动和液化天然气动力船舶、推广靠港岸电列入交通运输任务，并提出因地制宜开展绿色智能船舶示范。港航企业可以从船舶动力、靠港用能和技术改造三个环节寻找转型方向。",
    links: [
      { label: "查看政策原文", url: "https://app.www.gov.cn/govdata/gov/202110/26/477466/article.html" }
    ],
    image: "assets/images/p01.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 24,
    type: "policy",
    basis: "二（四）第12项  |  2025-05-29（成文）",
    title: "内河电动船鼓励定班定线规模化应用",
    icon: "🚢"  ,
    detail: "2025年内河航运政策提出，加快电池动力技术在中小型船舶、中短距离运输等场景应用，鼓励电动船定班、定线规模化应用，并建设相应充换电设施。固定班次和航线，有助于统筹船舶运营与岸上补能。",
    links: [
      { label: "查看政策原文", url: "https://xxgk.mot.gov.cn/2020/jigou/syj/202506/t20250627_4171424.html" }
    ],
    image: "assets/images/p03.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 25,
    type: "policy",
    basis: "三（七）  |  2022-09-27（成文）",
    title: "智能航线与能效管理助力内河船舶节能",
    icon: "🛳️",
    detail: "内河船舶绿色智能发展意见提出，为提升船舶能效、降低污染排放，加快运营管理、航线优化、智能机舱、排放监控等智能系统设备研发，并推动在长江、西江干线等大型货船和客船上应用。",
    links: [
      { label: "查看政策原文", url: "https://ythxxfb.miit.gov.cn/ythzxfwpt/hlwmh/tzgg/sbfw/qyshzr/art/2022/art_adffcfebea16483cb7f88874a11b5999.html" }
    ],
    image: "assets/images/p04.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 26,
    type: "policy",
    basis: "五（十一）  |  2024-07-31（成文）",
    title: "国家鼓励净零排放船用燃料研发应用",
    icon: "🛳️",
    detail: "2024年全面绿色转型意见提出，推动船舶采用清洁动力，鼓励净零排放船用燃料的研发、生产和应用。这为燃料供应商、船厂与航运企业协同转型提供了政策方向。",
    links: [
      { label: "查看政策原文", url: "https://app.www.gov.cn/govdata/gov/202408/11/518161/articleNew.html" }
    ],
    image: "assets/images/p05.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
   {
    id: 27,
    type: "policy",
    basis: "一（二）、二（一）第3项及二（四）  |  2023-08-21（成文）",
    title: "一单制一箱制推动铁水联运衔接",
    icon: "🚛",
    detail: "该意见推广“一次委托、一次结算、一次保险、全程负责”的联运服务，以及中途不换箱、全程不开箱的集装箱联运模式；并推动标准化电子运单、海运箱内陆还箱和集装箱循环共用，改善铁路与水路运输衔接。",
    links: [
      { label: "查看政策原文", url: "https://xxgk.mot.gov.cn/jigou/ysfws/202308/t20230824_3897902.html" }
    ],
    image: "assets/images/p06.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 28,
    type: "policy",
    basis: "三（五）  |  2026-04-11（成文）",
    title: "节能降碳新政提出建设零碳运输走廊",
    icon: "🛣️",
    detail: "2026年节能降碳意见提出，健全充换电站、岸电等设施网络，建设零碳运输走廊，并积极发展绿色燃料船舶。对港航业而言，船舶能源替代需要与沿线港口能源设施、运输组织共同推进。",
    links: [
      { label: "查看政策原文", url: "https://drc.hlj.gov.cn/drc/c116575/202604/c00_31935816.shtml" }
    ],
    image: "assets/images/p07.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 29,
    type: "policy",
    basis: "四（一）及四（二）  |  2024-05-31（成文）",
    title: "老旧营运船舶更新鼓励清洁动力",
    icon: "🏭",
    detail: "设备更新方案支持高能耗、高排放老旧运输船舶加快报废更新，并支持新能源、清洁能源动力船舶发展，包括在适合的场景试用纯电池动力。更新不仅是换新船，也涉及装备、能源供应和运营配套。",
    links: [
      { label: "查看政策原文", url: "https://xxgk.mot.gov.cn/jigou/zhghs/202406/t20240607_4142138.html" }
    ],
    image: "assets/images/p08.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 30,
    type: "policy",
    basis: "四（七）  |  2025-04-25（官网公开）",
    title: "港口可以因地制宜开发和使用绿电",
    icon: "⚡",
    detail: "交通与能源融合政策提出，在保证港口作业和船舶通航安全的前提下，利用港池、仓库、防波堤等条件发展适合当地的光伏、风电或海洋能，并依托港口建设船舶充换电站、加注站。",
    links: [
      { label: "查看政策原文", url: "https://xxgk.mot.gov.cn/jigou/zhghs/202504/t20250425_4167770.html" }
    ],
    image: "assets/images/p09.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 31,
    type: "policy",
    basis: "战略第3.3.4及3.4节  |  2023-07-07（通过）",
    title: "IMO提出国际航运2050年前后净零目标",
    icon: "🌍",
    detail: "IMO的2023年战略提出，国际航运力争在2050年前后实现温室气体净零排放。以2008年为基准，年度排放总量的指示性检查点是2030年减少至少20%、力争30%，2040年减少至少70%、力争80%。国际航运战略；不能把整体目标直接写成每艘船的统一法定减排比例。",
    links: [
      { label: "查看政策原文", url: "https://www.imo.org/en/ourwork/environment/pages/2023-imo-strategy-on-reduction-of-ghg-emissions-from-ships.aspx" },
      { label: "官方补充", url: "https://wwwcdn.imo.org/localresources/en/OurWork/Environment/Documents/annex/2023%20IMO%20Strategy%20on%20Reduction%20of%20GHG%20Emissions%20from%20Ships.pdf" }
    ],
    image: "assets/images/p10.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
   {
    id: 32,
    type: "law",
    basis: "第235条  |  2026-03-12（通过）；2026-08-15（施行）",
    title: "符合条件的船舶靠港应按规定使用岸电",
    icon: "⚡",
    detail: "具备岸电使用条件的船舶靠港，应按国家规定使用岸电，使用清洁低碳能源的除外。有供电能力的港口经营人和岸电供电企业，也应按国家规定提供岸电。",
    links: [
      { label: "查看政策原文", url: "https://www.mee.gov.cn/ywgz/fgbz/fl/202603/t20260313_1146496.shtml" }
    ],
    image: "assets/images/l01.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
   {
    id: 33,
    type: "law",
    basis: "第234条、第236条  |  2026-03-12（通过）；2026-08-15（施行）",
    title: "船用燃油必须符合适用标准",
    icon: "🛢",
    iconColor: "#FFD700",
    detail: "内河和江海直达船舶须用符合标准的燃油；远洋船舶靠港后须用符合大气污染物控制要求的燃油。法律还禁止内河和江海直达船舶使用非机动车船用燃料。",
    links: [
      { label: "查看政策原文", url: "https://www.mee.gov.cn/ywgz/fgbz/fl/202603/t20260313_1146496.shtml" }
    ],
    image: "assets/images/l02.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
   {
    id: 34,
    type: "law",
    basis: "第46条  |  2018-10-26（最近一次修正）",
    title: "营运船舶须符合燃料消耗量限值标准",
    icon: "⚡",
    iconColor: "#FFD700",
    detail: "节约能源法规定，交通运输营运车船不符合燃料消耗量限值标准的，不得用于营运。船舶经营者需要核对适用的能耗标准和检测要求，不能只关注发动机功率或船舶载重量。具体船型、限值与检测方法依适用标准确定；燃料消耗量限值与尾气排放限值是不同指标。",
    links: [
      { label: "查看政策原文", url: "https://scjgj.beijing.gov.cn/cxfw/flfgcxfw/qt/202006/t20200620_1929329.html" }
    ],
    image: "assets/images/l03.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 35,
    type: "law",
    basis: "第27条  |  2018-10-26（最近一次修正）",
    title: "港航企业的能源统计须真实完整",
    icon: "📊",
    iconColor: "#FFD700",
    detail: "作为用能单位，港航企业应按规定配备、使用经依法检定合格的能源计量器具，并建立能源消费统计和能源利用状况分析制度。各类能源应分类计量和统计，统计数据须真实、完整。用能单位的一般法律义务；不能据此推导所有船舶都已纳入碳交易或同一套碳报告制度。",
    links: [
      { label: "查看政策原文", url: "https://scjgj.beijing.gov.cn/cxfw/flfgcxfw/qt/202006/t20200620_1929329.html" }
    ],
    image: "assets/images/l04.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 36,
    type: "law",
    basis: "附则VI第28.1、28.6—28.9条  |  相关修正案2022-11-01生效；CII要求自2023-01-01实施",
    title: " CII连续低评级船舶须制定纠正计划",
    icon: "📉",
    iconColor: "#FFD700",
    detail: "对适用CII规则的5000总吨及以上规定船型，年度碳强度评为A至E级。连续三年D级或一年E级，须制定纠正措施计划，纳入船舶能效管理计划并提交核验，随后落实措施。国际航运相关规则，受附则VI第4章及第28条适用条件限制；不能套用于所有小型内河船。",
    links: [
      { label: "查看政策原文", url: "https://wwwcdn.imo.org/localresources/en/OurWork/Environment/Documents/Air%20pollution/Certified%20copy%20of%20MEPC.328(76).pdf"},
      { label: "官方补充", url: "https://www.imo.org/en/mediacentre/hottopics/pages/eexi-cii-faq.aspx"}
    ],
    image: "assets/images/l05.png",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-03-10"
  },
  {
    id: 40,
    type: "job",
    title: "中远海运｜绿色低碳航运研究员",
    icon: "🔬",
    detail: "根据提供的岗位资料整理，尚未核对具体招聘公告。仅作岗位方向观察，不代表当前正在招聘，也不能据此认定集团核心业务或校招范围。",
    jobProfile: {
      employer: "中远海运（具体招聘单位待核实）",
      requirements: "资料描述：硕士及以上；轮机工程、能源动力、环境工程等专业。具体条件待与岗位公告核对。",
      duties: "资料描述：船舶甲醇双燃料技术研究、航运碳核算、EEXI/CII 合规、绿色燃料供应链调研。职责待核实。",
      directions: ["甲醇双燃料", "航运碳核算", "EEXI/CII 合规"],
      newcomerFocus: "这个岗位样本提示：绿色航运研发可能需要工程技术、排放核算与国际规则相结合的知识。",
      source: "国聘网·中远海运集团招聘平台",
      recruitmentStatus: "招聘有效期待核实，以具体公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "中远海运官网配图，原地址：https://www.coscoshipping.com/cms_files/jcms1/web15/site/picture/0/1809071535397398891.jpg；已保存至网站图片目录，避免外链加载受阻。仅作机构配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "招聘平台（非岗位详情）", url: "https://coscoshipping.iguopin.com" }
    ],
    image: "assets/images/cosco-low-carbon-researcher.jpg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-09-22"
  },
  {
    id: 41,
    type: "job",
    title: "DNV｜海事脱碳高级顾问（上海）",
    icon: "🧭",
    detail: "根据提供的岗位资料整理，尚未核对具体招聘公告。仅作岗位方向观察，不代表当前正在招聘，也不能据此认定相关技术已经商业化。",
    jobProfile: {
      employer: "DNV（具体招聘主体及上海工作地点待核实）",
      requirements: "资料描述：3-5 年海事行业经验。具体条件待与岗位公告核对。",
      duties: "资料描述：船舶脱碳路径规划、甲醇／氨燃料方案评估、碳捕集 CCS 技术评估、客户 ESG 报告核查。职责待核实。",
      directions: ["替代燃料评估", "碳捕集 CCS", "ESG 报告核查"],
      newcomerFocus: "这个岗位样本提示：海事脱碳咨询可能需要替代燃料、排放技术与报告核查等跨领域知识。岗位描述不能单独证明技术已经商业化。",
      source: "DNV 全球招聘官网（用户提供的来源名称，尚未核对具体岗位公告）",
      recruitmentStatus: "招聘有效期待核实，以具体公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "提供的 DNV 官网图片链接，仅作机构配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "DNV 招聘官网（非岗位详情）", url: "https://jobs.dnv.com/" }
    ],
    image: "https://www.dnv.com/contentassets/98ef5ef35ed044cfb44ed61a2d9be58f/adobestock_181286052_gothenburg.jpeg?mode=crop&scale=both&quality=90&format=webp&width=1024",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-08-15"
  },
  {
    id: 42,
    type: "job",
    title: "LR 劳氏船级社｜ESG 与可持续金融顾问（上海）",
    icon: "💼",
    detail: "根据提供的岗位资料整理，尚未核对具体招聘公告。原文链接是 LR 的 ESG 服务介绍，可用于了解业务背景，但不能证明该岗位存在或当前正在招聘。",
    jobProfile: {
      employer: "LR 劳氏船级社（具体招聘主体及上海工作地点待核实）",
      requirements: "资料描述：海事、能源、环境等相关背景。具体条件待与岗位公告核对。",
      duties: "资料描述：航运绿色债券、可持续挂钩贷款第二方意见、船舶替代燃料项目投融资尽调。职责待核实。",
      directions: ["航运绿色债券", "可持续金融", "投融资尽调"],
      newcomerFocus: "这个岗位样本提示：绿色航运还可从 ESG、金融工具与项目风险评估等角度了解。具体金融服务范围和岗位职责需要分别核实，不能仅凭服务介绍推断招聘情况。",
      source: "LR 劳氏船级社官网招聘（用户提供的来源名称，尚未核对具体岗位公告）；附 LR 官方 ESG 服务介绍作为业务背景。",
      recruitmentStatus: "招聘有效期待核实，以具体公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "提供的 LR 官网图片链接，仅作机构配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "ESG 服务介绍（非招聘公告）", url: "https://www.lr.org/en/services/advisory/management-consulting/esg-advisory/" }
    ],
    image: "https://www.lr.org/globalassets/esg-web.jpg?format=webp&width=900&height=600&quality=100",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-07-28"
  },
  {
    id: 43,
    type: "job",
    title: "马士基 Maersk｜可持续发展专员（中国区）",
    icon: "🌱",
    detail: "根据提供的岗位资料整理，尚未核对具体招聘公告。仅作岗位方向观察，不代表当前正在招聘，也不能仅凭该岗位描述认定绿色航运产品已经商业化。",
    jobProfile: {
      employer: "马士基 Maersk（具体招聘主体及中国区工作地点待核实）",
      requirements: "资料描述：本科及以上；供应链、环境、能源等相关专业。具体条件待与岗位公告核对。",
      duties: "资料描述：ECO Delivery 绿色海运产品运营、绿色甲醇燃料采购协调、客户航运减碳方案交付。职责待核实。",
      directions: ["ECO Delivery", "绿色甲醇采购", "客户减碳方案"],
      newcomerFocus: "这个岗位样本提示：绿色航运还可能涉及产品运营、燃料采购与客户减碳服务，需要供应链与可持续发展知识。具体岗位设置和产品商业化情况需要分别查证。",
      source: "马士基中国招聘官网（用户提供的来源名称，尚未核对具体岗位公告）",
      recruitmentStatus: "招聘有效期待核实，以具体公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "提供的马士基官网图片链接，仅作机构配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "马士基招聘官网（非岗位详情）", url: "https://www.maersk.com.cn/careers" }
    ],
    image: "https://www.maersk.com.cn/~/media_sc9/maersk/insights/resilience/2026/09/maersk-container-at-terminal.jpg?w=1056&hash=54E212B2B61B45BE2209E0028AAC628B",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-09-03"
  },
  {
    id: 44,
    type: "job",
    title: "中国船级社（CCS）｜替代燃料规范科研岗（武汉）",
    icon: "🔬",
    detail: "根据提供的岗位资料整理，具体岗位尚未核实。所附链接为中国船级社 2026 年度人才招聘公告，不是该岗位详情；不能据此确认该岗位存在或当前正在招聘。",
    jobProfile: {
      employer: "中国船级社（具体招聘单位及武汉工作地点待核实）",
      requirements: "资料描述：硕士及以上；能源动力、船舶与海洋工程等专业。具体条件待与岗位公告核对。",
      duties: "资料描述：氨、甲醇、氢气船舶安全技术研究，参与 IMO/IACS 国际规则编制，开展船载碳捕集系统技术研究。职责待核实；原资料中的碳捕集 CCS 与中国船级社简称 CCS 含义不同。",
      directions: ["替代燃料安全", "IMO/IACS 规则", "船载碳捕集"],
      newcomerFocus: "这个岗位样本提示：绿色航运标准研究可能需要燃料安全、船舶工程与国际规则相结合的知识。具体科研方向和人才需求规模需另行核实，不能由单条岗位资料推断。",
      source: "中国船级社官网招聘专栏；所附页面为《2026 年度人才招聘公告》，具体岗位信息仍待核对。",
      recruitmentStatus: "具体岗位招聘有效期待核实，以岗位公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "提供的中国船级社官网图片链接，仅作机构配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "2026 年度招聘公告（非岗位详情）", url: "https://www.ccs.org.cn/ccswz/gotoRecruit?columnid=202508250398118848" }
    ],
    image: "https://www.ccs.org.cn/ccswzimg/upload/cn/article/pic/20230203/20230203144617_253.jpg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-08-22"
  },
  {
    id: 45,
    type: "job",
    title: "BV 法国船级社｜海事脱碳技术顾问（上海）",
    icon: "🧭",
    detail: "根据提供的岗位资料整理，尚未核对具体招聘公告。所附脱碳服务页面仅作业务背景，不代表该岗位存在或当前正在招聘，也不能据此确认上海本地岗位设置。",
    jobProfile: {
      employer: "BV 法国船级社（具体招聘主体及上海工作地点待核实）",
      requirements: "资料描述：3-4 年海事相关经验。具体条件待与岗位公告核对。",
      duties: "资料描述：船舶甲醇／氨燃料审图咨询、船上碳捕集技术评估、EEXI/CII/FuelEU 合规核查、船东脱碳路线图编制。职责待核实。",
      directions: ["替代燃料审图", "船上碳捕集", "国际规则合规"],
      newcomerFocus: "这个岗位样本提示：海事脱碳咨询可能结合替代燃料安全、碳捕集技术评估与国际规则合规知识。具体服务范围和中国市场岗位设置需要分别核实。",
      source: "BV 法国船级社官网招聘入口（用户提供的来源名称，尚未核对具体岗位公告）；附 BV 官方海事脱碳服务页面作为业务背景。",
      recruitmentStatus: "招聘有效期待核实，以具体公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "提供的 BV 官网职业介绍配图链接，不作为岗位招聘证明。"
    },
    links: [
      { label: "海事脱碳服务（非招聘公告）", url: "https://group.bureauveritas.com/marine-shipping-decarbonization-services" },
      { label: "BV 职业官网（非岗位详情）", url: "https://group.bureauveritas.com/careers/leave-your-mark" }
    ],
    image: "https://cdn2-group.bureauveritas.com/sites/g/files/zypfnx196/files/styles/teaser_market_desktop/public/2023-10/Cover-careers-why-join-BV.png.jpg?itok=e148N9rJ",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-08-28"
  },
  {
    id: 46,
    type: "job",
    title: "中国船舶集团第七〇八研究所｜绿色船舶总体研发工程师（上海）",
    icon: "🔬",
    detail: "根据提供的岗位资料整理，具体岗位尚未核实。原提供的招聘地址目前无法解析，改附研究院现官网人才招聘入口，非该岗位详情，不代表当前正在招聘。",
    jobProfile: {
      employer: "中国船舶集团第七〇八研究所（具体招聘主体及上海工作地点待核实）",
      requirements: "资料描述：硕士及以上；船舶与海洋工程等专业。具体条件待与岗位公告核对。",
      duties: "资料描述：甲醇／氨燃料船舶总体方案设计、零碳船型开发、船载碳捕集系统集成设计、新船能效优化。职责待核实；原资料中的碳捕集 CCS 不指中国船级社。",
      directions: ["替代燃料船型", "碳捕集系统集成", "新船能效优化"],
      newcomerFocus: "这个岗位样本提示：绿色船舶总体研发可能需要船型设计、燃料系统与能效优化等综合能力。具体研发阶段和零碳性能需另行核实，不能由单条岗位描述确认工程化程度。",
      source: "中国船舶708研究所官网招聘栏目（用户提供的来源名称，尚未核对具体岗位公告）；附中国船舶及海洋工程设计研究院现官网人才招聘入口。",
      recruitmentStatus: "具体岗位招聘有效期待核实，以岗位公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "采用提供的第 2 张图片，来源为研究院官网，仅作机构配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "研究院人才招聘入口（非岗位详情）", url: "https://www.maric.com.cn/about/hiring.html" }
    ],
    image: "https://www.maric.com.cn/upload/image/20251224/1766540203040048335595_388.jpg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-09-06"
  },
  {
    id: 47,
    type: "job",
    title: "ABS 美国船级社｜可持续发展工程师（上海）",
    icon: "🌱",
    detail: "根据提供的岗位资料整理，尚未核对具体招聘公告。所附链接为 ABS 职业官网入口，非该岗位详情，不代表当前正在招聘，也不能据此确认上海岗位设置或人才需求增长。",
    jobProfile: {
      employer: "ABS 美国船级社（具体招聘主体及上海工作地点待核实）",
      requirements: "资料描述：海事、能源、环境工程等相关背景。具体条件待与岗位公告核对。",
      duties: "资料描述：航运碳核算、替代燃料可行性评估、ESG 报告鉴证、可持续航运金融技术支持。职责待核实。",
      directions: ["航运碳核算", "替代燃料评估", "ESG 报告鉴证"],
      newcomerFocus: "这个岗位样本提示：可持续航运工作可能结合工程评估、排放核算、报告鉴证与金融技术支持知识。具体业务范围和人才需求趋势需要分别查证，不能由单条岗位描述推断。",
      source: "ABS 美国船级社全球招聘官网（用户提供的来源名称，尚未核对具体岗位公告）",
      recruitmentStatus: "招聘有效期待核实，以具体公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "采用提供的第 2 张图片，来源为 ABS 官网法规更新栏目，仅作业务背景配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "ABS 职业官网（非岗位详情）", url: "https://ww2.eagle.org/en/careers.html" }
    ],
    image: "https://ww2.eagle.org/en/rules-and-resources/regulatory-updates/_jcr_content/root/container/productteasergrid_co/item_1675050020873.coreimg.jpeg/1688675681278/int-maritime.jpeg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-07-15"
  },
  {
    id: 48,
    type: "job",
    title: "交通运输部水运科学研究院｜水运低碳研究员（北京）",
    icon: "🔬",
    detail: "根据提供的岗位资料整理，具体岗位尚未核实。原提供的招聘栏目链接当前跳转研究院首页；所附官网入口非该岗位详情，不代表当前正在招聘。",
    jobProfile: {
      employer: "交通运输部水运科学研究院（具体招聘单位及北京工作地点待核实）",
      requirements: "资料描述：硕士及以上；环境工程、交通运输工程等专业。具体条件待与岗位公告核对。",
      duties: "资料描述：港口与航运碳排放核算、甲醇等船用替代燃料政策研究、船舶碳捕集国内应用课题研究、行业标准编制。职责待核实。",
      directions: ["港航碳排放核算", "替代燃料政策", "行业标准研究"],
      newcomerFocus: "这个岗位样本提示：水运低碳研究可能连接排放核算、技术应用、政策研究与标准编制。具体课题及政策支撑成果需另行查证，不能由单条岗位资料推断。",
      source: "交通运输部水运科学研究院人才招聘栏目（用户提供的来源名称，尚未核对具体岗位公告）；原栏目链接当前跳转研究院首页。",
      recruitmentStatus: "具体岗位招聘有效期待核实，以岗位公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "水运科学研究院官网配图，原地址：https://www.wti.ac.cn/wti/dbfile.svl?n=/u/cms/www/202103/12092005gd1f.jpg；已保存至网站图片目录，避免外链加载受阻。仅作机构配图，不作为岗位招聘证明。"
    },
    links: [
      { label: "研究院官网（非岗位详情）", url: "https://www.wti.ac.cn/wti/" }
    ],
    image: "assets/images/wti-low-carbon-researcher.jpg",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-09-10"
  },
  {
    id: 49,
    type: "job",
    title: "ClassNK 日本船级社｜海事脱碳专员（上海）",
    icon: "🧭",
    detail: "根据提供的岗位资料整理，具体岗位尚未核实。原提供的招聘地址显示页面不存在；所附 ClassNK 官网入口非岗位详情，不代表当前正在招聘或已设置上海本地岗位。",
    jobProfile: {
      employer: "ClassNK 日本船级社（具体招聘主体及上海工作地点待核实）",
      requirements: "资料描述：船舶、能源等相关专业。具体条件待与岗位公告核对。",
      duties: "资料描述：船上碳捕集认证服务、甲醇／氨燃料船舶入级咨询、航运 GHG 排放核查。职责待核实；原资料中的碳捕集 CCS 不指中国船级社。",
      directions: ["船载碳捕集", "替代燃料入级", "GHG 排放核查"],
      newcomerFocus: "这个岗位样本提示：海事脱碳工作可能结合燃料安全、认证与排放核查知识。具体技术布局和中国市场岗位设置需要分别查证，不能由单条岗位资料推断。",
      source: "ClassNK 船级社招聘官网（用户提供的来源名称，尚未核对具体岗位公告）；原招聘地址显示页面不存在。",
      recruitmentStatus: "具体岗位招聘有效期待核实，以岗位公告为准。",
      deadline: "",
      verifiedDate: "",
      imageSource: "采用提供的两张 ClassNK 机构介绍配图；原 .or.jp 地址返回 403，改用 .com 官网域名的对应图片，仅作机构配图，不作为招聘证明。"
    },
    links: [
      { label: "ClassNK 官网（非岗位详情）", url: "https://www.classnk.com/hp/en/" }
    ],
    images: [
      "https://www.classnk.com/hp/zh/images/about/aboutNK/aboutnkintro2.jpg",
      "https://www.classnk.com/hp/zh/images/about/aboutNK/aboutnkintro1.jpg"
    ],
    image: "",
    qrLink: "",
    views: 0,
    weekViews: 0,
    monthViews: 0,
    favorites: 0,
    date: "2026-08-01"
  }
  ,
  {
  id: 50,
  type: "industry",
  isTemplate: false,
  title: "上海国际港务（集团）股份有限公司",
  icon: "🚢",
  detail: "中国最大的港口运营企业，洋山港四期自动化码头是全球标杆。",
  organization: {
    englishName: "Shanghai International Port (Group) Co., Ltd.",
    organizationType: "国有企业",
    summary: "上港集团是上海港的运营主体，业务覆盖港口装卸、物流、航运服务等，连续多年位居全球港口吞吐量前列。",
    greenDirections: ["岸电", "自动化码头", "清洁能源", "碳排放管理"],
    mainBusiness: "港口装卸、仓储物流、航运服务、港口地产",
    greenLayout: "推进岸电全覆盖、电动集卡替换、自动化码头建设，目标打造绿色低碳港口。",
    representativeProject: "洋山港四期自动化码头",
    projectStage: "已建成运营",
    newcomerFocus: "绿色港口工程师、碳排放管理岗、自动化码头运维",
    source: "上港集团官网、2025年年报",
    verifiedDate: "2026-10-10",
    imageSource: "上港集团官网"
  },
  links: [
    { label: "机构官网", url: "https://www.portshanghai.com.cn" },
    { label: "查看项目／报告", url: "" }
  ],
  image: "https://www.sipg.com.cn:7981/img/img4.jpg",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-10"
}
,
{
  id: 51,
  type: "industry",
  isTemplate: false,
  title: "中国远洋海运集团有限公司",
  icon: "🌊",
  detail: "全球最大的航运企业之一，绿色航运和替代燃料的先行者。",
  organization: {
    englishName: "China COSCO Shipping Corporation Limited",
    organizationType: "中央企业",
    summary: "中远海运是全球领先的综合航运物流企业，业务覆盖集装箱、散货、油运、港口等。",
    greenDirections: ["绿色航运", "替代燃料", "碳减排", "绿色船舶"],
    mainBusiness: "集装箱运输、干散货运输、油运、港口投资",
    greenLayout: "推进 LNG 动力船、甲醇燃料船建造，发布绿色低碳发展战略。",
    representativeProject: "全球首艘甲醇双燃料集装箱船",
    projectStage: "已投入运营",
    newcomerFocus: "绿色航运管理、船舶能效、碳交易",
    source: "中远海运官网、公开新闻",
    verifiedDate: "2026-10-10",
    imageSource: "中远海运官网"
  },
  links: [
    { label: "机构官网", url: "https://www.coscoshipping.com" },
    { label: "查看项目／报告", url: "" }
  ],
  image: "https://ts1.tc.mm.bing.net/th/id/OIP-C.4DhKwWQxcnW9IE5rIMUK6gHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-10"
}
,
{
  id: 52,
  type: "industry",
  isTemplate: false,
  title: "上海国际航运研究中心",
  icon: "📊",
  detail: "国内权威航运研究机构，定期发布绿色港口与航运报告。",
  organization: {
    englishName: "Shanghai International Shipping Institute",
    organizationType: "研究机构",
    summary: "上海国际航运研究中心依托上海海事大学，专注航运政策、港口发展、绿色航运等领域研究。",
    greenDirections: ["绿色港口", "航运政策", "碳减排研究"],
    mainBusiness: "航运研究、政策咨询、行业报告",
    greenLayout: "发布绿色港口发展报告，参与绿色航运标准研究。",
    representativeProject: "《绿色港口发展报告》",
    projectStage: "持续发布",
    newcomerFocus: "行业研究、数据分析、政策解读",
    source: "上海国际航运研究中心官网",
    verifiedDate: "2026-10-10",
    imageSource: "上海国际航运研究中心官网"
  },
  links: [
    { label: "机构官网", url: "http://sisi-smu.org/" },
    { label: "查看项目／报告", url: "" }
  ],
  image: "https://www2012.shmtu.edu.cn/sites/default/files/styles/content-pic/public/hppic/2013/xun_su_fa_zhan_de_shang_hai_guo_ji_hang_yun_yan_jiu_zhong_xin_.jpg?itok=0_mFt2m8",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-10"
}
,
{
  id: 53,
  type: "industry",
  isTemplate: false,
  title: "International Association of Ports and Harbors",
  icon: "🌍",
  detail: "全球港口行业的权威国际组织，主导港口脱碳与能源转型议题。",
  organization: {
    englishName: "International Association of Ports and Harbors",
    organizationType: "国际非政府组织",
    summary: "IAPH成立于1955年，总部位于东京，代表全球约190个港口和165家港口相关企业，覆盖89个国家。致力于推动港口脱碳、能源转型和数字化[citation:6]。",
    greenDirections: ["港口脱碳", "能源转型", "数字化", "风险管理"],
    mainBusiness: "港口行业代表、政策倡导、国际标准对接、行业交流",
    greenLayout: "主导港口脱碳与能源转型倡议，在IMO等国际组织中代表港口行业发声，推动绿色港口规则制定[citation:6]。",
    representativeProject: "World Ports Conference、港口脱碳倡议",
    projectStage: "持续运行",
    newcomerFocus: "港口管理、国际航运政策、绿色港口标准",
    source: "IAPH官网",
    verifiedDate: "2026-10-11",
    imageSource: "IAPH官网"
  },
  links: [
    { label: "机构官网", url: "https://www.iaphworldports.org" }
  ],
  image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.B8dSrLpmod4saE4QItn1QQHaEH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 54,
  type: "industry",
  isTemplate: false,
  title: "Mærsk Mc-Kinney Møller Center for Zero Carbon Shipping",
  icon: "🔬",
  detail: "全球领先的航运脱碳独立研究机构，马士基基金会资助。",
  organization: {
    englishName: "Mærsk Mc-Kinney Møller Center for Zero Carbon Shipping",
    organizationType: "研究机构（非营利）",
    summary: "该中心成立于2020年，由A.P. Moller基金会资助，是一个独立的非营利研究与发展中心，致力于加速全球航运业脱碳。2026年获得IMO咨询地位。",
    greenDirections: ["零碳航运", "替代燃料", "绿色走廊", "氨燃料安全", "监管改革"],
    mainBusiness: "应用研究、行业协作平台、监管改革倡导、技术路径评估",
    greenLayout: "联合44个合作伙伴和65位使命大使，开展绿色走廊、氨燃料安全、碳减排机制等研究，为IMO决策提供科学支撑。",
    representativeProject: "绿色走廊示范项目、氨燃料安全研究、Impact Report",
    projectStage: "持续运行",
    newcomerFocus: "航运脱碳技术、替代燃料、国际航运政策研究",
    source: "MMMCZCS官网、IMO新闻",
    verifiedDate: "2026-10-11",
    imageSource: "MMMCZCS官网"
  },
  links: [
    { label: "机构官网", url: "https://www.zerocarbonshipping.com" },
    { label: "查看报告", url: "https://www.zerocarbonshipping.com/about" }
  ],
  image: "https://ts3.tc.mm.bing.net/th/id/OIP-C.EhP_AZsCqae10zv8srVWjgHaBI?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 55,
  type: "industry",
  isTemplate: false,
  title: "Green Marine International",
  icon: "🌱",
  detail: "北美及欧洲领先的航运业环境认证项目，覆盖港口、船东、码头。",
  organization: {
    englishName: "Green Marine International",
    organizationType: "环境认证机构（非营利）",
    summary: "Green Marine是航运业领先的自愿性环境认证项目，2024年整合为Green Marine International，统一管理北美和欧洲认证项目。网络涵盖565+成员[citation:10]。",
    greenDirections: ["环境认证", "生物多样性保护", "空气排放减排", "废物管理", "水下噪音"],
    mainBusiness: "环境认证、绩效评估、行业基准对比、最佳实践分享",
    greenLayout: "2026年标准新增循环经济、微塑料管理、水下辐射噪音等指标，覆盖港口、船东、码头运营商。港口认证已在欧洲开放[citation:3]。",
    representativeProject: "Green Marine年度认证项目、GreenTech会议",
    projectStage: "持续运行（已18年）",
    newcomerFocus: "环境认证体系、港口环境管理、航运可持续标准",
    source: "Green Marine官网",
    verifiedDate: "2026-10-11",
    imageSource: "Green Marine官网"
  },
  links: [
    { label: "机构官网", url: "https://green-marine.org" }
  ],
  image: "https://ts3.tc.mm.bing.net/th/id/OIP-C.3y08s03_dP4_l9erBP-uEAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 56,
  type: "industry",
  isTemplate: false,
  title: "Getting to Zero Coalition",
  icon: "🚀",
  detail: "由WEF和Global Maritime Forum共同管理的航运脱碳联盟，200+成员。",
  organization: {
    englishName: "Getting to Zero Coalition",
    organizationType: "国际联盟（多利益相关方）",
    summary: "该联盟于2019年由Global Maritime Forum、Friends of Ocean Action和世界经济论坛共同发起，汇聚200+航运、能源、基础设施和金融领域组织，目标2030年前实现深海零排放船舶商业化运营[citation:4][citation:11]。",
    greenDirections: ["零排放船舶", "绿色走廊", "替代燃料", "政策倡导", "公正转型"],
    mainBusiness: "行业协作平台、政策倡导、绿色走廊推广、投资促进",
    greenLayout: "推动绿色走廊发展、零排放船舶部署、碳定价倡导（如呼吁IMO实施150美元/吨碳税）。在印尼、墨西哥、南非开展国别项目[citation:4][citation:18]。",
    representativeProject: "Fueling the Future of Shipping研究、绿色走廊示范",
    projectStage: "持续运行（P4G资助已结束）",
    newcomerFocus: "航运脱碳政策、绿色走廊、零排放燃料",
    source: "P4G、WEF、Global Maritime Forum",
    verifiedDate: "2026-10-11",
    imageSource: "WEF官网"
  },
  links: [
    { label: "机构页面", url: "https://www.weforum.org/projects/getting-to-zero-coalition/" }
  ],
  image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.Rm5mDm5_ItCZc39niNXOowHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 57,
  type: "industry",
  isTemplate: false,
  title: "A.P. Moller-Maersk",
  icon: "⚓",
  detail: "全球最大集装箱航运公司之一，绿色甲醇燃料船舶的先行者。",
  organization: {
    englishName: "A.P. Moller-Maersk",
    organizationType: "跨国企业（航运）",
    summary: "马士基是全球最大的集装箱航运公司之一，承诺2040年实现净零排放，2023年接收全球首艘甲醇动力集装箱船[citation:9]。",
    greenDirections: ["绿色甲醇", "零排放船舶", "碳定价倡导", "脱碳物流"],
    mainBusiness: "集装箱运输、物流、码头运营",
    greenLayout: "订购8艘大型甲醇动力集装箱船（每艘约16000 TEU），年减碳约100万吨。呼吁IMO实施150美元/吨航运燃料碳税[citation:9]。",
    representativeProject: "全球首艘甲醇动力集装箱船、16000 TEU甲醇船队",
    projectStage: "已投入运营/扩展中",
    newcomerFocus: "绿色航运管理、替代燃料、航运脱碳战略",
    source: "Maersk官网、WEF报告",
    verifiedDate: "2026-10-11",
    imageSource: "Maersk官网"
  },
  links: [
    { label: "机构官网", url: "https://www.maersk.com" },
    { label: "可持续发展页面", url: "https://www.maersk.com/about/sustainability" }
  ],
  image: "https://ts1.tc.mm.bing.net/th/id/OIP-C.yNUOECcId_WdyLs4aA7xfAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 58,
  type: "industry",
  isTemplate: false,
  title: "Port of Rotterdam",
  icon: "🇳🇱",
  detail: "欧洲最大港口，绿色氢能和替代燃料枢纽的积极建设者。",
  organization: {
    englishName: "Port of Rotterdam Authority",
    organizationType: "港口管理机构（国有）",
    summary: "鹿特丹港是欧洲最大的港口，致力于成为国际绿色氢能枢纽，参与Green Ports Partnership（荷兰-巴西合作项目）[citation:7]。",
    greenDirections: ["绿色氢能", "替代燃料", "岸电", "碳捕集", "循环经济"],
    mainBusiness: "港口运营、物流、工业、能源基础设施",
    greenLayout: "建设大规模氢能网络，目标成为西北欧氢能进口、生产和转运枢纽。参与国际绿色走廊合作[citation:7]。",
    representativeProject: "鹿特丹氢能枢纽、Green Ports Partnership",
    projectStage: "建设/运营中",
    newcomerFocus: "港口能源转型、氢能经济、绿色物流",
    source: "TNO、鹿特丹港官网",
    verifiedDate: "2026-10-11",
    imageSource: "鹿特丹港官网"
  },
  links: [
    { label: "机构官网", url: "https://www.portofrotterdam.com" }
  ],
  image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.R4JcnpldHEjvhTN1AvwbrQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 59,
  type: "industry",
  isTemplate: false,
  title: "国际绿色航运走廊联盟",
  icon: "🛤️",
  detail: "全球首个基于国际绿色航运走廊合作的非政府间国际组织，2026年成立。",
  organization: {
    englishName: "International Green Shipping Corridor Alliance",
    organizationType: "国际非政府组织",
    summary: "2026年9月由中远海运、达飞集团、上港集团、中国能建等联合发起，创始会员涵盖12国45家头部企业，业务覆盖绿色航运产业链上下游[citation:1][citation:8]。",
    greenDirections: ["绿色航运走廊", "绿色燃料认证", "绿色港口", "国际标准对接"],
    mainBusiness: "国际绿色航运合作平台、标准衔接、示范项目、技术研发与成果转化",
    greenLayout: "推动绿色船舶、绿色燃料、绿色港口的国内规则与国际标准衔接，加快绿色船用燃料国际认证体系建设[citation:1][citation:8]。",
    representativeProject: "国际绿色航运走廊示范项目、绿色燃料认证体系",
    projectStage: "2026年新成立",
    newcomerFocus: "绿色航运走廊、国际航运政策、绿色燃料认证",
    source: "中国航务周刊、经济日报、交通运输部",
    verifiedDate: "2026-10-11",
    imageSource: "公开新闻"
  },
  links: [
    { label: "新闻来源", url: "http://www.jingjiribao.cn/static/detail.jsp?id=685529" }
  ],
  image: "https://www.eworldship.com/uploadfile/cbw/2024/0621/20240621072326224.jpg",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 60,
  type: "industry",
  isTemplate: false,
  title: "Port of Yokohama",
  icon: "🇯🇵",
  detail: "日本首个入选IAPH可持续发展奖决赛的港口，官民合作推进脱碳。",
  organization: {
    englishName: "Port of Yokohama",
    organizationType: "港口管理机构（日本）",
    summary: "横滨港2025年凭《港湾脱碳化推进计划》入选IAPH可持续发展奖“气候与能源”类别决赛，是日本首次入围。计划涵盖121个官民合作项目[citation:14]。",
    greenDirections: ["港口脱碳", "碳中和管理", "官民合作", "绿色能源"],
    mainBusiness: "港口运营、物流、临港产业",
    greenLayout: "2025年3月制定《横滨港港湾脱碳化推进计划》，推进碳中和管理，强化官民合作推进脱碳项目[citation:14]",
    representativeProject: "横滨港港湾脱碳化推进计划（121个官民合作项目）",
    projectStage: "推进中",
    newcomerFocus: "港口脱碳规划、官民合作机制、日本港口管理",
    source: "横滨市官网、IAPH2025 Sustainability Awards",
    verifiedDate: "2026-10-11",
    imageSource: "横滨市官网"
  },
  links: [
    { label: "机构官网", url: "https://www.city.yokohama.lg.jp/" },
    { label: "脱碳计划页面", url: "https://www.city.yokohama.lg.jp/city-info/yokohamashi/yokohamako/kikhon/torikumi/cnp/top.html" }
  ],
  image: "https://www.mlit.go.jp/kankocho/cruise/jp/detail/019/images/main.jpg",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
,
{
  id: 61,
  type: "industry",
  isTemplate: false,
  title: "NYK Line",
  icon: "🚢",
  detail: "日本三大航运企业之一，积极参与多个国际脱碳联盟与倡议。",
  organization: {
    englishName: "Nippon Yusen Kaisha (NYK Line)",
    organizationType: "跨国企业（航运）",
    summary: "NYK是日本领先的航运企业，深度参与国际航运脱碳进程，加入了零排放联盟、GCMD、全球CCS研究所、北太平洋绿色走廊联盟等多个国际倡议[citation:4]。",
    greenDirections: ["零排放燃料", "碳捕集与封存", "甲烷减排", "绿色走廊"],
    mainBusiness: "集装箱运输、散货运输、汽车运输、物流",
    greenLayout: "加入Global CCS Institute推动碳捕集技术应用；参与MAMII倡议评估LNG动力船甲烷排放；支持北太平洋绿色走廊联盟推进加拿大与日韩间供应链脱碳[citation:4]",
    representativeProject: "北太平洋绿色走廊联盟、MAMII甲烷减排倡议",
    projectStage: "参与/推进中",
    newcomerFocus: "航运脱碳战略、替代燃料、国际航运合作",
    source: "NYK官网可持续发展报告",
    verifiedDate: "2026-10-11",
    imageSource: "NYK官网"
  },
  links: [
    { label: "机构官网", url: "https://www.nyk.com" },
    { label: "可持续发展报告", url: "https://www.nyk.com/english/sustainability/" }
  ],
  image: "https://ts1.tc.mm.bing.net/th/id/OIP-C.MN0dnbMplhJQ8blH5KCVQwAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  qrLink: "",
  views: 0,
  weekViews: 0,
  monthViews: 0,
  favorites: 0,
  date: "2026-10-11"
}
];
