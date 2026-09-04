# 步步高 Java 后端校招四面

我对步步高的记忆主要还停留在小时候，那时候步步高点点读机是真的火爆，广告直接都给洗脑了。



步步高虽然不是什么大型互联网公司，但是这份面经总体还是非常高质量的！这侧面说明了这家公司的的技术栈也还是比较主流的。



不得不说这面试问题有点多啊。。。



## 一面（50 分钟）3 月 3 号


1. 介绍一下项目
2. 项目是视频还是通过什么途径学习的？
3. 你认为项目中复杂的点是什么？
4. Redis 的使用场景？
5. Redis 的高并发是依靠什么去保证的？（本质在问 Redis 为什么这么快？）
6. Redis 的 rdb 和 aof 说一下吧，区别呢？
7. 为什么 fork 一个子进程呢？
8. Redis 有持久化为什么还要用 MySQL 呢？
9. 单节点和集群的区别，集群解决了什么问题？
10. 主从复制解决了什么问题？
11. Redis 集群的原理
12. 讲一下同步和异步的区别？
13. 创建线程的方式?说一下？
14. 说一下 JMM 吧
15. JMM 的三个特性是哪三个？
16. 如何保证原子性，volatile 的作用呢？
17. ThreadLocal 用在哪，为什么选择 ThreadLocal 呢？
18. ThreadLocal 和 synchronized 的区别
19. 项目上线了嘛？部署在哪里？怎么部署的？
20. 注解实现缓存和日志统一处理是怎么做的？
21. SpringBoot 分哪些模块？
22. 项目中的分页是怎么实现的？
23. 项目中都有哪些 sql 表说一下吧？
24. 消息队列 MQ 用过吗？说一下？-
25. 分布式锁这块有用到吗？-
26. 说一下常用的一些集合？
27. 说一下 HashSet 的原理？
28. 说一下 HashSet 与 HashMap 的区别？
29. 线程安全的集合类有哪些？
30. 锁重入了解过嘛？那些锁支持锁重入？
31. 说一下锁升级的过程
32. JVM 如何判断哪些对象已经死亡？
33. 说一下常见的垃圾回收算法吧？
34. TCP 和 HTTP 协议之间的关系，有什么区别？
35. TCP/IP 参考模型，每层都是封装的什么？
36. TCP 是可靠的嘛？那么 UDP 呢？
37. TCP 如何保证我们的可靠传输的？
38. 说一下 TCP 中拥塞控制的一个过程？
39. Linux 查看 ip 地址的命令？top 命令有什么用？
40. 说一下聚簇索引和非聚簇的区别？
41. 事务的隔离级别和每个级别所产生的问题?
42. 实际开发中最常使用的隔离界别
43. 数据库中的锁有哪些？
44. MySQL 为什么要采用读写分离呢？
45. 项目中进行过哪些 SQL 优化实践？
46. 除了 MySQL、Redis 外还了解过其他数据库嘛？
47. 用过 Docker 嘛？
48. 使用 Docker 部署的好处是什么？相比原始部署？
49. 最近看了哪些书呢？
50. 反问



答案：



