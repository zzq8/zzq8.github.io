# VuePress Theme Hope

> 一个具有强大功能的 vuepress 主题✨
>
> 之前我是用 Docify 做自己的 ==笔记 静态网站==
>
> 但是 1）没有笔记目录 2）而且 JavaGuide 逛多了 希望搞个一样的

## 引入algolia并自定义crawler爬虫

**处理了两天的问题**：已用 actions 爬虫 上传站点信息的 records 到 Algolia 平台，但是 vuepress 集成的这个插件去搜怎么都搜不到，其他测试平台地方一下就可以搜：https://codesandbox.io/p/sandbox/suspicious-nash-xfpsjv?file=%2Fsrc%2Findex.js%3A11%2C1

后来发现 vuepress 搜的时候会多带一个参数 lang：https://juejin.cn/post/7160948190375018504

最后的最后解决是处理修改上传的爬虫配置，让 records 带上 lang 信息即可，这一点我搜 GPT 帮我带错了很多次。还是在一个网站多试了别人的才成功：https://hub.nstudy.org/p2024/12/Vuepress/148a1e.html



XDDD 终于两天时间，配置这里"lang"解决问题！！！

## 碰到的问题

> md 笔记该怎么记：因为自己的一篇 md 会有很多 h1 

看了 雪峰的 git 仓有一些规范，



> 构建 md 解析错误

{brandId,showStatus}

这种 vuepress 解析会有错误，，最好``包一下