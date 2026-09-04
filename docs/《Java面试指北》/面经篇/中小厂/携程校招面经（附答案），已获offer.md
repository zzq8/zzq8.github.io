# 携程校招面经（附答案），已获 offer!

个人背景：双非本，机械专业转码。

携程在正式面试之前，会有一个性格测试（40分钟）。性格测试之后，大概过一周进行笔试。笔试之后，会邮件通知是否通过并预约第一轮面试时间。

普通 offer 一般只有两面，如果是 sp 或者 ssp 的话，技术面貌似是三面。

携程的面试难度一般，效率比较高，面试体验还是不错的。

## 一面（45min）

主要是问八股，难度较低。

1. 自我介绍；
2. 进程和线程的区别；
3. 并行和并发的区别；
4. `synchronized` 的作用；
5. `synchronized` 和 `ReentrantLock` 的区别，如何选择；
6. `ThreadLocal` 使用过程中可能存在的问题（内存泄露）；
7. `ThreadLocal` 内存泄露问题是怎么导致的；
8. 项目中是如何创建线程池的，什么不用`Executors` 去创建线程池；
9. 知道的本地缓存，选择 Caffeine 的原因；
10. Redis 这类缓存和 Caffeine 的区别；
11. Redis 中常见的数据结构，应用场景；
12. 缓存穿透和缓存雪崩的区别，解决办法；
13. MySQL 和 Redis 怎么保持数据一致；
14. 一个 SQL 笔试题，join 多表查询（共享屏幕）。

答案：

* Java 并发：
  * [Java 并发常见面试题总结（上）](https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html)
  * [Java 并发常见面试题总结（中）](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html)
  * [Java 并发常见面试题总结（下）](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html)
* [Java高性能缓存库- Caffeine - 风之筝](https://ghh3809.github.io/2021/05/31/caffeine/)
* [《Java面试指北》 - 缓存基础常见面试题总结](https://javaguide.cn/database/redis/cache-basics.html)
* Redis：
  * [Redis常见面试题总结(上)](https://javaguide.cn/database/redis/redis-questions-01.html)
  * [Redis常见面试题总结(下)](https://javaguide.cn/database/redis/redis-questions-02.html)
* [SQL常见面试题总结](https://javaguide.cn/database/sql/sql-questions-01.html)

## 二面（50min）

二面主要还是八股。

1. 自我介绍；
2. 使用多线程可能存在的问题；
3. 线程池原理；
4. 聊聊`ThreadLocal`  （概念+一些应用举例+常见的内存泄漏问题）；
5. JVM 内存模型和垃圾回收；
6. 用到过内存分析工具吗；
7. 使用索引能带来什么好处，你项目中是怎么使用的；
8. 索引底层常见的数据结构，MyISAM 引擎和 InnoDB 引擎用的是哪种；
9. 聚簇索引和非聚簇索引；
10. 最左前缀匹配原则；
11. 造成索引失效的常见原因你知道那些，项目中遇到过索引失效问题吗；
12. 如果有一条 SQL 语句执行的很慢，如何进行优化；
13. 项目中是如何使用 ES的；
14. ES 检索比较快的原因，为什么 MySQL 不行；
15. 讲一下倒排索引；
16. 手写一个生产者消费者队列；
17. 反问。

答案：

* Java 并发
  * [Java 并发常见面试题总结（上）](https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html)
  * [Java 并发常见面试题总结（下）](https://javaguide.cn/java/concurrent/java-concurrent-questions-03.html)
* JVM
  * [Java 内存区域详解](https://javaguide.cn/java/jvm/memory-area.html)
  * [JVM 垃圾回收详解](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)
  * [Java内存分析相关工具](https://www.cnblogs.com/wenxuehai/p/16600216.html)
* MySQL：
  * [MySQL索引详解](https://javaguide.cn/database/mysql/mysql-index.html)
  * [MySQL执行计划分析](https://javaguide.cn/database/mysql/mysql-query-execution-plan.html)
* [Elasticsearch常见面试题总结(付费)](https://javaguide.cn/database/elasticsearch/elasticsearch-questions-01.html)

## HR面

* 个人的基本信息；
* 对携程的了解；
* 三个词形容自己；
* 手里还有哪些 offer；
* 平时的兴趣爱好；
* 选择工作的理由排序（薪资、加班情况之类的）。

## 英语测评

HR 面之后，还会有一个英语测评，题目比较多，对英语不好的同学不太友好。题型大概是阅读、演讲、听力这些。

不过，也不用担心，应该不太会因为英语测评的表现刷掉你，但英语测评还是可能会对你的面试评价造成影响，能做好还是要尽量做到最好。


> 更新: 2025-06-30 09:49:33  
> 原文: <https://www.yuque.com/snailclimb/mf2z3k/tmtvvgy7gq6ew560>