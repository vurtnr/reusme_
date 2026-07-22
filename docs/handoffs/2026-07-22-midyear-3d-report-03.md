# Handoff: 2026 年中述职 3D 页面 —— 文案对齐与 3D 卷轴改造

## 1. Session Context
- 日期: 2026-07-22
- 项目: `~/workspace/job_report`
- 版本控制: 无 Git 仓库，纯本地单文件项目
- 本次目的: ① 感谢页 redesign（去文档编号、融入时间轴语言）；② 多轮 job.md 文案同步；③ 站点文案从 HUD 面板改造为 3D 挂轴（卷轴）。

## 2. Decisions Made
- **感谢页**：删除 `05`/`五、` 文档编号，标题改纯"感谢与提名"；排版复用节点 HUD 规格；名单改为竖直金色轨道+发光圆点（呼应 dots 导航与 3D 站点），按钮改实心金胶囊（同 `#again`）。
- **文案合并**:pdp 自评融入章节二 6 个站点描述；"软著申请"无独立自评，归入 06 TSC 站而非新增第 7 站（保 23 站结构与章节编号 `[0,1,7,14]`）。
- **3D 卷轴**（取代已拆除的两版 DOM 卷轴方案）：
  - 每站一个 `makeScroll(seg, idx)`：CanvasTexture(1024×1152) 绘制 kicker/标题/分隔线/自动换行正文/描线标签；卷面 `PlaneGeometry(7.2, 8.1)` pivot 在顶边（`paperGeo.translate(0, -H/2, 0)`），`scale.y`+纹理 `repeat/offset` 实现自上而下展开；金色上下轴杆，下轴杆随展开下落；±1.4° 悬挂轻摆。
  - 位置：模型水平镜像侧近中线 `scrollX = centered ? -5.2 : -side * 5.2`，`y=7.6`（卷底 −0.84 贴平台上方）。
  - 驱动：目标开合 `smoothstep((1 - |viewF - idx|) / .55)`（远闭、近开、滚过合）；弹簧 `k=55` + 阻尼 `exp(-9dt)`（ζ≈.6）；`reduceMotion` 下按距离二值开合。
  - `viewF` 提升为渲染循环外层 `let`，在 tickers 前赋值，卷轴 tick 闭包读取。
- **面板豁免机制**:`SEGS` 条目加 `panel:true` → 不挂卷轴且 `scroll-mode` 跳过，维持左下角 HUD 面板。当前豁免：PD 卡片（`i===0` 硬编码）、阶段工作复盘、下半年工作安排、汇报主体结束（finale，附带恢复末站"回到开场"按钮）。
- `#panel` 对所有站仍填充文案（屏幕阅读器文本），非面板站仅视觉隐藏；DOM 卷轴 `aria-hidden` 方案已完全移除。

## 3. Current State
- 已完成: 感谢页 redesign、1H pdp 自评合并、2H 计划对齐、ChatBI 文案同步、感谢名单更换（周新亚/郭芳芳/苏纪兵）、3D 卷轴全链路（建造器/镜像位/弹簧物理/面板豁免）。
- 已验证: `node test-report-structure.mjs` 通过；module script 过 `node --check`；DOM 卷轴残留 0 匹配。
- 未完成: 环境无 Chrome，卷轴的展开节奏、体量感、近距掠过是否挡视线均未人工验收；所有几何/物理参数是推算值。
- 无阻塞，无进行中修改。

## 4. Next Steps
1. 打开 `index.html` 逐站验收卷轴：展开/收卷时机（窗口 `1`/`.55`）、体量（`W/H 7.2×8.1`）、位置（`5.2`）、弹簧手感（`55`/`-9`）。
2. 重点检查：卷轴与模型/相机路径（weave ±2.5）的遮挡关系；移动端小字可读性；finale 面板与致谢页衔接。
3. 如某站也要恢复面板样式 → 给该站 `SEGS` 条目加 `panel:true`（机制已通用）。
4. 验收后建议写一份新 handoff 记录参数终值。

## 5. Suggested Skills
- `karpathy-skills`: 继续手术式局部修改（本会话全程未动相邻代码）。
- `ponytail`: 单文件、原生 CSS/Canvas、零新增依赖。
- `tdd`: 改滚动边界/开合逻辑前先更新 `test-report-structure.mjs` 断言（RED→GREEN，本会话已建立此模式）。
- `design-taste-frontend`: 卷轴视觉（卷面配色、轴杆、排版）再打磨时使用。

## 6. References
- [job.md](../../job.md): 述职内容源（含 pdp 自评，已全量同步）。
- [index.html](../../index.html): 主交付物；`makeScroll` 卷轴建造器、`panel:true` 豁免机制。
- [test-report-structure.mjs](../../test-report-structure.mjs): 无依赖 Node 静态行为检查（含卷轴结构/物理/豁免断言）。
- [handoff-02](./2026-07-22-midyear-3d-report-02.md): 结尾过渡机制（`updateThanksTransition`、`TIMELINE_PAGES`/`THANKS_PAGES`），本次未改。
- [handoff-01](./2026-07-22-midyear-3d-report-01.md): 页面整体结构与文案映射。

## 7. Environment Notes
- 预览: 直接打开 `index.html`，需联网加载 Three.js r160 CDN；无 dev server。
- 无 Git 仓库，禁止 Git 提交操作。
- 卷轴关键参数速查（都在 `index.html`）：位置 `5.2`、悬挂高 `7.6`、尺寸 `W=7.2 H=8.1`、开合窗口 `1`/`.55`、弹簧 `55`/`-9`。
