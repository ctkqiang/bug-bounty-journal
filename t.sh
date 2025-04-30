# 1) Grab the login page
curl -s https://pan.cstcloud.cn/web/login.html -o login_page.html

# 2) List all external scripts
grep -Eo '<script[^>]+src="[^"]+"' login_page.html \
  | sed -E 's/.*src="([^"]+)".*/\1/' > scripts.txt

# 3) Download each one
mkdir -p js
while read -r src; do
  # Normalize relative URLs
  url="https://pan.cstcloud.cn${src}"
  echo "[*] Fetching $url"
  curl -s "$url" -o "js/$(basename "$src")"
done < scripts.txt

