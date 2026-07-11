import type { Tutorial } from '@/models/Tutorial'

export const tutorials: Tutorial[] = [
  {
    id: 'baidu-dorking-advanced',
    title: '高级搜索引擎渗透技术 - 百度篇',
    date: '2026-01-15',
    category: '信息收集',
    level: 'advanced',
    duration: '2小时',
    excerpt: '深入掌握百度搜索引擎高级语法，从基础Dorking到高级组合查询，全面提升OSINT信息收集能力，发现隐藏的敏感资源与系统入口。',
    content: '本教程系统介绍百度搜索引擎在渗透测试信息收集中的高级应用技术。搜索引擎是渗透测试中最重要的开源情报（OSINT）工具之一，通过巧妙构造搜索语句（Dorking），可以发现大量本不该公开的敏感信息，包括后台管理界面、配置文件、数据库备份、敏感文档等。百度作为中文互联网最大的搜索引擎，其索引覆盖了大量国内网站和服务，在针对中文目标的渗透测试中具有不可替代的价值。教程涵盖从基础语法到高级组合技巧的完整知识体系，通过实战案例帮助学习者建立系统化的搜索引擎情报收集思维。',
    tags: ['信息收集', 'OSINT', '百度Dorking', '渗透测试'],
    author: '钟智强',
    chapters: [
      {
        title: 'Baidu Dorking基础语法',
        sections: [
          {
            heading: '搜索引擎Dorking概述',
            body: '搜索引擎Dorking是指利用搜索引擎的高级搜索语法，通过精确构造查询语句来发现隐藏在公共互联网中的敏感信息和脆弱系统。这项技术也被称为"Google Hacking"，但在中文安全领域，百度Dorking同样占据重要地位。百度拥有庞大的中文网页索引库，对于国内目标的信息收集往往比Google更有效。',
            listItems: [
              '搜索引擎爬虫持续抓取互联网内容并建立索引',
              'Dorking利用高级语法精准定位特定内容',
              '可发现后台、配置文件、备份文件、敏感文档等',
              '属于被动侦察，不直接与目标交互，隐蔽性强',
              '合法合规，但需注意信息使用的道德边界'
            ]
          },
          {
            heading: '百度基础搜索语法',
            body: '百度提供了丰富的高级搜索语法，掌握这些语法是进行有效Dorking的基础。与Google类似，百度支持site、inurl、intitle、filetype等常用指令，但在具体行为上存在一些差异，需要在实践中不断总结。',
            codeBlock: 'site:example.com          # 限定搜索域名\ninurl:admin               # URL中包含admin\nintitle:后台管理           # 标题中包含后台管理\nfiletype:pdf               # 指定文件类型\nintext:密码                # 页面内容包含密码\n"用户名" "密码"            # 精确匹配词组\n-广告                      # 排除包含广告的结果',
            codeLang: 'text'
          },
          {
            heading: 'site指令详解',
            body: 'site指令是Dorking中最常用也是最强大的指令之一。它可以将搜索范围限定在特定的域名或网站内，是针对特定目标进行信息收集的基础。灵活运用site指令可以快速摸清目标站点的内容结构和暴露面。',
            listItems: [
              'site:example.com — 搜索主域名下所有页面',
              'site:*.example.com — 搜索所有子域名（需结合其他关键词）',
              'site:example.com inurl:login — 查找登录页面',
              'site:example.com filetype:doc — 查找Word文档',
              'site:gov.cn — 搜索政府网站中的内容'
            ]
          }
        ]
      },
      {
        title: '常见查询技巧',
        sections: [
          {
            heading: '后台管理页面发现',
            body: '后台管理页面是渗透测试中的重要目标。通过百度Dorking可以高效地发现各种网站的后台登录入口，包括管理员登录、会员中心、CMS后台等。这些入口往往是暴力破解、SQL注入等攻击的起点。',
            codeBlock: 'site:target.com inurl:admin\nsite:target.com intitle:后台管理\nsite:target.com inurl:login\nsite:target.com intitle:管理员登录\nsite:target.com "管理后台" "用户名" "密码"\nsite:target.com inurl:manage\nsite:target.com inurl:system',
            codeLang: 'text'
          },
          {
            heading: '敏感文件发现',
            body: '网站上常常存在一些开发者疏忽留下的敏感文件，包括备份文件、配置文件、数据库导出文件、日志文件等。通过Dorking技术可以快速定位这些文件，它们往往包含数据库密码、API密钥、服务器路径等高度敏感信息。',
            listItems: [
              '备份文件：.bak, .zip, .rar, .tar.gz, .sql',
              '配置文件：.env, config.php, web.config, .htaccess',
              '日志文件：error.log, access.log, debug.log',
              '编辑器临时文件：.swp, .~',
              '源码泄露：.git, .svn, WEB-INF'
            ]
          },
          {
            heading: 'PDF文档信息收集',
            body: 'PDF文档是信息泄露的重灾区。许多网站会发布包含敏感信息的PDF文件，如用户手册、技术文档、内部报告、财务报表等。PDF文件的元数据中还可能包含作者信息、创建软件、文件路径等有价值的情报。',
            codeBlock: 'site:target.com filetype:pdf 内部\nsite:target.com filetype:pdf 技术文档\nsite:target.com filetype:pdf 密码\nsite:target.com filetype:pdf 配置\nsite:target.com filetype:pdf 账号\n\n# 提取PDF元数据的工具：\n# exiftool, pdfinfo, peepdf',
            codeLang: 'text'
          },
          {
            heading: '配置文件与源码泄露',
            body: '配置文件和源码泄露是最危险的信息泄露类型之一。一旦泄露，攻击者可以直接获取数据库凭证、API密钥、加密密钥、业务逻辑源码等核心信息，往往直接导致系统被完全接管。',
            listItems: [
              '.env 文件 — Laravel等框架的环境配置',
              'config.inc.php — PHP应用配置文件',
              'web.config — ASP.NET配置文件',
              'application.yml — Spring Boot配置',
              'database.yml — Rails数据库配置',
              'package.json / composer.json — 依赖信息'
            ]
          }
        ]
      },
      {
        title: '高级搜索语法组合',
        sections: [
          {
            heading: '多语法组合策略',
            body: '高级Dorking的核心在于将多个搜索语法进行巧妙组合，形成精确的查询语句。通过site + inurl + intitle + filetype + 关键词的组合，可以极大地缩小搜索范围，精准定位到最有价值的目标。组合语法的使用需要一定的经验积累和创造性思维。',
            codeBlock: '# 查找可能存在SQL注入的页面\nsite:target.com inurl:php?id=\n\n# 查找文件上传页面\nsite:target.com inurl:upload\n\n# 查找phpinfo信息泄露\nsite:target.com intitle:"phpinfo()" \n\n# 查找开放目录列表\nsite:target.com intitle:index.of\n\n# 查找API文档\nsite:target.com filetype:pdf api 文档\n\n# 查找员工信息\nsite:target.com inurl:member listItems:[]',
            codeLang: 'text'
          },
          {
            heading: '利用缓存与快照',
            body: '百度缓存（Baidu Cache）是一个经常被忽视但极其有用的功能。当目标网站已经下线或页面被删除时，百度的缓存快照中可能仍然保留着历史内容。这对于获取已经被移除的敏感信息非常有价值。渗透测试者应该养成查看缓存的习惯。',
            listItems: [
              '点击搜索结果中的"百度快照"查看缓存版本',
              '目标页面已删除时，缓存中可能仍有内容',
              '对比不同时间的缓存可发现网站变更历史',
              '缓存中的内容可能包含已被修复的漏洞信息',
              'Wayback Machine可获取更久远的历史版本'
            ]
          },
          {
            heading: '子域名发现',
            body: '子域名发现是信息收集中的重要环节。每个子域名都是一个潜在的攻击面，测试环境、内部系统、管理后台等往往隐藏在不为人知的子域名中。利用百度的site指令配合通配符和关键词，可以发现大量子域名。',
            codeBlock: '# 基础子域名发现\nsite:*.target.com\n\n# 通过关键词发现子域名\nsite:target.com inurl:admin\nsite:target.com inurl:test\nsite:target.com inurl:dev\n\n# 通过特定服务发现\nsite:target.com "ftp." \nsite:target.com "mail."\nsite:target.com "vpn."\n\n# 辅助工具：\n# subfinder, amass, Sublist3r',
            codeLang: 'text'
          }
        ]
      },
      {
        title: '实战案例分析',
        sections: [
          {
            heading: '案例一：配置文件泄露导致系统接管',
            body: '在一次授权的渗透测试中，通过百度搜索 site:target.com filetype:env 发现了某电商平台的 .env 配置文件暴露在公网。该文件包含了MySQL数据库连接信息、Redis密码、邮件服务凭证、第三方支付API密钥等高度敏感信息。攻击者利用这些信息直接连接数据库，获取了所有用户数据，包括用户密码哈希、收货地址、支付记录等敏感信息，最终导致系统被完全接管。',
            listItems: [
              '发现方式：百度Dorking搜索 .env 文件',
              '泄露信息：数据库账号密码、Redis密码、支付密钥',
              '影响范围：全量用户数据泄露、支付系统风险',
              '根本原因：配置文件未从web根目录移除',
              '修复措施：将.env移出web目录、配置nginx屏蔽'
            ]
          },
          {
            heading: '案例二：后台地址泄露与弱口令',
            body: '某企业官网后台管理系统地址通过百度搜索被轻易发现。管理员使用了"admin / admin123"这样的弱口令，攻击者通过简单的暴力破解就成功进入后台。进入后台后，利用CMS的模板编辑功能上传WebShell，最终获取了服务器权限，并进一步渗透到内部网络，造成了严重的安全事件。',
            codeBlock: '# 发现后台地址\nsite:company.com intitle:后台管理\n\n# 弱口令尝试\nadmin / admin\nadmin / admin123\nadmin / password\n\n# 后续攻击路径\n后台登录 -> 模板编辑 -> 上传WebShell -> 获取服务器权限 -> 内网渗透',
            codeLang: 'text'
          },
          {
            heading: '案例三：PDF文档泄露内部网络拓扑',
            body: '某机构在官网发布了一份技术白皮书PDF，文档中包含了详细的内部网络拓扑图、服务器IP地址规划、系统架构说明等敏感信息。攻击者通过百度Dorking找到这份PDF后，对内部网络结构了如指掌，在后续的渗透测试中精准定位了核心服务器，大大提高了攻击效率。这个案例提醒我们，公开发布的文档需要仔细进行敏感信息审查。',
            listItems: [
              '发现方式：filetype:pdf + 关键词组合搜索',
              '泄露内容：网络拓扑、IP规划、系统架构',
              '造成影响：攻击面精准定位，渗透效率倍增',
              '教训：公开发布文档前必须进行脱敏审查',
              '工具：Adobe Acrobat的内容审查功能'
            ]
          }
        ]
      },
      {
        title: '合规与道德边界',
        sections: [
          {
            heading: '法律合规要点',
            body: '搜索引擎Dorking本身只是利用公开的搜索引擎功能，通常不违反法律。但获取信息后的使用方式可能触及法律红线。必须明确，即使信息是公开的，未经授权利用这些信息侵入他人系统、窃取数据、破坏服务等行为都是违法犯罪行为。安全研究必须在法律框架内进行。',
            listItems: [
              'Dorking本身属于被动信息收集，通常合法',
              '获取的信息只能用于授权的安全测试',
              '不得利用获取的信息进行未授权访问',
              '不得泄露、出售或非法利用获取的信息',
              '发现漏洞应通过正规渠道负责任披露'
            ]
          },
          {
            heading: '道德准则与责任',
            body: '作为安全从业者，我们不仅要遵守法律，还要坚守职业道德。信息安全的使命是保护系统和用户，而不是造成伤害。在进行Dorking和信息收集时，应遵循"不伤害"原则，对发现的敏感信息保密，通过合适的渠道通知相关方，帮助修复漏洞，而不是利用漏洞牟利或炫耀。',
            listItems: [
              '始终保持善意，以改进安全为目的',
              '发现漏洞及时通知厂商或运营方',
              '不在公开场合披露未修复的漏洞细节',
              '不利用发现的信息进行任何破坏性活动',
              '尊重隐私，不泄露个人敏感信息'
            ]
          },
          {
            heading: '最佳实践建议',
            body: '对于安全从业者和企业防御方，都需要了解Dorking技术。攻击者会用，防御者更应该会用，这样才能知己知彼，提前发现并封堵信息泄露渠道。企业应定期对自身进行Dorking检测，及时发现并处理信息泄露问题，将风险消灭在萌芽状态。',
            codeBlock: '# 企业定期自查清单\n1. site:company.com 敏感关键词搜索\n2. 检查 .env, config, backup 等文件是否暴露\n3. 检查后台地址是否可被搜索引擎索引\n4. 检查PDF、DOC等文档是否含敏感信息\n5. 配置robots.txt限制敏感目录爬取\n6. 设置X-Robots-Tag响应头\n7. 定期检查百度/Google索引的敏感内容',
            codeLang: 'text'
          }
        ]
      }
    ]
  },
  {
    id: 'ssh-metasploit-guide',
    title: 'SSH与Metasploit实战入门指南',
    date: '2026-02-20',
    category: '渗透测试',
    level: 'intermediate',
    duration: '1.5小时',
    excerpt: '从SSH协议基础到Metasploit SSH模块实战，系统学习SSH服务安全测试方法，掌握凭据测试、会话管理与横向移动技巧。',
    content: 'SSH（Secure Shell）是目前最常用的远程管理协议，几乎所有的Linux服务器和网络设备都支持SSH访问。正因为其普遍性，SSH服务也成为了攻击者的重点目标。Metasploit作为最强大的渗透测试框架之一，提供了丰富的SSH相关模块，涵盖了从信息收集、漏洞利用到后渗透的完整攻击链。本教程从SSH协议基础讲起，系统介绍Metasploit框架中各类SSH模块的使用方法，通过搭建安全测试环境进行实战演练，帮助学习者建立扎实的SSH安全测试能力。',
    tags: ['SSH', 'Metasploit', '渗透测试', '红队'],
    author: '钟智强',
    chapters: [
      {
        title: 'SSH协议基础',
        sections: [
          {
            heading: 'SSH协议概述',
            body: 'SSH（Secure Shell）是一种加密的网络协议，用于在不安全的网络中安全地进行远程登录和其他网络服务。SSH通过加密机制保证了数据传输的机密性和完整性，同时支持多种认证方式。SSH协议默认工作在22端口，目前主流版本是SSH-2，相比SSH-1在安全性和功能上都有大幅提升。',
            listItems: [
              'SSH-1：早期版本，存在安全缺陷，已被淘汰',
              'SSH-2：当前标准版本，安全性更高，功能更丰富',
              '默认端口：TCP 22',
              '传输加密：对称加密（AES等）',
              '身份认证：口令认证、公钥认证、主机认证'
            ]
          },
          {
            heading: 'SSH认证机制',
            body: 'SSH支持多种认证方式，其中最常见的是口令认证和公钥认证。了解这些认证机制的原理对于进行SSH安全测试至关重要。不同的认证方式对应不同的攻击面和攻击方法。',
            codeBlock: '# 常见认证方式\n1. 口令认证（Password Authentication）\n   - 使用用户名和密码登录\n   - 容易遭受暴力破解攻击\n\n2. 公钥认证（Public Key Authentication）\n   - 使用非对称加密密钥对\n   - 私钥保存在客户端，公钥存放在服务端\n   - 比口令认证更安全\n\n3. 主机认证（Host-based Authentication）\n   - 基于主机信任关系\n   - 配置复杂，安全性依赖主机安全\n\n4. 键盘交互认证（Keyboard-interactive）\n   - 可实现二次验证等复杂认证流程',
            codeLang: 'text'
          },
          {
            heading: 'SSH安全风险',
            body: '尽管SSH本身是安全协议，但配置不当或使用不当会带来各种安全风险。了解这些风险是进行安全测试和防御加固的前提。常见的SSH安全风险包括弱口令、密钥泄露、协议版本问题、配置不当等。',
            listItems: [
              '弱口令/默认口令 — 暴力破解的主要目标',
              'SSH-1协议启用 — 存在已知漏洞',
              'root用户直接登录 — 增加被攻击风险',
              '空口令登录 — 严重配置错误',
              '密钥管理不当 — 私钥泄露导致完全失陷',
              '版本过旧 — 存在已知CVE漏洞'
            ]
          }
        ]
      },
      {
        title: 'Metasploit SSH模块概览',
        sections: [
          {
            heading: 'Metasploit框架简介',
            body: 'Metasploit是一款开源的渗透测试框架，由Rapid7公司维护。它提供了大量的漏洞利用模块、辅助模块、Payload、编码器等组件，是渗透测试人员和红队成员的必备工具。Metasploit采用模块化架构，新的漏洞和攻击技术可以快速集成到框架中。',
            listItems: [
              '辅助模块（Auxiliary）：扫描、枚举、拒绝服务等',
              '漏洞利用模块（Exploits）：利用漏洞获取访问权限',
              'Payload模块：成功利用后执行的代码',
              '后渗透模块（Post）：获取权限后的进一步操作',
              '编码器（Encoders）：对Payload进行编码绕过检测'
            ]
          },
          {
            heading: 'SSH辅助模块',
            body: 'Metasploit的SSH辅助模块主要用于信息收集和服务探测，包括SSH版本探测、SSH服务枚举、SSH密钥扫描等。这些模块可以帮助我们了解目标SSH服务的详细信息，为后续的攻击做准备。',
            codeBlock: '# SSH版本探测\nuse auxiliary/scanner/ssh/ssh_version\n\n# SSH服务器枚举\nuse auxiliary/scanner/ssh/ssh_enumusers\n\n# SSH认证方式探测\nuse auxiliary/scanner/ssh/ssh_auth_methods\n\n# SSH暴力破解\nuse auxiliary/scanner/ssh/ssh_login\n\n# SSH公钥登录测试\nuse auxiliary/scanner/ssh/ssh_login_pubkey',
            codeLang: 'text'
          },
          {
            heading: 'SSH漏洞利用模块',
            body: '针对SSH服务和SSH相关软件的漏洞，Metasploit也提供了相应的漏洞利用模块。这些模块针对特定的CVE漏洞，成功率取决于目标系统的具体版本和配置。在使用这些模块之前，需要通过信息收集确认目标存在相应的漏洞。',
            listItems: [
              'OpenSSL心脏出血（Heartbleed）— 非直接SSH漏洞但相关',
              'libssh身份验证绕过（CVE-2018-10933）',
              'Dropbear SSH相关漏洞',
              '各种SSH实现的特定漏洞',
              'SSH隧道与端口转发相关利用'
            ]
          }
        ]
      },
      {
        title: '搭建安全测试环境',
        sections: [
          {
            heading: '测试环境规划',
            body: '在进行SSH渗透测试学习和练习时，必须在合法授权的环境中进行。搭建本地测试环境是最佳选择，既安全又可以随意配置各种漏洞场景。推荐使用虚拟化技术搭建隔离的测试网络，可以模拟真实的企业网络环境。',
            codeBlock: '# 推荐环境配置\n攻击机：\n  - Kali Linux / Parrot OS\n  - Metasploit Framework\n  - Nmap, Hydra, Medusa等工具\n\n目标机：\n  - Ubuntu Server 20.04/22.04\n  - 启用SSH服务\n  - 配置不同强度的口令\n  - 可故意配置一些不安全设置\n\n网络：\n  - 虚拟机NAT或仅主机模式\n  - 确保与外部网络隔离',
            codeLang: 'text'
          },
          {
            heading: '安装与配置SSH服务',
            body: '在Linux系统上安装和配置SSH服务非常简单。以Ubuntu为例，通过apt包管理器即可安装OpenSSH服务端。安装完成后，可以通过修改配置文件来调整安全设置，模拟不同的安全场景。',
            codeBlock: '# 安装SSH服务\nsudo apt update\nsudo apt install openssh-server\n\n# 启动SSH服务\nsudo systemctl start ssh\nsudo systemctl enable ssh\n\n# 查看SSH配置文件\nsudo nano /etc/ssh/sshd_config\n\n# 常用不安全配置（仅用于测试环境！）：\n# PermitRootLogin yes\n# PasswordAuthentication yes\n# PermitEmptyPasswords yes',
            codeLang: 'bash'
          },
          {
            heading: '创建测试用户与弱口令',
            body: '为了练习暴力破解和其他攻击技术，需要在测试环境中创建一些带有弱口令的用户账号。这些账号用于模拟真实环境中常见的安全问题。注意，这些配置绝对不能用于生产环境。',
            listItems: [
              '创建用户：test / test123',
              '创建用户：admin / admin123',
              '创建用户：root / toor（root账号）',
              '配置SSH允许root登录',
              '设置部分用户使用公钥认证',
              '配置日志记录以便学习分析'
            ]
          }
        ]
      },
      {
        title: '凭据测试与枚举',
        sections: [
          {
            heading: 'SSH版本探测',
            body: '在进行任何攻击之前，首先需要对目标SSH服务进行信息收集。最基本的就是版本探测，了解目标运行的SSH软件和版本号，这决定了后续可以使用哪些攻击方法。Metasploit的ssh_version模块可以快速完成这项工作。',
            codeBlock: 'msf6 > use auxiliary/scanner/ssh/ssh_version\nmsf6 auxiliary(scanner/ssh/ssh_version) > set RHOSTS 192.168.1.100\nmsf6 auxiliary(scanner/ssh/ssh_version) > set RPORT 22\nmsf6 auxiliary(scanner/ssh/ssh_version) > run\n\n# 典型输出：\n# [+] 192.168.1.100:22 - SSH server version: SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5',
            codeLang: 'bash'
          },
          {
            heading: '用户名枚举',
            body: '在某些SSH实现和配置下，可以通过不同的响应时间或错误消息来枚举有效的用户名。这一步对于暴力破解非常有价值，可以大大缩小需要测试的用户名范围。Metasploit提供了ssh_enumusers模块来进行这项测试。',
            listItems: [
              '基于时间差异的用户名枚举',
              '基于错误消息差异的枚举',
              '常见用户名列表：admin, root, test, user等',
              '结合企业邮箱模式推测用户名',
              '枚举成功后进行定向的口令爆破'
            ]
          },
          {
            heading: 'SSH暴力破解',
            body: '暴力破解是SSH攻击中最经典也最常用的方法。当目标使用弱口令时，暴力破解的成功率很高。Metasploit的ssh_login模块提供了强大的暴力破解功能，支持用户名列表、密码列表、线程设置等参数。',
            codeBlock: 'msf6 > use auxiliary/scanner/ssh/ssh_login\nmsf6 auxiliary(scanner/ssh/ssh_login) > set RHOSTS 192.168.1.100\nmsf6 auxiliary(scanner/ssh/ssh_login) > set USERNAME root\nmsf6 auxiliary(scanner/ssh/ssh_login) > set PASS_FILE /usr/share/wordlists/rockyou.txt\nmsf6 auxiliary(scanner/ssh/ssh_login) > set THREADS 10\nmsf6 auxiliary(scanner/ssh/ssh_login) > set STOP_ON_SUCCESS true\nmsf6 auxiliary(scanner/ssh/ssh_login) > run',
            codeLang: 'bash'
          },
          {
            heading: '公钥认证测试',
            body: '如果目标启用了公钥认证，而我们又能获取到用户的私钥文件，那就可以直接通过私钥登录，无需密码。在渗透测试中，通过其他漏洞获取到用户的~/.ssh/id_rsa文件是常见的攻击路径。Metasploit也有相应的模块来测试SSH公钥登录。',
            listItems: [
              '寻找泄露的私钥文件（id_rsa, id_ecdsa等）',
              '检查私钥是否有密码保护',
              '使用ssh2john破解加密的私钥',
              '使用获得的私钥尝试登录',
              'Metasploit模块：ssh_login_pubkey'
            ]
          }
        ]
      },
      {
        title: '会话管理与横向移动',
        sections: [
          {
            heading: 'Metasploit会话管理',
            body: '通过SSH登录成功后，Metasploit会建立一个Meterpreter或Shell会话。掌握会话管理是进行后续渗透操作的基础。Metasploit提供了丰富的会话管理功能，可以在多个会话之间切换、升级会话、执行命令等。',
            codeBlock: '# 查看所有会话\nmsf6 > sessions -l\n\n# 进入指定会话\nmsf6 > sessions -i 1\n\n# 后台当前会话\nmeterpreter > background\n\n# 升级Shell为Meterpreter\nmsf6 > sessions -u 1\n\n# 在会话中执行命令\nmeterpreter > shell\nmeterpreter > ls\nmeterpreter > cat /etc/passwd',
            codeLang: 'bash'
          },
          {
            heading: '信息收集与权限提升',
            body: '获取SSH会话后，下一步通常是进行系统信息收集和权限提升尝试。了解当前用户权限、系统配置、安装的软件、运行的服务等信息，有助于找到进一步提升权限的途径。',
            listItems: [
              '收集系统信息：uname -a, cat /etc/os-release',
              '查看当前用户：whoami, id',
              '查看可执行sudo的命令：sudo -l',
              '查找SUID文件：find / -perm -4000 2>/dev/null',
              '查看定时任务：crontab -l, ls /etc/cron*',
              '查看内核漏洞：根据内核版本查找对应EXP'
            ]
          },
          {
            heading: '横向移动技术',
            body: '在获取了一台服务器的SSH访问权限后，通常需要进一步渗透到内部网络的其他系统，这个过程称为横向移动（Lateral Movement）。SSH本身也可以作为横向移动的工具，利用跳板机访问内网中其他SSH服务。',
            codeBlock: '# SSH动态端口转发（SOCKS代理）\nssh -D 1080 user@target\n\n# SSH本地端口转发\nssh -L 8080:internal:80 user@target\n\n# SSH远程端口转发\nssh -R 8080:localhost:80 user@target\n\n# 使用Metasploit进行内网转发\n# route add / autoroute\n# socks4a / socks5 代理模块',
            codeLang: 'bash'
          },
          {
            heading: 'SSH隧道与代理',
            body: 'SSH隧道是渗透测试中非常有用的技术，可以绕过网络访问控制，访问内网资源。SSH支持本地端口转发、远程端口转发和动态端口转发（SOCKS代理）三种模式，灵活运用可以应对各种复杂的网络环境。',
            listItems: [
              '本地转发：将本地端口映射到远程地址',
              '远程转发：将远程端口映射到本地地址',
              '动态转发：建立SOCKS代理，访问任意内网地址',
              '配合proxychains等工具实现任意程序代理',
              'Metasploit中使用route和socks模块'
            ]
          }
        ]
      },
      {
        title: '防御与加固策略',
        sections: [
          {
            heading: 'SSH安全配置最佳实践',
            body: '了解攻击技术的最终目的是更好地进行防御。对于系统管理员和安全工程师来说，掌握SSH安全加固方法至关重要。通过合理的配置可以大幅降低SSH服务被攻击的风险，这些加固措施虽然简单但效果显著。',
            codeBlock: '# /etc/ssh/sshd_config 关键配置\n\n# 修改默认端口\nPort 2222\n\n# 禁止root直接登录\nPermitRootLogin no\n\n# 禁用空口令\nPermitEmptyPasswords no\n\n# 启用公钥认证\nPubkeyAuthentication yes\n\n# 禁用口令认证（如果全部使用密钥）\nPasswordAuthentication no\n\n# 限制登录尝试次数\nMaxAuthTries 3\n\n# 登录超时时间\nLoginGraceTime 30',
            codeLang: 'text'
          },
          {
            heading: '防暴力破解措施',
            body: '暴力破解是SSH面临的最常见攻击。除了使用强口令和禁用口令认证外，还可以通过多种手段来防范暴力破解攻击，包括fail2ban、防火墙限制、端口敲门等技术。多层防御可以极大地提高攻击成本。',
            listItems: [
              '使用强密码策略，避免弱口令',
              '部署fail2ban自动封禁暴力破解IP',
              '配置iptables限制连接频率',
              '使用端口敲门（Port Knocking）技术',
              '启用登录失败告警机制',
              '定期检查/var/log/auth.log日志'
            ]
          },
          {
            heading: '密钥管理安全',
            body: 'SSH密钥是访问服务器的凭证，其重要性相当于密码。密钥管理不当是许多安全事件的根源。良好的密钥管理习惯包括：使用强密钥、设置密钥密码、定期轮换密钥、最小化授权范围等。',
            listItems: [
              '使用至少4096位的RSA密钥或Ed25519密钥',
              '私钥必须设置密码保护（passphrase）',
              '定期轮换密钥，建立密钥生命周期管理',
              '为不同环境使用不同的密钥',
              '使用ssh-agent管理密钥，避免私钥扩散',
              '审计authorized_keys文件，及时清理失效密钥'
            ]
          },
          {
            heading: '监控与审计',
            body: '安全是一个持续的过程，监控和审计不可或缺。通过对SSH访问日志的持续监控，可以及时发现异常行为和攻击尝试。建立完善的审计机制，确保所有SSH操作都有迹可循，便于事后追溯和调查。',
            codeBlock: '# 重要日志文件\n/var/log/auth.log    # Debian/Ubuntu\n/var/log/secure      # CentOS/RHEL\n\n# 常用检查命令\n# 查看登录失败记录\ngrep \"Failed password\" /var/log/auth.log\n\n# 查看成功登录记录\ngrep \"Accepted\" /var/log/auth.log\n\n# 查看当前登录用户\nwho / w / last\n\n# 推荐工具：\n# fail2ban - 自动封禁\n# OSSEC / Wazuh - HIDS\n# ELK Stack - 日志分析',
            codeLang: 'bash'
          }
        ]
      }
    ]
  }
]
