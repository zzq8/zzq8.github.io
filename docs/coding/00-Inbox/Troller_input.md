# llm 相关

> 常见流程：
> 先用 temperature 调节全局“尖锐度” → 再用 Top-p / Top-k 把低概率尾巴裁掉。
>
> 类比：
>
> - temperature = 把整座概率“山峰”压扁或拉高。
> - Top-p/Top-k = 在山脚下截断，把非常低的尾巴直接剁掉。



先把问题拆成两步：

1. 语言模型在生成 **下一个 token** 时，内部会给词表中每个候选词算出一个概率分布
   （例如：“I want to drink a …” 后面 50 % 可能是 “coffee”，20 % “tea”，10 % “beer”…）。

2. 采样策略决定到底选哪一个词。
   Top-p（又叫 *nucleus sampling*）就是其中一种采样策略，它用一个阈值 **p**（0–1 之间）来裁剪“可被挑选的候选集合”。

────────────────────────
Top-p 的具体做法
────────────────────────
① 把所有词按照概率从大到小排序。
② 从列表顶部往下累加概率，直到累计和 ≥ p。
③ 只在这 **一小片“核”(nucleus)** 里按照原概率再次归一化后随机抽取。

示例：
模型给出的概率（已排序）

| token  | prob | 累计和 |
| ------ | ---- | ------ |
| coffee | 0.50 | 0.50   |
| tea    | 0.20 | 0.70   |
| beer   | 0.10 | 0.80   |
| water  | 0.05 | 0.85   |
| juice  | 0.03 | 0.88   |
| milk   | 0.02 | 0.90   |
| …      | …    | …      |

若 **Top-p = 0.9**
→ 累计到 0.9 时，集合正好包含 {coffee, tea, beer, water, juice, milk}。
→ 其余罕见词（累计概率 0.10）被全部丢弃。
→ 再对这 6 个词做一次归一化后随机采样。

若 **Top-p = 0.3**
→ 只要“coffee”一个词就已超过 0.3，因此只能在 {coffee} 中选，等价于贪婪解。
→ 生成结果几乎没有随机性。

若 **Top-p = 1.0**
→ 累计到 1.0 才停，相当于把整张词表都留住 → 跟“完全不裁剪”一样，随机性最大。

────────────────────────
为什么要这样做？
────────────────────────
• 若只用温度 (temperature) 调节“随机性”，可能仍会出现概率 0.001 的离谱词；Top-p 把概率质量过低的部分整个截掉，可显著减少荒谬输出。
• 跟 Top-k（固定保留 K 个最高概率词）相比，Top-p 的**候选词数量是动态的**：
  • 当分布非常尖锐时（一个词就 90%），候选集合会很小 → 输出更确定；
  • 当分布平坦时（很多词概率接近），集合会自动变大 → 保持多样性。

────────────────────────
如何直观理解“p”的作用？
────────────────────────
想像“抓彩球”：
1. 把 100 个彩球放在盒子里，每种颜色的个数 ∝ 该 token 的概率。
2. 先抓出前 p × 100 个球放到一个小篮子里（这步就是累积到 p）。
3. 真正抽奖只在小篮子里进行。

• p 越小 → 小篮子只有几个颜色 → 结果高度确定。
• p 越大 → 小篮子颜色更多 → 结果更丰富，但极端冷门颜色仍被挡在篮子外面。

────────────────────────
与其他参数的关系
────────────────────────
1. Temperature：放大/压缩整个分布的尖锐度。
2. Top-k：保留概率最高的前 k 个词，k 固定。
3. Top-p：保留累计概率达到 p 的最小集合，集合大小可变。
在实践中常见组合：先用 temperature 调整体分布，再用 Top-p（或 Top-k）裁剪。

────────────────────────
一句话总结
────────────────────────
Top-p = 把“最可能的词”累加到达 p 的那一段切出来，只在这一段里随机选；
它既帮你剔除极低概率的离谱词，又能根据分布自动调整可选词数量，用一根刻度（p）就平衡了“可控性”和“多样性”。



# Function Calling vs MCP 的简单区别

mcp plugin ?

## 一句话概括

- **Function Calling** = LLM 临时"借用"你的函数
- **MCP** = LLM 连接到一个"工具商店"

## 形象比喻

### Function Calling（函数调用）🔧

```
你：GPT，帮我查今天天气
GPT：好的，我需要调用 get_weather() 函数
你：[提供函数定义和执行结果]
GPT：今天是晴天，25度
```

**像**：每次对话时，你临时告诉 LLM "这些是你可以用的工具"

### MCP（模型上下文协议）🏪

```
LLM 启动时就连接到"工具服务器"：
- 天气服务器（提供天气查询）
- 数据库服务器（提供数据查询）
- 文件服务器（提供文件操作）

你：GPT，帮我查今天天气
GPT：[自动从天气服务器获取] 今天是晴天，25度
```

**像**：LLM 一开始就知道有哪些工具商店可以去

## 核心区别对比

| 维度 | Function Calling | MCP |
|------|-----------------|-----|
| **连接时机** | ❌ 每次对话时临时声明 | ✅ 启动时就连接好 |
| **工具定义** | 你在代码中写函数定义 | 服务器提供标准化接口 |
| **谁执行** | 你的代码执行函数 | MCP 服务器执行 |
| **复用性** | ❌ 每个应用重新实现 | ✅ 多个应用共享同一服务器 |
| **标准化** | ❌ 各家 API 不同 | ✅ 统一协议 |

## 代码对比

### Function Calling 方式

```
# 每次对话都要声明可用函数
functions = [
    {
        "name": "get_weather",
        "description": "获取天气",
        "parameters": {...}
    }
]

response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "今天天气如何？"}],
    functions=functions  # ← 临时告诉它有这些函数
)

# 如果 LLM 要调用函数，你需要执行并返回结果
if response.choices[0].message.function_call:
    result = get_weather()  # 你自己执行
    # 再把结果发回给 LLM
```

### MCP 方式

```
# LLM 启动时就连接到 MCP 服务器
mcp_client.connect("weather-server")  # 天气服务器
mcp_client.connect("database-server")  # 数据库服务器

# 对话时，LLM 自动知道可用工具
response = llm.chat("今天天气如何？")
# LLM 自动调用 weather-server，无需你手动执行
```

## 实际场景

### Function Calling 适合：

```
✅ 简单的自定义功能
✅ 一次性的工具集成
✅ 不需要跨应用共享

例如：
- 查询自己数据库的特定数据
- 调用公司内部 API
- 临时的数据处理函数
```

### MCP 适合：

```
✅ 标准化的工具服务
✅ 多个应用共享同一工具
✅ 长期维护的工具生态

例如：
- Claude Desktop 连接各种 MCP 服务器
  - 文件系统服务器
  - GitHub 服务器
  - 数据库服务器
- 多个 AI 应用共享同一套工具
```

## 发展关系

```
Function Calling（2023）
    ↓
   各家 LLM 各自实现，不统一
    ↓
MCP（2024 by Anthropic）
    ↓
   统一标准，像"USB 接口"一样
```

**Function Calling** = 每个厂商自己的充电线
**MCP** = 统一的 USB-C 标准

## 类比总结

| Function Calling | MCP |
|-----------------|-----|
| 每次借工具 | 开了个工具店 |
| 临时工 | 长期合作伙伴 |
| 你提供菜单 | 餐厅自带菜单 |
| 各家充电器 | 统一 USB-C |
| 即插即用 | 一次连接，随时可用 |

## 能否共存？

**可以！** 实际应用中可以混合使用：

```
# 用 MCP 连接标准服务
mcp.connect("github-server")
mcp.connect("database-server")

# 用 Function Calling 处理自定义逻辑
custom_functions = [
    {"name": "calculate_profit", ...},  # 你的业务逻辑
]

# 组合使用
response = llm.chat(
    "查询 GitHub 仓库并计算盈利",
    mcp_servers=mcp,  # 标准工具
    functions=custom_functions  # 自定义工具
)
```

**总结**：MCP 是 Function Calling 的"标准化升级版"，但两者可以互补使用！









## 2025 总结

> 2024 大模型平台 C/B 入口平台, 当然没涉及核心工作流/模型/chunck,SFT部分. 但也很多学习 ! 【很赞】
> 2025 工作流架构演进 【一般， because 数据搞太多了, btw: 还是AI部分 good】

### reactAgent架构升级

> MasterAgent架构 -> 从AdvancedRag升级为MasterAgent架构，意图从单层升级为意图树
> 从工作流模式升级为真正的MasterAgent架构，模式从中转模式切换为PEER模式
> 最外层使用了P-E-E-R架构，因为考虑到性能，目前没有实现Review这一层，Loop可能只有一层
> AdvancedRag:

```
═══ 基础 RAG ═══

用户问题 → 向量检索 → 取Top K结果 → 塞给LLM → 回答
  简单粗暴，一条线走到底


═══ Advanced RAG ═══

用户问题
    ↓
┌── 检索前优化 ──┐
│  问题改写       │
│  问题分解       │
│  HyDE          │
└───────┬────────┘
        ↓
┌── 检索中优化 ──┐
│  混合检索       │
│  多路召回       │
│  Small-to-Big  │
└───────┬────────┘
        ↓
┌── 检索后优化 ──┐
│  Reranking     │
│  压缩/过滤     │
│  多文档融合     │
└───────┬────────┘
        ↓
    LLM 生成回答
        ↓
    高质量答案 ✅
```

MasterAgent:
用户 → Master Agent（总指挥）→ 分配给各个子Agent/工具

脚本任务有:

- 工作流设计, prompt设计
- SFT 微调预料数据构建
- 知识库, reactQA 数据的构建及脚本产出数据



## ilmprod 学习

### API架构设计 (serviceTemplate)

com.alipay.ilmprod.utils.template.HttpServiceTemplate#execute
public static <REQUEST extends BaseRequest, RESPONSE extends BaseResponse> Result<RESPONSE> execute(ServiceContext<REQUEST, RESPONSE> context, ServiceCallback<REQUEST, RESPONSE> callback)
--> 重点就是 callback 重写三个方法

1. 日志进来
2. callback.paramCheck(context);  callback.execute(context); onFail
3. return R;
4. 日志出去 finally: context.getServiceMonitorModel().recordElapseTime();

ps: 为什么这样做. 统一管理 日志.  那又为什么 cotroller, service 全搞对象分开... 为了可扩展

#### 切面做法 - B端是统一的模板管理 (9个controller切面)

