# 腾讯云智（武汉）面经（附答案），已获 offer!

这篇是球友投稿的腾讯云智（腾讯内包）校招面经，我在文末补充了参考资料（涵盖了绝大部分面试题的参考答案）。相比较于数字马力，腾讯云智的面试难度要大一些，但主要是对八股的拷打，容易准备。

这里也欢迎大家多多分享自己的面经，优质面经有大红包奖励。

下面是正文。

## 个人背景与求职概况

* **院校背景：** 湖北某民办二本院校，计算机相关专业。
* **求职届别：** 2024 届秋季校园招聘。
* **求职感受：** 今年秋招整体环境偏冷，求职过程较为漫长，在年底最终收获 Offer。对腾讯云智提供的机会表示由衷感谢。

## 面试流程与问题回顾

### 一面(40min)

1. **自我介绍**
2. **Redis：**
   * 在你的项目中，是如何具体使用 Redis 的？
   * 请列举 Redis 常用的基本数据结构。
   * Redis 有哪些持久化策略？它们分别是如何工作的？
   * 谈谈你对 Redis 单线程模型的理解。
3. **Java 并发：**
   * 请解释乐观锁和悲观锁的概念，并分别举例说明其实际应用场景。（面试官进一步追问了 CAS 算法的原理）
   * `ReentrantReadWriteLock` 和 `StampedLock` 的区别与应用场景？
   * 请简述 AQS (`AbstractQueuedSynchronizer`) 的基本原理及其在 JDK 中的典型应用（如 `ReentrantLock`, `CountDownLatch` 等）。
   * 请说明 Java 线程池的核心参数及其含义。
   * 线程池常见的拒绝策略（饱和策略）有哪些？
4. **数据库：**
   * 数据库索引常用的底层数据结构是什么？（通常指 B+树）
   * 请手写一条 SQL 查询语句，并分析其索引使用情况（是否会命中索引，为什么）。
5. **算法与数据结构：**
   * 列举你了解的常见排序算法。
   * 请详细阐述快速排序的原理、平均/最坏时间复杂度以及空间复杂度。
   * **编程题：** 请手写实现链表反转。
6. **反问环节：**
   * 请评价一下我本次面试的整体表现。
   * 如果通过，二面通常会在什么时候通知？

**一面小结：** 面试结束后，一度以为表现不佳，没想到大约两周后收到了二面通知。

### 二面(40min)

1. **自我介绍**
2. **数据库优化实践：**
   * 在你的项目中，采用了哪些 SQL 优化手段？
   * 你是如何分析和评估 SQL 语句的性能的？（例如 EXPLAIN 命令）
   * 请再次说明索引底层的核心数据结构。
   * 你能列举一些常见的导致索引失效的场景吗？
3. **性能测试 (JMeter)：**
   * 请介绍一下你在项目中是如何使用 JMeter 进行压力测试的？
   * 在进行压测时，通常观察到初始几次请求的响应时间偏高，你知道可能的原因是什么吗？（例如，应用或框架的懒加载机制、JIT 编译、连接池预热等）
4. **Java 并发：**
   * 在你的项目中，具体在哪些场景应用了多线程技术？
   * 如果需要主线程等待所有子线程执行完毕后再继续执行，有哪些实现方式？（例如 `CountDownLatch`, `CyclicBarrier`,`Future.get()`, `Thread.join()`）
   * `synchronized` 关键字为何被称为“重量级锁”？请尝试从操作系统层面解释。
   * 请简述 `synchronized` 的作用，并结合具体场景进行说明。（面试官给出了约 8 个场景判断题，难度不高）
   * 请描述一下线程池处理任务的完整流程。
5. **计算机网络基础：**
   * 请描述当用户在浏览器输入一个网址到最终看到对应页面的完整过程。
   * 在这个过程中，主要涉及了哪些网络协议？
   * 请简述 DNS 解析的详细过程。
   * UDP 和 TCP 协议的主要区别是什么？
   * 请解释什么是网络拥塞控制。
   * 滑动窗口机制是如何工作的？
6. **反问环节：**
   * 请评价一下我本次面试的表现。
   * 后续的面试流程是怎样的？
   * 请介绍一下部门的主要业务方向和技术栈。

### HR 面(20min)

1. 自我介绍；
2. 哪里人，目前是不是在武汉；
3. 对前几面面试官有什么感受；
4. 家庭情况；
5. 职业规划；
6. 大学期间参加了哪些活动；
7. 平时的学习方式；
8. 手里面还有没有其他 offer；
9. ……

到了 HR 面基本稳了，HR 面过了大概一周发了 Offer。

## 参考资料

下面这几篇文章基本涵盖了上面提到的绝大部分面试题的参考答案（注：这部分为 Guide 补充）：

* **Redis**：[Redis 常见面试题总结(上)](https://javaguide.cn/database/redis/redis-questions-01.html)、[Redis 常见面试题总结(下)](https://javaguide.cn/database/redis/redis-questions-02.html)
* **Java 并发**：
  * [乐观锁和悲观锁详解](https://javaguide.cn/java/concurrent/optimistic-lock-and-pessimistic-lock.html)
  * [Java 并发常见面试题总结（中）](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html)、[Java 并发常见面试题总结（下）](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html)
  * [CompletableFuture 详解](https://javaguide.cn/java/concurrent/completablefuture-intro.html)（`allOf()`方法会等到所有的 `CompletableFuture` 都运行完成之后再返回）
* **数据库**：
  * [15 个必知的 MySQL 索引失效场景，别再踩坑了！](https://mp.weixin.qq.com/s/iBPO4Y_Q5ANSZ9iETAdMvA)
  * [MySQL 执行计划分析](https://javaguide.cn/database/mysql/mysql-query-execution-plan.html)
  * [MySQL 索引详解](https://javaguide.cn/database/mysql/mysql-index.html)
  * [高性能：有哪些常见的 SQL 优化手段？](https://www.yuque.com/snailclimb/mf2z3k/abc2sv)（星球专栏[《Java 面试指北》](https://t.zsxq.com/avfM0)中的一篇文章）
* **性能测试 (JMeter)**：[如何利用 Jmeter 从 0 到 1 做一次完整的压测](https://mp.weixin.qq.com/s/MfYsvK_4We6bixN0laqGrg)
* **算法**：
  * [十大经典排序算法总结](https://javaguide.cn/cs-basics/algorithms/10-classical-sorting-algorithms.html)
  * [反转链表(Reverse Linked List) - 力扣(LeetCode)](https://leetcode.cn/problems/reverse-linked-list/)
* **网络**：[计算机网络常见面试题总结(上)](https://javaguide.cn/cs-basics/network/other-network-questions.html)、[计算机网络常见面试题总结(下)](https://javaguide.cn/cs-basics/network/other-network-questions2.html)

## 总结

腾讯云智的面试效率比较低，很慢，但面试官总体给我的感觉还可以。

网上有说法称腾讯云智部分岗位性质类似“内包”，可能与腾讯主体系的福利待遇、发展路径有所差异。对此，我个人的看法是：在当前就业环境下，能获得一个来自大厂子公司的 Offer 已属不易。它不因我的学校背景而拒绝我，我亦不因其可能的“内包”属性而轻易放弃。如果后续没有更优的选择，我会接受这份 Offer。**非常感谢腾讯云智给予的机会！**


> 更新: 2025-06-23 11:02:27  
> 原文: <https://www.yuque.com/snailclimb/mf2z3k/rbc1abk22uf4qokn>