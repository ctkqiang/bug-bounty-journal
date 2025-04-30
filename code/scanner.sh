#!/bin/bash

# 定义ANSI转义序列颜色代码，用于终端输出着色
# RED: 错误信息
# GREEN: 成功信息
# BLUE: 标题和分隔符
# YELLOW: 警告和提示信息
# NC: 恢复默认颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查必要工具是否已安装
# nmap: 网络扫描工具
# whatweb: Web技术识别工具
# subfinder: 子域名发现工具
# wafw00f: WAF检测工具
# sslyze: SSL/TLS安全检测工具
# dirsearch: 目录遍历扫描工具
check_dependencies() {
    local tools=("nmap" "whatweb" "subfinder" "wafw00f" "sslyze" "dirsearch")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &>/dev/null; then
            echo "${RED}错误: 未找到 $tool。请先安装必要工具。${NC}"
            echo "${YELLOW}提示: 可以使用以下命令安装:
            pip3 install wafw00f sslyze dirsearch${NC}"
            exit 1
        fi
    done
}

# 显示程序标题横幅
# 使用Unicode字符创建美观的分隔线
show_banner() {
    clear
    echo "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "${GREEN}                网站安全扫描工具                ${NC}"
    echo "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 主扫描函数：执行所有安全检查
# 参数：
# $1 - 目标网站域名
run_scan() {
    local url=$1
    # 创建唯一的输出目录，使用时间戳
    local output_dir="scan_results_$(date +%Y%m%d_%H%M%S)"

    # 创建结果保存目录
    mkdir -p "$output_dir"
    echo "\n${YELLOW}[*] 开始扫描目标: $url ${NC}\n"
    echo "${YELLOW}[*] 扫描结果将保存在: $output_dir ${NC}\n"

    # 执行ping测试检查目标可达性
    echo "${GREEN}[+] 正在进行连通性测试...${NC}"
    ping -c 3 "$url" | tee "$output_dir/ping.txt"

    # 获取HTTP响应头信息和支持的请求方法
    echo "\n${GREEN}[+] 获取HTTP头信息和请求方法...${NC}"
    {
        echo "=== HTTP头信息 ==="
        curl -I -L -k -s \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
            "$url"

        echo "\n=== 支持的HTTP方法 ==="
        for method in GET POST PUT DELETE OPTIONS HEAD TRACE CONNECT PATCH; do
            code=$(curl -X "$method" -I -L -k -s -o /dev/null -w "%{http_code}" "$url")
            echo "$method: $code"
        done
    } | tee "$output_dir/headers.txt"

    # 使用nmap进行高级端口扫描
    echo "\n${GREEN}[+] 正在扫描开放端口...${NC}"
    {
        # 快速扫描常见端口
        echo "=== 快速扫描常见端口 ==="
        nmap -F -T4 "$url" | grep "open"

        # 详细扫描发现的开放端口
        echo "\n=== 详细扫描开放端口 ==="
        open_ports=$(nmap -F -T4 "$url" | grep "open" | cut -d'/' -f1 | tr '\n' ',')
        if [ ! -z "$open_ports" ]; then
            nmap -p"$open_ports" -sC -sV -A -T4 "$url"
        fi
    } | tee "$output_dir/ports.txt" || {
        echo "${YELLOW}[!] 端口扫描超时，继续下一个任务...${NC}" | tee -a "$output_dir/ports.txt"
    }

    # 识别网站使用的技术栈
    echo "\n${GREEN}[+] 识别Web技术...${NC}"
    whatweb -v "$url" | tee "$output_dir/technologies.txt"

    # 查找相关子域名
    echo "\n${GREEN}[+] 查找子域名...${NC}"
    subfinder -d "$url" | tee "$output_dir/subdomains.txt"

    # 检测WAF
    echo "\n${GREEN}[+] 检测WAF...${NC}"
    wafw00f "$url" | tee "$output_dir/waf.txt"

    # SSL/TLS安全检测
    echo "\n${GREEN}[+] 进行SSL/TLS安全检测...${NC}"
    sslyze "$url" --regular | tee "$output_dir/ssl_tls.txt"

    # 目录遍历扫描
    echo "\n${GREEN}[+] 执行目录遍历扫描...${NC}"
    dirsearch -u "$url" -e php,asp,aspx,jsp,html,zip,jar,sql -x 404,403,401 --random-agent -t 50 | tee "$output_dir/directories.txt"

    # JavaScript文件分析
    echo "\n${GREEN}[+] 分析JavaScript文件...${NC}"
    curl -L -k -s "$url" | grep -Eo '(http|https)://[^/"]+/[^"]+\.js' | sort -u | tee "$output_dir/js_files.txt"
    if [ -s "$output_dir/js_files.txt" ]; then
        echo "\n${YELLOW}[*] 下载并分析JavaScript文件中的敏感信息...${NC}"
        while IFS= read -r js_file; do
            echo "分析: $js_file"
            curl -L -k -s "$js_file" | grep -i "api\|key\|token\|secret\|password\|aws\|azure\|gcp" >>"$output_dir/js_analysis.txt"
        done <"$output_dir/js_files.txt"
    fi

    # 定义需要检查的敏感文件列表
    # 包括配置文件、版本控制文件、备份文件等
    echo "\n${GREEN}[+] 检查敏感文件...${NC}"
    sensitive_files=(
        "/.env"                     # 环境配置文件
        "/.git/config"              # Git配置
        "/.svn/entries"             # SVN配置
        "/.hg/hgrc"                 # Mercurial配置
        "/.bzr/branch/branch.conf"  # Bazaar配置
        "/.DS_Store"                # Mac系统文件
        "/wp-config.php"            # WordPress配置
        "/config.php"               # PHP配置
        "/database.yml"             # 数据库配置
        "/credentials.json"         # 凭证文件
        "/backup.sql"               # 数据库备份
        "/dump.sql"                 # 数据库导出
        "/.htaccess"                # Apache配置
        "/robots.txt"               # 爬虫规则
        "/sitemap.xml"              # 网站地图
        "/.well-known/security.txt" # 安全联系信息
    )

    # 开始检查敏感文件
    {
        echo "# 敏感文件扫描结果 - $(date '+%Y-%m-%d %H:%M:%S')"
        echo "# 目标: $url\n"

        for file in "${sensitive_files[@]}"; do
            echo "正在检查: $file"
            found=false

            # 尝试不同的URL组合方式
            urls=(
                "https://www.$url" # HTTPS带www
                "http://www.$url"  # HTTP带www
                "https://$url"     # HTTPS不带www
                "http://$url"      # HTTP不带www
            )

            # 对每个URL组合进行检查
            for base_url in "${urls[@]}"; do
                # 发送HTTP请求并获取响应信息
                response=$(curl -L -k -s --max-time 5 \
                    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
                    -w "\n状态码: %{http_code}\n大小: %{size_download} bytes\n响应时间: %{time_total}s\n" \
                    "${base_url}${file}") || continue

                # 如果文件存在（非404响应）
                if [[ $response != *"状态码: 404"* ]]; then
                    echo "----------------------------------------"
                    echo "发现文件: ${base_url}${file}"

                    # 特殊处理.env文件，获取并保存内容
                    if [[ "$file" == "/.env" ]]; then
                        env_content=$(curl -L -k -s "${base_url}${file}")
                        echo "文件内容:"
                        echo "$env_content"
                        echo "$env_content" >"$output_dir/env_dump.txt"
                        echo "${GREEN}[+] .env 内容已保存到: $output_dir/env_dump.txt${NC}"
                    fi

                    echo "$response"
                    echo "----------------------------------------\n"

                    found=true
                    break
                fi
            done

            # 如果所有URL组合都未找到文件
            if [ "$found" = false ]; then
                echo "未发现"
            fi
        done
    } | tee "$output_dir/sensitive_files_report.txt"

    # 生成HTML报告
    echo "\n${GREEN}[+] 正在生成HTML报告...${NC}"
    cat >"$output_dir/report.html" <<EOL
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>安全扫描报告 - $url</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 class="text-3xl font-bold mb-4 text-gray-800">安全扫描报告</h1>
            <p class="text-gray-600">目标: $url</p>
            <p class="text-gray-600">扫描时间: $(date '+%Y-%m-%d %H:%M:%S')</p>
        </div>

        <!-- 扫描结果部分 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- WAF检测 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800"><i class="fas fa-shield-alt mr-2"></i>WAF检测</h2>
                <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-60">$(cat "$output_dir/waf.txt" 2>/dev/null || echo "无数据")</pre>
            </div>

            <!-- SSL/TLS检测 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800"><i class="fas fa-lock mr-2"></i>SSL/TLS安全检测</h2>
                <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-60">$(cat "$output_dir/ssl_tls.txt" 2>/dev/null || echo "无数据")</pre>
            </div>

            <!-- 端口扫描 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800"><i class="fas fa-network-wired mr-2"></i>端口扫描</h2>
                <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-60">$(cat "$output_dir/ports.txt" 2>/dev/null || echo "无数据")</pre>
            </div>

            <!-- 目录扫描 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800"><i class="fas fa-folder-open mr-2"></i>目录扫描</h2>
                <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-60">$(cat "$output_dir/directories.txt" 2>/dev/null || echo "无数据")</pre>
            </div>

            <!-- 子域名 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800"><i class="fas fa-sitemap mr-2"></i>子域名</h2>
                <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-60">$(cat "$output_dir/subdomains.txt" 2>/dev/null || echo "无数据")</pre>
            </div>

            <!-- JavaScript分析 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800"><i class="fab fa-js mr-2"></i>JavaScript分析</h2>
                <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-60">$(cat "$output_dir/js_analysis.txt" 2>/dev/null || echo "无数据")</pre>
            </div>
        </div>
    </div>
</body>
</html>
EOL

    # 扫描完成提示
    echo "\n${GREEN}[+] 扫描完成！${NC}"
    echo "${GREEN}[+] 结果保存在: $output_dir ${NC}"
    echo "${GREEN}[+] 可以打开 $output_dir/report.html 查看完整报告${NC}"
}

# 主程序入口
main() {
    show_banner
    check_dependencies

    # 主循环：接受用户输入并执行扫描
    while true; do
        echo "\n${YELLOW}请输入要扫描的网站域名 (输入 'q' 退出):${NC}"
        read -p "> " target

        # 处理退出命令
        if [ "$target" = "q" ]; then
            echo "\n${GREEN}感谢使用！再见！${NC}"
            exit 0
        fi

        # 验证输入不为空
        if [ -z "$target" ]; then
            echo "${RED}错误: 请输入有效的域名${NC}"
            continue
        fi

        # 执行扫描
        run_scan "$target"
        echo "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        read -p "按回车键继续..."
    done
}

# 启动程序
main