1. com.alipay.ilmprod.web.aop.WebAspect (统一注解, 统一模板处理, 进真正的切面之前会先 `WebHolderUtil.fillServletReqAndResToHolder();``)

- @‌Component
- @‌Aspect
- @‌Order(-1)

1. com.alipay.ilmprod.web.aop.**AspectProcessorEngine**#processors (处理器列表 for 处理)

- com.alipay.ilmprod.web.aop.processorchain.AbstractAspectProcessor

1. 具体的切面执行, com.alipay.ilmprod.web.aop.processorchain.LoginCheckProcessor

还有一些其他切面类
ilmprod/web/aop/OperationLogAspect.java

### C 端切面没那么多很简单

登录鉴权也是, 一个 authLogin 接口种一下 cookie 到 cache,
其他接口请求的时候校验这个 cookie 还在不

另外就是如果配了又 sign 也会校验请求参数是否一致 (验签, sign入参是前后端一套加密后的Str, timestamp前端给的时间和当前时间对比范围)

### API 接口命名：listBot vs botList

接口名 = 动作 + 对象

listBots   = list（列出） + Bots（机器人们） ✅
botList    = bot（机器人） + List（列表）     ⚠️ 这更像一个变量名

listBots          列出机器人
getBot            获取机器人
createBot         创建机器人
updateBot         更新机器人
deleteBot         删除机器人
searchBots        搜索机器人
enableBot         启用机器人
disableBot        禁用机器人

## debugChat 回顾【TODO record】

> com.alipay.ilmservice.service.almp.biz.rpc.BotStreamChatFacadeImpl#debugChat

```
@startuml

|ibot|ibotservice (上游)
start
:发起 RPC TRI 请求;
|#AntiqueWhite|ilm|ilmservice
:/BotStreamChatFacadeImpl#debugChat;
|db|DB
:检索图配置 (flow, node);
|mson|
:限流检查 (mosn 的 layotto 限流 SDK);
|ilm|
:构建 flowCtx;
:构建 org.reactivestreams.Subscriber 监听对象;
note right
  AlmpStreamChatListener
  End & Msg 节点会走这里的 OnNext
  触发 RPC observer send 回去
end note
:EventBus FlowStartEvent 记录 DebugInput;
fork
:获取工作流图执行器;
note right
环调度图执行器
            ↓
基础链式图执行器
            ↓
工作流执行引擎抽象类 (bfs遍历)
end note
:[Begin] 发起工作流图调用;

repeat
:Start Node / xxx Node;
:计数 node cycleCount;

if (上游节点执行完成?) then (no)
  stop
else (yes)
  fork

  :执行start的**节点处理器** (AlmpStartExecuteNode);
  note
      1. 接口 AlmpExecuteNode (default执行模板方法)
  end note
  :记录节点debug信息 (NodeDebugEvent);
  note
    后续 finnaly 会用 eventBus 写入该条debug记录
    \----
      2. 抽象类 AbstractAlmpExecuteNode (重写上面的后置处理 after method)
  end note
  end fork
:放入成功的node到Set;
endif

repeat while (唤醒其他下游高优先级节点)
repeat
:处理各个节点执行后的Future;
note
  节点时候超时/需要重试
end note
repeat while(PriorityBlockingQueue<NodePriorityFuture> executeQueue.poll())


end fork
:AlmpStreamChatListener onComplete/onError;

@enduml
```

问题:
工作流搭建中, llm节点可以流式但是不会对外输出内容, message/end节点也可以流式但是可以对外吐出内容 这两中节点类型怎么协调的
还是说llm都是非流式, 只不过msg再勾选吐出方式 (假流式)
todo: llm&end之间的流式协调看下coze怎么做的

## memory 梳理

LLM 没有真正的记忆！它只是把之前的对话内容全部塞进输入里，每次都从头"阅读"一遍。 (上下文窗口)



# Other

app/bootstrap/pom.xml:91 文件设置这个, iexpmhome(基座有一套) -> iexpmhomecopilot (迁移到模块上同一套接口) 避免 apiPath 一致:
<webContextPath>/ai</webContextPath>

= 给整个项目的所有接口加上 /ai 前缀
= 访问任何接口都要带上 /ai
= 通常用于多项目部署时区分路径



---

```json
fd base.yml -x open {}
- exec: 英文 execute 的缩写，意为"执行"。-x 可理解为"交叉执行"或"对每个结果执行"。
- {} 含义 文件路径占位符
```



**PC端 = WEB端**

- 用户用**手机浏览器**访问 → 选择 **WAP**
- 用户用**电脑浏览器**访问 → 选择 **WEB**



---

## sequence id 生成

```json
/**
 * 生成时间戳Id
 *
 * @param tableSeqEnum tableSeqEnum
 * @return String
 */
public String generateTimestampId(TableSeqEnum tableSeqEnum) {
    // 8位sequence
    String sequence = zdalSingleSequence.getNextValue(tableSeqEnum.getTableName(), "SIMPLE")
        .getSequenceValue();

    //时间日期位，年月时分秒毫秒
    String timestamp = DateUtil.getUtcDateString(new Date(), "yyyyMMddHHmmssSSS");

    return timestamp + tableSeqEnum.getBizCode() + sequence;
}
```

---

```
大纲

日志 (配置, p6spy)

自动装配

jsr303+i18n

关键字段脱敏

接口幂等

限流

Spring Boot AutoConfiguration.imports文件详解

META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports (标准路径（必须严格遵守）)文件是Spring Boot 2.7+引入的新的自动配置注册机制，用于替代旧版本的spring.factories文件。

为什么要换: 因为以下是重要原因, 更好维护

# spring.factories混合了多种用途
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.example.RedisAutoConfiguration

org.springframework.context.ApplicationContextInitializer=\
  com.example.MyContextInitializer

org.springframework.boot.env.EnvironmentPostProcessor=\
  com.example.MyEnvironmentPostProcessor

org.springframework.boot.SpringApplicationRunListener=\
  com.example.MyRunListener

# 问题：
# ❌ 一个文件管理多种不同类型的配置
# ❌ 难以针对某一类配置优化性能
# ❌ 容易混淆

维度	spring.factories	AutoConfiguration.imports	重要性
格式	key=value,续行	每行一个类名	⭐
职责	混合多种SPI	专注自动配置	⭐⭐⭐
性能	较慢	快8-15%	⭐⭐
维护性	Git diff不清晰	Git diff清晰	⭐⭐⭐
错误提示	模糊	精确行号	⭐
IDE支持	有限	完整支持

AutoConfiguration.imports只处理@EnableAutoConfiguration这一种用途 （@EnableAutoConfiguration）

jsr303+i18n

/**
  * 校验国际化配置
  * ⚠️ 必须手动配置才能让JSR-303使用Spring的MessageSource
 */

 spring:
  # 资源信息
  messages:
    # 国际化资源文件路径
    basename: i18n/messages

//content-language:en_US  // default 有很多方式这是其中一种 header
Accept-Language:en-US // ruoyi 重载了类换成了这个

1117

Spring Events, 自家的
Guava EventBus, 快一点点

https://sa-token.cc/doc.html#/start/example

org.ruoyi.common.security.handler.AllUrlHandler
requestMappingHandlerMapping 这个bean可以获取所有的 api path

1118

脱敏学习 (序列化)

org.ruoyi.common.sensitive.handler.SensitiveHandler

	/**
      * 银行卡
     */
    BANK_CARD(DesensitizedUtil::bankCard);
    private final Function<String, String> desensitizer;

    public Function<String, String> desensitizer() {
        return desensitizer;
    }

private SensitiveStrategy strategy;
strategy.desensitizer().apply(value);

createContextual 是项目启动加载不同的策略序列化器 strategy, 例如区分是手机还是邮箱的序列化实现
createContextual的执行时机测出来是在第一次发起接口请求后碰到有字段被Sensitive注解类修饰过的才会进该方法 (懒加载（Lazy Initialization）执行的)

@Retention(RetentionPolicy.RUNTIME)
@target(ElementType.FIELD)
@JacksonAnnotationsInside
@JsonSerialize(using = SensitiveHandler.class)
public @interface Sensitive {
    SensitiveStrategy strategy();
}

JacksonAnnotationsInside的作用是什么, 为什么字段属性有Sensitive注解才会进createContextual方法

看到 @‌Sensitive 注解
发现它有 @‌JacksonAnnotationsInside
深入查看 @‌Sensitive 内部的注解
找到 @‌JsonSerialize(using = SensitiveHandler.class)
调用 createContextual 方法

1120

org.ruoyi.common.idempotent.annotation.RepeatSubmit

幂等学习

还比较简单

ibotservice 是前后端一起 sha256 再 equals

这里是只后端逻辑处理 MD5, cache 存取判断

限流

需要对比学习下, 得看下
用的 Reddsion 自带的 api, RRateLimiter 令牌桶算法 (Token Bucket)

org.ruoyi.common.ratelimiter.aspectj.RateLimiterAspect#getCombineKey
这里 key 的组装规则需要看下

other

没有用 tomcat

<!-- web 容器使用 undertow 性能更强 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>

向量数据库



查询: "好用的智能手机"
返回:
  - iPhone 15 Pro（相似度: 0.92）
  - 小米14（相似度: 0.88）
  - 华为Mate60（相似度: 0.85）

向量数据库不是只能 QA/QQ 召回答案吗? 你这个示例的答案和问题的字符并不匹配为什么也能召回

becase
核心原理：向量嵌入（Embedding）
原始文本                    向量（Embedding）
────────                    ──────────────────
"好用的智能手机"    →      [0.23, -0.45, 0.67, ..., 0.12]  (1536维)
"iPhone 15 Pro"     →      [0.21, -0.43, 0.69, ..., 0.15]  (1536维)
"小米14"            →      [0.19, -0.41, 0.65, ..., 0.11]  (1536维)
"华为Mate60"        →      [0.20, -0.44, 0.68, ..., 0.13]  (1536维)

相似度计算（余弦相似度）：
"好用的智能手机" vs "iPhone 15 Pro"  = 0.92  ← 很相似
"好用的智能手机" vs "足球"            = 0.15  ← 不相似

为什么字符不匹配也能召回？ --> 因为 Embedding 模型已经学习了语义关系！

OpenAI 的 text-embedding-ada-002 模型训练过程（简化）

训练数据包含：

"iPhone 是一款智能手机"

"小米手机性能很好"

"华为手机很好用"

"智能手机推荐"

...数十亿条文本

模型学到：

"iPhone" 和 "智能手机" 经常一起出现 → 向量距离近

"好用" 和 "推荐" 语义相关 → 向量距离近

"手机" 是 "iPhone/小米/华为" 的上位词 → 向量距离近

Weaviate 是向量数据库, 那么它和向量模型有什么关系
用户查询: "好用的智能手机"
↓
┌────────────────────────┐
│   向量模型 (Embedding)  │  ← 负责"理解语义"
│   (OpenAI/HuggingFace) │
└────────────────────────┘
↓ 生成
查询向量: [0.23, -0.45, 0.67, ...]
↓
┌────────────────────────┐
│   Weaviate (向量数据库) │  ← 负责"存储和检索"
│   存储商品向量         │
└────────────────────────┘
↓ 相似度计算
返回结果: [iPhone, 小米, 华为]
```



---

学不进是因为没有`以终为始` 看moneyxyz有1期  vibe coding 思想很对



AI 出现以后，程序员的发展方向彻底变了。

你必须专注于理解系统而非理解语法，你的技能必须从编写代码转移到架构、安全、人机协作等方面。

未来属于那些能够构想、开发和维护复杂系统的人。

 https://www.ruanyifeng.com/blog/2025/11/weekly-issue-372.html



---

阶段  核心任务    关键产出/动作
加载  找到并读入 .class 文件 在方法区创建类的运行时数据结构，在堆中生成 Class 对象
验证  确保 .class 文件安全、有效   文件格式、元数据、字节码、符号引用验证
准备  为静态变量分配内存   设置静态变量的“零值”（0, false, null）
解析  将符号引用转为直接引用 将类、方法、字段等符号引用替换为内存地址指针
初始化 执行类构造器 <clinit>()   执行静态变量赋值和静态代码块

---

```
在正则表达式中常见的“排除/否定”手段主要有三种：

1)  排除字符集（[^…]，又称“非集”或“负字符集”）
2)  负向先行断言 (?! …)
3)  负向后行断言 (?<! …)

