---
article: 
category: 
tag: 
created: 2026-01-10 17:09:05
updated: 2026-01-12 23:48:29
---

# 多线程最佳实践

写脚本(Get 抓平台的接口获取全量的工作流信息, 筛选指定node的 systemp_prompt) 碰到的两个问题思考:

1. 线程池怎么配
2. 网络请求怎么快

```mermaid
mindmap
	Experience
		id)ThreadPoolExecutor(
		asyncHttpGet
```