# 金蝶 Java 后端校招三面面经（已OC，附参考答案）

一位球友的金蝶面试经历，已经拿到了 offer，不过，后面因为觉得公司的风评不好就拒掉了。

金蝶的总体面试难度一般，可以说算是比较简单的了，问的东西不深。

下面每一个问题我几乎都给出了对应的参考资料，方便学习参考。有很多同学要说了：“为什么不直接给出具体答案呢？”。主要原因有如下两点：

1. 参考资料解释的要更详细一些，还可以顺便让你把相关的知识点复习一下。
2. 给出的参考资料基本都是我的原创，假如后续我想对面试问题的答案进行完善，就不需要挨个把之前的面经写的答案给修改了（面试中的很多问题都是比较类似的）。当然了，我的原创文章也不太可能覆盖到面试的每个点，部面试问题的答案，我是精选的其他技术博主写的优质文章，文章质量都很高。

## 一面

1. 自我介绍
2. 项目的架构图画一下
3. 项目是怎么部署到服务器的
4. 为什么要用 Docker？和虚拟机比有什么不同
5. 做项目的过程中遇到了什么问题没有，如何解决的，学到了什么。
6. 项目数据库表怎么设计的
7. 项目的日志怎么做的
8. 项目有没有做权限管理，怎么做的
9. 说一下自己对  IoC、AOP 的理解
10. Bean 的作用域有哪些，默认是哪一种
11. 常见的网络协议说一下
12. HTTP 状态码有哪些
13. 数据库优化
14. 有没有用过针对多表查询如何优化

答案：

* [如何画架构图？](https://www.zhihu.com/question/27440059)
* [一键部署 Spring Boot 到远程 Docker 容器](https://tobebetterjavaer.com/springboot/docker.html)
* [Docker核心概念总结](https://javaguide.cn/tools/docker/docker-intro.html)（顺便回顾一下 Docker 的基本概念和底层原理）
* [如何回答项目遇到什么困难，如何解决这类问题](https://t.zsxq.com/0dduy9CeQ)（[星球](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html)专属）
* [MySQL高性能优化规范建议总结](https://javaguide.cn/database/mysql/mysql-high-performance-optimization-specification-recommendations.html)（包含数据库表设计的一些规范）
* [9款日志管理工具对比，选型必备！](https://mp.weixin.qq.com/s/bi7xSuUYoV8Swht3gdrSXw)
* [权限系统设计详解](https://javaguide.cn/system-design/security/design-of-authority-system.html)（建议顺便看看 [JWT 和其他安全相关的内容](https://javaguide.cn/tag/%E5%AE%89%E5%85%A8/)）
* [Spring常见面试题总结](https://javaguide.cn/system-design/framework/spring/spring-knowledge-and-questions-summary.html#spring-ioc)
* [计算机网络常见面试题总结(上)](https://javaguide.cn/cs-basics/network/other-network-questions.html)
* 数据库优化：
  * [读写分离和分库分表常见问题总结](https://javaguide.cn/high-performance/read-and-write-separation-and-library-subtable.html)
  * [常见SQL优化手段总结](https://javaguide.cn/high-performance/sql-optimization.html)（[星球](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html)专属，在《Java面试指北》的技术面试题篇）

## HR面

1. 自我介绍
2. 学校的成绩，有没有获得过什么奖项
3. 介绍一下项目，业务情况，当时是怎么做这个项目的
4. 项目中充当的角色，负责做什么
5. 项目带给你最大的收获是什么
6. 说一件你在校园中做过对自己来说最有价值的事情
7. 你觉得一个好的开发工程师应该具备怎样的素质
8. 平时有健身运动的习惯么，频率怎么样
9. 讲讲你的个人优势
10. 手里的 offer 情况
11. 反问

## 二面

1. Spring,Spring MVC,Spring Boot 之间什么关系?
2. [@Autowired ](/Autowired) 和 [@Resource ](/Resource) 的区别是什么？
3. 静态代理和动态代理的区别
4. 除了 JDK 提供的动态代理实现还有其他实现方式么(CGLIB )
5. 谈谈对 MySQL 索引的了解，哪些字段应该考虑创建索引，哪些字段尽量不要创建索引
6. 为什么 InnoDB 引擎要选择  B+Tree 作为索引数据结构？
7. MySQL 中 一条 SQL 语句的执行流程
8. 知道哪些 SQL 优化手段
9. 多表联合查询的时候SQL语句的执行流程
10. 目前正在学习什么知识
11. 反问：新人培训体系是怎么样的

答案：

* [Spring常见面试题总结](https://javaguide.cn/system-design/framework/spring/spring-knowledge-and-questions-summary.html#spring-ioc)
* [Java 代理模式详解](https://javaguide.cn/java/basis/proxy.html)
* [MySQL索引详解](https://javaguide.cn/database/mysql/mysql-index.html)（很重要的知识点）
* [SQL语句在MySQL中的执行过程](https://javaguide.cn/database/mysql/how-sql-executed-in-mysql.html)
* [常见SQL优化手段总结](https://javaguide.cn/high-performance/sql-optimization.html)（[星球](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html)专属，在《Java面试指北》的技术面试题篇）
* 联表执行：
  * [神奇的 SQL 之 联表细节 → MySQL JOIN 的执行过程（一）](https://www.cnblogs.com/youzhibing/p/12004986.html)
  * [神奇的 SQL 之 联表细节 → MySQL JOIN 的执行过程（二）](https://www.cnblogs.com/youzhibing/p/12012952.html)

## 三面

1. 自我介绍
2. 简单介绍一下自己的项目
3. 项目中用了哪些设计模式
4. 单例模式有什么好处
5. 如何理解线程安全和不安全
6. 项目中用了线程池干什么
7. 为什么实际生产建议使用 `ThreadPoolExecutor` 构造函数来创建线程池
8. 平时怎么学习的
9. 反问：公司目前的技术栈，是否有 CodeReview

三面这个面试官基本没怎么问题技术，后面找我唠嗑半天就闲聊一些大学生活啥的。

答案：

* 关于如何介绍自己的项目经验推荐两篇文章：
  * [如何介绍项目经历更容易获得面试官的青睐？](https://articles.zsxq.com/id_gxfkjez2bbmw.html)
  * [正确介绍自己的项目经验 再也不为面试发愁了](https://juejin.cn/post/7017732278509453348)
* 设计模式：
  * [如何优雅的将设计模式运用到实际项目中去? ](https://juejin.cn/post/7199549049787465765)
  * [设计模式二三事 - 美团技术团队](https://tech.meituan.com/2022/03/10/interesting-talk-about-design-patterns.html)
* [Java并发常见面试题总结（上）](https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html)
* [Java 线程池详解](https://javaguide.cn/java/concurrent/java-thread-pool-summary.html)

金蝶的八股文整体还是挺简单的，没有问到特别难的问题的，整体体验一般。


> 更新: 2025-08-03 08:06:14  
> 原文: <https://www.yuque.com/snailclimb/mf2z3k/uf54c4>