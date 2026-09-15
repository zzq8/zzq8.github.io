# OpenSpec / SDD / TDD 社区调研笔记

> 调研时间：2026-09-03
> 来源：V2EX、linux.do 真实讨论帖（2025-10 ~ 2026 年中）
> 背景：评估 OpenSpec 这类 Spec-Driven Development（SDD）工具是否值得引入，以及与 Claude Code Plan Mode、TDD 的关系

---

## 一、OpenSpec vs Claude Code Plan Mode

两者定位不同，不是竞争关系：

| 维度 | Claude Code Plan Mode | OpenSpec |
|---|---|---|
| 层面 | CC 内置的执行前计划步骤 | 独立的规格管理工作流（CLI + 目录约定） |
| 持久化 | 否，计划留在会话内，不落盘 | 是，`openspec/` 目录进仓库 |
| 评审对象 | 执行计划（做什么、怎么做） | 规格/需求变更（spec delta + tasks） |
| 工具绑定 | 仅 Claude Code | 工具无关（CC / Cursor / Codex 等） |
| 适用场景 | 日常小任务快速对齐 | 跨会话、多人协作、需求演进、知识沉淀 |

**关系**：可以配合使用——OpenSpec 管需求与规格沉淀（记忆层），Plan Mode 管实现前的具体执行计划。OpenSpec 的提案批准后，实现阶段照样可以进 Plan Mode。

---

## 二、V2EX 社区观点

### 正面案例

