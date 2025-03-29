#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查依赖工具
check_dependencies() {
    local tools=("nmap" "whatweb" "subfinder")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &>/dev/null; then
            echo "${RED}错误: 未找到 $tool。请先安装必要工具。${NC}"
            exit 1
        fi
    done
}

# 显示横幅
show_banner() {
    clear
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "${GREEN}                网站安全扫描工具                ${NC}"
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 主扫描函数
run_scan() {
    local url=$1
    local output_dir="scan_results_$(date +%Y%m%d_%H%M%S)"

    mkdir -p "$output_dir"
    echo "\n${YELLOW}[*] 开始扫描目标: $url ${NC}\n"
    echo "${YELLOW}[*] 扫描结果将保存在: $output_dir ${NC}\n"

    echo "${GREEN}[+] 正在进行连通性测试...${NC}"
    ping -c 3 "$url" | tee "$output_dir/ping.txt"

    echo "\n${GREEN}[+] 获取HTTP头信息...${NC}"
    curl -I -L -k -s \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
        "$url" | tee "$output_dir/headers.txt"

    echo "\n${GREEN}[+] 正在扫描开放端口...${NC}"
    nmap -p- --min-rate=1000 -T4 "$url" | grep "open" | tee "$output_dir/ports.txt"

    echo "\n${GREEN}[+] 识别Web技术...${NC}"
    whatweb -v "$url" | tee "$output_dir/technologies.txt"

    echo "\n${GREEN}[+] 查找子域名...${NC}"
    subfinder -d "$url" | tee "$output_dir/subdomains.txt"

    echo "\n${GREEN}[+] 检查敏感文件...${NC}"
    sensitive_files=(
        "/.env"
        "/.git/config"
        "/.svn/entries"
        "/.hg/hgrc"
        "/.bzr/branch/branch.conf"
        "/.DS_Store"
        "/wp-config.php"
        "/config.php"
        "/database.yml"
        "/credentials.json"
        "/backup.sql"
        "/dump.sql"
        "/.htaccess"
        "/robots.txt"
        "/sitemap.xml"
        "/.well-known/security.txt"
    )

    {
        echo "# 敏感文件扫描结果 - $(date '+%Y-%m-%d %H:%M:%S')"
        echo "# 目标: $url\n"

        for file in "${sensitive_files[@]}"; do
            echo "正在检查: $file"
            response=$(curl -L -k -s -o /dev/null -w "状态码: %{http_code}\n大小: %{size_download} bytes\n响应时间: %{time_total}s\n" "$url$file")

            if [[ $response != *"状态码: 404"* ]]; then
                echo "----------------------------------------"
                echo "发现文件: $file"
                echo "$response"
                echo "文件内容:"
                curl -L -k -s "$url$file"
                echo "\n----------------------------------------\n"
            fi
        done
    } | tee "$output_dir/sensitive_files_report.txt"

    echo "\n${GREEN}[+] 扫描完成！结果保存在: $output_dir ${NC}"
}

# 主程序
main() {
    show_banner
    check_dependencies

    while true; do
        echo "\n${YELLOW}请输入要扫描的网站域名 (输入 'q' 退出):${NC}"
        read -p "> " target

        if [ "$target" = "q" ]; then
            echo "\n${GREEN}感谢使用！再见！${NC}"
            exit 0
        fi

        if [ -z "$target" ]; then
            echo "${RED}错误: 请输入有效的域名${NC}"
            continue
        fi

        run_scan "$target"
        echo "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        read -p "按回车键继续..."
    done
}

main
