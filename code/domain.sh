# 组合多个域名及关键词搜索
query='site:*.cn OR site:*.com.cn OR site:*.net.cn OR site:*.org.cn OR site:*.gov.cn OR site:*.edu.cn OR site:*.bj.cn OR site:*.sh.cn OR site:*.gd.cn OR site:*.js.cn OR site:*.zj.cn OR site:*.sc.cn OR site:*.中国 OR site:*.公司 OR site:*.网络 OR site:*.政务 OR site:*.公益 OR site:*.xin OR site:*.ren OR site:*.网址 OR site:*.商标 OR site:*.在线 OR site:*.集团 OR site:*.hk OR site:*.mo filetype:env ("DB_PASSWORD" OR "API_KEY" OR "SECRET_KEY")'

# URL编码并调用Google搜索（需安装curl和jq）
encoded_query=$(echo "$query" | jq -sRr @uri)
curl -s "https://www.google.com/search?q=$encoded_query" | grep -oP 'https?://[^"]+' | uniq
