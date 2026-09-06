# 多 LLM 路由实战

# 多 LLM 路由实战：LlmProviderRegistry 的核心设计

大家好，我是 Guide。在 AI 应用开发中，大模型集成往往被简化成一行代码——`@Autowired ChatClient chatClient`，剩下的交给 `spring.ai.openai.*` 自动装配。听起来很美好，但只要项目走出"Hello World"，问题就来了：

* 老板要求“既能用通义千问，也能用 DeepSeek，本地开发还得用 LM Studio 跑离线模型”
* 出题、评分场景需要纯净的 ChatClient 输出 JSON，但语音面试场景却要 ChatClient 带工具调用 + 流式输出
* API Key 不能明文落库，但又得允许运维在网页上修改 Provider 配置
* 用户要“切换默认模型”——切完不能重启服务

如果你还在 Service 里写 `if (provider.equals("kimi"))` 这种东西，不出三个月，这套代码会变成所有人都不敢碰的雷区。

本文以本项目的多 LLM Provider 管理为例，详细拆解 `LlmProviderRegistry` 的设计与实现。通过本文你将搞懂：

1. 为什么要单独抽一个 `LlmProviderRegistry`，它解决了什么“业务+架构”的双重问题
2. **三类 ChatClient（默认 / Plain / Voice）+ EmbeddingModel** 这种“一机多出口”的设计是怎么落地的
3. 数据库优先 + YAML 兜底的 Provider 配置存储策略，以及它如何兼容老配置
4. API Key 的 AES-GCM 加密落库 + 开发兜底密钥 + 强校验开关的多层安全设计
5. 实时增删改 Provider 后，如何让 ChatClient 缓存秒级生效
6. Embedding 模型防呆、`baseUrl` 中是否含 `/v1` 的兼容处理这些“细节里的魔鬼”

