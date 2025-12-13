---
article: false
updated: 2025-11-25 23:14:04
---
# VuePress Theme Hope

> 一个具有强大功能的 vuepress 主题✨
>
> 之前我是用 Docify 做自己的 ==笔记 静态网站==
>
> 但是 1）没有笔记目录 2）而且 JavaGuide 逛多了 希望搞个一样的
>
> 后续：发现一个[大佬](https://newzone.top/web/docsify.html)

## CDN

algolia actions脚本报错：**514 frequency capped**

需要 CDN 配置开启 HTTPS

## GitPage

设置自己的域名：只需要 DNS 解析给 2 个 CNAME 记录就行（顶级域名）

二级域名估计只要一个 CNAME 就行

记录值： zzq8.github.io.

虽然这个记录值是 404 没关系，DNS 设置到这就行！

## Feature

* md 里面可以写 js+vue 语法 会渲染到页面   具体参考demo     【真牛】
* md 加 frontmatter 设置各种参数 icon、title

## search plug

> 引入algolia并自定义crawler爬虫
>
> XDDD 终于两天时间，配置这里"lang"解决问题！！！

**处理了两天的问题**：已用 actions 爬虫 上传站点信息的 records 到 Algolia 平台，但是 vuepress 集成的这个插件去搜怎么都搜不到，其他测试平台地方一下就可以搜：https://codesandbox.io/p/sandbox/suspicious-nash-xfpsjv?file=%2Fsrc%2Findex.js%3A11%2C1

后来发现 vuepress 搜的时候会多带一个参数 lang：https://juejin.cn/post/7160948190375018504

最后的最后解决是处理修改上传的爬虫配置，让 records 带上 lang 信息即可，这一点我搜 GPT 帮我带错了很多次。还是在一个网站多试了别人的才成功：https://hub.nstudy.org/p2024/12/Vuepress/148a1e.html

## sitemap plug

> 搞了一下午，卡在版本的问题    结果我就在npm一个个试所有的version   直到不报错！！！   ==肯定有其他方法==
>
> 第二次搞：
>
> > * npm install 没报错
> >
> > * 测试时候先测 `npm run docs:build` 后测 `npm run docs:dev` 两个都没问题就行
>
> 1. 先所有都整成最新版 `npm install --legacy-peer-deps`
> 2. 后再试试 npm install 哪些依赖冲突（npm ci）
>    * 我这里是 vuepress、vuepress-theme-hope 统一降一个版本就又好了

http://localhost:8080/sitemap.xml

这个插件 npm install 完后不需要配什么东西，可以直接访问试下就拿到数据了！！！

## 碰到的问题

> md 笔记该怎么记：因为自己的一篇 md 会有很多 h1 

看了 雪峰的 git 仓有一些规范，



> 构建 md 解析错误

`{brandId,showStatus}`

这种 vuepress 解析会有错误，，最好``包一下



😭 为什么，上面一开始我没加导致又报错，又犯了一次错误

​	1.	**Vue 模板语法冲突**：VuePress 使用 Vue 作为底层框架，Vue 模板语法中的大括号 {} 会被识别为 Vue 模板中的插值表达式。如果你的 Markdown 文件中包含 {}，Vue 可能会尝试解析它们，这会导致渲染问题。

​	2.	**未转义的大括号**：如果你的 Markdown 文件中包含原始的大括号 {}，这些字符可能需要转义，避免被 Vue 模板引擎解析。
