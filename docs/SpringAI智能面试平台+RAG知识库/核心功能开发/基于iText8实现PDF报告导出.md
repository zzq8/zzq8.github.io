# 基于 iText 8 实现 PDF 报告导出

# 基于 iText 8 实现 PDF 报告导出

大家好，我是 Guide。

> **系列定位**：本文讲 PDF 报告导出的工程实现——中文字体嵌入、特殊字符过滤、结构化数据渲染、文件下载接口。简历分析的 Prompt 设计见[《手把手教你写出生产级结构化 Prompt》](https://www.yuque.com/snailclimb/itdq8h/znhrmtie49dba7x7)，模拟面试的会话管理见[《模拟面试功能》](https://www.yuque.com/snailclimb/itdq8h/ges6m5r4a0aeh4r0)，Spring AI 的集成细节见[《Spring AI 与大模型集成》](https://www.yuque.com/snailclimb/itdq8h/sitooa06s5qs7qd4)。本文不重复这些前置内容。

## 从一个用户操作说起

用户完成模拟面试后，点击页面上的“下载报告”按钮。几秒后浏览器弹出 PDF 文件——封面是面试基本信息，中间是带颜色标识的综合评分和逐题问答详情，末尾是改进建议。另一个场景类似：用户上传简历后，也可以下载一份包含各维度评分、优势亮点和优化建议的 PDF 分析报告。

整个过程看起来简单——“导出 PDF 嘛”。Demo 阶段确实如此，20 行代码就能生成一个文件。但当你把导出的 PDF 发给一个 Windows 用户，对方打开后看到一片方块和乱码；或者某条 AI 返回的建议里带了一个 emoji，整个 PDF 渲染直接报错——**PDF 导出的核心挑战不在“生成”，而在“跨平台稳定渲染”**。

本文解决四个问题：

| 问题 | 挑战 | 方案关键词 |
| --- | --- | --- |
| 中文乱码 | 操作系统字体差异导致渲染失败 | 内嵌字体 + Unicode 编码 |
| 特殊字符崩溃 | Emoji 等字符不在字体覆盖范围内 | 正则过滤 |
| 结构化数据渲染 | AI 返回的 JSON 要变成带样式的 PDF | iText Document 模型 |
| 文件下载兼容性 | 中文文件名在不同浏览器下乱码 | RFC 5987 编码 |

## 最小可运行示例

在解决任何问题之前，先用 iText 8 写一个能生成 PDF 的最简代码：

```java
PdfWriter writer = new PdfWriter("output.pdf");
PdfDocument pdf = new PdfDocument(writer);
Document doc = new Document(pdf);

doc.add(new Paragraph("Hello, PDF!"));

doc.close();
```

5 行代码就能生成一个 PDF 文件，iText 的 API 上手成本很低。但这个版本只支持英文——往里面塞一行中文 `new Paragraph("你好")`，生成的 PDF 里中文会变成空白方块，因为 iText 默认的 Helvetica 字体不包含中文字形。

接下来的所有内容，都是在解决这个最简版本的问题：从“能生成英文 PDF”到“能稳定生成跨平台中文 PDF”。

## 技术选型：为什么是 iText 8

Java 生态里主流的 PDF 库有三个：

| 对比项 | iText 8 | OpenPDF | Apache PDFBox |
| --- | --- | --- | --- |
| 许可证 | AGPL（商用需付费） | LGPL（免费商用） | Apache 2.0（免费商用） |
| 文档布局能力 | 强（表格、多列、样式） | 基础 | 底层控制 |
| 中文支持 | 优秀（font-asian 模块） | 良好 | 一般 |

选 iText 8 主要基于两点考虑。**布局能力强**——面试报告包含多级表格（评分维度表、问答详情表）、带颜色的段落（评分着色）、嵌套列表（改进建议），这些用 OpenPDF 的基础 API 写起来非常痛苦，PDFBox 更是连布局层都没有。**中文支持完善**——`font-asian` 模块配合内嵌字体方案，基本做到“写一次，所有平台都能看”。

**代价**：iText 8 社区版采用 AGPL 许可证——开源项目可以直接用，闭源商业项目需要评估是否符合 AGPL 条款或购买商业许可。如果项目对许可证有严格限制，OpenPDF（LGPL）是可接受的替代方案，只是布局代码会写得更辛苦。

依赖配置：

```groovy
// build.gradle
implementation "com.itextpdf:itext-core:8.0.5"
implementation "com.itextpdf:font-asian:8.0.5"
```

`itext-core` 是核心库，`font-asian` 提供中日韩文字的编码和布局支持。两个依赖缺一不可——即使你用自定义 TTF 字体，CJK 文字的换行、间距等排版规则仍然依赖 `font-asian`。

## 中文字体：从乱码到内嵌方案

### 朴素方案：依赖系统字体

iText 允许你用操作系统已安装的字体来渲染 PDF：

```java
// 朴素方案：使用系统字体
PdfFont font = PdfFontFactory.createFont(
    "STSong-Light",       // 字体名，依赖系统安装
    "UniGB-UCS2-H",
    false                 // 不嵌入字体
);
```

这个方案在开发者的 Mac 上通常没问题——macOS 自带丰富的中文字体。但部署到 Linux 服务器或把 PDF 发给 Windows 用户后，字体名找不到，渲染结果就是乱码或空白。根本原因：PDF 文件里只存了字体名引用（"STSong-Light"），没有嵌入字体数据。读者打开 PDF 时，系统会尝试找这个字体——Mac 上有就能正常显示，Windows 上没有就渲染失败。

### 翻车：Windows 上的真实乱码

项目的第一版 PDF 导出就踩了这个坑。一位 Windows 用户下载简历分析报告后，打开看到的不是中文，而是一堆问号和方块。Gitee 上的 issue 记录：<https://gitee.com/SnailClimb/interview-guide/issues/IDIJU9>。

这个 bug 暴露了一个容易忽略的事实：**开发环境和用户环境的字体差异是 PDF 乱码的最常见原因**。如果你只在 Mac 上测试过导出功能，大概率不知道 Windows 用户看到的是什么。

### 最终方案：内嵌字体

解决思路很直接——把字体文件打包进 JAR，生成 PDF 时强制嵌入字体数据。这样 PDF 文件自带字形信息，不依赖操作系统上安装了什么字体。

下面这段代码是 `PdfExportService` 中字体加载的核心方法：

```java
private PdfFont createChineseFont() {
    try {
        // 从 classpath 加载字体文件（打包在 JAR 内）
        var fontStream = getClass().getClassLoader()
            .getResourceAsStream("fonts/ZhuqueFangsong-Regular.ttf");
        if (fontStream != null) {
            byte[] fontBytes = fontStream.readAllBytes();
            fontStream.close();
            return PdfFontFactory.createFont(
                fontBytes,                       // 字体二进制数据
                PdfEncodings.IDENTITY_H,         // Unicode 编码
                EmbeddingStrategy.FORCE_EMBEDDED // 强制嵌入 PDF
            );
        }
        throw new BusinessException(ErrorCode.EXPORT_PDF_FAILED, "字体文件缺失");
    } catch (BusinessException e) {
        throw e;
    } catch (Exception e) {
        throw new BusinessException(ErrorCode.EXPORT_PDF_FAILED, "创建字体失败");
    }
}
```

这段代码做了一件事：把 TTF 字体文件读成 byte 数组，通过 `PdfFontFactory` 创建内嵌字体。三个关键参数各自承担一个职责：

* `fontBytes`：字体的原始二进制数据，从 `resources/fonts/` 目录加载，打包后随 JAR 一起分发
* `PdfEncodings.IDENTITY_H`：Unicode 横向写入编码，支持所有 CJK 字符
* `EmbeddingStrategy.FORCE_EMBEDDED`：强制把字体数据写进 PDF 文件，打开 PDF 时不需要操作系统提供字体

`catch (BusinessException e) { throw e; }` 这一行是项目统一异常处理的要求——保留业务异常原样抛出，只把非业务异常包装为 `BusinessException`。

### 字体选择：朱雀仿宋

本项目使用[朱雀仿宋](https://github.com/TrionesType/zhuque)（Zhuque Fangsong），这是[璇玑造字](http://trionestype.com/)的开源仿宋字体项目，许可证为 SIL Open Font License 1.1，可免费商用。

选这个字体有两个原因：一是它是正文仿宋字体，排版清晰，适合报告类文档；二是它覆盖常用中文字符集，体积可控。字体文件放在 `app/src/main/resources/fonts/` 目录，打包后随 JAR 一起分发，不需要用户额外安装任何东西。

## 结构化渲染：把 JSON 变成 PDF

### 两份报告，一个服务

`PdfExportService` 位于 `interview.guide.infrastructure.export` 包，提供两个公开方法：

| 方法 | 输入 | 输出报告 |
| --- | --- | --- |
| `exportResumeAnalysis(ResumeEntity, ResumeAnalysisResponse)` | 简历实体 + AI 分析结果 | 简历分析报告 |
| `exportInterviewReport(InterviewSessionEntity)` | 面试会话实体 | 面试评估报告 |

两份报告的结构类似：标题 → 基本信息 → 综合评分 → 详情 → 建议。下面以面试报告为例讲解渲染逻辑，简历报告的套路完全对称。

### 渲染流程

下面这段代码是面试报告生成的核心逻辑（省略了部分细节，保留了关键步骤）：

```java
public byte[] exportInterviewReport(InterviewSessionEntity session) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfWriter writer = new PdfWriter(baos);
    PdfDocument pdfDoc = new PdfDocument(writer);
    Document document = new Document(pdfDoc);

    // 设置全局中文字体——后续所有段落都使用这个字体
    document.setFont(createChineseFont());

    // 1. 标题
    document.add(new Paragraph("模拟面试报告")
        .setFontSize(24).setBold()
        .setTextAlignment(TextAlignment.CENTER)
        .setFontColor(HEADER_COLOR));

    // 2. 基本信息
    document.add(createSectionTitle("面试信息"));
    document.add(new Paragraph("会话ID: " + session.getSessionId()));
    document.add(new Paragraph("题目数量: " + session.getTotalQuestions()));

    // 3. 综合评分（颜色随分数变化）
    if (session.getOverallScore() != null) {
        document.add(new Paragraph(
            "总分: " + session.getOverallScore() + " / 100")
            .setFontSize(18).setBold()
            .setFontColor(getScoreColor(session.getOverallScore())));
    }

    // 4. 优势与改进建议（从 JSON 解析）
    // 5. 逐题问答详情

    document.close();
    return baos.toByteArray();
}
```

这段代码用到的 iText 概念只有三个：`Document`（文档容器）、`Paragraph`（段落）、`DeviceRgb`（颜色）。`document.setFont()` 在文档级别设置了默认字体，后面所有添加的段落都会使用这个中文字体，不需要逐个指定。

注意输出方式：`ByteArrayOutputStream` 把 PDF 内容写入内存中的 byte 数组，最终通过 HTTP 接口直接返回给前端。不落盘，不产生临时文件。

### 评分颜色：用颜色传递信息

分数用颜色区分等级——绿色代表优秀（≥80），黄色代表合格（≥60），红色代表需改进（<60）。这不是装饰，是信息设计：用户打开 PDF 后第一眼就能从颜色判断大致水平，不用逐个看数字。

```java
private DeviceRgb getScoreColor(int score) {
    if (score >= 80) return new DeviceRgb(39, 174, 96);   // 绿色 - 优秀
    if (score >= 60) return new DeviceRgb(241, 196, 15);  // 黄色 - 合格
    return new DeviceRgb(231, 76, 60);                    // 红色 - 需改进
}
```

简历分析报告中的评分维度表也复用了这个方法——项目深度（0-40）、技能匹配（0-20）、内容（0-15）、结构（0-15）、表达（0-10）每个维度独立着色，用户一眼就能看出短板在哪。

### JSON 数据的解析与渲染

面试报告中的“优势”和“改进建议”存储在 `InterviewSessionEntity` 的 JSON 字段里。渲染时需要用 Jackson 的 `ObjectMapper` 把 JSON 字符串解析为 Java 对象，再逐条添加到 PDF：

```java
// 从 JSON 字符串解析出建议列表
List<ImprovementSuggestion> suggestions = objectMapper.readValue(
    session.getImprovements(),
    new TypeReference<List<ImprovementSuggestion>>() {}
);

// 逐条渲染为 PDF 段落
for (var suggestion : suggestions) {
    document.add(new Paragraph("• " + sanitizeText(suggestion.getRecommendation()))
        .setMarginLeft(20));
}
```

> **包路径注意**：本项目使用 Spring Boot 4.0，配套的 Jackson 升级到了 3.x——`ObjectMapper` 和 `TypeReference` 迁移到了 `tools.jackson.*` 命名空间，和 Spring Boot 3.x 的 `com.fasterxml.jackson.*` 不兼容。如果直接复制 Spring Boot 3.x 教程的 import 语句，IDE 会标红。

注意循环里的 `sanitizeText()` 调用——每次把文本添加到 PDF 之前都做了清洗，这是下一节要讲的内容。

## 特殊字符过滤：防止 emoji 崩溃

AI 生成的文本里经常出现 emoji（比如 ⭐、✅、🔥）。这些字符在朱雀仿宋字体里没有对应的字形，直接渲染会导致两种后果：要么显示为空白方块，要么抛出字体异常导致整个 PDF 生成失败。

解决方式是在所有文本进入 PDF 之前统一过滤：

```java
private String sanitizeText(String text) {
    if (text == null) return "";
    return text.replaceAll("[\\p{So}\\p{Cs}]", "").trim();
}
```

两个 Unicode 类别的含义：

* `\p{So}`：其他符号（Other Symbol），覆盖 emoji 和各种图标字符
* `\p{Cs}`：代理区（Surrogate），UTF-16 编码中用于表示超出基本多语言平面的字符

这个方法在 `PdfExportService` 的每个文本渲染点都会调用，确保只有字体能渲染的字符进入文档。

这里有一个设计决策：为什么不换一个支持 emoji 的字体？答案是代价太大——支持 emoji 的字体文件通常在 10 MB 以上，会显著增大每个 PDF 的体积。而本项目的报告场景根本不需要 emoji，过滤掉是最省心的方案。

## API 接口与调用链路

### 调用链路

```mermaid
flowchart LR
    classDef client fill:#00838F,color:#FFFFFF,stroke:none,rx:10,ry:10
    classDef business fill:#E99151,color:#FFFFFF,stroke:none,rx:10,ry:10
    classDef infra fill:#9B59B6,color:#FFFFFF,stroke:none,rx:10,ry:10
    classDef success fill:#4CA497,color:#FFFFFF,stroke:none,rx:10,ry:10

    Client([用户点击下载]):::client
    Controller[Controller]:::business
    HistoryService[HistoryService]:::business
    PdfService[PdfExportService]:::infra
    PDF([PDF 字节流]):::success

    Client --> Controller --> HistoryService --> PdfService --> PDF

    linkStyle default stroke-width:2px,stroke:#333333,opacity:0.8
```

以面试报告为例，完整调用链路是：

1. 前端发起 `GET /api/interview/sessions/{sessionId}/export`
2. `InterviewController` 接收请求，委托 `InterviewHistoryService`
3. `InterviewHistoryService` 从数据库加载面试会话实体，调用 `PdfExportService`
4. `PdfExportService` 生成 PDF 字节流，逐层返回给前端

简历分析报告的链路完全对称：`ResumeController` → `ResumeHistoryService` → `PdfExportService`。

### 文件下载接口

中文文件名在不同浏览器下的处理方式不同。项目采用 RFC 5987 标准的 `filename*` 参数，确保中文文件名在所有主流浏览器中都能正确显示：

```java
@GetMapping("/api/interview/sessions/{sessionId}/export")
public ResponseEntity<byte[]> exportInterviewPdf(@PathVariable String sessionId) {
    byte[] pdfBytes = historyService.exportInterviewPdf(sessionId);
    String filename = URLEncoder.encode(
        "模拟面试报告_" + sessionId + ".pdf",
        StandardCharsets.UTF_8
    );

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename*=UTF-8''" + filename)
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdfBytes);
}
```

关键行是 `filename*=UTF-8''` + URL 编码的文件名。这个格式遵循 RFC 5987 规范，告诉浏览器“文件名用 UTF-8 编码，按这个解码”，兼容 Chrome、Firefox、Safari 和 Edge。如果只用 `filename="中文.pdf"`，在部分浏览器中文件名会变成 URL 编码的原始字符串。

## 可优化方向

上面讲的是当前生产版本的实现。还有两个方向值得探索，感兴趣的同学可以尝试实践。

### 同步转异步

当前 PDF 导出是同步的——用户点击下载，后端生成 PDF，然后返回。对于面试报告这种数据量适中的场景（一二十道题的问答详情），响应时间通常在 1-2 秒，体验可接受。但如果报告内容非常多（比如包含大量 RAG 检索依据），生成可能超过 5 秒，这时候可以利用项目已有的 Redis Stream 把 PDF 生成任务异步化：生成完成后存到 S3，通过消息或轮询通知用户下载。

### HTML 转 PDF

当前的方式是手动编写 `document.add(new Paragraph(...))` 来构建 PDF 内容。对于简单报告可以接受，但如果报告结构复杂或经常变化，维护起来会很痛苦——每次调整布局都要改 Java 代码、重新编译部署。

iText 8 的扩展模块 [pdfHTML](https://mvnrepository.com/artifact/com.itextpdf/html2pdf) 能把 HTML/CSS 直接转换为 PDF。结合 Thymeleaf 模板引擎，可以实现关注点分离：HTML 管结构，CSS 管样式，Java 只负责准备数据和触发转换。调整 PDF 样式只需要改模板文件，不用动 Java 代码。

## 总结

* **内嵌字体，别依赖系统**：把字体文件打包进 JAR 并强制嵌入 PDF，是解决中文跨平台渲染最省心的方案。靠系统字体看似省空间，实则给乱码埋坑。
* **文本先清洗再渲染**：AI 返回的内容不可控，emoji 和特殊字符必须过滤后再送进 PDF，否则一个字符就能让整个导出崩溃。
* **用颜色传递信息**：评分用红黄绿着色不是装饰，是让用户不看数字就能判断水平的视觉编码。
* **许可证要提前评估**：iText 8 的 AGPL 对开源项目没有限制，但闭源商用需要购买许可。如果许可证是硬约束，尽早切换到 OpenPDF。


> 更新: 2026-04-30 07:24:03  
> 原文: <https://www.yuque.com/snailclimb/itdq8h/lqcckshs644447fx>