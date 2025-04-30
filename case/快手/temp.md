grep -r -E "(api_key|apiSecret|password|token|private_key|client_secret|access_key)" ./smali*

grep -r -n "api_key" ./smali*
grep -r -n "apiSecret" ./smali*
grep -r -n "password" ./smali*
grep -r -n "token" ./smali*
grep -r -n "private_key" ./smali*
grep -r -n "client_secret" ./smali*
grep -r -n "access_key" ./smali*
grep -r -n "aws" ./smali*
grep -r -n "stripe" ./smali*
grep -r -n ".env" ./smali*


./smali_classes13/com/yxcorp/plugin/activity/login/WeChatSSOActivity.smali:1162: const-string v1, "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s"


Java.perform(() => {
const StringBuilder = Java.use("java.lang.StringBuilder");

    StringBuilder.toString.implementation = function () {
        const result = this.toString();
        if (result.includes("access_key")) {
            console.log("🔥 Intercepted query string:", result);
        }
        return result;
    };

});





以下是规范化的中文版 APK 元数据表格（Markdown 格式）：

| 字段             | 值                               |
| ---------------- | -------------------------------- |
| **版本号**       | 13.3.41.41640 (41640)            |
| **支持语言**     | 1 种                             |
| **包名**         | com.smile.gifmaker               |
| **下载量**       | 154 次                           |
| **文件大小**     | 128.23 MB (134,456,598 字节)     |
| **安装位置**     | 支持外部存储                     |
| **最低安卓版本** | 5.0 (Lollipop, API 21)           |
| **目标安卓版本** | 11 (API 30)                      |
| **处理器架构**   | arm64-v8a (64 位 ARM)            |
| **屏幕 DPI**     | 通用适配(nodpi)                  |
| **签名算法**     | MD5/SHA-1/SHA-256                |
 