"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[5572],{9874:(s,i)=>{i.A=(s,i)=>{const a=s.__vccOpts||s;for(const[s,n]of i)a[s]=n;return a}},6828:(s,i,a)=>{a.r(i),a.d(i,{comp:()=>o,data:()=>c});var n=a(2360);const e=(0,n.Fv)('<h1 id="maven" tabindex="-1"><a class="header-anchor" href="#maven"><span>Maven</span></a></h1><blockquote><p>鱼皮这篇讲的细：https://mp.weixin.qq.com/s/mOFjOVYrM_b9I2UlNgeGxg</p><p>mvn clean package -Dmaven.test.skip</p></blockquote><h2 id="todo" tabindex="-1"><a class="header-anchor" href="#todo"><span>TODO</span></a></h2><p>https://blog.csdn.net/weixin_45433031/article/details/125284806 （还需理解到maven笔记，springboot打包插件如果我不加以下会有什么影响：）</p><h1 id="pom文件-maven" tabindex="-1"><a class="header-anchor" href="#pom文件-maven"><span>*）Pom文件/Maven：</span></a></h1>',5),t=(0,n.Fv)('<li><h4 id="pom-xml-relativepath" tabindex="-1"><a class="header-anchor" href="#pom-xml-relativepath"><span><a href="https://blog.csdn.net/gzt19881123/article/details/105255138" target="_blank" rel="noopener noreferrer">Pom.xml -&gt; &lt;relativePath&gt;</a></span></a></h4><figure><img src="https://images.zzq8.cn/img/202210171022851.png" alt="image-20221017102235784" tabindex="0" loading="lazy"><figcaption>image-20221017102235784</figcaption></figure><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>设定一个空值将始终从仓库中获取，不从本地路径获取，如&lt;relativePath/&gt; 看这句就很明了了！这里就是去本地../bokeerp路径去拿这个pom文件</span></span>\n<span class="line"><span>Maven parent.relativePath</span></span>\n<span class="line"><span>默认值为../pom.xml</span></span>\n<span class="line"><span>查找顺序：relativePath元素中的地址–本地仓库–远程仓库</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><mark><strong>Maven 寻找父模块pom.xml 的顺序如下：</strong></mark></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span> (1)  first in the reactor of currently building projects</span></span>\n<span class="line"><span>       这里一个maven概念 反应堆（reactor ），</span></span>\n<span class="line"><span>       意思就是先从工程里面有依赖相关的模块中找你引入的</span></span>\n<span class="line"><span>       parent 的pom.xml，</span></span>\n<span class="line"><span>     </span></span>\n<span class="line"><span> (2) then in this location on the filesystem</span></span>\n<span class="line"><span>      然后从 你定义的  &lt;relativePath &gt; 路径中找，</span></span>\n<span class="line"><span>      当然你如果只是 /  即空值，则跳过该步骤，  </span></span>\n<span class="line"><span>      默认值 ../pom.xml 则是从上级目录中找啦。</span></span>\n<span class="line"><span></span></span>\n<span class="line"><span> (3)  then the local repository</span></span>\n<span class="line"><span>    这个就不说了，如果 （1） （2） 步骤没有则从 本地仓库找啦。</span></span>\n<span class="line"><span></span></span>\n<span class="line"><span> (4) and lastly in the remote repo</span></span>\n<span class="line"><span>  这个还用说吗，上面都找不到了，最后只能从远程仓库找啦，再找不到就报错给你看 </span></span>\n<span class="line"><span>  </span></span>\n<span class="line"><span>  </span></span>\n<span class="line"><span>一般新建 Spring Boot 工程，默认是 &lt;relativePath /&gt; &lt;!-- lookup parent from repository --&gt; ，意思就是不会从上层目录寻找。会直接先从 local repository，如果没有则会从 remote repo 寻找，如果也没有，则报错。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>',1),l={id:"true",tabindex:"-1"},p={class:"header-anchor",href:"#true"},h=(0,n.Fv)('<ul><li><p>场景：我发现引入了data-redis，也要引入commons-pool2 不然启动报错</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;org.springframework.boot&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;spring-boot-starter-data-redis&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;org.apache.commons&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;commons-pool2&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原因：因为 <code>spring-boot-starter-data-redis</code> 下面的 <code>lettuce-core</code></p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;org.apache.commons&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;commons-pool2&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;2.8.1&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">scope</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;compile&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">scope</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">optional</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;true&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">optional</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>chatgpt: 在 Maven 的 pom.xml 文件中，可以使用 <code>&lt;optional&gt;</code> 标签来指定一个依赖是否是可选的</p><p>这样的设置意味着，当这个依赖被其他模块引用时，它不会自动传递给这些模块。也就是说，如果一个模块引用了这个依赖，但是没有显式声明它，那么这个依赖不会被自动包含在该模块的依赖列表中。</p><p>使用 <code>&lt;optional&gt;</code> 标签可以有效地控制依赖的传递性，避免不必要的依赖冲突和版本冲突。例如，如果一个项目需要使用某个第三方库的某个功能，但是这个库又依赖于另外一个库，而这个库和项目中的其他依赖产生了冲突，就可以将这个库设置为可选依赖，只在需要时显式引入，避免不必要的冲突。</p><p>另外，值得注意的是，当一个依赖被设置为可选依赖时，它的传递性也会被取消。这意味着，如果这个依赖还依赖了其他库，这些库也不会自动传递给项目中的其他模块。如果需要使用这些库，也需要显式引入它们。</p><p>总之，使用 <code>&lt;optional&gt;</code> 标签可以控制依赖的传递性，避免不必要的依赖冲突和版本冲突，但是需要注意，它的传递性也会被取消，需要手动处理相关的依赖。</p><blockquote><p>Q: 2.3.12.RELEASE版本的springboot引入spring-boot-starter-data-redis为什么还需要显式的引入commons-pool2才能正常启动项目</p><p>在 Spring Boot 2.3.12.RELEASE 版本中，<code>spring-boot-starter-data-redis</code> 依赖中的 <code>lettuce-core</code> 版本为 <code>5.3.2.RELEASE</code>，它自带了 <code>commons-pool2</code> 依赖。但是在这个版本的 Spring Boot 中，<code>commons-pool2</code> 的依赖是以 <code>&lt;optional&gt;true&lt;/optional&gt;</code> 的方式声明的，这意味着在默认情况下不会被引入。</p><p>如果你不显式地引入 <code>commons-pool2</code> 的依赖，而是只依赖于 <code>spring-boot-starter-data-redis</code>，那么在启动应用程序时，就会出现类似于“java.lang.NoClassDefFoundError: org/apache/commons/pool2/impl/GenericObjectPoolConfig”的错误，因为缺少了 <code>commons-pool2</code> 的依赖。</p><p>为了解决这个问题，你需要在你的 <code>pom.xml</code> 文件中显式地引入 <code>commons-pool2</code> 的依赖，这样它才会被正确地加载。</p></blockquote></li></ul>',1),r=(0,n.Fv)('<p>​</p><ul><li><h4 id="打包jar指定名字" tabindex="-1"><a class="header-anchor" href="#打包jar指定名字"><span>打包jar指定名字</span></a></h4><ul><li><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">build</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">   &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">finalName</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;webjava8&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">finalName</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><h4 id="dependency-scope" tabindex="-1"><a class="header-anchor" href="#dependency-scope"><span>dependency scope</span></a></h4></li></ul><p>场景: 学Spring全家桶, 代码要用 h2 jar里的 API</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;com.h2database&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;h2&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">&lt;!--            import org.h2.tools.Server;   如果这里不注释掉，开发时候导包不进--&gt;</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">&lt;!--            &lt;scope&gt;runtime&lt;/scope&gt;--&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">        &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p>XD: 我理解很多module的项目，其中一个module引入了<code>mybatis-plus-boot-starter</code>。那么其他module就算用到了它也只要引入的时候<code>&lt;scope&gt;provided&lt;/scope&gt;</code>一下。避免Maven打包臃肿？</p><p>Bingo：</p><p>嗯，你的理解是正确的！在一个多模块项目中，如果只有一个模块需要使用<code>mybatis-plus-boot-starter</code>，而其他模块也需要使用它提供的功能，你可以通过在其他模块中将依赖的作用域设置为<code>&lt;scope&gt;provided&lt;/scope&gt;</code>来避免Maven打包结果臃肿。</p><p>通过将依赖的作用域设置为<code>provided</code>，Maven在编译和测试阶段会将依赖包含在类路径中，以便在编译代码和执行测试时使用。但在部署和运行阶段，Maven会将这些依赖排除在最终的构建结果中。</p><p>这样做的好处是，避免了将重复的依赖打包到每个模块中，减小了最终构建结果的大小。同时，由于<code>mybatis-plus-boot-starter</code>依赖通常是由一个模块来提供运行时环境，其他模块可以依赖于该模块来获取<code>mybatis-plus-boot-starter</code>的功能，而不需要自己打包这些依赖。</p><p>需要注意的是，这种使用方式需要确保在部署和运行时提供正确的运行时环境，以便其他模块能够正常使用<code>mybatis-plus-boot-starter</code>提供的功能。</p><p>当把Maven中的<code>&lt;scope&gt;provided&lt;/scope&gt;</code>应用于一个依赖时，它代表着你期望该依赖在运行时环境中被提供，比如Web容器或应用服务器。简而言之，它告诉Maven在编译和打包项目时不需要将这个依赖包含进来，因为它将在运行时环境中被提供。</p><p>这种依赖通常是一些容器或框架提供的，比如Servlet API或Java EE容器的实现。它们已经存在于运行时环境中，不需要在你的应用程序中显式地包含它们。</p><p>举个例子，如果你正在开发一个基于Java EE的Web应用程序，并且使用了Servlet API，你可以将Servlet API作为一个<code>provided</code>依赖。这样，Maven在编译和打包你的应用程序时不会包含Servlet API的jar文件，因为它将在Java EE容器中提供。</p><blockquote><p>Q: 构建和打包项目时为什么要排除MyBatis-Plus框架，但是项目代码又要用</p></blockquote><p>A: 哦，我明白你的疑惑了。在构建和打包项目时排除MyBatis-Plus框架，但又在项目代码中使用它，通常是出于以下几个原因：</p><p>减小部署包的大小： MyBatis-Plus框架是一个较大的依赖，它包含了许多功能和类库。如果将MyBatis-Plus框架打包到部署包中，会增加部署包的大小。通过将其排除在构建和打包过程之外，可以减小最终部署包的大小，提高部署效率。</p><p>运行时环境提供依赖： MyBatis-Plus框架通常是作为Java应用程序的依赖库使用的，而不是作为独立运行的应用程序。运行时环境（如Java EE容器）通常会提供MyBatis-Plus框架的依赖。因此，在构建和打包过程中排除MyBatis-Plus框架，可以依赖运行时环境提供的版本，避免冗余的依赖。</p><p>版本一致性控制： 通过排除MyBatis-Plus框架的构建和打包过程，你可以更好地控制所使用的框架版本。这样，你可以根据项目需求选择特定的版本，并确保项目代码与该版本兼容。</p><p>需要注意的是，在项目代码中使用MyBatis-Plus框架时，你需要确保项目的依赖管理正确配置，以便在编译和运行时引入MyBatis-Plus框架。你可以在项目的构建脚本（如Maven的pom.xml文件）中添加MyBatis-Plus框架的依赖，并确保它们在编译和运行时可用。</p>',20),d=(0,n.Fv)('<blockquote><p>公司Jar包 maven download source失败..判断依据：druid pom有以下两个标签，公司的没有</p></blockquote><ul><li>检查依赖项的 POM 文件：在 Maven 项目中，每个依赖项都有一个对应的 POM（Project Object Model）文件。你可以查看该依赖项的 POM 文件，查找是否有指定源码的相关配置。具体来说，检查 <code>&lt;build&gt;</code> 部分或 <code>&lt;plugins&gt;</code> 部分是否有配置相关的插件或属性来下载源码。</li></ul><h1 id="碰到的问题" tabindex="-1"><a class="header-anchor" href="#碰到的问题"><span>*）碰到的问题</span></a></h1><h4 id="could-not-transfer-artifact-maven-default-http-blocker-maven打包报错" tabindex="-1"><a class="header-anchor" href="#could-not-transfer-artifact-maven-default-http-blocker-maven打包报错"><span><a href="https://blog.csdn.net/Herringgg/article/details/126510647" target="_blank" rel="noopener noreferrer">*）Could not transfer artifact ***maven-default-http-blocker Maven打包报错</a></span></a></h4><p>场景：</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">POM File：</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">&lt;!--\t\t由于这里Maven Remote库用的是http方式，高版本的Maven好像只支持访问https</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">\t\t\t\t1.降低maven版本 现在的版本过高</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">\t\t\t\t2.将镜像仓库的地址改成https类型的;</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">\t\t\t\t3.如果以上两个都不合适可以更改maven中mirrors的配置 使它支持http的地址;--&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">\t\t&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">repository</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">\t\t\t&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;yigo&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">\t\t\t&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;http://dev.bokesoft.com:28089/nexus/content/groups/yigo-releases/&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">\t\t\t&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">snapshots</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">\t\t\t\t&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">enabled</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;false&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">enabled</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">\t\t\t&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">snapshots</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">\t\t&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">repository</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解决： setting.xml 中加</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirror</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;insecure-repo&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirrorOf</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;external:http:*&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirrorOf</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;http://ip:port/uri/&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">blocked</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;false&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">blocked</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirror</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">-----------即-----------</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirror</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;insecure-repo&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirrorOf</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;external:http:*&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirrorOf</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;http://dev.bokesoft.com:28089/nexus/content/groups/yigo-releases/&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">blocked</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;false&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">blocked</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#E06C75;">mirror</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="maven项目pom文件-和-setting文件都有那个标签repository。是不是这两个文件作用一样" tabindex="-1"><a class="header-anchor" href="#maven项目pom文件-和-setting文件都有那个标签repository。是不是这两个文件作用一样"><span>maven项目pom文件 和 setting文件都有那个标签repository。是不是这两个文件作用一样</span></a></h4><p>不，POM文件和settings文件中的<code>&lt;repository&gt;</code>标签具有不同的作用。</p><p>在Maven项目中，POM（Project Object Model）文件是项目的核心描述文件，它定义了项目的基本信息、依赖项、构建配置等。POM文件中的<code>&lt;repository&gt;</code>标签用于定义项目的仓库配置。仓库是Maven用于下载和管理项目依赖项的地方。通过在POM文件中定义<code>&lt;repository&gt;</code>标签，您可以指定要使用的仓库的位置、URL和其他相关信息。</p><p>另一方面，settings文件是Maven的全局配置文件，它位于Maven安装目录下的<code>conf</code>文件夹中，或者位于用户的<code>.m2</code>文件夹中。settings文件中的<code>&lt;repository&gt;</code>标签用于配置全局的仓库设置，这些设置将应用于所有Maven项目。通过设置文件中的<code>&lt;repository&gt;</code>标签，您可以配置Maven使用的默认仓库、镜像仓库、身份验证等。</p><p>因此，虽然POM文件和settings文件中的<code>&lt;repository&gt;</code>标签都涉及仓库配置，但它们的作用范围和使用方式不同。POM文件中的<code>&lt;repository&gt;</code>标签用于项目级别的仓库配置，而settings文件中的<code>&lt;repository&gt;</code>标签用于全局级别的仓库配置。</p><h2 id="依赖冲突" tabindex="-1"><a class="header-anchor" href="#依赖冲突"><span>依赖冲突</span></a></h2><p>TODO</p><ul><li>Maven 笔记 https://www.kuangstudy.com/bbs/1556855233068851202</li><li>最短路径原则: 两级以上的不同级依赖, 选择路径最短 声明优先原则 : 两级以上的同级依赖,先声明的覆盖后声明的 同级依赖后加载覆盖先加载原则</li></ul>',16),k={},o=(0,a(9874).A)(k,[["render",function(s,i){const a=(0,n.g2)("optional"),k=(0,n.g2)("scope");return(0,n.uX)(),(0,n.CE)("div",null,[e,(0,n.Lk)("ul",null,[t,(0,n.Lk)("li",null,[(0,n.Lk)("h4",l,[(0,n.Lk)("a",p,[(0,n.Lk)("span",null,[(0,n.bF)(a,null,{default:(0,n.k6)((()=>[(0,n.eW)("true")])),_:1})])])]),h])]),r,(0,n.Lk)("blockquote",null,[(0,n.Lk)("p",null,[(0,n.eW)("Q: mybatis-plus-boot-starter为什么能使用"),(0,n.bF)(k,null,{default:(0,n.k6)((()=>[(0,n.eW)("provided")])),_:1}),(0,n.eW)("，使打包不出问题")])]),(0,n.Lk)("p",null,[(0,n.eW)("嗯，mybatis-plus-boot-starter是一个用于集成MyBatis-Plus框架的Spring Boot Starter。它已经针对Spring Boot应用程序进行了特殊处理，使得在使用"),(0,n.bF)(k,null,{default:(0,n.k6)((()=>[(0,n.eW)("provided")])),_:1}),(0,n.eW)("时可以正常打包和部署，而不会出现问题。")]),(0,n.Lk)("p",null,[(0,n.eW)("这是因为mybatis-plus-boot-starter内部已经配置了Spring Boot的自动配置和依赖解析。它会自动检测和加载所需的依赖项，并在应用程序启动时进行适当的配置。这意味着，即使使用了"),(0,n.bF)(k,null,{default:(0,n.k6)((()=>[(0,n.eW)("provided")])),_:1}),(0,n.eW)("排除了mybatis-plus-boot-starter的依赖，Spring Boot仍然能够正确地加载和使用MyBatis-Plus框架。")]),(0,n.Lk)("p",null,[(0,n.eW)("在使用mybatis-plus-boot-starter时，你可以将"),(0,n.bF)(k,null,{default:(0,n.k6)((()=>[(0,n.eW)("provided")])),_:1}),(0,n.eW)("应用于其他与运行时环境相关的依赖，例如Servlet API、JSP API等。这样，这些依赖将由运行时环境提供，并不会被打包到最终的构建结果中。")]),(0,n.Lk)("p",null,[(0,n.eW)("需要注意的是，尽管mybatis-plus-boot-starter在使用"),(0,n.bF)(k,null,{default:(0,n.k6)((()=>[(0,n.eW)("provided")])),_:1}),(0,n.eW)("时可以正常工作，但你仍然需要确保在部署和运行时，适当的运行时环境提供了MyBatis-Plus框架所")]),d])}]]),c=JSON.parse('{"path":"/code/ZOther/Maven.html","title":"Maven","lang":"zh-CN","frontmatter":{"article":false,"description":"Maven 鱼皮这篇讲的细：https://mp.weixin.qq.com/s/mOFjOVYrM_b9I2UlNgeGxg mvn clean package -Dmaven.test.skip TODO https://blog.csdn.net/weixin_45433031/article/details/125284806 （还需理解到ma...","head":[["meta",{"property":"og:url","content":"https://zzq8.cn/code/ZOther/Maven.html"}],["meta",{"property":"og:site_name","content":"Piglet"}],["meta",{"property":"og:title","content":"Maven"}],["meta",{"property":"og:description","content":"Maven 鱼皮这篇讲的细：https://mp.weixin.qq.com/s/mOFjOVYrM_b9I2UlNgeGxg mvn clean package -Dmaven.test.skip TODO https://blog.csdn.net/weixin_45433031/article/details/125284806 （还需理解到ma..."}],["meta",{"property":"og:type","content":"website"}],["meta",{"property":"og:image","content":"https://images.zzq8.cn/img/202210171022851.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"Piglet"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"WebPage\\",\\"name\\":\\"Maven\\",\\"description\\":\\"Maven 鱼皮这篇讲的细：https://mp.weixin.qq.com/s/mOFjOVYrM_b9I2UlNgeGxg mvn clean package -Dmaven.test.skip TODO https://blog.csdn.net/weixin_45433031/article/details/125284806 （还需理解到ma...\\"}"]]},"headers":[{"level":2,"title":"TODO","slug":"todo","link":"#todo","children":[]},{"level":2,"title":"依赖冲突","slug":"依赖冲突","link":"#依赖冲突","children":[]}],"git":{"createdTime":1712997543000,"contributors":[{"name":"Fighting","email":"1024zzq@gmail.com","commits":2},{"name":"MiniPC","email":"1024zzq@gmail.com","commits":1}]},"readingTime":{"minutes":10.38,"words":3114},"filePathRelative":"code/ZOther/Maven.md","localizedDate":"2024年4月13日","excerpt":"\\n<blockquote>\\n<p>鱼皮这篇讲的细：https://mp.weixin.qq.com/s/mOFjOVYrM_b9I2UlNgeGxg</p>\\n<p>mvn clean package -Dmaven.test.skip</p>\\n</blockquote>","autoDesc":true}')}}]);