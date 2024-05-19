import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as i,o as t,c as l,e as n,f as s,b as c,a as o}from"./app-CO44V6-k.js";const d={},p=n("h1",{id:"nginx",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#nginx"},[n("span",null,"Nginx")])],-1),r={href:"https://www.kuangstudy.com/bbs/1377454518035292162",target:"_blank",rel:"noopener noreferrer"},u=n("p",null,"Nginx 三大作用：1）动静分离 2）反向代理 3）负载均衡",-1),v=n("p",null,[s("特点：一旦启动永远不需要重启，但是我们需要重新加载配置文件 "),n("code",null,"nginx -s reload")],-1),m=o(`<p>常用配置：Nginx 代理后会丢失很多东西，比如 host.. 也可以使用 nginx 设置每一个请求的唯一 id</p><p><strong>nginx server_name 多个的话，空格隔开就行</strong> 恰好nginx -t检查不会报错。 跟其它配置混一起，感觉有时生效，有时不生效，排查了好久。现在看来是nginx把 “a.example.com,”当成匹配规则了。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment">#主配置文件</span>
http<span class="token punctuation">{</span>
    <span class="token comment">#添加其他配置，注意分号不要丢</span>
   	 include /etc/nginx/conf.d/*.conf<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    
<span class="token comment">#其它配置</span>
server <span class="token punctuation">{</span>
    listen       <span class="token number">80</span><span class="token punctuation">;</span>
    server_name  1024zzq.com<span class="token punctuation">;</span>
    location / <span class="token punctuation">{</span>
        proxy_pass   http://101.34.55.204:8080<span class="token punctuation">;</span>
        index  index.html index.htm<span class="token punctuation">;</span>
        proxy_set_header Host <span class="token variable">$host</span><span class="token punctuation">;</span>
        proxy_set_header X-Real-Ip <span class="token variable">$remote_addr</span><span class="token punctuation">;</span>
        proxy_set_header X-Forwarded-For <span class="token variable">$remote_addr</span><span class="token punctuation">;</span>
		<span class="token comment">#proxy_set_header X-Request-Id $request_id;</span>
    <span class="token punctuation">}</span>
<span class="token comment">#    access_log /logs/1024.zzq.com.access.log;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="一、反向代理" tabindex="-1"><a class="header-anchor" href="#一、反向代理"><span>一、反向代理</span></a></h2><h3 id="正向代理-vs-反向代理-的概念" tabindex="-1"><a class="header-anchor" href="#正向代理-vs-反向代理-的概念"><span>正向代理 vs 反向代理 的概念</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>    正向代理：例如翻墙软件，客户端请求到香港的一台服务器，由这台服务器再请求到美国等其它被墙地区的服务器。
    代理客户端的
        客户端 <span class="token operator">--</span> 代理服务器 <span class="token operator">--</span> 目标服务器
        
        
    反向代理：例如百度的服务器肯定不止一台，你会先访问到代理服务器再给你决定具体让你到哪一台服务器拿数据
    代理服务器端的
    
    反向代理（<span class="token class-name">Reverse</span> <span class="token class-name">Proxy</span>）方式是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个服务器。

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正向代理：（翻墙）</p><figure><img src="https://kuangstudy.oss-cn-beijing.aliyuncs.com/bbs/2021/01/25/kuangstudy46bdad36-d3e0-43b0-a223-43360b7e8fc7.png" alt="正向代理" tabindex="0" loading="lazy"><figcaption>正向代理</figcaption></figure><p>反向代理：（百度）</p><figure><img src="https://kuangstudy.oss-cn-beijing.aliyuncs.com/bbs/2021/01/25/kuangstudy62a15097-6e2a-4dbe-bcf5-f0d7cab81089.png" alt="反向代理" tabindex="0" loading="lazy"><figcaption>反向代理</figcaption></figure><h2 id="二、负载均衡" tabindex="-1"><a class="header-anchor" href="#二、负载均衡"><span>二、负载均衡</span></a></h2><blockquote><p>session问题：SpringCache+Redis 保存Cookie解决</p></blockquote><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>upstream lb<span class="token punctuation">{</span>
    server <span class="token number">127.0</span><span class="token number">.0</span><span class="token number">.1</span><span class="token operator">:</span><span class="token number">8080</span> weight<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span>
    server <span class="token number">127.0</span><span class="token number">.0</span><span class="token number">.1</span><span class="token operator">:</span><span class="token number">8081</span> weight<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
location <span class="token operator">/</span> <span class="token punctuation">{</span>
    proxy_pass http<span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>lb<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、动静分离" tabindex="-1"><a class="header-anchor" href="#三、动静分离"><span>三、动静分离</span></a></h2><blockquote><p>有错误不要蒙头瞎搞，瞎百度。先凝练自己的问题。 第一步是查 log 我就是靠这个分析出了错误！</p><p>问题：假如项目没用Thymeleaf 用的vue 是不是就不需要nginx处理动静分离了</p></blockquote><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>upstream gulimall { 
	server 127.0.0.1:88;
}

include conf.d/*.conf;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>server {
    listen       80;
    server_name  *.gulimall.com;
    location /static {
        root html;
    }

    location / { 
      proxy_set_header Host $host; 
      proxy_pass http://gulimall;  
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、其它用途" tabindex="-1"><a class="header-anchor" href="#四、其它用途"><span>四、其它用途</span></a></h2><p>access.log</p><p>看过一篇订阅号，可以通过这个访问日志拿到所有访问者的ip地址 然后写脚本进行限制恶意访问</p><h2 id="五、配置详解" tabindex="-1"><a class="header-anchor" href="#五、配置详解"><span>五、配置详解</span></a></h2><h3 id="_5-1-root-alias" tabindex="-1"><a class="header-anchor" href="#_5-1-root-alias"><span>5.1.root &amp; alias</span></a></h3><blockquote><p>场景：想搭建本地静态资源Web服务器</p><p>在Nginx中，<code>root</code> 和 <code>alias</code> 都是用于定义服务器上的文件路径的指令，但它们之间存在一些区别。</p></blockquote><p><code>root</code> 指令用于定义一个目录作为请求的根目录。当一个请求到达时，Nginx将在指定的根目录下查找相应的文件。以下是一个示例：</p><div class="language-nginx line-numbers-mode" data-ext="nginx" data-title="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server_name</span> example.com</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">root</span> /var/www/html</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的配置中，当用户访问 <code>example.com</code> 时，Nginx将在 <code>/var/www/html</code> 目录下查找相应的文件并返回给用户。如果用户请求的URI是 <code>/index.html</code>，Nginx将尝试找到并返回 <code>/var/www/html/index.html</code> 文件。</p><p><code>alias</code> 指令用于指定一个别名路径，它用于将请求映射到文件系统中的不同位置，而不是直接将请求与根目录进行拼接。以下是一个示例：</p><div class="language-nginx line-numbers-mode" data-ext="nginx" data-title="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server_name</span> example.com</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">location</span> /static/</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">alias</span> /var/www/static/</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的配置中，当用户访问 <code>example.com/static/file.txt</code> 时，Nginx将在 <code>/var/www/static/</code> 目录下查找相应的文件并返回给用户。与 <code>root</code> 不同的是，<code>alias</code> 可以指定一个不同于URI的文件系统路径。（<mark>记得alias最后要带上 /</mark>）</p><p>总结一下：</p><ul><li><code>root</code> 指令指定的路径是与URI拼接的，适用于将请求直接映射到文件系统路径。</li><li><code>alias</code> 指令指定了一个别名路径，用于将请求映射到文件系统中的不同位置。</li></ul><p>实践：特喵的感觉一样的效果</p><div class="language-nginx line-numbers-mode" data-ext="nginx" data-title="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token comment">#root   html;</span>
            <span class="token comment">#root /Users/xd/Documents/GitRepo/StudyNotes;</span>
            <span class="token directive"><span class="token keyword">alias</span> /Users/xd/Documents/GitRepo/StudyNotes/</span><span class="token punctuation">;</span>    <span class="token comment">#不加 / 会访问不到</span>
            <span class="token directive"><span class="token keyword">index</span>  index.html index.htm</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>https://www.cnblogs.com/qingshan-tang/p/12763522.html</p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code>五.重点

　　重点是理解alias与root的区别，root与alias主要区别在于nginx如何解释location后面的uri，这使两者分别以不同的方式将请求映射到服务器文件上。

　　alias（别名）是一个目录别名。

　　　　例子：

　　　　　　location /<span class="token number">123</span>/abc/ <span class="token punctuation">{</span>

　　　　　　　　root /ABC;
　　　　　　<span class="token punctuation">}</span>
　　　　　　当请求http<span class="token operator">:</span><span class="token comment">//qingshan.com/123/abc/logo.png时，会返回 /ABC/123/abc/logo.png文件，即用/ABC 加上 /123/abc。</span>
 

 

　　root（根目录）是最上层目录的定义。

例子：

　　　　　　location /<span class="token number">123</span>/abc/ <span class="token punctuation">{</span>

　　　　　　　　alias /ABC;
　　　　　　<span class="token punctuation">}</span>
　　　　　　当请求http<span class="token operator">:</span><span class="token comment">//qingshan.com/123/abc/logo.png时，会返回 /ABC/logo.png文件，即用/ABC替换 /123/abc。</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,35);function b(g,k){const a=i("ExternalLinkIcon");return t(),l("div",null,[p,n("blockquote",null,[n("p",null,[n("a",r,[s("狂神Nginx学习笔记"),c(a)])]),u,v]),m])}const y=e(d,[["render",b],["__file","Nginx.html.vue"]]),_=JSON.parse('{"path":"/studynotes/408-Network/Nginx.html","title":"Nginx","lang":"zh-CN","frontmatter":{"description":"Nginx 狂神Nginx学习笔记 Nginx 三大作用：1）动静分离 2）反向代理 3）负载均衡 特点：一旦启动永远不需要重启，但是我们需要重新加载配置文件 nginx -s reload 常用配置：Nginx 代理后会丢失很多东西，比如 host.. 也可以使用 nginx 设置每一个请求的唯一 id nginx server_name 多个的话，...","head":[["meta",{"property":"og:url","content":"https://doc.zzq8.cn/studynotes/408-Network/Nginx.html"}],["meta",{"property":"og:site_name","content":"Zz"}],["meta",{"property":"og:title","content":"Nginx"}],["meta",{"property":"og:description","content":"Nginx 狂神Nginx学习笔记 Nginx 三大作用：1）动静分离 2）反向代理 3）负载均衡 特点：一旦启动永远不需要重启，但是我们需要重新加载配置文件 nginx -s reload 常用配置：Nginx 代理后会丢失很多东西，比如 host.. 也可以使用 nginx 设置每一个请求的唯一 id nginx server_name 多个的话，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://kuangstudy.oss-cn-beijing.aliyuncs.com/bbs/2021/01/25/kuangstudy46bdad36-d3e0-43b0-a223-43360b7e8fc7.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-08T15:48:18.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-08T15:48:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Nginx\\",\\"image\\":[\\"https://kuangstudy.oss-cn-beijing.aliyuncs.com/bbs/2021/01/25/kuangstudy46bdad36-d3e0-43b0-a223-43360b7e8fc7.png\\",\\"https://kuangstudy.oss-cn-beijing.aliyuncs.com/bbs/2021/01/25/kuangstudy62a15097-6e2a-4dbe-bcf5-f0d7cab81089.png\\"],\\"dateModified\\":\\"2024-05-08T15:48:18.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"一、反向代理","slug":"一、反向代理","link":"#一、反向代理","children":[{"level":3,"title":"正向代理 vs 反向代理 的概念","slug":"正向代理-vs-反向代理-的概念","link":"#正向代理-vs-反向代理-的概念","children":[]}]},{"level":2,"title":"二、负载均衡","slug":"二、负载均衡","link":"#二、负载均衡","children":[]},{"level":2,"title":"三、动静分离","slug":"三、动静分离","link":"#三、动静分离","children":[]},{"level":2,"title":"四、其它用途","slug":"四、其它用途","link":"#四、其它用途","children":[]},{"level":2,"title":"五、配置详解","slug":"五、配置详解","link":"#五、配置详解","children":[{"level":3,"title":"5.1.root & alias","slug":"_5-1-root-alias","link":"#_5-1-root-alias","children":[]}]}],"git":{"createdTime":1712997543000,"updatedTime":1715183298000,"contributors":[{"name":"Fighting","email":"1024zzq@gmail.com","commits":1},{"name":"MiniPC","email":"1024zzq@gmail.com","commits":1}]},"readingTime":{"minutes":3.96,"words":1187},"filePathRelative":"studynotes/408-Network/Nginx.md","localizedDate":"2024年4月13日","autoDesc":true}');export{y as comp,_ as data};
