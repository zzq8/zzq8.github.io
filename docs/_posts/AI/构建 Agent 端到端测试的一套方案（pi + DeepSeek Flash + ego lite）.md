---
category: repost
tag: ai
---



# 构建 Agent 端到端测试的一套方案（pi + DeepSeek Flash + ego lite）

> 作者：黄同学h (@huangtongxueh) · 发布于 2026-10-12 · 原文链接：https://x.com/huangtongxueh/status/2109687887264681986

---

跟大家分享一下我构建Agent端到端测试的一套方案：
**pi + DeepSeek Flash + ego lite**
主要用来完成日常开发的自动化测试

简单来说：

1. ego lite：负责实际操作浏览器，包括页面交互、状态读取和结果验证，开源，可以丝滑导入你的chrome配置
2. pi：作为 Agent Harness，负责整个任务的执行和工具调度，开源，你完全可以基于你的业务测试需求二开
3. DeepSeek v4.1 Flash：tps很高的模型，调用成本很低，提高自动化测试的效率

比较方便的是，不需要提前写一整套 Playwright 脚本，直接用自然语言描述测试流程，就可以让 Agent 自动完成页面操作、检查结果。固定的一些sop可以直接沉淀为skill

我拿实际开发过程中的三类 Web UI 任务做了一轮小规模测试，包括信息查询、多轮交互、状态修改及持久化验证对比了几套不同的 Agent + Model + Browser 组合，附了张脱敏后的测试对比图，大家可以参考一下。

![测试对比图](https://pbs.twimg.com/media/HUcd8IDbEAEwWQg.jpg)

ego lite这个产品的构建理念我还蛮喜欢的：

1. 共享登录的浏览器状态
2. agent友好的设计
3. 并行多任务处理的优化

而且它给了蛮多的最佳实践，比如：

1. 抓取并聚合社交媒体帖子
2. 自动查找并申请职位
3. 自动投递简历

如果你有一些idea，完全可以把它嵌入到你的工作流
搭配上pi + deepseek flash，实现速度+成本上的提升

最重要的是还开源，完全可以基于自己的需求做一些定制化开发。美中不足的是只支持mac，windows系统的小伙伴可以再等等。
