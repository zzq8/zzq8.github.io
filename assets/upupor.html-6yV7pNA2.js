import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,e as p}from"./app-RV1sWrnF.js";const e={},t=p(`<h1 id="upuporstudy" tabindex="-1"><a class="header-anchor" href="#upuporstudy"><span>upuporStudy</span></a></h1><p>https://eco.upupor.com/upupor/</p><p>可以看这个网址，记录作者对这个Blog的很多思路。。。。包括MinIO、mysql的备份，以及服务的部署！</p><figure><img src="https://eco.upupor.com/assets/upupor-architecture.c16039e8.svg" alt="https://eco.upupor.com/assets/upupor-architecture.c16039e8.svg" tabindex="0" loading="lazy"><figcaption>https://eco.upupor.com/assets/upupor-architecture.c16039e8.svg</figcaption></figure><h1 id="一、前置环境" tabindex="-1"><a class="header-anchor" href="#一、前置环境"><span>一、前置环境</span></a></h1><blockquote><ol><li>过启动时候 log 看触发哪些配置项</li><li>一个个功能模块过</li></ol></blockquote><h2 id="_1-flyway" tabindex="-1"><a class="header-anchor" href="#_1-flyway"><span>1.flyway</span></a></h2><p>作用：数据迁移</p><p>数据库会新产生一个 flyway_schema_history 的表</p><ul><li>这个表会记录每一个 sql 脚本文件的操作，以及是否执行成功</li><li>作用：upupor使用了flyway,因此数据库SQL文件维护在upupor-web/src/main/resources/db/migration目录,只需要配置好DB然后启动程序,就会创建相应的表以及执行相应的SQL. 后续如果想新增表或者执行SQL可以直接在migration目录按照规则新建migration文件即可,程序启动时会自动执行. Flyway是一个开源的数据库版本控制工具，它用于管理和跟踪数据库结构的变化</li></ul><p>小技巧：用 IDEA 操作数据库新增列会产生语句，这个时候就可以复制这个语句了！</p><p>SQL脚本文件有固定命名规则</p><ol><li>V开头</li><li>__两个下划线连接描述信息</li></ol><h2 id="_2-环境变量" tabindex="-1"><a class="header-anchor" href="#_2-环境变量"><span>2.环境变量</span></a></h2><blockquote><p><code>XD：我觉得这是开源值得学习的一个点，所有隐私部分用\${} 然后单独搞个 application.properties 不被版本控制就行！</code></p><p>详细我记录在 SpringBoot 笔记中了，<strong>我这里用的是 application.properties(no version) + idea Environment variables</strong> 搭配一起用，目的是测了下这两者都生效了！！！</p></blockquote><p>针对一次会话的话 linux-export，windows-set</p><p>好像写到 application.properties 里面也可以，这个文件不版本控制就行</p><p>我这里选择用 idea 自带的 Environment variables 设置</p><h1 id="二、注册-邮件" tabindex="-1"><a class="header-anchor" href="#二、注册-邮件"><span>二、注册-邮件</span></a></h1><h2 id="_1-事件驱动-eventlistener" tabindex="-1"><a class="header-anchor" href="#_1-事件驱动-eventlistener"><span>1.事件驱动-@EventListener</span></a></h2><p>笔记：https://www.cnblogs.com/dafengdeai/articles/17073114.html</p><p>视频：https://www.bilibili.com/video/BV1Cd4y1q7Vm/?spm_id_from=333.337.search-card.all.click&amp;vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0</p><p>更好的视频：https://www.bilibili.com/video/BV1Wa4y1477d?p=3&amp;vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0</p><blockquote><p><mark>Spring、SpringBoot常用扩展特性之事件驱动</mark> 看代码demo Spring Boot 2 项目</p><p>一般搭配以下两个注解一起使用： <strong>@EventListener @Async</strong></p><ol><li>@0rder指定执行顺序在同步的情况下生效 看视频也可以搭配这个注解，加个权重 假如多个Listener消费谁先</li><li>@Async 异步执行需要 @EnableAsync 开启异步</li></ol></blockquote><blockquote><p>事件驱动:即跟随当前时间点上出现的事件,调动可用资源,执行相关任务,使不断出现的问题得以解决,防止事务堆积. 如:注册账户时会收到短信验证码,火车发车前收到提醒,预定酒店后收到短信通知等.如:浏宽器中点击按钮请求后台,鼠标点击变化内容,键盘输入显示数据,服务接收请求后分发请求等.在解决上述问题时,应用程序是由&quot;事件驱动运行的,这类程序在编写时往往可以采用相同的模型实现,我们可以将这种编程模型称为事件驱动模型. (PS:事件驱动模型其实是一种抽象模型,用于对由外部事件驱动系统业务逻辑这类应用程序进行建模.)</p></blockquote><p>debug走到一步，不懂</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Resource</span>
<span class="token keyword">private</span> <span class="token class-name">ApplicationEventPublisher</span> eventPublisher<span class="token punctuation">;</span>

<span class="token comment">//UNKNOWN @FunctionalInterface这里的作用是什么          @EventListener注解！！！！！？？？？</span>
eventPublisher<span class="token punctuation">.</span><span class="token function">publishEvent</span><span class="token punctuation">(</span>sendEmailEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>后来懂了，上面是发布事件了              有相对于的方法监听消费这个事件：<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token annotation punctuation">@EventListener</span>
    <span class="token annotation punctuation">@Async</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">sendEmail</span><span class="token punctuation">(</span><span class="token class-name">EmailEvent</span> emailEvent<span class="token punctuation">)</span> 
    
<span class="token constant">PS</span>：方法参数需要和发布 sendEmailEvent 类型对应，   这样才是一一对应消费
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><mark>重点就是这三个类，搞清就行！！！可以看自己写的代码 注意：ApplicationEvent 可以不实现所以重心其实就两个类</mark></p><ol><li>Spring事件驱动最基本的使用 <code>ApplicationEventPublisher</code>,<code>ApplicationEvent</code>,<code>ApplicationListener</code> （Spring抽象出了这基本的三个。 事件生产方、事件、事件消费方）</li><li>ApplicotionEventPublisher 子类 <code>ApplicationContext</code> （在启动类中这个常用一些applicationContext.publishEvent(new ApplicationEvent(this){})）</li><li>事件源、监听器需要被spring管理</li><li>监听器需要实现ApplicationListener&lt;ApplicotionEvent&gt; xd: 可注解！</li><li><strong>可体现事件源和监听器之间的松耦合仅依赖spring、ApplicationEvent</strong>（发布、监听两个类中都没有另一个的引用！）</li></ol><p>XD：</p><ol><li><p>publisher-生产者， Listener（注解到方法）-消费者 publishEvent几次，listener就会消费几次</p></li><li><p>ApplicationEvent 可以不实现，看顶层的这个接口源码其实也转成了 Object，但是按规范注释来说希望所有的事件类都最好实现 ApplicationEvent</p><ul><li><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token class-name">ApplicationEventPublisher</span><span class="token punctuation">.</span><span class="token keyword">class</span>

<span class="token keyword">default</span> <span class="token keyword">void</span> <span class="token function">publishEvent</span><span class="token punctuation">(</span><span class="token class-name">ApplicationEvent</span> event<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">publishEvent</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">Object</span><span class="token punctuation">)</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
	

<span class="token comment">//所以事件类没有extends ApplicationEvent也行其实走的是这里</span>
<span class="token keyword">void</span> <span class="token function">publishEvent</span><span class="token punctuation">(</span><span class="token class-name">Object</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ol><h1 id="三、uuid" tabindex="-1"><a class="header-anchor" href="#三、uuid"><span>三、UUID</span></a></h1><blockquote><p>com.upupor.framework.utils.CcUtils#getUuId</p></blockquote><h1 id="四、文章压缩" tabindex="-1"><a class="header-anchor" href="#四、文章压缩"><span>四、文章压缩</span></a></h1><p><code>com.upupor.framework.utils.DeflaterUtils</code></p><blockquote><p>在 Java 中，<code>Deflater</code> 是一个用于数据压缩的类。它提供了一种在内存中压缩数据的方式，使得数据可以更有效地存储和传输。</p><p><code>Deflater</code> 类使用 DEFLATE 压缩算法，这是一种无损数据压缩算法，广泛应用于诸如 ZIP 文件、HTTP 压缩和其他数据传输场景中。</p><p>使用 <code>Deflater</code> 类可以将数据压缩为压缩格式，然后可以将压缩后的数据存储到文件中、传输给其他系统或在内存中进行处理。</p></blockquote><p><code>Deflater</code> 和 <code>base64</code> 是两种完全不同的概念和功能。</p><ol><li><code>Deflater</code> 是用于数据压缩的类，它使用 DEFLATE 压缩算法将数据压缩为更小的形式。它通过消除数据中的冗余和重复信息来减小数据的大小，使得数据可以更有效地存储和传输。压缩后的数据可以在需要时进行解压缩以恢复原始数据。</li><li><code>base64</code> 是一种编码方式，用于将二进制数据转换为可打印的 ASCII 字符串。它并不进行数据压缩，而是将数据按照一定的规则进行编码，以便在传输或保存时能够处理二进制数据。<code>base64</code> 编码将每 3 个字节的二进制数据编码为 4 个可打印字符，编码后的字符串长度通常会比原始数据增加约 33%。</li></ol><p><code>Deflater</code> 和 <code>base64</code> 通常用于不同的场景和目的：</p><ul><li><code>Deflater</code> 适用于需要对数据进行压缩，以减小数据的大小，节省存储空间或在网络传输中降低带宽消耗的情况。</li><li><code>base64</code> 适用于需要将二进制数据转换为可打印的 ASCII 字符串，例如在传输二进制数据时，由于某些通信协议或数据传输的限制，只能传输可打印字符，而不能直接传输二进制数据。</li></ul><h1 id="五、todo-获取文章内容" tabindex="-1"><a class="header-anchor" href="#五、todo-获取文章内容"><span>五、TODO-获取文章内容</span></a></h1><blockquote><p>一开始我只想确认文章展示是不是需要 unzip 解压缩</p><p>我现在都不知道入口在哪，头晕~ 一步步的太恐怖了 源码</p></blockquote><h1 id="六、响应时间" tabindex="-1"><a class="header-anchor" href="#六、响应时间"><span>六、响应时间</span></a></h1><blockquote><p>在 Spring 框架中，<code>StopWatch</code> 是一个用于测量代码执行时间的工具类。它提供了一种简单的方式来跟踪代码块的执行时间，并可以用于性能分析、调优和监控。</p></blockquote><p>博客底下的那个计时怎么实现 怎么前后的</p><ul><li>spring的 StopWatch 类 + @Around 实现！！！</li><li><code>com.upupor.web.aspects.ControllerAspectAspect#doAround</code></li></ul><h1 id="七、基于redis滑动窗口实现用户限流" tabindex="-1"><a class="header-anchor" href="#七、基于redis滑动窗口实现用户限流"><span>七、基于Redis滑动窗口实现用户限流</span></a></h1><p>com.upupor.test.UpuporLimiterTest</p><p>TODO 😡 还没花时间看</p><p>RuoYi 也有，对比实现逻辑</p><h1 id="八、页面下版本时间信息" tabindex="-1"><a class="header-anchor" href="#八、页面下版本时间信息"><span>八、页面下版本时间信息</span></a></h1><p>启动类给上静态变量！！！在 <code>@Around(&quot;controllerLog()&quot;)</code> 里调用 bz，也就是说有xhr就会触发</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>modelAndView<span class="token punctuation">.</span><span class="token function">addObject</span><span class="token punctuation">(</span><span class="token constant">STATIC_SOURCE_VERSION</span><span class="token punctuation">,</span> <span class="token class-name">UpuporWebApplication</span><span class="token punctuation">.</span><span class="token constant">STATIC_SOURCE_VERSION</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UpuporWebApplication</span> <span class="token keyword">implements</span> <span class="token class-name">CommandLineRunner</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">STATIC_SOURCE_VERSION</span><span class="token punctuation">;</span>

    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">setProperty</span><span class="token punctuation">(</span><span class="token string">&quot;druid.mysql.usePingMethod&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;false&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token constant">STATIC_SOURCE_VERSION</span> <span class="token operator">=</span> <span class="token class-name">LocalDateTime</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token class-name">ZoneId</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">&quot;Asia/Shanghai&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="z、知识点" tabindex="-1"><a class="header-anchor" href="#z、知识点"><span>Z、知识点</span></a></h1><h2 id="_1-实现applicationcontextaware接口的作用" tabindex="-1"><a class="header-anchor" href="#_1-实现applicationcontextaware接口的作用"><span>1.实现ApplicationContextAware接口的作用</span></a></h2><blockquote><p>场景：发现工具类中 SpringContextUtils.getBean(TrueSend.class); 好奇为什么不@Autowaird</p></blockquote><p>实现 <code>ApplicationContextAware</code> 接口的作用是允许一个类获取对 Spring 应用程序上下文（<code>ApplicationContext</code>）的访问权限。通过实现该接口，类可以获得对应用程序上下文的引用，从而能够进行更高级别的操作，例如获取和管理 Spring Bean、发布应用程序事件等。</p><p>具体来说，当一个类实现了 <code>ApplicationContextAware</code> 接口，它必须实现接口中的 <code>setApplicationContext()</code> 方法。Spring 在初始化该类的实例时，会自动调用 <code>setApplicationContext()</code> 方法，并将应用程序上下文作为参数传递给该方法。通过该方法，类可以将传递的应用程序上下文存储为一个成员变量，以便在需要时进行访问。</p><p>下面是一个示例：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">ApplicationContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">ApplicationContextAware</span></span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyBean</span> <span class="token keyword">implements</span> <span class="token class-name">ApplicationContextAware</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">ApplicationContext</span> applicationContext<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setApplicationContext</span><span class="token punctuation">(</span><span class="token class-name">ApplicationContext</span> applicationContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>applicationContext <span class="token operator">=</span> applicationContext<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">T</span> <span class="token function">getBean</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> clazz<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">BeansException</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> applicationContext<span class="token punctuation">.</span><span class="token function">getBean</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span>即可在 <span class="token class-name">CcEmailUtils</span><span class="token punctuation">.</span><span class="token keyword">class</span> 等没有被<span class="token class-name">Spring</span>管理的工具类中使用<span class="token class-name">Spring</span>对象
    <span class="token class-name">TrueSend</span> trueSend <span class="token operator">=</span> <span class="token class-name">SpringContextUtils</span><span class="token punctuation">.</span><span class="token function">getBean</span><span class="token punctuation">(</span><span class="token class-name">TrueSend</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过实现 <code>ApplicationContextAware</code> 接口，类可以直接访问应用程序上下文，从而获得更多的灵活性和功能。例如，可以根据需要获取其他 Bean 的引用、发布应用程序事件、访问配置属性等。</p><h2 id="_2-spring-静态资源启用版本控制" tabindex="-1"><a class="header-anchor" href="#_2-spring-静态资源启用版本控制"><span>2.<a href="../JavaFramework/SpringBoot#9%EF%BC%89Spring-%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E5%90%AF%E7%94%A8%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6">Spring-静态资源启用版本控制</a></span></a></h2><blockquote><p>记到了 SpringBoot.md 中，具体 link title</p></blockquote><p>犹记毕业第一年时，公司每次发布完成后，都会在一个群里通知【版本更新，各部门清理缓存，有问题及时反馈】之类的话。归根结底就是资源缓存的问题，浏览器会将请求到的静态资源，如JS、CSS等文件缓存到用户本地，当用户再次访问时就不需要再次请求这些资源了，以此也是提升了用户体验。但是也正是因为这些资源缓存，导致客户端的静态文件往往不是当前最新版本。后来有同事增加了时间戳、随机数等，确实这也解决了客户端缓存的问题，但是却又带来了新的麻烦，导致每次访问都要请求服务器，无形中增加了服务器的压力。</p><h2 id="_3-lucene" tabindex="-1"><a class="header-anchor" href="#_3-lucene"><span>3.Lucene</span></a></h2><p>Lucene和Elasticsearch之间存在密切的关联。实际上，Elasticsearch是建立在Lucene之上的分布式搜索和分析引擎，它提供了更高级的功能和易用性的接口，以便于构建和管理大规模的分布式搜索应用程序。</p><p>Minio</p><ul><li><p>必须要手动上传不能资源管理器复制进去</p></li><li><p>资源管理器上传的文件不是源文件，好像被它加密了</p></li><li><p>配合Spring的版本 在上传到minio时计算下md5后再上传</p><ul><li><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token comment"># 生产</span>
targetDic <span class="token operator">=</span> <span class="token string">&quot;/upupor/apps/codes/upupor/upupor-web/src/main/resources/static&quot;</span>
targetPath <span class="token operator">=</span> os<span class="token punctuation">.</span>walk<span class="token punctuation">(</span>targetDic<span class="token punctuation">)</span>
ossTargetDic <span class="token operator">=</span> <span class="token string">&quot;/upupor_static&quot;</span>

<span class="token keyword">def</span> <span class="token function">getMd5</span><span class="token punctuation">(</span>localFile<span class="token punctuation">)</span><span class="token punctuation">:</span>
    f <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span>localFile<span class="token punctuation">,</span><span class="token string">&#39;rb&#39;</span><span class="token punctuation">)</span>
    md5_obj <span class="token operator">=</span> hashlib<span class="token punctuation">.</span>md5<span class="token punctuation">(</span><span class="token punctuation">)</span>
    md5_obj<span class="token punctuation">.</span>update<span class="token punctuation">(</span>f<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    hash_code <span class="token operator">=</span> md5_obj<span class="token punctuation">.</span>hexdigest<span class="token punctuation">(</span><span class="token punctuation">)</span>
    f<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>
    md5 <span class="token operator">=</span> <span class="token builtin">str</span><span class="token punctuation">(</span>hash_code<span class="token punctuation">)</span><span class="token punctuation">.</span>lower<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> md5

<span class="token comment">#</span>
client <span class="token operator">=</span> Minio<span class="token punctuation">(</span>
    endpoint<span class="token operator">=</span><span class="token string">&quot;ip:port&quot;</span><span class="token punctuation">,</span>
    access_key<span class="token operator">=</span><span class="token string">&quot;xxxx&quot;</span><span class="token punctuation">,</span>
    secret_key<span class="token operator">=</span><span class="token string">&quot;xxxxxx&quot;</span><span class="token punctuation">,</span>
    secure<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>

<span class="token comment"># client.trace_on(sys.stdout)</span>

<span class="token keyword">for</span> path<span class="token punctuation">,</span>dir_list<span class="token punctuation">,</span>file_list <span class="token keyword">in</span> targetPath<span class="token punctuation">:</span>
    <span class="token keyword">for</span> file_name <span class="token keyword">in</span> file_list<span class="token punctuation">:</span>
        <span class="token keyword">if</span> <span class="token string">&#39;.map&#39;</span> <span class="token keyword">in</span> file_name<span class="token punctuation">:</span>
            <span class="token keyword">continue</span>
        <span class="token keyword">if</span> <span class="token string">&#39;.DS_Store&#39;</span> <span class="token keyword">in</span> file_name<span class="token punctuation">:</span>
            <span class="token keyword">continue</span>
        <span class="token comment"># 本地文件</span>
        localFile <span class="token operator">=</span> os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>join<span class="token punctuation">(</span>path<span class="token punctuation">,</span> file_name<span class="token punctuation">)</span>
        <span class="token comment"># 计算md5值</span>
        md5value <span class="token operator">=</span> getMd5<span class="token punctuation">(</span>localFile<span class="token punctuation">)</span>
        <span class="token comment"># 将md5值添加到文件名上</span>
        local_file_md5_name <span class="token operator">=</span> localFile<span class="token punctuation">.</span>replace<span class="token punctuation">(</span>targetDic<span class="token punctuation">,</span><span class="token string">&#39;&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;\\\\&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.svg&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.svg&quot;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.webp&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.webp&quot;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.js&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.js&quot;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.css&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.css&quot;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.png&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.png&quot;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.jpeg&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.jpeg&quot;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.jpg&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.jpg&quot;</span><span class="token punctuation">)</span>\\
                              <span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&#39;.ico&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;-&#39;</span><span class="token operator">+</span>md5value<span class="token operator">+</span><span class="token string">&quot;.ico&quot;</span><span class="token punctuation">)</span>
        ossObjectName <span class="token operator">=</span> ossTargetDic <span class="token operator">+</span> local_file_md5_name
        <span class="token comment"># if exist == True:</span>
        <span class="token comment">#     print(&#39;已存在,无需上传------------&#39;+ossObjectName)</span>
        <span class="token comment">#     continue</span>
        <span class="token comment"># print(&#39;正在上传... &#39; + ossObjectName)</span>

        in_get_content_type<span class="token operator">=</span><span class="token string">&quot;application/octet-stream&quot;</span><span class="token punctuation">;</span>
        md5FileName <span class="token operator">=</span> local_file_md5_name<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
        suffix <span class="token operator">=</span> md5FileName<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">&#39;.&#39;</span><span class="token punctuation">,</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> suffix <span class="token operator">==</span> <span class="token string">&#39;js&#39;</span><span class="token punctuation">:</span>
            in_get_content_type<span class="token operator">=</span><span class="token string">&#39;application/x-javascript&#39;</span>

        <span class="token keyword">if</span> suffix <span class="token operator">==</span> <span class="token string">&#39;css&#39;</span><span class="token punctuation">:</span>
            in_get_content_type<span class="token operator">=</span><span class="token string">&#39;text/css&#39;</span>

        
        <span class="token keyword">if</span> suffix <span class="token operator">==</span> <span class="token string">&#39;svg&#39;</span><span class="token punctuation">:</span>
            in_get_content_type<span class="token operator">=</span><span class="token string">&#39;image/svg+xml&#39;</span>

        <span class="token comment">#print(in_get_content_type)</span>
        <span class="token comment">#print(suffix)</span>
        client<span class="token punctuation">.</span>fput_object<span class="token punctuation">(</span>bucket_name<span class="token operator">=</span><span class="token string">&quot;upupor-img&quot;</span><span class="token punctuation">,</span> object_name<span class="token operator">=</span>ossObjectName<span class="token punctuation">,</span> file_path<span class="token operator">=</span>localFile<span class="token punctuation">,</span>content_type<span class="token operator">=</span>in_get_content_type<span class="token punctuation">)</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span>ossObjectName <span class="token operator">+</span> <span class="token string">&#39;  已上传&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ul><h2 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h2><h1 id="todo" tabindex="-1"><a class="header-anchor" href="#todo"><span>TODO</span></a></h1><ul><li><p>blog文章加密方式，为什么</p><ul><li><p>com.upupor.framework.utils.DeflaterUtils</p><ul><li><p><code>Deflater</code> 类使用 DEFLATE 压缩算法，这是一种无损数据压缩算法，广泛应用于诸如 ZIP 文件、HTTP 压缩和其他数据传输场景中。</p><p>使用 <code>Deflater</code> 类可以将数据压缩为压缩格式，然后可以将压缩后的数据存储到文件中、传输给其他系统或在内存中进行处理。</p></li></ul></li></ul></li><li><p>草稿？是定时任务实现吗</p><ul><li><p>前端实现</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 自动保存 10秒执行一次</span>
    autoSaveInterval <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">autoSave</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> auto_save_timeout<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><p>站内信息</p><ul><li>一张 message 表</li></ul></li><li><p>LOG_PATH_IS_UNDEFINEDbackup 文件夹发现会压缩错误日志到里面！</p><ul><li>好像是 <code>logback.xml</code> 实现</li></ul></li><li><p>上传音频</p><ul><li>js 实现的blob 音频文件</li></ul></li><li><ul><li></li></ul></li></ul>`,72),o=[t];function c(l,i){return s(),a("div",null,o)}const d=n(e,[["render",c],["__file","upupor.html.vue"]]),k=JSON.parse('{"path":"/studynotes/upupor/upupor.html","title":"upuporStudy","lang":"zh-CN","frontmatter":{"description":"upuporStudy https://eco.upupor.com/upupor/ 可以看这个网址，记录作者对这个Blog的很多思路。。。。包括MinIO、mysql的备份，以及服务的部署！ https://eco.upupor.com/assets/upupor-architecture.c16039e8.svghttps://eco.upupor...","head":[["meta",{"property":"og:url","content":"https://doc.zzq8.cn/studynotes/upupor/upupor.html"}],["meta",{"property":"og:site_name","content":"Zz"}],["meta",{"property":"og:title","content":"upuporStudy"}],["meta",{"property":"og:description","content":"upuporStudy https://eco.upupor.com/upupor/ 可以看这个网址，记录作者对这个Blog的很多思路。。。。包括MinIO、mysql的备份，以及服务的部署！ https://eco.upupor.com/assets/upupor-architecture.c16039e8.svghttps://eco.upupor..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://eco.upupor.com/assets/upupor-architecture.c16039e8.svg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-13T08:39:03.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-13T08:39:03.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"upuporStudy\\",\\"image\\":[\\"https://eco.upupor.com/assets/upupor-architecture.c16039e8.svg\\"],\\"dateModified\\":\\"2024-04-13T08:39:03.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"1.flyway","slug":"_1-flyway","link":"#_1-flyway","children":[]},{"level":2,"title":"2.环境变量","slug":"_2-环境变量","link":"#_2-环境变量","children":[]},{"level":2,"title":"1.事件驱动-@EventListener","slug":"_1-事件驱动-eventlistener","link":"#_1-事件驱动-eventlistener","children":[]},{"level":2,"title":"1.实现ApplicationContextAware接口的作用","slug":"_1-实现applicationcontextaware接口的作用","link":"#_1-实现applicationcontextaware接口的作用","children":[]},{"level":2,"title":"2.Spring-静态资源启用版本控制","slug":"_2-spring-静态资源启用版本控制","link":"#_2-spring-静态资源启用版本控制","children":[]},{"level":2,"title":"3.Lucene","slug":"_3-lucene","link":"#_3-lucene","children":[]},{"level":2,"title":"","slug":"","link":"#","children":[]}],"git":{"createdTime":1712997543000,"updatedTime":1712997543000,"contributors":[{"name":"Fighting","email":"1024zzq@gmail.com","commits":1}]},"readingTime":{"minutes":9.99,"words":2998},"filePathRelative":"studynotes/upupor/upupor.md","localizedDate":"2024年4月13日","autoDesc":true}');export{d as comp,k as data};