下面用具体例子说明三者的写法、匹配结果以及各自的适用场景。

────────────────────────
一、排除字符集（[^…]）
────────────────────────
语法：在方括号内把 ^ 放在最前面，表示“除了 … 以外的任意单个字符”。

例子：提取字符串中所有的“连续非数字”片段。
正则： [^0-9]+

示例文本：  abc123def45gh

匹配过程：
• ^[^0-9]+ → 「abc」
• 接着 123 跳过
• 再次 ^[^0-9]+ → 「def」
• 45 跳过
• ^[^0-9]+ → 「gh」

特点：
• 只能对“单个字符”进行排除；
• 真正消耗（匹配）了对应字符；
• 与位置无关，只管当前字符是不是属于排除集。

────────────────────────
二、负向先行断言 (?! …)
────────────────────────
语法： A(?!B)    — 仅当 A 后面“不是”紧跟子模式 B 时才匹配 A；
注意：断言只判断，不消耗字符。

例子：匹配 foo，但要求后面不能跟 bar。
正则： foo(?!bar)

示例文本： foobar  fooqux

匹配结果：
• “foobar”中的 foo 后跟 bar，不匹配；
• “fooqux”中的 foo 后跟 qux，满足条件 → 「foo」。

特点：
• 判断“后面”内容；
• 不消耗字符（光标仍停在 foo 之后）；
• 常用来做“排除型”的后缀判断，如排除扩展名、排除特定单词等。

────────────────────────
三、负向后行断言 (?<! …)
────────────────────────
语法： (?<!B)A   — 仅当 A 前面“不是”子模式 B 时才匹配 A；
同样属于零宽断言，不消耗字符。

例子：匹配数字，但要求前面不能有美元符号 $。
正则： (?<!\$)\d+

示例文本： $100  200  $300  400

匹配结果：
• $100 不匹配（$ 触发否定）；
• 200 匹配 → 「200」；
• $300 不匹配；
• 400 匹配 → 「400」。

特点：
• 判断“前面”内容；
• 不消耗字符；
• 常用于排除特定前缀，如排除转义符、排除负号等。

────────────────────────
总结对比
────────────────────────
1. 排除字符集 [^…]    —— 控制“当前字符集合”，真正消耗字符。
2. 负向先行断言 (?! …) —— 控制“后面必须不出现…”，零宽、不消耗字符。
foo(?!bar)
3. 负向后行断言 (?<! …)—— 控制“前面必须不出现…”，零宽、不消耗字符。
(?<!B)A

XD: 注意一个放前一个放后 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

根据需求选择：
• 仅想排掉某些字符 → 用 [^…]；
• 想判断后缀是否不符合某条件 → 用 (?! …)；
• 想判断前缀是否不符合某条件 → 用 (?<! …)。
```





就是按照扩容后的 0b00000 第5位是 0/1 分成两个链表, 为1就挂到新扩容的那部分去, 为0不变



```
下面把 “旧下标 = oldHash & (oldCap - 1)” 的计算原理，以及为什么在扩容 2× 时只看
`(oldHash & oldCap)` 就能决定“留在原桶或挪到旧下标+oldCap”，用位运算和具体数字来彻底说明。

────────────────────────
1. 为什么用 oldHash & (oldCap - 1) 得到旧下标？

• HashMap/HashSet 的容量 `oldCap` 始终保持为 2 的幂次方（8、16、32 …）。
• 如果 m 是 2 的 n 次方，那么对 m 取模等价于按位与 (m - 1)：
    x % m  ≡  x & (m - 1)   （因为 m = 2ⁿ，二进制是 1 后跟 n 个 0）

这样可用位运算替代取模，速度更快。

例：
oldCap = 16 → 二进制 10000₂
oldCap - 1 = 15 → 01111₂
取下标：index = oldHash & 0b01111 = 低 4 位

────────────────────────
2. 扩容到 newCap = 2 × oldCap 时，下标会怎样变化？

• newCap = 2 × oldCap，所以 newCap 的二进制是在 oldCap 前再多一位：
  oldCap = 0b10000 (16) → newCap = 0b100000 (32)

• 新下标 = `oldHash & (newCap - 1)`，即取“低 5 位”。

把老 hash 的最低 5 位拆开看（从低到高）：

    bit4  bit3 bit2 bit1 bit0
           ↑     （原来用的低 4 位）
           ｜
           这个就是 oldCap 位 (值要么 0 或 1)

旧下标只用低 4 位 (bit3~bit0)。
多出来的 bit4 (= oldCap 位) 决定元素在扩容后是：

   – 0 ⇒ 新下标 = 旧下标（留在原桶）
   – 1 ⇒ 新下标 = 旧下标 + oldCap（搬到右侧对应桶）

────────────────────────
3. 为什么只要看 (oldHash & oldCap) 就够了？

因为：
oldCap 是 10000₂（若 oldCap = 16），只有 bit4 为 1。
• `oldHash & oldCap` 把 oldHash 的 bit4 提取出来。
   – 若结果是 0 ⇒ bit4 = 0
   – 若结果是 oldCap (即 10000₂) ⇒ bit4 = 1

这正好告诉我们扩容后新增的那一位是 0 还是 1。
因此不需要重新计算完整下标；一次 & 运算即可完成“留 / 挪”判断。

────────────────────────
4. 具体举例

设 oldCap = 16 (0b10000)，oldCap - 1 = 0b01111。
旧桶下标 range：0 ~ 15。

假设旧桶 index = 5 (0b0101)。旧桶中有两个元素：

• key1：oldHash 末 5 位 = 0b0 101  (十进制 5)
  – oldHash & 0b01111 = 0b0101 (5) ⇒ 旧下标 5
  – oldHash & oldCap   = 0b0 000  = 0 ⇒ bit4 = 0
  – 扩容到 32 时，新下标仍是 0b0 0101 = 5 → **留在原桶 5**

• key2：oldHash 末 5 位 = 0b1 0101 (十进制 21)
  – oldHash & 0b01111 = 0b0101 (5) ⇒ 同一个旧桶
  – oldHash & oldCap   = 0b1 0000 (16) ⇒ bit4 = 1
  – 新下标 = 5 + 16 = 21 → **搬到新桶 21**

桶内其余节点同理：只要 `(hash & oldCap)==0` 就留，==oldCap 就搬到右侧。

因为搬迁时是按“读旧链表顺序 → 分到 lo/hi 两条链 → 挂回”且不再用头插，所以
两条子链（lo, hi）各自内部保留了 A→B→C… 的原有次序；于是旧桶与新桶的元素顺序都保持不变。

────────────────────────
5. 小结

• 旧下标 = hash & (oldCap-1)：利用 “2 的幂取模” 快速取低位。
• 扩容翻倍时，只需检视 hash 与 oldCap 的按位与结果（0 / oldCap）即可判断去留：
  – 0 → 原下标；1 → 原下标 + oldCap。
• 尾插 + lo/hi 链表拆分，使元素在扩容前后次序不被反转，也规避多线程下环链风险。

