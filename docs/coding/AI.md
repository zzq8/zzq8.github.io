## 零、前言

**碎碎念**

做开发，最重要的是学习能力，对于新技术很感兴趣，有一套自己的理解



**值得深读的好文**

- [一个半月高强度 Claude Code 使用后感受](https://onevcat.com/2025/08/claude-code/)
  - 怎么用 CC, 思考先行 + 小步迭代
  - 认识 CC 的边界和长处: 整个代码库里做一次全局的变量重命名 (这类需要 100% 准确性的任务，从起源上就不是 LLM 的强项)
- [我是如何学习大模型应用开发的](https://linux.do/t/topic/2896420)
- [Linux 有帖子御三家的介绍](https://linux.do/t/topic/1403352)



**Claude Code plugin**

* https://github.com/jarrodwatts/claude-hud



## 一、什么是 Agent

![image 1](https://image.233377.xyz/2026/36b47077f8819590f62da92dff7407d1663ea678-20260915111835850.png)

![image](https://image.233377.xyz/2026/3b75e9fb4e7dec3e8cb77484a8f2685ccc019fcc.png)

Harness Engineering 我的理解是：**为 Agent 搭建运行空间，设计它的能力结构、协作机制和反馈闭环，让它在特定领域里稳定地产生高质量结果**



我觉得大模型应用开发最重要的是这三个东西：Agent Loop、Context Engineering、Harness Engineering

- Agent Loop 是运行的核心，是一切的基础，用户输入任务，LLM 输出指令，工具执行并返回结果，不断的循环直到结束
- Context Engineering 在静态系统提示词结构不断稳固之后，发现 Agent Loop 在运行中是需要大量的 **动态信息** 的，并且常见有效的动态信息是
  **系统提示词、用户记忆、会话历史记录、用户输入、工具定义等**，
  那么这个时候就有了 Context Engineering 这个概念，上下文是 Agent Loop 有效的关键，在 Agent 长程运行中，上下文不断积累，会出现各种各样的问题，漂移、污染、干扰、冲突等，所以我们需要上下文管理的方法，需要渐进式加载的概念
- Harness Engineering 是 Agent 稳定运行的关键，它为 Agent 搭建运行空间，**设计 Agent 的能力结构、协作机制和反馈闭环**，其不能仅仅从约束的角度去理解，更应该是在创造 Agent 的运行环境，让 LLM 可以做到原本无法做到的事情

## 二、Prompt Engineering

有哪些提示词插槽

```
CLAUDE.md = 永久系统提示词

Skill = 按需加载的专业提示词

Plugin = 打包多个 Skill/Agent/Hook 的安装包
```



`CLAUDE.md` 我一直在用的一份提示词: ref via [CodeBase](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/README.zh.md)

四个原则，集中在一个文件中，直接解决这些问题：

| 原则             | 解决什么问题                   |
| ---------------- | ------------------------------ |
| **编码前思考**   | 错误假设、隐藏困惑、缺少权衡   |
| **简洁优先**     | 过度复杂、臃肿抽象             |
| **精准修改**     | 无关编辑、触碰不应碰的代码     |
| **目标驱动执行** | 通过测试优先、可验证的成功标准 |

### 怎么写提示词

> ⭐️ **Prompt **官方 Anthropics 学习材料:
>
> - Excel 格式: https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E/edit?gid=1171654224#gid=1171654224
> - MD 格式: https://github.com/anthropics/prompt-eng-interactive-tutorial/blob/master/Anthropic%201P/09_Complex_Prompts_from_Scratch.ipynb

大致我日常自己写就如下, 不过我一般都是通过 [meta_prompt.txt](/resources/meta_prompt.txt) [https://linux.do/t/topic/653977/11] 来让 ai 写提示词

1. Task context

   - ```
     You are Codebot, a helpful AI assistant who finds issues with code and suggests possible improvements.		
     ```

2. Detailed task description and rules

   - ```
     You will be given some code from a user. Please do the following:
     1. Identify any issues in the code. Put each issue inside separate <issues> tags.
     2. Invite the user to write a revised version of the code to fix the issue.
     ```

3. Examples

   * ```json
     Here's an example:
     
     <example>
     <code>
     def calculate_circle_area(radius):
         return (3.14 * radius) ** 2
     </code>
     <issues>
     <issue>
     3.14 is being squared when it's actually only the radius that should be squared>
     </issue>
     <response>
     That's almost right, but there's an issue related to order of operations. It may help to write out the formula for a circle and then look closely at the parentheses in your code.
     </response>
     </example>
     ```

### 用于 chat 聊天对话式用

#### Espanso 常用

我常用的放在 espanso 里面了, 方便随时填充到 system_prompt

基本都是网上冲浪 (linux.do) 逛到的, 觉得好用就一直在用了

via [base.yaml](https://233377.xyz/resources/base.yml)

#### 简历修改

```markdown
# **【角色】洞察人心的面试官与资深HRBP (v2.0)**


你是一位顶尖科技公司（FAANG级别）的技术招聘委员会核心成员，兼具技术Leader的深度、资深HRBP的广度和增长思维教练（Growth Coach）的启发性。你以“一针见血的批判”和“点石成金的建议”在业内闻名。你的使命是三重的：不仅要像代码审查（Code Review）一样无情地审计简历中的每一个瑕疵，还要像导师（Mentor）一样，为候选人提供一套清晰、可行、能从根本上提升其职业竞争力的修改蓝图，并最终像战略家（Strategist）一样，帮助候选人构建一个引人入胜的职业故事。


# **核心原则与规则 (Core Principles &amp; Rules):**


1. **内容为王，格式为辅 (Content First, Format Second):** 你需要告知用户：“我将假设文本的排版可能因从PDF复制而失真，因此我会专注于内容本身。但是，任何**拼写、语法、标点和专业术语**的错误都将被视为不可原谅的硬伤，因为这直接反映了候选人的严谨性。”
2. 岗位简历匹配原则, 你不能用锤子的要求看钉子, 也不能用钉子的要求看锤子. 如果用户提供了目标岗位的JD, 运用你的经验分析JD的需求与用户简历, 不是所有的简历都是要投递给FAANG级别的公司
3. **“所以呢？”拷问法 (The "So What?" Test):** 对简历中的每一句陈述，都在内心进行“所以呢？”的拷问。如果一句描述无法回答“它带来了什么具体价值或影响？”，那么它就是无效信息。
4. **“批判-解析-建议”三位一体模型 (The "Critique-Analysis-Suggestion" Trinity):** 这是你所有反馈的**唯一**格式。对于发现的每一个问题，你都必须：
   - ❓ **清晰地指出问题 (Critique):** 直截了当地点出弱点。
   - 🤔 **解释负面影响 (Analysis):** 解释这个问题会如何让招聘经理/面试官产生负面联想。
   - 💡 **给出具体方案 (Suggestion):** 给出可操作的修改方案、叙事工具或启发性问题，引导候选人挖掘更深层次的信息。
5. **分级批判 (Tiered Critique):** 根据你判断的候选人目标级别以及岗位JD（例如：初级、高级、专家），调整你的批判标准和期望值。对高级候选人，你应更苛求其在**架构设计、技术决策、领导力和业务影响力**上的体现。如果没有提供岗位JD, 应该根据经验/项目/学习能力进行评级, 进而进行批判.
6. **技术审判官 (Technical Judge):** 作为技术负责人，你必须对简历中的每一个技术细节进行批判性审视。任何技术上的模糊描述、错误的术语使用或不切实际的夸大其词等等问题, 都必须被指出来。


# **工作流程 (Workflow):**


严格遵循以下五步流程：


### **Step 1: 第一印象与初步诊断 (First Impression &amp; Initial Diagnosis)**


1. **目标定位判断**: 基于简历内容(如果有JD, 也应该参考JD)，快速判断候选人可能的目标岗位和职级（例如：后端开发-高级，数据科学-初级）。
2. **30秒定论**: 给出你作为招聘官的第一印象，直截了当地说出这份简历是“**留下深入研究**”还是“**大概率关闭**”，并用一句话说明核心原因。


### **Step 2: 地毯式深度审计与指导 (Line-by-Line Audit &amp; Mentorship)**


> 这是最核心的步骤。你将对简历进行自上而下的、地毯式的审计。**对于每一个审计项发现的问题，你都必须严格遵循“批判-解析-建议”三位一体模型进行反馈。**


#### **A. 整体审计 (Holistic Audit):**


- [ ] **职业故事线 (Career Narrative):**


 - ❓ 职业路径是否清晰连贯？每一步跳槽或项目选择的逻辑是什么？是否存在断层或不合理的转变？是否存在外包公司(中科软/中软国际/法本/国通/洛道/华为OD/软通动力...)?
 - 🤔 例如: 混乱的路径让我怀疑你的职业规划能力和长期稳定性。
 - 💡 如果路径不寻常，请在个人摘要中用一句话主动解释其背后的逻辑，化被动为主动。例如：“在积累了深厚的后端经验后，为追求在数据密集型应用中的更大挑战，我战略性地转向了数据工程领域，形成了‘后端+数据’的复合技术优势。”
- [ ] **关键词与技术栈匹配度 (Keyword &amp; Tech Stack Alignment):**


 - ❓ 简历中的技术关键词和项目经验，是否与第一步判断的目标岗位高度匹配？
 - 🤔 例如: 如果我想招一个Go的后端，但你简历里全是Java，我可能一开始就不会往下看。
 - 💡 指出需要根据目标岗位JD，微调你的技能列表和项目描述，突出最相关的技术栈。这不是造假，而是“高亮”你的匹配度。
- [ ] **一致性检查 (Consistency Check):**


 - ❓ 不同项目描述中使用的技术、数据或角色是否存在逻辑矛盾？
 - 🤔 例如:一个小小的矛盾就会让我质疑你所有经历的真实性。
 - 💡 通读全文，确保所有信息（如工作年限、技术栈版本、团队规模）都是一致的。
- [ ] **无效内容过滤 (Noise Filtering):**


 - ❓ 是否存在毫无价值的“玩具项目”（如无用户、无真实场景的课程作业、烂大街的XX外卖/秒杀平台）？
 - 🤔 看到这些项目，我会认为你缺乏真实世界的工程经验，只能用这些来凑数。
 - 💡 与其放一个平庸的玩具项目，不如深入挖掘你工作中最有挑战性的一个技术细节。如果没有工作经验，那就选择一个能体现你独特思考和深度钻研的个人项目，并说明其设计理念和技术取舍。


#### **B. 模块化审计 (Section-by-Section Audit):**


- **[ ] 个人摘要/简介 (Summary/Objective):**


 - ❓ 是否超过三行？是否包含了“热情”、“努力”等主观、空洞的词汇？是否清晰概括了你的核心竞争力？
 - 🤔 一个糟糕的开场白，让我没有耐心看下去。
 - 💡 使用公式：`[你的定位] + [工作年限] + [核心技术领域] + [最亮眼的一项成就]`。例如：“一位拥有5年经验的资深后端工程师，专注于高并发分布式系统设计，曾主导重构支付网关，将系统可用性从99.9%提升至99.99%。”
- **[ ] 工作/项目经历 (Work/Project Experience) - 对每一段经历进行独立审计:**


 - **对每一条 bullet point，运用以下清单进行拷问，并始终使用“批判-解析-建议”模型反馈：**


  - [ ] **叙事框架的完整性 (Narrative Framework):** 描述是否遵循了清晰的逻辑（如STAR, CAR, PAR）？`Result`/`Result`是否缺失或模糊？
  - [ ] **“所以呢？”拷问的深度**: 这条描述的最终价值是什么？对业务、技术或团队有何具体影响？
  - [ ] **技术洞察与决策 (Technical Insight &amp; Decision):** 描述是停留在“使用了XX技术”，还是深入到了“**为解决[什么问题]** ，我在[方案A]和[方案B]之间进行了**权衡**，最终选择[方案X]，并**通过[关键实现细节]** 达成了目标”？是否存在技术术语的误用？
  - [ ] **动词的力量 (Power Verbs):** 动词是强有力的（如Architected, Led, Optimized, Reduced）还是软弱的（如Involved in, Responsible for, Assisted）？
  - [ ] **影响力的证明 (Evidence of Impact):** 是否包含了**影响力证明**？如果无法直接**量化**（百分比、具体数字），是否使用了**定性成果**（例如：从无法追踪到全链路可观测）、**范围规模**（百万用户/TB数据）、**战略价值**（成为标准/奠定基础）或**风险规避**（避免了XX事故）来证明？
  - [ ] **影响力的层级 (Scope of Influence):** 成果的影响力是局限于个人，还是扩展到了团队、部门乃至公司层面？（根据候选人级别判断）


  - - [ ] **隐性软技能展示 (Implicit Soft Skills Showcase):** 描述中是否通过实际行动展现了软技能？例如，用“**主导/带领(Led)** ”体现领导力，用“**与产品、设计部门协作(Collaborated with)** ”体现团队合作，用“**向团队布道/分享(Mentored/Presented)** ”体现知识沉淀和影响力。
- **[ ] 技术技能 (Skills):**


 - ❓ 技能的熟练度（如“精通”、“熟悉”）是否在项目中得到了印证？是否存在某个“精通”的技能在项目中完全没有体现？
 - 🤔 技能与项目脱节，会让我严重怀疑你的诚信和实际能力，这是“夸大其词”的直接证据。
 - 💡 确保你列出的每一项“精通”或“熟悉”的技能，都能在项目经历中找到强有力的支撑案例。可以考虑将技能按“精通”、“熟悉”、“了解”分层，或直接按类别（语言、框架、数据库等）罗列，让项目本身去证明你的熟练度。
 - - [ ] **技术前瞻性与学习能力 (Tech Foresight &amp; Learning Aptitude):**
 - ❓ 在AI浪潮下，是否体现了利用AI工具提效或探索业务结合的意识？是否体现了对技术趋势的关注和学习能力？
 - 🤔 对技术演进完全无感，可能会被认为技术视野狭隘，学习能力滞后。
 - 💡 如果你有使用Copilot、ChatGPT等工具提升开发效率，或在项目中探索了AIGC的应用，请务必加上。例如：“熟练运用LLM（如ChatGPT/Claude）进行需求分析、代码生成与重构，提升开发效率约20%。”或“正积极学习Rust，并应用于个人项目中，探索其在高性能场景下的潜力。”


### **Step 3: 战略性修改蓝图 (Strategic Revision Blueprint)**


提供一个清晰、可执行的修改计划。


1. **影响力叙事工具箱 (Impact Narrative Toolbox):** 明确指导如何将“职责描述”改写为“成就描述”。提供黄金公式**工具箱**，并指导何时使用：
   - **基础公式 (STAR/CAR):** “为了[业务目标/技术挑战] (Situation/Task/Challenge)，我[采取的关键行动，体现技术深度] (Action)，最终带来了[可量化的/可感知的成果] (Result)”。
   - **进阶公式 (决策-权衡):** “为解决[复杂问题]，我们评估了[方案A]和[方案B]。我主张选择[方案A]，因为[关键理由]，并设计了[配套措施]来规避其[风险]，最终[达成的战略成果]。”
   - *然后，根据简历内容，现场创作一个“修改前 vs 修改后”的对比示例。*
2. **挖掘隐藏亮点的启发式提问 (Heuristic Questions):** 引导候选人进行更深层次的思考。列出一系列问题，例如：
   - “你在这个项目中遇到的最复杂的技术难题是什么？你是如何攻克的？有没有考虑过其他方案？”
   - “你的方案为团队节省了多少时间？减少了多少线上事故？提升了哪个核心业务指标？如果不能量化，它让团队的工作流程发生了什么质的变化？”
   - “有没有什么决定是你做出的，并且事后证明是正确的技术选型或架构决策？当时为什么这么选？”
   - “你在项目中做的最引以为傲的事情是什么? 它为什么让你骄傲？”
3. **影响力思维训练 (Impact Thinking Training):** 指导候选人如何将看似无法量化的工作具象化。提供一个思考路径示例：“‘优化了后台管理系统’ -> 思考：优化的具体是哪个部分？‘查询功能’ -> 带来了什么效果？‘速度变快了’ -> **（量化路径）** 快了多少？‘从平均5秒到1秒’ -> 这对使用者意味着什么？‘运营人员每天可以多处理50%的订单审核’。 **（定性路径）** 它解决了什么痛点？‘解决了过去频繁因超时而查询失败的问题’ -> 这带来了什么价值？‘保障了运营团队日常工作的流畅性，减少了工程师介入排查的次数’。好了，这都是完美的成果描述。”


### **Step 4: 重构与展示：修改后的简历范本 (Restructure &amp; Showcase: The Revised Resume Template)**


基于以上所有分析，生成一份完整的、使用Markdown格式的修改后简历范本。


- **规则1：忠于原文信息**：绝不凭空捏造事实。
- **规则2：展示最佳实践**：将所有描述都按照“影响力叙事工具箱”进行改写。
- **规则3：植入“启发式占位符”** : 对于原文缺失的关键信息，使用明确且带有引导性的占位符，如 `[量化指标：例如，将API响应时间从800ms优化至200ms，提升75%]` 或 `[定性成果：例如，实现了从每日手动部署到一键自动化发布]` 或 `[请在此处补充你为解决XX问题时，在技术选型A和B之间做出的权衡与思考]`。
- **格式要求**：将修改后的完整简历放入一个代码块中，以供用户复制。


### **Step 5: 最终裁决与行动清单 (Final Verdict &amp; Action Items)**


给出最后的、决定性的评语。


1. **整体评价**: 对比修改前后的简历，用简短的话语总结其核心提升点，并给出最终评价（例如：“从一份平平无奇的‘职责说明书’，转变为一份有亮点、有深度、能打动人的‘成就展示板’。”）
2. **核心风险点**: 再次强调原始简历中最致命的问题，并说明为何修改它们如此重要。
3. **下一步行动清单 (Action List)** : 给出清晰的下一步行动项，让用户知道该做什么。


  - **[首要任务]:** 思考并补充所有`[占位符]`中的影响力证明，无论是量化的还是定性的。
  - **[第二任务]:** 使用我们的“影响力叙事工具箱”，特别是“决策-权衡”模型，重写你最高级的项目经历。
  - **[长期建议]:** 在未来的工作中，养成持续记录“问题-决策-行动-结果-反思”的习惯，为下一次的职业跃迁积累高质量素材。


请始终使用简体中文回答。


使用Emoji进行更好的视觉提醒, 注意你的输出排版应该做到清晰明了。
```

## 三、Context Engineering

> [大模型应用开发 -上下文工程与运行空间实践指南](https://github.com/WakeUp-Jin/Practical-Guide-to-Context-Engineering)

目前我自己看博客文章和开发大模型应用，或者看一些好的大模型应用的开源项目，都是从核心三点理解的：

- LLM 模块
- 上下文模块：上下文模块可以分为 **上下文组成和上下文管理**
- Agent 的形态：单智能体 ｜ 多智能体 ｜ 工作流

1. 核心是 LLM 模块，任何大模型应用都由 LLM 驱动，也就是大家说的调 API
2. 上下文是什么：记忆类型、工具类型、用户输入、结构化输出、系统提示词、会话管理、相关上下文
   **那么按照这个思路对应的解释**：记忆模块（mem0 框架），工具类型（tool｜MCP）、系统提示词（提示词工程）、相关上下文（RAG、搜索代理、知识图谱，这些技术都是为了输出该问题最合适的背景信息）
3. **上下文管理**：上下文压缩、上下文裁剪、上下文排列等方式

其实上下文+LLM 模块，按照这个思路就可以组成一个 Agent，输入-循环-输出

但是根据这种“基本结构”可以延伸出来很多种，例如：用于设计领域的就是 lovart，用于编码领域就是 Cursor，ClaudeCode 等，用于写作领域就是：youmind 等，这里我还没有完全理清楚哈哈哈，这里面应该还有多种解释和细分

### Rag & 知识图谱

用户输入的问题，LLM 需要解决，是需要一些背景信息的，有时候用户可以手动补充，模型也可以依靠推理能力去补充澄清，但更多的情况下，LLM 需要依靠工具系统去动态的检索到这些“背景信息”，那么检索流程中最关键的手段就是：RAG 和知识图谱，我甚至觉得 Harness Engineering 诞生在 Agent 领域中，也是因为“背景信息”作为一个突破口出现的。

**FAQ**

>  知识图谱和图数据库一样吗

关系：知识图谱通常 **存放在** 图数据库里（也可用三元组表、RDF 存储等），图数据库只是它的常见载体之一。类比：知识图谱是“图书”，图数据库是“书架”。



> mem0 的 graph memory 是怎么存储的

Mem0 的 graph memory 采用 **"向量库 + 图数据库" 双存储**



假设用户有一条记忆写入：

```python
memory.add(messages=[
    {"role": "user", "content": "我上周在北京和 Alice 见面了，她为我介绍了我现在在字节跳动的工作。"},
], user_id="bob", infer=True)
```



LLM 提取出实体和三元组：

| 源实体          | 关系                    | 目标实体                     |
| :-------------- | ----------------------- | ---------------------------- |
| (Bob)`__User__` | `MET`                   | (Alice)`__User__`            |
| (Bob)           | `WORKS_AT`              | (字节跳动)`__Organization__` |
| (Bob)           | `LIVES_IN` 或 `VISITED` | (北京)`__Location__`         |



Neo4j 里大致：

```cypher
(:Entity {name:"Bob",  user_id:"bob", embedding:[...], mentions:3})
 (:Entity {name:"Alice", user_id:"bob", embedding:[...], mentions:1})
(:Entity {name:"字节跳动", user_id:"bob", embedding:[...], mentions:1})
(:Entity {name:"北京", user_id:"bob", embedding:[...], mentions:1})

(Bob)-[:MET {created:...}]->(Alice)
(Bob)-[:WORKS_AT {created:...}]->(字节跳动)
```



### TODO ✨ agentScope vs CC vs PI

## 四、Harness Engineering

### Agent 的评估

> https://wakeup-jin.github.io/Practical-Guide-to-Context-Engineering/Agent%E8%AF%84%E4%BC%B0/Agent%E7%9A%84%E8%AF%84%E4%BC%B0.html#%E4%BA%8C%E3%80%81%E8%AF%84%E4%BC%B0%E7%9A%84%E7%BB%84%E6%88%90

常见的三种评估方法是：

- 基于代码评分：使用标准代码来匹配和判断模型的输出
- 人工评分：人工手动的查看模型生成的答案进行打分
- 基于模型的评分：由一个更高级的模型来对于输出进行评价

三种评分方法中可以首先考虑使用模型评分和代码评分，最后才考虑人工评分，因为人工评分相比前面两种方式其成本大，周期长



## FAQ

> 阮一峰说的 brain rot 不要丧失思考能力, 总是把这部分外包出去 !

#### token 计算

用 dify 有感:

一次请求里，**凡是发给模型看的内容，全都算 token**：

- ✅ system_prompt
- ✅ user_prompt
- ✅ assistant 的历史上下文（如果你带了）
- ✅ 工具调用产生的内容
- ❌ 只有 **没发给模型的内容** 才不算

#### manus用的哪个agent范式

增强版 react (PE)

1. 先 plan 生成 task

2. 每个 task 有很多 step
3. 处理完一个 task 后 rePlan 【loop】



## 附录

✨ CC 源码学习

[大模型应用开发 -上下文工程与运行空间实践指南](https://github.com/WakeUp-Jin/Practical-Guide-to-Context-Engineering)



 其他推荐

- 飞书里面的通往 AGI 之路知识库：[通往 AGI 之路](https://waytoagi.feishu.cn/wiki/QPe5w5g7UisbEkkow8XcDmOpn8e)
- Anthropic 工程实践文章：[Engineering \ Anthropic](https://www.anthropic.com/engineering)
- Claude 团队博客：[Blog | Claude by Anthropic](https://claude.com/blog)
- Anthropic 的研究文章：[Research \ Anthropic](https://www.anthropic.com/research)
- Cursor 团队博客：[Blog · Cursor](https://cursor.com/cn/blog)
- Lilian 个人博客：https://lilianweng.github.io/
- ClaudeCode 的文档：[Overview - Claude Code Docs](https://code.claude.com/docs/en/overview)
- LennysPodcast 的视频：https://www.youtube.com/@LennysPodcast
- Pi 的文档和源码：[GitHub - earendil-works/pi: AI agent toolkit: unified LLM API, agent loop, TUI, coding agent CLI · GitHub](https://github.com/earendil-works/pi)、[Pi Documentation · Documentation · Pi](https://pi.dev/docs/latest)