**《如何用 AI + OpenSpec 驱动团队迭代开发》**（2026-01，[t/1183088](https://www.v2ex.com/t/1183088)）

- 团队把 OpenSpec 当"项目大脑"：AI 先读 AGENTS.md → project.md → docs/ 索引，再干活
- 变更驱动流程：需求变更 → OpenSpec 提案（人工审 Why/What/Impact）→ AI 实现 → Code Review → `openspec archive` 归档沉淀
- 解决的痛点：AI 进大微服务项目"降智"、上下文开盲盒、隐性知识无法传承

**评论区质疑**（很有代表性）：

- *"单人开发还是太笨重"* —— OpenSpec 更适合团队作战
- *"团队 merge 时 specs 冲突，大项目攒几百个 specs 怎么管理？"* —— 作者答：定期梳理核心 spec、删除无用文件、按服务拆分 spec

### 争议焦点帖

**《大项目中大家真的会用 Spec-Driven Development 吗？》**（2026-04，48 回复，[t/1208418](https://www.v2ex.com/t/1208418)）

楼主用 OpenSpec 的四个不顺手：

1. 生成的 proposal/design 多是**"正确的废话"**，人 Review 找不到重点
2. AI 特定的 bug 写回给人看的 spec，感觉 tricky
3. 严格走 spec 流程 + bug 修复，总耗时不如 **Plan Mode + 少量提示词**，还不用操心文档与代码对不上
4. 有人遇到 spec delta 合并对不上的问题

回帖流派分布：

| 流派 | 代表观点（原话摘录） |
|---|---|
| **TDD 派**（声势最大） | "SDD 出来的 spec 都是看起来很美，实际代码跟 spec 有差距，**必须 TDD 不让项目跑偏**"；"AI 生成的 spec 腐化太快，但 test 是死的，跑不过就是跑不过"；实践：AI 先写 test suite → 另一个 session（最好换模型）写实现，相互约束 |
| **轻量派** | "Plan Mode 和 superpowers 算是轻量单次 SDD，思想是对的"；"强行用工程化手段约束模型是工程师的一厢情愿" |
| **弃用派** | "用过 openspec，太啰嗦太麻烦，**就不是给人读的**"；"spec 就是垃圾，既不易维护又不能精准描述行为，测试用例+简单文档就能替代"；"不如 Type driven" |
| **务实肯定派**（少数） | "用起来还好，维护真的爽，**认知卸载**"；跨团队丢 spec 文档省事，联调谁和文档对不齐谁去修 |
| **效能下降派** | "部门在推 SDD，对比 vibe coding 效能反而下降，多次 clarify + 反复 review 很痛苦" |

高级用法经验（正方深耕者，但也承认"治理太重"）：

- OpenSpec 当 spec 基座/记忆层，按需提取 ADR（架构决策记录）形成稳定判例
- 用 `openspec/config.yaml` 对工件生成加硬约束（如 design.md 禁止出现具体代码，防影子代码）
- 需求过大先切原子化需求再探索收敛
- archive 合并 main spec 后容易越堆越多，**形成治理债务**，要人工筛选

### 关键风向：OpenAI 的示范

有人引用 OpenAI《Harness Engineering》（[InfoQ 中文版](https://www.infoq.cn/article/C2fWkH2EgBlDPNUNlcZX)）：

- **Codex 团队现在需要 spec 的地方已经非常少**，只在多人协调或复杂决策时写
- 即使写，spec 也很短——"10 个要点就完了"，其余靠 Plan + 完整测试/静态校验基建
- 注意前提：那套环境有 100% 测试覆盖、充分静态检查等 harness 配套，普通人项目不具备
- 一派观点认为这是"spec 粒度变粗"而非"spec 不重要了"

---

## 三、linux.do 社区观点

整体比 V2EX 更泼冷水（MVP / vibe coding 人群为主）：

- **《OpenSpec 通过规范驱动开发...达成目标一致》**（2025-10，[t/1052896](https://linux.do/t/topic/1052896)）：介绍帖，反应平淡，热评是 *"开源的 kiro？"*，有人表示在用竞品 spec-kit
- **《有人用过 openspec 吗》**（2025-11，[t/1067278](https://linux.do/t/topic/1067278)）：*"spec 应该是没啥浪花了，流行了几天"*
- **《【暴论】不要盲目的使用 spec 规范驱动开发或者 mcp 多 ai 协同开发》**（2025-12，34 赞，[t/1241813](https://linux.do/t/topic/1241813)）火力最猛：
  - 实测结论："全是瞎折腾：上下文污染、幻觉积累、过度设计，全是 MVP 的阻碍"
  - 成本：一天搞出 2000 行跑不通的文档；一轮 OpenSpec/多 AI 协作对话半小时；烧了 $20 生成废物文档
  - 核心论点：**"报错驱动 > spec 驱动"**——能成功运行的信息/报错信息含金量最高，是对 AI 幻觉最直接的惩罚和修正；spec 看起来信息量大，其实全是没验证过的"废话"（熵增）
  - 反方反驳（值得注意）："MVP 恰恰需要规范驱动——MVP 后期都要添砖加瓦，Schema/组件/架构没定好，后期 AI 接手时会越来越歪。spec 是屎的根本原因是没逐条审，说到底看人类自己的架构能力"
- **《如何评价 SDD》**（2026-01，[t/1437887](https://linux.do/t/topic/1437887)）：中肯评价——"**Spec 至少充当了 Prompt 优化**"，适合 prompt 写得杂乱的人
- **OpenSpec 与 Plan 模式是否二选一**（2026-04，[t/1915702](https://linux.do/t/topic/1915702)）：常见困惑，见本文第一节的定位区分
- **生态活跃度**：衍生项目不少，如 [opsx-turbo](https://linux.do/t/topic/2282317)（OpenSpec + CC 并行 Agent workflow）、SuperSpec（OpenCode 上的 OpenSpec 实现），说明仍有一批深度用户在投入

---

## 四、SDD vs TDD：核心争论

| 维度 | SDD（spec 先行） | TDD（测试先行） |
|---|---|---|
| 本质 | 自然语言契约，定义"做什么" | 可执行代码，验证"做对了吗" |
| 强项 | 对齐意图、需求追溯、团队协作、知识沉淀 | 硬约束、不腐化漂移、防幻觉 |
| 弱点 | spec 会腐烂漂移（"规定越多，漂移越多"）、不可执行、维护成本高 | 测试覆盖不全照样飞；AI 写的测试本身可能错或覆盖不全 |
| 失效模式 | 文档与代码两张皮、spec 无人遵守 | 测试腐化、为过测试而写测试 |

社区主流结论是**融合而非对立**：

1. **STDD（Spec + Test 双驱动）**实践开始出现：spec 管意图与边界，test 管验收与约束。典型流程：需求 → 简明 spec → AI 写 test suite → 新 session（换模型）写实现 → 测试不通过即不通过
2. **spec 的正确粒度**：别狭隘理解，PRD、TSD、ER 模型、测试用例都是 spec——"往协议上想"，粒度应粗、应纲领性（牵一发发动全身的材料），而非事无巨细的 AI 会话产物
3. **文档要"人类优先"**：人能看懂的 AI 才可能看懂；废话连篇只有 AI 读得下去的 spec，"本质上和混淆过的 js 代码一样"，只会让人类丧失掌控力

---

## 五、综合结论与建议

**一句话总结**：两个社区对 OpenSpec 的态度高度一致——**理念认可、工具嫌重**。spec 先行的思想没错，但重型工具化流程在单人/小项目场景性价比低，且 spec 文档本身的腐化与维护成为新债（复杂度只会转移不会消失）；TDD 因为"测试是可执行的、不会漂移"被视为更可靠的落地锚点。

**场景建议**（社区实践收敛出的最大公约数）：

| 场景 | 建议路线 |
|---|---|
| 单人 / 小项目 / MVP 探索 | Plan Mode + 报错驱动迭代，别上重型 SDD |
| 团队 / 长周期 / 多工具协作 | 轻量 spec（手写、简明、人类优先）+ TDD + 定期梳理，或谨慎用 OpenSpec 但接受治理成本 |
| AI 深度接管的项目 | 学 OpenAI harness 路线：短 spec 要点 + 100% 测试覆盖 + 静态检查 + 完整验证基建 |

**趋势判断**（截至 2026 年中）：SDD 工具热度较 2025 年底高峰明显降温；轻量规划（Plan Mode / superpowers / skills）+ TDD + 强验证，是实践者收敛出的主流方向。

---

## 附：主要参考帖

- V2EX：《如何用 AI + OpenSpec 驱动团队迭代开发》 https://www.v2ex.com/t/1183088
- V2EX：《大项目中大家真的会用 Spec-Driven Development 吗？》 https://www.v2ex.com/t/1208418
- V2EX：《OpenSpec 功能详解》 https://www.v2ex.com/t/1186934
- linux.do：OpenSpec 介绍帖 https://linux.do/t/topic/1052896
- linux.do：《【暴论】不要盲目的使用 spec 规范驱动开发》 https://linux.do/t/topic/1241813
- linux.do：《如何评价 Spec-Driven Development》 https://linux.do/t/topic/1437887
- linux.do：OpenSpec 使用问题（vs Plan 模式） https://linux.do/t/topic/1915702
- OpenAI Harness Engineering 报道（InfoQ 中文） https://www.infoq.cn/article/C2fWkH2EgBlDPNUNlcZX