+ Redis： 
    - [Redis 常见面试题总结(上)](https://javaguide.cn/database/redis/redis-questions-01.html)
    - [Redis 常见面试题总结(下)](https://javaguide.cn/database/redis/redis-questions-02.html)
+ Java 并发： 
    - [Java 并发常见面试题总结（上）](https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html)
    - [Java 并发常见面试题总结（中）](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html)
    - [Java 并发常见面试题总结（下）](https://javaguide.cn/java/concurrent/java-concurrent-questions-03.html)
+ [一键部署 Spring Boot 到远程 Docker 容器](https://tobebetterjavaer.com/springboot/docker.html)（简单的单体项目部署，如果项目是微服务项目的话会相对麻烦一些）
+ [美团技术团队：如何优雅地记录操作日志？](https://tech.meituan.com/2021/09/16/operational-logbook.html) （操作日志的常见写法，以及如何让操作日志的实现更加简单、易懂；通过组件的四个模块，介绍了组件的具体实现）
+ [SpringBoot 常见面试题总结](https://javaguide.cn/system-design/framework/spring/springboot-knowledge-and-questions-summary.html)（[星球](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html)专属，在《Java 面试指北》的技术面试题篇）
+ [消息队列基础知识总结](https://javaguide.cn/high-performance/message-queue/message-queue.html)
+ [分布式锁常见问题总结](https://javaguide.cn/distributed-system/distributed-lock.html)
+ Java 集合： 
    - [Java 集合常见面试题总结(上)](https://javaguide.cn/java/collection/java-collection-questions-01.html)
    - [Java 集合常见面试题总结(下)](https://javaguide.cn/java/collection/java-collection-questions-02.html)
+ [JVM 垃圾回收详解（重点）](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)
+ [计算机网络常见面试题总结(上)](https://javaguide.cn/cs-basics/network/other-network-questions.html)
+ [Linux 基础知识总结](https://javaguide.cn/cs-basics/operating-system/linux-intro.html)（建议把整篇文章都顺便复习看一下）
+ [MySQL 常见面试题总结](https://javaguide.cn/database/mysql/mysql-questions-01.html)
+ 数据库优化： 
    - [读写分离和分库分表常见问题总结](https://javaguide.cn/high-performance/read-and-write-separation-and-library-subtable.html)
    - [常见 SQL 优化手段总结](https://javaguide.cn/high-performance/sql-optimization.html)（[星球](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html)专属，在《Java 面试指北》的技术面试题篇）
+ [Docker 核心概念总结](https://javaguide.cn/tools/docker/docker-intro.html)



## 二面(25 分钟) 3 月 5 号


1. Redis 为什么快？
2. 线程的创建方式？
3. 怎么在 Linux 服务器上部署项目？
4. 使用过 Docker 嘛？
5. Docker 与 Linux 相比为什么性能更好？
6. 如何进行 sql 优化？你自己实践哪些手段？
7. 我们 MySQL 读写压力很大，怎么解决？
8. 说一下 TCP 三次握手、四次挥手？
9. MQ 是什么？
10. 项目是怎么做的？实习项目还是自己做的？
11. 如何设计秒杀系统？（[《Java 面试指北》](https://javaguide.cn/zhuanlan/java-mian-shi-zhi-bei.html)技术面试题篇下的系统设计模块有一篇文章介绍如何设计秒杀系统。）
12. 实际开发中如何解决高并发的问题？你知道哪些手段？实践过哪些手段？
13. 校园的实践经历
14. 为什么来参加春招，是没 offer 吗？
15. 手里有几个 offer ？
16. 以后的发展方向是走技术管理，还是架构方向？
17. 说一下在你眼里技术管理和技术架构的区别？
18. 如果领导让你 3 天完成一个任务，但是你 4 天才能完成
19. 谈一下你对加班的看法？
20. 你将来计划打算学到什么，提升 Java 哪方面技能？
21. 反问



答案：一些技术问题和一面差不多，这里不多写一遍答案了。



## 三面（HR 面，20 分钟） 3 月 8 号


1. 为什么会有写博客的习惯呢，出发点是什么？
2. 这个博客是有粉丝的吗？你有多少粉丝呢?
3. 大学校园经历中有意义的一些事情？
4. 大学当中跟室友的关系怎么样？
5. 为什么没有参加秋招呢？
6. 找工作跟考研之间是怎么权衡的呢？
7. 讲一下在自己的个人项目中学到了什么呢？
8. 大学期间有没有低谷期间
9. 手里有其他的公司的 offer 吗？
10. offer 是哪家公司的？
11. 期望薪资是多少，年薪呢？
12. 反问



## 四面（终面，7 分钟） 3 月 11 号


一个非常让人讨厌的领导，说话阴阳怪气的，开头第一句话就是你的成绩不咋地啊（无挂科平均成绩在 80+）。



1. 有没有实习的经验 ？
2. 为什么秋招没有找到工作？
3. 你是怎么学习一个技术的？说一个擅长的



## 结果


面试结束半个月 3 月 25 号，收到消息未通过面试的消息，理由是：因与人才画像不匹配 ！



> 更新: 2023-05-12 12:27:45  
> 原文: <https://www.yuque.com/snailclimb/mf2z3k/iv3ccy>