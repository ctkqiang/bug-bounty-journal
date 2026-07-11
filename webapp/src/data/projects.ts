import type { GitHubProject, ProjectStats } from '@/models/Project'

export const projects: GitHubProject[] = [
  { id: 1, name: 'LingFlow', description: 'WebSocket real-time AI chat framework with S3 dynamic skill loading', language: 'Go', stars: 3, forks: 0, topics: ['websocket', 'ai', 'realtime', 's3'], url: 'https://github.com/ctkqiang/LingFlow', updatedAt: '2026-07-11', isFork: false },
  { id: 2, name: 'BBtool', description: 'Bug bounty graphical pentest toolset', language: 'Python', stars: 96, forks: 8, topics: ['cybersecurity', 'scanner', 'nmap', 'sqlmap', 'dirsearch', 'httpx'], url: 'https://github.com/ctkqiang/BBtool', updatedAt: '2026-07-10', isFork: false },
  { id: 3, name: 'hyper_guard', description: 'Xiaomi HyperOS system-level security tool (runtime threat detection)', language: 'Dart', stars: 3, forks: 1, topics: ['xiaomi', 'hyperos', 'security', 'threat-detection'], url: 'https://github.com/ctkqiang/hyper_guard', updatedAt: '2026-07-09', isFork: false },
  { id: 4, name: 'LianJiaScraper', description: 'Spring Boot-based Lianjia real estate data scraper', language: 'Java', stars: 9, forks: 0, topics: ['spring-boot', 'scraper', 'realestate'], url: 'https://github.com/ctkqiang/LianJiaScraper', updatedAt: '2026-07-09', isFork: false },
  { id: 5, name: 'MaGuTong', description: 'Malaysia stock data scraping & parsing service', language: 'Java', stars: 3, forks: 0, topics: ['malaysia', 'stock', 'scraper'], url: 'https://github.com/ctkqiang/MaGuTong', updatedAt: '2026-07-09', isFork: false },
  { id: 6, name: 'TongXinZhiZhou', description: 'PCB analysis system with component/pin/copper trace recognition', language: 'Python', stars: 3, forks: 0, topics: ['pcb', 'computer-vision', 'image-analysis'], url: 'https://github.com/ctkqiang/TongXinZhiZhou', updatedAt: '2026-07-08', isFork: false },
  { id: 7, name: 'HuaTuoAI', description: 'AI image classification for traditional Chinese medicine', language: 'Python', stars: 142, forks: 28, topics: ['ai', 'image-classification', 'cnn', 'chinese-medicine'], url: 'https://github.com/ctkqiang/HuaTuoAI', updatedAt: '2026-07-08', isFork: false },
  { id: 8, name: 'HoneyDew', description: 'Multi-protocol high-interaction honeypot system (C99)', language: 'C', stars: 4, forks: 0, topics: ['honeypot', 'security', 'multi-protocol', 'c99'], url: 'https://github.com/ctkqiang/HoneyDew', updatedAt: '2026-07-08', isFork: false },
  { id: 9, name: 'QianKunQuan', description: 'Network security scanner (port scan, service ID, CVE correlation)', language: 'Go', stars: 31, forks: 5, topics: ['cybersecurity', 'scanner', 'nmap', 'cve', 'golang'], url: 'https://github.com/ctkqiang/QianKunQuan', updatedAt: '2026-07-08', isFork: false },
  { id: 10, name: 'NezhaCyberMCP', description: 'Security advisories aggregator served via MCP JSON-RPC 2.0', language: 'Go', stars: 1, forks: 0, topics: ['mcp', 'security', 'json-rpc', 'advisories'], url: 'https://github.com/ctkqiang/NezhaCyberMCP', updatedAt: '2026-07-07', isFork: false },
  { id: 11, name: 'nezha_cyber', description: 'TUI app for red team / pentest with DeepSeek LLM integration', language: 'Rust', stars: 19, forks: 0, topics: ['tui', 'red-team', 'pentest', 'deepseek', 'rust'], url: 'https://github.com/ctkqiang/nezha_cyber', updatedAt: '2026-07-07', isFork: false },
  { id: 12, name: 'LQZ', description: 'Android device data forensics tool for law enforcement', language: 'C++', stars: 88, forks: 17, topics: ['adb', 'android', 'forensics', 'cybersecurity', 'mobile'], url: 'https://github.com/ctkqiang/LQZ', updatedAt: '2026-07-05', isFork: false },
  { id: 13, name: 'openrouter-credit-monitor', description: 'OpenRouter API credit monitoring tool', language: 'TypeScript', stars: 1, forks: 0, topics: ['openrouter', 'monitor', 'api'], url: 'https://github.com/ctkqiang/openrouter-credit-monitor', updatedAt: '2026-07-04', isFork: false },
  { id: 14, name: 'AWSFinOps', description: 'Serverless AWS Lambda cost governance worker', language: 'Go', stars: 2, forks: 0, topics: ['aws', 'lambda', 'cost', 'finops', 'serverless'], url: 'https://github.com/ctkqiang/AWSFinOps', updatedAt: '2026-07-03', isFork: false },
  { id: 15, name: 'boss_zhipin_pachong', description: 'Spring Boot BOSS Zhipin job posting scraper', language: 'Java', stars: 36, forks: 4, topics: ['spring-boot', 'jsoup', 'scraper', 'boss-zhipin'], url: 'https://github.com/ctkqiang/boss_zhipin_pachong', updatedAt: '2026-07-02', isFork: false },
  { id: 16, name: 'exploitdb', description: 'CLI tool for fetching/parsing/exporting Exploit-DB data', language: 'Java', stars: 17, forks: 2, topics: ['exploit-db', 'cli', 'security', 'java'], url: 'https://github.com/ctkqiang/exploitdb', updatedAt: '2026-07-02', isFork: false },
  { id: 17, name: 'trading_view_flutter', description: 'Flutter TradingView chart integration library', language: 'Dart', stars: 10, forks: 4, topics: ['flutter', 'tradingview', 'charts', 'dart'], url: 'https://github.com/ctkqiang/trading_view_flutter', updatedAt: '2026-06-30', isFork: false },
  { id: 18, name: 'dirleaks', description: 'Lightweight sensitive path scanner (C + libcurl)', language: 'C', stars: 7, forks: 0, topics: ['scanner', 'path', 'libcurl', 'c', 'security'], url: 'https://github.com/ctkqiang/dirleaks', updatedAt: '2026-06-29', isFork: false },
  { id: 19, name: 'EasyApplyLinkedInBot', description: 'Automated LinkedIn job application bot', language: 'Python', stars: 2, forks: 1, topics: ['linkedin', 'bot', 'automation', 'python'], url: 'https://github.com/ctkqiang/EasyApplyLinkedInBot', updatedAt: '2026-06-28', isFork: false }
]

