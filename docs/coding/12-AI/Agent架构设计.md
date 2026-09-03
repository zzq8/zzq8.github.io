---
updated: 2026-01-10 15:34:34
created: 2025-02-24
---

# Agent架构设计 (2025)

# 背景

23年，是大模型技术爆发的元年。

24年，大模型争霸，大模型应用爆发的元年。（deepseek、豆包think、ChatGPT4.5、......）

**25年**，**模型越强**，随之带来的是**Agent越强**，今年必然是**Agent爆发元年**，势不可挡。

（2025年3月5日）上周爆火的**manus**的出现，又把Agent推上另一个高潮！

随之而出现的是MetaGPT的5个人在3小时完成**OpenManus**，在Github开源。



在经历Avatar Agent后，我们发现**Cockpit平台严重缺少Agent能力**，而Avatar的配置只能够通过原子节点组装成Agent，虽然最后配出来了，结果也很ok，但这过程中经历的苦只有我们自己知道。（每天一个架构升级...）



**业务/创新的探索需要平台持续的升级与迭代**，业务才能更好、更快、更方便的探索，就像大模型平台、微调、预训练等能力一样，Agent同样也是如此。

# 挑战

1. 市面上都只是Agent相关的框架或产品，比如CrewAI、AutoGen等，还没有一个真正的Agent平台。我们要做的是**从0到1构建一个Agent平台**，让业务灵活运用Agent思想来解决问题。
2. Agent之间应该如何**通信协作**，以及如何更好的通信与协作。
3. **Agent记忆**独占与共享问题，什么时候该独占，什么时候该共享，以及记忆是否能够传递等。
4. Agent的多种设计模式与Multi-agent的协作方式，**如何产品化**，以及让业务更好的、更可控的去运用这些设计模式与协作方式。



# 目标

## 系统目标

1. **从0到1**构建Cockpit Agent能力，Agent技术产品化，支持业务灵活选择Agent的设计模式与协作方式。
2. 从平台视角看，要实现Agent的**8种**设计模式。
3. 从平台视角看，要实现Agent与Agent之间的**4种**协作模式







# Agent设计模式

Agent的几种设计模式：

