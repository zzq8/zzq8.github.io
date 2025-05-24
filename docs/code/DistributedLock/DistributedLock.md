---
article: false
---
# DistributedLock

> > 搞不懂事务和锁的概念-可以用@Transactional代替Redisson吗
> >
> >
> > @Transactional 和 Redisson 是两个不同的概念和用途，它们不能直接相互替代。
> >
> > * @Transactional 处理数据库**事务**的一致性。可以确保一组数据库操作要么全部成功提交，要么全部回滚
> >
> > * Redisson 是一个用于 Redis 的分布式对象的 Java 客户端库用于解决分布式环境中的线程**并发**访问问题
> >
> > 在某些情况下，您可以将 @Transactional 和 Redisson 结合使用。例如，在进行数据库操作之前，可以使用 Redisson 获取分布式锁来确保在事务期间对共享资源的独占访问
> >
>
> 【尚硅谷】分布式锁全家桶丨一套搞定Redis/Zookeeper/MySQL实现分布式锁     [尚硅谷视频地址](https://www.bilibili.com/video/BV1kd4y1G7dM)
>
> 建议 SQL 和 Redis 都先到其客户端写好对应语句，再到 idea 构建代码，这样逻辑就清晰多了
>
> 结合后面学的 GuliMall 缓存那一篇一起学习，这一篇回顾起来有点陌生可能没**大处着眼**。需要层层递进看解决什么问题带着3w才能学好！ 
>
> 个人觉得 GuliMall 从本地锁开始层层递进阐述抛出问题好理解。而这一篇可能自己走马观花了

## 前言

## 认识 JMeter

> GUliMall 压测章节也用了好用。可以搭配 jvisualvm     这个软件可以直接设置中文就不用看的那么费劲了！

![image-20220901090225517](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209010902577.png)

throughput 吞吐量

![image-20220901000424905](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209010004959.png)





## JVM 本地锁

> Java 自带的锁只适用于单个 JVM 内的线程同步
>
> 两种方法：
>
> 1. ReentrantLock
> 2. Synchronized
>
> 在实际开发中很少出现，因为一般我们的共享资源在服务外部（MySQL...）由此引出分布式锁
>
> ![image-20220901005746190](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209010057437.png)







***

## 分布式锁

以下两种方式是：

1. 基于数据库的实现：使用数据库的v和锁机制来实现分布式锁。可以创建一个专门的表来存储锁状态，通过在事务中对该表进行操作来获取和释放锁。使用数据库可以提供 ACID（原子性、一致性、隔离性和持久性）的特性，确保分布式锁的可靠性。
2. 基于缓存的实现：利用分布式缓存系统如Redis或Memcached来实现分布式锁。可以利用缓存的原子性操作（如SETNX）来实现锁的获取和释放。获取锁时尝试设置一个特定的键值对，如果设置成功则表示获取到了锁，否则表示锁已被其他进程持有。



## MySQL

> 没有最好的，只有最适合的



1. #### JVM 本地锁（synchronized / ReentrantLock）：三种情况导致锁失效（2，3是很难避免的，也就是说必须要单机部署单例模式）【600吞吐】

   * 多例模式（@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)）
     * 每个请求的都是一个单独的对象，锁不住。单例模式所有请求都是同一个对象
   * 事务（事务B在事务A提交之前获取锁，就相当于事务B把A的事又干一遍）
     * 事务设置 read_uncommitted 可解决，但是我们不能这样用。（==这里还需来理解==）
     * ![image-20220902232830929](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209022328177.png)
   * 集群部署（和多例模式有点类似）

   不推荐JVM本地锁

   

2. #### 一个SQL语句解决（把判断和更新等语句合成一个语句）【2000吞吐】

   * 有很大局限性：

     * 1.锁范围问题表级锁行级锁
       2.同一个商品有多条库存记录
       3.无法记录库存变化前后的状态

   * 使用==`select … for update`==给数据加锁的时候，咱们需要注意锁的级别，MySQL InnoDB 默认行级锁。

     ```sql
     SELECT * FROM my_table WHERE id = 1 FOR UPDATE;
     -- 对 id 为 1 的数据行加悲观锁
     ```
     
     ==行级锁都是基于索引的，如果一条 SQL 语句用不到索引是不会使用行级锁的，而会使用表级锁把整张表锁住，这点需要咱们格外的注意==
     
     * 1）要使用行级锁：查询或者更新条件必须是索引字段
     * 2）查询或更新条件必须是具体值

   

