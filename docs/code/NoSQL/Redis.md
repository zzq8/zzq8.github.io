---
article: false
---
# Redis

Redis的速度⾮常的快，单机的Redis就可以⽀撑每秒十几万的并发，相对于MySQL来 说，性能是MySQL的⼏⼗倍。

> Q: Redis的lO性能比数据库高的原因是什么？
>
> 1. 基于内存，sql基于磁盘 - 所以少了一步磁盘IO      
> 2. 单线程模型 - 少了上下文切换开销
> 3. 非阻塞IO - 6.0往后出现**网络IO多路复用**    TODO？  允许一个线程同时监听和处理多个网络连接的 I/O 操作
> 4. **数据结构简单重设计** - SDS？压=      TODO？*Sds*（Simple Dynamic String，简单动态字符串）是Redis 底层所使用的字符串表示 
>    C 是char 不足（以空字符'\0'结尾） 总的来说，Redis 的 SDS 结构在原本字符数组之上，增加了三个元数据：len、alloc、flags，**用来解决 C 语言字符串的缺陷**
>    ----C语⾔实现，优化过的数据结构，基于⼏种基础的数据结构，redis做了⼤量的优 化，性能极⾼
>
> ***
>
> Q: 能说一下I/O多路复用吗？ 
>
> 引用知乎上一个高赞的回答来解释什么是I/O多路复用。假设你是一个老师，让30个 学生解答一道题目，然后检查学生做的是否正确，你有下面几个选择： 
>
> * 第一种选择：按顺序逐个检查，先检查A，然后是B，之后是C、D。。。这中间 如果有一个学生卡住，全班都会被耽误。这种模式就好比，你用循环挨个处理 socket，根本不具有并发能力。 **（XD 排队一个个检查）**
> * 第二种选择：你创建30个分身，每个分身检查一个学生的答案是否正确。 这种 类似于为每一个用户创建一个进程或者- 线程处理连接。 
> * 第三种选择，你站在讲台上等，谁解答完谁举手。这时C、D举手，表示他们解答 问题完毕，你下去依次检查C、D的答案，然后继续回到讲台上等。此时E、A又 举手，然后去处理E和A。 **（XD 举手到坐检查）**
>
> 第一种就是阻塞IO模型，第三种就是I/O复用模型。
> IO多路复用通过使用特定的系统调用（如 select、poll、epoll等）来解决这些问题。**这些系统调用允许我们同时监视多个I/O流，并在有 I/O事件准备好时进行通知。**

>  Redis 可以用来做限流(MQ)、**分布式锁、缓存**     发布订阅（publish、subscribe）
>
> [个人定制化总结，详细信息看课件！](尚硅谷_Redis6课件.pdf)
>
> [狂神说Redis笔记](狂神说Redis笔记_去水印.pdf)

## 0、限流 / 分布式锁 / 缓存

> 是的，Redis可以用于限流、分布式锁和缓存等功能。
>
> 1. 限流：通过利用Redis的数据结构和操作，如有序集合(sorted sets)、**带有过期时间的键**(keys with expiration)和原子操作(atomic operations)，可以实现限制请求处理速率的功能。
> 2. 分布式锁：Redis可以用于实现分布式锁，通过使用**SETNX（如果不存在则设置）**命令来确保在分布式环境下的互斥访问。通过获取锁的客户端可以执行临界区代码，其他客户端则需要等待或执行其他逻辑。
> 3. 缓存：Redis的主要功能之一是作为缓存存储，它提供了快速的读写操作和灵活的键值操作。通过将数据存储在Redis中，可以减少对后端存储系统（如数据库）的访问，从而提高系统的响应速度和性能。
>
> 需要注意的是，以上功能在Redis中是通过使用不同的数据结构和命令来实现的。因此，在具体实现时，需要根据业务需求和场景选择合适的Redis数据结构和操作。

当涉及到使用Redis在Java中实现限流、分布式锁和缓存时，以下是一些示例代码：

1. #### 限流：
```java
import redis.clients.jedis.Jedis;

public class RateLimiter {
    private Jedis jedis;
    private String key;

    public RateLimiter(String host, int port, String key) {
        jedis = new Jedis(host, port);
        this.key = key;
    }

    public boolean allowRequest() {
        long currentTimestamp = System.currentTimeMillis();
        long windowStartTimestamp = currentTimestamp - 1000; // 1秒的时间窗口
        long count = jedis.zcount(key, windowStartTimestamp, currentTimestamp);
        if (count < 10) { // 每秒限制10个请求
            jedis.zadd(key, currentTimestamp, String.valueOf(currentTimestamp));
            return true;
        }
        return false;
    }
}
```

