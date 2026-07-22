# Handoff: 2026 年中述职 3D 场景页面

## 1. Session Context
- 日期: 2026-07-22
- 项目: `~/workspace/job_report` — 焦玉旻 2026 年中述职汇报页
- 版本控制: 无 git 仓库(纯本地单文件项目)
- 本次会话产出: 从零构建了 `index.html`(单文件 Three.js 3D 时间轴叙事页面),并完成 4 轮迭代修复/增强。

## 2. Decisions Made
- **单文件 + CDN**: 全部实现于 `index.html`,Three.js r160 经 jsdelivr ESM 引入,零构建、双击即开(ponytail 原则)。
- **叙事结构**: "从蒸汽到智能"四扇时代之门 → 每扇门对应一类工作(机械→机器人/支架,能源→发电量/电池护照,软件→指标语义/ChatBI/TSC,智能→AI 交汇),使历史线与述职内容论点化绑定,而非外挂装饰。
- **相机**: CatmullRomCurve3 沿 Z 轴时间轴(站间距 `GAP=55`),滚动驱动 + 帧率无关阻尼 + 鼠标视差;注视点 `getPointAt(t+0.035)` 偏向当前站一侧。
- **文图同步关键决策**: HUD 文案索引用**注视点 z 坐标**推算(`round(-lookAhead.z / GAP)`),而非相机位置——否则文案恒定滞后约半站(2026-07-22 已修复的 bug)。
- **中文 3D 字**: 不用 TextGeometry(中文 typeface.json 数 MB 无可靠 CDN),改用 16 层 canvas 纹理平面伪挤出 + `alphaTest:.15`,前层原色/背层暗色。
- **长标题**: `textSprite` 先 `measureText`,超 960px 自动缩字号,防裁切。

## 3. Current State
**已完成**(全部在 `index.html`,浏览器验证通过,`node --check` 语法通过):
- 21 个节点: 名片站(焦玉旻/AI与数据解决方案部/开发技术组/主任工程师,3D 字) → 序幕 → 4 时代之门 → 上半年 6 项目站(青色) → 年中站(金) → 下半年 7 项目站(紫色) → FINALE(含"回到起点"按钮闭环)
- 每站: 低多边形动态模型(机器人挥手/数据立方波浪/货箱堆垛/预测曲线/气泡/监控屏柱状图/电池/芯片/文档/手机图标轨道等) + 发光标题 sprite + HUD 文案面板(kicker/标题/描述/tags)
- 交互: 滚动飞行、鼠标视差、右侧导航点跳站、顶部进度条、封面"开始旅程"、终点"回到起点"
- 文案内容源自 `job.md`(2026 上下半年项目清单),集中在 `SEGS` 数组,改文案只动这一处

**未做(显式跳过,按需再加)**: GLTF 模型/贴图资产、音效、真几何中文字体、移动端深度适配(仅基础响应式)。

## 4. Next Steps(按优先级)
1. **现场试讲一遍**,记录每站停留节奏是否合适(可通过调整 `document.body.style.height = (N+2)*100vh` 的倍率控制滚动行程)
2. 如需投影/录屏演示: 考虑加自动播放模式(camera 自动前进,`setInterval` 驱动 scrollTo)
3. 如需分享: 单文件可直接发送;Three.js CDN 需联网,离线演示需把 three.module.js 下载到本地并改 import 路径
4. 用户可能的后续修改: 文案微调(改 `SEGS`)、换配色(每站 `c` 字段)、增删站点(改 `SEGS`,索引常量 `ERA_START/ERA_END/MID` 需同步)

## 5. Suggested Skills
- `karpathy-skills` + `ponytail`: 任何修改/修复(本文件结构简单,坚持手术式改动,勿重构)
- 视觉大修时: `design-taste-frontend`
- 改文案: 直接编辑 `SEGS` 数组即可,无需 skill

## 6. References
- 项目内容源: `job.md`(2026 上/下半年项目清单)
- 主交付物: `index.html`(`SEGS` 数组 = 全部叙事文案;`builders` = 全部 3D 模型建造者;`ERA_START/ERA_END/MID/LAST` = 布局索引常量)
- 无 PRD/ADR/commit(本地单文件项目)

## 7. Environment Notes
- 预览方式: `open index.html`(macOS),需联网加载 Three.js CDN
- 自检: `sed -n '/<script type="module">/,/<\/script>/p' index.html | sed '1d;$d' > /tmp/app.mjs && node --check /tmp/app.mjs`
- 已知边界: 相机路径两端各有 30/35 单位引入引出段;雾 `FogExp2(0.017)` 下相邻站隐约可见属预期
