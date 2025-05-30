# Seata&XTS

## vs

### 对比与选择

1. **性能**：
   - Seata的AT模式性能较高，因为其对数据源的拦截和日志生成进行了优化。
   - XTS在2PC模式下性能稍低，但在复杂事务一致性需求下更加可靠。
2. **易用性**：
   - Seata与Spring等生态系统集成度高，使用起来较为简单。
   - XTS提供简洁的API，但需要开发者更深入理解TCC模型。
3. **场景适配**：
   - Seata适用于需要高性能且事务模型灵活的场景。
   - XTS适用于对事务一致性要求较高的场景，如金融系统。

### 选择建议

- 如果你需要一个高性能且易用的分布式事务框架，可以考虑使用Seata。
- 如果你对事务一致性有严格要求，且能接受更复杂的实现，可以选择XTS。

# [Seata](https://seata.io/zh-cn/docs/overview/what-is-seata.html)

> [复习Gulimall的本地事务对照着笔记来学习！](../gulimall/分布式高级#分布式事务)
>
> 看标题的官网链接！！！中文的通俗易懂  下面自己码的也可以看看抄过来的图带点自己好理解的逻辑去理解  `@GlobalTransactional`
>
> [2PC（Seata是这个的一个变形）](../gulimall/03、本地事务&分布式事务.pdf#分布式事务几种方案) 这里具体看 PDF！注意方案是方案框架是框架（落地实现这个方案）

## 概念

分布式架构肯定是多数据库、多数据源！（买家库，卖家库）甚至在不同的机房。单个就搞笑了

单体应用被拆分成微服务应用，原来的三个模块被拆分成三个独立的应用,分别使用三个独立的数据源，业务操作需要调用三三 个服务来完成。此时**每个服务内部的数据一致性由本地事务来保证， 但是全局的数据一致性问题没法保证**。

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202207081440609.png)

一句话：**一次业务操作需要跨多个数据源或需要跨多个系统进行远程调用，就会产生分布式事务问题**。



**一带三：**分布式事务处理过程的一ID+三组件模型

* Transaction ID XID 全局唯一的事务ID
* 三组件概念
  * TC (Transaction Coordinator) - 事务协调者：维护 全局和分支事务的状态，驱动全局事务提交或回滚。
  * TM (Transaction Manager) - 事务管理器：定义全局事务的范围：开始全局事务、提交或回滚全局事务。
  * RM (Resource Manager) - 资源管理器：管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。



处理过程：

1. TM向TC申请开启一个全局事务，全局事务创建成功并生成一个全局唯一的XID；
2. XID在微服务调用链路的上下文中传播；
3. RM向TC注册分支事务，将其纳入XID对应全局事务的管辖；
4. TM向TC发起针对XID的全局提交或回滚决议；
5. TC调度XID下管辖的全部分支事务完成提交或回滚请求。

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202207081513288.png)

==`My Understand：`看图说话==   我这里好理解

> Seata 分 TC、TM 和 RM 三个角色，TC（Server 端）为单独服务端部署，TM 和 RM（Client 端）由业务系统集成。

TC 协调TM全局事务中的各个分支事务，这个全局调控的人就是Seata服务器（官网下下来运行）

TM 全局事务看成订单模块 其它小事务RM看成feign调用的



> Q：AT 模式（自动）  假如 Account 失败了，但是Stock & Order成功了 那么怎么回滚？？？
>
> A：UNDO_LOG Table（回滚日志表）  假如提交的是 +2 那就 -2 给补回来回复以前的状态。因为前面事务提交了没办法回滚了（魔改数据库）