![画板](https://image.233377.xyz/2026/33db71e17d554c58e17275ec8db78a9c-20260110151925268.jpeg)

1. ReAct（Reasoning-Acting）：思考-行动-观察
2. REWOO(Reason WithOut Observation)：加入Plan。计划-循环执行Task-总结
3. PE（Plan & Execute）：加入RePlan。计划-执行Task-RePlan
4. LLM Compiler：加入并行执行。计划-并行执行Task-RePlan
5. PEER：Plan-Execute-Express-Review
6. Basic Reflection：生成器-评估器模型，生成器生成结果，评估器评估结果反馈生成器
7. Self-Discover：边推理边思考。
   1. 论文：[https://arxiv.org/pdf/2402.03620](https://arxiv.org/pdf/2402.03620)
8. Reflection：加入强化学习模型。
9. LATS（Language Agent Tree Search）加入搜索树与PE思想。



# Agent协作方式


## 协作方式

![画板](https://image.233377.xyz/2026/56f12d90eef4f77891e7554123a084e7-20260110151925087.jpeg)



总结下来Agent的协作方式有：

1. **Sequential**：这是一种多个Agent串行的方式，这种方式预计会成为主流配置的方式之一。
2. **Async**：这是一种Agent能够异步执行的方式，这种方式通常用来处理异步任务，同时这种方式难以监控，比较消耗性能资源，技术上一定要有防止资源耗尽的手段。
3. **Supervisor**：这是一种层级结构的协作方式，同时这也可以成为中心化架构配置的一种方式，这种方式预计也会成为主流配置的方式之一。
4. **Chat Group**：这是一种去中心化的方式，后续也会演变出比较多的变体，比如：去中心化共同协作完成任务、任务抢答、消息通知等等。











## 问题的受理方式

1. 开始节点：每次都按照编排流程处理。
2. 上一次回复用户的节点：第一次从开始节点开始按照编排流程处理，同一会话后续对话使用叶子节点Agent处理。

![](https://image.233377.xyz/2026/5a3b999ba4fcbb47e6841d59c82bda6c.png)







举两个例子：PDAgent、TLAgent、DEVAgent

+ 案例1：
  - 第一次提需求：PD给技术提需求，所以PD找到TL，最终由TL分配任务给DEV来开发
  - 第二次提需求：虽然与第一次提的需求是同类别的需求，但是PD还是找到TL，最终TL分配任务给DEV来开发
  - ......（只要是需求，PD每次都找TL提，这种方式，就是每次都进入开始节点）
+ 案例2：
  - 第一次查问题：PD说Bot这个模块哪哪哪有问题，PD找到TL，TL找到玖承DEVAgent，最终玖承和PD沟通问题的，复现与解决。
  - 第二次查问题：PD知道是Bot的问题，PD直接找到玖承DEVAgent，然后玖承DEVAgent解决了这个问题。
  - ......（只要是这个类型的问题（同一个session），问题就直接丢给玖承DEVAgent处理，也就是上一个回复问题的Agent）

物理世界存在这种处理问题的方式，在Agent中，也应该存在这种处理问题的方式。



===》再举个例子：

有人找你说看个问题，你说“你找下xxAgent”，然后xxAgent处理了问题。

下次这个人又来问类似的问题，你还是说“你找下xxAgent”，然后xxAgent又处理了问题。

 再下次，这个人遇到问题是不是直接找xxAgent？





## 处理问题后的返回方式

返回方式：

1. 往上返回：Agent处理任务后，将答案返回给调用方（调用方可以是Workflow、Agent、<font style="color:#D8DAD9;">Bot</font>）
2. 往下执行：Agent处理任务后，继续往下执行
   1. 如果没有下一个节点（Crew的叶子节点）：作为Crew的输出。
   2. 如果有下一个节点（单Agent节点、Crew的非叶子节点）：继续往下执行





举两个例子：TLAgent、DEVAgent

+ 案例1：PD想要Cockpit的活跃用户数，PD找到TLAgent，TLAgent找到DEVAgent，DEVAgent执行sql得到结果，将结果给了TLAgent，TLAgent将结果给了PD。
+ 案例2：还是这个案例，但是DEVAgent执行任务得到结果后，直接给了PD。

现实物理世界中，这两种 **<font style="color:#DF2A3F;">人与人之间的相处模式，其实也应该是Agent与Agent的相处模式</font>**。







# 横向看见


## 技术

1. LangChain & LangGraph
2. llamaindex
3. autogen
4. autoGPT
5. metaGPT
6. babyAGI
7. hunggingGPT
8. CrewAI
9. antUniverse





对比总结：

<font style="background-color:#81BBF8;">蓝色</font>：重点介绍

<font style="background-color:#FCE75A;">黄色</font>：我们平台

|                                                              | Cockpit                                                      | CrewAI                                                       | autoGen                                       | LangChain & LangGraph | llamaindex | autoGPT | metaGPT | babyAGI | hunggingGPT | antUniverse   | Manus & OpenManus |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------------- | --------------------- | ---------- | ------- | ------- | ------- | ----------- | ------------- | ----------------- |
| 是否支持单Agent                                              | ✅                                                            | ✅                                                            | ✅                                             | ✅                     | ✅          | ✅       | ✅       | ✅       | ✅           | ✅             | -                 |
| 单Agent是否支持选择设计模式                                  | ✅                                                            | ✅                                                            | ❌                                             | ❌                     | ❌          | ❌       | ❌       | ❌       | ❌           | ❌             | -                 |
|                                                              |                                                              |                                                              |                                               |                       |            |         |         |         |             |               |                   |
| 是否支持Multi-Agent                                          | ✅                                                            | ✅                                                            | ✅                                             | ❌                     | ❌          | ❌       | ❌       | ❌       | ❌           | ✅             | -                 |
| 是否支持配置Multi-Agent协作方式                              | ✅                                                            | ✅<br/>支持两种：<br/>1. 支持Agent分配任务给其他Agent<br/>2. 支持hierarchical模式，启动manage_agent分配任务 | ✅                                             | ❌                     | ❌          | ❌       |         | ❌       | ❌           | ✅两种匹配模式 | -                 |
| Multi-Agent是否支持多种问题受理方式<br/>（开始节点/上个Agent回复节点） | ✅                                                            | ❌                                                            | ✅                                             | ❌                     | ❌          | ❌       |         | ❌       | ❌           | ❌             | -                 |
| Multi-Agent是否支持多种返回方式<br/>（向下执行/向上返回）    | ✅                                                            | ❌                                                            | ✅                                             | ❌                     | ❌          | ❌       |         | ❌       | ❌           | ❌             | -                 |
| Multi-Agent之间如何通信                                      | 1. workflow里边链接，节点上下文通信<br/>2. workflow边链接，作为工具调用 | 1. 编排页面边连接，上下文通信                                | 1. 维护环境内部的消息队列通过消息发布订阅通信 |                       |            |         |         |         |             |               |                   |








### LangChain & LangGraph

LangChain官方文档：[https://python.langchain.com/docs/introduction/](https://python.langchain.com/docs/introduction/)

LangGraph官方文档：[https://langchain-ai.github.io/langgraph/tutorials/introduction/](https://langchain-ai.github.io/langgraph/tutorials/introduction/)

> 一句话解释: <font style="color:rgb(0, 0, 0);">一个可编排的, 有Agent的, 最广为人知的技术框架</font>

LangChain：**<font style="color:rgb(28, 30, 33);">LangChain</font>**<font style="color:rgb(28, 30, 33);"> 是一个用于开发由大型语言模型 (LLMs) 驱动的应用程序的框架。</font>

+ <font style="color:rgba(0, 0, 0, 0.75);">Agent 组件的核心是以大语言模型为推理引擎，并根据这些推理来决定如何与</font>**<font style="color:rgba(0, 0, 0, 0.75);">外部工具</font>**<font style="color:rgba(0, 0, 0, 0.75);">交互及采取何种行动；</font>
+ <font style="color:rgba(0, 0, 0, 0.75);">Agent 是 LangChain 框架的一种高级组件，它将工具组件 tools 和链组件 chain 整合在一起；</font>
+ <font style="color:rgba(0, 0, 0, 0.75);">本质上就是编写 prompt，让模型仿照你的方式来进行执行的一种应用范式，prompt 里面包含一些 tools 的描述，然后我们可以根据模型的输出使用一些外部 tools；</font>

![](https://image.233377.xyz/2026/e08c70a8a300213ed4438c7e4837c17a.png)

Agent模式:

+ **<font style="color:rgba(0, 0, 0, 0.75);">Action Agent</font>**<font style="color:rgba(0, 0, 0, 0.75);">：在每个时间步长，使用所有先前操作的输出来决定下一步的操作；step by step，即每一步操作都会立即去执行，得到输出后使用该输出进行下一步的决策和操作；</font>

<font style="color:rgba(0, 0, 0, 0.75);">LangChain 中常用的 Agent 都属于Action Agent。</font>

<font style="color:rgba(0, 0, 0, 0.75);">Action Agent 的控制流程是发送用户的输入后，如果需要，Agent 会寻找一个工具并运行它，然后 Agent 会检查该工具的输出；Agent 可以串联多个工具，可以将某个工具的输出作为下一个工具的输入，从而实现复杂和特定的任务。</font>

Agent组成:

![](https://image.233377.xyz/2026/b6dac186ed56e95e842d502c6dc21f6d.png)

Agent的主要作用就是依靠大语言模型进行推理，它的核心方法是plan方法，也就是访问大语言模型获得计划。

AgentExecutor相当于是Agent组件的运行管理环境，负责调用和管理Agent组件，执行Agent组件制定的行动计划以及处理其他一些复杂的情况，比如日志记录、错误兼容处理等。



<font style="color:rgba(0, 0, 0, 0.75);">Agent初始化流程:</font>

![](https://image.233377.xyz/2026/89cc0af84d9cafd4cd60dd2038743613.png)



<font style="color:rgba(0, 0, 0, 0.75);">Agent执行流程:</font>

![](https://image.233377.xyz/2026/f31bfad55b43ab19a82c49f9d941d83f.png)

<font style="color:rgb(77, 77, 77);">从上图我们看到</font><font style="color:rgb(77, 77, 77);"> </font>**<font style="color:rgb(77, 77, 77);">AgentExecutor</font>**<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">的执行过程，实际上就是一个</font>**<font style="color:rgb(77, 77, 77);">循环执行推理</font>**<font style="color:rgb(77, 77, 77);">的过程，推理过程分两个大的步骤：</font>

+ <font style="color:rgba(0, 0, 0, 0.75);">一是访问 LLM 获得计划，也就是 agent.plan 方法；</font>
+ <font style="color:rgba(0, 0, 0, 0.75);">二是根据计划选择是否执行 tool，也就是 tool.run；</font>

根据图上所示流程 LangChain的Agent模式为Re-Act

实例代码 跑一个小demo

```python
from langchain.agents import load_tools
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from langchain.llms import OpenAI
# 加载LLM
llm = OpenAI(temperature=0)
# 加载工具
tools = load_tools(["serpapi", "llm-math"], llm=llm)
# 初始化agent
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
# 执行
agent.run("Who is Leo DiCaprio's girlfriend? What is her current age raised to the 0.43 power?")
```

![画板](https://image.233377.xyz/2026/03ac39cbefc2022b8fbe24111d1d2037.jpeg)

LangGraph：<font style="color:rgb(64, 64, 64);">是Langchain提出的一款用来进行agent和multi agent开发的框架，其核心优势在于三个特性：</font>**<font style="color:rgb(193, 0, 2);">环构建</font>**<font style="color:rgb(64, 64, 64);">、</font>**<font style="color:rgb(193, 0, 2);">可控性</font>**<font style="color:rgb(64, 64, 64);">、</font>**<font style="color:rgb(193, 0, 2);">持久性</font>**<font style="color:rgb(64, 64, 64);">。具体来说，环构建是指Langgraph 允许用户在流程构建过程中使用环结构，像目前很火的ReAct结构就是一个环结构。使用Langgraph，就很容易搭建一个ReAct流程，而很多有向无环结构的框架就很难直接做到这一点。</font>

<font style="color:rgb(64, 64, 64);"></font>

> <font style="color:rgb(64, 64, 64);">一句话解释:  </font><font style="color:rgb(0, 0, 0);">在Langchain基础上加上了图结构</font>

<font style="color:rgb(64, 64, 64);">LangGraph是一个用于构建复杂、可扩展AI代理的Python库，它使用基于图的状态机来管理和执行复杂的任务流程。LangGraph的核心概念包括：</font>

<font style="color:rgb(64, 64, 64);">State（状态）：表示应用程序当前的快照，可以是任何Python类型，但通常是TypedDict或Pydantic BaseModel。</font>

<font style="color:rgb(64, 64, 64);">Nodes（节点）：Python函数，接收当前状态作为输入，执行某些计算或副作用，并返回更新后的状态。</font>

<font style="color:rgb(64, 64, 64);">Edges（边）：控制流规则，决定基于当前状态的下一个要执行的节点。可以是条件分支或固定过渡。</font>

<font style="color:rgb(64, 64, 64);">通过组合Nodes和Edges，可以创建复杂的、循环的工作流，这些工作流会随着时间的推移而演化状态。</font>

<font style="color:rgb(64, 64, 64);"></font>

![](https://image.233377.xyz/2026/66661eec5282b0767db3530d9329df07.png)

```python
# 1. 定义工具与状态
@tool
def compute_savings(monthly_cost: float):
    """计算太阳能节省"""
    return {"savings": monthly_cost * 0.7}  # 模拟计算

class SolarState(TypedDict):
    messages: Annotated[list, add_messages]

# 2. 绑定工具到模型
llm = ChatOpenAI().bind_tools([compute_savings])

# 3. 定义带错误处理的工具节点
def tool_node_with_fallback(state):
    try:
        return ToolNode([compute_savings]).invoke(state)
    except Exception as e:
        return {"messages": [f"工具调用失败：{str(e)}"]}

# 4. 构建图（含循环）
workflow = StateGraph(SolarState)
workflow.add_node("assistant", llm_node)
workflow.add_node("tools", tool_node_with_fallback)
workflow.add_conditional_edges("assistant", tools_condition)  # 根据LLM输出选择分支
workflow.add_edge("tools", "assistant")
```

其实就是工作流

|                                                       | 核心功能                                                     | 类比                 |
| ----------------------------------------------------- | ------------------------------------------------------------ | -------------------- |
| LangChain(是LangGraph的底层实现)                      | + Prompts<br/>+ Models 与 Schema<br/>+ Indexes<br/>+ Memory<br/>+ Chains<br/>+ Agent<br/> | 一个很简单的workflow |
| LangGraph(重点是图)<br/>是对LangChain Agent能力的拓展 | + <font style="color:rgb(64, 64, 64);">State（状态）</font><br/>+ <font style="color:rgb(64, 64, 64);">Nodes（节点）</font><br/>+ <font style="color:rgb(64, 64, 64);">Edges（边）</font> | workflow图           |




### llamaindex

官方文档 [https://docs.llamaindex.ai/en/stable/](https://docs.llamaindex.ai/en/stable/)

> 一句话解释: <font style="color:rgb(0, 0, 0);">一个可编排的, 有Agent的, 并且有很强大数据处理能力的技术框架</font>

> LlamaIndex 是一个将大语言模型和外部数据连接在一起的工具。大模型依靠上下文学习（Context Learning）来推理知识，针对一个输入（或者是prompt），根据其输出结果。因此Prompt的质量很大程度上决定了输出结果的质量，因此提示工程（Prompt engineering）现在也很受欢迎。目前大模型的输入输出长度因模型结构、显卡算力等因素影响，都有一个长度限制（以Token为单位，ChatGPT限制长度为4k个，GPT-4是32k等，Claude最新版有个100k的）。当我们外部知识的内容超过这个长度时，就无法同时将有效的信息传递给大模型。因此就诞生了 LlamaIndex 等项目。
>
> 假设有一个10w的外部数据，我们的原始输入Prompt长度为100，长度限制为4k，通过查询-检索的方式，我们能将最有效的信息提取集中在这4k的长度中，与Prompt一起送给大模型，从而让大模型得到更多的信息。此外，还能通过多轮对话的方式不断提纯外部数据，达到在有限的输入长度限制下，传达更多的信息给大模型。

![](https://image.233377.xyz/2026/7306462f2674b154465a03ca4ec9ff57.png)

> <font style="color:rgb(0, 0, 0);">相对于微调的模型，有以下优点：</font>
>
> <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(0, 0, 0);">不需要重新训练模型 成本较低</font>
>
> <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(0, 0, 0);">数据永远都是实时检索的，所以都是最新的</font>
>
> <font style="color:rgb(0, 0, 0);">答案是可信可控的</font>



![](https://image.233377.xyz/2026/74f8f115be9d6a65e17c7eb7ca5b126d.png)

| 核心工具                                                     |                                                              | 类比   |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| <font style="color:rgb(0, 0, 0);">data connectors 数据连接器</font> | <font style="color:rgb(0, 0, 0);">帮助应用程序注入已有的数据，数据可能来自于各种数据源，如api pdf 数据库等。不同数据源，不同格式的数据注入到llamaIndex</font> | 知识库 |
| <font style="color:rgb(0, 0, 0);">data indexes 数据索引</font> | <font style="color:rgb(0, 0, 0);">把数据转换成大模型容易理解的且高效处理的数据：支持多种数据索引类型：</font><br/><font style="color:rgb(64, 64, 64);">■</font><font style="color:rgb(0, 0, 0);">summary</font><br/><font style="color:rgb(64, 64, 64);">■</font><font style="color:rgb(0, 0, 0);">vector store</font><br/><font style="color:rgb(64, 64, 64);">■</font><font style="color:rgb(0, 0, 0);">tree</font><br/><font style="color:rgb(64, 64, 64);">■</font><font style="color:rgb(0, 0, 0);">keyword table</font> |        |
| <font style="color:rgb(0, 0, 0);">data agents 数据代理</font> |                                                              |        |
| <font style="color:rgb(0, 0, 0);">engines 引擎</font>        | <font style="color:rgb(0, 0, 0);">引擎提供了自然语言访问数据的模块或者接口，比如</font><br/><font style="color:rgb(64, 64, 64);">■</font><font style="color:rgb(0, 0, 0);">Query 查询语言，强大的检索接口，基于知识输出</font><br/><font style="color:rgb(64, 64, 64);">■</font><font style="color:rgb(0, 0, 0);">Chat 聊天引擎，交互能力和对话历史</font> |        |
| <font style="color:rgb(0, 0, 0);">applicateion integrations 应用集成</font> | <font style="color:rgb(0, 0, 0);">他能够对接生态其他的框架，如langchain flask chatGPT，llamaIndex不是一个取代其他框架的框架，是共生，一起构建基于大模型的应用程序</font> |        |




基于llamaIndex的agent执行逻辑

![](https://image.233377.xyz/2026/1903ebccdb752f403be49323ef2046b9.png)

> <font style="color:rgb(51, 51, 51);">当用户发送请求时，实际的事件顺序如下：</font>
>
> 1. <font style="color:rgb(51, 51, 51);">工作流程初始化上下文，包括：</font>
> 2. <font style="color:rgb(51, 51, 51);">聊天历史的内存缓冲区。</font>
> 3. <font style="color:rgb(51, 51, 51);">可用的 agents。</font>
> 4. <font style="color:rgb(51, 51, 51);">初始状态字典。</font>
> 5. <font style="color:rgb(51, 51, 51);">当前 agent（最初设置为根 agent，generate）。</font>
> 6. <font style="color:rgb(51, 51, 51);">用户的消息被处理：</font>
> 7. <font style="color:rgb(51, 51, 51);">如果存在状态，它将使用状态提示添加到用户的消息中。</font>
> 8. <font style="color:rgb(51, 51, 51);">消息被添加到记忆中。</font>
> 9. <font style="color:rgb(51, 51, 51);">聊天历史为当前 agent 准备。</font>
> 10. <font style="color:rgb(51, 51, 51);">当前 agent 的设置：</font>
> 11. <font style="color:rgb(51, 51, 51);">收集 agent 的工具（包括任何检索到的工具）。</font>
> 12. <font style="color:rgb(51, 51, 51);">如果 agent 可以交接给其他人，则添加特殊的交接工具。</font>
> 13. <font style="color:rgb(51, 51, 51);">agent 的系统提示被预先添加到聊天历史中。</font>
> 14. <font style="color:rgb(51, 51, 51);">在调用 LLM 之前发出 “AgentInput” 事件。</font>
> 15. <font style="color:rgb(51, 51, 51);">agent 处理输入：</font>
> 16. <font style="color:rgb(51, 51, 51);">agent 生成响应和/或进行工具调用。这会生成 “AgentStream” 事件和 “AgentOutput” 事件。</font>
> 17. <font style="color:rgb(51, 51, 51);">如果没有工具调用，agent 会完成其响应并返回结果。</font>
> 18. <font style="color:rgb(51, 51, 51);">如果有工具调用，则执行每个工具，并处理结果。这会为每个工具调用生成 “ToolCall” 事件和 “ToolCallResult” 事件。</font>
> 19. <font style="color:rgb(51, 51, 51);">工具执行后：</font>
> 20. <font style="color:rgb(51, 51, 51);">如果标记为</font><font style="color:rgb(51, 51, 51);"> </font>`<font style="color:rgb(51, 51, 51);">return_direct=True</font>`<font style="color:rgb(51, 51, 51);"> </font><font style="color:rgb(51, 51, 51);">的任何工具，其结果将成为最终输出。</font>
> 21. <font style="color:rgb(51, 51, 51);">如果发生了交接（通过交接工具），则工作流程切换到新 agent。这不会被添加到聊天历史中，以保持对话流畅。</font>
> 22. <font style="color:rgb(51, 51, 51);">否则，更新后的聊天历史将被发送回当前 agent 进行下一步处理。</font>

总结

llamaIndex主要能力在数据检索和优化

agent的实现也是使用Re-Act的方式

```python
from llama_index.llms.ollama import Ollama
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from fpdf import FPDF  # 使用 fpdf 库来生成 PDF 文件

# 定义一个将响应内容写入 PDF 的工具函数
def save_response_to_pdf(response: str, **kwargs) -> str:
    """Save the response to a PDF file."""
    # 初始化 PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    # 写入响应内容到 PDF
    pdf.cell(200, 10, txt="Agent Response:", ln=True, align='L')
    pdf.multi_cell(0, 10, txt=response)
    # 保存 PDF 文件
    pdf_filename = "agent_response.pdf"
    pdf.output(pdf_filename)
    
    print(f"Response saved to {pdf_filename}.")
    return f"Response saved to PDF as {pdf_filename}."

# 将response保存到数据库中
def save_response_to_database(response: str, **kwargs) -> str:
    """Save the response to database."""
    db="testdb"
    print(f"Response saved to {db}.")
    return f"Response saved to database: {db}."

# 将工具函数封装为 FunctionTool
save_response_to_pdf_tool = FunctionTool.from_defaults(fn=save_response_to_pdf)
save_response_to_database = FunctionTool.from_defaults(fn=save_response_to_database)

# 设置 LLM 和 Agent
llm = Ollama(model="llama3.2", request_timeout=360)
# 创建一个agent
agent = ReActAgent.from_tools([save_response_to_pdf_tool, save_response_to_database], llm=llm, verbose=True)

# 告诉Agent我要做什么，注意：这个提示词非常重要
response = agent.chat("Please answer the question: 'who are you?'. And then save the answer to pdf file and save the answer to database!")
print(str(response))
```

### autogen

<font style="color:rgb(0, 0, 0);">官方文档</font>

<font style="color:rgb(64, 64, 64);">●</font><font style="color:rgb(0, 0, 0);">github: </font>[<font style="color:rgb(0, 128, 255) !important;">https://github.com/microsoft/autogen</font>](https://github.com/microsoft/autogen)

<font style="color:rgb(64, 64, 64);">●</font><font style="color:rgb(0, 0, 0);">docs: </font>[<font style="color:rgb(0, 128, 255) !important;">https://microsoft.github.io/autogen/docs/Getting-Started/</font>](https://microsoft.github.io/autogen/docs/Getting-Started/)

<font style="color:rgb(64, 64, 64);">●</font><font style="color:rgb(0, 0, 0);">microsoft: </font>[<font style="color:rgb(0, 128, 255) !important;">https://www.microsoft.com/en-us/research/project/autogen/</font>](https://www.microsoft.com/en-us/research/project/autogen/)

<font style="color:rgb(64, 64, 64);">●</font><font style="color:rgb(0, 0, 0);">paper: </font>[<font style="color:rgb(0, 128, 255) !important;">https://arxiv.org/abs/2308.08155</font>](https://arxiv.org/abs/2308.08155)

<font style="color:rgb(64, 64, 64);">●</font><font style="color:rgb(0, 0, 0);">AutoGen - Automated Multi Agent Chat: </font>[<font style="color:rgb(0, 128, 255) !important;">https://microsoft.github.io/autogen/docs/Examples/AutoGen-AgentChat</font>](https://microsoft.github.io/autogen/docs/Examples/AutoGen-AgentChat)

<font style="color:rgb(64, 64, 64);">●</font><font style="color:rgb(0, 0, 0);">AutoGen - Tune GPT Models: </font>[<font style="color:rgb(0, 128, 255) !important;">https://microsoft.github.io/autogen/docs/Examples/AutoGen-Inference</font>](https://microsoft.github.io/autogen/docs/Examples/AutoGen-Inference)

> <font style="color:rgb(64, 64, 64);">一句话解释: 这是一个有agent的,可编排的,可实现多agent协作的,一个技术前沿的Agent框架</font>

<font style="color:rgb(64, 64, 64);">AutoGen框架由以下部分构成：</font>

<font style="color:rgb(64, 64, 64);">●</font>[<font style="color:rgb(0, 128, 255) !important;">Agent</font>](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/agent-and-multi-agent-application.html)<font style="color:rgb(64, 64, 64);">：对应于actor模式中的actor，主要任务是</font>**<font style="color:rgb(64, 64, 64);">接收消息-处理消息/执行动作-（可选）产生新消息</font>**<font style="color:rgb(64, 64, 64);">；</font>

<font style="color:rgb(64, 64, 64);">●</font>[<font style="color:rgb(0, 128, 255) !important;">Message</font>](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/message-and-communication.html)<font style="color:rgb(64, 64, 64);">：用户自定义的消息/事件，在Agent之间进行</font>**<font style="color:rgb(64, 64, 64);">单播</font>**<font style="color:rgb(64, 64, 64);">和</font>**<font style="color:rgb(64, 64, 64);">广播</font>**<font style="color:rgb(64, 64, 64);">；</font>

<font style="color:rgb(64, 64, 64);">●</font>[<font style="color:rgb(0, 128, 255) !important;">AgentRuntime</font>](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/architecture.html)<font style="color:rgb(64, 64, 64);">：agent的执行环境，目前支持</font>**<font style="color:rgb(64, 64, 64);">单机</font>**<font style="color:rgb(64, 64, 64);">和</font>**<font style="color:rgb(64, 64, 64);">分布式</font>**<font style="color:rgb(64, 64, 64);">（by gRPC）执行；</font>

![](https://image.233377.xyz/2026/7f1ea9e9ca4f47c274c02c2bdc8ae2ec.png)<font style="color:rgb(64, 64, 64);"> </font>

**<font style="color:rgb(64, 64, 64);">最核心的两种能力：</font>**

1. **sendMessage：一个Agent对着一个Agent传递内容**
2. **publishMessage：在这个Group-Topic放一个消息，只要是在这个Group内的且监听了该Topic的Agent就可以收到消息。**

**<font style="color:rgb(64, 64, 64);"></font>**

<font style="color:rgb(64, 64, 64);"></font>

![画板](https://image.233377.xyz/2026/25dbddd052c82869d9b2512c8399c816.jpeg)

<font style="color:rgb(64, 64, 64);"></font>

<font style="color:rgb(64, 64, 64);">基于autogen的publish_message广播机制 可以实现以下multi-agent设计模式</font>

1. **并发执行**
2. **顺序模式**
3. **群聊模式**
4. **混合模式**
5. **辩论模式**
6. **反射**
7. **代码执行**

以下是各个模式的实现逻辑

1.并发执行



```python
import asyncio
from dataclasses import dataclass

from autogen_core import (
    AgentId,
    ClosureAgent,
    ClosureContext,
    DefaultTopicId,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    default_subscription,
    message_handler,
    type_subscription,
)
@dataclass
class Task:
    task_id: str


@dataclass
class TaskResponse:
    task_id: str
    result: str

@default_subscription
class Processor(RoutedAgent):
    @message_handler
    async def on_task(self, message: Task, ctx: MessageContext) -> None:
        print(f"{self._description} starting task {message.task_id}")
        await asyncio.sleep(2)  # Simulate work
        print(f"{self._description} finished task {message.task_id}")


async def main():
    runtime = SingleThreadedAgentRuntime()

    await Processor.register(runtime, "agent_1", lambda: Processor("Agent 1"))
    await Processor.register(runtime, "agent_2", lambda: Processor("Agent 2"))

    runtime.start()

    await runtime.publish_message(Task(task_id="task-1"), topic_id=DefaultTopicId())

    await runtime.stop_when_idle()

```

![画板](https://image.233377.xyz/2026/036ab2542202b3551c29dc5e42ddcfd6.jpeg)

2. 顺序模式

```python
import asyncio
from dataclasses import dataclass

from autogen_core import RoutedAgent, message_handler, MessageContext, SingleThreadedAgentRuntime, AgentId
from autogen_core.model_context import BufferedChatCompletionContext
from autogen_core.models import ChatCompletionClient, SystemMessage, UserMessage, AssistantMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient

model = OpenAIChatCompletionClient(
    model="qwen-max",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    api_key="sk-xxx",
    temperature=1.9,
    top_p=0.9,
    model_info={
        "json_output": True,
        "vision": True,
        "function_calling": True,
        "family": "qwen"
    }
)


@dataclass
class RiddleMessage:
    question_and_answer: str
    comments: str = None


class RiddleMakeAgent(RoutedAgent):
    def __init__(self, model: ChatCompletionClient):
        super().__init__("RiddleMakeAgent")

        self._prompt = SystemMessage(
            content=f"""
    ### 角色
    你是一个脑筋急转弯的出题助手

    ### 任务
    帮助我出脑筋急转弯的题目并给出相应的答案，注意不要和出过的题目重复

    ### 输出要求
    分别输出脑筋急转弯的题目和答案，不用输出其他描述性语言和思考过程
""")
        self._model = model

        self._model_context = BufferedChatCompletionContext(buffer_size=20)

    @message_handler
    async def handle_riddle_message(self, message: RiddleMessage, ctx: MessageContext) -> None:
        response = await self._model.create(
            messages=[self._prompt] + (await self._model_context.get_messages())
        )
        await self._model_context.add_message(AssistantMessage(content=response.content, source=self.metadata["type"]))

        await self.send_message(RiddleMessage(question_and_answer=response.content),
                                AgentId("RiddleReviewAgent", "default"))


class RiddleImproveAgent(RoutedAgent):

    def __init__(self, model: ChatCompletionClient):
        super().__init__("RiddleImproveAgent")

        self._prompt = SystemMessage(content="""
    ### 角色
    你是一个脑筋急转弯的改进助手

    ### 任务
    根据原始的脑筋急转弯题目和答案，以及审查出的改进意见，对题目进行改进

    ### 输出要求
    输出改进后的题目和答案

    """)
        self._model = model

    @message_handler
    async def handle_riddle_message(self, message: RiddleMessage, ctx: MessageContext) -> None:
        response = await self._model.create(
            messages=[self._prompt] + [UserMessage(content=f"""
    ### 原始题目和答案
    {message.question_and_answer}

    ### 改进意见
    {message.comments}""", source="user")]
        )
        await self.send_message(RiddleMessage(question_and_answer=response.content),
                                AgentId("RiddleReviewAgent", "default"))


class RiddleReviewAgent(RoutedAgent):

    def __init__(self, model: ChatCompletionClient):
        super().__init__("RiddleReviewAgent")

        self._prompt = SystemMessage(content="""
    ### 角色
    你是一个脑筋急转弯的题目审查助手

    ### 任务
    根据给定的脑筋急转弯题目和答案，分别从题目的合理性和趣味性进行审查

    ### 输出要求
    如果题目没有明细的问题，则输出“PASS”，否则不要输出“PASS”并依次给出需要改进的问题和改进意见

    ### 题目和答案
    """)
        self._model = model

    @message_handler
    async def handle_riddle_message(self, message: RiddleMessage, ctx: MessageContext) -> None:
        response = await self._model.create(
            messages=[self._prompt] + [UserMessage(content=message.question_and_answer, source="user")]
        )
        content = response.content
        if "PASS" in content.lower():
            await self.send_message(RiddleMessage(question_and_answer=message.question_and_answer),
                                    AgentId("RiddleUserAgent", "default"))
        else:
            await self.send_message(RiddleMessage(question_and_answer=message.question_and_answer, comments=content),
                                    AgentId("RiddleImproveAgent", "default"))


class RiddleUserAgent(RoutedAgent):

    def __init__(self):
        super().__init__("RiddleUserAgent")

    @message_handler
    async def handle_riddle_message(self, message: RiddleMessage, ctx: MessageContext) -> None:
        print(message.question_and_answer)


async def main():
    runtime = SingleThreadedAgentRuntime()
    await RiddleMakeAgent.register(runtime, "RiddleMakeAgent", lambda: RiddleMakeAgent(model))
    await RiddleReviewAgent.register(runtime, "RiddleReviewAgent", lambda: RiddleReviewAgent(model))
    await RiddleImproveAgent.register(runtime, "RiddleImproveAgent", lambda: RiddleImproveAgent(model))
    await RiddleUserAgent.register(runtime, "RiddleUserAgent", lambda: RiddleUserAgent())

    runtime.start()
    await runtime.send_message(RiddleMessage(question_and_answer=""), AgentId("RiddleMakeAgent", "default"))
    await runtime.send_message(RiddleMessage(question_and_answer=""), AgentId("RiddleMakeAgent", "default"))
    await runtime.stop_when_idle()


asyncio.run(main())
```

![画板](https://image.233377.xyz/2026/2d6a0ffdaad4d849b818d7bfd88eb2dc.jpeg)

3. 群聊模式: 

> 1. <font style="color:rgb(34, 40, 50);">首先，用户或外部代理</font>`GroupChatMessage`<font style="color:rgb(34, 40, 50);">向所有参与者的共同主题发布一条消息。</font>
> 2. `RequestToSpeak`<font style="color:rgb(34, 40, 50);">群聊管理器选择下一位发言者，并向该代理</font><font style="color:rgb(34, 40, 50);">发送消息。</font>
> 3. <font style="color:rgb(34, 40, 50);">代理</font>`GroupChatMessage`<font style="color:rgb(34, 40, 50);">收到消息后，向公共主题发布消息</font>`RequestToSpeak`<font style="color:rgb(34, 40, 50);">。</font>
> 4. <font style="color:rgb(34, 40, 50);">这个过程一直持续到群聊管理器达到终止条件，群聊管理器停止</font>`RequestToSpeak`<font style="color:rgb(34, 40, 50);">发消息，群聊结束。</font>



```python
import json
import string
import uuid
from typing import List

import openai
from autogen_core import (
    DefaultTopicId,
    FunctionCall,
    Image,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import FunctionTool
from autogen_ext.models.openai import OpenAIChatCompletionClient
from IPython.display import display  # type: ignore
from pydantic import BaseModel
from rich.console import Console
from rich.markdown import Markdown

"""
通过两个消息循环发送来处理
群聊管理者只订阅群聊的消息
其他agent订阅自己的消息和群聊的消息(群聊的消息是用来处理上下文)
启动的时候先发一个群聊消息
所有的agent都会收到消息但是只有群聊管理者调用了LLM
其他的agent做了上下文追加处理
管理者选出下一个执行agent并且发布一个消息
执行的agent接到消息并处理
处理完成发送一个群聊消息 直到返回指定的停止标
"""
class GroupChatMessage(BaseModel):
    body: UserMessage


class RequestToSpeak(BaseModel):
    pass


class BaseGroupChatAgent(RoutedAgent):
    """A group chat participant using an LLM."""

    def __init__(
            self,
            description: str,
            group_chat_topic_type: str,
            model_client: ChatCompletionClient,
            system_message: str,
    ) -> None:
        super().__init__(description=description)
        self._group_chat_topic_type = group_chat_topic_type
        self._model_client = model_client
        self._system_message = SystemMessage(content=system_message)
        self._chat_history: List[LLMMessage] = []

    @message_handler
    async def handle_message(self, message: GroupChatMessage, ctx: MessageContext) -> None:
        self._chat_history.extend(
            [
                UserMessage(content=f"Transferred to {message.body.source}", source="system"),
                message.body,
            ]
        )

    @message_handler
    async def handle_request_to_speak(self, message: RequestToSpeak, ctx: MessageContext) -> None:
        # print(f"\n{'-'*80}\n{self.id.type}:", flush=True)
        Console().print(Markdown(f"### {self.id.type}: "))
        self._chat_history.append(
            UserMessage(content=f"Transferred to {self.id.type}, adopt the persona immediately.", source="system")
        )
        completion = await self._model_client.create([self._system_message] + self._chat_history)
        assert isinstance(completion.content, str)
        self._chat_history.append(AssistantMessage(content=completion.content, source=self.id.type))
        Console().print(Markdown(completion.content))
        # print(completion.content, flush=True)
        await self.publish_message(
            GroupChatMessage(body=UserMessage(content=completion.content, source=self.id.type)),
            topic_id=DefaultTopicId(type=self._group_chat_topic_type),
        )


class WriterAgent(BaseGroupChatAgent):
    def __init__(self, description: str, group_chat_topic_type: str, model_client: ChatCompletionClient) -> None:
        super().__init__(
            description=description,
            group_chat_topic_type=group_chat_topic_type,
            model_client=model_client,
            system_message="You are a Writer. You produce good work.",
        )


class EditorAgent(BaseGroupChatAgent):
    def __init__(self, description: str, group_chat_topic_type: str, model_client: ChatCompletionClient) -> None:
        super().__init__(
            description=description,
            group_chat_topic_type=group_chat_topic_type,
            model_client=model_client,
            system_message="You are an Editor. Plan and guide the task given by the user. Provide critical feedbacks to the draft and illustration produced by Writer and Illustrator. "
                           "Approve if the task is completed and the draft and illustration meets user's requirements.",
        )


class IllustratorAgent(BaseGroupChatAgent):
    def __init__(
            self,
            description: str,
            group_chat_topic_type: str,
            model_client: ChatCompletionClient,
            image_client: openai.AsyncClient,
    ) -> None:
        super().__init__(
            description=description,
            group_chat_topic_type=group_chat_topic_type,
            model_client=model_client,
            system_message="You are an Illustrator. You use the generate_image tool to create images given user's requirement. "
                           "Make sure the images have consistent characters and style.",
        )
        self._image_client = image_client
        self._image_gen_tool = FunctionTool(
            self._image_gen, name="generate_image", description="Call this to generate an image. "
        )

    async def _image_gen(
            self, character_appearence: str, style_attributes: str, worn_and_carried: str, scenario: str
    ) -> str:
        prompt = f"Digital painting of a {character_appearence} character with {style_attributes}. Wearing {worn_and_carried}, {scenario}."
        response = await self._image_client.images.generate(
            prompt=prompt, model="dall-e-3", response_format="b64_json", size="1024x1024"
        )
        return response.data[0].b64_json  # type: ignore

    @message_handler
    async def handle_request_to_speak(self, message: RequestToSpeak,
                                      ctx: MessageContext) -> None:  # type: ignore
        Console().print(Markdown(f"### {self.id.type}: "))
        self._chat_history.append(
            UserMessage(content=f"Transferred to {self.id.type}, adopt the persona immediately.",
                        source="system")
        )
        # Ensure that the image generation tool is used.
        completion = await self._model_client.create(
            [self._system_message] + self._chat_history,
            tools=[self._image_gen_tool],
            extra_create_args={"tool_choice": "required"},
            cancellation_token=ctx.cancellation_token,
        )
        assert isinstance(completion.content, list) and all(
            isinstance(item, FunctionCall) for item in completion.content
        )
        images: List[str | Image] = []
        for tool_call in completion.content:
            arguments = json.loads(tool_call.arguments)
            Console().print(arguments)
            result = await self._image_gen_tool.run_json(arguments, ctx.cancellation_token)
            image = Image.from_base64(self._image_gen_tool.return_value_as_string(result))
            image = Image.from_pil(image.image.resize((256, 256)))
            display(image.image)  # type: ignore
            images.append(image)
        await self.publish_message(
            GroupChatMessage(body=UserMessage(content=images, source=self.id.type)),
            DefaultTopicId(type=self._group_chat_topic_type),
        )


class UserAgent(RoutedAgent):
    def __init__(self, description: str, group_chat_topic_type: str) -> None:
        super().__init__(description=description)
        self._group_chat_topic_type = group_chat_topic_type

    @message_handler
    async def handle_message(self, message: GroupChatMessage, ctx: MessageContext) -> None:
        # When integrating with a frontend, this is where group chat message would be sent to the frontend.
        pass

    @message_handler
    async def handle_request_to_speak(self, message: RequestToSpeak, ctx: MessageContext) -> None:
        user_input = input("Enter your message, type 'APPROVE' to conclude the task: ")
        Console().print(Markdown(f"### User: \n{user_input}"))
        await self.publish_message(
            GroupChatMessage(body=UserMessage(content=user_input, source=self.id.type)),
            DefaultTopicId(type=self._group_chat_topic_type),
        )


class GroupChatManager(RoutedAgent):
    def __init__(
            self,
            participant_topic_types: List[str],
            model_client: ChatCompletionClient,
            participant_descriptions: List[str],
    ) -> None:
        super().__init__("Group chat manager")
        self._participant_topic_types = participant_topic_types
        self._model_client = model_client
        self._chat_history: List[UserMessage] = []
        self._participant_descriptions = participant_descriptions
        self._previous_participant_topic_type: str | None = None

    @message_handler
    async def handle_message(self, message: GroupChatMessage, ctx: MessageContext) -> None:
        assert isinstance(message.body, UserMessage)
        self._chat_history.append(message.body)
        # If the message is an approval message from the user, stop the chat.
        if message.body.source == "User":
            assert isinstance(message.body.content, str)
            if message.body.content.lower().strip(string.punctuation).endswith("approve"):
                return
        # Format message history.
        messages: List[str] = []
        for msg in self._chat_history:
            if isinstance(msg.content, str):
                messages.append(f"{msg.source}: {msg.content}")
            elif isinstance(msg.content, list):
                line: List[str] = []
                for item in msg.content:
                    if isinstance(item, str):
                        line.append(item)
                    else:
                        line.append("[Image]")
                messages.append(f"{msg.source}: {', '.join(line)}")
        history = "\n".join(messages)
        # Format roles.
        roles = "\n".join(
            [
                f"{topic_type}: {description}".strip()
                for topic_type, description in zip(
                self._participant_topic_types, self._participant_descriptions, strict=True
            )
                if topic_type != self._previous_participant_topic_type
            ]
        )
        selector_prompt = """You are in a role play game. The following roles are available:
        {roles}.
        Read the following conversation. Then select the next role from {participants} to play. Only return the role.

        {history}

        Read the above conversation. Then select the next role from {participants} to play. Only return the role.
        """
        system_message = SystemMessage(
            content=selector_prompt.format(
                roles=roles,
                history=history,
                participants=str(
                    [
                        topic_type
                        for topic_type in self._participant_topic_types
                        if topic_type != self._previous_participant_topic_type
                    ]
                ),
            )
        )
        completion = await self._model_client.create([system_message],
                                                     cancellation_token=ctx.cancellation_token)
        assert isinstance(completion.content, str)
        selected_topic_type: str
        for topic_type in self._participant_topic_types:
            if topic_type.lower() in completion.content.lower():
                selected_topic_type = topic_type
                self._previous_participant_topic_type = selected_topic_type
                await self.publish_message(RequestToSpeak(), DefaultTopicId(type=selected_topic_type))
                return
        raise ValueError(f"Invalid role selected: {completion.content}")


async def main():
    #每个参与者代理都订阅群聊主题和自己的主题以接收RequestToSpeak消息，而群聊管理器代理仅订阅群聊主题。

    runtime = SingleThreadedAgentRuntime()

    editor_topic_type = "Editor"
    writer_topic_type = "Writer"
    illustrator_topic_type = "Illustrator"
    user_topic_type = "User"
    group_chat_topic_type = "group_chat"

    editor_description = "Editor for planning and reviewing the content."
    writer_description = "Writer for creating any text content."
    user_description = "User for providing final approval."
    illustrator_description = "An illustrator for creating images."

    editor_agent_type = await EditorAgent.register(
        runtime,
        editor_topic_type,  # Using topic type as the agent type.
        lambda: EditorAgent(
            description=editor_description,
            group_chat_topic_type=group_chat_topic_type,
            model_client=OpenAIChatCompletionClient(
                model="gpt-4o-2024-08-06",
                # api_key="YOUR_API_KEY",
            ),
        ),
    )
    await runtime.add_subscription(TypeSubscription(topic_type=editor_topic_type, agent_type=editor_agent_type.type))
    await runtime.add_subscription(
        TypeSubscription(topic_type=group_chat_topic_type, agent_type=editor_agent_type.type))

    writer_agent_type = await WriterAgent.register(
        runtime,
        writer_topic_type,  # Using topic type as the agent type.
        lambda: WriterAgent(
            description=writer_description,
            group_chat_topic_type=group_chat_topic_type,
            model_client=OpenAIChatCompletionClient(
                model="gpt-4o-2024-08-06",
                # api_key="YOUR_API_KEY",
            ),
        ),
    )
    await runtime.add_subscription(TypeSubscription(topic_type=writer_topic_type, agent_type=writer_agent_type.type))
    await runtime.add_subscription(
        TypeSubscription(topic_type=group_chat_topic_type, agent_type=writer_agent_type.type))

    illustrator_agent_type = await IllustratorAgent.register(
        runtime,
        illustrator_topic_type,
        lambda: IllustratorAgent(
            description=illustrator_description,
            group_chat_topic_type=group_chat_topic_type,
            model_client=OpenAIChatCompletionClient(
                model="gpt-4o-2024-08-06",
                # api_key="YOUR_API_KEY",
            ),
            image_client=openai.AsyncClient(
                # api_key="YOUR_API_KEY",
            ),
        ),
    )
    await runtime.add_subscription(
        TypeSubscription(topic_type=illustrator_topic_type, agent_type=illustrator_agent_type.type)
    )
    await runtime.add_subscription(
        TypeSubscription(topic_type=group_chat_topic_type, agent_type=illustrator_agent_type.type)
    )

    user_agent_type = await UserAgent.register(
        runtime,
        user_topic_type,
        lambda: UserAgent(description=user_description, group_chat_topic_type=group_chat_topic_type),
    )
    await runtime.add_subscription(TypeSubscription(topic_type=user_topic_type, agent_type=user_agent_type.type))
    await runtime.add_subscription(TypeSubscription(topic_type=group_chat_topic_type, agent_type=user_agent_type.type))

    group_chat_manager_type = await GroupChatManager.register(
        runtime,
        "group_chat_manager",
        lambda: GroupChatManager(
            participant_topic_types=[writer_topic_type, illustrator_topic_type, editor_topic_type, user_topic_type],
            model_client=OpenAIChatCompletionClient(
                model="gpt-4o-2024-08-06",
                # api_key="YOUR_API_KEY",
            ),
            participant_descriptions=[writer_description, illustrator_description, editor_description,
                                      user_description],
        ),
    )
    await runtime.add_subscription(
        TypeSubscription(topic_type=group_chat_topic_type, agent_type=group_chat_manager_type.type)
    )
    runtime.start()
    session_id = str(uuid.uuid4())
    await runtime.publish_message(
        GroupChatMessage(
            body=UserMessage(
                content="Please write a short story about the gingerbread man with up to 3 photo-realistic illustrations.",
                source="User",
            )
        ),
        TopicId(type=group_chat_topic_type, source=session_id),
    )
    await runtime.stop_when_idle()
```

![画板](https://image.233377.xyz/2026/043028dffc3a5fb22f97c707628d1ba4.jpeg)

4. 交接模式

<font style="color:rgb(34, 40, 50);">考虑这样一个客户服务场景：客户试图从聊天机器人那里获得产品退款或购买新产品。聊天机器人是一个由三个 AI 代理和一个人类代理组成的多代理团队：</font>

+ <font style="color:rgb(34, 40, 50);">分类代理，负责了解客户的请求并决定将其交给哪些其他代理。</font>
+ <font style="color:rgb(34, 40, 50);">退款代理，负责处理退款请求。</font>
+ <font style="color:rgb(34, 40, 50);">销售代理，负责处理销售请求。</font>
+ <font style="color:rgb(34, 40, 50);">人类代理，负责处理人工智能代理无法处理的复杂请求。</font>

<font style="color:rgb(34, 40, 50);">在这种情况下，客户通过用户代理与聊天机器人进行交互。</font>

<font style="color:rgb(34, 40, 50);">下图展示了此场景中代理的交互拓扑。</font>

```python
import json
import uuid
from typing import List, Tuple
# 交接模式
from autogen_core import (
    FunctionCall,
    MessageContext,
    RoutedAgent,
    SingleThreadedAgentRuntime,
    TopicId,
    TypeSubscription,
    message_handler,
)
from autogen_core.models import (
    AssistantMessage,
    ChatCompletionClient,
    FunctionExecutionResult,
    FunctionExecutionResultMessage,
    LLMMessage,
    SystemMessage,
    UserMessage,
)
from autogen_core.tools import FunctionTool, Tool
from autogen_ext.models.openai import OpenAIChatCompletionClient
from pydantic import BaseModel


class UserLogin(BaseModel):
    pass


class UserTask(BaseModel):
    context: List[LLMMessage]


class AgentResponse(BaseModel):
    reply_to_topic_type: str
    context: List[LLMMessage]


class AIAgent(RoutedAgent):
    def __init__(
            self,
            description: str,
            system_message: SystemMessage,
            model_client: ChatCompletionClient,
            tools: List[Tool],
            delegate_tools: List[Tool],
            agent_topic_type: str,
            user_topic_type: str,
    ) -> None:
        super().__init__(description)
        self._system_message = system_message
        self._model_client = model_client
        self._tools = dict([(tool.name, tool) for tool in tools])
        self._tool_schema = [tool.schema for tool in tools]
        self._delegate_tools = dict([(tool.name, tool) for tool in delegate_tools])
        self._delegate_tool_schema = [tool.schema for tool in delegate_tools]
        self._agent_topic_type = agent_topic_type
        self._user_topic_type = user_topic_type

    def execute_order(product: str, price: int) -> str:
        print("\n\n=== Order Summary ===")
        print(f"Product: {product}")
        print(f"Price: ${price}")
        print("=================\n")
        confirm = input("Confirm order? y/n: ").strip().lower()
        if confirm == "y":
            print("Order execution successful!")
            return "Success"
        else:
            print("Order cancelled!")
            return "User cancelled order."

    def look_up_item(search_query: str) -> str:
        item_id = "item_132612938"
        print("Found item:", item_id)
        return item_id

    def execute_refund(item_id: str, reason: str = "not provided") -> str:
        print("\n\n=== Refund Summary ===")
        print(f"Item ID: {item_id}")
        print(f"Reason: {reason}")
        print("=================\n")
        print("Refund execution successful!")
        return "success"

    execute_order_tool = FunctionTool(execute_order, description="Price should be in USD.")
    look_up_item_tool = FunctionTool(
        look_up_item, description="Use to find item ID.\nSearch query can be a description or keywords."
    )
    execute_refund_tool = FunctionTool(execute_refund, description="")

    @message_handler
    async def handle_task(self, message: UserTask, ctx: MessageContext) -> None:
        # Send the task to the LLM.
        llm_result = await self._model_client.create(
            messages=[self._system_message] + message.context,
            tools=self._tool_schema + self._delegate_tool_schema,
            cancellation_token=ctx.cancellation_token,
        )
        print(f"{'-' * 80}\n{self.id.type}:\n{llm_result.content}", flush=True)
        # Process the LLM result.
        while isinstance(llm_result.content, list) and all(isinstance(m, FunctionCall) for m in llm_result.content):
            tool_call_results: List[FunctionExecutionResult] = []
            delegate_targets: List[Tuple[str, UserTask]] = []
            # Process each function call.
            for call in llm_result.content:
                arguments = json.loads(call.arguments)
                if call.name in self._tools:
                    # Execute the tool directly.
                    result = await self._tools[call.name].run_json(arguments, ctx.cancellation_token)
                    result_as_str = self._tools[call.name].return_value_as_string(result)
                    tool_call_results.append(
                        FunctionExecutionResult(call_id=call.id, content=result_as_str, is_error=False, name=call.name)
                    )
                elif call.name in self._delegate_tools:
                    # Execute the tool to get the delegate agent's topic type.
                    result = await self._delegate_tools[call.name].run_json(arguments, ctx.cancellation_token)
                    topic_type = self._delegate_tools[call.name].return_value_as_string(result)
                    # Create the context for the delegate agent, including the function call and the result.
                    delegate_messages = list(message.context) + [
                        AssistantMessage(content=[call], source=self.id.type),
                        FunctionExecutionResultMessage(
                            content=[
                                FunctionExecutionResult(
                                    call_id=call.id,
                                    content=f"Transferred to {topic_type}. Adopt persona immediately.",
                                    is_error=False,
                                    name=call.name,
                                )
                            ]
                        ),
                    ]
                    delegate_targets.append((topic_type, UserTask(context=delegate_messages)))
                else:
                    raise ValueError(f"Unknown tool: {call.name}")
            if len(delegate_targets) > 0:
                # Delegate the task to other agents by publishing messages to the corresponding topics.
                for topic_type, task in delegate_targets:
                    print(f"{'-' * 80}\n{self.id.type}:\nDelegating to {topic_type}", flush=True)
                    await self.publish_message(task, topic_id=TopicId(topic_type, source=self.id.key))
            if len(tool_call_results) > 0:
                print(f"{'-' * 80}\n{self.id.type}:\n{tool_call_results}", flush=True)
                # Make another LLM call with the results.
                message.context.extend(
                    [
                        AssistantMessage(content=llm_result.content, source=self.id.type),
                        FunctionExecutionResultMessage(content=tool_call_results),
                    ]
                )
                llm_result = await self._model_client.create(
                    messages=[self._system_message] + message.context,
                    tools=self._tool_schema + self._delegate_tool_schema,
                    cancellation_token=ctx.cancellation_token,
                )
                print(f"{'-' * 80}\n{self.id.type}:\n{llm_result.content}", flush=True)
            else:
                # The task has been delegated, so we are done.
                return
        # The task has been completed, publish the final result.
        assert isinstance(llm_result.content, str)
        message.context.append(AssistantMessage(content=llm_result.content, source=self.id.type))
        await self.publish_message(
            AgentResponse(context=message.context, reply_to_topic_type=self._agent_topic_type),
            topic_id=TopicId(self._user_topic_type, source=self.id.key),
        )


class HumanAgent(RoutedAgent):
    def __init__(self, description: str, agent_topic_type: str, user_topic_type: str) -> None:
        super().__init__(description)
        self._agent_topic_type = agent_topic_type
        self._user_topic_type = user_topic_type

    @message_handler
    async def handle_user_task(self, message: UserTask, ctx: MessageContext) -> None:
        human_input = input("Human agent input: ")
        print(f"{'-' * 80}\n{self.id.type}:\n{human_input}", flush=True)
        message.context.append(AssistantMessage(content=human_input, source=self.id.type))
        await self.publish_message(
            AgentResponse(context=message.context, reply_to_topic_type=self._agent_topic_type),
            topic_id=TopicId(self._user_topic_type, source=self.id.key),
        )


class UserAgent(RoutedAgent):
    def __init__(self, description: str, user_topic_type: str, agent_topic_type: str) -> None:
        super().__init__(description)
        self._user_topic_type = user_topic_type
        self._agent_topic_type = agent_topic_type

    @message_handler
    async def handle_user_login(self, message: UserLogin, ctx: MessageContext) -> None:
        print(f"{'-' * 80}\nUser login, session ID: {self.id.key}.", flush=True)
        # Get the user's initial input after login.
        user_input = input("User: ")
        print(f"{'-' * 80}\n{self.id.type}:\n{user_input}")
        await self.publish_message(
            UserTask(context=[UserMessage(content=user_input, source="User")]),
            topic_id=TopicId(self._agent_topic_type, source=self.id.key),
        )

    @message_handler
    async def handle_task_result(self, message: AgentResponse, ctx: MessageContext) -> None:
        # Get the user's input after receiving a response from an agent.
        user_input = input("User (type 'exit' to close the session): ")
        print(f"{'-' * 80}\n{self.id.type}:\n{user_input}", flush=True)
        if user_input.strip().lower() == "exit":
            print(f"{'-' * 80}\nUser session ended, session ID: {self.id.key}.")
            return
        message.context.append(UserMessage(content=user_input, source="User"))
        await self.publish_message(
            UserTask(context=message.context), topic_id=TopicId(message.reply_to_topic_type, source=self.id.key)
        )


async def  main():
    sales_agent_topic_type = "SalesAgent"
    issues_and_repairs_agent_topic_type = "IssuesAndRepairsAgent"
    triage_agent_topic_type = "TriageAgent"
    human_agent_topic_type = "HumanAgent"
    user_topic_type = "User"
    runtime = SingleThreadedAgentRuntime()

    model_client = OpenAIChatCompletionClient(
        model="gpt-4o-mini",
        # api_key="YOUR_API_KEY",
    )

    # Register the triage agent.
    triage_agent_type = await AIAgent.register(
        runtime,
        type=triage_agent_topic_type,  # Using the topic type as the agent type.
        factory=lambda: AIAgent(
            description="A triage agent.",
            system_message=SystemMessage(
                content="You are a customer service bot for ACME Inc. "
                        "Introduce yourself. Always be very brief. "
                        "Gather information to direct the customer to the right department. "
                        "But make your questions subtle and natural."
            ),
            model_client=model_client,
            tools=[],
            delegate_tools=[
                transfer_to_issues_and_repairs_tool,
                transfer_to_sales_agent_tool,
                escalate_to_human_tool,
            ],
            agent_topic_type=triage_agent_topic_type,
            user_topic_type=user_topic_type,
        ),
    )
    # Add subscriptions for the triage agent: it will receive messages published to its own topic only.
    await runtime.add_subscription(
        TypeSubscription(topic_type=triage_agent_topic_type, agent_type=triage_agent_type.type))

    # Register the sales agent.
    sales_agent_type = await AIAgent.register(
        runtime,
        type=sales_agent_topic_type,  # Using the topic type as the agent type.
        factory=lambda: AIAgent(
            description="A sales agent.",
            system_message=SystemMessage(
                content="You are a sales agent for ACME Inc."
                        "Always answer in a sentence or less."
                        "Follow the following routine with the user:"
                        "1. Ask them about any problems in their life related to catching roadrunners.\n"
                        "2. Casually mention one of ACME's crazy made-up products can help.\n"
                        " - Don't mention price.\n"
                        "3. Once the user is bought in, drop a ridiculous price.\n"
                        "4. Only after everything, and if the user says yes, "
                        "tell them a crazy caveat and execute their order.\n"
                        ""
            ),
            model_client=model_client,
            tools=[execute_order_tool],
            delegate_tools=[transfer_back_to_triage_tool],
            agent_topic_type=sales_agent_topic_type,
            user_topic_type=user_topic_type,
        ),
    )
    # Add subscriptions for the sales agent: it will receive messages published to its own topic only.
    await runtime.add_subscription(
        TypeSubscription(topic_type=sales_agent_topic_type, agent_type=sales_agent_type.type))

    # Register the issues and repairs agent.
    issues_and_repairs_agent_type = await AIAgent.register(
        runtime,
        type=issues_and_repairs_agent_topic_type,  # Using the topic type as the agent type.
        factory=lambda: AIAgent(
            description="An issues and repairs agent.",
            system_message=SystemMessage(
                content="You are a customer support agent for ACME Inc."
                        "Always answer in a sentence or less."
                        "Follow the following routine with the user:"
                        "1. First, ask probing questions and understand the user's problem deeper.\n"
                        " - unless the user has already provided a reason.\n"
                        "2. Propose a fix (make one up).\n"
                        "3. ONLY if not satisfied, offer a refund.\n"
                        "4. If accepted, search for the ID and then execute refund."
            ),
            model_client=model_client,
            tools=[
                execute_refund_tool,
                look_up_item_tool,
            ],
            delegate_tools=[transfer_back_to_triage_tool],
            agent_topic_type=issues_and_repairs_agent_topic_type,
            user_topic_type=user_topic_type,
        ),
    )
    # Add subscriptions for the issues and repairs agent: it will receive messages published to its own topic only.
    await runtime.add_subscription(
        TypeSubscription(topic_type=issues_and_repairs_agent_topic_type, agent_type=issues_and_repairs_agent_type.type)
    )

    # Register the human agent.
    human_agent_type = await HumanAgent.register(
        runtime,
        type=human_agent_topic_type,  # Using the topic type as the agent type.
        factory=lambda: HumanAgent(
            description="A human agent.",
            agent_topic_type=human_agent_topic_type,
            user_topic_type=user_topic_type,
        ),
    )
    # Add subscriptions for the human agent: it will receive messages published to its own topic only.
    await runtime.add_subscription(
        TypeSubscription(topic_type=human_agent_topic_type, agent_type=human_agent_type.type))

    # Register the user agent.
    user_agent_type = await UserAgent.register(
        runtime,
        type=user_topic_type,
        factory=lambda: UserAgent(
            description="A user agent.",
            user_topic_type=user_topic_type,
            agent_topic_type=triage_agent_topic_type,  # Start with the triage agent.
        ),
    )
    # Add subscriptions for the user agent: it will receive messages published to its own topic only.
    await runtime.add_subscription(TypeSubscription(topic_type=user_topic_type, agent_type=user_agent_type.type))
    # Start the runtime.
    runtime.start()

    # Create a new session for the user.
    session_id = str(uuid.uuid4())
    await runtime.publish_message(UserLogin(), topic_id=TopicId(user_topic_type, source=session_id))

    # Run until completion.
    await runtime.stop_when_idle()
```

![画板](https://image.233377.xyz/2026/88805108d51278eafeef6e54c5c1329e.jpeg)

5. 辩论模式
6. 混合模式





### autoGPT

官方文档 [https://github.com/Significant-Gravitas/Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT)

> <font style="color:rgb(0, 128, 255) !important;">一句话解释:一个有agent,可编排的,过于依赖ChatGPT的技术框架</font>

![](https://image.233377.xyz/2026/6d1e079f3c7d5e9aca7401243d6af522.png)

优点:

<font style="color:rgb(51, 51, 51);">A</font><font style="color:rgb(64, 64, 64);">uto-GPT的核心能力是Auto，也就是自主、自动化的人工智能。他允许 AI “自主”行动，而无需用户提示每个操作。他会分析你给对定的目标，然后逐步拆借采取措施（模型递归调用或其他API）来实现该目标。</font>

> <font style="color:rgb(64, 64, 64);">说白了每个框架都是这个作用</font>

缺点:

过于依赖ChatGPT,底层基座不能快速切换







### metaGPT

<font style="color:rgb(34, 35, 40);">简介</font>

<font style="color:rgb(64, 64, 64);">1.</font><font style="color:rgb(0, 0, 0);">定位：可以完成一句话需求到完整代码仓库的构建，类似autogpt和autogen，用于完成高复杂度的任务</font>

<font style="color:rgb(64, 64, 64);">2.</font><font style="color:rgb(0, 0, 0);">实现原理：做了产品经理，架构师，工程师等Agent，然后多个agent互相协作，完成一个复杂需求</font>

<font style="color:rgb(64, 64, 64);">3.</font><font style="color:rgb(0, 0, 0);">metaGPT和Meta公司没什么关系，是国内一家公司做的</font>

> <font style="color:rgb(0, 0, 0);">一句话总结:一个可编排的,有agent的,可以实现特定agent协作方式的技术前沿agent框架</font>

![](https://image.233377.xyz/2026/a89f444cf94d7d57f091ce3bb56b4c4e.png)



### metaGen

### babyAGI

一句话解释：基于LLM的**自主任务处理框架**, 通过动态任务排序和闭环循环实现自动化目标推进的单Agent系统

> + <font style="color:rgb(19, 19, 19);">Github Repo</font>
>   - [https://github.com/yoheinakajima/babyagi_archive](https://github.com/yoheinakajima/babyagi_archive) <font style="color:rgb(31, 35, 40);">（2024年9月快照）</font>
>   - [https://github.com/yoheinakajima/babyagi](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa2x6bGJrWmVsQm9vUVJDY1h6Z3JFV19xbzdsd3xBQ3Jtc0tuOTNUeTNqNUNDT1I2Y0ZVTzRMMWRXT0RjT3FiZDZaWno5X2JVV042RzEyT01wdENQazJIOThTcVlWd3ZpMF9FcEYwQnZmcWlGYU14b2JXSV9IUDFtdVd0emtKa3E2aXVCdWpQYkltT1hRLXVkWjRUOA&q=https%3A%2F%2Fgithub.com%2Fyoheinakajima%2Fbabyagi&v=pAtguEz7CBs) (最新, <font style="color:rgb(31, 35, 40);">并不是为了生产使用)</font>
> + Doc
>   - [https://github.com/yoheinakajima/babyagi_archive/blob/main/docs/README-cn.md](https://github.com/yoheinakajima/babyagi_archive/blob/main/docs/README-cn.md) (操作文档)
>   - [https://yoheinakajima.com/birth-of-babyagi](about:blank)<font style="color:rgba(0, 0, 0, 0.9);"> (Blog)</font>
>
> **Web UI **(**<font style="color:rgb(31, 35, 40);">repository has been archived)</font>**
>
> + <font style="color:rgb(19, 19, 19);">Github Repo - </font>[https://github.com/miurla/babyagi-ui](https://github.com/miurla/babyagi-ui)





概述：

**概述**: **该系统使用 OpenAI 和 Pinecone API 来创建任务、确定任务的优先级和执行任务**。该系统背后的主要思想是它**根据先前任务的结果和预定义的目标创建任务**。然后，该脚本使用 OpenAI 的自然语言处理 (NLP) 功能根据目标创建新任务，并使用 Pinecone 存储和检索上下文的任务结果

**流程**: 当用户给定一个目标后，BabyAGI会形成任务列表，然后从列表中选取优先级最高的任务，使用OpenAI API将任务发送到执行代理完成。任务完成后，结果会被存储在内存或向量数据库中，接着根据目标和上一个任务的结果创建新任务并重新确定优先级。这种循环往复的过程使得BabyAGI能够不断适应任务的进展情况，逐步实现最终目标。

**优势**: <font style="color:#DF2A3F;">目标导向</font>。像<font style="color:#DF2A3F;">婴儿</font>一样循序渐进学习，能够根据给定的任务或目标，自主地进行决策、规划和执行一系列操作，以实现预期的结果。这种自主性使得它们能够在真实世界的各种复杂场景中发挥作用，而不仅仅局限于模拟环境。

1. 极简（单任务队列+循环）且代码量极小
2. 任务优先级排序模块是一个比较独特的feature，相对于其他agent

**劣势**: <font style="color:rgb(51, 51, 51);">复杂逻辑处理能力较弱，对Prompt设计质量依赖度高</font>



<font style="color:rgb(25, 26, 36);">准备工作</font>

1. <font style="color:rgb(31, 35, 40);">【API Key】在 OPENAI_API_KEY, OPENAPI_API_MODEL 和 PINECONE_API_KEY 变量中设置 OpenAI 和 Pinecone API 密钥.</font>
   1. OPENAI_API_KEY ---> 支持的模型: 所有 OpenAI 模型, 以及 Llama (通过 Llama.cp)
   2. PINECONE_API_KEY ---> 向量搜索引擎 embedding model : 目前默认是PINECONE, 之前有[Chroma](https://docs.trychroma.com/)<font style="color:rgb(31, 35, 40);">/</font>[Weaviate](https://weaviate.io/)   
      代码体现: `results_storage = try_weaviate() or try_pinecone() or use_chroma()`
2. <font style="color:rgb(31, 35, 40);">【运行参数】在 TABLE_NAME 变量中设置存储任务结果的表的名称. 3.（可选）在 OBJECTIVE 变量中设置任务管理系统的目标. 4.（可选）在 INITIAL_TASK 变量中设置系统的第一个任务.       所有可选值也可以在命令行中指定</font>



工作原理：

<font style="color:rgb(31, 35, 40);">通过运行</font>**<font style="color:rgb(31, 35, 40);">无限循环</font>**<font style="color:rgb(31, 35, 40);">来执行以下步骤：</font>

1. <font style="color:rgb(31, 35, 40);">从任务列表中拉出第一个任务。</font>
2. <font style="color:rgb(31, 35, 40);">将任务发送给执行代理，该执行代理使用OpenAI的API根据上下文来完成任务。</font>
3. <font style="color:rgb(31, 35, 40);">丰富结果并将其存储在</font>[Chroma](https://docs.trychroma.com/)<font style="color:rgb(31, 35, 40);">/</font>[Weaviate](https://weaviate.io/)/PINECONE <font style="color:rgb(31, 35, 40);">中。</font>
4. <font style="color:rgb(31, 35, 40);">根据先前任务的目标和结果来创建新任务并重新确定任务列表。</font>

![](https://image.233377.xyz/2026/093e765d134519f0e39fad19a1910a70.png)



BabyAGI 核心代码

> <font style="color:rgb(25, 26, 36);">执行 Agent → 任务创建 Agent → 优先级排序 Agent → 执行 Agent ...</font>
>
> 纯 Prompt 工程驱动

```python
while not task_queue.empty():
    current_task = get_highest_priority_task()
    result = execution_agent(OBJECTIVE, current_task)
    store_result(result)
    new_tasks = task_creation_agent(objective, result)
    prioritization_agent()
```

| 作用                                                         | 文字描述                                                     | 代码                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 任务执行                                                     | 任务执行由**<font style="color:#DF2A3F;">execution_agent</font>**()函数负责。该函数接受**目标和任务作为参数**，向OpenAI API发送提示，并返回任务的结果。执行过程中，系统会利用OpenAI的NLP能力理解任务内容，并基于上下文信息完成任务。执行结果随后被整理并存储在Pinecone向量数据库中，以便后续分析和利用。<br/>+ **<font style="color:rgb(51, 51, 51);">上下文传递</font>**<font style="color:rgb(51, 51, 51);">：通过</font>`<font style="color:rgb(51, 51, 51);">context_agent</font>`<font style="color:rgb(51, 51, 51);">维护全局状态，避免信息孤岛</font> | Prompt 文案<br/>![](https://image.233377.xyz/2026/aa66005d447fe7727ba7b12de77ab643.png) |
| 任务生成                                                     | BabyAGI的核心功能之一是任务生成。它通过**<font style="color:#DF2A3F;">task_creation_agent</font>****()**函数实现，该函数利用OpenAI的API，基于当前目标和前一个任务的结果来创建新任务。任务生成过程中，系统会向OpenAI发送一个包含目标、前一个任务结果、任务描述和当前任务列表的提示（prompt），OpenAI则返回一组**新任务**的字符串。这些新任务随后被转换为字典列表形式，并存储在任务列表中。<br/>+ **<font style="color:rgb(51, 51, 51);">完全依赖 LLM 的推理能力</font>** | Prompt 文案   ![](https://image.233377.xyz/2026/756cc589b51e69a1fbaf70a7d272e9e7.png) |
| 优先级排序                                                   | BabyAGI还具备任务优先级排序功能。**<font style="color:#DF2A3F;">prioritization_agent</font>**()函数根据当前任务的ID和预定义的目标，向OpenAI API发送提示，请求重新排列任务列表的优先级。OpenAI返回重新排序后的任务列表，系统据此更新任务列表的优先级。<br/>+ **<font style="color:rgb(51, 51, 51);">利用 LLM 实时调整任务队列的优先级 (</font>**<font style="color:rgb(51, 51, 51);">每个循环都会重新排序任务队列</font>**<font style="color:rgb(51, 51, 51);">)</font>** | Prompt 文案<br/>![](https://image.233377.xyz/2026/69272d94499dedd2d6806eb2144cd86f.png) |
| 特点:<br/>+ <font style="color:rgb(51, 51, 51);">采用</font>**<font style="color:rgb(51, 51, 51);">中心化任务队列驱动</font>**<font style="color:rgb(51, 51, 51);">的循环（</font>`<font style="color:rgb(51, 51, 51);">While loop + Priority queue</font>`<font style="color:rgb(51, 51, 51);">）</font><br/>+ **<font style="color:rgb(51, 51, 51);">链式协作</font>**<font style="color:rgb(51, 51, 51);">：严格按优先级顺序执行，前序任务的输出作为后续任务的输入</font> |                                                              |                                                              |


```java
task_creation_agent
你是一个任务创建人工智能，使用执行代理的结果来创建新任务，
其目标如下：{目标}。最近完成的任务的结果是：{结果}。
该结果是基于以下任务描述的：{任务描述}。这些是未完成的任务：
{', '.join(task_list)}。根据结果，创建新的任务以供AI系统完成，
不要与未完成的任务重叠。将任务作为数组返回。

prioritization_agent
你是一个任务优先级人工智能，负责清理和重新优先处理以下任务：
{task_names}。请考虑你的团队的最终目标：{OBJECTIVE}。
不要删除任何任务。将结果作为编号列表返回，例如：
#. 第一个任务
#. 第二个任务
以编号 {next_task_id} 开始任务列表。

execution_agent
您是一款基于以下目标执行任务的人工智能：{objective}。
考虑到这些先前已完成的任务：{context}。
您的任务：{task}
响应：
```





示例描述：

<font style="color:rgb(37, 41, 51);">它结合了OpenAI GPT-4和Pinecone向量搜索引擎的力量，以自动完成和管理一系列任务，从一个初始任务开始，babyagi使用GPT4生成解决方案和新任务，并将解决方案存储在Pinecone中以便进一步检索。</font>

![画板](https://image.233377.xyz/2026/3a51fa5956067252391ab7674019be22.jpeg)

大致执行过程如下：

+ 有用户指定需要解决的问题也就是`Objective`，比如<如何解决世界饥荒问题>
+ 根据用户给出的问题创建第一个需要解决的任务并插入系统任务列表当中：一个关于解决<如何解决世界饥荒问题>的任务列表
+ 向OpenAI GPT-4发送一个请求，以获取如何解决世界饥饿问题的任务列表。请求时，提供目标（`Objective`）和第一个任务（`First Task`）
+ 将OpenAI GPT-4生成的任务及其相关信息保存到Pinecone向量索引中
+ 从Pinecone向量索引中检索任务及其相关信息，并将结果打印到控制台
+ 继续提取任务进行执行，直到GPT-4无法生成新任务为止。换句话说，当GPT-4生成的任务已经在`tasks`列表中时，程序将中止。这意味着所有已分配的任务已经解决，不再有新任务生成



**babyagi Agent设计模式分析**

1. PE(Plan & Execute) - 将任务拆成子任务再按优先级执行

2. ReAct - 任务优先级排序体现了ReAct模式中"Observation→Thought→Action"的循环反馈机制







### hunggingGPT

一句话解释: 一个基于LLM的**智能任务调度框架**, 通过将ChatGPT作为核心控制器，协调调用Hugging Face平台上的多个专家模型（如文本生成、图像处理、语音识别等），完成复杂多模态任务的规划、执行和结果集成。

**<font style="color:rgb(24, 25, 28);">Hugging</font>**<font style="color:rgb(24, 25, 28);">GPT作为一个</font><font style="color:#DF2A3F;">连接器</font><font style="color:rgb(24, 25, 28);">，一端连接着大语言模型，另一端连接着N个处理不同任务的AI模型</font>

> **<font style="color:rgb(24, 25, 28);">论文地址</font>**<font style="color:rgb(24, 25, 28);">：</font>[https://arxiv.org/abs/2303.17580](https://arxiv.org/abs/2303.17580)
>
> **<font style="color:rgba(0, 0, 0, 0.9);">Github Repo :</font>**<font style="color:rgba(0, 0, 0, 0.9);"> </font>[https://github.com/microsoft/**<font style="color:#DF2A3F;">JARVIS</font>**](https://github.com/microsoft/JARVIS)
>
> **<font style="color:rgb(0, 0, 0);">Hugging Face开源社区</font>**<font style="color:rgb(0, 0, 0);">: </font>[https://github.com/huggingface](https://github.com/huggingface)
>
> + <font style="color:rgb(0, 0, 0);">其著名的Transformers库最为人所知。Transformers是一个包含大量预训练模型的库，支持包括文本生成、分类、问答等多种NLP任务。</font>
> + <font style="color:rgb(0, 0, 0);">AI 界的 GitHub</font>
>
> Hugging Face国内的镜像站点: [https://hf-mirror.com/](https://hf-mirror.com/)

<font style="color:rgb(24, 25, 28);"></font>

<font style="color:rgb(24, 25, 28);"></font>

概述

> 对于 HuggingGPT，最合适的形容就是：「**缝合怪**」，但这绝对不是贬义。他们的项目名称命名为 Jarvis，也蛮贴切的——**它就是一个介于用户和模型之间的「助手」，负责将用户的需求翻译成指令调用模型，并负责把模型的返回以适当的形式呈现给用户，起到这样一个中间层的作用。**

**能力特点**：它的优势在于能够整合多模态感知能力，**处理多个复杂的AI任务**。通过使用不同的模型来执行特定任务，如使用OpenCV的OpenPose模型分析图像姿势，使用其他模型生成新图像和描述，它可以根据用户的各种需求灵活地组合不同的技术和模型，实现更加**多样化和复杂**的功能。

+ **可以调用HuggingFace上不同的模型**来完成更复杂的任务
+ 不需要本地部署模型, HuggingFace可以很方便的调试选择预期模型

**弊端**: 响应效率, 因为它需要在云端进行多重交互. 

+ **<font style="color:rgb(51, 51, 51);">延迟问题</font>**<font style="color:rgb(51, 51, 51);">：多次模型调用可能导致响应时间较长。</font>
+ **<font style="color:rgb(51, 51, 51);">模型依赖</font>**<font style="color:rgb(51, 51, 51);">：依赖Hugging Face模型库的可用性与兼容性。</font>
+ **<font style="color:rgb(51, 51, 51);">错误传递</font>**<font style="color:rgb(51, 51, 51);">：单个模型失败可能导致整个任务链中断，需实现重试机制与降级策略（如替换备用模型）。</font>

****

技术原理

> HuggingGPT任务流  包含三个模块, 四个步骤

![](https://image.233377.xyz/2026/85797af13af3f42a40099d71584680aa.png)

角色解释: **三个模块拆解**

![画板](https://image.233377.xyz/2026/5c63a2bffa2b106d37285032f3577b55.jpeg)





> 以示例为切入点, 来看一下HuggingGPT的完整流程：

请求：请生成一个女孩正在看书的图片，她的姿势与example.jpg中的男孩相同。然后请用你的声音描述新图片。

![](https://image.233377.xyz/2026/7075dc186a8e49489c4cd55df2433d14.png)

   可以看到HuggingGPT是如何将它拆解为6个子任务，并分别选定模型执行得到最终结果的。

****

> **四个步骤拆解**

**任务之间的协调缩略图, 4个阶段对应 2-5**

![画板](https://image.233377.xyz/2026/db01ba4d52a07223572cc443088d9e08.jpeg)







第 1 阶段 - 任务规划 (Task Planning) - <font style="color:#DF2A3F;">parse_task()</font>

> 利用 ChatGPT 分析用户的需求，深入了解其意图，并将需求拆解为可执行的具体任务提示。

<font style="color:rgb(51, 51, 51);">实现的基本形式就是构造基础的Prompt  
</font><font style="color:rgb(51, 51, 51);">Prompt的设计原则主要包含以下两点：</font>**<font style="color:rgb(51, 51, 51);">基于规范的指令+基于演示样例（Demonstration）的解析  
</font>**

**规范指令**

```java
{
 "id": 0, 
 "task": "image-to-text", 
 "dep": [-1], 
 "args": {"image": /examples/boy.jpg" }
}
```

<font style="color:rgb(51, 51, 51);">预定义的任务类型如下图所示：</font>

![](https://image.233377.xyz/2026/c1eaa9a224e2bc6c227c16358c6fcbc1.png)



**基于演示样例（Demonstration）的解析**

> <font style="color:rgb(51, 51, 51);">messages 具体由三部分组成    任务prompt + fewShot(QA对) + 用户问题</font>

1. 最前面是任务的 prompt: `messages.insert(0, {"role": "system", "content": parse_task_tprompt})`

```json
#1 Task Planning Stage: The AI assistant can parse user input to several tasks: [{"task": task, "id": task_id, "dep": dependency_task_id, "args": {"text": text or <GENERATED>-dep_id, "image": image_url or <GENERATED>-dep_id, "audio": audio_url or <GENERATED>-dep_id}}]. The special tag "<GENERATED>-dep_id" refer to the one generated text/image/audio in the dependency task (Please consider whether the dependency task generates resources of this type.) and "dep_id" must be in "dep" list. The "dep" field denotes the ids of the previous prerequisite tasks which generate a new resource that the current task relies on. The "args" field must in ["text", "image", "audio"], nothing else. The task MUST be selected from the following options: "token-classification", "text2text-generation", "summarization", "translation", "question-answering", "conversational", "text-generation", "sentence-similarity", "tabular-classification", "object-detection", "image-classification", "image-to-image", "image-to-text", "text-to-image", "text-to-video", "visual-question-answering", "document-question-answering", "image-segmentation", "depth-estimation", "text-to-speech", "automatic-speech-recognition", "audio-to-audio", "audio-classification", "canny-control", "hed-control", "mlsd-control", "normal-control", "openpose-control", "canny-text-to-image", "depth-text-to-image", "hed-text-to-image", "mlsd-text-to-image", "normal-text-to-image", "openpose-text-to-image", "seg-text-to-image". There may be multiple tasks of the same type. Think step by step about all the tasks needed to resolve the user's request. Parse out as few tasks as possible while ensuring that the user request can be resolved. Pay attention to the dependencies and order among tasks. If the user input can't be parsed, you need to reply empty JSON [].
```

<font style="color:rgb(51, 51, 51);"></font>

2. 中间是项目中一个 `[demo_parse_task.json](https://yuque.antfin.com/attachments/lark/0/2025/json/135356742/1747292032043-314a4b9e-00c6-4037-a557-b73f1a60c91e.json)` demo文件提供 **<font style="color:#DF2A3F;">few-shot</font>**<font style="color:rgb(51, 51, 51);">, 具体一个示例如下</font>

```java
{
    "role": "user",
    "content": "Given an image /example.jpg, first generate a hed image, then based on the hed image generate a new image where a girl is reading a book"
},
{
    "role": "assistant",
    "content": "[{\"task\": \"openpose-control\", \"id\": 0, \"dep\": [-1], \"args\": {\"image\": \"/example.jpg\" }},  {\"task\": \"openpose-text-to-image\", \"id\": 1, \"dep\": [0], \"args\": {\"text\": \"a girl is reading a book\", \"image\": \"<GENERATED>-0\" }}]"
},
```



3. 结尾则是用户问题+prompt

```json
messages.append({"role": "user", "content": prompt})
prompt ---> 
The chat log [ {{context}} ] may contain the resources I mentioned. Now I input { {{input}} }. Pay attention to the input and output types of tasks and the dependencies between tasks.
```









第 2 阶段 - 模型选择 (Model Selection) - <font style="color:#DF2A3F;">choose_model()</font>

> 为了解决这些任务，ChatGPT 会根据每个模型的描述，从 Hugging Face 平台上的专家模型中挑选出合适的模型。

In-Context Task-Model Assignment（基于上下文的任务模型分配）

+ <font style="color:rgb(51, 51, 51);">根据子任务的任务类型筛选模型，并根据模型在</font>**<font style="color:rgb(51, 51, 51);">HuggingFace上的下载次数</font>**<font style="color:rgb(51, 51, 51);">作为排序依据对模型进行排序</font>
+ <font style="color:rgb(51, 51, 51);">将筛选出排名Top-K的模型的描述，丢给ChatGPT，由大语言模型负责最后的筛选</font>

```json
Please choose the most suitable model from {{metas}} for the task {{task}}. The output must be in a strict JSON format: {"id": "id", "reason": "your detail reasons for the choice"}.
```











第 3 阶段 - 任务执行 (Task Execution)

启用并执行所选模型，将模型的结果整理后返回给 ChatGPT。











第 4 阶段 - 响应生成 (Response Generation) - <font style="color:#DF2A3F;">response_results</font>()

> 最后，ChatGPT 综合所有模型的预测结果，生成对应的答案并提供给用户。

```json
Yes. Please first think carefully and directly answer my request based on the inference results. Some of the inferences may not always turn out to be correct and require you to make careful consideration in making decisions. Then please detail your workflow including the used models and inference results for my request in your friendly tone. Please filter out information that is not relevant to my request. Tell me the complete path or urls of files in inference results. If there is nothing in the results, please tell me you can't make it. }
```



**hunggingGPT Agent设计模式分析**

1. PE(Plan & Execute) - HuggingGPT严格遵循"先规划后执行"的范式
2. LLM Compiler - 用户请求会变为结构化任务计划







### ChatDev

一句话解释: ChatDev 是一个基于**多智能体协作的AI软件开发框架**, 通过模拟软件公司角色（如CEO、CTO、程序员）的分工与交互，实现从需求到代码的全流程自动化，核心特点是结构化阶段控制和自我纠错

<font style="color:rgba(0, 0, 0, 0.9);">ChatDev项目本身的代码没有太多和复用性，依赖的旧版本Camel也是该抛弃的东西。这个项目本身更多是为了支撑论文的学术性原型，</font>**并不是为了让别人在上面开发而设计的。**

> <font style="color:rgba(0, 0, 0, 0.9);">官网：</font>[https://chatdev.modelbest.cn/](https://chatdev.modelbest.cn/)
>
> <font style="color:rgba(0, 0, 0, 0.9);">git：</font>[https://github.com/OpenBMB/ChatDev](https://github.com/OpenBMB/ChatDev)
>
> <font style="color:rgba(0, 0, 0, 0.9);">论文1: </font>[https://arxiv.org/pdf/2307.07924](https://arxiv.org/pdf/2307.07924)，[https://ar5iv.labs.arxiv.org/html/2307.07924](https://ar5iv.labs.arxiv.org/html/2307.07924)
>
> 论文2: [https://arxiv.org/pdf/2312.17025](https://arxiv.org/pdf/2312.17025)





**概述**

<font style="color:rgba(0, 0, 0, 0.9);">ChatDev 是一家</font>**<font style="color:rgba(0, 0, 0, 0.9);">虚拟软件公司</font>**<font style="color:rgba(0, 0, 0, 0.9);">，通过各种不同角色的智能体 运营，包括执行官，产品官，技术官，程序员 ，审查员，测试员，设计师等。这些智能体形成了一个多智能体组织结构，其使命是“通过编程改变数字世界”。ChatDev内的智能体通过参加专业的功能研讨会来 协作，包括设计、编码、测试和文档编写等任务。</font>

![](https://image.233377.xyz/2026/8b6f3e710cbf10e0914f9f171357ed5d.png)

<font style="color:rgba(0, 0, 0, 0.9);">ChatDev（2023.9）容易被误认为是一个普通的MultiAgent框架在软件开发上的具体实现，但实际上它不是。ChatDev是基于</font>**<font style="color:rgba(0, 0, 0, 0.9);">Camel</font>**<font style="color:rgba(0, 0, 0, 0.9);">的，也就是说它内部流程都是</font>**<font style="color:rgba(0, 0, 0, 0.9);">2个Agent之间多次沟通 (RolePlaying.class)</font>**<font style="color:rgba(0, 0, 0, 0.9);">，整体上的不同Agent角色的沟通关系和顺序都是由开发者配置死的，从这个角度上来说不太像是个全功能的MultiAgent框架的实现。</font>

<font style="color:rgba(0, 0, 0, 0.9);">但似乎也很难说这就是使用Camel时候的削足适履，如果在多Agent的沟通路由层面没有做好的话，效果确实可能还不如这样的固定瀑布式两两沟通。ChatDev的作者也把这（每次是1-1沟通）作为一个feature来描述。</font>

<font style="color:rgba(0, 0, 0, 0.9);"></font>



**聊天链 - 瀑布模型**

ChatDev采用了瀑布模型，来将软件开发的过程拆分成了四个不同的阶段：设计、代码、测试和文档。

**<font style="color:rgb(25, 27, 31);">1）设计阶段</font>**<font style="color:rgb(25, 27, 31);">：通过相互协作的头脑风暴来生成一些创新ideas，以及定义一些技术设计要求。</font>

**<font style="color:rgb(25, 27, 31);">2）代码阶段</font>**<font style="color:rgb(25, 27, 31);">：开发和review源代码。</font>

**<font style="color:rgb(25, 27, 31);">3）测试阶段</font>**<font style="color:rgb(25, 27, 31);">：把所有组件整合进一个系统，利用代码解释器获得执行结果，根据反馈信息进行debug。</font>

**<font style="color:rgb(25, 27, 31);">4）文档阶段</font>**<font style="color:rgb(25, 27, 31);">：生成环境要求和用户操作手册。 在整个开发过程中，还可以引入人类反馈，通过高亮决策过程，让用户可以看到开发的中间结果，给产生的错误进行提示，帮助agent解决问题。</font>

![](https://image.233377.xyz/2026/d8effd6d539a1e2f10232369c91ac28b.png)

ChatDev 的拟议架构由**<font style="color:#DF2A3F;">阶段级组件</font>****和****<font style="color:#DF2A3F;">聊天级组件</font>****组成**。在阶段级，采用瀑布模型将软件开发过程分为四个连续的阶段。在聊天层面，每个阶段被进一步划分为**<font style="color:#DF2A3F;">原子聊天</font>**。这些原子聊天涉及**两个代理之间以任务为导向的角色扮演**，促进协作交流。交流遵循指令遵循风格，即代理在每次聊天中进行交互，以完成特定的子任务。





**<font style="color:rgb(41, 41, 41);">1) 设计阶段</font>**

> <font style="color:rgb(41, 41, 41);">CEO（首席执行官）、CPO（首席产品官）和 CTO（首席技术官）</font>
>
> + 软件的模式（CEO 和 CPO）
> + 编程语言（CEO 和 CTO）的决策

![](https://image.233377.xyz/2026/466d2c222f95bcd8ba06aae341127a9d.png)

每次聊天中使用了三种关键机制 (如图a b c)。

【**<font style="color:rgb(41, 41, 41);">角色分配</font>**】(a) **角色专业化确保每个代理都履行其指定的功能**，并有效地为面向任务的对话做出贡献。

【**<font style="color:rgb(41, 41, 41);">记忆流</font>**】(b) **记忆流维护聊天中先前对话的全面记录**，使代理能够做出明智的决定。

【**<font style="color:rgb(41, 41, 41);">自我反省</font>**】(c) 当双方达成共识时，**自我反思会提示助手反思提议的决策**，而不会触发预定义的终止条件。  
自我反省 有时，我们观察到双方达成共识但**未触发预定义的通信协议作为终止条件的对话**。在这种情况下，我们引入了一种自我反思机制，它涉及提取和检索记忆。为了实现这种机制，我们招募了一个 “伪自我” 作为新的提问者，并发起了一个新的聊天。伪提问者将之前对话的所有历史记录告知当前助手，并要求对对话中的结论性信息进行总结，如图 (c) 所示。这种机制有效地鼓励助理反思对话期间提出和讨论的决定。



**<font style="color:rgb(25, 27, 31);">2）代码阶段</font>**

> <font style="color:rgb(41, 41, 41);">CTO、程序员、设计人员</font>
>
> + <font style="color:rgb(41, 41, 41);">CTO: 指示程序员使用 markdown 格式实现软件系统</font>
> + <font style="color:rgb(41, 41, 41);">程序员: 生成代码作为响应，并根据 markdown 格式提取相应的代码。</font>
> + <font style="color:rgb(41, 41, 41);">设计人员: 使用外部文本到图像工具创建视觉上吸引人的图形, 程序员使用标准工具包将其合并到 GUI 设计中。</font>

![](https://image.233377.xyz/2026/4bc75a959d6fc8b2f29b87f2298096f0.png)

**<font style="color:rgb(41, 41, 41);">思维指令 (</font>**<font style="color:rgb(41, 41, 41);">Thought Instruction) </font>**<font style="color:rgb(41, 41, 41);">: </font>**<font style="color:rgb(41, 41, 41);">思维指令</font>**<font style="color:rgb(41, 41, 41);">减轻了编码和测试阶段的代码幻觉</font>**<font style="color:rgb(41, 41, 41);">。思想指导不是提供通用的指令，而是涉及角色切换，以询问未实现的方法或解释由 bug 引起的反馈消息。</font>**<font style="color:rgb(41, 41, 41);">此步骤可以</font>****<font style="color:#DF2A3F;">更清楚地了解现有代码</font>****<font style="color:rgb(41, 41, 41);">，并确定需要解决的具体差距。通过获得这种意识，角色可以切换回来</font>**<font style="color:rgb(41, 41, 41);">，讲师可以提供更具体的指导来准确指导程序员。</font>

**<font style="color:rgb(41, 41, 41);">代码管理: </font>**<font style="color:rgb(41, 41, 41);">为了处理复杂的软件系统，ChatDev 利用了 Python 等面向对象的编程语言。面向对象编程的模块化允许使用自包含对象，有助于故障排除和协作开发。可重用性支持通过继承重用代码，从而减少冗余。我们引入了 </font>**<font style="color:rgb(41, 41, 41);">“version evolution”</font>**<font style="color:rgb(41, 41, 41);"> 机制，以限制角色之间对最新代码版本的可见性，从而从内存流中丢弃早期代码版本。程序员使用与 Git 相关的命令管理项目。建议的代码修改和更改会将软件版本增加 1.0。版本演变逐渐消除了代码幻觉。面向对象编程和版本演化的结合适用于涉及长代码段的对话。</font>

+ 只需在 `ChatChainConfig.json` 中将 `“git_management”` 设置为 `“True”` 即可打开 Git 模式，在该模式下，ChatDev 会将生成的软件文件夹设为 git 仓库并自动进行所有提交。(默认没开)



**<font style="color:rgb(25, 27, 31);">3）测试阶段</font>**

> <font style="color:rgb(41, 41, 41);">程序员、审阅者、测试人员</font>
>
> + <font style="color:rgb(41, 41, 41);">评审（程序员和审阅者）: </font>**<font style="color:rgb(41, 41, 41);">静态调试</font>**<font style="color:rgb(41, 41, 41);">会检查源代码以识别潜在问题</font>
> + <font style="color:rgb(41, 41, 41);">系统测试（程序员和测试人员）: </font>**<font style="color:rgb(41, 41, 41);">动态调试</font>**<font style="color:rgb(41, 41, 41);">它通过程序员使用解释器执行的测试来验证软件的执行情况。此测试侧重于通过</font>**<font style="color:rgb(41, 41, 41);">黑盒测试</font>**<font style="color:rgb(41, 41, 41);">评估应用程序性能。</font>

![](https://image.233377.xyz/2026/242e4bbde7298364284079fd9562d565.png)

**<font style="color:rgb(41, 41, 41);">思维指令 (</font>**<font style="color:rgb(41, 41, 41);">Thought Instruction) : 在指令中明确表达调试思想（同</font>`**<font style="color:rgb(25, 27, 31);">代码阶段</font>**`**<font style="color:rgb(25, 27, 31);">)</font>**

**<font style="color:rgb(41, 41, 41);">Loop: </font>**<font style="color:rgb(41, 41, 41);">此迭代过程将继续，直到消除潜在错误并且系统成功运行。</font>

**<font style="color:rgb(25, 27, 31);"></font>**

**<font style="color:rgb(25, 27, 31);">4）文档阶段</font>**

> <font style="color:rgb(41, 41, 41);">CEO、CPO、CTO 、程序员</font>
>
> + <font style="color:rgb(41, 41, 41);">CTO 指示程序员为环境依赖项提供配置说明，从而生成类似于 requirements.txt 的文档</font>
> + <font style="color:rgb(41, 41, 41);">CEO 将需求和系统设计传达给 CPO，CPO 生成用户手册</font>

![](https://image.233377.xyz/2026/66ba64b9dac17e0886465a2a17345d72.png)

**<font style="color:rgb(41, 41, 41);">few-shot prompting: </font>**在 prompt 中给少量样本生成文档



**<font style="color:rgb(37, 43, 58);">定制</font>**

<font style="color:rgb(37, 43, 58);">可以以三种粒度自定义这家"虚拟软件公司"</font>

+ 自定义 ChatChain
+ 自定义 Phase
+ 自定义 Role

<font style="color:rgb(37, 43, 58);">以下是 ChatDev 的架构概述，它说明了上述三个类之间的关系</font>

![](https://image.233377.xyz/2026/136ecffc70e03a8a4234fa4d63799ac7.png)

<font style="color:rgb(37, 43, 58);"></font>

<font style="color:rgb(37, 43, 58);">所有与 ChatDev 相关的配置内容（比如代理员工的后台提示、每个 Phase 的工作内容、以及 Phase 如何组合成一个 ChatChain）都称为 </font>**<font style="color:rgb(37, 43, 58);">CompanyConfig</font>**<font style="color:rgb(37, 43, 58);">（因为 ChatDev 就像一家虚拟软件公司）</font>

1. ChatChainConfig.json，它控制着 ChatDev 的整体开发过程，包括每个步骤是哪个 Phase，每个 Phase 需要**循环**多少次，是否需要**反思**等。  
   [ChatChainConfig.json](https://yuque.antfin.com/attachments/lark/0/2025/json/135356742/1747292032059-99fee292-cc98-4ce9-9c02-394d2e39766f.json)
2. PhaseConfig.json，它控制着每个 Phase，对应于 ChatDev 项目中的 `chatdev/phase.py` 或 `chatdev/composed_phase.py`。Python 文件实现了每个阶段的具体工作逻辑。这里的 JSON 文件包含了每个阶段的配置，比如后台提示、哪些员工参与了该阶段等。  
   [PhaseConfig.json](https://yuque.antfin.com/attachments/lark/0/2025/json/135356742/1747292032039-415b1099-ceb7-4b60-b509-1b736142b6d0.json)
    - 实现你的 Phase 类（在最简单的情况下，只需要修改一个函数）扩展 `Phase` 类
    - 在 `PhaseConfig.json` 中配置此阶段，包括编写阶段提示符和为该阶段分配角色
3. RoleConfig.json 包含每个员工 （代理） 的配置。目前，它只包含每个员工的后台提示，是一堆包含占位符的文本。  
   [RoleConfig.json](https://yuque.antfin.com/attachments/lark/0/2025/json/135356742/1747292032049-b6051e13-a0ba-4230-9764-b59f4428ae97.json)

<font style="color:rgb(25, 27, 31);">  
</font>

**chatDev Agent设计模式分析**

1. PE(Plan & Execute) - <font style="color:rgb(51, 51, 51);">ChatDev 将软件开发拆分为</font>**<font style="color:rgb(51, 51, 51);">明确的阶段</font>**<font style="color:rgb(51, 51, 51);">（需求→设计→编码→测试→交付），每个阶段由不同 Agent 负责，属于典型的“先规划后执行”模式。</font>
2. Reflection（反思）- <font style="color:rgb(51, 51, 51);">Agent 在测试阶段发现错误后，触发</font>**<font style="color:rgb(51, 51, 51);">反馈循环</font>**<font style="color:rgb(51, 51, 51);">（如测试员生成错误报告→程序员重新编码）</font>



### CrewAI

官方文档：[https://docs.crewai.com/introduction](https://docs.crewai.com/introduction)

Github：[https://github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)

社区：[https://community.crewai.com/](https://community.crewai.com/)

一句话解释：一个有WorkFlow的、有Agent的，能够编排Task（实际上也可以理解为编排Agent）的，一个技术前沿的Agent框架。

整体架构：

![](https://image.233377.xyz/2026/43f4791096c5b0fa50ec302b1514247b.png)

| 角色                                   | 核心功能                                                     | 比喻                                                         | 类比     |
| -------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| Crew                                   | 整个Crew AI的管理者角色。<br/>负责：<br/>+ 管理AI Agents<br/>+ 多种运行模式（sequential、hierarchical）<br/>    - 内部使用只有2个tool的manager_agent来管理分层：DelegateWorkTool（分配任务给其他Agent的Tool）、AskQuestionTool（咨询其他Agent的Tool）<br/>+ planning（planning的结果放到任务描述里，后续执行）<br/>+ 监督Process<br/>+ 知识库（任务执行的时候调用）<br/>+ 结果输出 | 比喻成团队。<br/><br/>在构建一个Crew，其实就是构建一个团队。<br/>这个团队有那些成员(agent)、这个团队能做哪些事(Task)。 | Bot层    |
| AI Agents                              | + 执行**<font style="color:#DF2A3F;">特定</font>**任务<br/>+ 可以使用工具<br/>+ 可以与其他agent沟通协作（实现：工具调用）<br/>+ 根据agent配置信息输出结果<br/>+ 记忆功能<br/>+ 委派任务给其他Agent（实现：工具调用）<br/>+ 可设置迭代次数，默认为20<br/>+ 执行代码（实现：工具调用）<br/>+ 多模态（实现：工具调用）<br/>+ 知识库（任务执行的时候调用） | 比喻成团队的成员。<br/><br/>一个团队（Crew）可以拥有多个成员（Agent），有开发产品Agent、有开发Agent、有测试Agent、...... | -        |
| Process                                | 定义一个Crew是顺序执行，还是分层执行。<br/>（已支持的：sequential、hierarchical）<br/>+ sequential：如果Crew指定sequential模式，则Crew都会遵循task预定义的顺序来按部就班的执行。<br/>+ hierarchical：如果Crew指定hierarchical模式，则Crew就会存在一个manager_agent的角色，所有任务不再遵循流水线，而是manager_agent按照每个agent的能力动态分配调度，并审查输出评估任务完成情况等。<br/>（计划中的：Consensual Process）<br/>+ Consensual Process：agent在执行task时，会和其他的agent沟通达成共识，更好的完成任务。 | 比喻成团队的军师。<br/><br/>这个团队（Crew）应该怎么做事，到底是顺序做事（sequential），还是有个管理员（manager_agent）来统一管理分配所有的事情（hierarchical）。<br/> | -        |
| Tasks                                  | + 执行时调用知识库(Crew知识库、Agent知识库)-拼接到提示词     | 比喻团队的需求或项目。<br/><br/>你可以定义很多Task，并且可以指定这个Task必须由那个成员（Agent）来做。<br/>如果是sequential模式，则由这个成员（Agent）来做。<br/>如果是hierarchical模式，则由军师（manager_agent）来做这件事，军师（manager_agent）会将这个需求（Task）重新分配给合适的成员（Agent）来做。<br/><br/><br/> | -        |
| Flow                                   | 通过编码的方式来构建一个编排图。<br/>                        | 比喻成老板。<br/><br/>要完成一件复杂的事情，可能需要多个团队（Crew）共同完成。<br/>老板通过硬编码的方式，构建一条流程固定的流水线，流水线上每一个节点可能是一个简单方法(method)，可能是一个团队(Crew)。<br/><br/> | Workflow |
| knowledge<br/>（新版本有，较旧版本无） | 知识可以分为两类：<br/>+ 非结构化知识（原始字符串、txt文件、pdf等）<br/>+ 结构化数据（csv文件、excel文件、json文档等）<br/><br/>知识按照作用域可以有：<br/>+ 挂载到Agent上（这个成员（Agent）的独有的知识）<br/>+ 挂载到Crew上（这个团队的知识，团队下的所有成员（Agent）共享） |                                                              |          |






Q：Agent与Agent之间如何通信：

A：任务委派+工具调用。Agent可以设置属性`allow_delegation`代表是否允许将任务委派给其他Agent，当这个Agent的`allow_delegation`设置为true后，这个Agent就会拥有两个额外的Tool：分配任务的Tool、咨询问题的Tool。

![画板](https://image.233377.xyz/2026/a273670a48c74dc3bd2fa2f7113b27be.jpeg)

![Agent之间通信实现：给Agent添加两个Tool（委派任务Tool、咨询问题Tool）](https://image.233377.xyz/2026/0517c7ac3882191875e02bfb17d6356a.png)





CrewAI各角色执行流程：

![画板](https://image.233377.xyz/2026/a8db69310d58878e42e089997ff50bb9.jpeg)



总结

优点：

1. CrewAI 通过其独特的 Crews 和 Flows 架构将Agents与精确的工作流控制相结合，可实现具有精细控制的复杂生产级系统。
2. 开源，更新迭代较快
3. 与LLM解耦，能和绝大多数LLM甚至本地LLM结合一起使用



缺点：

1. flow的能力虽然能够灵活编排，但是是编码编排固定的，只能提供固定的解决方案，所以现在只能成为Agent框架，不能成为Agent平台。
2. 一个Crew的执行流程就是task的流程，task的流程是固定死的。
3. Agent之间的协作方式太少，目前只支持两种。









### antUniverse

github：[https://github.com/antgroup/agentUniverse/blob/master/README_zh.md](https://github.com/antgroup/agentUniverse/blob/master/README_zh.md)

用户使用手册：[https://yuque.antfin.com/agent_universe/kb9d3g](https://yuque.antfin.com/agent_universe/kb9d3g)

论文地址：[https://arxiv.org/pdf/2407.06985](https://arxiv.org/pdf/2407.06985)

整体架构：

![](https://image.233377.xyz/2026/6ac283e738da1ac6f1d0bc66ee28ae0e.png)



+ <font style="color:rgb(31, 35, 40);">PEER 模式组件： 该pattern通过计划（Plan）、执行（Execute）、表达（Express）、评价（Review）四个不同职责的智能体，实现对复杂问题的多步拆解、分步执行，并基于评价反馈进行自主迭代，最终提升推理分析类任务表现。典型适用场景：事件解读、行业分析</font>![](https://image.233377.xyz/2026/7609548c8e08a649ffa19eb0948fd6bb.png)
+ <font style="color:rgb(31, 35, 40);">DOE 模式组件： 该pattern通过数据精制（Data-fining）、观点注入（Opinion-inject）、表达（Express）三个智能体，实现对数据密集、高计算精度、融合专家观点的生成任务的效果提升。典型适用场景：财报生成</font>



AntUniverse的特点：











### Manus & OpenManus

Manus官网：[https://manus.im/?index=1](https://manus.im/?index=1)

Manus是一个中国AI团队Monica宣布推出的一款，也是全球首款通用型AI智能产品，邀请码万元难求。

> 一个全中国人的团队+英文官网+科学上网google登录+国外风平浪静+国内风起云涌自媒体准时准点发文宣传+周五(03-07)连夜上中文官网

效果视频：

[此处为语雀卡片，点击链接查看](https://yuque.antfin.com/docs/446967445#j4php)

![](https://image.233377.xyz/2026/eb62a43e4306c1fd232e610ddca77718.png)

从界面来看，这个Manus核心几个事情：

1. 根据任务，生成执行计划
2. 根据计划执行每一个任务，执行过程中可以使用很多工具（云终端、shell、search、Chrome、HumanInput），同时也有可能会RePlan或者是插入任务
3. 最后，结果交付与可视化。







OpenManus：[https://github.com/mannaandpoem/OpenManus](https://github.com/mannaandpoem/OpenManus)

MetaGPT团队5个人3小时完成开发。



本地效果视频：

[此处为语雀卡片，点击链接查看](https://yuque.antfin.com/docs/446967445#RttIO)

问题：我想对特斯拉股票进行全面分析，包括：（1）摘要：公司概况、关键指标、业绩数据和投资建业（2）财务数据：收入趋势、利润率、资产负债表和现金流分析（3）市场情绪：分析师评级、情绪指标和新闻影响（4）技术分析：价格趋势、技术指标和支撑位/阻力位（5）比较资产：与主要竞争对手的市场份额和财务指标（6）价值投资者：内在价值、增长潜力和风险因素（7）投资论点：针对不同投资者类型的SWOT分析和建议。

结果如下：

[Tesla_Profit_Margins_Evaluation_2023.txt](https://yuque.antfin.com/attachments/lark/0/2025/txt/135356742/1747292032119-f0511228-8e13-489a-ace8-9c983f8a17f3.txt)：特斯拉利润率评估

[Tesla_Revenue_Trend_Analysis_2023.txt](https://yuque.antfin.com/attachments/lark/0/2025/txt/135356742/1747292034117-877213bc-8c59-44c3-ae2e-a7157e9c4414.txt)：特斯拉收入趋势分析

[Tesla_Performance_Data_2023.txt](https://yuque.antfin.com/attachments/lark/0/2025/txt/135356742/1747292034138-e08a742c-b926-4a98-978a-6ef0ce6d2264.txt)：特斯拉业绩数据

[Tesla_Key_Financial_Metrics.txt](https://yuque.antfin.com/attachments/lark/0/2025/txt/135356742/1747292034125-1306e41f-9659-4f7a-98c3-2884a1fea2f8.txt)：特斯拉关键财务指标

[Tesla_Investment_Recommendations_2023.txt](https://yuque.antfin.com/attachments/lark/0/2025/txt/135356742/1747292034124-e1ab411b-e2f4-49e9-bdbc-cb5d2bb40cbf.txt)：特斯拉 (2023) 投资建议

[Tesla_Company_Overview.txt](https://yuque.antfin.com/attachments/lark/0/2025/txt/135356742/1747292034125-102bff85-0086-481d-91d0-54a3cf19aeac.txt)：特斯拉公司概况





简化版核心实现：就是一个典型ReAct设计模式的Agent，赋予了一些独特的能力(工具)。

![画板](https://image.233377.xyz/2026/b9f1b346db8d539c6f74cb2f16dcb53e.jpeg)





结论：Agent产品化最重要的目标就是在不降低质量的情况下让用户感到智能，让用户感到智能的点就是交互过程。Agent本来就是默认人类的思考过程，模仿人类的执行过程，只需要把这个过程怎么通过产品交互给到用户。



## 产品

1. coze
2. dify
3. 百灵
4. kore.ai
5. Azure AI Foundry
6. Agentx



对比总结：

<font style="background-color:#81BBF8;">蓝色</font>：重点介绍

<font style="background-color:#FCE75A;">黄色</font>：我们平台

|                                                              | Cockpit | coze                                         | kore.ai     | dify | 百灵                                       | Azure AI Foundry | Agentx |
| ------------------------------------------------------------ | ------- | -------------------------------------------- | ----------- | ---- | ------------------------------------------ | ---------------- | ------ |
| 是否支持单Agent                                              | ✅       | ✅                                            | ✅           | ✅    | ✅                                          | ✅                |        |
| 单Agent是否支持选择设计模式                                  | ✅       | ❌<br/>说明：只有ReAct，不支持灵活配置。      | ✅           | ❌    | ❌                                          | ❌                |        |
|                                                              |         |                                              |             |      |                                            |                  |        |
| 是否支持Multi-Agent                                          | ✅       | ✅                                            | ✅企业版支持 | ❌    | ✅                                          | ❌                |        |
| 是否支持配置Multi-Agent协作方式                              | ✅       | ❌<br/>说明：只有Supervisor，不支持灵活配置。 | ✅企业版支持 | ❌    | ✅<br/>说明：支持分发与画布两种模式灵活选择 | ❌                |        |
| Multi-Agent是否支持多种问题受理方式<br/>（开始节点/上个Agent回复节点） | ✅       | ✅                                            | -未知       | ❌    | ✅                                          | ❌                |        |
| Multi-Agent是否支持多种返回方式<br/>（向下执行/向上返回）    | ✅       | ❌<br/>说明：只能向下执行，不能向上返回。     | -未知       | ❌    | ❌                                          | ❌                |        |






### coze

> 一句话解释:<font style="color:rgb(0, 0, 0);">一个有WorkFlow的、有Agent的，能够编排Agent的Agent平台</font>

![画板](https://image.233377.xyz/2026/ed46261a62f4c7f1fbe13d1f973e0563.jpeg)



Coze的Agent真的是Agent吗？

是，Coze支持三种Agent模式：

1. **单Agent（LLM模式）：**构建一个能够自由决策使用技能、知识库召回、灵活使用记忆的Agent。
2. **单Agent（工作流/对话流模式）：**构建一个只有一个技能（工作流/对话流），无知识库、灵活使用记忆的Agent。
3. **多Agent：**构建一个解决复杂任务的结构，该结构由多个 `单Agent（LLM模式）` 组成，







问题的处理方式：

1. 开始节点：每次都按照编排流程处理。
2. 上一次回复用户的节点：第一次从开始节点开始按照编排流程处理，同一会话后续对话使用叶子节点Agent处理。

<font style="color:#8A8F8D;">（对于协作方式，这里先不多说。后面有一个专属模块，</font><font style="color:#8A8F8D;">☕️</font><font style="color:#8A8F8D;">，我们稍后慢慢聊）</font>







### dify

> 一句话解释:<font style="color:rgb(0, 0, 0);">一个有WorkFlow的、有Agent的，但是不能编排Agent的Agent平台</font>

![画板](https://image.233377.xyz/2026/4ce044ff179e790938c72eb40730d979.jpeg)

总结

dify的agent只有一个单agent模式 可以配置工作流插件等工具并调用工具



### 百灵

官网链接: [https://agent.alipay.com/](https://agent.alipay.com/)

> 一句话解释:<font style="color:rgb(0, 0, 0);">一个有WorkFlow的、有Agent的，可以编排Agent的,可以选择Agent协作模式的Agent平台</font>

![画板](https://image.233377.xyz/2026/51377e340ed775de01fbca3ee54b98fe.jpeg)

总结:

百灵有三种agent模式

1.通用agent模式:就是单agent 可以配置工作流插件等工具,可以调用工具

2.多agent模式

  1)分发模式: 开始节点当做意图识别,然后执行某一个agent并输出内容

  2)画布模式: 可以自定义执行的agent  画布的节点只能是agent

3.工作流模式







### kore.ai

官方地址：[https://kore.ai/](https://kore.ai/)

工作流模式：简单版本，都可以使用

Agent平台：企业模式，只有企业账号可用

![画板](https://image.233377.xyz/2026/4b5a96b328bad6ce39ce43976ddfff52.jpeg)

工作流模式：和我们的是一样的。

Agent平台：也是我们要做的。





### Azure AI Foundry

官网地址: [https://ai.azure.com/](https://ai.azure.com/)

![画板](https://image.233377.xyz/2026/190a8225a384fb0091632c71f6ff13c6.jpeg)

总结: 有插件, 知识库的单Agent







### agentx

官网：[https://www.agentx.so/](https://www.agentx.so/)

![画板](https://image.233377.xyz/2026/7fae5b66bdbaf9369f20f21bdf826edc.jpeg)

单Agent：一个削弱技术配置的Agent。它可以挂载知识库、配置问候语、常见问题、固定变量、使用工具（生图、搜索引擎、OCR、日历、代码等工具），支持多端部署（web、discord、slack、whatsapp等）和API调用。

Multi Agent：Multi Agent显得很鸡肋，其实就是一个问题，同时抛给这个Group的多个Agent，然后多个Agent在这个Group回答自己的答案。Agent之间不能相互沟通协作。







### OmniParser

2月17日，微软发布**<font style="color:#DF2A3F;">视觉Agent</font>**解析框架OmniParser-V2。

> GitHub 仓库：https://github.com/microsoft/OmniParser
>
> 官网: [https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)
>
> demo: [https://huggingface.co/spaces/microsoft/OmniParser-v2](https://huggingface.co/spaces/microsoft/OmniParser-v2)

概述: <font style="color:rgb(24, 25, 28);">将任何大语言模型（LLM）转化为能够理解和交互图形用户界面（GUI）的智能体</font>

1. <font style="color:rgb(25, 27, 31);">准确识别用户界面上可交互的图标；</font>
2. <font style="color:rgb(25, 27, 31);">理解屏幕截图中各种元素的语义，并将预期的操作与屏幕上的对应区域精准关联。</font>

<font style="color:rgb(25, 27, 31);"></font>

<font style="color:rgb(25, 27, 31);">特点</font>

OmniParser-v2.0 的关键能力在于其对桌面环境的感知和交互能力。这意味着，通过与该模型的结合，AI Agent 不仅能理解用户的指令，还能直接在 Windows 操作系统层面上执行操作，例如打开特定窗口、定位并点击按钮、输入文本等。 



**<font style="color:rgb(25, 27, 31);">OmniTool</font>**

为了加速不同代理设置的实验，研究团队还开发了 OmniTool ，这是一个容器化的 Windows 系统，内置了一系列支持智能代理运行的核心工具。开箱即用，OmniTool 支持多种前沿的大语言模型，包括 OpenAI（4o/o1/o3-mini）、[DeepSeek](https://zhida.zhihu.com/search?content_id=254056594&content_type=Article&match_order=1&q=DeepSeek&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NDE3NDYwNDgsInEiOiJEZWVwU2VlayIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI1NDA1NjU5NCwiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.TKFz8lMCLtNWgPlw93X1AbahjYXiRsrSrWU5zAc3WT8&zhida_source=entity)（R1）、[通义千问](https://zhida.zhihu.com/search?content_id=254056594&content_type=Article&match_order=1&q=%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NDE3NDYwNDgsInEiOiLpgJrkuYnljYPpl64iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNTQwNTY1OTQsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.16huyOa-g96TDV9iqat76cI3DI1_-BLXcvOxudvJIsc&zhida_source=entity)（Qwen 2.5VL）和 [Anthropic](https://zhida.zhihu.com/search?content_id=254056594&content_type=Article&match_order=1&q=Anthropic&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NDE3NDYwNDgsInEiOiJBbnRocm9waWMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNTQwNTY1OTQsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.SdZUXICi2pZU1nCXW-HYzLK5S5sTW_qcX5hchCv-vVg&zhida_source=entity)（Sonnet）。这些模型可以无缝整合屏幕理解、定位、动作规划和执行等步骤，从而实现高效的自动化任务。



效果

+ 视频整体效果: [https://upload.chinaz.com/video/2025/0217/6387538500080241689153029.mp4](https://upload.chinaz.com/video/2025/0217/6387538500080241689153029.mp4)
+ LLM调用效果:  
  ![](https://image.233377.xyz/2026/c969ec67585e5c632519b36a8247a922.png)







### Magnetic-One

> 官网: [https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)

概述

Magnetic - One 是微软开发的一款通用型**<font style="color:#DF2A3F;">多Agent系统</font>**，旨在处理跨多个领域的各种基于网络和文件的任务，其设计初衷是助力解决人们在日常工作和个人场景中面临的类似任务。它构建在微软的 AutoGen 框架之上，以开源的形式为开发者和研究人员提供了强大的工具。



工作原理

<font style="color:rgb(26, 26, 26);">Magnetic-One 的核心在于一个指挥者智能体（Orchestrator），它负责管理和协调四种不同的辅助智能体。除了指挥者，系统还包括以下四种类型的智能体:</font>

1. **<font style="color:rgb(26, 26, 26);">Websurfer 智能体</font>****<font style="color:rgb(26, 26, 26);"> </font>**<font style="color:rgb(26, 26, 26);">:能够操控基于 Chromium 的浏览器，进行网页搜索、点击和输入，甚至总结网页内容。</font>
2. **<font style="color:rgb(26, 26, 26);">FileSurfer 智能体</font>****<font style="color:rgb(26, 26, 26);"> </font>**<font style="color:rgb(26, 26, 26);">:用于读取本地文件、列出目录和浏览文件夹。</font>
3. **<font style="color:rgb(26, 26, 26);">Coder 智能体</font>****<font style="color:rgb(26, 26, 26);"> </font>**<font style="color:rgb(26, 26, 26);">:负责编写代码、</font>[分析](https://aiczwd.com/blog/archives/tag/%e5%88%86%e6%9e%90)<font style="color:rgb(26, 26, 26);">其他智能体的信息并创建新项目。</font>
4. **<font style="color:rgb(26, 26, 26);">ComputerTerminal 智能体</font>****<font style="color:rgb(26, 26, 26);"> </font>**<font style="color:rgb(26, 26, 26);">:提供一个控制台，供 Coder 智能体的程序执行。</font>

![](https://image.233377.xyz/2026/e85aaa39e216eb571aa7dbb4f876f5ef.png)





# 架构设计

## 现状

### Cockpit平台现状

1. LLM本身支持传递Tools，但是我们的**<font style="color:#DF2A3F;">LLM节点没有Function Call的能力</font>**，很多节点都没办法只能通过Prompt的方式来输出Tool Param，然后手动调用Tool，这个过程没有利用LLM Function Call的优势，同时手动使用也增大了不稳定性。
2. **<font style="color:#E4495B;">缺少Agent组件</font>**，但是能够通过一些原子组件能够构建复杂多样化的Agent，就是要复杂一点。下面以Voyage Avatar举例。
3. **<font style="color:#DF2A3F;">没有过程信息</font>**。我们有输出节点，其实输出节点是可以做一部分过程信息的，Avatar就是这么做的。但是这不符合一个正常的流程，正常的流程是Message节点就是做一问多答，过程信息应该是每个核心执行流程前后都可以将过程信息给到调用端进行渲染，所以这完全是两个东西。而我们有了Agent后，执行的时间将会变得更久，更需要过程信息来缓解Agent思考过程带来的回复慢，缓解用户等待焦虑。
4. 人机互动少，目前只有输出节点，**<font style="color:#E4495B;">没有输入节点，缺乏主动互动</font>**，而输入节点对于真正的智能化显得非常重要。当Agent有了人类输入能力后，这个Agent就显得非常智能。

![](https://image.233377.xyz/2026/4010100e469222161d532a849d8943cc.png)

（就像一道非常经典的面试题：“树上十只鸟，开枪打死一只，树上还剩下几只鸟”，你是不是应该反问：“有没有聋鸟”、“有没有绑死在树上的”、......。生活中往往有很多这种例子）

5. **<font style="color:#E4495B;">没有循环并发组件</font>**，现在想要实现多路并发，需要构建相同的组件来实现并发。

![](https://image.233377.xyz/2026/73702eb8222fff60df4462d60196daa9.png)

6. **<font style="color:#DF2A3F;">没有循环组件</font>**。大多数场景下，其实是不需要循环的，但是对于准确率有要求的，大概率就会用到循环组件，就像Agent设计模式中提到的“重思考”，通过编排能力+循环组件+LLM，构建一个重思考的框架，比如PPER，那Review完了后，不符合要求，就应该重新开始。虽然没有循环组件，但是现在我们可以通过简单的编排实现循环能力，只是图可能没那么直观，能力是有的，是能编排出来的。



### 回顾Avatar架构

![](https://image.233377.xyz/2026/a0d5ecac5a4fcdca7dff91765a79a358.png)

Voyage Avatra 在最外层使用了P-E-E-R架构，因为考虑到性能，目前没有实现Review这一层，Loop只有一层。

**===>Avatar最外层的架构其实就是一个Multi-Agent架构（Crew）**



![画板](https://image.233377.xyz/2026/b97476c8001e6ed8c31ae733fa708693.jpeg)

在Voyage Avatar中，不仅在大方向上运用了P-E-E-R思想，同时在执行细节上还运用了`LLM Compiler`Agent设计模式。

**===>Avatar的Plan模块，运用了Agent的设计模式LLM Compiler**



P-E-E-R框架与`LLM Compiler`Agent设计模式的区别：

1. 其实P-E-E-R框架和`LLM Compiler`在执行流程上，本上就有非常相似，有计划，有执行，有判断。P-E-E-R的Excute单拎出来作为一个Agent，而`LLM Compiler`是在执行过程就生成了答案。
2. 另外P-E-E-R框架每一个大节点称之为一个Agent，比如Planning Agent、Excuting Agent等，而`LLM Compiler`整个称之为一个Agent，Plan、Excute只称之为Agent的一环。











### 可能存在的需求

1. 工作流内调用Bot（之前的需求：Antom Copilot在工作流里想要调用GBSS，注意，不是想调用工作流，是Bot）





问题：工作流现在没办法调用Bot，可以用工具调（未实现），同时还可以用Agent调

接下来一起看下Agent整体架构



## 整体架构


### 架构图设计

![画板](https://image.233377.xyz/2026/783bf4b37b125873e7a3433d28a323ed.jpeg)

User：用户层/业务层

Bot：Bot层，主要负责用户层的Bot管理、会话管理、消息管理、变量管理、输入输出管理等

Workflow：主要负责核心的工作流执行

**Agent：一个新的领域，Agent主要拆分为几个属性：**

+ **Crew：Agent群体，由多个Agent组成一个小团队。能够进行Agent编排。**
+ **Agent：一个单独的Agent，能够选择不同的设计模式，自由调度LLM、知识、工具。**
+ **Memory：Agent的执行过程记录（Agent记录、Crew记录、AgentTool记录），这些记录碎片合在一起便成了Agent的记忆。（Agent的记忆是独占的而不是共享的，你想一下我的记忆能给你吗？不能直接给，但是我可以说给你听，不是吗？****<font style="color:#DF2A3F;">所以Agent与Agent之间</font>****<font style="color:#DF2A3F;">记忆不共享</font>****，而是通过自然语言或者某协议进行传递。）**
+ **Tool：工具**
+ **Knowledge：Agent的知识库引用、Crew的知识库引用**

Knowledge：知识库

Model：模型

Bill：账单



### 领域模型

![画板](https://image.233377.xyz/2026/6f0510208fe632953256e239c6606b6d.jpeg)

<font style="color:#8A8F8D;">（关联关系就不在这里详细表达了）</font>





session新增字段：

+ CrewId
+ lastAgentId



Crew【Crew】：

+ name：名称
+ description：描述
+ cooperationType：协作类型（Sequential、Async、Supervisor、ChatGroup）
  - Sequential：按照工作流顺序执行
  - Async：按照工作流顺序执行，异步处理Agent节点
  - Supervisor：不按照工作流顺序执行，Agent与Agent之间的通信是通过工具调用的，LLM来决策是否需要使用该工具（是否需要调用该Agent）
  - ChatGroup：多Agent并行
+ sessionHandlingType：问题处理类型（开始节点、上个回复的Agent节点）
+ backstory：背景信息
+ tools：工具列表
+ reply_method：回复方式（说明：执行完成后应该是继续往下走，还是返回上游<font style="color:#D8DAD9;">（再比如：在一个Supervisor的Crew里，PD的一个需求给到TL，TL给到开发，最终是开发交付PD还是开发给TL给PD？）</font>）
+ Knowledge：知识库信息
+ maxRetryLimit：发生错误时最大重试次数
+ stepCallback：步骤回调消息

Agent【Agent】：

+ name：名称
+ description：描述
+ llm：大模型模块
+ llm Parametric：大模型基本参数信息（Temperature、TOP_P、MAX TOKEN、上下文轮次数......）
+ backstory：背景信息
+ tools：工具列表
+ maxIter：最大迭代次数
+ maxExcutionTime：最大执行时间
+ designPattern：设计模式。包含：`ReAct`、`ReWOO(Reason WithOut Observation)`、`PE(Plan & Execute)`、`LLM Compiler`、`Basic Reflection`、`Self Discover`、`Reflection`、`LATS`
+ designPatternInfo：设计模式对应的专属信息Map
+ systemPrompt：系统提示词模块
+ UserPrompt：用户提示词模块
+ Inputparameter：输入参数模块
+ Output：输出模块
+ maxRetryLimit：发生错误时最大重试次数
+ session_summary_ability：总结能力
+ agent_summary_ability：整个agent的总结能力
+ Knowledge：知识库信息
+ stepCallback：步骤回调消息

AgentRecord【Agent执行记录】：

+ sourceType：类型，Agent、Crew
+ sourceId：id。agentId or CrewId
+ botId：botid
+ sessionId：会话id
+ messageId：消息id
+ userId：用户id
+ inputParam：入参
+ outputParam：出参
+ cycleCount：agent内部循环次数；Crew使用循环组件后组件内的循环次数；
+ toolRecordId: 工具调用记录

AgentTool【工具】

+ toolId：工具id
+ name：工具名称
+ inputParam：入参信息
+ description：工具描述
+ status：状态

AgentToolRecord【工具使用记录】

+ toolRecord: 调用记录id
+ toolId：工具id
+ sessionId：会话id
+ agentId：调用方AgentId
+ userId：用户id
+ inputParame：输入
+ outputParam：输出
+ status: 调用状态







## 核心交互

### 产品流程（我YY的）

![画板](https://image.233377.xyz/2026/8bf4ee861d4807c6184f1dc67a5ef572.jpeg)

### 整体核心时序

![画板](https://image.233377.xyz/2026/508fcfb4bde4ae492c40b23c0682bcc5.jpeg)







预制工具列表：

1. 计算器Tool
2. 代码执行Tool
3. 调用Bot的Tool
4. 搜索引擎Tool
5. 天气Tool
6. 翻译Tool
7. 人类输入Tool
8. ocrTool
9. 语言识别Tool
10. TRTool
11. ShellTool









## 其他需求

1. LLM节点增强 or 新增节点（功能：function call能力）
2. Workflow、Crew、Crew新增输入节点
3. Agent包含中断流程进行人类输入能力
4. workflow、Crew、Crew新增循环组件（支持循环+并发）
5. workflow、agent，执行过程信息





# RoadMap

|      | S1                                                           |                                                              |                                                   |                                                             | S2   |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------- | ---- |
|      | 3月                                                          | 4月                                                          | 5月                                               | 6月                                                         |      |
| 目标 | 完成：<br/>1. Agent域架构、系分<br/>2. 升级LLM节点能力：LLM节点添加技能属性（让LLM节点成为一个小型的Agent）<br/><br/>推进：<br/>1. Agent能力建设<br/>2. 输入节点能力<br/>3. 运行过程信息 | 完成：<br/>1. 输入节点能力<br/>2. workflow新增循环组件（支持循环+并发）<br/>3. 运行过程信息<br/><br/>推进：<br/>1. Agent能力建设 | 完成：<br/>1. Agent能力第一版发布<br/>2. 工具能力 | 完成：<br/>1. 完善Agent能力<br/>2. 新增Agent Group模板<br/> |      |
| 进展 |                                                              |                                                              |                                                   |                                                             |      |
|      |                                                              |                                                              |                                                   |                                                             |      |
|      |                                                              |                                                              |                                                   |                                                             |      |






# 展望未来

1. 当前，模型争霸，Agent元年，物理世界的沟通模式逐步体现在Agent上，**越来越多Agent框架和产品**问世。
2. 初步，随着模型推理越来越强，Agent的能力越来越强，Agent生态越来越好，**服务的接口开始工具化**，提供给外部Agent随意调用
3. 稳固，**接口工具内部化，服务Agent化**，从Agent调工具到Agent调Agent
4. 完了，AI自己可以创建Agent
5. 全完了，AI占领地球甚至宇宙
6. ...















附：

Building effective agents：[https://www.anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents)