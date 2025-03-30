#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 清屏函数
clear_screen() {
    clear
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "${GREEN}              漏洞赏金平台导航              ${NC}"
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 主菜单
show_menu() {
    echo "\n${CYAN}可用平台:${NC}"
    echo "${PURPLE}1.${NC} 百度安全应急响应中心 (BSRC)"
    echo "${PURPLE}2.${NC} 国家信息安全漏洞共享平台 (CNVD)"
    echo "${PURPLE}3.${NC} 上饶满星科技漏洞库"
    echo "${PURPLE}4.${NC} InfoQ 安全专栏"
    echo "${PURPLE}0.${NC} 退出\n"
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 打开URL函数
open_url() {
    case $1 in
    1) open "https://bsrc.baidu.com/v2/?language=zh" ;;
    2) open "https://www.cnvd.org.cn/" ;;
    3) open "https://www.ctkqiang.xin/bug-bounty-journal/" ;;
    4) open "https://www.infoq.cn/profile/D8F52F2F08DB46" ;;
    *) echo "${RED}无效选择${NC}" ;;
    esac
}

# 主循环
while true; do
    clear_screen
    show_menu
    read -p "请选择平台 (0-4): " choice

    if [ "$choice" = "0" ]; then
        echo "\n${GREEN}感谢使用！再见！${NC}"
        exit 0
    fi

    open_url $choice
    read -p "按回车键继续..."
done
