import type { Incident } from '@/models/Incident'

export const incidents: Incident[] = [
  {
    id: 'etsy-phishing',
    title: 'Etsy 钓鱼网站反制',
    date: '2025-04-01',
    description: '攻击者通过伪造 Etsy 支付验证页面进行钓鱼攻击，采用社会工程学方法成功反制并使其关闭钓鱼网站。',
    originalUrl: '../hacking/incident/20250401-etsy.html',
    imageAsset: '../assets/hack/截屏2025-04-02 下午6.37.39.png',
    tags: ['社会工程学', '钓鱼反制', 'Cloudflare'],
    phases: [
      {
        phase: '第一阶段：情报收集',
        color: 'green',
        description: '通过 WhatWeb 工具发现攻击者使用了 Cloudflare 和 Express 框架。域名 etsy.giving 为新注册域名（2025年3月29日），注册商为 Web Commerce Communications Limited，使用 WhoisProtection.cc 隐私保护服务。'
      },
      {
        phase: '第二阶段：心理反制',
        color: 'blue',
        description: '利用客服聊天功能，采用情感化语言打击攻击者的心理防线。',
        dialogues: [
          { speaker: '攻击者', text: 'Чортава памры, памры, памры', isAttacker: true },
          { speaker: '我方', text: '（已获取日志和摄像头照片）Is this you?', isAttacker: false },
          { speaker: '我方', text: 'Why are you doing this?', isAttacker: false },
          { speaker: '我方', text: 'Seriously you need to get a real job', isAttacker: false },
          { speaker: '攻击者', text: 'f*** ******* *** ***** china!', isAttacker: true },
          { speaker: '攻击者', text: '**** ** mama', isAttacker: true }
        ]
      },
      {
        phase: '第三阶段：成功瓦解',
        color: 'purple',
        description: '通过持续的心理压力，最终导致攻击者关闭钓鱼网站。网站返回 404 错误，表明反制成功。'
      }
    ]
  },
  {
    id: 'tng-scam',
    title: 'TNG 数字钱包诈骗警示',
    date: '2025-05-28',
    description: '真实还原 TNG eWallet 诈骗全过程，详解防骗细节与多方核查识破骗局的实战经验。',
    originalUrl: '../hacking/incident/20250528-tngscam.html',
    imageAsset: '../assets/tng.jpg',
    tags: ['诈骗警示', 'TNG eWallet', '马来西亚'],
    phases: [
      {
        phase: '可疑来电经过',
        color: 'red',
        description: '陌生号码来电，自称执法部门，称账号涉案。对方反复强调案情严重，要求立即配合。提出核实请求后，对方语气转为强硬，持续施压。对方威胁若不配合将冻结所有银行账户并面临刑事指控。',
        listItems: [
          '来电显示为马来西亚本地号码 +603-27xxx-xxxx',
          '对方自称执法部门官员，报出完整姓名和工号',
          '声称银行账户涉嫌洗钱案件，要求立即配合调查',
          '对方语速极快，不断施加心理压力，不给予思考时间',
          '威胁若不配合将冻结所有银行账户并面临刑事指控'
        ]
      },
      {
        phase: '三重验证识破骗局',
        color: 'green',
        description: '通过三重验证成功识破骗局：',
        listItems: [
          '第一重：拨打银行官方客服热线核实，客服确认无任何异常',
          '第二重：通过 TNG 官方 App 查询账户状态，一切正常',
          '第三重：回拨来电号码，提示为空号或无法接通'
        ]
      }
    ]
  }
]