> 这篇文章是[《Spring AI 与大模型集成》](https://www.yuque.com/snailclimb/itdq8h/sitooa06s5qs7qd4)的“放大镜”专题。后者讲的是“为什么要做多 Provider”，本文重点拆解“怎么把它做扎实”。

***

## 痛点：单 Provider 架构在生产环境的 5 个崩溃瞬间

讲设计之前，先聊为什么“一对一直连大模型”这套写法在生产里会爆。

很多读者私信我："Guide，我用 Spring AI 直接 `@Autowired ChatClient` 写了几个月没事啊。"

没事是因为你还没遇到这几个场景：

| 场景 | 单 Provider 架构的崩溃方式 |
| --- | --- |
| 模型供应商接口降级 | 整个产品瘫痪，没有 Plan B |
| 不同业务对 ChatClient 配方需求不同 | 一处改 Advisor，处处改；测试覆盖回归量爆炸 |
| 开发环境想用本地 LM Studio | 改配置 = 改源码 = 重启 = 等 30 秒 |
| 运维想轮换 API Key | 必须发版，且 Key 在 git 里裸奔 |
| 同时要支持 Chat 和 Embedding | 两套配置打架，向量维度对不上时直接报 500 |

> **本质上**，单 Provider 架构把“模型即服务”当成了“模型即配置”。但模型在生产里其实是一个**有状态、可热替换、需要权限管控的资源**——这种东西不能让一个 `application.yml` 简单兜底。

所以本项目把所有 LLM 入口收归到一个 Bean：`LlmProviderRegistry`。它的位置在 `interview.guide.common.ai`，作为**通用基础能力**，被所有业务模块依赖。

## 设计目标：从“能跑”到“扛得住”

抽 Registry 这件事，必须先列清楚要解决什么问题，否则容易抽出一个“看起来在抽象，实际在制造耦合”的怪物。

本项目最终落定 5 个核心目标：

1. **多 Provider 共存**：dashscope / lmstudio / kimi / deepseek / glm 同时在线，按业务路由
2. **同 Provider 多配方**：默认 Client、Plain Client、Voice Client 三类 ChatClient，按场景注入
3. **运行时可写**：增删改 Provider、切换默认 Provider、轮换 API Key 全部通过 REST API，无需重启
4. **配置安全**：API Key 加密落库，明文不入磁盘
5. **降级兜底**：DB 不可用时自动降级到 YAML，老用户/单元测试零迁移成本

这 5 条不是空话，每一条都对应代码里的具体类。先上一张全景图，让你心里有谱：

```plain
                         业务模块（resume / interview / knowledgebase / voice...）
                                              │
                                              ▼
                              ┌────────────────────────────┐
                              │   LlmProviderRegistry       │  ← 唯一入口
                              │  - getDefaultChatClient()   │
                              │  - getChatClient(id)        │
                              │  - getPlainChatClient(id)   │
                              │  - getVoiceChatClient(id)   │
                              │  - getEmbeddingModel(id)    │
                              │  - reload()                 │
                              └────────────┬───────────────┘
                                           │ ConcurrentHashMap 缓存
                                           ▼
                              ┌────────────────────────────┐
                              │ ProviderSnapshot (record)   │
                              └────────────┬───────────────┘
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                ▼                                                     ▼
   LlmProviderRepository (DB)                                LlmProviderProperties (YAML)
   - llm_provider_config 表                                   - app.ai.providers.*
   - api_key_ciphertext + nonce                               - api-key 走 ${ENV} 占位符
                ▲
                │ 加解密
                ▼
       ApiKeyEncryptionService
       - AES/GCM/NoPadding
       - 12 字节 nonce
```

这张图只有一点需要看：**所有指向大模型的箭头都从 **`LlmProviderRegistry`** 出发**。这就是收口。

## 核心抽象：一台 Registry，三种 ChatClient，一个 EmbeddingModel

讲到这里，很多人会想："不就是个 `Map<String, ChatClient>` 嘛？"

直到真正跑到生产环境，才会发现事情没那么简单。本项目实际落地下来，发现同一个 Provider，**业务上要的 ChatClient 配方至少有三种**：

```java
// 1. 默认 ChatClient：聊天/RAG 等"通用对话"场景
public ChatClient getChatClient(String providerId);

// 2. Plain ChatClient：出题、评分等"结构化输出"场景，禁工具调用
public ChatClient getPlainChatClient(String providerId);

// 3. Voice ChatClient：语音面试，SkillsTool + 流式 ToolCall + 不带 Memory
public ChatClient getVoiceChatClient(String providerId);
```

为什么要拆？下面这个对比表能让你一眼看清各自的“配方差异”：

| 客户端类型 | SkillsTool | ToolCallAdvisor | MessageMemory | SafeGuard | 典型场景 |
| --- | :---: | :---: | :---: | :---: | --- |
| 默认 ChatClient | ✅ | ✅（按配置） | ❌（默认关） | ✅ | 知识库 RAG、通用聊天 |
| Plain ChatClient | ❌ | ❌ | ❌ | ✅ | 出题、评分、简历分析（结构化输出） |
| Voice ChatClient | ✅ | ✅（**强制流式**） | ❌（手动管理） | ✅ | 语音面试实时对话 |

为什么 Plain Client 要禁掉 SkillsTool？这是踩过的坑——

> **踩坑记录**：早期我们用统一的 ChatClient 出题，模型时不时会触发工具调用、然后返回带 `tool_call` 字段的混合消息，导致 `BeanOutputConverter` 解析 JSON 直接挂掉。**结构化输出场景下，工具调用就是噪声**——它干扰了“一次返回纯 JSON”这个核心目标。

为什么 Voice Client 要单独搞？因为语音面试的 Memory 是**手动按面试角色管理的**，不能用 Spring AI 默认的 `MessageWindowChatMemory`，否则历史会和别的会话串扰。

来看 Plain Client 的核心代码：

```java
private ChatClient createPlainChatClient(String providerId) {
    OpenAiChatModel chatModel = buildChatModel(providerId);
    ChatClient.Builder builder = ChatClient.builder(chatModel);
    // 只挂 SafeGuard，连 ToolCall / Memory / Logger 都不要
    buildSafeGuardAdvisor().ifPresent(advisor -> builder.defaultAdvisors(advisor));
    log.info("[LlmProviderRegistry] Created plain ChatClient (no tools) for {}", providerId);
    return builder.build();
}
```

而默认 ChatClient 走的是完整 Advisor 链：

```java
private List<Advisor> buildDefaultAdvisors(String providerId) {
    AdvisorConfig config = properties.getAdvisors();
    if (config == null || !config.isEnabled()) {
        return List.of();
    }

    List<Advisor> advisors = new ArrayList<>();

    if (config.isToolCallEnabled() && toolCallingManager != null) {
        advisors.add(buildToolCallAdvisor(
            config.isToolCallConversationHistoryEnabled(),
            config.isStreamToolCallResponses()));
    }
    if (config.isMessageChatMemoryEnabled()) {
        advisors.add(MessageChatMemoryAdvisor.builder(
            MessageWindowChatMemory.builder()
                .maxMessages(Math.max(20, config.getMessageChatMemoryMaxMessages()))
                .build()
        ).build());
    }
    if (config.isSimpleLoggerEnabled()) {
        advisors.add(new SimpleLoggerAdvisor());
    }
    buildSafeGuardAdvisor().ifPresent(advisors::add);
    return advisors;
}
```

> **核心考量**：Advisor 链的开关全部走 `LlmProviderProperties.AdvisorConfig`，可以通过环境变量灵活调。比如压测时关掉 `simple-logger-enabled`，可以直接节省 30% 的 IO 开销。

### 缓存：同一个 ID + 配方 = 同一份实例

`ChatClient` 不是廉价对象——它内部带 `ChatModel`、`OpenAiApi`、`RestClient`、`ToolCallingManager` 一长串依赖。每次调用 `chatClient.prompt()` 都重新构造，会让 GC 压力急剧上升。

所以 Registry 用 `ConcurrentHashMap` 做缓存，**Key 设计**很关键：

```java
private final Map<String, ChatClient> clientCache = new ConcurrentHashMap<>();

public ChatClient getChatClient(String providerId) {
    return clientCache.computeIfAbsent(providerId, id -> createChatClient(id));
}

public ChatClient getPlainChatClient(String providerId) {
    String id = resolveProviderId(providerId);
    return clientCache.computeIfAbsent(id + ":plain", key -> createPlainChatClient(id));
}

public ChatClient getVoiceChatClient(String providerId) {
    String id = resolveProviderId(providerId);
    return clientCache.computeIfAbsent(id + ":voice", key -> createVoiceChatClient(id));
}
```

注意三个 Key：`dashscope`、`dashscope:plain`、`dashscope:voice` 共用同一个 `ChatModel` 但是不同的 Builder 配方。这种设计的**底层机制**是：底层 HTTP 连接池可以复用，但上层 Advisor 链是隔离的——既省资源又干净。

## DB 优先 + YAML 兜底：为什么这套双写策略能两头讨好

这一节是整个 Registry 设计里最“反教科书”的一段。

主流的 Spring AI 教程要么“配置全在 YAML 里”，要么“全在数据库里”。两边各有死忠，但都有问题：

| 策略 | 优点 | 痛点 |
| --- | --- | --- |
| 纯 YAML | 简单、可 grep、能 git 追踪 | 改完要重启；API Key 进 git；无法多用户协作 |
| 纯 DB | 运行时可改、有审计、API Key 可加密 | 单元测试要起 DB；老配置迁移痛苦；DB 挂了应用废 |

本项目最终选了**第三条路**：**DB 优先 + YAML 兜底 + 启动时双向同步**。

来看 `LlmProviderRegistry.loadProviderOrThrow()` 的关键逻辑：

```java
private ProviderSnapshot loadProviderOrThrow(String providerId) {
    if (providerRepository == null) {
        // DB 不可用时（比如单元测试），降级走 YAML
        return loadProviderFromPropertiesOrThrow(providerId);
    }
    LlmProviderEntity entity = providerRepository.findById(providerId)
        .filter(LlmProviderEntity::isEnabled)
        .orElseThrow(() -> new IllegalArgumentException("Unknown LLM provider: " + providerId));
    return new ProviderSnapshot(
        entity.getId(),
        entity.getBaseUrl(),
        encryptionService.decrypt(entity.getApiKeyNonce(), entity.getApiKeyCiphertext()),
        entity.getModel(),
        entity.getEmbeddingModel(),
        entity.getEmbeddingDimensions(),
        entity.isSupportsEmbedding(),
        entity.getTemperature()
    );
}
```

注意几个**高频盲区**：

1. `providerRepository == null`\*\* 不是 bug\*\*：构造函数允许它为 null（典型场景：单元测试不挂 JPA），代码自然降级到 YAML
2. `ProviderSnapshot`\*\* 是 record\*\*：从 Entity 或 Properties 抽出来的一份不可变快照，避免后续修改 Entity 时影响已构造的 ChatClient
3. `isEnabled()`\*\* 过滤掉禁用的 Provider\*\*：可以在前端做“软停用”，不必删除

而启动时的“DB 自动播种”逻辑放在 `LlmProviderBootstrapService`：

```java
@PostConstruct
@Transactional
public void seedProvidersIfNecessary() {
    if (providerRepository.count() == 0) {
        seedProviders();           // 把 application.yml 里的 providers 写进 DB
    }
    ensureGlobalSetting();         // 兜底默认 Chat/Embedding Provider
}
```

> **避坑提示**：`if (count() == 0)` 这个判断很关键——只在第一次启动时迁移，避免每次启动覆盖运维在网页上改的配置。如果你想强制重新同步，得删掉 `llm_provider_config` 表全部数据。

更狠的是默认 Provider 的解析。它要支持三种来源（按优先级从高到低）：

1. 数据库 `llm_global_setting` 表（用户在网页上改的）
2. `application.yml` 的 `app.ai.default-provider`
3. 内置硬编码的 `dashscope`

代码长这样：

```java
private String resolveDefaultEmbeddingProviderId() {
    if (globalSettingRepository == null) {
        return !isBlank(properties.getDefaultEmbeddingProvider())
            ? properties.getDefaultEmbeddingProvider()
            : properties.getDefaultProvider();   // Embedding 兜底用 Chat 的默认值
    }
    return globalSettingRepository.findById(LlmGlobalSettingEntity.SINGLETON_ID)
        .map(LlmGlobalSettingEntity::getDefaultEmbeddingProviderId)
        .filter(id -> !isBlank(id))
        .orElseGet(() -> !isBlank(properties.getDefaultEmbeddingProvider())
            ? properties.getDefaultEmbeddingProvider()
            : properties.getDefaultProvider());
}
```

为什么 Embedding 要单独管？因为**不是每个 Provider 都支持 Embedding**——比如 LM Studio 默认只是 Chat 模型，Kimi 也没开放 Embedding 接口。如果不区分 Chat 和 Embedding 的默认 Provider，知识库向量化会直接 500。

***

## API Key 加密：AES-GCM + 12 字节 Nonce 的安全套路

API Key 是产品里“最值钱也最容易裸奔”的字段。本项目采用 **AES/GCM/NoPadding** 加密落库，关键代码在 `ApiKeyEncryptionService`：

```java
private static final int NONCE_BYTES = 12;
private static final int GCM_TAG_BITS = 128;
private static final String CIPHER = "AES/GCM/NoPadding";

public EncryptedValue encrypt(String plainText) {
    try {
        byte[] nonce = new byte[NONCE_BYTES];
        secureRandom.nextBytes(nonce);

        Cipher cipher = Cipher.getInstance(CIPHER);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_BITS, nonce));
        byte[] ciphertext = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

        return new EncryptedValue(
            Base64.getEncoder().encodeToString(nonce),
            Base64.getEncoder().encodeToString(ciphertext)
        );
    } catch (Exception e) {
        throw new BusinessException(ErrorCode.PROVIDER_CONFIG_WRITE_FAILED,
            "加密 Provider API Key 失败", e);
    }
}
```

几个**生产级落地细节**，你不一定都见过：

### 每次加密都生成新 Nonce

很多教程里会写“用一个固定 IV 加密所有 Key”——这是 AES-GCM 最经典的反例。GCM 模式下 Nonce 重用会**直接泄露明文**。本项目每次加密都用 `SecureRandom` 生成 12 字节随机 Nonce，把它和密文一起 Base64 编码后分别存到 `api_key_nonce` 和 `api_key_ciphertext` 列。

### 密钥派生做了“两手准备”

`APP_AI_CONFIG_ENCRYPTION_KEY` 这个环境变量的值可以是两种格式：

```java
private byte[] resolveKeyBytes(String configuredKey) {
    String trimmed = configuredKey.trim();
    try {
        byte[] decoded = Base64.getDecoder().decode(trimmed);
        if (decoded.length == 32) {
            return decoded;   // 你直接传了 32 字节 Base64 编码的 AES-256 密钥
        }
    } catch (IllegalArgumentException ignored) {
        // 不是合法 Base64？降级走 SHA-256 派生
    }
    return sha256(trimmed);   // 你传了"interview-guide-prod-2025"这种人类可读字符串
}
```

这个设计的**核心考量**是：**让运维不用关心加密学**。他可以在 `.env` 里写一个有意义的句子（比如 `"interview-guide-prod-2025"`），系统自动 SHA-256 派生成 32 字节密钥。生产严格场景再用 `openssl rand -base64 32` 生成专业密钥。

### 开发兜底密钥 + 生产强校验开关

```java
@PostConstruct
void init() {
    LlmProviderProperties.SecurityConfig security = properties.getSecurity();
    String configuredKey = security != null ? security.getApiKeyEncryptionKey() : null;
    if (configuredKey == null || configuredKey.isBlank()) {
        if (security != null && security.isRequireEncryptionKey()) {
            // 生产环境：未配置直接启动失败
            throw new BusinessException(ErrorCode.PROVIDER_CONFIG_READ_FAILED,
                "APP_AI_CONFIG_ENCRYPTION_KEY 未配置，无法解密 Provider API Key");
        }
        log.warn("APP_AI_CONFIG_ENCRYPTION_KEY is not configured; using development fallback key");
        configuredKey = DEV_FALLBACK_KEY;
    }
    secretKey = new SecretKeySpec(resolveKeyBytes(configuredKey), "AES");
}
```

开发环境忘了配密钥？没关系，自动用兜底字符串，应用照常启动。生产环境只要在 `application.yml` 里把 `require-encryption-key: true` 打开，没配真实密钥直接启动失败——`BusinessException` 在 `@PostConstruct` 里抛出，Spring 容器会拒绝启动。

> **避坑提示**：如果你换了密钥还想读老数据，必须先用旧密钥解密、再用新密钥重新加密——AES-GCM 不像 RSA 有“密钥轮换”的便宜活儿。生产换密钥前一定要写迁移脚本。

## 运行时热更新：reload() 背后的 30 行代码

运行时改 Provider 是这套架构的核心能力。更新数据库后，不要在事务方法内直接调用 reload()；这里通过事务事件把缓存刷新延后到提交成功之后：

```java
@Transactional
public void updateProvider(String id, UpdateProviderRequest request) {
    rwLock.writeLock().lock();
    try {
        LlmProviderEntity provider = getProviderEntityOrThrow(id);

        if (trimmedBaseUrl != null) provider.setBaseUrl(trimmedBaseUrl);
        if (trimmedModel != null) provider.setModel(trimmedModel);
        // ... 其他字段更新

        if (trimmedApiKey != null) {
            ApiKeyEncryptionService.EncryptedValue encrypted = encryptionService.encrypt(trimmedApiKey);
            provider.setApiKeyNonce(encrypted.nonce());
            provider.setApiKeyCiphertext(encrypted.ciphertext());
        }

        providerRepository.save(provider);
        eventPublisher.publishEvent(new ProviderChangedEvent(id));
        log.info("Updated provider: id={}", id);
    } finally {
        rwLock.writeLock().unlock();
    }
}

@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void handleProviderChanged(ProviderChangedEvent event) {
    registry.reload();
}
```

这里的关键是 AFTER\_COMMIT：事务提交成功后再清缓存，避免并发请求在提交前从数据库读到旧配置并回填缓存。如果对短暂旧读也敏感，可以再给 Provider 配置加版本号，在重建缓存时校验版本。registry.reload() 的实现本身很朴素：

```java
public void reload() {
    int size = clientCache.size() + embeddingModelCache.size();
    clientCache.clear();
    embeddingModelCache.clear();
    log.info("[LlmProviderRegistry] Cache cleared ({} entries). Next access will re-create clients.", size);
}
```

简单粗暴——**直接清空所有缓存**，下一次业务调用 `getChatClient()` 时再 `computeIfAbsent` 重建。

你可能会问：“不是更精细一点，只清这一个 ID 的缓存吗？”

**踩坑了才知道**：默认 Provider 切换、Advisor 配置变更、Embedding 默认 Provider 变更……这些场景影响面是全局的，精细化清理反而容易漏。整个 Registry 缓存撑死也就十几个对象，重建成本几乎可以忽略——简单粗暴反而是最稳的。

> **底层机制**：`ConcurrentHashMap.clear()` 不会让正在使用旧 ChatClient 的线程崩溃——已经获取到的引用还在，只是新请求会拿到新实例。这种“软切换”语义对热更新非常友好。

### 读写锁防并发抖动

`LlmProviderConfigService` 用了 `ReentrantReadWriteLock`：所有读操作（list / get / test）走读锁，所有写操作（create / update / delete）走写锁。

为什么？想象一个场景：运维在网页上点了“删除 Provider X”，同时有用户在调用 X 出题。如果不加锁：

```plain
线程 A：providerRepository.deleteById("X")
线程 B：registry.getChatClient("X") → DB 找不到 → 抛异常
```

加了读写锁之后，B 线程要么读到删除前的状态（拿到 ChatClient 正常用），要么等 A 写完后走 reload 重建——不会有“半删除”的中间态。

## Embedding 防呆：把 chat 模型当 embedding 用是怎么挂的

这一节是 LLM 集成里最容易踩的坑，单独拎出来讲。

不少新手会把 `qwen3.5-flash` 当 embedding 模型用：

```yaml
providers:
  dashscope:
    model: qwen3.5-flash
    embedding-model: qwen3.5-flash    # ← 错的！这是 chat 模型
```

会发生什么？调用 `EmbeddingModel.embed("hello")` 时，OpenAI 兼容接口会返回 chat 格式的响应——而 Spring AI 期待的是 `{"data": [{"embedding": [0.1, 0.2, ...]}]}` 这种向量数组格式。结果就是：**反序列化失败 → NullPointerException → 知识库向量化全部 FAILED**。

本项目在两个地方做了**防呆校验**——

### 创建/更新时校验

`LlmProviderConfigService.validateEmbeddingConfig()`：

```java
private void validateEmbeddingConfig(String providerId, boolean supportsEmbedding,
                                      String embeddingModel, Integer embeddingDimensions) {
    if (!supportsEmbedding) return;
    if (embeddingModel == null) {
        throw new BusinessException(ErrorCode.BAD_REQUEST,
            "支持 Embedding 的 Provider 必须填写 embeddingModel");
    }
    if (looksLikeChatModel(embeddingModel)) {
        String recommendation = RECOMMENDED_EMBEDDING_MODELS.get(providerId.toLowerCase());
        String suffix = recommendation != null
            ? "，推荐填写 " + recommendation
            : "，请填写该厂商真实的 Embedding 模型名";
        throw new BusinessException(ErrorCode.BAD_REQUEST,
            "Embedding Model 不能填写聊天模型 '" + embeddingModel + "'" + suffix);
    }
    if (embeddingDimensions == null || embeddingDimensions <= 0) {
        throw new BusinessException(ErrorCode.BAD_REQUEST, "向量维度必须为正整数");
    }
}

private boolean looksLikeChatModel(String model) {
    String lower = model.toLowerCase();
    return lower.startsWith("glm-")
        || lower.startsWith("deepseek")
        || lower.startsWith("kimi")
        || lower.startsWith("moonshot")
        || lower.startsWith("qwen")
        || lower.startsWith("ernie");
}
```

`looksLikeChatModel()` 是一份“已知 chat 模型前缀”的负面清单。当用户填了 `qwen3.5-flash` 这种模型时，校验会失败，并附上"推荐你用 `text-embedding-v3`"的友好提示。

### 创建 EmbeddingModel 时再校验一次

`LlmProviderRegistry.createEmbeddingModel()`：

```java
private EmbeddingModel createEmbeddingModel(String providerId) {
    ProviderSnapshot config = loadProviderOrThrow(providerId);
    if (!config.supportsEmbedding() || isBlank(config.embeddingModel())) {
        throw new BusinessException(ErrorCode.PROVIDER_CONFIG_READ_FAILED,
            "Provider '" + providerId + "' 未配置可用的 Embedding 模型，无法执行知识库向量化");
    }
    if (looksLikeChatModel(config.embeddingModel())) {
        // ... 同上
    }
    // ... 真正构造 OpenAiEmbeddingModel
}
```

> **核心理念**：**校验要早**，宁可在 API 层抛 400，也不要让错误配置落库后在向量化任务里悄悄爆炸——后者排查起来要死要活。

### 推荐 Embedding 模型映射表

`RECOMMENDED_EMBEDDING_MODELS` 记录了主流厂商的“官方推荐”：

```java
private static final Map<String, String> RECOMMENDED_EMBEDDING_MODELS = Map.of(
    "dashscope", "text-embedding-v3",
    "glm", "embedding-3",
    "zhipu", "embedding-3",
    "baidu", "Embedding-V1",
    "minimax", "embo-01"
);
```

这样的映射不仅用于校验提示，还能在前端表单里做“自动填充建议”。这个小细节能挡掉大部分的错配。

## ApiPathResolver：一个被低估的“baseUrl 兼容层”

OpenAI 兼容接口里，`baseUrl` 到底要不要带 `/v1`？

* DashScope：`https://dashscope.aliyuncs.com/compatible-mode/v1` ← 带 /v1
* DeepSeek：`https://api.deepseek.com` ← 不带 /v1
* Kimi：`https://api.moonshot.cn/v1` ← 带 /v1
* 智谱 GLM：`https://open.bigmodel.cn/api/coding/paas/v4` ← 带 /v4

**完全没有规律**。如果你直接把 baseUrl 拼到 Spring AI 的 `OpenAiApi`，Spring AI 默认会自动补 `/v1/chat/completions`——结果就是 DashScope 的 URL 变成 `https://.../compatible-mode/v1/v1/chat/completions`，404 让你查半天。

本项目把这个判断单独抽成 `ApiPathResolver`：

```java
private static final Pattern TRAILING_VERSION = Pattern.compile("/v\\d+[a-zA-Z0-9]*$");

public static OpenAiApi buildOpenAiApi(String baseUrl, String apiKey,
    int connectTimeout, int readTimeout) {
    // ... 构造 RestClient.Builder

    OpenAiApi.Builder apiBuilder = OpenAiApi.builder()
        .baseUrl(baseUrl)
        .apiKey(apiKey)
        .restClientBuilder(restClientBuilder);

    if (baseUrlContainsVersion(baseUrl)) {
        // baseUrl 已经带 /v1 或 /v4，把 Spring AI 默认的路径前缀去掉
        apiBuilder.completionsPath("/chat/completions").embeddingsPath("/embeddings");
    }
    return apiBuilder.build();
}

public static boolean baseUrlContainsVersion(String baseUrl) {
    if (baseUrl == null || baseUrl.isBlank()) return false;
    String stripped = stripTrailingSlashes(baseUrl.trim());
    return TRAILING_VERSION.matcher(stripped).find();
}
```

正则 `/v\d+[a-zA-Z0-9]*$` 匹配 `/v1`、`/v2`、`/v4`、`/v1beta` 等所有“语义版本”路径段。这种小工具看起来不起眼，但它直接决定了你的 Provider 列表能扩到多大。

## YAML 文本编辑器：保留注释的“原地写回”

本项目还有一个被很多人忽略的细节——**支持运行时改 YAML，但保留注释和格式**。

为什么要保留？因为 `application.yml` 里有大量注释解释每个 Provider 怎么用，运维改完之后注释如果丢了，下个人接手会一脸懵。

主流的 SnakeYAML 库直接 `dump()` 会把所有注释清空。所以本项目自己写了个 **基于文本行的 YAML 编辑器** `YamlTextEditor`，关键能力：

```java
class YamlTextEditor {
    void setScalar(String[] path, String value);                     // 设置标量值
    void setBlock(String[] parentPath, String blockKey,
                  LinkedHashMap<String, Object> values);             // 写入嵌套块
    void removeSection(String[] parentPath, String sectionKey);      // 删除整个 section
}
```

它的核心思想是：**把 YAML 当文本处理，按缩进定位 key**。不解析整个语法树，而是按“缩进级别 + key 名”做行级查找替换。这样改一个字段，注释和格式完全不动。

```java
private int findKey(String key, int indent, int searchFrom) {
    String prefix = " ".repeat(indent) + key + ":";
    for (int i = searchFrom; i < lines.size(); i++) {
        String line = lines.get(i);
        if (line.isBlank() || line.trim().startsWith("#")) continue;
        if (line.startsWith(prefix)) return i;
        if (indentOf(line) < indent) break;
    }
    return -1;
}
```

> **设计权衡**：这种文本级编辑器对“非常规 YAML 写法”（比如锚点 `&`、引用 `*`、多行字符串 `|`）兼容性差。但本项目的 YAML 配置都是标准的“key: value + 子块缩进”结构，这种简化反而带来了零依赖、零侵入的好处。

API Key 不直接写到 YAML，而是用 `${PROVIDER_DASHSCOPE_API_KEY}` 占位符指向 `.env` 文件。新增 Provider 时同步写 YAML 和 `.env`：

```java
private void writeProviderToYaml(String id, ProviderConfig config, String envKey) {
    mutateYamlText(ErrorCode.PROVIDER_CONFIG_WRITE_FAILED, "写入 YAML 配置失败", editor -> {
        LinkedHashMap<String, Object> values = new LinkedHashMap<>();
        values.put("base-url", config.getBaseUrl());
        values.put("api-key", "${" + envKey + "}");        // ← 占位符
        values.put("model", config.getModel());
        // ...
        editor.setBlock(new String[]{"app", "ai", "providers"}, id, values);
    });
}
```

> **避坑提示**：`config-yaml-path` 默认指向 `${user.home}/.interview-guide/llm-providers.yml`，\*\*绝不是源码里的 \*\*`application.yml`。这是为了避免运行时写操作污染 git 仓库。Spring Boot 通过 `spring.config.import` 机制把这个外部 YAML 合并进来。

## 总结

文章很长，最后浓缩成一张速查清单：

| 设计点 | 关键决策 | 业务价值 |
| --- | --- | --- |
| 三类 ChatClient | 默认 / Plain / Voice 各自配方独立 | 结构化输出零干扰；语音流式不串扰 |
| Provider 配置存储 | DB 优先 + YAML 兜底 + 启动自动迁移 | 老用户零成本升级；单元测试无需 DB |
| API Key 加密 | AES/GCM/NoPadding + 12B Nonce + 开发兜底密钥 | 明文不进 DB / 不进日志 / 不进前端 |
| 缓存策略 | ConcurrentHashMap，Key = `id` 或 `id:plain/voice` | 复用底层连接池；Advisor 链隔离 |
| 热更新 | 直接 `clear()` 缓存，下次访问重建 | 配置秒级生效，无需重启 |
| Embedding 防呆 | 创建/更新/构造时三次校验 + 推荐模型映射 | 错配在 API 层抛 400，不让向量任务爆炸 |
| baseUrl 兼容 | 正则匹配 `/v\d+`，自动调整 completionsPath | 兼容所有主流 OpenAI 兼容厂商 |
| YAML 写回 | 文本级编辑器，保留注释和格式 | 运维改配置不破坏注释，下一个人能看懂 |
| REST API 防护 | mask API Key + 限流 + 默认 Provider 不可删 | 纵深防御，避免误操作 |

**项目核心文件**：

* `app/src/main/java/interview/guide/common/ai/LlmProviderRegistry.java`：核心 Registry
* `app/src/main/java/interview/guide/common/ai/ApiPathResolver.java`：baseUrl 兼容层
* `app/src/main/java/interview/guide/common/config/LlmProviderProperties.java`：配置 Bean
* `app/src/main/java/interview/guide/modules/llmprovider/`：DB 实体、加密服务、REST 控制器、配置写回服务


> 更新: 2026-07-24 15:38:23  
> 原文: <https://www.yuque.com/snailclimb/itdq8h/ngplyskqqtk2f0e9>