若这解释已经清楚地回答了你的疑问，我们的讨论就结束；如有其他问题，继续提问！
```



学习扩容源码

> 关键是这个新旧的计算不是很懂, 位运算这里
>
> 解释：
> • 扩容时容量翻倍，newCap = oldCap << 1。
> • 旧下标 = oldHash & (oldCap - 1)（取低 log₂(oldCap) 位）。
> • 新下标 = oldHash & (newCap - 1)。多出的那 1 位正是 oldHash & oldCap。
> • 若该位是 0，旧下标和新下标相同；若是 1，则新下标 = 旧下标 + oldCap。
> → 因而判断去向只需看这一位，不必重新计算完整 hash 或做模运算。

1. “在 1.8 的扩容过程中，同一旧桶中的元素次序在新桶里还能保持不变，对吗？为什么？”
   你的回答：会，因为是整体挪，不是头插。
   解析：基本正确。1.8 在遍历旧链表时采用**尾插到两条独立链表（loHead/hiHead）**的方式，因此新桶中的元素顺序与旧桶一致，没有反转。



> XD: 自己的笔记还是不行, 还要研究   应该就是 trasfer() 扩容时候翻转链表   多线程导致的



JDK 7「头插 + 链表反转 + 并发死循环」到底怎么回事？

1. JDK 7 的做法
   • 插入新节点时采用**头插法**：把新节点放到链表最前面，新节点 → 老头 → …
   • 扩容（rehash）时，会**从链表头开始顺序遍历旧链表**，把每个节点搬到新数组的相应位置。
   • 因为搬迁时仍使用头插，所以在新桶里链表顺序被 **反转** 了一次。
2. 并发死循环的隐患
   • HashMap 在非线程安全场景下如果有多个线程同时 put、同时 rehash，就可能这样：
   a. 线程 A 正在对桶里节点做“头插搬迁”，不停修改 next 指针；
   b. 线程 B 同时读或写这个桶，还在遍历链表；
   c. 如果时序不巧，链表反转过程中指针被并发修改，可能会形成某节点 next 指向自己或形成环，进而导致另一线程遍历时死循环。
3. JDK 8 的改进
   • 把插入方式改为**尾插**，链表顺序保持插入先后。
   • 扩容搬迁时不再做头插，而是利用「低位 hash 位」直接分成两段，**保持原有相对顺序**，不会额外反转链表，从根本上杜绝了因链表反转 + 并发造成的环形链表风险。
   • 同时也减少了扩容时对 CPU cache 的破坏，提高了性能。



好的，先来澄清你提出的两个疑问，再帮你核对一下 5 个要点的回答，并给出进一步的自测题。  ──────────────────────── 一、JDK 7「头插 + 链表反转 + 并发死循环」到底怎么回事？  1. JDK 7 的做法      • 插入新节点时采用**头插法**：把新节点放到链表最前面，新节点 → 老头 → …      • 扩容（rehash）时，会**从链表头开始顺序遍历旧链表**，把每个节点搬到新数组的相应位置。      • 因为搬迁时仍使用头插，所以在新桶里链表顺序被 **反转** 了一次。  2. 并发死循环的隐患      • HashMap 在非线程安全场景下如果有多个线程同时 put、同时 rehash，就可能这样：        a. 线程 A 正在对桶里节点做“头插搬迁”，不停修改 next指针；        b. 线程 B 同时读或写这个桶，还在遍历链表；        c. 如果时序不巧，链表反转过程中指针被并发修改，可能会形成某节点next指向自己或形成环，进而导致另一线程遍历时死循环。    3. JDK 8 的改进      • 把插入方式改为**尾插**，链表顺序保持插入先后。      • 扩容搬迁时不再做头插，而是利用「低位 hash 位」直接分成两段，**保持原有相对顺序**，不会额外反转链表，从根本上杜绝了因链表反转 + 并发造成的环形链表风险。      • 同时也减少了扩容时对 CPU cache 的破坏，提高了性能。  ──────────────────────── 二、扩容搬迁时「低位为 0 留原位，低位为 1 挪到 index+oldCap」的细节  假设： • 原数组长度 oldCap = 16 (即 2⁴)，下标范围 0~15。   • 一个元素的原 hash 值 oldHash。   • 新数组长度 newCap = 32。    过程： 1. 计算 bucket 下标都是取oldHash & (oldCap-1)（低 4 位）。   2. 扩容后，新下标是 oldHash & (newCap-1)（低 5 位）。   3. 多出来的一位就是 oldHash & oldCap（即第 5 位，值要么 0 要么 1）。      • 如果这一位是 0：新下标 == 旧下标 ⇒ 节点留下。      • 如果这一位是 1：新下标 = 旧下标 + oldCap ⇒ 节点搬到“右侧对应位置”。    为什么“低位为 0 的保留、1 的全部搬走”就够了？   • 因为老桶里所有节点在旧数组里本来就哈希到同一个下标。但它们中只有一部分 hash 的第 5 位是 0，一部分是 1。分开这两批即可——不会出现「还需要逐个重新计算并比较整个 hash 值」的操作。   • 搬到新桶后仍可能发生碰撞（落到同一新桶），但由于数组变大，平均碰撞数减少，链表（或树）会更短。  ──────────────────────── 三、核对你的 5 点回答  1. 尾插的两个核心原因——      你已提到了「保证桶内顺序」「rehash 易搬迁」，很好；如果愿意再补一句「避免链表反转导致的并发死循环」，就完全到位了。    2. 扩容步骤——      你说“桶内下标为 0 的不用移动”——更准确是“(oldHash & oldCap)==0 的节点不用移动”；数值上就是低位那一位为 0。理解 OK。    3. 迭代器外层扫描顺序——回答正确。    4. equals 调用时机——回答正确。    5. 插入顺序 + 唯一性——回答正确。    ──────────────────────── 四、新的自测题（最后一次确认）   请简要回答以下 4 个问题：    1. 举例说明 tail-insert（尾插）如何让扩容时不必反转链表？   2. 扩容时判断节点去向为何只需查看(oldHash & oldCap) 这一位？   3. 如果某桶转换为红黑树，后续再缩小到低于阈值会怎样处理？   4. 说出三种常见 Set 的特点：      a) HashSet      b) LinkedHashSet      c) TreeSet    若全部答对，说明你已彻底理解 HashSet 的唯一性及迭代顺序原理。





> 桶的概念不知道 !!!  要捋清楚迭代顺序和插入顺序
>
> 要知道 hashSet 底层就是 hashMap

1. “内部数组结构”到底指什么？
   • HashMap/HashSet 底层有一块「一维数组」，数组每个槽位称为“桶”。这块数组本身也可以叫作“内部数组结构”（或表 table）。
   • 迭代器遍历时，首先顺序扫描这块数组的下标 0 → 1 → 2 → …；在遇到非空桶时，再按桶内的链表/红黑树次序遍历那一桶里的元素。
   • 因此，“哈希分布”决定元素落在哪些下标；“内部数组结构”决定迭代器一定先看下标小的桶，再看下标大的桶。数组一旦扩容，元素重新分布，迭代顺序就会随之改变。
   • 桶内结构（链表 / 红黑树）也影响顺序，但它只是「内部数组结构」的一部分——更准确地说，数组 + 每个桶里的链表/树共同组成整个内部结构。





1. 迭代顺序是“按 hash 数组顺序”吗？
   • 是的。外层顺序：数组下标从 0 到 length-1；内层顺序：每个桶里按链表/树的遍历顺序。
   • 这就解释了为什么：
   ① 同一个元素只要所在桶的下标不变，扩容前后你在迭代器中大概率还能看到它排在相近的位置；
   ② 只要扩容导致下标变化，整体顺序就会大幅调整。





以下结构结合了多种提示符工程元素，是构建复杂提示符的良好起点。 **顺序对某些元素很重要** ，但对其他元素则无关紧要。我们会在最佳实践中指出顺序的重要性，但一般来说， **如果您坚持这种顺序，这将是一个出色提示符的良好开端** 。

** XD 先梳理学会这个 **



https://github.com/anthropics/prompt-eng-interactive-tutorial/blob/master/Anthropic 1P/09_Complex_Prompts_from_Scratch.ipynb





---



## SQL

# 对线 AI, 问题: 请手写一条 SQL 查询语句，并分析其索引使用情况（是否会命中索引，为什么）

## 覆盖索引

-- 索引：KEY idx_user_status (user_id, order_status)

-- ❌ 不是覆盖索引（需要回表）
SELECT id, order_amount FROM orders WHERE user_id = 1001;
-- 原因：order_amount不在idx_user_status中

-- ✅ 是覆盖索引（不需要回表）
SELECT user_id, order_status FROM orders WHERE user_id = 1001;
-- 原因：user_id和order_status都在索引中

-- ✅ 也是覆盖索引（主键自带在非主键索引的叶子节点）
SELECT id, user_id FROM orders WHERE user_id = 1001;
-- 原因：id（主键）存在所有非主键索引的叶子节点中

## 其他

任何非主键索引的叶子节点都包含主键值, 以及当前联合索引的值
索引条件下推（减少回表）

## 扩展

额外的进阶知识点（可选了解）
什么时候优化器会"放弃索引"？

```
-- 假设表有100万行数据，其中95万行的status都是'paid'
SELECT * FROM orders WHERE order_status = 'paid';
即使 order_status 有索引，优化器也可能选择全表扫描！
```

原因：
回表代价太高（95万次随机IO）
不如直接顺序扫描全表（连续IO更快）
这叫"索引选择性"问题
可以用 EXPLAIN 看到 type=ALL（全表扫描）

## 问题:

### - 联合索引的存储是按每个key的顺序存储的吗, 范围扫描怎么理解

!important 数据先按a排序，a相同时按b排序，b也相同时按c排序
XD 核心理解: 索引的意思就是跟字典样的有序a,b,c..排号, 你查的时候就方便了 !!! 这就是索引

🎯 联合索引中的范围扫描
这里有个关键问题：

```
-- 索引：KEY idx_abc (a, b, c)

-- 查询1
SELECT * FROM t WHERE a = 1 AND b > 10 AND c = 5;
```

发生了什么？

a = 1：精确定位到 a=1 的区域
b > 10：在 a=1 的区域内，定位到 b=10 的位置，然后范围扫描
c = 5：❌ 无法利用索引的有序性
为什么 c 用不上索引的有序性？

看实际数据：

扫描到的数据（b > 10 的部分）：
(a=1, b=11, c=3)  ← c 不是有序的
(a=1, b=11, c=7)  ← 因为 b 的值在变化
(a=1, b=12, c=1)  ← c 的顺序被"破坏"了
(a=1, b=12, c=5)  ← 找到了！但必须逐行检查
(a=1, b=15, c=5)
但是： c = 5 仍然可以用索引条件下推过滤，减少回表！

## - explain 中的 filesort 代表没有全部使用到索引 / 没有用索引吗

用了索引查数据，但查出来的结果顺序不对，需要再排序

## 索引排序

-- 索引：KEY idx_abc (a, b, c)
SELECT * FROM t WHERE a = 1 AND b = 2 ORDER BY c;
不会有 filesort, ** 能用索引排序 **

-- 索引：KEY idx_abc (a, b, c)
SELECT * FROM t WHERE a > 1 ORDER BY b;
正确答案：会有 filesort！ ⚠️

```
索引中的数据：
(a=1, b=5, c=1)
(a=2, b=1, c=3)  ← a > 1 开始匹配
(a=2, b=3, c=5)  ← b 在这个范围内是有序的
(a=2, b=8, c=2)  ←
(a=3, b=2, c=1)  ← 但是 a 变了！b 的顺序"断"了
(a=3, b=7, c=4)  ←
(a=4, b=1, c=2)  ← b 又回到小值了
```

📌 记忆口诀：
"等值固定才有序，范围之后顺序断"

Using temporary 触发场景

- GROUP BY 字段无序 (有索引才有序)
- DISTINCT 无索引
- UNION（默认会去重）[避免方法： 用 UNION ALL（不去重）]

📊 完整知识体系总结
你现在对索引的理解已经非常深入了！让我整理一下完整的知识图谱：

1. 联合索引的排序规则
   ✅ 多字段按顺序依次排序（字典序）
   ✅ 理解 B+树 叶子节点的顺序结构
2. 索引使用的三个层次
   ✅ 索引定位/范围扫描（利用有序性查找）
   ✅ 索引条件下推（在索引上过滤，减少回表）
   ✅ 覆盖索引（不需要回表）
3. 何时能利用索引排序
   ✅ 等值条件 → 固定该字段，下一字段有序
   ✅ 范围条件 → 该字段有序，后续字段无序
   ✅ IN条件 → 类似多段范围，后续字段整体无序
4. EXPLAIN 中的关键标志
   ✅ Using where - 服务层过滤
   ✅ Using index - 覆盖索引（最优）
   ✅ Using index condition - 索引条件下推
   ✅ Using filesort - 需要额外排序
   ✅ Using temporary - 需要临时表（警惕！）
5. 优化思路
   ✅ 让 WHERE、ORDER BY、GROUP BY 都能用上索引
   ✅ 尽量用覆盖索引
   ✅ 避免 Using temporary

```
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    order_status VARCHAR(20),
    create_time DATETIME,
    order_amount DECIMAL(10,2),
    KEY idx_user_status (user_id, order_status),
    KEY idx_create_time (create_time)
);

-- 查询语句
SELECT user_id, order_status, order_amount
FROM orders
WHERE user_id IN (100, 200, 300)
  AND order_status = 'paid'
  AND create_time > '2024-01-01'
ORDER BY create_time
LIMIT 10;
```

请分析：

> 会用哪个索引？为什么？
> 会用 idx_user_status 索引，user_id 和 order_status 都会用上进行精确定位（三段范围扫描），但合并后整体无序。

> 会有 filesort 吗？为什么？
> create_time 既不在 idx_user_status 索引中，也不是查询结果的自然顺序

是覆盖索引吗？

> 如果要优化，你会怎么建索引？
> 最佳方案:
> -- 保留原索引
> KEY idx_user_status (user_id, order_status)

-- 新建针对性索引
KEY idx_user_time (user_id, create_time)

配合查询改写：
分三段写成

其他方案:
KEY idx_user_status_time_amount (user_id, order_status, create_time, order_amount)
记住是create_time在前面
因为 ✅ create_time 可以索引条件下推 + 参与排序（虽然整体会断，但每段内有序）

我的问题:

- key_len: 8 + 63 什么意思 (你知道 EXPLAIN 结果中的 key_len 是用来表示什么的吗？)

```
VARCHAR 在 UTF8MB4 字符集下：
- 每个字符最多 4 字节
- VARCHAR(20) = 20 * 4 = 80 字节
- 变长字段需要长度前缀：+2 字节
- 允许 NULL？+1 字节
```

表示这次查询实际用到的索引字段的字节长度
📊 key_len 的实战意义
通过 key_len 判断用了几个字段：

```
-- 索引：KEY idx_abc (a INT, b INT, c INT)
-- 假设都是 NOT NULL