2. #### 分布式锁：  

```java
import redis.clients.jedis.Jedis;

public class DistributedLock {
    private Jedis jedis;
    private String lockKey;
    private int lockTimeout = 30000; // 锁的超时时间，默认30秒

    public DistributedLock(String host, int port, String lockKey) {
        jedis = new Jedis(host, port);
        this.lockKey = lockKey;
    }

    public boolean acquireLock() {
        long startTimestamp = System.currentTimeMillis();
        while ((System.currentTimeMillis() - startTimestamp) < lockTimeout) {
            String result = jedis.set(lockKey, "LOCKED", "NX", "PX", lockTimeout);
            if ("OK".equals(result)) {
                return true;
            }
            try {
                Thread.sleep(100); // 等待一段时间后重试获取锁
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        return false;
    }

    public void releaseLock() {
        jedis.del(lockKey);
    }
}
```

3. #### 缓存：
```java
import redis.clients.jedis.Jedis;

public class Cache {
    private Jedis jedis;

    public Cache(String host, int port) {
        jedis = new Jedis(host, port);
    }

    public void set(String key, String value) {
        jedis.set(key, value);
    }

    public String get(String key) {
        return jedis.get(key);
    }

    public void expire(String key, int seconds) {
        jedis.expire(key, seconds);
    }
}
```

这些示例代码提供了基本的使用方法，但在实际应用中可能需要根据具体需求进行适当的调整和扩展。同时，请确保在使用完Redis资源后进行适当的资源释放和异常处理。





## 一、模拟手机验证码

### 1. 前置条件 - 改配置

> 不改就只能本机连接Redis

bind 127.0.0.1 # 绑定的ip     需要注掉

protected-mode yes # 保护模式   改成no



> 如果还连不上, 可以看下防火墙



### 2. 模拟业务场景: 手机验证码

