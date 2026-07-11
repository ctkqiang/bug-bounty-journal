import type { BlogPost } from '@/models/Blog'

export const blogPosts: BlogPost[] = [
  {
    id: 'questdb-auth-bypass',
    title: 'QuestDB 认证绕过与潜在 SQL 注入风险综合技术研究',
    date: '2026-02-14',
    excerpt: '深入分析 QuestDB 时序数据库的认证绕过漏洞，探讨 http.security=true 配置失效的根因，并通过 Go 编写的 PoC 程序系统验证攻击面。',
    content: 'QuestDB 是一个开源的高性能时序数据库，广泛用于金融服务、物联网、监控和实时分析等领域。本文详细分析了 QuestDB 的认证绕过漏洞——尽管在 server.conf 中配置了 http.security=true 等安全指令，HTTP 端点依然接受所有请求，完全未进行凭证验证。文章涵盖了漏洞描述、根本原因分析、SQL 注入测试、攻击场景、PoC 验证程序、影响与风险分析以及修复建议。',
    tags: ['QuestDB', '认证绕过', 'SQL注入', 'Go', 'PoC'],
    readTime: '15 min',
    author: '钟智强'
  },
  {
    id: 'kuaishou-api-key-exposure',
    title: '快手 Android 应用 API 密钥泄露分析',
    date: '2025-04-30',
    excerpt: '通过对快手 Android 应用的逆向分析，发现百度地图、高德地图、OPPO卡券服务等多个敏感 API 密钥泄露，评估服务滥用和数据安全风险。',
    content: '对快手 Android APK 进行逆向工程分析，提取并识别了多个第三方服务的 API 密钥，包括百度地图 SDK、高德地图 SDK、OPPO 卡券服务等。这些密钥泄露可能导致服务被滥用、配额被消耗以及潜在的数据安全风险。文章详细记录了逆向分析过程、发现的密钥类型、影响评估以及负责任的漏洞披露流程。',
    tags: ['Android', '逆向工程', 'API密钥', '快手'],
    readTime: '10 min',
    author: '钟智强'
  },
  {
    id: 'myjpj-security-audit',
    title: 'MYJPJ 移动应用安全审计：从日志泄露到 PDPA 违规',
    date: '2025-03-24',
    excerpt: '马来西亚陆路交通局官方应用 MYJPJ 通过 Flutter 框架开发，日志中暴露了大量敏感个人信息，包括身份证号、车牌、地址、API 凭证等，严重违反 PDPA 2010。',
    content: 'MYJPJ 是马来西亚陆路交通局(JPJ)的官方移动应用，基于 Flutter 框架开发。通过 adb logcat 日志分析发现，开发团队直接将用户的敏感个人信息打印到控制台日志中，包括但不限于：用户身份证号码、车牌号码、完整的家庭住址信息、个人联系方式、API 访问密钥和认证 Token、Bearer Token 等授权信息。这些数据暴露违反了 PDPA 2010 的多项原则。文章涵盖了完整的技术证据链分析、个人信息暴露矩阵、PDPA 违规总结以及安全加固方案。',
    tags: ['Flutter', 'PDPA', '数据泄露', '马来西亚', 'CNVD'],
    readTime: '20 min',
    author: '钟智强'
  },
  {
    id: 'etsy-phishing-counter',
    title: '社会工程学反制：Etsy 钓鱼网站瓦解实录',
    date: '2025-04-01',
    excerpt: '攻击者通过伪造 Etsy 支付验证页面进行钓鱼攻击，通过社会工程学方法成功反制，最终导致攻击者关闭钓鱼网站。',
    content: '本案例展示了社会工程学在网络安全防护中的独特价值。通过精准把握攻击者心理，成功瓦解了一个正在运行的 Etsy 钓鱼网站（域名 etsy.giving），避免了更多用户受害。文章详细记录了情报收集、DNS 分析、心理反制对话以及最终成功瓦解的全过程。',
    tags: ['社会工程学', '钓鱼反制', 'Etsy'],
    readTime: '8 min',
    author: '钟智强'
  },
  {
    id: 'plugshare-aws-stripe-leak',
    title: 'PlugShare AWS Cognito 与 Stripe 密钥泄露分析',
    date: '2025-03-27',
    excerpt: 'PlugShare 应用中发现 AWS Cognito 凭证、Stripe 支付密钥等多个敏感配置信息泄露，可能导致账户接管和支付欺诈风险。',
    content: '通过对 PlugShare 应用的安全审计，发现多个云服务凭证泄露，包括 AWS Cognito 用户池凭证和 Stripe 支付 API 密钥。这些凭证泄露可能导致攻击者接管用户账户、发起支付欺诈以及访问后端 AWS 资源。文章详细分析了泄露路径、影响评估和修复建议。',
    tags: ['AWS', 'Stripe', '密钥泄露', 'PlugShare'],
    readTime: '12 min',
    author: '钟智强'
  },
  {
    id: 'cyart-env-exposure',
    title: 'Cyart.net .env 配置文件泄露：从信息收集到系统接管',
    date: '2025-03-31',
    excerpt: 'Cyart.net 的 .env 配置文件未受保护，包含数据库连接信息、邮件服务器凭据、Redis 配置等，攻击者可直接接管系统。',
    content: '通过对 Cyart.net Web 应用的安全测试，发现 .env 配置文件直接暴露在公网。该文件包含 MySQL 数据库连接凭证、SMTP 邮件服务器配置、Redis 缓存配置、第三方 API 密钥等敏感信息。攻击者可以利用这些信息直接访问数据库、发送钓鱼邮件、甚至完全接管服务器。文章记录了从信息收集到漏洞验证的完整流程。',
    tags: ['.env', '配置泄露', 'Laravel', 'CNVD'],
    readTime: '10 min',
    author: '钟智强'
  }
]