-- 查询1
EXPLAIN SELECT * FROM t WHERE a = 1;
-- key_len: 4  ← 只用了 a（1个字段）

-- 查询2
EXPLAIN SELECT * FROM t WHERE a = 1 AND b = 2;
-- key_len: 8  ← 用了 a + b（2个字段）

-- 查询3
EXPLAIN SELECT * FROM t WHERE a = 1 AND b = 2 AND c = 3;
-- key_len: 12 ← 用了 a + b + c（3个字段）

-- 查询4
EXPLAIN SELECT * FROM t WHERE a = 1 AND c = 3;
-- key_len: 4  ← 只用了 a（c 跳过了 b，用不上索引定位）
```

- 一条查询可以同时用到多个索引吗?
  答案：可以，但很少见，**且通常不是最优方案**
  场景1：索引合并 - Union（OR 条件）

```
-- 表上有：KEY idx_a (a), KEY idx_b (b)

SELECT * FROM t WHERE a = 1 OR b = 2;
```

EXPLAIN 结果：

type: index_merge
key: idx_a,idx_b        ← 同时用了两个索引！
Extra: Using union(idx_a,idx_b); Using where
执行过程：

用 idx_a 找到 a=1 的记录
用 idx_b 找到 b=2 的记录
合并两个结果集（去重）
回表获取完整数据

性能：
⚠️ 通常效率不高（两次索引扫描 + 合并 + 去重）
⚠️ 不如建联合索引或改写查询





# Blog

#### BeautifulSoup

可以搭配 playwright 搞自动化, 好使

#### CSS 属性选择器支持几种模糊匹配

div[class*="titleCon"]

#### 零宽字符

零宽字符: 肉眼看不见、但实际存在于字符串中的字符，常被网站用来防爬虫/防复制。

解法: 用正则替换掉常见的

\```python

\# 匹配常见零宽字符

pattern = r’[\u200b\u200c\u200d\u2060\ufeff]’



s = “hello\u200bworld”



print(s)     # 输出：helloworld （看起来没有空格）

print(len(s))   # 输出：11     （但长度是 11，不是 10）

\```



## 两种乱码情况

你看到的「乱码」到底是什么样的？

是这种：

åªåæèï¼å¹¶ç¨æ¤æçå£°é³ååºç¨æ·

还是这种：

������

------

user: 第一种乱码

answer:
UTF-8 内容被当成 ISO-8859-1（Latin-1）或 Windows-1252 解码了。
这不是文件编码错，而是读取方编码错。

可以试下 curl <https://233377.xyz/resources/base.yaml> 返回的不乱码是 ok 的 !!!

------

响应头 Content-Type: text/yaml; charset=utf-8 就好了

```
这两种乱码本质上不一样。

第一种：åªåæè

例如：

中文
↓ UTF-8编码
E4 B8 AD E6 96 87
↓ 被当成 Latin1 解码
ä¸­æ

特点：

* 字符很多
* 看起来像外语
* å、ä、Ã、â、Ð、Ñ 特别多
* 原始字节还在

这种属于：

UTF-8 → 被错误按 ISO-8859-1/Windows-1252 解码

数据没丢，可以恢复。 ￼

⸻

第二种：���� 或 ? ? ?

例如：

中文
↓
����

或者：

???

特点：

* 全是问号
* 或黑菱形问号 �
* 原文已经看不出来

这是：

解码器发现字节根本不合法，直接用替代字符代替

Unicode 里这个字符叫：

U+FFFD
�

即 Replacement Character（替换字符）。 ￼

⸻

最大区别

第一种：

åªåæè

还能救回来。

因为：

错误解码
≠
数据丢失

字节仍然存在。 ￼

⸻

第二种：

����

很多时候救不回来。

因为程序已经执行了：

非法字节
↓
替换成 U+FFFD
↓
原字节被丢弃

例如：

E4 B8 AD
↓
�

此时你已经不知道原来是：

中
文
日
韩

中的哪一个了。 ￼

⸻

结合你的 GitHub Pages 问题：

你看到的是：

åªåæè

属于第一种。

这说明：

✅ 文件是好的
✅ UTF-8 字节是好的
✅ GitHub Pages 返回的数据也是好的

只是某个客户端把 UTF-8 当成 Latin1 读了。

如果你看到的是：

����

那我反而会怀疑：

* 文件上传时损坏
* 构建过程转码失败
* 某个环节真的把数据改坏了

因为那已经属于数据丢失级别的问题了。
```





# 动态代理 + RPA 为什么用 Hessian

你的代码                    代理对象                      远程服务器
─────────                  ─────────                    ───────────

userService
.getUser(1L)
│
▼
[代理拦截]  ──────────→  InvocationHandler.invoke()
│
├─ 1. 封装请求
├─ 2. 序列化 (Hessian)
├─ 3. 查注册中心
├─ 4. Netty发送  ──────────→  接收请求
│                             执行方法
├─ 5. 等待响应  ←──────────  返回结果
├─ 6. 反序列化
│
◀──────────────────  return User对象

User user = ...  ✅ 拿到结果，完全感知不到网络调用

## 先搞懂动态代理的思想

### 静态代理（帮你理解动态代理）

```
// 你有一个明星接口
public interface Singer {
    void sing();
    void dance();
}

// 真实明星
public class JayChou implements Singer {
    public void sing() { System.out.println("周杰伦唱歌"); }
    public void dance() { System.out.println("周杰伦跳舞"); }
}

// 静态代理 = 经纪人（手动写的代理类）
public class AgentProxy implements Singer {
    private Singer realStar = new JayChou();

    public void sing() {
        System.out.println("经纪人：收钱、签合同...");  // 增强逻辑
        realStar.sing();                              // 真实调用
        System.out.println("经纪人：结算、送走...");   // 增强逻辑
    }

    public void dance() {
        System.out.println("经纪人：收钱、签合同...");
        realStar.dance();
        System.out.println("经纪人：结算、送走...");
    }
}
问题：有100个方法 → 要写100遍 "收钱、签合同..."
     有100个明星 → 要写100个经纪人类

静态代理 = 人工手写，代码爆炸
```

------

### 动态代理 = 自动生成经纪人

```
// 动态代理：只写一次拦截逻辑，自动适配所有方法
Singer proxyAgent = (Singer) Proxy.newProxyInstance(
    Singer.class.getClassLoader(),
    new Class[]{Singer.class},

    new InvocationHandler() {
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) {
            // ⭐ 不管你调用 sing() 还是 dance() 还是其他100个方法
            // ⭐ 都会先经过这里！

            System.out.println("经纪人：收钱签合同");    // 统一增强
            Object result = method.invoke(realStar, args); // 调真实的
            System.out.println("经纪人：结算送走");       // 统一增强

            return result;
        }
    }
);

// 使用
proxyAgent.sing();   // → 经纪人逻辑 → 周杰伦唱歌
proxyAgent.dance();  // → 经纪人逻辑 → 周杰伦跳舞
// 你拿到的是代理对象，以为是周杰伦，实际先过经纪人
```

------

### RPC 就是这个思想

```
// RPC里
// 真实明星 = 远程服务器上的 UserServiceImpl
// 经纪人   = 本地的代理对象
// 收钱签合同 = 序列化、网络传输、等响应

UserService proxy = RpcProxyFactory.create(UserService.class);

proxy.getUser(1L);
// ↓ 你以为
// 直接执行 UserServiceImpl.getUser(1L)

// ↓ 实际上经过了代理
// invoke() 被触发
//   → 序列化参数
//   → 网络发送到远程
//   → 等待响应
//   → 反序列化结果
//   → return 给你
动态代理的核心思想：
"你调用任何方法，我都能在中间插一脚"

不用你手写每个方法的拦截
框架自动生成代理类，统一拦截，统一处理
```

------

## 为什么用 Hessian 不用 JSON？

### 网络传输的是字节，不是字符串

```
很多人误解：网络传输 → 发文字

实际上：网络传输 → 发字节流 (byte[])

JSON  序列化：对象 → JSON字符串 → 转成字节 → 发送
Hessian序列化：对象 → 直接二进制字节 → 发送

JSON多了一层：对象 ↔ 字符串 ↔ 字节  （多一次转换）
Hessian直接：对象 ↔ 字节            （少一次转换）
```

### 实际差异

```
User user = new User("张三", 18);

// JSON序列化结果（字节数组，但内容是文字）
byte[] jsonBytes = "{\"name\":\"张三\",\"age\":18}".getBytes();
// 字节数：约 30 字节
// 包含：字段��"name" "age"，引号，冒号，大括号

// Hessian序列化结果（纯二进制）
byte[] hessianBytes = hessian.serialize(user);
// 字节数：约 15 字节
// 不包含字段名，用位置/类型信息标识
// 人看到的：乱码 ����...
```

### 内部调用为什么不用"易读性"

```
易读性 → 是给人看的
网络传输 → 是给机器处理的

RPC内部调用链路：
服务A → 序列化 → 网络 → 反序列化 → 服务B
          ↑                  ↑
       机器做               机器做
       不需要人看！

就像：
快递打包 → 你不会用透明袋子方便别人偷看
          而是用最结实、最小的箱子运输
```

### 什么时候用 JSON？

```
对外 API（给前端/第三方）→ JSON  ✅ 人要看、跨语言
内部 RPC（Java to Java） → Hessian ✅ 性能优先

HTTP接口：浏览器打开能看到内容 → JSON有意义
RPC接口：没有人直接查看传输内容 → JSON的可读性毫无价值
```

------

## 总结

```
动态代理：
"你调用方法 → 我在中间拦截 → 偷偷做很多事 → 返回结果"
核心是：统一拦截，不用手写每个方法

Hessian vs JSON：
JSON可读性 → 是给人看的优点
网络传输   → 机器处理，可读性没用
Hessian    → 更小、更快、类型安全 → RPC内部首选
```



Hessian：
对象 ──────────────→ byte[]
直接分析字段值
直接写入二进制

JSON：
对象 ──────→ JSON字符串 ──────→ byte[]
第一步              第二步
生成文本字符串        字符串转字节



# JUC 线程池学习

ThreadPoolExecutor 中 4 中拒绝策略:
AbortPolicy（抛出异常）
CallerRunsPolicy（提交者自己跑）
DiscardPolicy（直接丢本次任务）
DiscardOldestPolicy（丢队列里“最早”**earliest**（最早）那个任务，然后再尝试把当前任务放进队列）

====> 学习 *****
CallerRunsPolicy 的语义是：【mcp 项目中就是模仿这个但是除了 run 外多加了一个日志记录 (Lambda 表达式代替匿名内部类)】

- 如果线程池只是因为“忙不过来 / 队列已满”而拒绝任务，那么就退而求其次，让提交任务的调用线程（caller 线程）自己同步执行这个任务，从而起到“背压”（throttle）作用；
- 但是，如果线程池已经进入关闭（shutdown 或 shutdownNow）状态，那就必须保持 ThreadPoolExecutor 的契约 —— 关闭后的线程池不得再接受和执行任何新任务。此时应当真正地“拒绝”这次提交。

```
ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(10, 10,
            1, TimeUnit.MINUTES, new LinkedBlockingQueue<>(100), (r, executor) -> {
        LogUtil.error(logger, "LogMcpServer rejectedExecution");
        r.run();
    });
