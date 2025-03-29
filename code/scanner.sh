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
            echo -e "${RED}错误: 未找到 $tool。请先安装必要工具。${NC}"
            exit 1
        fi
    done
}

# 显示横幅
show_banner() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}                网站安全扫描工具                ${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 主扫描函数
run_scan() {
    local url=$1

    echo -e "\n${YELLOW}[*] 开始扫描目标: $url ${NC}\n"

    echo -e "${GREEN}[+] 正在进行连通性测试...${NC}"
    ping -c 3 "$url"

    echo -e "\n${GREEN}[+] 获取HTTP头信息...${NC}"
    curl -I "$url"

    echo -e "\n${GREEN}[+] 正在扫描开放端口...${NC}"
    nmap -p- --min-rate=1000 -T4 "$url" | grep open

    echo -e "\n${GREEN}[+] 识别Web技术...${NC}"
    whatweb "$url" -v

    echo -e "\n${GREEN}[+] 查找子域名...${NC}"
    subfinder -d "$url"
}

# 主程序
main() {
    show_banner
    check_dependencies

    while true; do
        echo -e "\n${YELLOW}请输入要扫描的网站域名 (输入 'q' 退出):${NC}"
        read -p "> " target

        if [ "$target" = "q" ]; then
            echo -e "\n${GREEN}感谢使用！再见！${NC}"
            exit 0
        fi

        if [ -z "$target" ]; then
            echo -e "${RED}错误: 请输入有效的域名${NC}"
            continue
        fi

        run_scan "$target"
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        read -p "按回车键继续..."
    done
}

main
