# 分布式高级

> [项目视频地址](https://www.bilibili.com/video/BV1np4y1C7Yf/)，碰到忘记点搜本笔记配合视频再度复习！[自己代码地址](https://github.com/1024zzq/gulimall)
>
> Google 到的笔记，很详细比视频评论下我看初级篇找的要详细：[别人笔记](https://blog.csdn.net/hancoder/article/details/106922139) [还是评论区的更贴近视频](https://gitee.com/AdverseQ/gulimall_Advanced)  [别人代码](https://github.com/NiceSeason/gulimall-learning)  建议搭配食用
>
> 我看到后面看的两篇别人的笔记 [一](https://gitee.com/lemon_wan/gulimall/blob/dev/%E9%AB%98%E7%BA%A7%E7%AF%87.md#8%E6%94%AF%E4%BB%98)    [二](https://github.com/NiceSeason/gulimall-learning/blob/master/docs/%E8%B0%B7%E7%B2%92%E5%95%86%E5%9F%8E%E2%80%94%E5%88%86%E5%B8%83%E5%BC%8F%E9%AB%98%E7%BA%A7.md#6-%E6%94%AF%E4%BB%98)
>
> 个人认为<font color=red>新增商品，商品上架，保存订单数据，支付</font>这四个功能为该项目最折磨人功能，一P能卡一两天

### 前言

视频中雷神stream循环查库了，我问了ChatGPT：

> Q: 如何避免stream循环查库
>
> A: 下面是一些避免stream循环查询数据库的常见方法：
>
> 1. 利用缓存：在访问数据库前，先从缓存中查找所需的数据，只有在缓存中没有找到时才会查询数据库。
> 2. 批量读取：对于一次需要多次查询数据库的操作，可以通过一次性读取多条记录，而不是对每一条记录单独读取，从而减少数据库的读取次数。
> 3. 延迟加载：可以通过延迟加载技术，在需要时再读取数据库，而不是在一开始就读取。
> 4. 分页：对于大量的数据，可以通过分页的方式，分批读取数据，减少单次读取数据的量。
>
> 这些方法都可以减少stream循环查询数据库的次数，提高代码效率。



==高并发三宝：缓存、异步、消息队列==

### 商品上架

由于是结合 ES 的，我这里就看视频 CV 了。视频给我的感觉还挺繁琐的！



发请求是得益于 Fegin 的 MethodHandle，在**发请求之前会把请求的数据编码成 JSON**        XD：我想的是它可以看成HTTP+JSON

接受请求体的 JSON 转成 List 得益于 SpringMVC 

```java
@PostMapping(value = "/product")
    public R productStatusUp(@RequestBody List<SkuEsModel> skuEsModels) 
```





# 一、商城业务/架构

> Q：静态资源放 nginx
>
> A：反证法 -> 请求个图片都要到后台，假如 3k 个请求 2k 都是静态资源请求，真正处理业务的就 1k 拖慢
>
>
> QAQ：视频中繁琐的，异常类中的各种常量Enum，各种封装的VO。封装API跨服务调用。返回值R  //这个叫分层思想，又不是写学生作业，什么都混一起，能用就行

![image-20221207164702704](https://images.zzq8.cn/img/202212071647791.png)

独立自治：不局限于 Java 也可以用 php..







## 1.Nginx

> 由于这里需要本地开虚拟机操作，我跳过了！如果我要用云服务的Nginx有没有解决方法？ 内网穿透？？？TODO 待定
>
> 注意点：Nginx 代理后会丢失很多东西，比如 host 就是。所以需要注意，看图片红色部分

![image-20221224145341950](https://images.zzq8.cn/img/202212241453788.png)

这两块流程具体看我的 Nginx 笔记

### Nginx反向代理流程：

1. 本地配Hosts gulimall.com 127.0.0.1
2. 虚拟机 Nginx 代理 Hosts 里面配的域名转发到 网关（Nginx配置记得set Host不然会丢失）
3. 网关配置匹配host到指定的 product 集群

各个模块在host给一个二级域名

Nginx代理*.gulimall.com丢给网关

网关再根据二级域名给断言路由到各个模块





### Nginx 动静分离

配置一个 location 静态资源就到 Nginx 拿了！





## 2.Thymeleaf

为了教学目的考虑：加 Thymeleaf 并关闭缓存

vue 是客户端渲染，模板引擎是服务端渲染



### 2.1 视图映射

> 发送一个请求直接跳转到一个页面。  ->  SpringMVC viewcontroller;将请求和页面映射过来
>
> **视图映射：请求直接跳转页面的，用这种方式！不写空方法了**

```java
@Configuration
public class GulimallWebConfig implements WebMvcConfigurer {

    /**    
     *     @GetMapping("/login.html")
     *     public String loginPage(){
     *         return "login";
     *     }
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //路径映射：直接写哪个请求映射哪个页面就行，无需写多余的Controller 【注意：默认都是Get方式访问的】
        registry.addViewController("/login.html").setViewName("login");
        registry.addViewController("/reg.html").setViewName("reg");
    }
}
```



### 2.2 Model / RedirectAttributes

可以往 Thymeleaf 携带参数，模拟的 HttpSession

Model 数据是在请求域中的！  vs   RedirectAttributes 重定向视图（addFlashAttribute方法代表只需要取一次！跳转取到后刷新页面就没了  | addAttribute():将数据放在url后面）



* 重定向携带数据,利用session原理.将数据放在session中.

* 只要跳到下一个页面取出这个数据以后,session里面的数据就会删掉

  

**问题：但是他是利用的session原理，所以后期我们需要解决分布式的session问题**





# ==二、性能压测==

## 1）前言

> 微服务模块在上线之前乃至上线之后都会进行压力测试   老师讲课时基本都是50线程持续压

==先说答案：CPU核心数和线程数量没什么必然的关系。==    线程是运行在内存中的，因此系统内存的大小也会影响可以创建的线程数
你可以在只有一个核心的CPU上创建任意多线程，也可以在有多个核心的CPU上创建一个线程。要想充分利用多核，一般来说线程数至少不能少于核心数。

压测目的：首先考虑自己的应用属于 **CPU 密集型 还是 IO 密集型**

例如中间件多是计算基本是 CPU 密集型（Nginx、网关）

* 考察当前软硬件环境下系统所能承受的最大负荷并帮助找出系统瓶颈所在
* 使用压力测试，我们有希望找到很多种用其他测试方法更难发现的错误。有两种错误类型是: 内存泄漏，并发与同步。

## 2）压力测试-线程

重要指标-吞吐量：

* TPS（Transaction per Second）：系统每秒处理交易数，单位是笔/秒。（不能狭义的理解为数据库的事务，而是走完整个事务的流程  电商要求高）

* QPS（Query per Second）：系统每秒处理查询次数，单位是次/秒。对于互联网业务中，如果某些业务有且仅有一个请求连接，那么TPS=QPS=HPS，一般情况下用 TPS 来衡量整个业务流程，用 QPS 来衡量接口查询次数，用HPS 来表示对服务器单击请求。

重要指标-吞吐量：

* 最大响应时间（Max Response Time） 指用户发出请求或者指令到系统做出反应（响应）的最大时间。 
* 最少响应时间（Mininum ResponseTime） 指用户发出请求或者指令到系统做出反应（响应）的最少时间。
* 90%响应时间（90% Response Time） 是指所有用户的响应时间进行排序，第90%的响 应时间。

重要指标-错误率



注意：如测首页不精准只拿了html数据，而我们需要模拟更真实的全量数据（image、js、css），需要到JMeter HTTP请求高级部分设置

JMeter 可以设置中文

JMeter 一般就看结果树、汇总报告、聚合报告

JMeter 压测的时候搭配 jvisualvm 看图形化分析



## ==3）性能监控-JVM==

> 这几集才是成长的精髓啊 以前都不知道这东西
>
> 优化期间看图标衡量这些指标：看当前应用是卡在 cpu 的计算了  还是内存经常容易满   还是线程数不够运行太慢 ...

jconsole 与 jvisualvm（更推荐）

直接 cmd 输入 jconsole/jvisualvm 即可打开，看到内存占用是我在 idea 设置的 vm option 100 头一次知道还有这个功能！

jvisualvm 能干什么 监控内存泄露，跟踪垃圾回收，执行时内存、cpu 



安装插件方便查看 gc: ==感觉这有点 JVM 调优那味了== 可以和面试官唠唠！

因为我这个项目 -Xmx 只给了 100MB 一下就满了要回收导致 图 频繁GC直角三角形，所以多给点空间肯定能提升性能！

可用插件 -> Visual GC





## ==4）两者结合-压测同时看性能==

各个中间件的压测数据：04、性能与压力测试.pdf      其实浏览器F12也可以看到一个响应时间也可做一部分依据

==该表极具学习价值：==

| 压测内容                             | 压测线程数 | 吞吐量/s            | 90%响应时间/ms | 99%响应时间 |
| ------------------------------------ | :--------- | ------------------- | -------------- | ----------- |
| Nginx                                | 50         | 2335                | 11             | 944         |
| Gateway                              | 50         | 10367               | 8              | 31          |
| 简单服务                             | 50         | 11341               | 8              | 17          |
| 首页一级菜单煊染                     | 50         | 270（db,thymeleaf） | 267            | 365         |
| 首页染（开缓存）                     | 50         | 290                 | 251            | 365         |
| 首页染（开缓存、优化数据库、关日志） | 50         | 700                 | 105            | 183         |
| 三级分类数据获取                     | 50         | 2（db）/8（加索引） |                |             |
| 三级分类（优化业务）                 | 50         | 111                 | 571            | 896         |
| 三级分类（使用redis 作为缓存）       | 50         | 411                 | 153            | 217         |
| 首页全量数据获取                     | 50         | 7（静态资源）       |                |             |
| Nginx+Gateway                        | 50         |                     |                |             |
| Gateway+简单服务                     | 50         | 3126                | 30             | 125         |
| 全链路                               | 50         | 800                 | 88             | 310         |



中间件越多，性能损失越大，大多都损失在网络交互了； 

业务： 

* Db（MySQL 优化）
* 模板的渲染速度（缓存）
* 静态资源



# 三、缓存

## 1）前言

> 这个项目代码里很多 stream 中循环查表了！  看本文开头
>
> 初步解决：优化代码 -> 一次性查出所有数据，需要的时候再通过集合操作去filter拿对应的
>
> 提升：例如首页的菜单基本不怎么变，进一次首页就要查一次 考虑  **缓存**

缓存的技术有很多 -> 最简单的缓存技术可以用 Map（本地缓存）：声明个Map到最外圈，方法里面if这个Map有没有缓存

```java
//如果缓存中有就用缓存的
 Map<String, List<Catelog2Vo>> catalogJson = (Map<String, List<Catelog2Vo>>) cache.get("catalogJson");
 if (cache.get("catalogJson") == null) {
     //调用业务
     //返回数据又放入缓存
 }
```

问题：

1. 只适用于单体应用，分布式下会每个一份
1. 修改没法附带其它服务器一起改缓存（**数据一致性问题**）



解决:

不应该存本地服务器，应该在集群服务器上面加一层 中间件 Redis 

注意：**分片存概念**：集群的Redis 1号存id为1-1w的数据 2号存2-3w的数据以此类推

> Redis 分片是一种将数据分散存储在多个 Redis 节点上的技术，它可以扩展 Redis 存储容量和吞吐量，以满足大规模应用程序的需求。在 Redis 分片中，数据被分割成多个较小的数据片段，每个数据片段存储在一个单独的 Redis 节点上。通过将数据分散存储在多个节点上，可以将负载均衡到多个节点上，提高系统的可扩展性和可靠性。
>
> Redis 分片的实现方式通常是将数据根据其键进行哈希，然后将哈希结果映射到不同的 Redis 节点上。具体来说，可以使用一致性哈希算法来实现 Redis 分片。在一致性哈希算法中，每个 Redis 节点被分配一个哈希值，每个键也被映射到一个哈希值。当需要将数据存储到 Redis 中时，可以使用一致性哈希算法将键哈希为一个值，然后将值映射到一个 Redis 节点上，从而将数据存储在相应的节点上。





## 2）Redis使用

### 2.1 引入 Redis：注意 -> 云服务器redis不设密容易被挖矿

1. 引入 pom
2. **no-sql 和sql一样配地址密码**
3. 使用，建议先来个单元测试



<font color=red>==缓存中存的数据是json字符串==</font>   一般都是用 StringRedisTemplate 够用    注意：至于为什么看自己[Redis笔记](../NoSQL/RedisAdvanced#反序列化问题-StringRedisTemplate)，这个也可操作Hash

<font color=red>原因：JSON跨语言。跨平台兼容。  因为微服务各个模块不一定是用java写，php写的也可以去拿json。 <br>但是如果存的是java序列化对象php没用整个java系统不能解析。而JSON全语言全平台</font>



com.alibaba.fastjson.JSON（jackson也有这个类）     ->   `TypeReference`

jackson都是操作ObjectMapper这个对象进行序列化、反序列化     XD：Jackson笔记官方的，更偏向于它 -> ObjectMapper

```java
String json = JSON.toJSONString(map);   //对象 -> Json
/**
 * Json -> 对象
 * 重点：protected TypeReference()  构造方法是protected所以需要匿名创建
 */
JSON.parseObject(catalogJson, new TypeReference<Map<String, List<Catelog2Vo>>>(){})
    
-----------------jackson 获取json字符串指定key的value值------------------------
	// 创建 ObjectMapper 对象   
    ObjectMapper mapper = new ObjectMapper();
	// 将 JSON 字符串转换为 JsonNode 对象
	JsonNode jsonNode = mapper.readTree(user);
	// 获取指定 key 的 value
    String id = jsonNode.get("id").asText();
    socialUser.setSocial_uid(id);
-----------------------------------------

<!--   反序列化报错（autoType）因为fastjson的漏洞解决: 我这里是降到有漏洞的版本     /  按官网加配置-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.47</version>
        </dependency>
    
    
    后面我光order模块总是有这个问题，其它通过上述解决。不想再纠结了，就换了一个序列化
    https://blog.csdn.net/qq_40265247/article/details/114374706


-----------------Boke Company 我常用------------------------
  ObjectMapper mapper = new ObjectMapper();
  //Map<String, Object> map = mapper.readValue(s, new TypeReference<Map<String, Object>>() {});
  //一般二开不复杂，就把map对象转一下。传前端 JsonNode
  JsonNode jsonNode = mapper.convertValue(map, JsonNode.class);
  return jsonNode;
```



转 JSON对象 注意不是 String！！！

> 我测出的两种好一点的方法：

```
		ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.convertValue(res, JsonNode.class);
        JsonNode jsonNode1 = mapper.valueToTree(res);
```





### 2.2 lettuce堆外内存溢出bug

> 这不就是面试中常问的"开发中遇到什么困难,怎么解决的嘛"
>
> **lettuce和jedis是操作redis的底层客户端**，RedisTemplate是再次封装

##### 单个自己测单线程没问题，但当进行压力测试时后期会出现**堆外内存溢出OutOfDirectMemoryError**

产生原因：lettuce 可能没有及时释放掉内存，导致堆外内存溢出。（源码体现某一块可能没有减内存导致溢出）

1)、**springboot2.0以后默认使用lettuce作为操作redis的客户端**，它使用netty进行网络通信（优点，所以吞吐量是极大的。而Jedis比较老了）

2)、lettuce的bug导致netty堆外内存溢出。**netty如果没有指定堆外内存，默认使用Xms的值，可以使用-Dio.netty.maxDirectMemory进行设置**

解决方案：由于是lettuce的bug造成，不要直接使用-Dio.netty.maxDirectMemory去调大虚拟机堆外内存，治标不治本。

1)、升级lettuce客户端。但是没有解决的
2)、[切换使用jedis](https://blog.csdn.net/weixin_43878332/article/details/113944197)



摘自弹幕：
2022 2 13 表示和老师同样的版本还会出现和老师同样的问题
其它高版本或许没有这个问题
如果不想改成jedis 先exclusion排除 然后导入letture依赖5.2.*版本的也行 5.2.0.RELEASE亲测可用



JMeter

| 压测内容             | 压测线程数 | 吞吐量/s | 90%响应时间 | 99%响应时间 |
| -------------------- | ---------- | -------- | ----------- | ----------- |
| 三级分类（优化业务） | 50         | 2        | 21481       | 22192       |

压测时候 redis上显示timeout连接超时，自己加了配置 timeout 改大了就行

😡但是我发现 idea 改 yaml 时候点击 build 能编译到 target 但是运行起来修改的这个timeout却还是原先的没有改变，不知道这个参数是不是 Redis 刚跑的时候拿的后面就算修改也不会再去拿了



### 2.3 ==Redis 三大问题==

> [自己的笔记](../NoSQL/Redis)

1）、读模式

* 缓存穿透【空结果缓存||布隆过滤器】

* 缓存雪崩【加随机时间】

* ==缓存击穿【加锁】==  //其它两个好解决，这个代码层面加锁如果加不好又会产生很多问题

  * 使用`sync = true`来解决击穿问题

  

2)、写模式：（缓存与数据库一致）

* 读写加锁。
* 引入Canal，感知到MySQL的更新去更新Redis
* 读多写多，直接去数据库查询就行



3）、总结：

* 常规数据（读多写少，即时性，一致性要求不高的数据，完全可以使用Spring-Cache）：
* 写模式(只要缓存的数据有过期时间就足够了)
* 特殊数据：特殊设计



加锁初体验：

1. 加本地锁 Synchronized / JUC（Lock）这些都只放在单体应用的话都可以叫本地锁，
   在分布式环境下这些JUC类都没法用 想用的话得用 [Redisson](https://github.com/mrniko/redisson) (Java implementation) 它对这些类封装成了分布式可用的！
2. 因为会有集群环境，即每个应用一把锁。所以得用**分布式锁**   本地锁的this只能锁住当前服务

本地锁体现：因为只锁当前服务，所以下图每个服务都会走一遍数据库。而我们正常想要的是所有服务有一个走了数据库就行了其它用缓存

<img src="https://images.zzq8.cn/img/202212261651183.png" alt="image-20221226165114071" style="zoom:50%;" />



加锁问题：查询数据库的业务执行了两次

```java
//TODO 这里查了两次数据库   原因是锁的时序问题具体看资料图，这个方法完了放入redis的操作没在锁里。所以交互的空隙后面排队的乘空隙判断redis里没数据
//解决办法：把redis set也放到这个synchronized块里
```

解决：查完后+放缓存 这两步得保证是一个原子操作！在同一把锁内进行的



## 3）分布式锁

> 注：我这里 3）4) 都没有手动敲，印象没有那么深刻。以后再回顾，先往下赶进度了

> 结合前面的笔记 +  [以及自己有篇笔记](../DistributedLock/DistributedLock.md#分布式锁)
>
> 分布式项目时，但本地锁只能锁住当前服务，需要分布式锁
>
> redis自己实现分布式锁的最大的问题就是自旋，自旋消耗cpu资源，所以还是得中间件进行拿阻塞，比如zookeeper

正规笔记看我另一篇笔记，现在是我看视频我接地气的理解：

#### 加锁：

1. xshell多开，通过撰写栏同时执行  `set K V NX` 【保证只有一个线程会拿到锁，独占排它 ==这是分布式锁的基本原理！==】
   * 前提，锁的key是一定的，value不重要。重点是排它  作为一把锁来用
   * 题外：Xshell多窗口同时输入命令  窗口 -> 撰写栏
2. 代码初步写好，发现会有死锁问题！expire【防宕机没释放锁，导致死锁】  while好一点，这里递归太容易内存溢出![image-20221226183938038](https://images.zzq8.cn/img/202212261839248.png)
   * 问题来了：设置锁和设置过期时间 java代码体现得有两行。没有原子性！ 换成一行的 API 是有的！

#### 解锁：

3. 业务还没处理完锁就过期，这时候又去删锁就是删别的线程的锁了！【value利用起来，用来辨别当前锁是不是自己拿着】

* 问题来了：与Redis有个网络IO。去的时候判断是自己的锁，回的途中时间过期别的线程占了这把锁   而此时我却删了它！没锁住！
  即  **获取值对比（去）+对比成功删除（回）=原子操作**【[Lua 脚本原子删锁](http://www.redis.cn/commands/set.html)】  不然就会出现上述问题

4. 难点：解决 No.3 的难点，业务还没处理完。这时候锁需要自动续期（Redisson有个看门狗）



总结：原子加锁、原子解锁、续期不想做了就把锁时间搞长一点（加锁解锁都是这段代码可以封装工具类，**但是分布式锁有更专业的框架！**）
官网给出了以上流程，在 setnx 中，最后的总结说**不推荐**用这种，[并指出了更专业的：Redlock](http://www.redis.cn/commands/set.html) -> [Redisson](https://github.com/mrniko/redisson) (Java implementation).



## [4）分布式锁-Redisson](https://github.com/redisson/redisson/wiki/8.-%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81%E5%92%8C%E5%90%8C%E6%AD%A5%E5%99%A8)

它是底层基于Redis实现了一系列的工具（分布式的可伸缩的java工具）

> JRedis、Lettuce一样都是 Redis 的JAVA客户端 / **redisson是作为分布式锁的客户端  只不过更强大提供分布式解决方案，我觉得可理解为再把JUC包了一层适用于分布式了，而JUC是单体。同样有加锁、信号量等后面项目用到的点！**
>
> 在分布式环境下这些本地锁JUC类都没法用 想用的话得用 [Redisson](https://github.com/mrniko/redisson) (Java implementation) 它对这些类封装成了分布式可用的！
>
> 
>
> Q：Redisson和redis有什么关联吗
> 总之，Redisson 和 Redis 之间密切相关，Redisson 是 Redis 的一个客户端，并且对 Redis 进行了封装和扩展，提供了更方便的 Redis 功能和更多的分布式功能。

> 突然又看到官网：
> **Redisson 是具有内存数据网格功能的 Redis Java 客户端**。它提供了更方便和最简单的方式来使用 Redis。Redisson 对象提供关注点分离，使您可以专注于数据建模和应用程序逻辑。
>
> OpenAI:
>
> Redisson是基于Redis的分布式Java对象和服务框架。它提供了一系列的分布式Java对象，例如分布式Map、分布式Set、分布式List等等，这些对象都是通过Redis进行存储和同步的。
>
> Redisson可以用来解决分布式系统中的一些常见问题，例如分布式锁、分布式集群选举、分布式对象存储和分布式限流等。Redisson支持多种部署模式，包括单机模式、哨兵模式、集群模式和云托管模式等，可以适应不同的部署需求。
>
> 除了基本的分布式对象，Redisson还提供了一些高级特性，例如分布式计数器、分布式BitSet、分布式消息队列等等，可以满足更加复杂的分布式应用场景。
>
> 总的来说，Redisson是一个功能强大的分布式Java框架，可以帮助开发者更加容易地构建分布式应用。

> Q: 老师，问您个很简单的问题我不太懂，就是咱们这个不是一个单体项目嘛，怎么还用到了分布式锁呢？我以为只有分布式项目才会用到分布式锁呢哈哈哈
>
> A: 单体项目也可以水平扩展，部署多个机器，构成负载均衡集群。此时如果需要加锁，可能就需要分布式锁了

![image-20230304152602369](https://images.zzq8.cn/img/202303041526511.png)

pom start好处什么都配好了，只需要写两三个配置就行。而这里我们引入单纯的 Redisson 以学习为目的都自己搞一下

注意：redission 听听就好，后面还会讲导入 cache、Redis 两个Start 一配置类 后面就直接用注解了方便的很

具体：看GitHub的Redisson官方文档就行，有中文。看着配：视频以程序化配置讲解

### 4.1 初体验

> 看下面代码注释！理清看门狗    结合官方文档

基于Redis的Redisson分布式可重入锁[`RLock`](http://static.javadoc.io/org.redisson/redisson/3.10.0/org/redisson/api/RLock.html) Java对象实现了`java.util.concurrent.locks.Lock`接口。
也就是如果学过 Lock 就不用再花时间成本学了，都是一样的API。厉害的点是：一个本地锁一个分布式锁



优秀的地方：模拟两个服务，业务处理3秒。第一个服务处理业务途中给停掉还没有释放锁，第二个服务此时发现过一过时间还是能拿到锁！【有ttl默认30s】
没有手动解锁它也会给解锁 
看Redis的表现：锁的ttl30，刷新到18..再刷新又变成了30   看来是实现了自动续期【**看门狗**】   ==注意：用带参参构造就不会用看门狗==

```java
// 参数为锁名字  锁的粒度，越细越快。   即名字可以细致一点 不要很多都公用一把锁
// 锁的粒度：具体缓存的是某个数据，11-号商品； product-11-Lockproduct-12-Lock product-Lock
RLock lock = redissonClient.getLock("CatalogJson-Lock");//该锁实现了JUC.locks.lock接口

    /**
     * 问题：Lock.Lock（10,TimeUnit.SECONDS）在锁时间到了以后，不会自动续期。
     * 1、如果我们传递了锁的超时时间，就发送给redis执行脚本，进行占锁，默认超时就是我们指定的时间
     * 2、如果我们未指定锁的超时时间，就使用30*1000【LockWatchdogTimeout看门狗的默认时间】；
     * 只要占锁成功，就会启动一个定时任务【重新给锁设置过期时间，新的过期时间就是看门狗的默认时间】每隔10s续期续成30s看下行
     * internalLockLeaseTime【看门狗时间】／3,10s  续期  默认30s-20>=10给恢复到30
     * //最佳实战
     * //1）、Lock.Lock（30,TimeUnit.SECONDS）省掉了整个续期操作。手动解锁         注意：有参构造没用看门狗
     */
lock.lock();//阻塞式等待，以前是自旋  这里的加锁是给 redis 给的Key里放UUID+线程号和之前是差不多的

// 解锁放到finally // 如果这里宕机：有看门狗，不用担心
lock.unlock();
```





还有一些其它锁，API和JUC差不多
例如读写锁可以看看[自己笔记](../juc/juc#4） 独占锁（写锁） / 共享锁（读锁） / 互斥锁)



## 5）分布式锁-缓存数据一致性

> 缓存里面的数据如何和数据库保持一致，针对读多写少的场景
>
> 缓存本来保证的就是 最终一致性，反正有 ttl 失效后重查放入缓存就又是最新数据了

<img src="http://image.zzq8.cn/img/202308231025871.png" alt="image-20230314161335765" style="zoom: 67%;" />

### 1）、双写模式：写数据库后，写缓存

问题：脏数据（No.1写完数据库还没写缓存，此时 No.2也写完这两个了。这时No.1再写缓存就覆盖No.2的新数据了）

<img src="https://images.zzq8.cn/img/202212271758645.png" alt="image-20221227175831418" style="zoom:50%;" />

解决：加锁写数据和写缓存锁一起



### 2）、失效模式：写完数据库后，删缓存（推荐）

解决：可以 读写锁  但是如果不关心这些数据有点延迟也没关系那就不加锁没事。例如 iphone 11刚发布的商品介绍变了点参数我晚一点看也不影响

<img src="https://images.zzq8.cn/img/202212271819194.png" alt="image-20221227181939118" style="zoom: 67%;" />



解决方案：

如果是用户纬度数据（订单数据、用户数据），这种并发几率非常小，不用考虑这个问题，缓存数据加上过期时间，每隔一段时间触发读的主动更新即可
如果是菜单，商品介绍等基础数据，也可以去使用canal订阅binlog的方式
缓存数据+过期时间也足够解决大部分业务对于缓存的要求。
通过加锁保证并发读写，写写的时候按顺序排好队。读读无所谓。所以适合使用读写锁。（业务不关心脏数据，允许临时脏数据可忽略）；

总结：

我们能放入缓存的数据本就不应该是实时性、一致性要求超高的。所以缓存数据的时候加上过期时间，保证每天拿到当前最新数据即可。
我们不应该过度设计，增加系统的复杂性
遇到实时性、一致性要求高的数据，就应该查数据库，即使慢点。

### 5.1 Canal 了解

最好的解决方法：Canal 原理伪装成mysql的一个从服务器	通过订阅 binlog 拿每一次的更新
好处：只需要关心数据库就好，不用管缓存（屏蔽了对整个缓存的操作）  缺点又加了个中间件
canal 还可以做数据异构：jd 首页每个人的个性化推荐

<img src="https://images.zzq8.cn/img/202212271822130.png" alt="image-20221227182220035" style="zoom: 80%;" />





## 6）[SpringCache](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache)

> 这是属于 Spring 框架里面的 Integration 里面有个 Caching（具体看官网文档！）

### 6.1 Why：

先读缓存，缓存没有再读数据库 封装查询一大块。每次都那样写缓存太麻烦了。有简单的方式处理这些 Spring Cache可以通过简单的几个注解把缓存功能跑起来，不用编写一大堆的模式代码了。spring从3.1开始定义了Cache、CacheManager接口来统一不同的缓存技术。并支持使用JCache(JSR-107)注解简化我们的开发



### 6.2 初步理解：

CacheManager（Redis） 规则制定者管理不同名字的 Cache   Cache则是管自己的CRUD
CacheManager(RedisCacheManager)->Cache(RedisCache)->Cache负责缓存的读写



Cache接口的实现包括RedisCache、EhCacheCache、ConcurrentMapCache等

每次调用需要缓存功能的方法时，spring会检查检查指定参数的指定的目标方法是否已经被调用过；如果有就直接从缓存中获取方法调用后的结果，如果没有就调用方法并缓存结果后返回给用户。下次调用直接从缓存中获取。

使用Spring缓存抽象时我们需要关注以下两点：

1、确定方法需要缓存以及他们的缓存策略
2、从缓存中读取之前缓存存储的数据



### 6.3 [使用步骤：](https://www.cnblogs.com/songjilong/p/12901397.html)

> `@Cacheable` 注解是用于将**方法的返回值**缓存起来
>
> 注意：**使用spring-data-redis2.x版本时，@Cacheable缓存key值时默认会给vlue或cacheNames后加上双引号**，具体看如下类
> `org.springframework.data.redis.cache.CacheKeyPrefix`
>
> > SpringSession整合redis，Redis 存的 Session 是自动续期的吗
> >
> > 
> >
> > 一开始听chatgpt说是的，经过验证发现不是那么回事！！！
> >
> > 使用Spring Cache的`CacheManager`接口提供的`putIfAbsent`方法来更新缓存的过期时间。
>
> >框架实现的，保存会存类的全限定类名 用于反序列化，在RedisAdvaced笔记中说了这样占地方

```java
1）导入 cache、Redis 的 Start
2）spring:
      cache:
        #指定缓存类型为redis
        type: redis
        redis:
      		time-to-live: 100000 #这里我想热部署，搞一下午  jrebel+devtools 都不行还得重启项目
     # 我想到的结论： @Bean是项目启动时候加载进来的！所以得重启项目才会跑@Bean加载配置！不像Demo中Entity直接绑yaml没有代码处理
     # 热部署部署代码和配置文件，而这里部署了yaml但是读这个yaml的代码@Bean没变动不会重新去读？
     # 总之：涉及启动流程的配置就不能热部署
3）主启动类/配置类 @EnableCaching
            
            
使用：
//每一个需要缓存的数据我们都来指定要放到那个名字的缓存。【缓存的分区（按照业务类型分）】
// sync表示该方法的缓存被读取时会加锁]【注意：是本地锁！！分布式锁重】 本地锁的确够了，一个单体锁一个查询，100个单体才100个查询
                // value等同于cacheNames // key是SpEL表达式如果是字符串"''"
    @Cacheable(value = {"category"},key = "#root.method.name",sync = true) 
    @Cacheable(value = "cache:shop", key = "#root.args[0]", sync = true)  //cache:shop::1
            //代表当前方法的结果需要缓存，如果缓存中有，方法不用调用。如果缓存中没有，会调用方法，最后将方法的结果放入缓存！
                
                
//    @Caching(evict = {
//            @CacheEvict(value = "category",key = "'getLevel1Category'"),
//            @CacheEvict(value = "category",key = "'getCatalogJson'")
//    })//Group annotation for multiple cache annotations
//调用该方法会删除缓存category下的所有cache，如果要删除某个具体，用key="''"
@CacheEvict(value = {"category"},allEntries = true)
```

默认行为
     如果缓存中有，方法不再调用
     key是默认生成的:缓存的名字 -> SimpleKey::[](自动生成key值) 【value::key】
     缓存的value值，默认使用jdk序列化机制，将序列化的数据存到redis中
     默认时间是 -1：
自定义操作：key的生成
     指定生成缓存的key【key属性指定，接收一个Spel <font color=red>（所以key要给String得 key="'string'"）</font>】
     指定缓存的数据的存活时间【配置文档中修改存活时间】
     将数据保存为json格式【配置一个config类，仿照源码抄部分】



#### 补充：题外-redis热部署不生效

[**Springboot重新加载Bean**](https://blog.51cto.com/u_15072908/3946684) @Bean 在 application 启动的时候加载！所以配置文件改了热部署也没用
有解决方案但是要多写个接口调用一下：销毁这个Bean再重新注册进来：

```java
@Configuration
public class DemoConfiguration {
    @Bean(name="execute")
    public static Execute getBean(){
        //Execute是我逻辑中需要的类
        Execute execute = ....（逻辑过程省略）
        return execute;
    }

}
-----------------------------------

@Controller
public class DemoController {
    @Autowired
    private ApplicationContext applicationContext;
    @ResponseBody
    @PostMapping("/getVersion")
    public void reloadInstance(){
        //获取上下文
        DefaultListableBeanFactory defaultListableBeanFactory =
                (DefaultListableBeanFactory)applicationContext.getAutowireCapableBeanFactory();
        //销毁指定实例 execute是上文注解过的实例名称 name="execute"
        defaultListableBeanFactory.destroySingleton("execute");
        //按照旧有的逻辑重新获取实例,Excute是我自己逻辑中的类
        Execute execute = DemoConfiguration.getBean();
        //重新注册同名实例，这样在其他地方注入的实例还是同一个名称，但是实例内容已经重新加载
        defaultListableBeanFactory.registerSingleton("execute",execute);
    }
}
-----------------------------------
Springboot重新加载Bean
https://blog.51cto.com/u_15072908/3946684
```

启动 Debug 了下看到进了应该是的吧，但是又有问题：那不是那些配置的东西基本都是@Bean操作了下启动时才进来的。换句话说也就是配置文件热部署也就只能对自己Demo中Entity直接绑yaml没有代码处理的有效了
也就没有第三方jar yaml配置能热部署的了 因为基本都依赖启动





### ==6.4 配置原理：==

CacheAutoConfiguration -> RedisCacheConfiguration ->
自动配置了RedisCacheManager->初始化所有的缓存->每个缓存决定使用什么配置
->如果redisCacheConfiguration有就用已有的，没有就用默认配置
->想改缓存的配置，只需要给容器中放一个RedisCacheConfiguration即可
->就会应用到当前RedisCacheManager管理的所有缓存分区中



**全是抄的源码createConfiguration方法**，目的只是为了把value改为json序列化！源码key好像是用的string的
`org.springframework.boot.autoconfigure.cache.RedisCacheConfiguration#createConfiguration`

> Q：我这里其实对每一次的`"config ="`都充满疑惑：这样不是每次都指向一个新对象那么意义何在？？？
>
> A：因为`RedisCacheConfiguration.class`中的属性都是`final`，所以每次`"config ="`等号右边可以理解为在`setxxx`
>
> > Q：我可以理解为这样的目的是使得final属性获得指定的值吗
> >
> > 不完全是这样的，如果某个属性是final类型，那么它只能在构造函数或者成员变量声明的时候初始化一次，并且不能被修改。因此，为了在构造RedisCacheConfiguration对象的时候能够对final属性进行初始化，我们需要使用这种“链式调用”的方式，每次调用方法时都会返回一个新的RedisCacheConfiguration对象，这样就能保证final属性每次都能被正确初始化。
>
> > Q：那上一次"config ="指向的对象不会被回收吗
> >
> > Java中的对象是有垃圾回收机制的，当对象不再被任何引用所指向时，垃圾回收机制会将其回收。在该代码片段中，每次重新赋值config时，前一次指向的对象会失去引用，如果没有其他引用指向该对象，则该对象会被垃圾回收机制回收。因此，不需要担心对象的内存泄漏问题。
>
> > Q：被回收掉后RedisCacheConfiguration的final属性变量所得到的值还会保留吗
> >
> > 是的，一旦一个final属性被初始化，它的值就不能被改变，即使它所引用的对象被回收了，final属性依然会持有它最初引用的对象的值。因此，在这种情况下，即使上一次"config ="所指向的对象被回收了，最终的返回值仍然会包含之前设置的所有属性和值。

```java
@EnableConfigurationProperties(CacheProperties.class)
@EnableCaching
@Configuration
public class MyCacheConfig {
//    @Autowired
//    CacheProperties cacheProperties;  //因为下面是 @Bean 直接放参数用就行！
    @Bean //原来@Bean注解想容器注入对象的时候，会自动将容器中已经有的对象传入到@Bean注解的方法参数中
    public RedisCacheConfiguration redisCacheConfiguration(CacheProperties cacheProperties) { //这个参数能拿值？  这个方法就是给容器放东西，方法传的所有参数所有参数都会从容器中进行确定  所以会自动去IOC中拿
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig();
        config = config.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()));
        // 序列化 value 时使用此序列化方法
        config = config.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));


        //下面抄源码，不然配置文件写的过期时间之类的失效   具体看 RedisCacheConfiguration.java【注意是autoconfigure包下的！】
        CacheProperties.Redis redisProperties = cacheProperties.getRedis();
        if (redisProperties.getTimeToLive() != null) {
            config = config.entryTtl(redisProperties.getTimeToLive());
        }
        if (redisProperties.getKeyPrefix() != null) {
            config = config.prefixKeysWith(redisProperties.getKeyPrefix());
        }
        if (!redisProperties.isCacheNullValues()) {
            config = config.disableCachingNullValues();
        }
        if (!redisProperties.isUseKeyPrefix()) {
            config = config.disableKeyPrefix();
        }
        return config;
    }
}
```

> 碰到的问题
>
> * JDK8 中新的时间 API LocalDateTime，究其原因是 Jackson 在序列化 LocalDateTime 时输出的不是普通的字符串时间格式【解决】
>
>   * ```java
>     /**
>     //JDK8 中新的时间 API LocalDateTime，究其原因是 Jackson 在序列化 LocalDateTime 时输出的不是普通的字符串时间格式
>     //解决Could not read JSON: Cannot construct instance of `java.time.LocalDateTime`
>     //发现一开始我就错了，我return的是一个Bean才会引发这个。实际还是return list / map / String好一些
>     */
>     ObjectMapper objectMapper = new ObjectMapper();
>     objectMapper.registerModule(new JavaTimeModule());
>     // 序列化 value 时使用此序列化方法
>     config = config.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)));
>     ```
>
>     
>
> * 反序列化报错，总是用map强转相应的Bean
>   * 我的解决 -> return list / map / String



# 四、检索服务

js 报错 search() 不是一个方法，前面加`javascript:`解决

```
<a href="javascript:search();" >
```



> 我被这里卡了半天，因为我es查的是product，而我java写的EsConstant是 `PRODUCT_INDEX = "gulimall_product";`
> [p133第4分钟](https://www.bilibili.com/video/BV1np4y1C7Yf/?p=133&spm_id_from=pageDriver&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0&t=0h4m0s)

找不到数据的，看看自己的EsConstant里面的索引名字写对没





## 1）商品搜索

重点：

1、准备检索请求 把写的DSL语句转成java执行

2、执行检索请求  调用es api执行上面处理好的检索请求得到响应数据

3、分析响应数据，封装成我们需要的格式

DSL转java书写，返回值封装成对象



Other：

面包屑导航：选一个就有个title标签后面有个×，把这些标签组合起来搜。也可删掉   

这一个章节对急着找工作人士的性价比极低
商品搜索直接 copy 跳了，营养价值不大





# 五、异步&线程池

> CompletableFuture 异步编排、  实现 Callable 接口 + FutureTask 
>
> 这章知识以前是很陌生的，感觉很有用！



[juc](../juc/juc)





# 六、认证服务

> 架构图-认证中心：处理**登录**注册，再放行请求到服务器
>
> 面试就喜欢问认证，授权，社交登录，单点登录。 来判断新手，逻辑思维能力

SMS 具体看ali官网给的文档就行，优雅一点放配置文件 @ConfigurationProperties(prefix = "spring.cloud.alicloud.sms")

具体写的Controller应该是提供给别的服务进行调用的！



## 1.注册流程

### 1.1 JS 验证码倒计时

点击获取验证码后，进入倒计时

- 计时功能可以使用js的timing计时时间，setTimeout()可以设置一段时间后执行代码
- 递归回调可以解决倒计时刷新的功能
- 开始倒计时后设置按钮不可用`$("#sendCode").attr("class", "disabled")`

```js
$(function () { //当文档载入完成的时候执行的
       $("#sendCode").click(function () {
      //2、倒计时
      if($(this).hasClass("disabled")) {
         //正在倒计时中
      } else {
         //1、给指定手机号发送验证码
         $.get("/sms/sendCode?phone=" + $("#phoneNum").val(),function (data) {
            if(data.code != 0) {
               alert(data.msg);
            }
         });
         timeoutChangeStyle();
      }
   });
   });

   var num = 60;
   function timeoutChangeStyle() {
     $("#sendCode").attr("class","disabled");
     if(num == 0) {
          $("#sendCode").text("发送验证码");
          num = 60;
          $("#sendCode").attr("class","");
   } else {
      var str = num + "s 后再次发送";
      $("#sendCode").text(str);
      setTimeout("timeoutChangeStyle()",1000);
   }
   num --;
}
```

```java
//凭前缀是因为redis会存大量不同的数据，方便区分，小傻瓜
public static final String SMS_CODE_CACHE_PREFIX = "sms:code:";
```

#### `缺点：`

* 1）暴露了短信接口API，会被别人恶意调用 【接口防刷 -> Redis拼个_时间戳校验】
  2）倒计时刷新就没用了 【同上用时间戳校验】  
  * **Redis存 code_时间戳，校验时间戳是不是60s内** （后端校验解决此问题）



### 1.2 JSR303

> 值得学习：哪天完全脱离自己写，要有这思路

获取表单信息、`封装VO（需要JSR303校验）`、重定向登录页面  【搞熟三个参数、Lambda】

```java
	/**
     *
     * TODO: 重定向携带数据：利用session原理，将数据放在session中。
     * TODO: 只要跳转到下一个页面取出这个数据以后，session里面的数据就会删掉
     * TODO：分布下session问题
     * RedirectAttributes：重定向也可以保留数据，不会丢失
     * 用户注册
     * @return
     */
    @PostMapping(value = "/register")
    public String register(@Valid UserRegisterVo vos, BindingResult result,
                           RedirectAttributes attributes) {
        if (result.hasErrors()) {
        Map<String, String> errors = result.getFieldErrors().stream().collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
        attributes.addFlashAttribute("errors",errors);
        }
    }
```





[2.2 Model / RedirectAttributes](#2.2 Model / RedirectAttributes)  ->  **TODO 但是他是利用的session原理，所以后期我们需要解决分布式的session问题**



### 1.3 MD5

密码存数据库加密分: 可逆 vs 不可逆（√）

不可逆更合理一些   MD5+salt



[apache base64](https://www.liaoxuefeng.com/wiki/1016959663602400/1017684507717184) 长度能改变么
没有办法，base64是编码而已，是对称的，不是像md5那样的非对称的加密算法能够讲任意长度字符加密后长固定长度。

#### MD5使用场景：百度网盘秒传功能

> Answer：算出MD5值，看别人有没有上传过

因为这些特性:

无论多大文件MD5都会搞成固定长度的串（压缩性）

两个不同的数据要有一样的MD5是非常困难的（强抗碰撞）

从原数据计算出MD5值很容易（容易计算）

对原数据进行任何改动,哪怕只修改1个字节,所得到的MD5值都有很大区别（抗修改性）

最大特点：**不可逆**



使用：以前还傻傻的自己Copy工具类

org.apache.commonns 有很多加密算法 -> DigestUtils.md5Hex()、Md5Crypt.md5Crypt()

但是光零零一个MD5，网上随便搜破解随便破。  原因：[彩虹表](https://zh.m.wikipedia.org/wiki/%E5%BD%A9%E8%99%B9%E8%A1%A8) -> 预先计算（因为123456的MD5不可变我就把这个放数据库）在字典法的基础上改进

解决+salt    问题：我这个盐存哪里？难道再维护一个字段放盐？

```java
//Apache commons包 DigestUtils类，【简单的MD5】
DigestUtils.md5Hex("123456");
//Apache commons包 Md5Crypt类，这个方法的颜值有正则限定，需要以$1$开头，【MD5+salt】
Md5Crypt.md5Crypt("123456".getBytes(), "$1$1");
```



#### 解决：org.springframework.security -> `BCryptPasswordEncoder.class`  把盐交给 Spring 工具类

```java
/**
 * 密码加密器：多个用户过来存 123456 用这个Util存的值都不一样，但是都能 match 123456
 * 加了个算法生成盐
 */
@Test
public void testBCryptPasswordEncoder(){
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    //$2a$10$Vu.YcPJ5LOY.pIXhqxvgGuO/haGTVe5g/bpXCYYasSgS9sF2vxauC
    //$2a$10$C/7Ur.ScOTYkYIOKChppD.TwGZfMyl3QbgWtbiYU1VIYWcNJ.dNH.
    String s = encoder.encode("123456");
    System.out.println(s);
    //两个都是 true
    System.out.println(encoder.matches("123456", "$2a$10$Vu.YcPJ5LOY.pIXhqxvgGuO/haGTVe5g/bpXCYYasSgS9sF2vxauC"));
    System.out.println(encoder.matches("123456", "$2a$10$C/7Ur.ScOTYkYIOKChppD.TwGZfMyl3QbgWtbiYU1VIYWcNJ.dNH."));
}
```





### 1.4 总结

1. 校验表单 JSR303  redis 存key-phone,value-code
2. 截串取 Redis 验证码
   1. 通过则删 Redis，远程调用注册API（BCryptPasswordEncoder存密码）





## 2.社交登录

> 社交登录指的是用QQ微信等方式登录

- 点击QQ按钮
- 引导跳转到QQ授权页
- 用户主动点击授权，跳回之前网页

### 2.1 OAuth2.0

上面社交登录的流程就是OAuth协议

OAuth（开放授权）是一个开放标准，允许用户授权第三方移动应用访问他们存储在另外的服务提供者上的信息，而不需要将用户名和密码提供给第三方移动应用或分享他们数据的所有内容，OAuth2.0是OAuth协议的延续版本，但不向后兼容OAuth 1.0即完全废止了OAuth1.0。

![在这里插入图片描述](https://images.zzq8.cn/img/202301041827971.png)

> 微信：https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Development_Guide.html
>
> 客户端是
>
> 资源拥有者：用户本人
>
> 授权服务器：QQ服务器，微信服务器等。返回访问令牌
>
> 资源服务器：拿着令牌访问资源服务器看令牌合法性

![img](https://images.zzq8.cn/img/202301041828301.png)

1、使用Code换取AccessToken，Code只能用一次
2、同一个用户的accessToken一段时间是不会变化的，即使多次获取





### [2.2 GitHub](https://docs.github.com/zh/developers/apps/building-oauth-apps/authorizing-oauth-apps)

#### 1）大致流程

授权获取重定向到自己url 会拼个code  【获取code】

【code换accessToken】    -> 这里要写后端代码

accessToken访问GitHub开放的API openAPI获取用户信息



#### 2）HttpUtils 

是搞短信验证码ali的文档给的java示例代码教引入的，这里可以拿来用

`org.apache.http.util.EntityUtils#toString(org.apache.http.HttpEntity)  //可以拿HttpEntity响应体的json内容`

```java
String json = EntityUtils.toString(response.getEntity());
JSONObject jsonObject = JSON.parseObject(json);  //也可以转成指定对象  
//SocialUser socialUser = JSON.parseObject(json, SocialUser.class);
String name = jsonObject.getString("name");
```



严谨点可以

针对不同的社交网站可能需要建不同的表
这里视频直接在会员信息加了个字段放社交id，关联本系统会员信息





## 3.分布式session

> 原理：session存储在服务端 tomcat 源码其实就是个 map，jsessionId存在客户端，每次通过`jsessionid`取出保存的数据
>
> org.apache.tomcat.embed:tomcat-embed-core:9.0.24 (tomcat-embed-core-9.0.24.jar)
> javax.servlet.http.HttpSession#setAttribute

### 3.1 Session 两个问题：

问题 1：**Session 不能跨不同域名共享**
场景：在 auth 模块存的session，只在它这个模块的登录页面有 session 而 product对应的主页模块没有 session
     jsessionid这个cookie默认是当前系统域名的（具体验证F12 Session有Domain限定，所以 auth.gulimall.com VS gulimall.com 不同域）

![image-20230105171317820](https://images.zzq8.cn/img/202301051713942.png)

问题 2：Session 是放服务器中，即使是单体应用（同域名）。但是它集群的话不同服务器也不能共享 Session





### 3.2 分布式session解决方案

`不用的两种方案：`

##### 1) session复制

用户登录后得到session后，服务把session也复制到别的机器上，显然这种处理很不好

![img](https://images.zzq8.cn/img/202301051653057.png)

2）![](https://images.zzq8.cn/img/202301051702278.png)



`可用的两种方案：`

##### 3) hash一致性

> 记得看了个文章还是视频：问 hash 有什么应用场景，这里就是。负载均衡

根据用户，到指定的机器上登录。但是远程调用还是不好解决

![img](https://images.zzq8.cn/img/202301051653500.png)

##### 4) redis统一存储

最终的选择方案，把session放到redis中

![img](https://images.zzq8.cn/img/202301051701799.png)



### 3.3 SpringSession整合redis

> 针对上面的 4） Spring 早就想到了解决方案：SpringSession   和 SpringCache 样的去官网摸索

#### 3.3.1 简单配置

怎么用：[spring 官网！！！](https://docs.spring.io/spring-session/reference/samples.html) 必须学会看[官方文档](https://docs.spring.io/spring-session/reference/http-session.html#httpsession)解决问题！！！官网解决不了的再 Google

不要忘了第二个网址告诉的需要配置类加：

```java
//创建了一个springSessionRepositoryFilter ，负责将原生HttpSession 替换为Spring Session的实现
@EnableRedisHttpSession//整合redis作为session存储
```



注意：session 的操作API不变 `session.setAttribute(LOGIN_USER,data);` 

做完上述简单的配置操作数据是放redis了，但仍有问题：

**//TODO 1、默认发的令牌。当前域（解决子域session共享问题 扩大作用域：二级域名扩大到一级域名（auth.gulimall.com 扩大成 gulimall.com））**

**//TODO 2、使用JSON的序列化方式来序列化对象到Redis中**



#### 3.3.2 Bean 配置

解决上述两个问题：看官网！ctrl+f 搜 keyword: customize
两个@Bean解决  GulimallSessionConfig.java

序列化时Bean需要返回的实现类：FastJsonRedisSerializer.class  因为要通用用泛型的：GenericFastJsonRedisSerializer.class





### 3.4 我遇到的坑

#### 1）redis、session的yaml配置每个model都要

解决：放Nacos，配置 `shared-dataids: common.yaml`

但是中途总是不生效，踩坑很久发现我Nacos配**Data ID**时候没有加后缀



#### 2）GulimallSessionConfig 这个配置类每个model都要

解决：放common模块 `@ComponentScan({"com.zzq"})` or `@Import`



### 3.5 [SpringSession核心原理 - 装饰者模式](https://blog.csdn.net/m0_46539364/article/details/110533408)

> 这里我暂时掠过

核心原理
1）、@EnableRedisHttpSession导入RedisHttpSessionConfiguration配置
     1、给容器中添加了一个组件
         RedisOperationsSessionRepository：Redis操作session，session的增删改查封装类



==Redis 存的 Session 是自动续期的==   TODO：待验证

> 是的，Spring Session 整合 Redis 后，Redis 存储的 Session 是自动续期的。
>
> 在 Spring Session 中，当一个 Session 被创建时，会生成一个唯一的 Session ID，并且这个 Session ID 会被用来作为 Redis 中存储 Session 的 key。同时，Spring Session 会将这个 Session ID 作为 cookie 发送给客户端。
>
> 当客户端发送请求时，Spring Session 会根据请求中携带的 Session ID 从 Redis 中获取对应的 Session 数据，并检查 Session 是否过期。如果 Session 没有过期，Spring Session 会自动将 Session 的过期时间延长，确保 Session 不会在使用期间过期。
>
> 因此，Spring Session 整合 Redis 后，Redis 存储的 Session 是自动续期的。



## 4.单点登录-SSO

> Single Sign-On，简称 SSO
>
> 一级域名都不一样  taobao.com   tmall.com   所以不能用 SpringSession 解决不了不同域名的问题了。无法扩大域名

Gitee 有个开源Demo：`xxl-sso`

最终解决方案：都去中央认证器

记住一个核心思想：建议一个公共的登陆点server，他登录了代表这个集团的产品就登录过了



开源项目，一个认证中心，其它客户端：1）配好配置文件、2）cmd maven打包

```
mvn clean package -Dmaven.skip.test=true
```

流程：
server：登录服务器、8080 、ssoserver.com
web-sample1：项目1 、8081 、client1.com
web-sample2：项目1 、8082 、client2.com
3个系统即使域名不一样，想办法给三个系统同步同一个用户的票据；



**中央认证服务器：**
其他系统都去【中央认证服务器】登录，登录成功后跳转回原服务
一个系统登录，都登录；一个系统登出，都登出
全系统统一一个 sso-sessionId



***

开源项目试过了能行，自己的项目怎么整合：

雷神写了Demo，这里暂时掠过



问了 chatGPT：

要用 Java 实现单点登录，你需要做以下几件事：

1. 建立认证服务器：你可以使用 Java 开发认证服务器，负责存储用户的认证信息并负责验证用户的身份。
2. 在应用程序或网站中集成认证接口：你需要在应用程序或网站中集成认证接口，以便与认证服务器进行通信。
3. 处理用户输入的认证信息：你需要设计一个用户登录界面，让用户输入认证信息（例如用户名和密码）。
4. 发送认证请求：当用户点击登录按钮时，你的应用程序或网站需要向认证服务器发送认证请求，以验证用户的身份。
5. 处理认证结果：当你的应用程序或网站收到认证服务器的认证结果时，你需要根据认证结果来决定是否允许用户登录。如果认证成功，你可以允许用户登录；如果认证失败，你可以提示用户输入的认证信息有误，并让用户重新输入。

`Spring Security` 是一款流行的 Java 安全框架，提供了认证和授权功能，包括单点登录功能。使用 Spring Security 实现单点登录，你需要在应用程序中配置 Spring Security，然后在认证服务器上配置相应的认证提供者。具体实现细节可以参考 Spring Security 的文档和教程。另外，你还可以参考其他框架或库，例如 `Apache Shiro` 或 PicketLink，它们也提供了单点登录功能。



认证服务器通常使用数据库来存储用户的认证信息，但也可以使用其他的存储方式，例如文件系统或内存数据库。

此外，在单点登录的认证过程中，应用程序或网站可能会为用户生成一个认证令牌，并将这个令牌存储在用户的浏览器上。这样，当用户访问其他应用程序或网站时，就可以通过这个认证令牌来验证用户的身份，而无需再次输入认证信息。这个认证令牌通常是一个字符串，包含了用户的认证信息和其他相关信息。

总之，单点登录的认证信息可以存储在认证服务器上或者存储在用户的浏览器上（通过认证令牌）





# [七、购物车](09、商城业务.pdf)

## 1.需求描述

> 在线购物车 vs 离线购物车

特点：读多写少，放入数据库并不合适

**登录状态：登录购物车:**

* 放入数据库
* mongodb
* 放入redis（采用）
  * 登录以后，将离线购物车里合并后清空离线购物车



**未登录状态：离线购物车**：JD 貌似删了这个功能了

* 放入localstorage浏览器的技术（浏览器的技术，缺点：大数据时代后台没法分析用户推荐）
* cookie
* WebSQL
* 放入redis（采用）
  * 浏览器重启后还在



## 2.Redis 存储设计 & VO：

* 每个人都有购物车
* 购物车排列有顺序，例如选择了第三个商品进行增删改查

redis有5种不同数据结构，这里选择哪一种比较合适呢？`Map<String,List<String>>`

* 首先不同用户应该有独立的购物车，因此购物车应该以用户的作为key 来存储，Value 是用户的所有购物车信息。这样看来基本的`k-v`结构就可以了。

* 但是，我们对购物车中的商品进行增、删、改操作，基本都需要根据商品id 进行判断，为了方便后期处理，我们的购物车也应该是`k-v`结构，key 是商品 id，value 才是这个商品的购物车信息。

综上所述，我们的购物车结构是一个双层 `Map：Map<String,Map<String,String>>`

* 第一层 Map，Key 是用户 id 

- 第二层 Map，Key 是购物车中商品 id，值是购物项数据





## 3.==ThreadLocal用户身份鉴别==

常用应用场景：保存用户登录信息  
需要注意的是，ThreadLocal 存储的数据仅对当前线程可见，因此适合存储一些只有在当前线程中使用的数据，例如用户信息等。而 Session 存储的数据对于整个 Web 应用程序都是可见的，因此适合存储一些需要在多个页面或请求之间共享的数据，例如用户登录状态、购物车信息等。

> Q：Threadlocal存用户信息比用session存用户信息有什么优势
>
> 
>
> ThreadLocal 和 Session 都是在多线程环境下存储用户信息的方式，但是它们的作用和使用场景有所不同。下面是 ThreadLocal 存储用户信息比 Session 存储用户信息的一些优势：
>
> 1. 线程安全性：ThreadLocal 是线程局部变量，每个线程拥有自己的一个变量副本，不同线程之间不会相互影响，可以有效地避免多线程环境下的竞态条件和线程安全问题。
> 2. 跨请求访问：ThreadLocal 可以在同一线程内的多个请求之间共享数据，而 Session 则只能在同一会话（同一用户在同一浏览器中访问同一网站期间的所有请求）之间共享数据。
> 3. 性能优势：由于 ThreadLocal 是线程内部的变量，存取速度相对于 Session 更快，而且不需要将数据序列化和反序列化，也不需要在不同的请求之间进行传输，因此对系统性能的影响更小。(XD：Session一般会借助 Redis 存取，所以要 serialize)
>
> 需要注意的是，ThreadLocal 适用于单个线程内部共享数据，而不适合在不同线程之间传递数据。此外，使用 ThreadLocal 时需要注意及时清除数据，否则可能会出现内存泄漏等问题。
>
>
> ThreadLocal 是一种线程本地存储的机制，它可以为每个线程维护一个独立的变量副本。因此，当多个线程访问同一个 ThreadLocal 变量时，它们看到的值是不同的。**在一个 Web 应用程序中，每个请求都由一个独立的线程处理，因此可以将用户信息存储在 ThreadLocal 中，以便在整个请求处理过程中都可以访问这些信息，而不必将这些信息存储在 Session 中。**

> 实现：参考京东，在点击购物车时，会为**临时用户**生成一个`name`为`user-key`的`cookie`临时标识，过期时间为一个月，如果手动清除`user-key`，那么临时购物车的购物项也被清除，所以`user-key`是用来标识和存储临时购物车数据的

解决：搞个拦截器（**TODO：不知道能用AOP实现不，弹幕说执行太晚了**    **面试官：拦截器跟过滤器有什么区别**）
     前后端分离的话，是用token，其实你登没登录，只要看前端能不能获取到token就行了

***

[过滤器和拦截器是两种不同的Web请求处理机制。](https://blog.csdn.net/q957967519/article/details/91544888)

过滤器：是在请求和响应被发送到服务器之间执行的，用于检查请求和响应，可以修改请求和响应内容。（场景学JSP的时候好像把请求的编码统一改成UTF-8）

拦截器：是在请求被发送到服务器之前和服务器处理请求之后执行的，可以拦截请求，并在请求到达服务器之前进行预处理。

简而言之，过滤器主要用于请求和响应的修改，而拦截器主要用于请求的拦截和预处理。



从灵活性上说拦截器功能更强大些，Filter能做的事情，他都能做，而且可以在请求前，请求后执行，比较灵活。Filter主要是针对URL地址做一个编码的事情、过滤掉没用的参数、安全校验（比较泛的，比如登录不登录之类），太细的话，还是建议用interceptor。不过还是根据不同情况选择合适的。但是Aspect能够做到方法级更细的操作。





ChatGPT：通俗来说过滤器和拦截器的区别：

过滤器和拦截器是用于对Web请求进行预处理和后处理的不同技术。

区别：

1. 执行位置：过滤器在请求被路由之前执行，拦截器在请求被路由后执行。
2. 执行顺序：过滤器可以定义执行顺序，拦截器按照配置顺序执行。
3. 功能：过滤器可以对请求数据进行预处理，拦截器可以对请求结果进行后处理。

***



==拦截器使用场景==：1）这里判断用户状态信息，是否登录再决定要不要放行。

​			 2）Feign远程调用丢失请求头：订单模块的 Feign 源码会自动创 Request 导致丢失 Cookie。而底层自创的时候用到拦截器增强（即DIY				个拦截器把原Requset Cookie放新Request）    解决重点：Spring类 `RequestContextHolder`



拦截器拦完后，想要快速得到用户信息（to对象）：id,user-key
<b style='color:red'>即截器定义好了，将来怎么把拦截器中获取的用户信息传递给后续的每个业务逻辑：</b>

> 后续的每个业务逻辑也可以从 Redis 中直接获取用户信息，但是这样会增加 Redis 的访问次数，对系统性能造成影响。为了提高系统的响应速度，建议将用户信息存储到 ThreadLocal 中，并在业务逻辑中直接从 ThreadLocal 中获取用户信息，以避免频繁地访问 Redis。

1. public类型的公共变量。线程不安全
2. request对象。不够优雅
3. ThreadLocal线程变量。推荐

<img src="https://images.zzq8.cn/img/202301071601779.png" alt="image-20230107160059758" style="zoom:50%;" />

```java
/**
threadLocals 是 Thread 类的属性之一
1）它是一个 ThreadLocal.ThreadLocalMap 类型的对象，用于存储线程的局部变量。每个线程都有自己的 threadLocals 对象，用于管理该线程的局部变量。
2）threadLocals 字段使用了线程封闭设计模式，确保每个线程都拥有自己独立的局部变量存储空间，避免了线程之间的数据共享和冲突。
3）threadLocals 字段的类型为 ThreadLocal.ThreadLocalMap。它是 ThreadLocal 类的内部类，用于存储 ThreadLocal 实例和对应的局部变量值的映射关系。

通过 threadLocals 字段，每个线程可以维护自己的局部变量，并且线程之间的局部变量不会相互干扰。
需要注意的是，threadLocals 字段是 Thread 类的实例级别字段，每个线程对象都有自己的 threadLocals 对象。这意味着每个线程都可以独立地管理和访问其自己的局部变量。
*/
public class Thread implements Runnable {
    /* ... */

    /* ThreadLocal values pertaining to this thread. This map is maintained
     * by the ThreadLocal class. */
    ThreadLocal.ThreadLocalMap threadLocals = null;

    /* ... */
}
```



注意：java.lang.ThreadLocal 是一个类，用泛型来放我们的TO对象
	 `public static ThreadLocal<MemberResponseVo> loginUser = new ThreadLocal<>();`

​	 tomcat多线程接收请求，这个点不知道的话，整个过程内心会充满疑问的 同一个线程共享。其他用户是其他线程

​	

## [3.1.上面补充：](https://mp.weixin.qq.com/s/nPCQadj8-7WBu7GVJRv4JQ)

> 具体结合 title link 一起看，还有下面自己的文中 link
>
> 订单确认页需要feign拿用户地址、购物车数据都需用户数据这个ThreadLocal

为什么用它，它有什么优势，简单来说有两点

1. **无锁化提升并发性能**
2. **简化变量的传递逻辑**



文中多个不同线程拿用户信息是通过 `InheritableThreadLocal`

Gulimall的时候雷神好像是用的拦截器，每次请求进来从spring session(redis)拿封装给ThreadLocal。现在不确定的点是拦截/**是不是也可把远程Feign的拦下来？(如可以那这也算种做法吧)

> **Q：preHandle可以拦截fegin的请求吗**
>
> A：是的，preHandle方法可以拦截Feign的请求。Feign是基于HTTP客户端的声明式Web服务客户端，通过拦截器可以对Feign发送的请求进行拦截。preHandle方法是在请求发送之前被调用，因此可以在该方法中对请求数据进行处理或修改。
>
> 
>
> 问题场景：ware远程调用订单（有拦截器），请求头没有登录消息被拦截，应该放行
>
> 解决：订单的拦截器使用new AntPathMatcher().match(“放行路径”，目标路径)

***

[2）Feign异步情况丢失上下文问题](#2）Feign异步情况丢失上下文问题)

突然发现他是 RequestContextHolder 来解决异步编排会丢失 ThreadLocal

发现上面说的并不是这么回事，拦截器只是针对每一个请求





> Q: RequestContextHolder解决CompletableFuture丢失ThreadLocal
>
> 
>
> RequestContextHolder是Spring框架提供的一个用于保存请求上下文的工具类，可以用来解决CompletableFuture丢失ThreadLocal的问题。
>
> 通过将请求上下文存储到RequestContextHolder中，在CompletableFuture执行时可以在需要的地方访问请求上下文。
>
> 代码示例：
>
> ```java
> public CompletableFuture<String> asyncMethodWithContext() {
>     RequestContext context = RequestContextHolder.currentRequestAttributes();
>     return CompletableFuture.supplyAsync(() -> {
>         RequestContextHolder.setRequestAttributes(context);
>         // access to context here
>         return "Result of async method";
>     });
> }
> ```
>
> 在上面的代码中，通过`RequestContextHolder.currentRequestAttributes()`





> Q: InheritableThreadLocal解决CompletableFuture丢失ThreadLocal
>
> 
>
> InheritableThreadLocal是Java提供的一个用于在父线程和子线程之间传递ThreadLocal变量值的工具类，可以用来解决CompletableFuture丢失ThreadLocal的问题。
>
> 通过使用InheritableThreadLocal，在父线程中设置的ThreadLocal变量值会被子线程继承。
>
> 代码示例：
>
> ```java
> javaCopy codepublic class Context {
>     private static final InheritableThreadLocal<Map<String, Object>> context = new InheritableThreadLocal<Map<String, Object>>() {
>         @Override
>         protected Map<String, Object> childValue(Map<String, Object> parentValue) {
>             return new HashMap<>(parentValue);
>         }
>     };
> 
>     public static void set(String key, Object value) {
>         context.get().put(key, value);
>     }
> 
>     public static Object get(String key) {
>         return context.get().get(key);
>     }
> 
>     public static void remove() {
>         context.remove();
>     }
> }
> 
> public CompletableFuture<String> asyncMethodWithContext() {
>     Map<String, Object> context = Context.context.get();
>     return CompletableFuture.supplyAsync(() -> {
>         Context.context.set(context);
>         // access to context here
>         return "Result of async method";
>     });
> }
> ```
>
> 在上面的代码中，通过`Context.context.get()`获取父线程的Context，并在子线程中使用`Context.context.set(context)`将该Context设置为子线程的Context，从而实现在子线程中访问请求上下文。







> 注意如果是线程池的话 ThreadLocal 记得回收

如果在线程池中使用ThreadLocal会造成内存泄漏,因为当ThreadLocal对象使用完之后,应该要把设置的key,value,也就是Entry对象进行回收,但线程池中的线程不会回收,而线程对象是通过强引用指向ThreadLocalMap,ThreadLocalMap也是通过强引用指向Entry对象,线程不被回收,Entry对象也就不会被回收,从而出现内存泄漏,解决办法是,在使用了
ThreadLocal对象之后,手动调用ThreadLocal的remove方法,手动清除Entry对象



# 八、消息队列 



[自己的MQ笔记](../mq/rabbitmq)







# 九、订单服务

## 1.模块介绍

> 比较复杂且重要：需要多模块查询检索  复杂的流程调用，具体看 PDF  结算的Service是我看过的最繁琐的

电商系统涉及到3流，分别是信息流，资金流，物流，而订单系统作为中枢将三者有机的集合起来。

1. 信息流：商品信息、优惠信息
2. 资金流：退款、付款
3. 物流：发送、退货

订单模块是电商系统的枢纽，在订单这个环节上需求获取多个模块的数据和信息，同时对这些信息进行加工处理后流向下个环节，这一系列就构成了订单的信息流通。

<img src="https://images.zzq8.cn/img/202301141808024.png" alt="image-20230114180830391" style="zoom: 67%;" />



## 2.Feign 两个问题

> 看两张图特别清楚，涉及到 Feign 的底层逻辑要看个大概

### 1）Feign远程调用丢失请求头问题

> 场景：Feign 源码会自创 Request 导致丢失老Request Cookie，而自创的时候用到拦截器增强
> 解决：即可DIY个拦截器把原Requset Cookie放新Request   解决重点：Spring类 `RequestContextHolder`

<img src="https://images.zzq8.cn/img/202301161056022.png" alt="image-20230116105558996" style="zoom: 67%;" />



### [2）Feign异步情况丢失上下文问题](#3.1.上面补充：)

> 场景：`RequestContextHolder` 也是通过 ThreadLocal 拿数据，就会每个线程都不一样（异步编排会丢失 ThreadLocal）
>
> 解决：主线程 `RequestContextHolder.getRequestAttributes(); `
>   其它两个线程 `RequestContextHolder.setRequestAttributes(requestAttributes);`
>
> 知道 Thread.class 属性有 ThreadLocalMap 这样就好理解了   具体看title link

![image-20230116105631702](https://images.zzq8.cn/img/202301161056979.png)



PS：Feign 源码暂时掠过了，其实想看一下自己new request、set过滤器增强的地方  







## [==3.接口幂等性==](02、接口幂等性.pdf)

> 面试这里是高频考点，认真听！！！！！！！

### 1）前言

#### 哪些情况需要防止：

* 用户多次点击按钮
* 用户页面回退再次提交
* 微服务互相调用，由于网络问题，导致请求失败。feign触发重试机制
* 其他业务情况 例如update tab1 set col1=col1+1 where col2 = 2，每次执行结果不一样

#### 天然幂等性：

* 查询接口
* 更新接口update tab1 set col1=1 where col2=2
* delete from user where userId = 1
* insert user(userId, name) values(1, 'wan')，其中userId为主键



### 2）解决方案

#### 2.1 token令牌机制

服务器存储了一个令牌，页面请求时要带上令牌，服务器接收请求后会匹配令牌，匹配成功则删除令牌（再次提交则匹配失败，服务器已删除令牌。但是F5刷新的话就不一样了，会有新的token产生）

注意：
1.删除令牌要在执行业务代码之前
2.获取redis令牌、令牌匹配、令牌删除要保证原子性（lua脚本）



场景：好像是 注册时候验证码页面

服务器Redis 放一个，页面放一个这里是放一个hidden的input里面
TODO：这不是可以刷新重复提交吗  :   理解刷新会覆盖，然后再一和redis如果还在的一比对就发现不对！



#### 2.2 各种锁机制

##### 2.2.1.数据库悲观锁

> **随着互联网三高架构（高并发、高性能、高可用）的提出，悲观锁已经越来越少的被使用到生产环境中了，尤其是并发量比较大的业务场景。**

使用 `select* from xxx where id = 1 for update;` 查询的时候锁定该条数据

```mysql
//0.开始事务
begin; 
//1.查询出商品库存信息
select quantity from items where id=1 for update;
//2.修改商品库存为2
update items set quantity=2 where id = 1;
//3.提交事务
commit;
```

以上，在对id = 1的记录修改前，先通过for update的方式进行加锁，然后再进行修改。这就是比较典型的悲观锁策略。

注意：
悲观锁使用时一般伴随事务一起使用，数据锁定时间可能会很长，需要根据实际情况选用。
id字段一定是主键或者唯一索引，不然可能造成锁表的结果，处理起来会非常麻烦。

##### 2.2.2.数据库乐观锁【带上版本号】

这种方法适合在更新的场景中 `update t_goods set count = count-1,version =version + 1 where good_id=2 and version = 1`
	根据version版本，也就是在操作库存前先获取当前商品的version版本号，然后操作的时候带上此version号。
	第一次操作库存时，得到version为1，调用库存服务version变成了2﹔但返回给订单服务出现了问题，订单服务又一次发起调用库存服务，当订单服务传的version还是1，再执行上面的sal语句时，就不会执行﹔因为version已经变为2了，where条件就不成立。这样就保证了不管调用几次，只会真正的处理一次。
    乐观锁主要使用于处理读多写少的问题

##### 2.2.3.分布式锁：(TODO 不太理解)

​	例如集群下多个定时器处理相同的数据，可以加分布式锁，锁定此数据，处理完成后释放锁。获取到锁的必须先判断这个数据是否被处理过（double check）



#### 2.3 各种唯一约束

1.数据库唯一约束 order_sn字段【数据库层面】

2.redis set防重【百度网盘秒传功能】
需要处理的数据 计算MD5放入redis的set，每次处理数据，先看MD5是否存在，存在就不处理



#### 2.4 防重表

数据库创建防重表，插入成功才可以操作【不采用，DB慢】
使用订单号orderNo作为去重表唯一索引，然后将数据插入去重表+业务操作 放在同一事物中，如果插入失败事物回滚导致业务操作也同时回滚，（如果业务操作失败也会导致插入去重表回滚）保证了数据一致性



#### 2.5 全局唯一id

> 全局请求唯一id：Fegin重复请求会带上老的id去（感觉是Token的感觉），弹幕中很多人公司是这么做的

调用接口时，生成一个唯一ID，redis将数据保存到集合中（去重），存在即处理过

情景1：feign调用 生成一个请求唯一ID，A调用B时带上唯一ID，B处理feign请求时判断此唯一ID是否已处理（feign重试时会带上相同ID）

情景2：页面请求 可以使用nginx设置每一个请求的唯一id，proxy_set_header X-Request-ld $request_id; 【链路追踪】但是没办法保证请求幂等性，因为每次请求nginx都会生成一个新的ID









## [4.分布式事务](./03、本地事务&分布式事务.pdf)

### 4.1.本地事务问题

> ==@Transactional 是本地事务，Fegin 调用的是远程服务 即需要分布式事务==
>
> 本地事务：在分布式系统 只能控制住自己的回滚，控制不了其他服务的回滚（同一个数据库&连接）
>
> 分布式事务：最大原因 网络问题+分布式机器（不同数据库）

实现：抛异常来使整个 @Transactional 回滚

问题：执行成功的远程Feign调用的服务肯定不会回滚了     这里所库存是Fegin，创订单是本方法。如出异常订单库不会创建但是库存表会锁

假失败：Feign Read Out time 但实际执行成功，可能就只是由于网络抖动造成没及时返回

<img src="https://images.zzq8.cn/img/202301190948245.png" alt="image-20230119094829799" style="zoom:67%;" />

ps：都会导致 订单回滚但是下面Feign调用的不会回滚



### 4.2.本地事务隔离级别&传播行为等复习

```java
@Transactional(isolation = Isolation.READ_COMMITTED) //设置事务的隔离级别
@Transactional(propagation = Propagation.REQUIRED)   //设置事务的传播级别
```

[MySQL 事务隔离级别回顾](..\sql\mysql实战45讲#隔离性与隔离级别)

😡TODO：事务的7大传播行为：**传播行为那里，防止本地事务失效**   默认是 required

![](https://img-blog.csdnimg.cn/3a71d6de6f534303944a52c73a33335e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5ZWG5L-K5biF,size_20,color_FFFFFF,t_70,g_se,x_16)

<img src="https://images.zzq8.cn/img/202302231803673.png" alt="image-20230223180315464" style="zoom: 67%;" />

分析 Maven 依赖发现：可能知道会有本地事务失效的问题，搞个AOP给你去代理解决

- org.springframework.cloud:spring-cloud-starter-openfeign:2.1.3.RELEASE
- 带了
- org.springframework.boot:spring-boot-starter-aop:2.1.8.RELEASE



#### [4.2.1.@Transactional](https://blog.csdn.net/shang_0122/article/details/120627232)

My：方便本类方法互调！好像是用AOP的aspectJ实现同一个服务的不同方法用不同事务，不然默认都是用同一个事务

Why：在同一个类里面，编写两个方法，内部调用的时候，会导致事务设置失效。原因是没有用到 代理对象 的缘故。

> * Spring的声明式事务本质上是通过AOP来增强了类的功能
>   * 本质在这个类上的方法在执行前后开启了事务
>
> * Spring的AOP本质上就是为类做了一个代理
>   * 看似在调用自己写的类,实际用的是增强后的代理类
> * 问题的解法
>   * 访问增强后的代理类的方法,而非直接访问自身的方法

```java
	/**
     * 本地事务失效问题
     * 同一个对象内事务方法互调默认失效,原因绕过了代理对象,事务使用代理对象来控制的
     * 解决:使用代理对象来调用事务方法
     *    1)、引入aop-starter;spring-boot-starter-aop;引入了aspectj
     *    2)、@EnableAspectJAutoProxy(exposeProxy=true);开启aspectJ动态代理功能.以后所有的动态代理都是aspectJ（即使没有接口也可以创建动态代理）  对外暴露代理对象
     *    3)、本类互调用调用对象
     *      OrderServiceImpl orderService = (OrderServiceImpl) AopContext.currentProxy();
     *      orderService.b();
     *      orderService.c();
     */
    //同一个对象内事务方法互调默认失效,原因绕过了代理对象
    //事务使用代理对象来控制的
    @Transactional(timeout=30)//a事务的所有设置就传播到了和他公用一个事务的方法
    public void a(){
        //b,c做任何设置都没用.都是和α公用一个事务 只相当于是把b()c()的代码放过来了 MY:这样bc的@Transactional失效
        //this.b();//没用
        //this.c();//没用
      
        //OrderServiceImpl is YourClassName  通过使用AopContext.currentProxy()方法来获取代理对象，并通过代理对象调用methodB方法，可以确保methodB方法被AOP代理捕获，从而使得事务注解生效。
       //需要注意的是，使用AopContext.currentProxy()方法需要确保Spring的exposeProxy属性设置为true，以便让Spring能够在当前线程中暴露代理对象。@EnableAspectJAutoProxy(exposeProxy=true);这里没用Spring默认的AOP（JDK / CGLib）
        OrderServiceImpl orderService = (OrderServiceImpl) AopContext.currentProxy();


        orderService.b();
        orderService.c();

        //bService.b(); //a事务
        //cService.c(); //新事务(不回滚)
        int i = 10/0;
    }

    //这里是REQUIRED所以后面的timeout等设置都没用，会跟着a()的来 30
    @Transactional(propagation= Propagation.REQUIRED,timeout=2)
    public void b(){}
    //7s
    @Transactional(propagation = Propagation.REQUIRES_NEW,timeout = 2)
    public void c() {}
```

为什么会失效呢？`其实原因很简单，Spring在扫描Bean的时候会自动为标注了@Transactional注解的类生成一个代理类（proxy）,当有注解的方法被调用的时候，实际上是代理类调用的，代理类在调用之前会开启事务，执行事务的操作，但是同类中的方法互相调用，相当于this.B()，此时的B方法并非是代理类调用，而是直接通过原有的Bean直接调用，所以注解会失效。`

默认的事务传播属性是Propagation.REQUIRED



#### 4.2.2.补充

> @Transactional失效大概列举几种情况，仅供参考；

1. 直接new出来的对象添加事务不起作用，因为只有spring定义的bean才接受事务。（XD：既然要享受Spring的好处，那就得是Spring）

2. 由于mysql的引擎用Myisam不支持事务，所以如果使用mysal的myisam引擎的话，事务不起作用。
3. 如果@Transaction注解到非public方法上，事务不起作用，这是因为spring的AOP特性。

   * 当`@Transactional`注解应用于非public方法时，Spring的AOP代理机制默认只会代理public方法。这是因为Spring使用基于代理的AOP来实现事务管理，默认使用的是JDK动态代理或CGLIB代理。JDK动态代理只能代理实现接口的类的方法，而CGLIB代理可以代理任何类的方法。但无论是JDK动态代理还是CGLIB代理，它们都无法代理非public方法。因此，如果你将`@Transactional`注解应用于非public方法，事务将不会起作用。
4. 如果在当前类中进行内部调用方法，比如在A类中有a方法和b方法，a方法没有加@Transaction，b方法加了@Transaction，在方法a中调用方法b，方法b中的事务也不会生效。这是因为spring在扫描bean的时候会自动为标注了@Transaction注解类生成一个代理类，在有注解方法被调用时，实际上是代理类调用的，代理类在调用之前会开启事务，执行事务操作。但是同类中的方法相互调用，相当于this.b（），此时的b方法并非代理类调用，而是直接通过原有的bean直接调用，所以注解不起作用。

5. 异常类型错误，如果抛出的 **RuntimeException及其子类** 事务才会回滚。XD：（废话）不是废话，看下面例子

   ```java
   if (account.getBalance().compareTo(amount) < 0) {
           throw new IOException("Insufficient balance"); // 抛出已检查异常
       }
   ```

6. 如果异常被catch到，必须要抛出异常，事务才会回滚。



> GPT：
>
> Spring AOP默认使用的是JDK动态代理或CGLIB代理吗？
> 为什么不能代理非public方法？
> aspectJ可以代理非public方法吗？

默认情况下，Spring AOP 使用 JDK 动态代理来生成代理对象。JDK 动态代理是基于接口的代理，它通过运行时生成代理对象的方式来实现对目标对象方法的拦截和增强。

Spring AOP 也支持使用 CGLIB 代理，当目标对象没有实现接口时，会自动切换到使用 CGLIB 代理。CGLIB 代理是基于继承的代理，它通过生成目标对象的子类来实现对方法的拦截和增强。

关于代理非public方法的问题，这涉及到 JDK 动态代理和 CGLIB 代理的限制。

JDK 动态代理只能代理实现了接口的目标对象，并且只能代理接口中定义的方法。它无法代理目标对象中的非 public 方法，因为接口中的方法默认为 public，而非 public 方法在接口中是不可见的。

==CGLIB 代理可以代理目标对象中的非 public 方法，因为它是通过生成目标对象的子类来实现代理的，子类可以访问父类的非 public 方法。==但是，CGLIB 代理也有一个限制，就是无法代理被 final 关键字修饰的方法，因为 final 方法无法被子类重写。

==关于 AspectJ，它是一个独立的 AOP 框架，与 Spring AOP 有所不同。AspectJ 可以代理非 public 方法，因为它在编译时织入切面，直接修改字节码。AspectJ 可以实现更强大的切面功能，包括对非 public 方法的拦截和增强。==

总结起来，Spring AOP 默认使用 JDK 动态代理，无法代理非 public 方法。如果需要代理非 public 方法或使用更强大的切面功能，可以考虑使用 AspectJ。





### [4.3.分布式事务几种方案](./03、本地事务&分布式事务.pdf)

分布式每个服务用自己的数据库，每个服务放的机器还不一样
一个机器的成功失败，别的节点无法感知

分布式系统经常出现的异常 机器宕机、网络异常、消息丢失、消息乱序、数据错误、不可靠的 TCP、存储数据丢失...

<img src="https://images.zzq8.cn/img/202301191503753.png" alt="image-20230119150306322" style="zoom: 67%;" />

[CAP & BASE & Seata with My](../javaframework/springcloud#cap)   建议结合自己的这篇Seata笔记看，更了解 2PC



> 刚性事务（强一致性） vs 柔性事务（最终一致性）
>
> [这里具体看 PDF！](./03、本地事务&分布式事务.pdf)注意方案是方案框架是框架（落地实现这个方案）  **✔是高并发优先考虑的，用MQ**    订单用异步确保型/商品保存可2PC
>
> 实际上，柔性事务就是 BASE 理论 +业务实践     **柔性事务追求的是最终一致性。**

* `2PC`（Seata是这个的一个变形）还有3PC  【2 phase commit 二阶提交】  准备阶段+提交阶段  TODO扩展
  注意和MySQL写日志的两阶段提交区分，是不一样的东西。Seata AT是第一阶段提交+2第二阶段看要不要补偿-2  只适合一般的分布式事务不合适高并发     虽然它有补偿机制，但他就是刚性事务



* 柔性事务-`TCC` 事务补偿型方案：相当于3PC的手动版
  商城项目用的很多，也有很多框架给你去用。把正常的业务代码按照框架要求拆成z和三部分就行  Try+2/add  Cancel-2/delete



* 柔性事务-最大努力通知型方案（弹幕有公司是这个）✔
  支付宝告诉你有没有支付成功，MQ 一会发个消息告诉你成了 一会发个消息告诉你成了



* 柔性事务-**可靠消息**+最终一致性方案（异步确保型，视频是这个）✔
  也是借助 MQ  总结一句：异步下单，提高并发，提升响应，提升购物体验。



> 后来补充-总结两者：
>
> * `2PC/3PC` 依靠数据库或者存储资源层面的事务（XD: Seata好像借助了表），`TCC` 主要通过修改业务代码来实现。
> * `2PC/3PC` 属于业务代码无侵入的，`TCC` 对业务代码有侵入。
> * `2PC/3PC` 追求的是强一致性，在两阶段提交的整个过程中，一直会持有数据库的锁。`TCC` 追求的是最终一致性，不会一直持有各个业务资源的锁。



## 5.RabbitMQ延时队列(实现定时任务)

[MQ笔记](../mq/rabbitmq)

[该业务的MQ架构图](消息队列流程.jpg)

## 6.解锁库存

看着有些繁琐，直接 CV ，没有去捋了





## 7.支付

> 以后有空可以试着做做微信的！项目代码中他做了！！！可以参考

### 7.1.前言

> 用的是支付宝的沙盒，测试时候这个通了正式环境改个参数就行

签名可以想象为 MD5 稍微变动就变

支付宝私钥是肯定不知道的

![image-20230202110044964](https://images.zzq8.cn/img/202302021100433.png)



### 7.2.使用

具体想体验深一点可以下载ali的model有几个jsp页面和一个配置类，导入Eclipse进行测试。这个model有很多东西可以抽出来用。

雷神自己根据 ali 的 model 封装了一个`AlipayTemplate` 使用就 `alipayTemplate.pay(payVo)` 完成！其它全是配参数

#### 7.2.1.异步回调

我这里由于没有用内网穿透暂且搁置

不建议在同步回调直接修改订单状态，推荐在异步回调的时候修改订单状态
因为：支付成功后url? 后会带签名等信息给你去验证。但是用户可能没进这个成功页面

```java
// 服务器[异步通知]页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
// 支付宝会悄悄的给我们发送一个请求，告诉我们支付成功的信息       
public String notify_url
    
    
写一个Controller处理订单状态，最后得 return "success" 不然支付宝服务器还会通知【柔性事务-最大努力通知型方案】
```



**注意：修改订单状态之前一定要验签！万一别人知道这个请求路径用postman发一个假的数据让你改订单状态能篡改伪造**



各位注意:这里老师在配置文件中改时间格式一定用弃用的格式化方式和老师一样，不然会报错，而且贼难找。排了2个多小时。

mvc配时间格式



#### 7.2.2.收单

pay时候可以根据官网给一个时间参数



时延问题：订单关单的时候手动调用支付宝的收单



也可 搞个定时任务与支付宝对账    这些在ali api中都有示例

## 8.内网穿透

> 支付宝服务器异步回调 验签、改订单状态 时候。肯定需要公网ip才能访问到你

### 8.1.原理

说白了就是用内网穿透服务商备案好了的提供给你用   主域名备案好了下面的二级三级就不需要了

<img src="https://images.zzq8.cn/img/202302021058877.png" alt="image-20230202105845657" style="zoom:67%;" />

### 8.2.适用场景

1、开发测试（微信、支付宝） 

2、智慧互联 （路由器可以绑花生壳，我没在家也能访问！！！）

3、远程控制 4、私有云



### 8.3.服务商

utools也可以内网穿透，我之前用过

1、natapp：https://natapp.cn/ 优惠码：022B93FD（9 折）[仅限第一次使用] 

2、续断：www.zhexi.tech 优惠码：SBQMEA（95 折）[仅限第一次使用]     视频中用的这个一个月9块

3、花生壳：https://www.oray.com/





### 8.4.我的问题

注意支付成功后的异步回调需要内网穿透和Nginx联调

问题是域名问题 沿用了外网的域名 所以到不了网关







注意：内网穿透后发现F12是下面的，访问也老是404。第二天才发现是clash的问题查了7890的端口         ==但是改了后还是不行搞了几个小时搞不好==

Remote Address: 192.168.0.1:7890







# 十、秒杀

> ==打算一口气看完视频，后期自己根据网友笔记再补代码==  跳过
>
> 定时任务就参考秒杀系统的定时任务设计    [重点看一下秒杀系统设计的那一集](https://www.bilibili.com/video/BV1np4y1C7Yf?t=92.6&p=321)

秒杀具有瞬间高并发的特点，针对这一特点，必须要做限流 + 异步+ 缓存（页面静态化）+ 独立部署。

## 1. 秒杀（高并发）系统关注的问题

前端限流：点一下要1s后才能再点..

07 保证服务的稳，其它有了快

<img src="http://image.zzq8.cn/img/202308231025296.png" alt="image-20230316140448941" style="zoom: 33%;" />

<img src="http://image.zzq8.cn/img/202308231025131.png" alt="image-20230316140459330" style="zoom:33%;" />



## 2.Quartz

> jdk Timer.class 可以做一点定时任务，包括Spring也有自己的定时任务注解。可能实际开发更多的是用框架 Quartz
> 视频用的就是 Spring 的定时任务

### 2.1.cron 表达式	

可以使用在线的Cron表达式生成器

语法：秒 分 时 日 月 周 年（Spring 不支持）     日和周的位置至少有个?因为两个制约了

注意周中1代表周日   看pdf的图片





### 2.2.Spring 定时任务Demo

```java
/**
 * 定时任务
 * 1、@EnableScheduling 开启定时任务
 * 2、@Scheduled开启一个定时任务
 * 3、自动配置类 TaskSchedulingAutoConfiguration
 *
 * 异步任务
 * 1、@EnableAsync:开启异步任务
 * 2、@Async：给希望异步执行的方法标注
 * 3、自动配置类 TaskExecutionAutoConfiguration
 *
 * 思考异步编排和异步任务的区别，这种异步任务不好管理好像也是个Executor
 * 觉得可以把他当成异步编排，该配置去yaml配。一种手动写代码一种直接注解到方法
 */

@Slf4j
@Component
@EnableAsync
@EnableScheduling
public class HelloSchedule {

    /**
     * 与Quarz Cron的两点区别：
     * 1、在Spring中表达式是6位组成，不允许第七位的年份
     * 2、在周几的的位置,1-7代表周一到周日  MON-SUN（英文标识也行）
     *
     * 定时任务不该阻塞。（默认是阻塞的）
     * 1）、可以让业务以异步的方式，自己提交到线程池
     *      CompletableFuture.runAsync(() -> {
     *      },execute);
     *
     * 2）、支持定时任务线程池；设置 TaskSchedulingProperties （size 默认是1 所以才会阻塞）
     *      spring.task.scheduling.pool.size: 5  【雷神说这个不好使，有bug】
     *
     * 3）、让定时任务异步执行
     *      异步任务
     *
     * 解决：使用异步任务 + 定时任务来完成定时任务不阻塞的功能
     * 注意：这两者都有其线程池，注意要配置
     */
    @Async
    @Scheduled(cron = "*/5 * * ? * 5")
    public void hello() throws InterruptedException {
        log.info("hello...");
        Thread.sleep(3000);
    }

}
```











加商品随机码 秒杀链接加密，防黄牛 随机码，秒杀开始才暴露

Redisson的信号量   每一个商品都有它的参与秒杀的库存信号量  `redissonClient.getSemaphore(SKU_STOCK_SEMAPHORE + token);`
信号量最大作用：限流



定时任务上架：TODO 幂等性处理























伪完结：

1）秒杀往后没跟

微服务因为模块很多需要 **可以由全自动部署机制独立部署**，[具体看 martinfowler 的见解！](https://www.yuque.com/atguigu/springboot/na3pfd#gXHqd)