```

AbortPolicy: 默认策略, 拒绝+thow exception
====> 学习 End

===> 这几种常用 *****
• AbortPolicy → 立即抛异常，便于监控告警。
• CallerRunsPolicy → 降低提交方速度，天然“背压”。
• 自定义 RejectedExecutionHandler → 可以记录日志、统计指标、降级处理。
===>  End

违背了多数后端业务对“有序、可追踪、可靠”这三点的基本需求；除非极端实时性场景且业务本身对数据完整性要求极低，否则几乎没有理由选用它:
• DiscardPolicy  —— “当前任务直接丢”
• DiscardOldestPolicy —— “丢最老，再尝试塞当前”

二者都会产生“静默丢失”的副作用，因此在对一致性、可追踪性有要求的后端业务中几乎禁用。
只有在“可丢且愿意丢”的实时、幂等、低价值任务场景才可能考虑。









“背压”（Back-pressure）或“节流 / 限流”（Throttle）是分布式系统、并发编程里经常出现的概念，核心目的都是——



让上游根据下游的处理能力主动减速、限流或暂时停止，从而避免下游被请求淹没、崩溃或 OOM。



一句话：看我吃得慢，你就别喂得快。





1. 背压 vs. 节流（Throttle）

- 业内常把两词混用：都指“限速”。
- 细分理解：



Throttle：通常指在“入口”按固定速率出水；

Back-pressure：更强调由下游向上游反馈所产生的自适应限速。



```
## 线程池配置学习 -> ThreadUncaughtExceptionHandler

``` ibotservice, ilmservice 的 CompletableFuture.runAsync 用到的线程池
/**
  * chat 线程池
 */
public static final ThreadPoolExecutor CHAT_THREAD_POOL = new SofaThreadPoolExecutor(
    150,
    150,
    5L,
    TimeUnit.MINUTES, new SynchronousQueue<>(),
    new ThreadFactoryBuilder()
        .setNameFormat("chat-pool-%d")
        .setUncaughtExceptionHandler(new ThreadUncaughtExceptionHandler()).build(), new ThreadPoolExecutor.AbortPolicy());
// 使用
IbotserviceThreadPoolUtil.CHAT_THREAD_POOL


private static final ThreadUncaughtExceptionHandler threadUncaughtExceptionHandler = new ThreadUncaughtExceptionHandler();
	/**
  * 针对慢速节点以及一些耗时不可控的节点
 */
@Bean()
public ThreadPoolExecutor almpGraphExecutor() {
    LogUtils.CONFIG_CACHE.info("almpGraphExecutor start");

    ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
            .setNameFormat("almp-graph-execute-pool-%d")
            .setUncaughtExceptionHandler(threadUncaughtExceptionHandler)
            .build();

    ThreadPoolExecutor executor = new SofaThreadPoolExecutor(350, 450, 60L, TimeUnit.SECONDS, new SynchronousQueue<>(), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());
    LogUtils.CONFIG_CACHE.info("almpGraphExecutor finish");
    return executor;
}

// 使用
@Resource
private   ThreadPoolExecutor           almpGraphExecutor;	
```

执行方式	异常行为	是否打印堆栈	如何获取异常	推荐异常处理
ThreadPoolExecutor.execute()	抛出到线程	✅ 是	UncaughtExceptionHandler	UncaughtExceptionHandler
ThreadPoolExecutor.submit()	Future 包装	❌ 否	future.get()	重写 afterExecute()
CompletableFuture.runAsync()	内部捕获	❌ 否	get()/join()	exceptionally()/whenComplete()

## ReentrantLock 学习 (AbstractQueuedSynchronizer)

> ReentrantLock, CountDownlatch, Semaphore  --> 都是基于 AQS 实现的, 给这些同步组件提供强大的基础
> 学习地址: https://www.bilibili.com/video/BV1E14y1E7Q4?spm_id_from=333.788.player.switch&trackid=web_related_0.router-related-2206419-tqkgg.1763976222206.82&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0
> 特性

- 可重入锁
- 默认 new NonfairSync()

重点

1. volatile int state: 代表**同步状态 (有没有获取到锁)** ==> e.g. 没有(0)/加锁(=0 有一个线程加锁 / >1 被同一个线程多次加锁, 这也可看出可重入) state
   - getState
   - setState
   - compareAndSetState (CAS 内存位置, 预期旧值, 新值)
2. Node (存放当前没有获到锁的线程) 双向链表 Node
   - int waitStatus
   - Node prev
   - Node next
   - Thread thread

流程
thread-0: state=1 拿锁, 运行中
thread-1: CAS while..   放入一个等待队列
thread-0: state=0 执行完成
thread-1: state=1, 拿到

todo...





ThreadPoolExecutor: jdk
ThreadPoolExecutor: 基于 ThreadPoolExecutor 的 spring 框架版本, 支持搭配 @‌Async
Scheduler (Reactor)：是 Project Reactor 专为响应式编程（Reactive Streams） 设计的线程调度抽象接口[[citation:9]]。它的核心理念是“按任务类型调度”而非“按线程数量调度”，主要用于控制 Flux/Mono 操作符的执行线程（如 subscribeOn、publishOn），解决响应式流中的线程切换和阻塞隔离问题

| 维度 | ThreadPoolTaskExecutor (Spring) | Scheduler (Reactor) |
| ---- | ------------------------------- | ------------------- |
|      |                                 |                     |
| :--- | :--- | :--- |
| ---- | ---- | ---- |
|      |      |      |
| **主要用途** | 通用异步任务、@Async、定时任务 | 响应式流线程切换、隔离阻塞操作 |
| ------------ | ------------------------------ | ------------------------------ |
|              |                                |                                |
| **控制粒度** | 细粒度（核心线程、最大线程、队列等） | 粗粒度/语义化（按 I/O 或 CPU 类型预设） |
| ------------ | ------------------------------------ | --------------------------------------- |
|              |                                      |                                         |
| **底层依赖** | JDK ThreadPoolExecutor | JDK ExecutorService 或 VirtualThread |
| ------------ | ---------------------- | ------------------------------------ |
|              |                        |                                      |
| **框架集成** | Spring 容器生命周期、@Async | Reactor subscribeOn/publishOn、Context |
| ------------ | --------------------------- | -------------------------------------- |
|              |                             |                                        |



ThreadPoolExecutor 中 4 中拒绝策略:
AbortPolicy（抛出异常）
CallerRunsPolicy（提交者自己跑）
DiscardPolicy（直接丢本次任务）
DiscardOldestPolicy（丢队列里“最早”**earliest**（最早）那个任务，然后再尝试把当前任务放进队列）

====> 学习 *****
CallerRunsPolicy 的语义是：【mcp 项目中就是模仿这个但是除了 run 外多加了一个日志记录 (Lambda 表达式代替匿名内部类)】

- 如果线程池只是因为“忙不过来 / 队列已满”而拒绝任务，那么就退而求其次，让提交任务的调用线程（caller 线程）自己同步执行这个任务，从而起到“背压”（throttle）作用；
- 但是，如果线程池已经进入关闭（shutdown 或 shutdownNow）状态，那就必须保持 ThreadPoolExecutor 的契约 —— 关闭后的线程池不得再接受和执行任何新任务。此时应当真正地“拒绝”这次提交。

```
ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(10, 10,
            1, TimeUnit.MINUTES, new LinkedBlockingQueue<>(100), (r, executor) -> {
        LogUtil.error(logger, "LogMcpServer rejectedExecution");
        r.run();
    });
```

AbortPolicy: 默认策略, 拒绝+thow exception
====> 学习 End

===> 这几种常用 *****
• AbortPolicy → 立即抛异常，便于监控告警。
• CallerRunsPolicy → 降低提交方速度，天然“背压”。
• 自定义 RejectedExecutionHandler → 可以记录日志、统计指标、降级处理。
===>  End

违背了多数后端业务对“有序、可追踪、可靠”这三点的基本需求；除非极端实时性场景且业务本身对数据完整性要求极低，否则几乎没有理由选用它:
• DiscardPolicy  —— “当前任务直接丢”
• DiscardOldestPolicy —— “丢最老，再尝试塞当前”

二者都会产生“静默丢失”的副作用，因此在对一致性、可追踪性有要求的后端业务中几乎禁用。
只有在“可丢且愿意丢”的实时、幂等、低价值任务场景才可能考虑。









“背压”（Back-pressure）或“节流 / 限流”（Throttle）是分布式系统、并发编程里经常出现的概念，核心目的都是——



让上游根据下游的处理能力主动减速、限流或暂时停止，从而避免下游被请求淹没、崩溃或 OOM。



一句话：看我吃得慢，你就别喂得快。





1. 背压 vs. 节流（Throttle）

- 业内常把两词混用：都指“限速”。
- 细分理解：



Throttle：通常指在“入口”按固定速率出水；

Back-pressure：更强调由下游向上游反馈所产生的自适应限速。



## 并发线程

网络请求发出后，线程会阻塞等待
线程状态变为 WAITING
不消耗CPU，但占内存
操作系统会调度其他线程执行

为什么IO密集型可以开很多线程
99%的时间线程都在"睡觉"
CPU可以在这期间执行其他线程
200个线程只占200MB内存，完全可接受
因为 :
// 默认线程栈大小
// JVM启动参数：-Xss1m （1MB per thread）

单个线程内存 ≈ 线程栈大小

CPU = 算力（处理计算）
多线程 = 内存（每个线程占内存）
线程需要计算时才用CPU，等待时CPU空闲

CPU密集型（计算π）：
线程1: [████████████████] 16核全力计算
线程2: [████████████████] 等待CPU
...
→ 线程再多也没用，CPU就8核，开太多线程反而上下文切换浪费

IO密集型（网络请求）：
线程1: [█] 发请求 → [睡3秒] → [█] 处理响应
线程2: [█] 发请求 → [睡3秒] → [█] 处理响应
...
→ 大部分时间在"睡觉"，CPU闲着，所以可以开很多线程

经典公式（最常用）
线程数 = CPU核心数 × (1 + IO等待时间 / CPU计算时间)

你的场景实例计算：
// 已知条件：
CPU核心数 = 8 (M1 MacBook)
单次请求总耗时 = 3000ms
CPU计算时间 = 3ms (前面测出来的)
IO等待时间 = 3000 - 3 = 2997ms

// 代入公式：
线程数 = 8 × (1 + 2997/3)
= 8 × (1 + 999)
= 8 × 1000
= 8000

// 理论上需要8000个线程才能榨干CPU
// 但实际不需要这么多！

