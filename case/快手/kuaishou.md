```
<meta-data 
    android:name="com.baidu.lbsapi.API_KEY" 
    android:value="UEnH61ElxrwvKKBOA6oTgio7"/>

<meta-data 
    android:name="com.coloros.ocs.camera.AUTH_CODE" 
    android:value="ATBEAiBlu2AMxWd3cbaDkGXBlGP9ojLOanK26swRCrx8kOhedQIgMrU1ySPRc8VudROsZzGCX+9FdGHFzKsxNK7wTXs7EQ5xU+ypfAAAAA=="/>

<meta-data 
    android:name="com.coloros.ocs.olk.AUTH_CODE" 
    android:value="ATBGAiEA13a94ZZ+9ScjSIFyINJKOZzMH+dxxYwvFEsXG6/C1EYCIQDsk3VJQw1yuumBy8MmpVDIij7kqiQK3KEKU5DUE+BaGm3GSt38AAAA"/>

<meta-data 
    android:name="com.coloros.ocs.hyper.AUTH_CODE" 
    android:value="ATBEAiBJNHhwZ0FWIadgsHfFx1oB0BXsLZ9mxrmQc4L/hbAgWwIgPWNKxfYUT/5mFlXVTnn4RAEzHqaPX6Y1fTS1PeG4fQdokG/xYAAAAA=="/>

<meta-data 
    android:name="com.oplus.ocs.card.AUTH_CODE" 
    android:value="ADBFAiEA7tcO65jxF48sKrZjVHgP1bNOxAvgTvpUt2wdpw33o5ACIEbYd9Jb/3VxPPTRDipl3uXbNpjmi0ysYP59kCcgA0J/bwme5Q==;ADBGAiEA3DQoBUXLi7Jgj9EkSzrDVZis1ipVO9hmPha0hPmnqOkCIQDRM07z+/ef/fk9ZC2X0d9NdN9YRiGfTrNBS5PunUUsqm8Jns0="/>

<meta-data 
    android:name="com.vivo.push.api_key" 
    android:value="a71e4cd2-3308-4f30-8cde-652d6ec3d7ce"/>

<meta-data
            android:name="com.amap.api.v2.apikey"
            android:value="d23a42abfdc38341aae4ad05e14a6aaa"/>
<meta-data
            android:name="TencentMapSDK"
            android:value="OLABZ-KGH35-CXVIJ-QSCSU-M5P6T-QJFSI"/>
<service android:name="com.amap.api.location.APSService"/>


```

[清理后关键信息分类]

1. 用户信息字段：

   - "user_id": 2558440500
   - "kwaiId": "cxj2638733"
   - "user_name": "明星图片推荐"
   - "user_sex": "M"
   - 头像地址：http://p2.a.yximgs.com/... (包含用户头像 CDN 地址)

2. 敏感参数：

   - wsSecret=fd799f558266cab0c2bf3af7f50a321a
   - txSecret=dce893d5b584234c19c522bb1b27f1b9
   - PLC_API 参数："feedLogCtx": "CkMxfDIwMDUwMTc0NDI5MjMzMjM5Njl8bGl2ZVN0cmVhbTpDd3BkUHRXU3BKUXx7InBnIjoiYnMifXx7InIiOjEyNjd9"

3. 服务配置：

   - CDN 地址：http://bd-origin.pull.yximgs.com
   - 直播推流地址：rtmp://aliyun-pull.voip.yximgs.com
   - 地图服务：Baidu_MAP_AK

4. 加密参数：

   - "ptp": "CgFDEgK0ARoCmAg=" (Base64 编码值)
   - "feedbackDetailParams": "H4sIAAAAAAAAAONiSioGALXCutMEAAAA" (压缩数据)

5. 业务特征值：
   - "exp_tag": "1_a/2005017442923323969_bs1267"
   - "serverExpTag": "feed_live|CwpdPtWSpJQ|81608222|1_a/2005017442923323969_bs1267"

[敏感字段标记建议]

1. 需要脱敏处理：

   - 所有包含 Secret 的参数 → ${SECRET_KEY}
   - 用户 ID → ${USER_ID}
   - CDN 地址 → ${CDN_ENDPOINT}

2. 需要加密存储：

   - 视频签名参数（wsSecret/txSecret）
   - Base64 编码的业务参数（ptp）

3. 建议移除的调试信息：
   - "feedSwitches": {"enablePlayerPanel": false}
   - "debug_flag": false

[安全建议]

1. 对敏感参数应使用 Android Keystore 加密存储
2. 避免在代码中硬编码 CDN 地址，建议使用动态配置
3. 用户身份信息需进行哈希处理（如 user_id→hash(user_id+salt)）
4. 直播推流地址应启用 HTTPS 加密传输
5. 定期轮换 API 签名密钥（wsSecret 应有有效期）

完整清理后的示例如下：

```json
{
"user": {
"user_id": "${ANONYMIZED_USER_ID}",
"kwai_id": "cxj2638733",
"display_name": "明星图片推荐",
"gender": "M",
"avatar": {
"cdn": "p2.a.yximgs.com",
"path": "/kimg/uhead/AB/...secured.heif",
"encryption": "AES-256-CBC"
},
"registration_date": "2021-10-25T19:00:00+08:00"
},

"media": {
"media_id": "5232338413606816997",
"type": "live_stream",
"urls": [
{
"protocol": "http",
"cdn": "bd-origin.pull.yximgs.com",
"path": "/gifshow/CwpdPtWSpJQ_mahevc670ec.flv",
"security": {
"wsSecret": "${ENCRYPTED_SECRET}",
"expire_time": 1647077763
}
}
],
"metadata": {
"resolution": "1080x1920",
"duration": 10626,
"bitrate": 600
}
},

"security": {
"api_keys": {
"baidu_map": "${ENCRYPTED_MAP_KEY}",
      "tx_secret": "${ENCRYPTED_TX_KEY}"
},
"encryption": {
"algorithm": "RSA-2048",
"public_key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
}
},

"analytics": {
"view_count": 1181326,
"engagement": {
"likes": 12584,
"shares": 78,
"comments": 1430
},
"tags": ["#杨幂", "#迪丽热巴"]
}
}

```
