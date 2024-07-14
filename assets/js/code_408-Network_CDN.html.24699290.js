"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[9645],{9874:(e,t)=>{t.A=(e,t)=>{const a=e.__vccOpts||e;for(const[e,n]of t)a[e]=n;return a}},6027:(e,t,a)=>{a.r(t),a.d(t,{comp:()=>r,data:()=>i});var n=a(2360);const l=[(0,n.Fv)('<h1 id="cdn" tabindex="-1"><a class="header-anchor" href="#cdn"><span>CDN</span></a></h1><blockquote><p>感觉怪怪的还是没搞好，先就这么用着吧。好像网站貌似变快了？！</p><p><a href="https://www.17ce.com/site" target="_blank" rel="noopener noreferrer">测速网站</a></p><p>还是得看官方文档，搞了一天端午加一周的晚上时间看别人二手文章描述又描述不清！！混淆我！！！！突然开窍看了眼官网描述，草 原来是这个意思：</p><p>回源 HOST 即回源域名，CDN 节点在回源时，能够指定访问的源站 IP 地址下具体的站点域名。当您的源站只有一个和加速域名一致的站点，默认为加速域名即可，若源站为 COS 源或第三方对象存储时，回源 HOST 不可修改，控制台默认为回源地址。</p><p>说明： 什么是 CDN 回源 HOST 配置? 回源 HOST 是指加速域名在 CDN 节点回源过程指向源访问的站点域名，若您在源站服务器内同时部署了若干个 Web 站点，配置正确的回源 HOST 可以帮助您顺利访问指定的站点域名。</p></blockquote><h2 id="目前配置" tabindex="-1"><a class="header-anchor" href="#目前配置"><span>目前配置</span></a></h2><h4 id="dns-设置" tabindex="-1"><a class="header-anchor" href="#dns-设置"><span>DNS 设置</span></a></h4><table><thead><tr><th>类型</th><th>名称</th><th>值</th></tr></thead><tbody><tr><td>CNAME</td><td>www</td><td>zzq8.github.io.</td></tr><tr><td>CNAME</td><td>@</td><td>zzq8.github.io.</td></tr></tbody></table><h4 id="cdn-设置" tabindex="-1"><a class="header-anchor" href="#cdn-设置"><span>CDN 设置</span></a></h4><ul><li><strong>CDN加速域名</strong>: <code>zzq8.cn</code></li><li><strong>CDN配置的源站地址</strong>: <code>github 4 个 ip 地址</code></li><li><strong>CDN配置的回源HOST</strong>: <code>zzq8.cn</code></li></ul><h4 id="github-pages-设置" tabindex="-1"><a class="header-anchor" href="#github-pages-设置"><span>GitHub Pages 设置</span></a></h4><ul><li><strong>自定义域名</strong>: <code>zzq8.cn</code></li><li><strong>强制HTTPS</strong>: 启用</li></ul><p><mark>总结：@ CNAME到zzq8.github.io.而不是CDN给的域名 很奇怪，但却是达到效果貌似</mark></p><h2 id="记录类型" tabindex="-1"><a class="header-anchor" href="#记录类型"><span>记录类型</span></a></h2><blockquote><p>尽管直接在根域名上使用 CNAME 记录是违反 DNS 标准的，但通过使用 A 记录、URL 转发、ALIAS/ANAME 记录或 CNAME Flattening 等技术，可以实现类似的效果。具体选择取决于你的 DNS 提供商支持的功能。</p></blockquote><p>在域名配置中，CNAME记录和A记录是两种常见的DNS记录类型，它们的功能和用途有显著区别。以下是对这两种记录的详细解释：</p><h3 id="a记录-address-record" tabindex="-1"><a class="header-anchor" href="#a记录-address-record"><span>A记录（Address Record）</span></a></h3><ul><li><p><strong>用途</strong>：A记录用于将域名直接映射到一个IP地址。</p></li><li><p><strong>格式</strong>：<code>host.example.com -&gt; 192.0.2.1</code></p></li><li><p><strong>使用场景</strong>：适用于将域名直接指向服务器的IP地址。例如，如果您的服务器IP地址是 <code>192.0.2.1</code>，您可以创建一条A记录将 <code>www.example.com</code> 指向该IP地址。</p></li><li><p>优点</p><ul><li>直接指向IP地址，解析速度快。</li><li>简单明了，适用于指向静态IP的情况。</li></ul></li><li><p>缺点</p><ul><li>如果服务器IP地址改变，需要手动更新A记录。</li></ul></li></ul><h3 id="cname记录-canonical-name-record" tabindex="-1"><a class="header-anchor" href="#cname记录-canonical-name-record"><span>CNAME记录（Canonical Name Record）</span></a></h3><ul><li><p><strong>用途</strong>：CNAME记录用于将一个域名别名指向另一个域名。</p></li><li><p><strong>格式</strong>：<code>alias.example.com -&gt; canonical.example.com</code></p></li><li><p><strong>使用场景</strong>：适用于将一个子域名指向另一个域名。例如，如果您想将 <code>blog.example.com</code> 指向 <code>example-blog.com</code>，您可以创建一条CNAME记录。</p></li><li><p>优点</p><ul><li>便于维护。如果目标域名的IP地址改变，您只需要更新目标域名的记录，而不需要更改CNAME记录。</li><li>适用于负载均衡和CDN配置，因为这些服务通常会提供一个域名作为入口。</li></ul></li><li><p>缺点</p><ul><li>解析速度可能稍慢，因为需要额外的一次DNS查询。</li><li><mark>不允许将根域名（如 <code>example.com</code>）配置为CNAME记录，只能用于子域名。</mark><ul><li>xd 实测可以啊，不要信！！！</li></ul></li></ul></li></ul><p>参考：https://www.mcoder.cc/2019/12/27/use_cdn_in_github_pages/</p>',18)],o={},r=(0,a(9874).A)(o,[["render",function(e,t){return(0,n.uX)(),(0,n.CE)("div",null,l)}]]),i=JSON.parse('{"path":"/code/408-Network/CDN.html","title":"CDN","lang":"zh-CN","frontmatter":{"article":true,"tags":"Network","date":"2024-06-29T00:00:00.000Z","description":"CDN 感觉怪怪的还是没搞好，先就这么用着吧。好像网站貌似变快了？！ 测速网站 还是得看官方文档，搞了一天端午加一周的晚上时间看别人二手文章描述又描述不清！！混淆我！！！！突然开窍看了眼官网描述，草 原来是这个意思： 回源 HOST 即回源域名，CDN 节点在回源时，能够指定访问的源站 IP 地址下具体的站点域名。当您的源站只有一个和加速域名一致的站点...","head":[["meta",{"property":"og:url","content":"https://zzq8.cn/code/408-Network/CDN.html"}],["meta",{"property":"og:site_name","content":"Piglet"}],["meta",{"property":"og:title","content":"CDN"}],["meta",{"property":"og:description","content":"CDN 感觉怪怪的还是没搞好，先就这么用着吧。好像网站貌似变快了？！ 测速网站 还是得看官方文档，搞了一天端午加一周的晚上时间看别人二手文章描述又描述不清！！混淆我！！！！突然开窍看了眼官网描述，草 原来是这个意思： 回源 HOST 即回源域名，CDN 节点在回源时，能够指定访问的源站 IP 地址下具体的站点域名。当您的源站只有一个和加速域名一致的站点..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"Piglet"}],["meta",{"property":"article:published_time","content":"2024-06-29T00:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"CDN\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-06-29T00:00:00.000Z\\",\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Piglet\\",\\"url\\":\\"https://zzq8.cn\\"}]}"]]},"headers":[{"level":2,"title":"目前配置","slug":"目前配置","link":"#目前配置","children":[]},{"level":2,"title":"记录类型","slug":"记录类型","link":"#记录类型","children":[{"level":3,"title":"A记录（Address Record）","slug":"a记录-address-record","link":"#a记录-address-record","children":[]},{"level":3,"title":"CNAME记录（Canonical Name Record）","slug":"cname记录-canonical-name-record","link":"#cname记录-canonical-name-record","children":[]}]}],"git":{"createdTime":1719634148000,"contributors":[{"name":"Fighting","email":"1024zzq@gmail.com","commits":3},{"name":"MiniPC","email":"1024zzq@gmail.com","commits":1}]},"readingTime":{"minutes":2.74,"words":821},"filePathRelative":"code/408-Network/CDN.md","localizedDate":"2024年6月29日","excerpt":"\\n<blockquote>\\n<p>感觉怪怪的还是没搞好，先就这么用着吧。好像网站貌似变快了？！</p>\\n<p><a href=\\"https://www.17ce.com/site\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">测速网站</a></p>\\n<p>还是得看官方文档，搞了一天端午加一周的晚上时间看别人二手文章描述又描述不清！！混淆我！！！！突然开窍看了眼官网描述，草  原来是这个意思：</p>\\n<p>回源 HOST\\n即回源域名，CDN 节点在回源时，能够指定访问的源站 IP 地址下具体的站点域名。当您的源站只有一个和加速域名一致的站点，默认为加速域名即可，若源站为 COS 源或第三方对象存储时，回源 HOST 不可修改，控制台默认为回源地址。</p>\\n<p>说明：\\n什么是 CDN 回源 HOST 配置?\\n回源 HOST 是指加速域名在 CDN 节点回源过程指向源访问的站点域名，若您在源站服务器内同时部署了若干个 Web 站点，配置正确的回源 HOST 可以帮助您顺利访问指定的站点域名。</p>\\n</blockquote>","autoDesc":true}')}}]);