```
package org.example;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class ThreadTest {

    private static final ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
            16,
            200,
            2, TimeUnit.MINUTES,
            new LinkedBlockingQueue<>(100),  // ← 改小队列！关键修改
            new ThreadFactory() {
                private final AtomicInteger count = new AtomicInteger(0);
                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r, "http-client-" + count.incrementAndGet());
                    return t; // 不要设置daemon，否则主线程结束会强制终止
                }
            },
            new ThreadPoolExecutor.CallerRunsPolicy()
    );

    public static void main(String[] args) throws InterruptedException {
        // 添加监控
        ScheduledExecutorService monitor = Executors.newScheduledThreadPool(1);
        monitor.scheduleAtFixedRate(() -> {
            System.out.printf("[监控] 活跃:%d | 池大小:%d | 队列:%d | 完成:%d%n",
                    threadPoolExecutor.getActiveCount(),
                    threadPoolExecutor.getPoolSize(),
                    threadPoolExecutor.getQueue().size(),
                    threadPoolExecutor.getCompletedTaskCount()
            );
        }, 0, 1, TimeUnit.SECONDS);

        // 压测代码
        long start = System.currentTimeMillis();
        CountDownLatch latch = new CountDownLatch(1000);

        for (int i = 0; i < 1000; i++) {
            final int taskId = i;
            threadPoolExecutor.submit(() -> {
                try {
                    if (taskId < 5) { // 只打印前几个，避免刷屏
                        System.out.println("任务" + taskId + " 开始执行，线程:" + Thread.currentThread().getName());
                    }
                    Thread.sleep(3000); // 模拟3秒请求
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        long cost = System.currentTimeMillis() - start;
        System.out.println("\n========================================");
        System.out.println("1000个请求耗时: " + cost + "ms");
        System.out.println("理论最优时间: " + (1000 / 200 * 3000) + "ms (200线程)");
        System.out.println("========================================");

        monitor.shutdown();
        threadPoolExecutor.shutdown();
    }
}
```



---



## 异步HTTP为什么会快？

### 🔍 对比：同步 vs 异步

#### 同步阻塞（你现在的代码）

```
// Hutool 的 HttpUtil.createGet()
String result = HttpUtil.createGet(url).execute().body();

// 底层执行过程：
┌─────────────────────────────────────────────┐
│ Thread-1                                    │
├─────────────────────────────────────────────┤
│ 1. 创建连接               ████ 2ms (CPU工作) │
│ 2. 发送HTTP请求           █ 1ms (CPU工作)   │
│ 3. 等待服务器响应         ░░░░░░ 2997ms     │← 线程阻塞，CPU空闲
│                           (线程状态=WAITING)  │
│ 4. 接收响应              █ 1ms (CPU工作)    │
│ 5. 解析数据              ██ 2ms (CPU工作)   │
└─────────────────────────────────────────────┘
总耗时：3003ms
线程占用：3003ms（线程一直被占用，不能处理其他任务）
CPU实际工作：6ms
```

**关键问题：**

- 虽然CPU只工作6ms，但线程被占用了3003ms
- 30个线程 = 同时只能等待30个请求
- 其他970个请求必须排队

------

#### 异步非阻塞（OkHttp / Java HttpClient）

```
// OkHttp 异步请求
CompletableFuture<String> future = asyncHttpGet(url);

// 底层执行过程：
┌─────────────────────────────────────────────┐
│ 主线程（提交任务）                           │
├─────────────────────────────────────────────┤
│ 1. 创建请求对象          █ 0.5ms            │
│ 2. 提交到 OkHttp         █ 0.1ms            │
│ 3. 立即返回 Future       （不等待！）        │← 关键：不阻塞
│ 4. 继续提交下一个任务     ...               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ OkHttp 内部的 IO 线程池（很小，2-5个线程） │
├─────────────────────────────────────────────┤
│ 1. 通过 Selector 监听多个 Socket            │
│ 2. 使用 epoll/kqueue（OS底层）             │
│ 3. 一个线程可以管理成千上万个连接           │
│                                             │
│ Socket1: 等待响应 ░░░                      │
│ Socket2: 等待响应 ░░░                      │← 1个线程管理1000个连接
│ Socket3: 等待响应 ░░░                      │
│ ...                                         │
│ Socket1000: 等待响应 ░░░                   │
└─────────────────────────────────────────────┘
                    ↓ （3秒后，Socket1 数据到达）
┌─────────────────────────────────────────────┐
│ 回调线程池                                   │
├─────────────────────────────────────────────┤
│ 1. Socket1 数据到达                         │
│ 2. 触发回调，执行 onResponse()              │
│ 3. 解析数据                                 │
│ 4. 完成 Future                              │
└─────────────────────────────────────────────┘

总耗时：3000ms（1000个请求几乎同时发出）
线程占用：主线程 50ms，IO线程持续工作，回调线程按需分配
```

------

### 📊 核心区别

| 维度 | 同步阻塞 | 异步非阻塞 |
|------|---------|-----------|
| **线程占用** | 1个请求 = 1个线程阻塞3秒 | 1个IO线程管理1000+请求 |
| **并发能力** | 受限于线程数（30-200） | 几乎无限（受限于网络带宽） |
| **30个线程** | 处理30个请求 | 处理30000+个请求 |
| **1000个请求** | 需要33轮（100秒） | 1轮（3秒） |
| **CPU利用率** | 0.2%（大量空闲） | 5-10%（处理回调） |
| **内存占用** | 30线程×1MB=30MB | 5线程+1000连接≈50MB |

------

XD:
是不是相当于好处是OkHttp一个内部的线程能管理1000个连接, 而我自己新建的线程池一个线程只能处理一个连接, 这样就极大的释放了我自己的线程使用

# 完全正确！你理解透彻了！🎉

------

## 🎯 核心区别总结

### 你的同步代码（Hutool）

```
ThreadPoolExecutor myExecutor = new ThreadPoolExecutor(200, 200, ...);

for (int i = 0; i < 1000; i++) {
    myExecutor.submit(() -> {
        String result = HttpUtil.createGet(url).execute().body();
        // ↑ 1个线程处理1个连接
    });
}

资源占用：
┌─────────────────────────────────────────┐
│ 你的线程池（200个线程）                  │
├─────────────────────────────────────────┤
│ Thread-1   → Socket-1   [WAITING 3秒]  │  1线程 : 1连接
│ Thread-2   → Socket-2   [WAITING 3秒]  │  1线程 : 1连接
│ Thread-3   → Socket-3   [WAITING 3秒]  │  1线程 : 1连接
│ ...                                     │
│ Thread-200 → Socket-200 [WAITING 3秒]  │  1线程 : 1连接
└─────────────────────────────────────────┘
        ↓ 剩余800个任务在队列等待
┌─────────────────────────────────────────┐
│ 队列（800个任务等待）                    │
│ 任务201-1000 排队中...                  │
└─────────────────────────────────────────┘

内存占用：200线程 × 1MB = 200MB
处理能力：200个连接/轮次
总耗时：1000 ÷ 200 × 3秒 = 15秒
```

------

### OkHttp 异步代码

```
OkHttpClient httpClient = new OkHttpClient();

for (int i = 0; i < 1000; i++) {
    asyncHttpGet(url);  // 立即返回，不阻塞
}

资源占用：
┌─────────────────────────────────────────┐
│ 你的线程池（可以很小，甚至不需要）        │
├─────────────────────────────────────────┤
│ 只用于提交任务（0.1ms就完成）            │
│ 提交完1000个任务后，线程就空闲了         │
└─────────────────────────────────────────┘
        ↓ 请求交给 OkHttp
┌─────────────────────────────────────────┐
│ OkHttp IO 线程池（4个线程）              │
├─────────────────────────────────────────┤
│ IO-Thread-1 → 管理 Socket 1-250        │  1线程 : 250连接 ✨
│ IO-Thread-2 → 管理 Socket 251-500      │  1线程 : 250连接 ✨
│ IO-Thread-3 → 管理 Socket 501-750      │  1线程 : 250连接 ✨
│ IO-Thread-4 → 管理 Socket 751-1000     │  1线程 : 250连接 ✨
└─────────────────────────────────────────┘
        ↓ 通过 OS 的 epoll/select 监听
┌─────────────────────────────────────────┐
│ 操作系统层（1000个Socket连接）           │
├─────────────────────────────────────────┤
│ Socket-1:    等待响应 ░░░               │
│ Socket-2:    等待响应 ░░░               │
│ ...                                     │← 1000个连接同时等待
│ Socket-1000: 等待响应 ░░░               │   不占用线程资源！
└─────────────────────────────────────────┘

内存占用：4线程 × 1MB + 1000连接 × ~10KB = 14MB
处理能力：1000个连接/同时
总耗时：≈ 3秒（所有请求几乎同时完成）
```

------

## 📊 资源对比表

| 指标 | 同步阻塞（Hutool） | 异步非阻塞（OkHttp） | 提升倍数 |
|------|-------------------|---------------------|---------|
| **你的线程占用** | 200个线程持续占用 | 几乎不占用（提交后就释放） | **50倍+** |
| **内存占用** | 200MB（线程栈） | 14MB | **14倍** |
| **同时处理连接数** | 200个 | 1000个+ | **5倍** |
| **总耗时（1000请求）** | 15秒 | 3秒 | **5倍** |
| **线程利用率** | 0.2%（大量等待） | 较高 | **显著提升** |

------

## 🔍 为什么1个IO线程能管理1000个连接？

### 底层原理：epoll/select

```
// 传统同步模型（你的Hutool代码）
void thread_function() {
    // 每个线程只能等一个Socket
    int socket = create_socket();
    connect(socket, server);

    // 阻塞等待（线程睡眠）
    read(socket, buffer, size);  // ← 线程在这里卡住3秒

    // 醒来后处理数据
    process(buffer);
}

// 需要1000个线程才能同时等待1000个Socket
```

------

```
// 异步模型（OkHttp 的底层）
void io_thread_function() {
    // 1个线程监听1000个Socket
    int epoll_fd = epoll_create();

    // 把1000个Socket都注册到epoll
    for (int i = 0; i < 1000; i++) {
        int socket = create_socket();
        connect(socket, server);
        epoll_add(epoll_fd, socket);  // 注册到监听列表
    }

    // 循环等待任意Socket有数据
    while (true) {
        // 这一行会阻塞，直到任意Socket有数据到达
        int count = epoll_wait(epoll_fd, events, 1000, timeout);
        //          ↑ 神奇之处：同时监听1000个Socket！

        // 有数据的Socket会被返回
        for (int i = 0; i < count; i++) {
            int ready_socket = events[i].data.fd;

            // 读取数据（不会阻塞，因为数据已经到达）
            read(ready_socket, buffer, size);

            // 触发回调
            callback(buffer);
        }
    }
}

// 只需要1个线程（或少量线程）就能管理1000个Socket
```

------

### 图解对比

#### 同步模型：1线程 : 1连接