3. #### 悲观锁：select ... for update（用这个语句查，就锁住了，其他线程不能update。但能查）【600吞吐】

   * 问题：
     1. 性能问题
     2. 死锁问题：对多条数据加锁时，加锁顺序要一致
     3. 库存操作要统一：select.…for update 普通select
   * ==如果写并发量较高，一般会经常冲突，此时选择乐观锁的话，会导致业务代码不间断的重试。==
     ==优先选择：mysql悲观锁==

   

4. #### 乐观锁：时间戳、version版本号、CAS 机制（变量等于旧值就允许更新，例如==修改密码==）

   * <img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209031621459.png" alt="image-20220903162138040" style="zoom: 50%;" />
   * 不会导致死锁，悲观锁则有一定概率会
   * 在高并发下，吞吐量低。因为总是在内旋重试，浪费CPU资源
   * ==ABA问题（图片很形象）==
     * ![image-20220903163701486](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209031637908.png)
   * ==如果写并发量较低（多读），争抢不是很激烈的情况下优先选择：乐观锁==



## Redis

> 这个笔记很详细！！！  [老师的Redis 笔记](../Redis/尚硅谷_Redis6课件.docx)  结合这个看！！！案例都一样
>
> 注意在 xShell 云服务器上用 Redis 命令有提示，方便些

### 1. jvm本地锁机制（单机情况下）



### 2. redis乐观锁：事务 + 乐观锁（Watch）+ Lua

> [自己的Redis 笔记](../Redis/Redis.md)
>
> watch：可以监控一个或者多个key的值，如果在事务（exec）执行之前，key的值发生变化则取消事务执行  multi：开启事务
> exec：执行事务
>
> 注意：java 代码中不能想当然的使用这三条指令！！！要把这三条指定包在execute里面，可以搞个匿名内部类实现
>   ==\<T> T execute(SessionCallback\<T> var1);==
>
> 缺点：性能得不到保障



### ==3. 分布式锁：跨进程、跨服务、跨服务器【细说】==

> 首先分布式锁是一种**跨进程跨机器节点的互斥锁**，可以保证在多机器节点下对共享资源的排他性，通过第三方服务比如 reids 去共享锁，保证同一时刻只能有一个实例能够获取到锁。
>
> 然后分布式锁主要使用 Redisson 去实现的，Redisson的底层逻辑是基于 lua 脚本去实现的；
>
> 如果是第一次加锁，就会在 key 对应的 hash结构中添加一个 UUID：线程标识和1，代表了该线程对这个 key加锁了一次；
>
> 并且key的过期时间默认为30秒，如果启用了 watchdog机制，就会在后台启用一个线程，该线程会去执行一个定时任务，每10秒检查一次，如果key存在，就重置key的生存时间为30秒；
>
> 并且 Redisson 也实现了可重入锁的机制，当再次加锁，会对key对应的value加1，当value为0或者宕机，锁就会释放。

> ## 分布式锁用的redis的哪种数据结构？
>
> hash结构，用来线程id+重入次数，（然后扯一下它的流程和原理）

> 场景：
>
> 1. 超卖现象（NoSQL）
> 2. 缓存击穿（一个热点 key 过期，缓存有过期时间）
>    * MySQL 是放在硬盘上的数据库，属于文件性的数据库，性能低。
>    * Redis 内存性，性能好，但是能支持的数据量比较少。加入缓存就可以支持更多数据！
>      * 解决：可在中间加锁

**分布式锁的实现方式：**

1. ==基于redis实现==
2. ==基于zookeeper/etcd实现==
3. ==基于mysql实现==