![image-20220410204001304](https://images.zzq8.cn/img/202205171956974.png)

具体代码看文件



## 二、事务

多个事务是串起来的，也就是说不允许插队和并行, 序列化按顺序执行

> Multi (命令/组队阶段): 开启事务, 把命令放队列中, 类似MySQL的 start transaction
>
> Exec (执行队列)
>
> discard (命令): 类似回滚事务

![image-20220413201848353](https://images.zzq8.cn/img/202204132019207.png)



> 组队的时候有任何一个命令失败, 就都不会成功

![image-20220413203729944](https://images.zzq8.cn/img/202204132037991.png)



> 组队成功, 提交有成功有失败情况   也就是说:
>
> Redis单条命令式保存原子性的，但是**事务不保证原子性**！

![image-20220413205107400](https://images.zzq8.cn/img/202204132051128.png)



###  事务的冲突问题

> 解决方法: 悲观锁 / 乐观锁(默认)         Redis事务没有没有隔离级别的概念！
>
> 可以好好看下 **乐观锁**: 适用于多读的应用类型, 这样可以提高吞吐量.  更新的时候会判断你的版本号是否一致
>
> 乐观锁典型例子: **抢票** 可以很多人抢, 但只能一个人支付成功

![image-20220413211028112](https://images.zzq8.cn/img/202204132110320.png)

**乐观锁适用于多读的应用类型，这样可以提高吞吐量**。Redis就是利用这种check-and-set机制实现事务的。



### Watch 操作

>Redis测监视测试
>
>测试多线程修改值 , 使用watch 可以当做redis的乐观锁操作！

![image-20220413213359161](https://images.zzq8.cn/img/202204132133211.png)



### Redis 秒杀案例

![image-20210619095633057](https://images.zzq8.cn/img/202204161621469.png)

> Redis ab压测安装

```bash
yum install httpd-tools

ab -n 1000 -c 200 -p ~/postfile -T application/x-www-form-urlencoded http://192.168.1.107:8080/doseckill
```



> 问题：超卖 & 超时

Read timed out 解决：连接池

超卖：事务 + 乐观锁（Watch）

>如果不加watch (结合上面的Watch学习): 

秒杀已经结束了
秒杀成功了..





### LUA脚本解决库存遗留问题

> 已经秒光，可是还有库存。原因，就是乐观锁导致很多请求都失败。先点的没秒到，后点的可能秒到了。

我在执行过程中别人不能对我的操作进行插队和干预





后来补充：Gulimall 好像是Redission的信号量

## 三、持久化

### RDB

Redis 会**单独fork一个子进程来进行持久化**：

首先将数据写入到一个临时文件中，等所有持久化过程全部结束了，再用**临时文件替换上次持久化好的文件**。（理解的不是很透彻）

但是最后一次持久化后的数据可能丢失（好理解）



### AOF（Append Only File）

以日志的形式来记录每个写操作，只许追加文件但不可以改写文件

AOF **默认不开启**



> 如果RDB 和 AOF都开启了，默认是听AOF的
>
> 场景: 
>
> 1. 我config刚打开AOF的yes
> 2. kill掉进程重启
> 3. ll命令发现多了AOF文件大小为0字节
> 4. 这个时候keys * 会发现数据库为 **空** 的



## 四、主从复制

>正常一台linux一个Redis，这里通过端口号模拟

### 1. 搭建一主多从

1. 整个文件夹搞三个配置文件
```bash
include ./redis.conf
pidfile ./redis_6379.pid
port 6379
dbfilename dump6379.rdb
masterauth 547061946   # 别忘记这一步，如果有密码的话！
```

2. 分别启动，通过命令 `slaveof ip port` 搞两台从机
注意：如果主机Redis有密码则从机的配置文件还要加一句 masterauth xxx

配置完后，只能主机写操作，从机只能读操作



### 2. 复制原理

>这里只介绍表象，具体原理看课件
>
>在Redis命令中shutdown 就相当于这台服务器挂掉了，对应的看ps命令这个端口的进程也没了

从服务器挂掉了：
1. 搞台从机shutdown
2. 主机存几个值
3. 恢复从机发现之前挂掉时，主机存的值自己这里没有（A: 因为重启后自己变成了主服务器，需要再转成从服务器才能看到值）

主服务器挂掉了：
从服务器还是从服务器，且主服务器恢复后仍是主服务器（和上面不同）



### 3. 薪火相传

贴个图意思就是一条线串起来，压力就没那么大了

![image-20220510145507853](https://images.zzq8.cn/img/202205171953830.png)

区分：一主二仆

![image-20220510145619913](https://images.zzq8.cn/img/202205171953801.png)

### 4. 反客为主

主服务器 shutdown ，从服务器 slaveof no one，就会变成主服务器 【缺点：但是是手动完成的】 
且之前挂掉的主服务器重连还是主服务器，就2主一从了
进阶：想让上面的自动完成且优化 -> 哨兵模式



### 5. 哨兵模式

反客为主的自动版
能够后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库

折腾半天：redis 哨兵模式启动没有检测到从机         看图，我没配密码
```bash
sentinel monitor mymaster 127.0.0.1 6379 1
sentinel auth-pass mymaster 547061946 # 别忘记这一步，如果有密码的话！ 
```
https://blog.csdn.net/qq_45950109/article/details/115014763
投票是根据这个参数来的 ：replica-priority 100，注意是 ->  谁小投谁


完成后的现象：主机挂了，从机投票出一台当主机，主机重连后变成从机



## 五、集群

>扩容 / 并发写 可用集群，具体看课件

一个集群至少要有三个主节点

好处：实现扩容，分摊压力（插槽）、无中心配置相对简单
缺点：多建操作mset这种不被支持 etc.
无中心化集群，可以贴一下图

![04-集群简介](https://images.zzq8.cn/img/202205171953203.png)注意旧版本还得装ruby环境    有没有这个环境可以看下src目录有没有redis-trib.rb

集群搭建好后，cli连接要用集群的方式连接 -c
`redis -cli -c -p 6379`   这里用任何一个端口都是可以的6379、6380、6381。因为是无中心化集群，任何一台都可以作为集群的一个入口


贴一个插槽的图，每set一个值会有算法计算对应的插槽值【不是随机是跟hash一样固定的】
插槽作用：从6379中set一个值，发现计算后插槽范围在6380中，就会切换到6380做这个set操作
mset操作set多个值是会报错的，因为没法计算插槽范围。如想完成mset操作就需要用到组的方式给这一组set数据一个组名，计算插槽时按这个组名来





## [六、Redis应用问题](尚硅谷_Redis6课件.pdf)

> 缓存穿透/击穿 可以封装成工具类，给后面复用。  例如heima的视频，就活用泛型+lambda写这个工具类

### 1. 缓存==穿透==

> 空结果缓存||布隆过滤器：解决缓存穿透

>现在明了了，原来是这么回事，看例子！

一般是黑客恶意攻击：访问数据库中压根就不存在的数据
例如blog/30 后面30对应的是我java那篇文章，而我31是没有文章的404，黑客明知道但就是一直访问这个不存在的资源，导致数据库查询不存在数据

解决方案看课件
1）可对数据库中不存在的数据做缓存，对空值缓存   例如 31：null   设置个短的过期时间，这种方式只是个简单的应急方案

2）**看网上说限制 ip 访问次数感觉也不错**（XD：nginx 根据access.log写一段脚本）

3）布隆过滤器：**说这个元素不在这个集合中就一定不在**   存在有极小概率存在误判可能（XD 有点搞混 不在就一定不在  判断在可能是hash冲突到了）
原理：在Client with Redis 之间又加一层    把数据经过某种hash算法，hash值再转变成二进制位放到布隆过滤器里     ==（除非特别大的业务，实际生产不会用到的！！！）==

1) **布隆过滤器的底层数据结构可以理解为bitmap,bitmap也可以简单理解为是一个数组，元素只存储0和1，所以它占用的空间相对较小**

2) 布隆过滤器是可以以较低的空间占用来判断元素是否存在进而用于去重，但是它也有对应的缺点
   只要使用哈希算法离不开「哈希冲突」，导致有存在「误判」的情况


实际解决办法就是先报警，网警

### 2. 缓存==击穿==

> 加锁：解决缓存击穿  //其它两个好解决，这个代码层面加锁如果加不好又会产生很多问题    加锁是一种解决方案把其它挡外面

[看课件](尚硅谷_Redis6课件.pdf#16Redis应用问题解决)  key 可能会在某些时间点被超高并发地访问，是一种非常“热点”的数据。这个时 候，需要考虑一个问题：缓存被“击穿”的问题。

1）预热（后台改改热点数据的ttl）

2）互斥锁（Mutex）或分布式锁（Distributed Lock）【setnx / Redisson】

3）逻辑过期（并不会真的设置TTL，加了个时间字段记录过期时间 -> Bean[data,expireTime] 可理解为数据库的逻辑删除字段）判断如已过期会缓存重建

### 3. 缓存雪崩

> 设置过期时间（加随机值）：解决缓存雪崩

好理解的解决方案：将缓存失效时间分散开   第一个缓存5分01秒，第二个缓存5分07秒搞个随机数分散开
降级限流、多级缓存



## 七、分布式锁

就是给集群中某一台服务器加一把锁，其他的服务器也能看到这把锁。共享锁

分布式锁主流的实现方案：

1. 基于数据库实现分布式锁

2. 基于缓存（Redis等）

3. 基于Zookeeper

每一种分布式锁解决方案都有各自的优缺点：

1. 性能：redis最高

2. 可靠性：zookeeper最高

这里，我们就基于redis实现分布式锁。



具体操作：

上锁，设置过期时间。两条命令【Redis单条命令式保存原子性的，但是事务不保证原子性！】所以会有问题，可能上完锁服务器宕机就没设置过期时间，会导致这把锁一直不会释放。

正确做法：一条命令解决上锁同时设置过期时间



Q：锁误释放问题

A：优化之UUID防误删



Lua 脚本原子性，在执行的时候别人不能打断







## 八、Other

> java 这个方法接下来都是要操作指定key的crud。有一个api bound  





## 九、如何设计一个排行榜？

https://www.yuque.com/snailclimb/mf2z3k/hbsnl8?pwd=cnk4

Redis 有序集合 Zset(sorted set) 



总结

上面我一共提到了两种设计排行榜的方法：

1**MySQL 的 ORDER BY 关键字**
2Redis 的 sorted set

其实，这两种没有孰好孰坏，还是要看具体的业务场景。如果说你的项目需要排序数据量比较小并且业务场景不复杂的话（比如你对你博客的所有文章按照阅读量来排序），我觉得直接使用 MySQL 的 ORDER BY 关键字就可以了，没必要为了排行榜引入一个 Redis。

另外，在没有分页并且数据量不大的情况下，直接在前端拿到所有需要用到的数据之后再进行排序也是可以的。
