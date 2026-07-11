# Bug Bounty Journal — 完整重写计划

## 概述

将 Vue 3 webapp 从"好看但空洞"升级为"内容完整 + 体验专业 + 可部署到 GitHub Pages"的生产级应用。

核心原则：**所有内容在一页内完整展示，不依赖外部链接，不偷工减料。**

---

## 当前状态分析

### 内容差距

| 案例 | 格式 | 完整度 | 主要缺失 |
|------|------|--------|---------|
| cnvd-2026-13173 (QuestDB) | NEW | 完整 | 仅缺 cvss 字段 |
| myjpj-data-leak | OLD | 内容丰富但格式有问题 | 善意声明无法被识别（OLD 格式）|
| cyart-env-leak | OLD | 较完整 | 缺善意声明、结论 |
| kuaishou-api-leak | OLD | 较完整 | 缺善意声明、结论、CVSS |
| zeric-source-leak | OLD | 中等 | 修复建议中混入 Dart 代码（错误）|
| plugshare-api-leak | OLD | 中等 | 缺 Python/C++ PoC、子域名列表 |
| zus-coffee-leak | OLD | 中等 | 缺 Frida 脚本、环境变量、WordPress 泄露 |

### UX 问题

1. **"查看原始报告"按钮** — 用户要求移除，所有内容必须在一页内
2. **OLD 格式案例无法使用富内容** — 没有 table、info-box、impact-grid、conclusion 等
3. **MYJPJ 善意声明检测失败** — `benevolenceContent` 只识别 NEW 格式的 info-box
4. **OLD 格式代码块无复制按钮** — 只有 NEW 格式才有
5. **图片资源全部未使用** — 20+ 张截图/PDF/日志未被引用

### 构建问题

1. `vite.config.ts` 缺少 `base: '/bug-bounty-journal/'`
2. 路由使用 `createWebHistory`，GitHub Pages 需要 hash 模式或特殊处理
3. 缺少 `.nojekyll` 文件
4. `assets/` 目录的图片未复制到 `webapp/public/`

---

## 修改计划

### 阶段一：构建配置与 GitHub Pages 部署

#### 1.1 修改 `webapp/vite.config.ts`
- 添加 `base: '/bug-bounty-journal/'`
- 确保构建输出到 `dist/`

#### 1.2 修改 `webapp/src/router/index.ts`
- 将 `createWebHistory` 改为 `createWebHashHistory`（GitHub Pages 不支持 SPA fallback）
- 或保持 `createWebHistory` 但添加 `import.meta.env.BASE_URL` 作为 base

#### 1.3 创建 `webapp/public/.nojekyll` 空文件
- 防止 GitHub Pages 用 Jekyll 处理 `_` 开头的文件

#### 1.4 复制静态资源到 `webapp/public/assets/`
- 将 `assets/` 目录下的所有图片复制到 `webapp/public/assets/`
- 将 `case/快手/` 下的截图复制到 `webapp/public/assets/kuaishou/`
- 将 `hacking/assets/` 下的图片复制到 `webapp/public/assets/hack/`

#### 1.5 创建 GitHub Actions 部署工作流
- `.github/workflows/deploy.yml` — 自动构建并部署到 GitHub Pages

---

### 阶段二：移除"查看原始报告"功能

#### 2.1 修改 `webapp/src/views/CaseDetailView.vue`
- 删除 `hero-right` 区域中的 `pdf-download-btn`（"查看原始报告"按钮）
- 删除 `hero-right` 区域中的 `back-list-btn`（"返回案例列表"按钮）
- 将 `back-btn` 移到 hero 区域顶部，作为唯一的返回入口
- 删除 `hero-right` div 及其内容
- 将 `hero-content` 从双栏改为单栏

---

### 阶段三：迁移所有案例数据到 NEW 格式

这是工作量最大的部分。将 6 个 OLD 格式案例逐个迁移到 `contents` 数组格式，同时补充原始 HTML 中存在但 Vue 中缺失的内容。

#### 3.1 `myjpj-data-leak` (MYJPJ — critical)
- 将善意声明改为 NEW 格式 info-box（修复 benevolenceContent 检测）
- 补充原始 HTML 中的 17 字段个人信息暴露矩阵（当前只有 12 项）
- 补充安全审计清单（日志安全、数据安全、网络安全 3 大类）
- 补充 CVE-2021-3129 分析
- 添加图片引用（4 张截图路径）
- 添加 conclusion 章节

#### 3.2 `cyart-env-leak` (Cyart.net — high)
- 添加善意声明
- 补充完整的攻击方式代码块（mysql 命令、redis-cli 命令、Python smtplib 钓鱼示例）
- 补充 Apache/Nginx 修复配置代码
- 补充时间线信息
- 补充参考资料链接
- 添加 conclusion 章节

