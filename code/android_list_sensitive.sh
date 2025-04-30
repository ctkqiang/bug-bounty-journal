#!/bin/bash

# 敏感变量列表 (国际通用 + 中国开发常见变体)
SENSITIVE_VARS=(
    # 基础凭证类
    "API_KEY" "API_SECRET" "SECRET_KEY" "AUTH_TOKEN"
    "AUTH_CODE" "CLIENT_SECRET" "ENCRYPTION_KEY" "PRIVATE_KEY"

    # 国际云服务
    "FIREBASE_KEY" "AWS_ACCESS_KEY" "STRIPE_SECRET" "GOOGLE_MAPS_KEY"
    "AZURE_TOKEN" "HEROKU_API_KEY" "S3_BUCKET_SECRET" "GITHUB_TOKEN"

    # 中国本地服务
    "WECHAT_APPID" "WX_API_KEY" "WEIXIN_SECRET"      # 微信
    "ALIPAY_PID" "ALIPAY_APPID" "ALIPAY_PRIVATE_KEY" # 支付宝
    "BAIDU_MAP_AK" "BDMAP_ACCESS_KEY"                # 百度地图
    "QQ_APPID" "QQ_SECRET"                           # QQ登录
    "DOUYIN_ACCESS_TOKEN" "DY_CLIENT_KEY"            # 抖音
    "TENCENT_CLOUD_SECRETID" "TC_COS_SECRETKEY"      # 腾讯云
    "TAOBAO_APPKEY" "TMALL_ACCESSTOKEN"              # 淘宝/天猫

    # 支付相关
    "PAYMENT_SECRET" "WALLET_PASSWORD" "BANK_CARD_TOKEN"
    "UNIONPAY_MERCHANT_KEY" "WEPAY_MCH_KEY"

    # 数据库配置
    "DB_PWD" "MYSQL_PASSWORD" "REDIS_AUTH" "MONGODB_CRED"

    # 安全机制
    "SSL_PINNING" "JWT_SECRET" "HMAC_KEY" "AES_IV"
    "RSA_PRIVATE" "CRYPTO_SALT" "SIGNATURE_KEY"

    # 开发调试配置
    "DEBUG_FLAG" "TEST_ENV_PASSWORD" "STAGING_DB_URL"
    "PROD_SWITCH" "INTERNAL_API_ENDPOINT"

    # 中文拼音/缩写变体
    "MIYAO" "MIMA" "SHOUQUANMA"          # 密钥/密码/授权码
    "YINYONGID" "FUWUQIDIZHI"            # 引用ID/服务器地址
    "ANQUANPEIZHI" "JIAOYANMA"           # 安全配置/校验码
    "SHANGHU_MIYAO" "YINGYONG_CHENGXUMA" # 商户密钥/应用程式码

    # 常见拼写错误变体
    "APY_KEY" "SCRET" "AUT_TOKEN" "PRIV_KEY"
    "ENCRYPTION_KEy" "CLIENTE_SECRETO"
)

# 漂亮版本：带颜色高亮显示
grep -n -i --color=auto "$(printf "%s\|" "${SENSITIVE_VARS[@]}" | sed 's/\\|$//')" AndroidManifest.xml
