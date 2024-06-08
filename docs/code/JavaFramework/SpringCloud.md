---
article: false
---
# SpringCloud

> 尚硅谷周阳老师 2022/5/23   详细笔记看脑图 和 [别人的笔记](https://blog.csdn.net/u011863024/article/details/114298270) 和 [别人的代码](https://gitee.com/lixiaogou/cloud2020/tree/master/)，这里只记录于自己而言是重点的内容

> 标题 新旧交替学习
>
> 14种组件技术的学习，30多个Model。需要多动手！不要一听就会一动手就废。   **知行合一**
>
> 不要被各种高大上的词汇唬住了，都是上层（应用层）的东西，基本没有什么算法，跟着视频教程学，其实还是很好理解的。
>
> 3W法—what，why，how的运用
>
> 以后碰到什么问题先查 官网文档，再去Google ChartGPT ！

## ==------服务注册与发现------==

## 一、前言

### [1. 介绍](https://www.yuque.com/atguigu/springboot/na3pfd#gXHqd)

> SpringCloud -> 分布式微服务架构的一站式解决方案，是多种微服务架构落地技术的集合体，俗称微服务全家桶
>
> 直接看提出者的 Blog ！！！ ==Click the title acquire==



>分布式 (部署方式)  vs  微服务 (架构风格)  

生产环境下的微服务肯定是分布式部署的

但是分布式部署的应用不一定是微服务架构的，比如集群部署，它是把相同应用复制到不同服务器上，但是逻辑功能上还是单体应用。



> 微服务理解：可以粗鄙的理解为 SpringBoot 开发的一个个模块单元

架构模式，把单一应用程序划分成一组小的服务，服务之间相互协调、相互配合。

每个服务运行在其独立的进程中，服务与服务间采用轻量级的通信机制相互写作（通常是基于HTTP协议的RESTful API）

![image-20220523154541922](https://images.zzq8.cn/img/202205231606492.png)



强就强在它是一个整体，像苹果生态。 不然我手机苹果电脑华为平板小米直接协调的话就会麻烦。



搂一眼京东的：

![image-20220523161504577](https://images.zzq8.cn/img/202205231615718.png)





需要学习：注意有一些会有变更，新的老的都学！

![image-20220523162302969](https://images.zzq8.cn/img/202205231623078.png)



### [2. 再次总结什么是微服务](https://www.yuque.com/atguigu/springboot/na3pfd#gXHqd)

> 直接看提出者的 Blog ！！！ ==Click the title acquire==

- 微服务是一种架构风格
- 一个应用拆分为一组小型服务
- 每个服务运行在自己的进程内，也就是可独立部署和升级
- 服务之间使用轻量级HTTP交互
- 服务围绕业务功能拆分
- 可以由全自动部署机制独立部署
- 去中心化，服务自治。服务可以使用不同的语言、不同的存储技术



## 二、版本选择

> GA：General Availability，正式发布的版本，官方开始推荐广泛使用，国外有的用GA来表示release版本。
>
> RELEASE：正式发布版，官方推荐使用的版本，有的用GA来表示。比如spring。

了解：

Spring Cloud 采用了**英国伦敦地铁站**的名称来命名，并由地铁站名称字母 A-Z 以此类推的形式来发布迭代版本。



具体版本选择可以看 Spring Cloud 官网 overview 下面有说明。Spring Cloud 对应的 Spring Boot 版本：

![image-20220523170052524](https://images.zzq8.cn/img/202205231700591.png)



具体看更详细的依赖 https://start.spring.io/actuator/info



## 三、==组件停更说明==

> 总结：Ali 的 Nacos 很厉害
>
> 把图片放大看！

![image-20220523172626378](https://images.zzq8.cn/img/202205231726500.png)

## 四、编码构建

> 约定 > 配置 > 编码

idea的配置 + 父工程的配置, 具体看项目体现

### 1. IDEA 新建 父工程

#### 1.1 dependencyManagement 标签

> 通常会在一个组织或者项目的最顶层的 **父POM** 中看到dependencyManagement元素。
>
> 子工程会向上找 dependencyManagement 然后用 其 (父工程) 引入的 jar 包的版本号
>
> 注意: 父工程这里只是起一个定义作用 -> dependencyManagement里**只是声明依赖，并不实现引入**，因此子项目需要显示的声明需要用的依赖。
>
> [强力推荐看这篇](https://zhuanlan.zhihu.com/p/99643458)  \<dependencyManagement> 针对的是儿子模块（父子），不是自己本身的模块

```xml
<!-- 子模块继承之后，提供作用：
      锁定版本+子modlue不用写groupId和version -->
<dependencyManagement>
    <dependencies>
        <dependency>
        <groupId>mysq1</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.2</version>
        </dependency>
        
      <!--spring boot 2.2.2, 子模块整个 spring boot 相关的都是2.2.2.RELEASE-->
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>2.2.2.RELEASE</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    <dependencies>
</dependencyManagement>
        
        	父
        #############
        	子
        
<dependencies>
    <dependency>
        <groupId>mysq1</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
</dependencies>
        
<!-- 这样做的好处就是：如果有多个子项目都引用同一样依赖，则可以避免在每个使用的子项目里都声明一个版本号，这样当想升级或切换到另一个版本时，只需要在顶层父容器里更新，而不需要一个一个子项目的修改；另外如果某个子项目需要另外的一个版本，只需要声明version就可。-->        
```

测试了一下：发现子 Model 继承了父的所有包括 \<build> 只要注意写 artifactId 就好 !



#### 1.2 maven 跳过单元测试

> ==节约时间==

![image-20220523210748358](https://images.zzq8.cn/img/202205232107484.png)



### 2. Rest 微服务工程构建

>创建微服务模块套路：

1. 建Module
2. 改POM
3. 写YML
4. 主启动
5. 业务类

热部署其实就是热重启，真正的热部署只部署改动的 官方文档说了需要付费。注意：因为其采用的虚拟机机制，该项重启是很快的



#### 2.1 Springboot maven plugin插件原理及作用【扩展】

==可能我还是不理解 spring-boot-maven-plugin插件作用，它的作用仅仅是为了重新打包生成一个*.original文件吗==

一般的maven项目的打包命令，不会把依赖的jar包也打包进去的，只是会放在jar包的同目录下，能够引用就可以了，但是spring-boot-maven-plugin插件，会将依赖的jar包全部打包进去。

https://www.jb51.net/article/197968.htm



在没有使用spring-boot-maven-plugin插件时，打包的目录只有两个，META-INF和我自己的项目代码的目录。

只会生成一个 .jar 文件

![image-20220525204018181](https://images.zzq8.cn/img/202205252040293.png)

在使用spring-boot-maven-plugin插件时，打包后的目录包括三个

多一个 *.original 文件

![image-20220525204651902](https://images.zzq8.cn/img/202205252046930.png)

1. BOOT-INF
2. META-INF
3. org.springframework.boot.loader，在lib目录里包含了我自己的项目的代码目录；



#### 2.2 ==restTemplate==

在没有讲 Ribbon 之前都先用这个！

JDBCTemplate、RedisTemplate

两个服务间的调用：

* 原始的 web 阶段 -> httpClient
* 现在进化了以后 restTemplate，相当于给httpClient 做了一次封装，实现了两个服务的横向调用



### 3. 工程重构

每一个模块都有一样的 包 包里的类也一模一样，考虑重构提取出来 install成jar包供外面用

install(安装至本地仓库)(在本地Repository中安装jar)



## 五、Eureka 服务注册和配置中心 ×

入门篇已讲完，开始基础篇的学习

> 老的  **Eureka包含两个组件:Eureka Server和Eureka Client**
>
> 这个东西相当于 物业公司，而组件就是 入驻企业

### 概述

上面的服务项目实例中，服务提供方对外提供服务，需要对外暴露自己的地址，而服务调用者需要记录服务提供者的地址，将来地址出现变动时，需要及时更新。

当服务数量比较少时，这些不会造成困扰，一旦服务数量增多，管理上就非常麻烦。这就需要服务注册中心来统一管理。



### 1.1 什么是服务治理

Spring Cloud封装了Netflix 公司开发的Eureka模块来实现服务治理

在传统的RPC远程调用框架中，管理每个服务与服务之间依赖关系比较复杂，管理比较复杂，所以需要使用服务治理，管理服务于服务之间依赖关系，可以实现服务调用、负载均衡、容错等，实现服务发现与注册。



### 1.2 什么是服务注册与发现

Eureka采用了CS的设计架构，Eureka Sever作为服务注册功能的服务器，它是服务注册中心。而系统中的其他微服务，使用Eureka的客户端连接到 Eureka Server并维持 **心跳连接**。这样系统的维护人员就可以通过Eureka Server来监控系统中各个微服务是否正常运行。

在服务注册与发现中，有一个注册中心。当服务器启动的时候，会把当前自己服务器的信息比如服务地址通讯地址等以别名方式注册到注册中心上。另一方(消费者服务提供者)，以该别名的方式去注册中心上获取到实际的服务通讯地址，然后再实现本地RPC调用RPC远程调用框架核心设计思想:在于注册中心，因为使用注册中心管理每个服务与服务之间的一个依赖关系(服务治理概念)。在任何RPC远程框架中，都会有一个注册中心存放服务地址相关信息(接口地址)



### 1.3 Eureka 集群

Eureka Server 互相指向对方 【有向图】

>题外话：rpc 是一种思想 一种概念
>
>题外话：多台服务器 Session 怎么共享：Redis
>
>看这个图 Eureka 和 Provider 都是多个集群，为了达到高可用

![image-20220527162304318](https://images.zzq8.cn/img/202205271623284.png)

解决办法：搭建 Eureka 注册中心集群，实现负载均衡 + 故障容错



### 1.4 Service Provider 集群

> 注意 80 的消费者不能把 Service Provider 的域名写死，要写成注册进 Eureka 的服务别名
>
> 记得带上 http:// 这个前缀

http://localhost:8001  <---换成--->  http://CLOUD-PAYMENT-SERVICE



> 使用@LoadBalanced注解赋予RestTemplate负载均衡的能力
>
> 不然会报错

```java
@Bean
@LoadBalanced//使用@LoadBalanced注解赋予RestTemplate负载均衡的能力
public RestTemplate getRestTemplate(){
    return new RestTemplate();
}
```



##### actuator 微服务信息完善

>使用 spring-boot-starter-actuator 可以用于检测系统的健康情况、当前的Beans、系统的缓存等，具体可检测的内容参考下面的链接： https://docs.spring.io/spring-boot/docs/2.6.1/reference/htmlsingle/#actuator.endpoints.exposing



### 1.5 服务发现 Discovery

> @EnableDiscoveryClient 很重要
>
> 以后 @EnableEurekaClient 被 zookeeper、nacos 代替，但是上面这个注解不会

相当于网站上的关于我，可以看到各个注册服务的信息

对于注册进eureka里面的微服务，可以通过服务发现来获得该服务的信息

注意是这个包下面的 cloud 的，就如我第二句说的，这个注解会常用，不是 Eureka 的：import org.springframework.cloud.client.discovery.DiscoveryClient;



### 1.6 Eureka自我保护理论知识

通俗来讲：**绝情版** ，就是改配置 禁止自我保护

原先：

一句话：某时刻某一个微服务不可用了，Eureka不会立刻清理，依旧会对该微服务的信息进行保存。

为了EurekaClient可以正常运行，防止与EurekaServer网络不通情况下，EurekaServer不会立刻将EurekaClient服务剔除



## 六、Zookeeper 替代 Eureka

#### 因为需要 虚拟机 暂时搁置，这一节自己还没有实践！！！

> 相对 Eureka 不同是这个是上面提到的 无情版，有就是有没有就是没有，是**临时节点** ，没有Eureka那含情脉脉。
>
> 需要在 linux 上操作 zookeeper



> Q：==需要明白为什么和 Eureka 不一样这个需要 linux？？？==
>
> A：**eureka要建个springboot，而ZK在服务器上部署就开了做注册中心了**



## 七、Consul 代替 Eureka

zookeeper可以用，但是用的少。如果没有 alibaba 的 Nacos，那这个基本就是 Eureka 的接班人



## 八、三个注册中心异同点

###### ==CAP：==

> CAP 理论和 BASE 理论是分布式领域非常非常重要的两个理论。不夸张地说，只要问到分布式相关的内容，面试官几乎是必定会问这两个分布式相关的理论。
>
> 不论是你面试也好，工作也罢，都非常有必要将这两个理论搞懂，并且能够用自己的理解给别人讲出来。
>
> 我这里就不多提这两个理论了，不了解的小伙伴，可以看我前段时间写过的一篇相关的文章：[《CAP 和 BASE 理论了解么？可以结合实际案例说下不？》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247495298&idx=1&sn=965be0f54ab44bda818656db1f21a39f&chksm=cea1a149f9d6285f1169413ab7663ca2a9c1a8440a5ae5816566eb66b20e4d86f5db1002f66c&token=657875872&lang=zh_CN#rd) 。

- `C：Consistency (强一致性)：`
  - 该特性是指所有节点在相同时刻的数据完全一致（忽略网络延迟，理想的同时刻数据一致性无法实现）。 一致性可以根据一致的程度划分为强一致性，弱一致性，最终一致性。
  - My：A好实现，C要怎么实现保持同步呢？-> 一些一致性算法 例如 [raft 算法](http://thesecretlivesofdata.com/raft/)、paxos 
  
- `A：Availability (可用性)：`
  - 该特性是指系统为用户提供的服务可一直使用（非宕机节点），不会出现用户操作不允许等用户体验不好的情况。
  - My：这个好理解，其它节点都是同步好的数据8 但有个节点还没同步好是7 别人访问了就访问了。这个好实现
  - `BASE 理论` 是对 CAP 理论的延伸（**更具体地说，是对 CAP 中 AP 方案的一个补充**），思想是即使无法做到强一致性（CAP 的一致性就是强一致性），但可以采用适当的采取弱一致性，即最终一致性。
  
- `P：Partition tolerance （分区容错性)：`
  - 分布式系统在遇到网络故障的时候，仍然能够对外提供满足一致性和可用性的服务，除非整个网络环境都发生了故障。

**我可以理解为：CAP是一种理论，具体落地实现是raft算法是C理论的解决方案，BASE是A的解决方案吗     Right！**



> ==后来补充：混淆点==
>
> **什么是网络分区？**
>
> > 分布式系统中，多个节点之前的网络本来是连通的，但是因为某些故障（比如部分节点网络出了问题）某些节点之间不连通了，整个网络就分成了几块区域，这就叫网络分区。
>
> ![图片](https://images.zzq8.cn/img/202309071730848.png)
>
> Question：既然网络都分区了为什么还能保持CP
>
> Anser：如果一个分布式系统在发生网络分区时选择保持一致性（CP），那么在分区期间，系统将拒绝对处于分区中的节点的读写请求，以确保数据的一致性。这意味着分区中的节点将无法提供服务，因为它们无法达到一致的状态。系统会等待分区解决后，再继续提供服务，以确保数据的一致性。
>
> ### 不是所谓的“3 选 2”
>
> 在系统发生“分区”的情况下，CAP 理论只能满足 CP 或者 AP。要注意的是，这里的前提是系统发生了“分区”
>
> ==如果系统没有发生“分区”的话，节点间的网络连接通信正常的话，也就不存在 P 了。这个时候，我们就可以同时保证 C 和 A 了。==
>
> 因此，AP 方案只是在系统发生分区的时候放弃一致性，而不是永远放弃一致性。在分区故障恢复后，系统应该达到最终一致性。这一点其实就是 BASE 理论延伸的地方。



raft算法：raft是一种协议

* 任何节点有3状态，leader（领导），follower（跟随），candidate（候选）
* 领导选举：必须选出一个唯一的leader，不然要一直投票
* 日志复制：在心跳时间的时候发送



==BASE：==

* 基本可用（`B`asically `A`vailable）
  * 基本可用是指分布式系统在出现故障的时候，允许损失部分可用性（例如响应时间、功能上的可用性），允许损失部分可用性。需要注意的是，基本可用绝不等价于系统不可用。
    * 响应时间上的损失：正常情况下搜索引擎需要在 0.5 秒之内返回给用户相应的查询结果，但由于出现故障（比如系统部分机房发生断电或断网故障），查询结果的响应时间增加到了 1~2 秒。
    * 功能上的损失：购物网站在购物高峰（如双十一）时，为了保护系统的稳定性，部分消费者可能会被引导到一个降级页面。
* 软状态（`S`oft State）
  * 软状态是指允许系统存在中间状态，而该中间状态不会影响系统整体可用性。分布式存储中一般一份数据会有多个副本，允许不同副本同步的延时就是软状态的体现。mysql replication 的异步复制也是一种体现。
* 最终一致性（`E`ventual Consistency）
  * 假如Gulimall订单服务掉其它业务都回滚了，但订单却创建了（本来不该有）。后面可以利用一些手段校验它不该存在并删了它



[分布式事务几种方案](../03、本地事务&分布式事务.pdf)



CAP理论的核心是：**一个分布式系统不可能同时很好的满足一致性，可用性和分区容错性这三个需求**。

> Q: **为什么不能同时满足3个**
>
> A: [\+ 如果不支持P，那么就无分布式概念了。
>   \+ 用户向节点1写入一个值，节点2由于分区无法更新该值，那么数据就不一致。](https://zhuanlan.zhihu.com/p/355972182)
>
> 这一点简而言之：系统中的某个节点在进行写操作。为了保证 C， 必须要**禁止其他节点的读写操作**，这就和 A 发生冲突了。



>Q:  **没有发生网络分区时候，系统应该选择什么特性？**
>A: \+ 其实正常情况下都不会发生网络分区，那么系统设计的时候需要考虑到满足CA特性，只有当系统发生分区时候，根据场景特性选择CP或者AP



>Q: **关于 P 的理解**
>
>A: [现实情况下我们面对的是一个不可靠的网络 - > 网络丢包、有一定概率宕机的设备 - > 节点宕机，这两个因素都会导致Partition，因而分布式系统实现中 P 是一个必须项，而不是可选项](http://www.mamicode.com/info-detail-1263729.html)（现实生活中我们没办法保证网络不中断网线不会断，除非单台机器CA自己本地访问自己localhost但不可能）
>
>遇到某个节点或网络分区故障的时候，集群下仍然有节点能够持续提供服务（服务：服务只能在一致性和可用性之间取舍）

因此，根据CAP原理将NoSQL数据库分成了满足CA原则、满足CP原则和满足AP原则三大类:

![img](https://images.zzq8.cn/img/202205301552992.png)

AP架构（Eureka）

![img](https://images.zzq8.cn/img/202205301552994.png)

CP架构（ZooKeeper/Consul）

![img](https://images.zzq8.cn/img/202205301552734.png)



## ==------服务调用------==

## 一、Ribbon✔

### 1. 前言

> Spring Cloud Ribbon是基于Netflix Ribbon实现的一套 **==客户端==负载均衡的工具**。
>
> 负载均衡 + RestTemplate调用

主要功能是提供 **客户端的软件负载均衡算法和服务调用**。

Ribbon目前也进入维护模式。

Ribbon未来可能被Spring Cloud LoadBalacer替代。



> Ribbon本地负载均衡客户端VS Nginx服务端负载均衡区别

Nginx是服务器负载均衡，客户端所有请求都会交给nginx，然后由nginx实现转发请求。即负载均衡是由服务端实现的。
Ribbon本地负载均衡，在调用微服务接口时候，会在注册中心上获取注册信息服务列表之后缓存到 JVM 本地，从而在本地实现RPC远程服务调用技术。



### 2. Ribbon的负载均衡和Rest调用

```xml
spring-cloud-starter-netflix-eureka-server
spring-cloud-starter-netflix-ribbon

先前工程项目没有引入spring-cloud-starter-ribbon也可以使用ribbon。
这是因为spring-cloud-starter-netflix-eureka-client自带了spring-cloud-starter-ribbon引用。
```

前面测试的时候，8001、8002 默认的是 **轮询** 负载访问，有 7 大负载算法



### 3. Ribbon负载规则替换

1.修改cloud-consumer-order80

2.注意配置细节

官方文档明确给出了警告:

**这个自定义配置类不能放在@ComponentScan所扫描的当前包下以及子包下**，

否则我们自定义的这个配置类就会被所有的Ribbon客户端所共享，达不到特殊化定制的目的了。

也就是说不要和启动类一个包路径



我这里

```java
@RibbonClient(name = "cloud-payment-service", configuration = MySelfRule.class)
name 我是小写才生效 ！！！
```



**手写轮询算法，自己境界没到 先欠着！**

到时候估计得还债



## 二、OpenFeign✔

### 1. OpenFeign服务调用

> **TODO：就算配了超时时间 第一次跑也老是超时，后面就不会了**
> 这是由于在调用其他微服务接口前，会去请求该微服务的相关信息(地址、端口等)，并做一些初始化操作，由于默认的[懒加载](https://so.csdn.net/so/search?q=懒加载&spm=1001.2101.3001.7020)特性，导致了在第一次调用时，出现超时的情况    **解决：Ribbon配置饥饿加载（最佳）**
>
> **注意**: Feign 是整合进了 Ribbon 的，天生带着他       Feign是基于HTTP客户端的声明式Web服务客户端 
>
> 以前是: Ribbon+RestTemplate   一套模版化的调用方法
>
> 现在用 OpenFeign 定义一个 @FeignClient("服务名") 到接口就行，像 @Mapper 的感觉一样  ->  接口 + 注解



以前要搞一个配置类@LoadBalanced返回一个RestTemplate的Bean          然后Controller再用这个restTemplate Bean

现在 Service 接口定义一个 @FeignClient 注解 指向服务提供者payment      就可以直接在本80调用8001的（也就是指向服务提供者的东西）



总结：想要远程调用别的服务 

1）、引入open-feign   

2）、编写一个接口，告诉 SpringCloud 这个接口需要调用远程服务

​	1、声明接口的每一个方法都是调用哪个远程服务的哪个请求

3）、开启远程调用功能，在主启动类加 @EnableFeignClients

```java
/**
  * 这是一个声明式的远程调用
  */
@FeignClient("gulimall-coupon")
public interface CouponFeignService {
    //从 gulimall-coupon 中找 /coupon/coupon/member/list 这个方法
    @RequestMapping("/coupon/coupon/member/list")
    public R memberCoupons();
}

//主启动类
@EnableFeignClients("com.zzq.gulimall.member.feign")


===============================自己这边的 Model 业务调用处理
    @Autowired
    CouponFeignService couponFeignService;
    /**
     * DIY
     */
    @RequestMapping("/coupons")
    public R RPCTest(){
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setNickname("张三");
		// Here
        R r = couponFeignService.memberCoupons();
        return R.ok().put("member",memberEntity).put("coupons",r.get("coupons"));
    }
```





### 2. OpenFeign超时控制

> **OpenFeign默认等待1秒钟，超过后报错**
>
> 客户端只等1秒钟，服务端超过了1秒钟

场景：故意把服务的提供者 8001 端业务设成耗费3秒钟，证明上面问题，这时客户端就会报错！

```java
java.net.SocketTimeoutException: Read timed out
```

**YML文件里需要开启OpenFeign客户端超时控制**

注意：直接用就行,这只是==idea不给提示==,不影响效果

```yaml
#设置feign客户端超时时间(OpenFeign默认支持ribbon)(单位：毫秒)
ribbon:
  #指的是建立连接所用的时间，适用于网络状况正常的情况下,两端连接所用的时间
  ReadTimeout: 60000
  #指的是建立连接后从服务器读取到可用资源所用的时间
  ConnectTimeout: 60000
```



### 3. OpenFeign日志增强

1. config 中注册一个 Bean（Logger.Level）
2. yaml 中配置feign日志以什么级别监控哪个接口





### 4.补充：GuliMall

#### 4.1.源码

1. 构造请求数据，将对象转为json；
      RequestTemplate template = buildTemplateFromArgs,create（argv）；
      
2. 发送请求进行执行（执行成功会解码响应数据）：
      executeAndDecode（template）；

3. 执行请求会有重试机制

   ```java
   while(true) {
   try {
   	return this.executeAndDecode(template);
   }catch (RetryableException var8) {
       xxx
   	retryer.continueOrPropagate(e);
   }
   	continue;
   }
   ```




#### 4.2.问题

Feign远程调用丢失请求头：订单模块的 Feign 源码会自动创 Request 导致丢失 Cookie。而底层自创的时候用到拦截器增强（即DIY				个拦截器把原Requset Cookie放新Request）    解决重点：Spring类 `RequestContextHolder`





补充我的问题：

> openfeign会有丢失请求头的情况是因为它是基于http请求，而http请求又是无状态协议的原因吗

OpenFeign是一个基于HTTP协议的Java HTTP客户端，用于简化HTTP API的调用。它不会导致丢失请求头的情况，因为HTTP请求头是在每个请求中明确发送的，无论是使用OpenFeign还是其他HTTP客户端库。

**HTTP协议本身是无状态的，这意味着每个请求都是独立的**，服务器不会保留任何关于客户端的状态信息。但是，HTTP协议允许在请求头中发送状态信息，以便服务器可以了解客户端的状态。这些状态信息可以包括认证令牌、会话ID、请求参数等。

OpenFeign可以通过设置请求头来发送这些状态信息，以便服务器可以了解客户端的状态。如果请求头在OpenFeign中丢失，可能是由于OpenFeign配置不正确或由于网络问题导致的。但这并不是HTTP协议本身的限制，而是客户端的实现问题。



## ==------服务降级------==

## 一、Hystrix ×

> 豪猪哥出道即巅峰，后面那些都有抄它的借鉴它的理念。官网推荐用 resilience4j 但这里是中国，言外之意就是没有用这个，都会向Alibaba靠拢！
>
> 学习理念设计和思想，Alibaba sentinel后面都是一些细节和配置（天下文章一堆抄）

**服务雪崩**

多个微服务之间调用的时候，假设微服务A调用微服务B和微服务C，微服务B和微服务C又调用其它的微服务，这就是所谓的“扇出”。**如果扇出的链路上某个微服务的调用响应时间过长或者不可用，对微服务A的调用就会占用越来越多的系统资源，进而引起系统崩溃，所谓的“雪崩效应”.**

**Hystrix是什么**

类似熔断保险丝

### 1. 重要概念

* 服务降级

  * 例如打10086人工，坐席忙继续等待请按1无需等待请挂机
  * 在运维期间，当系统处于高峰期，系统资源紧张，我们可以**让非核心业务降级运行。降级：某些服务不处理，或者简单处理**【抛异常、返回NULL、调用 Mock 数据、调用 Fallback 处理逻辑】。

* 服务熔断

  * 保险丝，上面服务降级可没停
  * 设置服务的超时，当被调用的服务经常失败到达某个阈值，我们可以开启**断路保护机制**，后来的请求不再去调用这个服务。本地直接返回默认的数据

* 服务限流

  * 秒杀高并发，让大家排队

  

**哪些情况会出发降级**

- 程序运行导常
- 超时
- 服务熔断触发服务降级
- 线程池/信号量打满也会导致服务降级



注意：SpringBoot 默认继承的是 Tomcat ，tomcat的默认的工作线程数



### 2. 服务降级

先 8001 先从自身找问题 **分两步走:**

1. @Service 中对方法配置 @HystrixCommand 里面的参数 fallbackMethod 指定兜底的方法
2. 主启动类激活  添加新注解@EnableCircuitBreaker

80 可以根据 8001 的一样的依葫芦画瓢



#### 2.1 解决代码膨胀问题

目前问题1 每个业务方法对应一个兜底的方法，代码膨胀

解决方法：搞个 Global 的方法，默认都用这个

1:1每个方法配置一个服务降级方法，技术上可以，但是不聪明

1:N除了个别重要核心业务有专属，其它普通的可以通过@DefaultProperties(defaultFallback = “”)统一跳转到统一处理结果页面

通用的和独享的各自分开，避免了代码膨胀，合理减少了代码量



#### 2.2 Hystrix之通配服务降级FeignFallback

问题：服务提供者 8001 宕机【**服务降级，客户端去调用服务端，碰上服务端宕机或关闭**】

解决：80 实现服务降级 @FeignClient fallback属性 + 提供一个 Service 的实现类【本次案例服务降级处理是在客户端80实现完成的，与服务端8001没有关系，只需要为[Feign](https://so.csdn.net/so/search?q=Feign&spm=1001.2101.3001.7020)客户端定义的接口添加一个服务降级处理的实现类即可实现解耦】



### 3. 服务熔断

> 一定要区分 服务降级 vs 服务熔断

```java
@HystrixCommand(fallbackMethod = "paymentCircuitBreaker_fallback",commandProperties = {
            @HystrixProperty(name = "circuitBreaker.enabled",value = "true"),// 是否开启断路器
            @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold",value = "10"),// 请求次数
            @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds",value = "10000"), // 时间窗口期
            @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage",value = "60"),// 失败率达到多少后跳闸
    })
```

服务熔断的实现效果：服务降级后兜底方法执行了很多次占比请求超过默认10秒内超过50%的请求失败，这个时候就算请求正确的也会到兜底的错误方法上即开启断路器（过一下会恢复） 

##### 断路器开启或者关闭的条件

到达以下阀值，断路器将会开启：

当满足一定的阀值的时候（默认10秒内超过20个请求次数)
当失败率达到一定的时候（默认10秒内超过50%的请求失败)
当开启的时候，所有请求都不会进行转发

一段时间之后（默认是5秒)，这个时候断路器是半开状态，会让其中一个请求进行转发。如果成功，断路器会关闭，若失败，继续开启。

[Hutool国产工具类](https://hutool.cn/) 好像蛮给力

For Example: 

```java
//生成的UUID是带-的字符串，类似于：a5c8a5e8-df2b-4706-bea4-08d0939410e3
String uuid = IdUtil.randomUUID();

//生成的是不带-的字符串，类似于：b17f24ff026d40949c85a24f4f375d42
String simpleUUID = IdUtil.simpleUUID();
```





#### **4. 服务限流** 

后面高级篇讲解alibaba的Sentinel说明

Alibaba sentinel



#### 5. Hystrix图形化Dashboard搭建

需要自己搭建一个监控平台 即 新建一个 Model 项目 和 Eureka 一样，但 Zookeeper 就不用 ！

这里其实后面的 Sentinel 也不用再搭同Zookeeper

看日志不方便，越来越偏向仪表盘（图形化的监控，数据报表的展现）

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
</dependency>
```



## ==------服务网关------==

技术选型：一般不会用 zuul 了，都用 Gateway

## 一、Gateway✔

### 1. 前言

>zuul 是 Netflix 公司出的，Spring 公司等不及了就自己出了 Gateway，Gateway是原 zuul1.x版的替代
>
>**Cloud 全家桶中有个很重要的组件就是网关！**
>
>Nginx针对用户和前端，gateway针对前端和后台服务

传统的Web框架，比如说: Struts2，SpringMVC等都是基于Servlet APl与Servlet容器基础之上运行的。

但是在Servlet3.1之后有了异步非阻塞的支持。而**WebFlux是一个典型非阻塞异步的框架**



**微服务架构中网关的位置**

>场景：1号机器的7000端口挂掉了，我不可能手动的去代码改成能用的2号机器的7000端口吧
>
>第一个需求：10几台及其一起上线，经过网关动态的路由到能用的各个服务，也能从注册中心中实时地感知某个服务上线还是下线。
>
>第二个需求：网关这一层可以权限校验，限流控制

![img](https://images.zzq8.cn/img/202206291359675.png)

**三大核心概念**

1. Route(路由) - 路由是构建网关的基本模块,它由ID,目标URI,一系列的断言和过滤器组成,如断言为true则匹配该路由；
2. Predicate(断言) - 参考的是Java8的java.util.function.Predicate，开发人员可以匹配==HTTP请求中的所有内容==(例如请求头或请求参数),如果请求与断言相匹配则进行路由；
3. Filter(过滤) - 指的是Spring框架中GatewayFilter的实例,使用过滤器,可以在请求被路由前或者之后对请求进行修改。

一句话总结：请求到达网关，先 **Predicate** 是否符合某个路由规则，符合就 **Route** 到指定地方，但需要经过一系列 **Filter** 进行过滤



**我们目前不想暴露8001端口，希望在8001外面套一层9527**，这样有人攻击有一层挡着

- 添加网关前 - http://localhost:8001/payment/get/1
- 添加网关后 - http://localhost:9527/payment/get/1
- 两者访问成功，返回相同结果



### 2. 通过[微服务](https://so.csdn.net/so/search?q=微服务&spm=1001.2101.3001.7020)名实现动态路由

默认情况下Gateway会根据注册中心的服务列表，以注册中心上微服务名为路径创建动态路由进行转发，从而实现动态路由的功能。

1、修改9527的yml

> ①需要注意的是==uri的协议为lb（load-balancing）==，表示启用Gateway的[负载均衡](https://so.csdn.net/so/search?q=负载均衡&spm=1001.2101.3001.7020)功能。
> ②lb://serviceName是spring cloud gateway在微服务中自动为我们创建的负载均衡uri（负载均衡到指定服务）

```yaml
server:
  port: 9527
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true  #开启从注册中心动态创建路由的功能，利用微服务名进行路由
      routes:
        - id: payment_routh #路由的ID，没有固定规则但要求唯一，建议配合服务名
          #uri: http://localhost:8001   #匹配后提供服务的路由地址
          uri: lb://cloud-payment-service
          predicates:
            - Path=/payment/get/**   #断言,路径相匹配的进行路由

        - id: payment_routh2
          #uri: http://localhost:8001   #匹配后提供服务的路由地址
          uri: lb://cloud-payment-service
          predicates:
            - Path=/payment/lb/**   #断言,路径相匹配的进行路由


eureka:
  instance:
    hostname: cloud-gateway-service
  client:
    service-url:
      register-with-eureka: true
      fetch-registry: true
      defaultZone: http://eureka7001.com:7001/eureka
```

2、测试
①启动一个eureka7001+两个服务提供者8001/8002
②访问http://localhost:9527/payment/lb

会发现8001和8002交替出现



**要经过三关才能过来：**这章其实就学这三个的配置 主yaml

![image-20220630144816418](https://images.zzq8.cn/img/202206301448361.png)

* **路由** Route

```bash
## 两种配置方式，1）java代码@Configuration 和  2）yaml配置
## 地址分 1）静态路由 和 2）动态路由的功能（不写死一个地址）

## 踩坑，记住路由的先后顺序，下面这样，第二条就不会执行！！！需要调整路由顺序
predicates:
            - Path=/api/**
## 别忘了 **
predicates:
       - Path=/api/product/**       
```



* **断言** Predicate

```bash
## 该命令相当于发get请求，且没带cookie
curl http://localhost:9527/payment/lb

## 带cookie的
curl http://localhost:9527/payment/lb --cookie "chocolate=chip"
```



* **过滤器** Filter

```yaml
## 对于 的请求路径/red/blue，这会将路径设置为/blue在发出下游请求之前。请注意，由于 YAML 规范，$应将其替换为。$\
filters:
        - RewritePath=/red/?(?<segment>.*), /$\{segment}
 
## 注意这个例子 
         - id: product_route
          uri: lb://gulimall-product
          predicates:
            - Path=/api/product/**
          filters:
            - RewritePath=/api/?(?<segment>.*), /$\{segment}
 ## 前端项目，/api
#### http://localhost:88/api/product/category/list/tree  http://localhost:10000/product/category/list/tree


## 一般是 自定义全局GlobalFilter
```



## ==------服务配置------==

三套：

1. Config + Bus

2. Alibaba Nacos
3. 携程的apollo，上海有名些

## 一、Config ×

> 每一个Model都有一个 yaml，改的太痛苦。于是有了 **服务配置** 技术

3344 就是配置总控中心连 Git 获取它上面的 yaml

3355 可以通过 3344 拿到 Git 上的 yaml

![image-20220701143051906](https://images.zzq8.cn/img/202207011430795.png)

**怎么玩**

SpringCloud Config分为**服务端**和**客户端**两部分。

* 服务端也称为分布式配置中心，它是一个独立的微服务应用，用来连接配置服务器并为客户端提供获取配置信息，加密/解密信息等访问接口。

* 客户端则是通过指定的配置中心来管理应用资源，以及与业务相关的配置内容，并在启动的时候从配置中心获取和加载配置信息配置服务器默认采用git来存储配置信息，这样就有助于对环境配置进行版本管理，并且可以通过git客户端工具来方便的管理和访问配置内容。



### 1. Config配置总控中心搭建

服务端作用：配置好后能拿到Git中yaml的内容



### 2. Config客户端配置与测试

**bootstrap.yml【已踩坑，没有改名字】**

applicaiton.yml是用户级的资源配置项

bootstrap.yml是系统级的，优先级更加高

Spring Cloud会创建一个Bootstrap Context，作为Spring应用的Application Context的父上下文。

初始化的时候，BootstrapContext负责从外部源加载配置属性并解析配置。这两个上下文共享一个从外部获取的Environment。

Bootstrap属性有高优先级，默认情况下，它们不会被本地配置覆盖。Bootstrap context和Application Context有着不同的约定，所以新增了一个bootstrap.yml文件，保证Bootstrap Context和Application Context配置的分离。

要将Client模块下的application.yml文件改为bootstrap.yml,这是很关键的，因为bootstrap.yml是比application.yml先加载的。bootstrap.yml优先级高于application.yml。

**两个图标都不一样：**3355不改成 bootstrap.yaml 的话 @Value("${config.info}") 会报错！

因为本地 application.yaml 没有，bootstrap.yaml -> 配置中心地址 -> Git 上有！config.info

![image-20220701151424183](https://images.zzq8.cn/img/202207011514318.png)



### 3. Config动态刷新之手动版

> 问题：Gitee 上修改 yaml，3344配置中心刷新是修改的，但是3355客户端是没有修改需要重启才生效
>
> 解决：三步 1）加actuator  2）一个注解  3）运维多用一个bash命令

```bash
curl -X POST "http://localhost:3355/actuator/refresh"
```



## ==------服务总线------==

## 一、Bus ×

> **对 Config 的一个加强，可以实现自动版的一个动态刷新**  Config + Bus
>
> 注意：Spring cloud Bus目前支持RabbitMQ和Kafka。

**消息总线**：可以想象成微信订阅号



由于没学 RabbitMQ 就略过这节...



## ==------Other------==

## 一、Stream✔

> 注意：目前仅支持RabbitMQ、 Kafka。想用RocketMQ 就后面学Alibaba

有没有一种新的技术诞生，让我们不再关注具体MQ的细节，我们只需要用一种适配绑定的方式，自动的给我们在各种MQ内切换。（类似于Hibernate）

Cloud Stream是什么？屏蔽底层消息中间件的差异，降低切换成本，统一消息的**编程模型**。

个人感觉：像一个适配器 JDBC 屏蔽了各不同数据库的差异

![image-20220701165550123](https://images.zzq8.cn/img/202207011655575.png)

**通过定义绑定器Binder作为中间层，实现了应用程序与消息中间件细节之间的隔离**。



由于没学MQ略。。。



## 二、Sleuth链路监控✔

> sleuth监控、zipkin展现

大致就需要监控的加pom 改yaml   例如服务提供者和服务消费者(调用方)都这么干

pom:

```xml
<!--包含了sleuth+zipkin-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
</dependency>
```

yaml:

```yaml
spring:
  application:
    name: cloud-payment-service

  zipkin: #<-------------------------------------关键 
      base-url: http://localhost:9411
  sleuth: #<-------------------------------------关键
    sampler:
    #采样率值介于 0 到 1 之间，1 则表示全部采集
    probability: 1
```



然后调用后进入监控网站可以看到哪个服务调的哪个服务，耗时多少毫秒

感觉简单就没有实操了！





## ==++++++<font color=blue>SpringCloud alibaba</font>++++++==

**简介：**

* 为什么会出现SpringCloud alibaba
  * Spring Cloud Netflix项目进入维护模式
  * https://spring.io/blog/2018/12/12/spring-cloud-greenwich-rc1-available-now

* 什么是维护模式？

  * 将模块置于维护模式，意味着Spring Cloud团队将不会再向模块添加新功能。

  

**能干嘛：**

* 服务限流降级：默认支持 WebServlet、WebFlux, OpenFeign、RestTemplate、Spring Cloud Gateway, Zuul, Dubbo 和 RocketMQ 限流降级功能的接入，可以在运行时通过控制台实时修改限流降级规则，还支持查看限流降级 Metrics 监控。
* 服务注册与发现：适配 Spring Cloud 服务注册与发现标准，默认集成了 Ribbon 的支持。
* 分布式配置管理：支持分布式系统中的外部化配置，配置更改时自动刷新。
* 消息驱动能力：基于 Spring Cloud Stream 为微服务应用构建消息驱动能力。
* 分布式事务：使用 @GlobalTransactional 注解， 高效并且对业务零侵入地解决分布式事务问题。
* 阿里云对象存储：阿里云提供的海量、安全、低成本、高可靠的云存储服务。支持在任何应用、任何时间、任何地点存储和访问任意类型的数据。
* 分布式任务调度：提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。同时提供分布式的任务执行模型，如网格任务。网格任务支持海量子任务均匀分配到所有 Worker（schedulerx-client）上执行。
* 阿里云短信服务：覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。



**怎么玩：**

* **[Sentinel](https://github.com/alibaba/Sentinel)**：把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性
* **[Nacos](https://github.com/alibaba/Nacos)**：一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
* **[RocketMQ](https://rocketmq.apache.org/)**：一款开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
* **[Dubbo](https://github.com/apache/dubbo)**：Apache Dubbo™ 是一款高性能 Java RPC 框架。
* **[Seata](https://github.com/seata/seata)**：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。
* **[Alibaba Cloud OSS](https://www.aliyun.com/product/oss)**: 阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的海量、安全、低成本、高可靠的云存储服务。您可以在任何应用、任何时间、任何地点存储和访问任意类型的数据。
* **[Alibaba Cloud SchedulerX](https://help.aliyun.com/document_detail/43136.html)**: 阿里中间件团队开发的一款分布式任务调度产品，提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。
* **[Alibaba Cloud SMS](https://www.aliyun.com/product/sms)**: 覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。



**Spring Cloud Alibaba学习资料获取：**

* 官网

  * https://spring.io/projects/spring-cloud-alibaba#overview

* 英文

  * https://github.com/alibaba/spring-cloud-alibaba

  * https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html

* 中文
  * https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md



## 一、Nacos 服务注册和配置中心

> Nacos = Eureka + Config + Bus    Nacos致力于帮助您发现、配置和管理微服务。
>
> 服务注册中心 + 服务配置 + 服务总线



**为什么叫Nacos**

- 前四个字母分别为Naming和Configuration的前两个字母，最后的s为Service。



**怎么用**

不用像 Eureka 还要整个项目跑起来，这个像 zookeeper

解压安装包，直接运行bin目录下的startup.cmd，但是实测会报错。需在命令行加条件跑这个cmd

```bash
startup.cmd -m standalone
```

 

为了下一章节演示nacos的负载均衡，参照9001新建9002

这里**取巧**不想新建重复体力劳动，可以利用IDEA功能，直接拷贝**虚拟端口映射**



![image-20220706152115283](https://images.zzq8.cn/img/202207202219473.png)



K8S服务和DNS服务则适用于CP模式



Nacos 是 AP + CP 可以切换

切换命令：

```bash
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=serverMode&value=CP
```



注意：新的nacos已经没有整合ribbon了，所以要么在maven添加Loadbalancer代替





### 1. 注册中心：代替 Eureka 

* 就是启动项目换下配置，cmd启动完后项目一般就是三步：
  1. 配置 Nacos server-addr 的地址
  2. 配置自己的 application name（注意：每一个应用都应该有名字，这样才能注册上去。）
  3. ==主启动类加 @EnableDiscoveryClient== 开启服务的注册与发现功能（容易忘）

### 2. 配置中心：代替 Bus

* Bus需要在 Git 上建配置，Nacos直接可以在网站中配置
* 常规操作，一样建 Model 一系列

#### 配置文件详解

Nacos中的dataid（即网站配置文件的名字）需符合：

![img](https://images.zzq8.cn/img/202207062139577.png)

```java
${prefix}-${spring-profile.active}.${file-extension}

即

${spring.application.name)}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}
```

测试了一下，如果配置文件中没有配config 默认是 gulimall-coupon.properties  项目名.properties

测试：discovery config 要配置到 bootstrap.yaml 才生效。就是搞改上面这个.properties 到application不生效到bootstrap生效  ==自我建议把 nacos 相关的配 bootstrap==

小技巧：应用启动的时候第一行日志会告诉你 Nacos 配置中心的文件名是什么



#### common.yaml

我们还可以通过shared-configs配置公用的的配置，比如注册中心大家都用同一个，redis的也可能是多个服务用同一个配置：

`shared-dataids: common.yaml`



醉了：写这个Data ID一定要加后缀。整了很久才发现这个问题

![image-20230106154116757](https://images.zzq8.cn/img/202301061541889.png)



bootstrap.yml 可以理解成系统级别的一些参数配置，这些参数一般是不会变动的。
application.yml 可以用来定义应用级别的。



**自带动态刷新**

需要在使用了 `@Value` 的 ==Controller 类==中加 `@RefreshScope //支持Nacos的动态刷新功能。`  才能动态刷新

修改下Nacos中的yaml配置文件，再次调用查看配置的接口，就会发现配置已经刷新。



**仅仅是以上功能还不行，还有 Bus 没有的好功能：**

切换dev test配置文件环境，分组..很方便，看图：配置文件-->命名空间-->组

自我建议：NameSpace（微服务）、Group（开发环境）

最终方案：每个微服务创建自己的命名空间，然后使用配置分组区分环境（dev/test/prod）

![img](https://images.zzq8.cn/img/202207070955519.png)

默认情况：Namespace=public，Group=DEFAULT_GROUP，默认Cluster是DEFAULT

* Nacos默认的Namespace是public，**Namespace主要用来实现配置隔离**。
  * 基于环境进行隔离：比方说我们现在有三个环境：开发、测试、生产环境，我们就可以创建三个Namespace，不同的Namespace之间是隔离的。
  * 基于微服务进行隔离：也可以比如给不同的model创建它自己的命名空间
  * **写法** `spring.cloud.nacos.config.namespace=e53d5e82-a1f3-42b9-a1d2-1cbbd8103d69`
* Group默认是DEFAULT_GROUP，Group可以把不同的微服务划分到同一个分组里面去
  * 例如双十一用这组，618用另外一组
  * 也可区分开发环境 dev pro

* Service就是微服务:一个Service可以包含多个Cluster (集群)，Nacos默认Cluster是DEFAULT，Cluster是对指定微服务的一个虚拟划分。
  * 比方说为了容灾，将Service微服务分别部署在了杭州机房和广州机房，这时就可以给杭州机房的Service微服务起一个集群名称(HZ) ，给广州机房的Service微服务起一个集群名称(GZ)，还可以尽量让同一个机房的微服务互相调用，以提升性能。
* 最后是Instance，就是微服务的实例。



**加载多配置集**

其实我们的微服务只需保留一个 bootstrap.yaml

我们要把原来application.yml里的内容都分文件抽离出去。我们在nacos里创建好 后，在coupons里指定要导入的配置即可。

![image-20220805173159065](https://images.zzq8.cn/img/202208051732942.png)

 重点： **spring.cloud.nacos.config.ext-config[0]**

```yaml
spring.cloud.nacos.config.namespace=ed042b3b-b7f3-4734-bdcb-0c516cb357d7  # 可以选择对应的命名空间 ，即写上对应环境的命名空间ID
spring.cloud.nacos.config.group=dev  # 配置文件所在的组

spring.cloud.nacos.config.ext-config[0].data-id=datasource.yml
spring.cloud.nacos.config.ext-config[0].group=dev
spring.cloud.nacos.config.ext-config[0].refresh=true

spring.cloud.nacos.config.ext-config[1].data-id=mybatis.yml
spring.cloud.nacos.config.ext-config[1].group=dev
spring.cloud.nacos.config.ext-config[1].refresh=true

spring.cloud.nacos.config.ext-config[2].data-id=other.yml
spring.cloud.nacos.config.ext-config[2].group=dev
spring.cloud.nacos.config.ext-config[2].refresh=true
```



其实以上这些都是小儿科，自己看看文档容易知道。



### 3. Nacos集群和持久化配置（重要）

>集群：至少三台
>
>持久化



[官方文档](https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html)

VIP：不是 very important person，而是 **virtual** **IP**

![img](https://images.zzq8.cn/img/202207071007185.png)

上图官网翻译，真实情况

![img](https://images.zzq8.cn/img/202207071008218.png)

默认Nacos使用嵌入式数据库实现数据的存储。所以，如果启动多个默认配置下的Nacos节点，数据存储是存在一致性问题的。为了解决这个问题，**Nacos采用了集中式存储的方式来支持集群化部署，目前只支持MySQL的存储**。

通俗的说：集群有三个的话，每一个Nacos都有自己嵌入式数据库就会数据不一致。而都用外面一个MySQL就不会有这种问题。



**默认数据库derby切换到MySQL具体看官方文档就行。**



Linux 配置

![img](https://images.zzq8.cn/img/202207071436995.png)



## [二、Sentinel 熔断与限流](https://github.com/NiceSeason/gulimall-learning/blob/master/docs/%E8%B0%B7%E7%B2%92%E5%95%86%E5%9F%8E%E2%80%94%E5%88%86%E5%B8%83%E5%BC%8F%E9%AB%98%E7%BA%A7.md#1-%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA-3)

> Sentinel是面向分布式服务架构的流量控制组件，主要以流量为切入点，从流量控制、熔断降级、系统自适应保护等多个维度来帮助您保障微服务的==稳定性==。

Hystrix与Sentinel比较：

* Hystrix
  1. 需要我们程序员自己手工搭建监控平台
  2. 没有一套web界面可以给我们进行更加细粒度化得配置流控、速率控制、服务熔断、服务降级

* Sentinel
  1. 单独一个组件，可以独立出来。
  2. 直接界面化的细粒度统一配置。



约定 > 配置 > 编码

都可以写在代码里面，但是我们本次还是大规模的学习使用配置和注解的方式，尽量少写代码

### 1. 流控

> 直接web界面dashboard 可以设置每秒只准访问一次，否则  Blocked by Sentinel (flow limiting)可以通过`WebCallbackManager.setUrlBlockHandler()`修改这一句
>
> 流控设置保存在内存中，重启失效
>
> 每一个微服务都导入actuator（就会有统计信息）;并配合management.endpoints.web.exposure.include=*

#### 1.1 Sentinel流控-关联

> 就像一个出水口一个入水口，我这边的支付接口挂了你那边下单的订单接口就不要那么猛了

**不要花精力在这些工具上面，够用就行了。把精力放到主要矛盾上面，用 postman、jmeter 都可以**



#### 1.2 Sentinel流控-预热

具体看别人笔记

**应用场景**

如：秒杀系统在开启的瞬间，会有很多流量上来，很有可能把系统打死，预热方式就是把为了保护系统，可慢慢的把流量放进来,慢慢的把阀值增长到设置的阀值。



### 2. 熔断/降级

RT：Round trip 往返、来回，Round trip Time 往返时间，即响应时间

往下部分略过，建议看文档。[官方文档](https://github.com/alibaba/Sentinel/wiki/熔断降级)



熔断：保证服务不受级联影响。例如请求调用链路 a->b->c  c是不可用的过3s才执行到业务的错误点返回给b不可用，后面的无数个a b以及调用a的大量堆积  熔断的话直接快速响应失败就不会堆积了长时间的卡死

降级：于流量高峰期，对非核心业务停止服务或所有的调用直接返回降级数据
服务降级指的是当服务器压力剧增的情况下,根据当前业务情况及流量对一些服务和页面有策略的降级,以此释放服务器资源以保证核心任务的正常运行.降级的核心思想就是丢车保帅,优先保证核心业务.
常见的服务降级策略有以下几种：

* 降级页面：当服务不可用时，显示一个简化的页面或者错误信息，代替原本的功能页面，向用户传达服务不可用的信息。
* 异步处理：将原本同步的服务调用改为异步调用，通过消息队列或者异步任务来处理请求，避免因服务不可用而阻塞整个系统。

相同点： 

1. 为了保证集群大部分服务的可用性和可靠性，防止崩溃，牺牲小我
2. 用户最终都是体验到某个功能不可用

不同点： 

1. 熔断是被调用方故障，触发的**系统主动规则**
2. 降级是基于全局考虑，停止一些正常服务，释放资源





### 3. SentinelResource配置

兜底方法，分为系统默认和客户自定义，两种

之前的case，限流出问题后，都是用sentinel系统默认的提示: Blocked by Sentinel (flow limiting)

我们能不能自定？类似hystrix，某个方法出问题了，就找对应的兜底降级方法?

结论  **从HystrixCommand到@SentinelResource**



**Sentinel 没有学下去，暂时跳过后期用的时候再来学！**





### [4. GitHub wiki文档](https://sentinelguard.io/zh-cn/docs/basic-api-resource-rule.html)

> Gulimall 补充

**资源** 是 Sentinel 中的核心概念之一

我们说的资源，可以是任何东西，服务，服务里的方法，甚至是一段代码。使用 Sentinel 来进行资源保护，主要分为几个步骤:

1. 定义资源
2. 定义规则
3. 检验规则是否生效



## [三、Seata 处理分布式事务](https://seata.io/zh-cn/docs/overview/what-is-seata.html)

> [复习Gulimall的本地事务对照着笔记来学习！](../gulimall/分布式高级#分布式事务)
>
> 看标题的官网链接！！！中文的通俗易懂  下面自己码的也可以看看抄过来的图带点自己好理解的逻辑去理解  `@GlobalTransactional`
>
> [2PC（Seata是这个的一个变形）](../gulimall/03、本地事务&分布式事务.pdf#分布式事务几种方案) 这里具体看 PDF！注意方案是方案框架是框架（落地实现这个方案）

### 1.概念

分布式架构肯定是多数据库、多数据源！（买家库，卖家库）甚至在不同的机房。单个就搞笑了

单体应用被拆分成微服务应用，原来的三个模块被拆分成三个独立的应用,分别使用三个独立的数据源，业务操作需要调用三三 个服务来完成。此时**每个服务内部的数据一致性由本地事务来保证， 但是全局的数据一致性问题没法保证**。

![img](https://images.zzq8.cn/img/202207081440609.png)

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

![img](https://images.zzq8.cn/img/202207081513288.png)

==`My Understand：`看图说话==   我这里好理解

> Seata 分 TC、TM 和 RM 三个角色，TC（Server 端）为单独服务端部署，TM 和 RM（Client 端）由业务系统集成。

TC 协调TM全局事务中的各个分支事务，这个全局调控的人就是Seata服务器（官网下下来运行）

TM 全局事务看成订单模块 其它小事务RM看成feign调用的



> Q：AT 模式（自动）  假如 Account 失败了，但是Stock & Order成功了 那么怎么回滚？？？
>
> A：UNDO_LOG Table（回滚日志表）  假如提交的是 +2 那就 -2 给补回来回复以前的状态。因为前面事务提交了没办法回滚了（魔改数据库）

![](https://user-images.githubusercontent.com/68344696/145942191-7a2d469f-94c8-4cd2-8c7e-46ad75683636.png)



### [2.快速开始](https://seata.io/zh-cn/docs/user/quickstart.html)

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



#### 举例 AT 模式（自动）：

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









## Other

### 一、spring boot多服务项目不显示service窗口

**打开这个文件.idea > workspace.xml 中搜索 RunDashboard，如下图所示**

```xml
  <component name="RunDashboard">
    <option name="configurationTypes">
      <set>
        <option value="SpringBootApplicationConfigurationType" />
      </set>
    </option>
    <option name="ruleStates">
      <list>
        <RuleState>
          <option name="name" value="ConfigurationTypeDashboardGroupingRule" />
        </RuleState>
        <RuleState>
          <option name="name" value="StatusDashboardGroupingRule" />
        </RuleState>
      </list>
    </option>
  </component>
```