#### 3.3 `kuaishou-api-leak` (快手 — high)
- 添加善意声明
- 补充完整的应用信息表格（11 字段）
- 补充 mermaid 风险链图（转换为 impact-grid 或文字描述）
- 补充 API 测试结果详情（6 个 API 测试）
- 补充 smali 代码示例
- 添加 conclusion 章节
- 补充 CVSS 评分

#### 3.4 `zeric-source-leak` (Zeric — high)
- 添加善意声明
- 补充服务器信息表（LiteSpeed/立陶宛/IP/Hostinger）
- 补充子域名分析表（4 个子域名）
- 补充安全头部分析
- 补充 Cookie 安全性表
- 补充 4 张证据截图引用
- **修复：删除修复建议中的 Dart/Flutter 代码**，替换为 PHP/Laravel 的修复方案
- 添加 conclusion 章节
- 补充 CVSS 评分

#### 3.5 `plugshare-api-leak` (PlugShare — high)
- 添加善意声明
- 补充 Python 自动化扫描脚本
- 补充 C++ libcurl PoC 代码
- 补充 28 个子域名列表
- 补充 NMAP 端口扫描命令
- 补充影响范围分析
- 添加 conclusion 章节
- 补充 CVSS 评分

#### 3.6 `zus-coffee-leak` (ZUS Coffee — high)
- 添加善意声明
- 补充 Frida 动态分析脚本（JavaScript 代码）
- 补充环境变量泄露详情（.env.prod/.env.staging/.env.dev）
- 补充 100+ Dart 源文件路径列表
- 补充 API 路径搜索结果
- 补充敏感数据汇总表（8 类密钥）
- 补充 WordPress 用户数据泄露
- 补充 7 个工具列表
- 添加 conclusion 章节
- 补充 CVSS 评分
- 修正可疑日期

---

### 阶段四：UX 修复与前端设计优化

#### 4.1 修改 `CaseDetailView.vue`
- 移除 `originalUrl` 相关的所有代码和模板
- 确保 OLD 格式的善意声明也能被检测（在 `benevolenceContent` 中增加 body 文本匹配）
- 确保 OLD 格式的代码块也有复制按钮
- 为 OLD 格式添加 table 和 impact-grid 渲染支持（但理想情况下所有案例都会迁移到 NEW 格式）
- 添加图片渲染支持（`<img>` 标签，使用 `contents` 中的 `image` 类型）
- 优化代码块样式
- 确保 Prism.js 高亮在路由切换后重新执行

#### 4.2 扩展 `ReportContent` 类型
- 在 `Case.ts` 中添加 `image` 内容类型：
  ```typescript
  | { type: 'image'; src: string; alt?: string; caption?: string }
  ```

#### 4.3 修改 `CaseDetailView.vue` 渲染逻辑
- 添加 `image` 类型的渲染分支
- 图片使用 lazy loading + 点击放大

#### 4.4 优化 `case-detail.css`
- 图片样式（圆角、阴影、caption）
- 确保所有内容类型在不同屏幕尺寸下表现良好

---

### 阶段五：首页与数据修正

#### 5.1 修改 `HomeView.vue`
- 将 `heroStats` 中的 `50+` 改为实际案例数 `7`

#### 5.2 确保 QuestDB 案例补充 `cvss` 字段
- 在 `cases.ts` 中为 `cnvd-2026-13173` 添加 `cvss: 8.6`

---

## 验证步骤

1. `npx vue-tsc --noEmit` — TypeScript 零错误
2. `npx vite build` — 构建成功
3. 检查 `dist/` 目录结构是否正确（包含 assets/ 图片）
4. 本地 `npx vite preview` 验证所有案例页面
5. 逐个检查每个案例的内容完整性：
   - 善意声明是否显示在顶部
   - 所有章节是否完整
   - 代码块是否有语法高亮和复制按钮
   - 图片是否正确显示
   - 表格是否正确渲染
6. 检查 GitHub Pages 部署配置是否正确

---

## 假设与决策

1. **路由模式**：使用 `createWebHashHistory` 而非 `createWebHistory`，因为 GitHub Pages 不支持 SPA fallback。虽然 URL 中有 `#`，但确保所有路由可用。
2. **图片路径**：所有图片从 `webapp/public/assets/` 提供，路径格式为 `/bug-bounty-journal/assets/xxx.png`。
3. **内容完整性**：以原始 HTML 报告为唯一数据来源，不创造新内容，只搬运和格式化现有内容。
4. **不删除案例**：保持 7 个案例不变，不新增 QuestDB 第二个报告（CVSS 9.8）作为独立案例（它已作为 blog 文章存在）。
5. **前端设计**：保持现有"魔童哪吒"火焰主题，不做颠覆性视觉改变，重点是内容完整和 UX 修复。