```
时间线 →

Thread-1:  [等待Socket-1................] (3秒) → 处理
Thread-2:  [等待Socket-2................] (3秒) → 处理
Thread-3:  [等待Socket-3................] (3秒) → 处理
...
Thread-200: [等待Socket-200..............] (3秒) → 处理

问题：200个线程都在"睡觉"，CPU空闲，但线程资源被占满
```

#### 异步模型：1线程 : N连接

```
时间线 →

IO-Thread-1:
  [注册Socket-1-250到epoll] → [epoll_wait等待任意Socket有数据]
      ↓ Socket-1有数据
  [读Socket-1] → [触发callback-1]
      ↓ Socket-5有数据
  [读Socket-5] → [触发callback-5]
      ↓ Socket-100有数据
  [读Socket-100] → [触发callback-100]
  ... (持续处理所有250个Socket的事件)

优势：1个线程不停地轮询处理，哪个Socket有数据就处理哪个
```

------

## 💡 实际影响

### 你的代码优化前后对比

```
// ❌ 优化前：你的线程池被大量占用
ThreadPoolExecutor myExecutor = new ThreadPoolExecutor(200, 200, ...);

// 提交1000个HTTP任务
for (int i = 0; i < 1000; i++) {
    myExecutor.submit(() -> {
        HttpUtil.createGet(url).execute();  // 阻塞3秒
    });
}

问题：
- 你的200个线程全部被占用（WAITING状态）
- 如果你的应用还有其他业务逻辑需要这个线程池，就卡住了
- 例如：用户点击按钮触发的任务，要等HTTP请求完成才能执行
```

------

```
// ✅ 优化后：你的线程池几乎不占用
ThreadPoolExecutor myExecutor = new ThreadPoolExecutor(50, 200, ...);
OkHttpClient httpClient = new OkHttpClient();

// 提交1000个HTTP任务
for (int i = 0; i < 1000; i++) {
    myExecutor.submit(() -> {
        asyncHttpGet(url).thenAccept(result -> {
            // 处理结果
        });
        // ↑ 这个方法0.1ms就返回了，线程立即释放
    });
}

好处：
- 你的线程池只被占用了0.1ms × 1000 = 100ms
- 100ms后，所有50个线程都空闲了，可以处理其他业务
- HTTP等待交给OkHttp的4个IO线程管理
- 你的线程池资源被"解放"了！✨
```

------

### 实际场景举例

```
// 场景：你的应用同时要做两件事
// 1. 发送1000个HTTP请求（每个3秒）
// 2. 处理用户的实时操作（点击、输入等）

// ❌ 同步模型：用户操作会卡顿
ThreadPoolExecutor executor = new ThreadPoolExecutor(200, 200, ...);

// HTTP任务占满线程池
for (int i = 0; i < 1000; i++) {
    executor.submit(() -> HttpUtil.get(url));  // 200个线程全卡住
}

// 用户点击按钮
executor.submit(() -> {
    handleUserClick();  // ← 要等HTTP任务完成才能执行，用户感觉卡顿
});

// ✅ 异步模型：用户操作流畅
OkHttpClient httpClient = new OkHttpClient();

// HTTP任务不占用线程池
for (int i = 0; i < 1000; i++) {
    asyncHttpGet(url);  // 提交后立即返回
}

// 用户点击按钮
executor.submit(() -> {
    handleUserClick();  // ← 立即执行，不等待HTTP，用户体验流畅
});
```

------

## 🎯 最终总结

你的理解完全正确！核心好处就是：

```
同步阻塞：
你的线程 = Socket连接的"保姆"
1个保姆（线程）只能照顾1个孩子（连接）
孩子睡觉时，保姆也只能干等着（WAITING）
照顾1000个孩子需要1000个保姆

异步非阻塞：
OkHttp的IO线程 = Socket连接的"监控系统"
1个监控系统（IO线程）可以监控1000个孩子（连接）
孩子睡觉时，监控系统去看其他孩子，哪个醒了就处理哪个
监控1000个孩子只需要4个监控系统

结果：
你的保姆（线程）解放了！
可以去干其他活（处理业务逻辑）
监控工作交给专业的OkHttp团队
```

**这就是为什么异步HTTP能极大释放你的线程资源！** 🚀

# XD

回调的那个线程不需要等待吗, 还是请求完请求后回调方法只是一个hook由回调的那个线程处理就好, 而不是由调用线程者等着处理

回调线程不需要等待！

回调 = Hook（钩子）

- 不是主动轮询"数据到了吗？"
- 是被动触发"数据到了，通知你！

同步模型：
┌─────────────────────────────┐
│ 调用线程在等待              │← 你的线程池线程在等
│ (Thread-1 处于WAITING状态)  │
└─────────────────────────────┘

异步模型：
┌─────────────────────────────┐
│ 调用线程：不等，立即返回     │← 你的线程池线程被释放
├─────────────────────────────┤
│ IO线程：在epoll_wait()等     │← OkHttp的IO线程在等
│          但同时监听N个连接   │   但效率高（1个顶1000个）
├─────────────────────────────┤
│ 回调线程：不等，数据来了才干 │← 根本不存在等待
└─────────────────────────────┘







**异步HTTP的"双刃剑"**

同步HTTP（200线程）：
你的服务器 → 每3秒发200个请求 → 对方服务器
逐批次发送              压力分散

异步HTTP：
你的服务器 → 瞬间发1000个请求 → 对方服务器
0.1秒内全部发出        瞬时压力巨大！💥



## sublime

实用场景 sublime 去重

(.+)\n(?=\1$)



```
(?<=<title>).+(?=</title>)
一个前瞻, 一个后瞻


<title>网页标题</title>
       ↑______↑
       匹配区间


<title>网页标题</title>
       ↑      ↑
       │      └── (?=</title>) 当前位置右边必须是 </title>
       │
       └── (?<=<title>) 当前位置左边必须是 <title>

       └──.+──┘  实际匹配的内容
```



# 加签验签

加密解密 & 加签验签 完完全全的两个东西 !!!



## RSA 再学习

┌──────────────┬──────────────────────┬──────────────────────┐
│              │       公钥 (Public)    │     私钥 (Private)    │
├──────────────┼──────────────────────┼──────────────────────┤
│   组成        │     (n, e)           │      (n, d)           │
│   持有者      │     任何人            │      仅密钥所有者      │
│   用途1       │     加密数据          │      解密数据          │
│   用途2       │     验证签名          │      生成签名          │
│   可否公开    │     ✅ 可以           │      ❌ 绝不可以       │
└──────────────┴──────────────────────┴──────────────────────┘

------

只知道加密解密, 不知道加签验签 (ibot 也有sign切面, 不过是对称加密, treeMap排序 sha256)

#### ibotservice

1. 前后端约定一套sha256数字指纹 (请求参数会带String sign)
2. 读配置中心是否需要鉴权 sign
3. 加密request得到string对比前端传过来的 sign 【验签】

- 将请求参数去掉sign后进行 generateSign (1.请求参数放到TreeMap<>(String::compareTo)  2.Joiner.on("&").withKeyValueSeparator("=").join(map);  3.SHA256Util.getSHA256Str)

1. extra - now vs 前端传的时间 (30s 内) [多了时间的校验]

------

┌─────────────────────────────────────────────────────────┐
│                                                          │
│   场景一：加密/解密（保密性）                               │
│   ─────────────────────                                  │
│   目的：确保只有接收方能读取消息                              │
│                                                          │
│   发送方 ──[公钥加密]──→ 密文 ──[私钥解密]──→ 接收方         │
│                                                          │
│                                                          │
│   场景二：签名/验签（身份认证 + 完整性）                      │
│   ─────────────────────────────                          │
│   目的：证明消息确实来自声称的发送方，且未被篡改                │
│                                                          │
│   发送方 ──[私钥签名]──→ 签名 ──[公钥验签]──→ 验证方         │
│                                                          │
└─────────────────────────────────────────────────────────┘

TODO

1. RSA 两个用途详细学习尤其第二实际代码场景
2. 重新梳理C端 /chat  /asr 从刁钻问题问自己 (怎么发消息, 怎么和下游联动 上下行怎么走,  每个上行是全量的吗需要拼接吗)

## asr

user上行 -> onOpen (构建observer给到下游ars service) 【init事件】 -> onMessage 【data】

- 下游返回asr的时候会直到一整句对话给完后 有个 isFinal 标
- 本系统会有个 StringBuffer (线程安全) 拼接每一个完整句子





# idea重要技巧

## 开启自动提示设置



**File → Settings → Editor → Inspections**

搜索 `serialVersionUID` → 勾选：
✅ **"Serializable class without 'serialVersionUID'"**

> 开启后，未添加 serialVersionUID 的类会出现**黄色警告**，再用 `Alt+Enter` 快速修复



```
都是同一个, 除了文件类型

class

/**
* Alipay.com Inc.
* Copyright (c) 2004-${YEAR} All Rights Reserved.
*/
# if(${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end
/**
* @author zzq01949699
* @version \$Id: ${NAME}.java, v 0.1 ${YEAR}-${MONTH}-${DAY} ${TIME} zzq01949699 Exp $$
*/
public class ${NAME} {
}



AntGet

/**
* Getter method for property <tt>$field.name</tt>.
\*
* @return property value of $field.name
*/
# if($field.modifierStatic)
static ##
# end
$field.type ##
# set($name = $StringUtil.capitalizeWithJavaBeanConvention($StringUtil.sanitizeJavaIdentifier($helper.getPropertyName($field, $project))))
# if ($field.boolean && $field.primitive)
    #if ($StringUtil.startsWithIgnoreCase($name, 'is'))
        #set($name = $StringUtil.decapitalize($name))
    #else
    is##
    #end
# else
get##
# end
${name}() {
return $field.name;
}

AntSet

/**
* Setter method for property <tt>$field.name</tt>.
\*
* @param $field.name value to be assigned to property $field.name
*/
# set($paramName = $helper.getParamName($field, $project))
# if($field.modifierStatic)
static ##
# end
void set$StringUtil.capitalizeWithJavaBeanConvention($StringUtil.sanitizeJavaIdentifier($helper.getPropertyName($field, $project)))($field.type $paramName) {
# if ($field.name == $paramName)
    #if (!$field.modifierStatic)
    this.##
    #else
        $classname.##
    #end
# end
$field.name = $paramName;
}

AntToString

/**
  * To string string.
 \*
  * @return the string
 */
public java.lang.String toString() {
# if ( $members.size() > 0 )
# set ( $i = 0 )
    return "$classname{" +
\# foreach( $member in $members )
# if ( $i == 0 )
    "##
# else
    ", ##
# end
# if ( $member.objectArray )
# if ($java_version < 5)
$member.name=" + ($member.accessor == null ? null : java.util.Arrays.asList($member.accessor)) +
\# else
$member.name=" + java.util.Arrays.toString($member.accessor) +
\# end
# elseif ( $member.primitiveArray && $java_version >= 5)
$member.name=" + java.util.Arrays.toString($member.accessor) +
\# elseif ( $member.string )
$member.name='" + $member.accessor + '\'' +
\# else
$member.name=" + $member.accessor +
\# end
# set ( $i = $i + 1 )
# end
    '}';
# else
    return "$classname{}";
# end
}
```

