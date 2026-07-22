import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

const timelineSections = [
  '一、2026 年 1H 工作总结',
  '二、2026 年 1H 重点工作',
  '三、亮点与不足分析',
  '四、2026 年 2H 工作计划',
];
const thanksHeading = '<h2 id="thanks-title">感谢与提名</h2>';

const segmentBlock = html.slice(html.indexOf('const SEGS = ['), html.indexOf('const N = SEGS.length'));
const kickers = [...segmentBlock.matchAll(/\{ k:'([^']+)'/g)].map(match => match[1]);
const chapterIndexes = timelineSections.map(section => kickers.findIndex(kicker => kicker.startsWith(section)));
const lastSegment = segmentBlock.slice(segmentBlock.lastIndexOf("{ k:'"));
const thanksStart = html.indexOf('<section id="thanks"');
const thanksBlock = html.slice(thanksStart, html.indexOf('</section>', thanksStart) + 10);

assert.equal(kickers.length, 23, 'unexpected timeline station count');
assert.deepEqual(chapterIndexes, [0, 1, 7, 14], 'timeline chapters must map to the planned positions');
assert.ok(kickers[Math.floor(kickers.length / 2)].startsWith(timelineSections[2]), 'highlights and shortcomings must occupy the timeline midpoint');
assert.ok(segmentBlock.match(/^const SEGS = \[\s*\{ k:'一、2026 年 1H 工作总结[^}]+build:'namecard'/), 'the first station must be the PD namecard');
assert.ok(kickers.at(-1).startsWith('时间轴结束'), 'the original finale must remain the last 3D station');
assert.ok(lastSegment.includes("build:'finale'"), 'the last 3D station must keep the finale builder');
assert.ok(!segmentBlock.includes(thanksHeading), 'thanks must not become another timeline station');
assert.ok(thanksStart > 0 && thanksBlock.includes(thanksHeading), 'thanks must render in a separate post-timeline view');

for (const text of [
  '机器人 MVP 原型', '指标语义平台', '支架装箱', '发电量预测', 'ChatBI',
  'TSC 监控平台与调试 APP', '电池护照系统', 'NVIDIA Isaac', '天玑 2.0',
]) assert.ok(html.includes(text), `missing report content: ${text}`);
for (const name of ['周新亚', '郭芳芳', '苏纪兵']) {
  assert.ok(thanksBlock.includes(name), `missing nominee in post-timeline view: ${name}`);
  assert.ok(!segmentBlock.includes(name), `nominee must not be stored in the 3D timeline: ${name}`);
}

const shortcomingsWithPlans = segmentBlock.match(/\{ k:'三、亮点与不足分析 · 不足[^}]+改善计划：[^}]+\}/g) || [];
assert.equal(shortcomingsWithPlans.length, 3, 'each shortcoming needs an improvement plan');
assert.ok(!html.includes('innerHeight * .8'), 'start action must not skip the PD namecard');
assert.ok(html.includes('clearTimeout(panelTimer)'), 'rapid navigation must cancel stale HUD updates');
assert.ok(html.includes("panel.classList.toggle('scroll-mode', i !== 0 && !SEGS[i].panel)"), 'PD namecard and chapter review intro must keep the original HUD panel');
assert.ok(html.includes("t:'阶段工作复盘', build:'mid', c:0x34d399, centered:true, panel:true"), 'chapter review intro must opt into the HUD panel');
assert.ok(html.includes("t:'下半年工作安排', build:'mid', c:0xa78bfa, centered:true, panel:true"), 'chapter plan intro must opt into the HUD panel');
assert.ok(html.includes("t:'汇报主体结束', build:'finale', c:0xfbbf24, centered:true, panel:true"), 'finale must opt into the HUD panel');
assert.ok(html.includes('if (i > 0 && !seg.panel)'), 'panel stations must not get a 3D scroll');
assert.ok(html.includes('function makeScroll(seg, idx)'), 'station copy must render as a 3D hanging scroll');
assert.ok(html.includes('paperGeo.translate(0, -H / 2, 0)'), 'scroll must unroll from the top downward');
assert.ok(html.includes('const scrollX = centered ? -5.2 : -side * 5.2'), 'scroll must anchor near the rail centerline, mirrored from the model');
assert.ok(html.includes('s.v += (target - s.open) * 55 * dt'), 'scroll unroll must use spring physics');

// 四类卷轴形制:1H 档案 / 亮点嘉奖 / 不足修缮 / 2H 蓝图
assert.ok(html.includes("seg.k.includes('· 亮点')"), 'scroll kind must be derived from the kicker');
assert.ok(html.includes('◆ ${seg.k} ◆'), 'highlight scrolls must carry diamond ornaments');
assert.ok(html.includes('x.setLineDash([8, 6])'), 'shortcoming scrolls must use dashed strokes');
assert.ok(html.includes('x.roundRect(px, tagY - 26, w, 52, 26)'), 'plan scrolls must use capsule tags');
assert.ok(html.includes("mix('#101a2c', seg.c"), 'scroll paper must tint toward the segment color');
const kindOf = k => k.includes('· 亮点') ? 'hi' : k.includes('· 不足') ? 'lo' : k.startsWith('四') ? 'p2h' : 'p1h';
const panelIdx = new Set([0, chapterIndexes[2], chapterIndexes[3], kickers.length - 1]);
const scrollKinds = kickers.filter((_, i) => !panelIdx.has(i)).map(kindOf);
assert.deepEqual(
  ['p1h', 'hi', 'lo', 'p2h'].map(kind => scrollKinds.filter(k => k === kind).length),
  [6, 3, 3, 7], 'scroll kinds must map to 6 1H projects, 3 highlights, 3 shortcomings, 7 2H plans');
assert.ok(html.includes('timelineMaxScroll()'), 'timeline and post-timeline scroll ranges must be independent');
assert.ok(html.includes('function updateThanksTransition(progress)'), 'thanks transition must be driven by scroll progress');
assert.ok(html.includes('smoothstep((progress - .08) / .72)'), 'timeline must crossfade into the thanks backdrop');
assert.ok(html.includes('smoothstep((progress - .28) / .55)'), 'thanks content must enter after the backdrop starts');
assert.ok(html.includes('thanks.style.backgroundColor'), 'thanks backdrop must blend with the 3D scene');
assert.ok(html.includes('thanksInner.style.transform'), 'thanks content must move continuously with scroll');
assert.ok(!html.includes('setThanksVisible(thanksProgress > .08)'), 'thanks transition must not use a binary reveal threshold');
for (const phrase of ['从蒸汽到智能', '开始旅程', '征途', '未完待续']) {
  assert.ok(!html.includes(phrase), `informal narrative remains: ${phrase}`);
}

const builderBlock = html.slice(html.indexOf('const builders = {'), html.indexOf('/* ================= 时间轴铺设'));
const availableBuilders = new Set([...builderBlock.matchAll(/^  (\w+)\(c\)/gm)].map(match => match[1]));
for (const [, builder] of html.matchAll(/build:'(\w+)'/g)) {
  assert.ok(availableBuilders.has(builder), `unknown builder: ${builder}`);
}
assert.ok(builderBlock.includes('new THREE.TorusGeometry(8, .3, 12, 80)'), 'finale ring geometry changed');
assert.ok(builderBlock.includes('const orb = sph(2.2'), 'finale orb geometry changed');

console.log('report structure verified');
