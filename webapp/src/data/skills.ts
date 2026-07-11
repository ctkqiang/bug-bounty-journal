import type { Skill, SkillCategory } from '@/models/Skill'

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming-languages',
    title: '编程语言',
    icon: 'fa-code',
    color: '#3b82f6',
    skills: [
      {
        name: 'Python',
        level: 95,
        category: '编程语言',
        icon: 'fa-python',
        color: '#3776ab'
      },
      {
        name: 'Go',
        level: 90,
        category: '编程语言',
        icon: 'fa-golang',
        color: '#00add8'
      },
      {
        name: 'Rust',
        level: 80,
        category: '编程语言',
        icon: 'fa-rust',
        color: '#dea584'
      },
      {
        name: 'Java',
        level: 85,
        category: '编程语言',
        icon: 'fa-java',
        color: '#f89820'
      },
      {
        name: 'C/C++',
        level: 75,
        category: '编程语言',
        icon: 'fa-cuttlefish',
        color: '#00599c'
      },
      {
        name: 'Dart',
        level: 70,
        category: '编程语言',
        icon: 'fa-dart-lang',
        color: '#0175c2'
      },
      {
        name: 'TypeScript',
        level: 88,
        category: '编程语言',
        icon: 'fa-js',
        color: '#3178c6'
      }
    ]
  },
  {
    id: 'security-tools',
    title: '安全工具',
    icon: 'fa-tools',
    color: '#ef4444',
    skills: [
      {
        name: 'Burp Suite',
        level: 95,
        category: '安全工具',
        icon: 'fa-spider',
        color: '#ff6633'
      },
      {
        name: 'Nmap',
        level: 92,
        category: '安全工具',
        icon: 'fa-network-wired',
        color: '#0078d4'
      },
      {
        name: 'Metasploit',
        level: 90,
        category: '安全工具',
        icon: 'fa-bomb',
        color: '#c91e00'
      },
      {
        name: 'Wireshark',
        level: 85,
        category: '安全工具',
        icon: 'fa-wifi',
        color: '#1679a5'
      },
      {
        name: 'sqlmap',
        level: 90,
        category: '安全工具',
        icon: 'fa-database',
        color: '#ff0000'
      },
      {
        name: 'Ghidra',
        level: 75,
        category: '安全工具',
        icon: 'fa-puzzle-piece',
        color: '#0b8f11'
      },
      {
        name: 'Frida',
        level: 80,
        category: '安全工具',
        icon: 'fa-magic',
        color: '#7f00ff'
      }
    ]
  },
  {
    id: 'security-domains',
    title: '安全领域',
    icon: 'fa-shield-alt',
    color: '#10b981',
    skills: [
      {
        name: 'Web渗透',
        level: 95,
        category: '安全领域',
        icon: 'fa-globe',
        color: '#2563eb'
      },
      {
        name: '移动安全',
        level: 85,
        category: '安全领域',
        icon: 'fa-mobile-alt',
        color: '#22c55e'
      },
      {
        name: '二进制漏洞',
        level: 75,
        category: '安全领域',
        icon: 'fa-bug',
        color: '#f97316'
      },
      {
        name: '逆向工程',
        level: 80,
        category: '安全领域',
        icon: 'fa-sync-alt',
        color: '#8b5cf6'
      },
      {
        name: '云安全',
        level: 80,
        category: '安全领域',
        icon: 'fa-cloud',
        color: '#0ea5e9'
      },
      {
        name: '社会工程学',
        level: 88,
        category: '安全领域',
        icon: 'fa-user-secret',
        color: '#ec4899'
      },
      {
        name: '红队评估',
        level: 85,
        category: '安全领域',
        icon: 'fa-skull',
        color: '#dc2626'
      }
    ]
  },
  {
    id: 'frameworks-platforms',
    title: '框架与平台',
    icon: 'fa-layer-group',
    color: '#8b5cf6',
    skills: [
      {
        name: 'Flutter',
        level: 80,
        category: '框架与平台',
        icon: 'fa-mobile-alt',
        color: '#02569b'
      },
      {
        name: 'Spring Boot',
        level: 75,
        category: '框架与平台',
        icon: 'fa-leaf',
        color: '#6db33f'
      },
      {
        name: 'Vue/React',
        level: 85,
        category: '框架与平台',
        icon: 'fa-vuejs',
        color: '#4fc08d'
      },
      {
        name: 'Docker/K8s',
        level: 80,
        category: '框架与平台',
        icon: 'fa-docker',
        color: '#2496ed'
      },
      {
        name: 'AWS',
        level: 75,
        category: '框架与平台',
        icon: 'fa-aws',
        color: '#ff9900'
      }
    ]
  },
  {
    id: 'cloud-infrastructure',
    title: '云与基础设施',
    icon: 'fa-cloud',
    color: '#f59e0b',
    skills: [
      {
        name: 'AWS',
        level: 80,
        category: '云与基础设施',
        icon: 'fa-aws',
        color: '#ff9900'
      },
      {
        name: 'GCP',
        level: 65,
        category: '云与基础设施',
        icon: 'fa-google',
        color: '#4285f4'
      },
      {
        name: '阿里云',
        level: 85,
        category: '云与基础设施',
        icon: 'fa-cloud',
        color: '#ff6a00'
      },
      {
        name: '腾讯云',
        level: 80,
        category: '云与基础设施',
        icon: 'fa-cloud',
        color: '#00a4ff'
      }
    ]
  }
]

export const allSkills: Skill[] = skillCategories.flatMap(category => category.skills)