![](https://user-images.githubusercontent.com/68344696/145942191-7a2d469f-94c8-4cd2-8c7e-46ad75683636.png)



## [快速开始](https://seata.io/zh-cn/docs/user/quickstart.html)

> 官方文档很清楚了！！！Git也有很多场景示例。Seata支持很多模式..   **AT 模式：两阶段提交[协议](../gulimall/分布式高级)的演变**

**本地@Transactional     Spring的注解**

**全局@GlobalTransactional    SpringCloud的注解（控制分布式事务）：代表这个订单服务是一个全局事务，分支事务用@Transactional就行了**

ps：做项目订单这个全局事务需要把这两个注解都写



> [这里具体看 PDF！](../gulimall/03、本地事务&分布式事务.pdf)注意方案是方案框架是框架（落地实现这个方案）  **✔是高并发优先考虑的，用MQ**    订单用异步确保型/商品保存可2PC

* 2PC（Seata是这个的一个变形）还有3PC 
  注意和MySQL写日志的两阶段提交区分，是不一样的东西。Seata AT是第一阶段提交+2第二阶段看要不要补偿-2  只适合一般的分布式事务不合适高并发



* 柔性事务-TCC 事务补偿型方案：相当于3PC的手动版
  商城项目用的很多，也有很多框架给你去用。把正常的业务代码按照框架要求拆成z和三部分就行  Try+2/add  Cancel-2/delete



* 柔性事务-最大努力通知型方案（弹幕有公司是这个）✔
  支付宝告诉你有没有支付成功，MQ 一会发个消息告诉你成了 一会发个消息告诉你成了



* 柔性事务-**可靠消息**+最终一致性方案（异步确保型，视频是这个）✔
  也是借助 MQ  总结一句：异步下单，提高并发，提升响应，提升购物体验。



## 举例 AT 模式（自动）

> 只适用一般的分布式事务控制（例如保存商品会有几次feign优惠券之类的这里不要求高并发），**不适合高并发。下单其实不适合（用MQ）**

1. 需要数据库加一个回滚表（哪个微服务需要回滚的就得加上）

2. [解压并启动seata-server](https://github.com/seata/seata/releases)（TC 事务协调器）
   1. 导入依赖spring-cloud-starter-alibaba-seata 会自动带上 seata-all-0.7.1

   2. 注意下载的Seata服务器版本要和 seata-all-0.7.1 对应！！
      * registry.conf：服务注册/注册中心配置/事务日志存储位置（global_table&branch_table&lock_table）
        修改 registrytype=nacos 或使用本地文件 file.conf 配置

   3. 所有想要用到分布式事务的微服务使用seataDataSourceProxy代理自己的数据源
      * 1.4.1版不用配置数据源，在yaml中开启自动代理数据源，默认是开启的

   4. **每个微服务,都必须导入 registry.conf file.conf 配置服务名**

      * 问题一：[no available server to connect解决](https://www.cnblogs.com/LinQingYang/p/13723779.html)（Application要配置seata： spring.cloud.alibaba.seata.tx-service-group: **my_test_tx_group**）
      * [问题二：同一无法连接](https://juejin.cn/post/7163549166746992676)

      * 1.4.2直接注册到nacos上 现在的没这么麻烦了吧 可能只需要一个registry.conf了

   5. 给分布式大事务的入口标注@GLobalTransactional   每一个远程的小事务用@Transactional



​	P290避个坑，staea0.7不支持批量保存，我是遍历插入的，体验要stata的效果就好了，不使用高版本的stata也可以



==特别注意：Seata 为用户提供了 AT、TCC、SAGA 和 XA 事务模式==



> #### 后面看JavaGuide《[面试指北](https://www.yuque.com/snailclimb/mf2z3k/ng9vmg)》补充：
>
> 简单总结一下 2PC 两阶段中比较重要的一些点：
>
> 1. 准备阶段 的主要目的是测试 RM 能否执行 本地数据库事务 操作（!!!注意：这一步并不会提交事务）。
> 2. 提交阶段 中 TM 会根据 准备阶段 中 RM 的消息来决定是执行事务提交还是回滚操作。
> 3. 提交阶段 之后一定会结束当前的分布式事务
>
> 2PC 的优点：
>
> * 实现起来非常简单，各大主流数据库比如 MySQL、Oracle 都有自己实现。
> * 针对的是数据强一致性。不过，仍然可能存在数据不一致的情况。
>
> 2PC 存在的问题：
>
> * 同步阻塞 ：事务参与者会在正式提交事务之前会一直占用相关的资源。比如用户小明转账给小红，那其他事务也要操作用户小明或小红的话，就会阻塞。(XD：所以谷粒商城**高并发**的接口没用Seata，用的是MQ柔性事务)
> * 数据不一致 ：由于网络问题或者TM宕机都有可能会造成数据不一致的情况。比如在第2阶段（提交阶段），部分网络出现问题导致部分参与者收不到 Commit/Rollback 消息的话，就会导致数据不一致。
> * 单点问题 ：TM在其中也是一个很重要的角色，如果TM在准备(Prepare)阶段完成之后挂掉的话，事务参与者就会一直卡在提交(Commit)阶段。



# XTS

> > - XTS（eXtended Transaction Service）是一个基于2PC的分布式事务框架，用来保障在大规模分布式环境下数据的一致性
> - 在支付宝广泛使用，涉及到账务、资金的操作，都要使用XTS来确保事务最终一致性
>
> 2010 TCC分库分表（用的最多接触最多）
> 2020 XA模式
>
> [很棒的Movie](https://study.antgroup-inc.cn/learn/course/293000055/content/367000437/367000438?tenant=metastudy)，视频 PPT 巨好。下面的标注很详细我懂了！
> ～～～
>
> 联想 seata
> [https://aliyuque.antfin.com/middleware/xts](https://aliyuque.antfin.com/middleware/xts)
> TODO
> 永毅：现在打算去 XTS 了，XTS 太慢了
> 其他组会议也提到：他们好像都没用分布式锁，性能差？用的事物模板
> ![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/09175e8024e7028c76cd05eff7628be7.png)

**分布式事务：解决数据一致性问题（例如转账A扣钱，B加钱）**
## CAP
单机事务：ACID
分布式事务：CAP（多了网络原因，ACID不适用）
CP / AP 不能同时存在原因：
> **分布式系统一定是存在网络传输的**
> 就会出现网络延迟/不可达的问题，所以 P 分区容错性一定要满足

分区隔离多个数据副本还没同步完，即节点间数据不一致！
此时只能在 CP / AP 权衡：
强一致：等网络恢复同步完，**对外不可用**（zookeeper）
可用性：读到的数据不一致，可能是还没同步好的节点数据（注册中心）
## BASE
我们大多数的业务系统是对用户提供服务的，一般衡量标准是几个9，对可用性要求是很高的，所以分布式事务对CAP理论中的AP做了延伸，就是BASE理论，它是一种柔性事务理念，它要求分布式系统是基本可用的，允许存在中间态数据，但是一定时间后可以达到最终一致性。这里的基本可用可以理解为响应时间上的增加和非必要功能的降级，中间态数据可以理解是引入了提交过程中的中间状态或者同步过程的延迟。

ps：几个9的意思问了GPT
在计算机系统特别是分布式系统领域，当提到系统的可用性时，"几个9" 是衡量系统可用性的一种常用方式，即所谓的 "nine's" 模型。这种表示法指的是系统在一段时间内保持可用状态的百分比。具体来说：

- **1个9（90%）**：系统在 100%的时间里，保证 90%的时间是可用的。
- **2个9（99%）**：系统在 100%的时间里，保证 99%的时间是可用的。

以此类推。
具体来说，"几个9" 反映了系统的可靠性和可用性级别。例如：

- **99.9% 可用性**（3个9）：意味着每年只有大约 8.76 小时的不可用时间，这是较高的可用性要求。
- **99.999% 可用性**（5个9）：意味着每年只有大约 5.26 分钟的不可用时间，这是非常高的可用性要求，通常应用于对可靠性要求极高的系统，如金融交易系统、航空控制系统等。
## 目标 - 一致性
### 1PC：无法完成
> 目标就是所有节点的提交状态达到一致，要么全部提交、要么全部回滚，
> 但是当节点1和节点2都提交完成时，节点3出现异常没有提交，因为只有一个阶段，这样整体就不一致了，因为节点可能在任意时刻出现异常，所以 1PC 是没办法的。

![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/57c20af0e574e766247d7f4e2b70e27a.png)
### 2PC：即二阶段有个反悔的机会
> 所以我们必须把提交过程拆成两个部分，也就是两阶段提交，在一阶段完成后可以有一个“反悔”的机会 - 既可以继续提交、也可以撤消
> 前面说我们的目标就是让所有节点的提交状态达到一致，要么全部提交、要么全部回滚。其实这个目标就等价于：
> 从所有节点中选定一个作为协调者，然后其他节点的状态和它保持一致，就可以了。
> 因为事务总会有一个发起者嘛，自然这个发起者就可以作为协调者，其他节点就被称为参与者。
> 通过这种方式，除了发起者以外的参与者节点就可以将选择的权力交给发起者来协调，这样发起者就决定了所有节点的状态，就一定是一致的。
> 注意这里有一个前提，就是一阶段完成后的中间状态一定可以向前提交，也可以回滚，如果不能满足，那就应该在一阶段就直接失败。
> 这就是两阶段提交，常见的分布式事务方法基本都是基于两阶段衍生出来的。

![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/f6c17e91b32b47b9752a94f17ca4260c.png)
## XTS发展-四种模式
> 接下来我们主要介绍的是**TCC模式**，蚂蚁大部分应用使用的都是TCC模式，大家以后接触最多的就是TCC，FMT，saga和XA模式会放到后边的扩展部分进行介绍。

![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/eba3e9147240d1fe83ee3fc78f1f6e54.png)
TCC模式：二阶段提交模式，一阶段try内执行本地事务和远程调用，根据远程调用的成功和失败来决定后续调用 confirm 还是 cancel。
XA模式：需要数据库支持，实现2PC协议，这个时候数据库便能支持分布式事务了。

思考1：TCC模式需要设计者考虑中间状态，try的过程中并不直接对数据进行变更，而是通过中间值体现，在一阶段处理结束的时候，通过commit 或 cancel 来将中间值转化为最终值。需要有良好的设计思维来设计模型。
思考4：XA模式性能注定不会很好，分布式事务基本都具有RPC调用的特性，此时数据库便会存在长事务的情况。正常来说，开发规范都不允许事务内存在RPC调用就是防止长事务的存在。

总结：TCC业务侵入性大但是性能更优，FMT和XA模式无法满足高并发场景，但是这两者都无需开发者关注，配置即可用。SAGA模式个人不太喜欢，这种补偿机制问题颇多，事务补偿异常怎么处理？事务隔离性差导致的数据污染如何处理？这些都是开发者需要关注的东西。
# TCC模式
## 概念
> 先介绍一下TCC几个概念，其实TCC名字就是根据两阶段来起的，第一阶段执行try服务，所有检查操作，可能会导致事务提交失败的操作全都应该放到try中进行。
> 第二阶段是commit和cancel操作，提交就是commit，反悔了要回滚就是cancel操作，二阶段只会选其中一个执行。
> **发起方，是分布式事务的协调者，负责编排参与者，推进执行二阶段。将执行过程记录事务日志。**

**帮助理解的 PointKey World：**
**主事务 & 分支事务**
**TM：发起者**
**RM：参与者**
![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/fb36ae860874979dc1ac1eea159a650e.png)

## 经典使用场景
> 首先看一个典型的使用场景，app1,app2,app3组成一个分布式系统，
> app1分别调用app2和app3做了insert和delete操作，同时app1本身
> 做了一个update操作，这样整个分布式事务包含3个系统，3个操作。

![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/731b95aa4b87a3a410b67eaac6ba5ffd.png)
**那如何将这个事务设计成TCC二阶段呢？**
比如针对insert这类增加的操作，一阶段就不能直接增加，而是应该在做完检查后，添加一个未达数据，二阶段将未达数据进行追加或者删除。对Delete这类减少操作，一阶段也是不能直接减少，而是应该先做业务检查，然后冻结住，在二阶段将冻结的数据彻底删除或者回滚解除冻结。

## 实现原理：TCC两阶段提交
> 图 !important  

![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/7fa0b3259ae9f81eefacea36e8e1ecf4.png)
App1是整个事务的发起者，为了能够代表整个事务的状态，发起者必须要有一个本地事务，**并且对所有参与者一阶段的调用，都需要在这个本地事务内发生**，如果在一阶段有任意节点报错了，无法完成，发起者本地事务就需要回滚，如果所有节点一阶段都可以顺利完成，本地事务才能提交。
本地事务结束后表示一阶段已经完成，可以进入二阶段，由于本地事务ACID的原子性，本地事务是一定处于**终态的**，要么是提交状态，要么是回滚状态，就算超时也是回滚状态。
所以二阶段就可以根据本地事务的状态，来协调各个参与者二阶段，是提交还是回滚，二阶段的提交和回滚是不确定的，**所以二阶段是由框架自动执行的**
这个整个过程中会通过记录日志表的方式，持久化所有发生的动作，日志表都是记录到发起者的业务数据库中的，叫做同库模式，事务启动时，会生成一条主事务记录business_activity，表示这一次分布式事务，每调用一次参与者，会生成一条分支事务记录business_action，它和主事务记录是一对多的关系。
那一致性是怎么保证的呢？

## ⭐事务一致性保证（重点）
![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/8cfa32e52651e1a88351c1b024621975.png)
这一页是对上一页的一个细化，也是说明**xts如何实现一致性**的核心重点。
发起者在启动事务的时候，先要启动一个本地事务，然后在这个本地事务中调用一下xts提供的start方法，这样xts会立即在**独立的事务模板**中插入一条主事务记录，状态为初始状态，紧接着xts在发起者本地事务中，对刚插入的主事务记录，执行一次状态更新操作，由初始状态更新为确定提交状态，
前面说过，发起者本地事务可以决定整体分布式事务的状态，注意这里的更新操作，通过这一步就可以将主事务日志记录和业务本地事务绑定到一起，所以主事务记录的状态就可以反应整个分布式事务的状态了。
**那怎么绑在一起的？因为xts是在发起者本地事务中执行的更新，本地事务提交，主事务记录肯定就是确定提交状态了，如果本地事务回滚，刚才的更新操作也会跟着回滚到初始状态。**
到这里xts的start方法内部就执行完成了，然后发起者本地事务中的业务代码开始调用各个参与者的一阶段，xts会拦截到每一次调用，还是在独立事务模板中插入一条分支事务记录，然后再执行调用，这样就可以把具体调用过哪些参与者持久化记录下来。
**那主事务记录和分支事务记录的插入操作为什么需要独立事务模板**？是为了本地事务回滚时不影响事务日志的持久化，如果在本地事务中插入事务日志，假如调用某个参与者失败了，本地事务回滚后，插入的事务记录也会一起回滚消失，就不知道整个事务的状态了，另外具体调用过哪些参与者也不知道了，这要是为什么要再加**两张表记录**的原因，不受本地事务的影响。
一阶段完成后，xts会自动执行二阶段，根据本地事务的状态决定调用参与者的commit方法还是cancel方法，二阶段完成后，直接删除事务日志。

疑问：
两条事务线： 
绿色线使用单独的事务模板，事务传播特性为PROPAGATION_REQUIRES_NEW 
红色线使用发起方本地事务模板，事务传播特性为PROPAGATION_REQUIRES 
请问绿线先走红线后走，红线会不会加到绿线的事务

解答：
总结起来，红线事务会作为单独的事务存在，与绿线事务独立，互不影响。
当红线在绿线事务内部开始时，红线事务使用 PROPAGATION_REQUIRED规则，它会检索到当前存在的事务（即绿线的事务）。但是由于绿线的事务是独立的事务，不会发生嵌套，因此红线的事务实际上会是独立的事务（红线本地事务）。
## 事务日志状态
![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/f40bb7c561b498c208ebb6f3e273111d.png)
再看一下在执行过程中，主事务日志状态的转化，在business_activity表中通过state列表示状态。
主事务记录是在独立事务中插入的，状态为初始化状态I，可以保证不管本地事务提交不提交，主事务记录一定存在，然后在发起者本地事务中更新为确定提交状态C。
接下来如果本地事务提交，更新操作也会提交，主事务记录状态就是确定提交C，
如果本地事务回滚，更新操作也会回滚，主事务记录状态就会回滚到初始化状态l。
这样有了主事务日志，如果执行过程中出现异常，就可以直接通过主事务日志的状态来表示整个分布式事务的状态了，实际上，事务日志就是为了出现异常时恢复用的，不做业务使用，**如果二阶段正常可以完成，事务日志就用不到，可以直接删除**，客户端执行过程中使用的日志信息都是放到内存中的，不查db，性能高。
那什么情况下会用到呢？

## XTS事务兜底恢复
![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/387d323bff005e77a1b43838d95a11f0.png)
接下来就是XTS事务兜底恢复，如果二阶段在执行参与者B的提交方法时机器断电了，虽然整体事务没有完成，但是发起者数据库中会有这条事务的主事务记录和两个分支事务记录。
**Xts的恢复系统dtap就会到发起者的数据库中，定时捞取到这条主事务记录，发现状态为确定提交状态C，就可以判定这条事务是要提交的，再查询一下关联的business_action分支事务记录，查到这两个参与者信息后，顺序的调用参与者的confirm方法就可以完成恢复。同样的，如果主事务日志是初始化状态l，就调用参与者的cancel方法。**
然后在二阶段完成后，直接删除发起者数据库中的这笔事务日志记录，就可以完成事务的恢复。
这里为了能让dtap可以查询发起者数据源和调用参与者服务，dtap提供了控制台来录入这两个信息，需要人工去录入。

思考：这里的第4步会出现什么问题呢？可能会调用两次，应用调用了一次后才断电（/ 超时），dtap恢复时，不知道是否调用过，只能再次调用，需要支持**幂等**
思考：如果dtap调用参与者B的二阶段confirm时也失败，如何操作？

- 分布式事务的状态是由本地事务决定的！本地事务状态一定是一个终态
- 其他原因再ci
## TCC使用规范

- XTS分布式事务TCC是基于两阶段提交（2 phase commit，简称2pc）原理的。
- 分布式事务必须在本地事务模板中进行。
- 事务发起者是分布式事务的协调者，发起者本地事务的最终状态（提交或回滚）决定整个分布式事务的最终状态。
- 执行过程发起者会生成事务日志到业务库的business_activity，business_action表。
- 事务参与者的方法需要支持两阶段。发起方（使用者）只关注第一阶段的方法，第二阶段由框架自动调用。参与者需要保证：第一阶段如果成功了，第二阶段必须保证成功。
- 第一阶段完成，第二阶段没执行完的事务需要进行事务恢复，要到dtap去配置发起者和参与者信息，定时（每分钟）捞取发起者db数据business_acitvity进行第二阶段执行。

一阶段一定能完成
恢复系统其实是做了应用客户端二阶段没完成的操作。

## TODO - 理论视频  & 案例
然后通过几个TCC典型金融案例实践加深对XTS的理解
# XA模式
![image.png](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/331a77d65115a134117aff63e2c3ce75.png)