export const forkedProjects: GitHubProject[] = [
  { id: 20, name: 'erlcloud', description: 'AWS APIs library for Erlang (EC2, S3, SQS, DDB, ELB)', language: null, stars: 1, forks: 0, topics: ['aws', 'erlang'], url: 'https://github.com/ctkqiang/erlcloud', updatedAt: '2026-07-08', isFork: true },
  { id: 21, name: 'aws-erlang', description: 'Create, configure, and manage AWS services from Erlang', language: null, stars: 2, forks: 0, topics: ['aws', 'erlang'], url: 'https://github.com/ctkqiang/aws-erlang', updatedAt: '2026-07-08', isFork: true },
  { id: 22, name: 'SafeLine', description: 'Self-hosted WAF / reverse proxy', language: null, stars: 0, forks: 0, topics: ['waf', 'security'], url: 'https://github.com/ctkqiang/SafeLine', updatedAt: '2026-07-03', isFork: true },
  { id: 23, name: 'claude-mythos', description: 'Prompt framework for LLM vulnerability discovery', language: null, stars: 0, forks: 0, topics: ['llm', 'prompt', 'vulnerability'], url: 'https://github.com/ctkqiang/claude-mythos', updatedAt: '2026-07-02', isFork: true },
  { id: 24, name: 'mxcwpp', description: 'Enterprise host & container security management platform', language: null, stars: 1, forks: 0, topics: ['security', 'container', 'enterprise'], url: 'https://github.com/ctkqiang/mxcwpp', updatedAt: '2026-07-02', isFork: true },
  { id: 25, name: 'Agenvoy', description: 'Go-based multi-provider intelligent dispatch', language: null, stars: 1, forks: 0, topics: ['go', 'dispatch', 'ai'], url: 'https://github.com/ctkqiang/Agenvoy', updatedAt: '2026-06-30', isFork: true },
  { id: 26, name: 'CyberSecurity-Skills', description: 'AI-operated cybersecurity Skill knowledge base', language: null, stars: 3, forks: 0, topics: ['cybersecurity', 'ai', 'skills'], url: 'https://github.com/ctkqiang/CyberSecurity-Skills', updatedAt: '2026-06-30', isFork: true },
  { id: 27, name: 'CaA', description: 'Collector and Analyzer - information insight tool', language: null, stars: 0, forks: 0, topics: ['analyzer', 'insight'], url: 'https://github.com/ctkqiang/CaA', updatedAt: '2026-07-06', isFork: true },
  { id: 28, name: 'matrix', description: "WeChat's plugin-style non-invasive APM system", language: null, stars: 0, forks: 0, topics: ['wechat', 'apm'], url: 'https://github.com/ctkqiang/matrix', updatedAt: '2026-06-29', isFork: true },
  { id: 29, name: 'janus-gateway', description: 'Janus WebRTC Server', language: 'C', stars: 0, forks: 0, topics: ['webrtc', 'janus'], url: 'https://github.com/ctkqiang/janus-gateway', updatedAt: '2026-06-29', isFork: true },
  { id: 30, name: 'playwright-go', description: 'Playwright for Go browser automation library', language: null, stars: 0, forks: 0, topics: ['playwright', 'go', 'automation'], url: 'https://github.com/ctkqiang/playwright-go', updatedAt: '2026-06-26', isFork: true }
]

export const allProjects = [...projects, ...forkedProjects]

export const projectStats: ProjectStats = {
  totalRepos: allProjects.length,
  originalRepos: projects.length,
  forkedRepos: forkedProjects.length,
  totalStars: allProjects.reduce((sum, p) => sum + p.stars, 0),
  languages: [...new Set(allProjects.filter(p => p.language).map(p => p.language!))]
}