**🌟特征：（==遇到问题，一步步进阶！==，看自己标注的【✨】）**   我这个笔记也把下面的总结了一边： [GuliMall](../谷粒商城/分布式高级#3）分布式锁)

> 一定要注意：Redis 不保证原子性，所以不能一条语句解决的问题都要考虑是否产生问题！！！
>
> 解决：一条指令解决  /  Lua（**世界上 90% 的外挂都是 Lua写的**）

1. 独占排他使用 setnx（猜缩写，not exist）【保证只有一个线程会拿到锁】

2. 防死锁发生
   如果redis客户端程序从redis服务中**获取到锁之后立马宕机**  解决：给锁设置过期时间。expire【防宕机没释放锁，导致死锁】

3. 原子性：
   获取锁和过期时间之间：set key value ex 3 nx【因Redis不保证原子性，所以这里只用一条命令设置锁和过期时间】

   判断和释放锁之间：Lua 脚本 原因 No.4

4. 防误删：解铃还需系铃人【新人程序员，锁没加上就解锁把别人的解了。还有No.5的情况。恶意的还是无意的都要防止一下】
5. 可重入性：hash + lua脚本，有些复杂我暂时略过了
6. 自动续期【当业务处理时间比锁的过期时间长，时间到锁一释放自己在裸奔，最后del操作还会把其他服务器的锁释放（就是No.4的操作 ）】



**操作：**具体看一下自己的代码

1. 加锁：setnx（当 lock 的值不存在才能设置成功）
2. 解锁：del
3. 重试：递归、循环

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209041046981.png" alt="image-20220904104624847" style="zoom: 50%;" />



> 场景：假如获取锁后服务器宕机，那么其他服务也拿不到自己就算重启也要重新拿锁也拿不到。
>
> 解决：设置锁的过期时间 expire / pexpire    ttl 查看过期时间   或一条命令 set 设置  set lock 111 ex 20 xx/nx





## lua脚本：

一次性发送多个指令给redis。**redis单线程执行指令遵守one-by-one规则**
EVAL SCript numkeys key[key..J arg[arg1]  输出的不是print，而是return

script：lua脚本字符串
numkeys：key列表的元素数量

key列表：以空格分割。获取方式：KEYS[index，应该是从1开始]

arg列表：以空格分割。ARGV[下标]





变量：
全局变量：a=5
局部变量：local a=5  (Redis 只能用 **局部变量**)



分支控制：
if条件
then
	代码块
elseif条件
then
	代码库
else
	代码块
end

![image-20220904144154210](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209041441300.png)



**可以这样操作 Redis 数据库里的数据：**

eval "return redis.call('get', 'stock')" 0 





## [ReentrantLock 底层](../juc/juc)

略。。。[看自己juc篇的笔记](../juc/juc)

unsafe  相当于jdk留的后门，可通过指针操作内存   有大量硬件级别的 CAS 原子操作





# 【Ant】本地事务 vs 分布式事务思考【Finish】

## 本地事务 vs 分布式事务思考
> `<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">TransactionTemplate</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> 是 Spring 框架中的一部分，用于简化事务管理。它主要用于处理本地事务，而不是分布式事务。</font>
>
> **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务的处理</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">：如果您的应用需要处理分布式事务（即跨多个数据源或系统的事务）</font>
>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"></font>

<font style="color:#DF2A3F;background-color:rgb(247, 249, 253);">TODO：思考其他系统怎么处理的，A：同ALMP一样的</font>

<font style="color:#DF2A3F;background-color:rgb(247, 249, 253);">很少用到分布式事务，具体看eshop代码和xts代码</font>

```java
//Step1.开启两阶段分布式事务
//step1.1 开启分布式事务
//step1.2 分布式参与者一：发券
//如果结果为空，超时等情况，直接回滚第一阶段，不做任何处理
//step1.3 处理事务成功的逻辑
shardTransactionTemplate.execute(new TransactionCallbackWithoutResult() {
    @Override
    protected void doInTransactionWithoutResult(TransactionStatus status) {
        //step1.1 开启分布式事务
        shardBusinessActivityControlService.start
```



本地事务外面再套一层分布式锁是不是能达到类似分布式事务的效果

A：<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">将本地事务外面包裹一层分布式锁可以在某些情况下提供一定程度的原子性和一致性，类似于分布式事务的效果，但并不能完全替代分布式事务</font>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"></font>

---

ZDAL 单库单表 / 分库分表两套数据源、事务管理器、事务模板



```json
   /**
     * 分库分表数据源
     */
    @Bean(initMethod = "init")
    public ZdalDataSource shardingDataSource() {
        return ZdalDataSourceBuilder.create()
            //应用数据源,实际使用时换成应用自身的数据源
            .appDsName("ilmprod_ds")
            //如果appName为当前应用,不需要声明该字段
            .appName("ilmprod")
            //应用数据源版本,实际使用时换成应用自身的数据源版本
            .version("EI63711501")
            //这里使用的示例数据源非dbMesh数据源
            .useDbMesh(false).build();
    }
```



```java
    /**
     * 分库分表事务管理器
     */
    @Bean
    public PlatformTransactionManager txManagerForSharding(@Qualifier(value = "shardingDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
```



```java
    /**
     * 分库分表的事务模板
     *
     * @param txManagerForSharding
     * @return
     */
    @Bean
    public TransactionTemplate transactionTemplateForSharding(
        @Qualifier(value = "txManagerForSharding") PlatformTransactionManager txManagerForSharding) {
        return new TransactionTemplate(txManagerForSharding);
    }
```



```java
    /**
     * 事务模版
     */
    @Autowired
    @Qualifier("transactionTemplateForSharding")
    private TransactionTemplate            transactionTemplateForSharding;


// 【使用】
transactionTemplateForSharding.executeWithoutResult(status -> {});
```





### 思考
> <font style="color:rgb(51, 51, 51);">直接用事务模板TransactionTemplate与使用@Trasaction注解，两者作用一样吗</font>
>

`**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">TransactionTemplate</font>**`**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">: ALMP用的都是这种</font>**

    - <font style="background-color:rgb(247, 249, 253);">编程式事务管理。</font>
    - <font style="background-color:rgb(247, 249, 253);">需要手动创建和使用 </font>`<font style="background-color:rgb(247, 249, 253);">TransactionTemplate</font>`<font style="background-color:rgb(247, 249, 253);"> 对象，并在代码中显式地定义事务的边界。</font>
    - <font style="background-color:rgb(247, 249, 253);">适合需要更细粒度控制事务行为的场景。</font>

```java
/** 单表事务模板 */
@Autowired
@Qualifier("transactionTemplateForSingle")
private TransactionTemplate                 transactionTemplate;

// 开启事务
return transactionTemplate.execute()
```





`**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">@Transactional</font>**`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">:</font>

+ <font style="background-color:rgb(247, 249, 253);">声明式事务管理。</font>
+ <font style="background-color:rgb(247, 249, 253);">通过注解自动管理事务，方法开始时自动启动事务，方法结束时自动提交或回滚。</font>
+ <font style="background-color:rgb(247, 249, 253);">更加简洁和易于理解，适合大多数场景。</font>



+ **<font style="background-color:rgb(247, 249, 253);">基本作用</font>**<font style="background-color:rgb(247, 249, 253);">:</font>
    - <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">两者都可以实现事务的提交和回滚，确保在数据库操作时的一致性。</font>
+ **<font style="background-color:rgb(247, 249, 253);">特性</font>**<font style="background-color:rgb(247, 249, 253);">:</font>
    - `<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">@Transactional</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">更加方便，适合简单的业务流程，能够自动处理异常的回滚。</font>
    - `<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">TransactionTemplate</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> 提供了更高的灵活性，可以用于复杂的事务控制、显式的事务管理和嵌套事务等。</font>

## 什么时候用分布式事务
> 时刻谨记这个case，拿GuliMall想一下！  两套库
>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务通常用于需要跨多个数据库或微服务进行一致性操作的场景。以下是一个简单的示例来说明何时该使用分布式事务。</font>

### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">示例场景：在线购物系统</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">假设我们有一个在线购物平台，涉及以下两个服务：</font>

1. **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">订单服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">：负责创建和管理订单。</font>
2. **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">库存服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">：负责管理商品库存。</font>

#### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">业务流程</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">用户下单时，系统需要执行以下步骤：</font>

1. <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">在</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">订单服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">中创建一个新订单。</font>
2. <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">在</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">库存服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">中减少对应商品的库存。</font>

#### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">问题场景</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">考虑以下可能发生的情况：</font>

1. **<font style="background-color:rgb(247, 249, 253);">成功创建订单但库存不足</font>**<font style="background-color:rgb(247, 249, 253);">：</font>
    - <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">用户在下单时，订单成功创建，但是在调用库存服务时发现库存不足。此时，订单已经创建，但商品库存却未更新，导致数据不一致。</font>
2. **<font style="background-color:rgb(247, 249, 253);">库存更新成功但订单创建失败</font>**<font style="background-color:rgb(247, 249, 253);">：</font>
    - <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">首先，库存服务成功减少了商品库存，但在订单服务中创建订单时发生了失败。此时，库存已被减少，但订单却未创建，同样造成数据不一致。</font>

#### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务的必要性</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">在上述场景中，为了确保数据的一致性：</font>

+ **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">需要使用分布式事务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">来确保这两项操作要么同时成功，要么同时失败。</font>
+ <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">例如，可以采用</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">两阶段提交（2PC）</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">协议，或者使用</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">Saga 模式</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">进行事务管理。</font>

### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">选择分布式事务的总结</font>
+ <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">当你的业务逻辑需要跨越多个数据库、微服务或外部系统，且这些操作之间存在强一致性要求时，应考虑使用分布式事务。</font>
+ <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务可以有效地解决因网络延迟、服务故障等引起的数据不一致问题。</font>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">这种情况下，若未使用分布式事务，可能导致系统出现不一致，最终影响用户体验和业务流程。因此，分布式事务在涉及复杂业务操作时显得尤为重要。</font>
