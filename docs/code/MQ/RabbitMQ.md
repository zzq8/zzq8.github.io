---
article: false
---
# RabbitMQ

> MessageQueue，MQ
>
> 借鉴 [JavaGuide](https://javaguide.cn/high-performance/message-queue/rocketmq-intro.html)

## 一、前言

### 1.三大作用

> 联想订票系统，订票业务和短信业务

#### 1.1 异步与解耦

主要就是为了 **异步** 用



**解耦**：有了消息队列，我们只需要关心消息是否送达了队列，至于谁希望订阅，接下来收到消息如何处理，是下游的事情，无疑极大地减少了开发和联调的工作量

图中第一个是开三个线程处理，第二个直接给MQ发个通知就不管了那三个自己通过订阅拿消息慢慢处理（不关心这三个接口怎么写的，因为无需调用）

![image-20220712110324017](https://images.zzq8.cn/img/202207121103133.png)

<img src="https://images.zzq8.cn/img/202301121505498.png" alt="image-20230112150550482" style="zoom:67%;" />

<img src="https://images.zzq8.cn/img/202301121506067.png" alt="image-20230112150652998" style="zoom: 67%;" />



#### 1.2 流量削峰

场景：大量用户请求购票整个系统会变成什么样？

如果，此时有一万的请求进入购票系统，我们知道运行我们主业务的服务器配置一般会比较好，所以这里我们假设购票系统能承受这一万的用户请求，那么也就意味着我们同时也会出现一万调用发短信服务的请求。而对于短信系统来说并不是我们的主要业务，所以我们配备的硬件资源并不会太高，那么你觉得现在这个短信系统能承受这一万的峰值么，且不说能不能承受，系统会不会 **直接崩溃** 了？

短信业务又不是我们的主业务，我们能不能 **折中处理** 呢？如果我们把购买完成的信息发送到消息队列中，而短信系统 **尽自己所能地去消息队列中取消息和消费消息** ，即使处理速度慢一点也无所谓，只要我们的系统没有崩溃就行了。

留得江山在，还怕没柴烧？你敢说每次发送验证码的时候是一发你就收到了的么？

![image-20220712111100552](https://images.zzq8.cn/img/202207121111658.png)

#### 1.3 没有哪一门技术是“银弹”，消息队列也有它的副作用

比如，本来好好的两个系统之间的调用，我中间加了个消息队列，如果消息队列挂了怎么办呢？是不是 **降低了系统的可用性** ？

那这样是不是要保证HA(高可用)？是不是要搞集群？那么我 **整个系统的复杂度是不是上升了** ？

抛开上面的问题不讲，万一我发送方发送失败了，然后执行重试，这样就可能产生重复的消息。

或者我消费端处理失败了，请求重发，这样也会产生重复的消息。

对于一些微服务来说，消费重复消息会带来更大的麻烦，比如增加积分，这个时候我加了多次是不是对其他用户不公平？





### 2.两大概念

> 消息服务中两个重要概念： 消息代理（message broker）、目的地（destination）
>
> 当消息发送者发送消息以后，将由消息代理接管，消息代理保证消息传递到指定目的地。

#### 2.1 两种消息模型（JMS提供为例）

消息队列主要有两种形式的目的地：

1. 队列（queue）：点对点消息通信（point-to-point）1v1
   * 消息发送者发送消息，消息代理将其放入一个队列中，消息接收者从队列中获取消息内容，消息读取后被移出队列
   * 点对点：可以很多个接收者，谁先抢到就谁
2. 主题（topic）：发布（publish）/订阅（subscribe）消息通信 1vn
   * 发送者（发布者）发送消息到主题，多个接收者（订阅者）监听（订阅）这个主题，那么就会在消息到达时同时收到消息



#### 2.2 两大规范/协议

> RabbitMQ是一个由erlang开发的AMQP(Advanved Message Queue Protocol)的开源实现

JMS（Java Message Service） AMQP（Advanced Message QueuingProtocol）

- JMS是定义了统一的接口，来对消息操作进行统一；AMQP是通过规定协议来统一数据交互的格式
- JMS限定了必须使用Java语言；AMQP只是协议，不规定实现方式，因此是跨语言的。
  - 如果全平台都是Java写的那就 JMS
    **如果订单Java写、购物车PHP写两者得交互发消息那就用 AMQP**
- JMS规定了两种消息模式；而AMQP的消息模式更加丰富
  - 其实就是第一种对应上面第一个点对点其它四种对应发布订阅，只不过封装了



ps：RabbitMQ 有很多复杂概念，这个打通其它MQ不是问题 因为其它MQ根本没这个那么多复杂概念



#### 2.3 Java 落地

##### Spring支持

* spring-jms提供了对JMS的支持
* spring-rabbit提供了对AMQP的支持
* 需要ConnectionFactory的实现来连接消息代理
* 提供JmsTemplate、RabbitTemplate来发送消息
* @JmsListener（JMS）、@RabbitListener（AMQP）注解在方法上监听消息代理发布的消息
* @EnableJms、@EnableRabbit开启支持

##### Spring Boot自动配置

* JmsAutoConfiguration
* RabbitAutoConfiguration



### 2.核心概念

#### 1）==RabbitMQ==

> 微服务如有一起用 Java、PHP 那么如果 Java 挂了可能就会影响 PHP 的服务，而 `虚拟主机` 每个一套环境的感觉

![image-20230112172607355](https://images.zzq8.cn/img/202301121726461.png)

* Message 消息，消息是不具名的，它由消息头和消息体组成。消息体是不透明的，而消息头则由一系列的可选属性组成，这些属性包括routing-key（路由键）、priority（相对于其他消息的优先权）、delivery-mode（指出该消息可能需要持久性存储）等。
* Publisher 消息的生产者，也是一个向交换器发布消息的客户端应用程序。
* **Exchange 交换器，**用来接收生产者发送的消息并将这些消息路由给服务器中的队列。Exchange有4种类型：direct(默认)，fanout, topic, 和headers，不同类型的Exchange转发消息的策略有所区别。   可以绑定（Binding）队列并指定它们之间的路由键（rouoting-key）
  * **direct 点对点-精确匹配**
  * **fanout 发布订阅-广播（不分路由键消息交给所有和它绑定的队列）**
  * **topic 发布订阅-部分广播（会根据路由键匹配的来找）**
* Queue 消息队列，用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。 
  * 名字命名有讲究，以单词为单位不是字母 #匹配0-n个单词，*匹配1-n个 例如：auguigu.#    *.news

* Binding 绑定，用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。 Exchange 和Queue的绑定可以是多对多的关系。 
* Connection 网络连接，比如一个TCP连接。
* Channel 信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内的虚拟连接，AMQP命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，**这些动作都是通过信道完成。因为对于操作系统来说建立和销毁TCP都是非常昂贵的开销，所以引入了信道的概念，以复用一条 TCP 连接。**
* **`Consumer`** 消息的消费者，表示一个从消息队列中取得消息的客户端应用程序。
* **`Virtual Host`** 虚拟主机，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个 vhost 本质上就是一个 mini 版的RabbitMQ服务器，拥有自己的队列、交换器、绑定和权限机制。vhost 是 AMQP 概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是 / 。 场景：我可以生产环境一套开发环境一套，每个虚拟主机的配置是**不一样**的
* **`Broker`** 表示消息队列服务器实体



ps：可以到web管理后台发一发消息，用一用Exchange -> Binding via Routing Key -> Queue
Exchange和Queue都有自己的名字通过Routing Key建立关联

Channel、Message在Java中都有对应的类，可以直接用。例如通过Channel拿Message



#### 2）RocketMQ 时候笔记

NameServer：类似中介，跟eureka差不多服务的注册与发现

Broker：消息队列服务器

<img src="https://images.zzq8.cn/img/202207151500160.jpeg" alt="img" style="zoom: 67%;" />

但是，我们上文提到过 `Broker` 是需要保证高可用的，如果整个系统仅仅靠着一个 `Broker` 来维持的话，那么这个 `Broker` 的压力会不会很大？所以我们需要使用多个 `Broker` 来保证 **负载均衡** 。

<img src="https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef38687488a5a4.jpg" alt="img" style="zoom: 50%;" />



在上面的技术架构介绍中，我们已经知道了 **`RocketMQ` 在主题上是无序的、它只有在队列层面才是保证有序** 的。





## 二、使用

### 1.安装 RabbitMQ

```shell
#docker images 本地没有rabbitmq:management这个镜像执行这个命令会连网自动去下
docker run -d --name rabbitmq -p 5671:5671 -p 5672:5672 -p 4369:4369 -p 25672:25672 -p 15671:15671 -p 15672:15672 rabbitmq:management
#自动启动
docker update rabbitmq --restart=always
```

4369, 25672 (Erlang发现&集群端口) 

5672, 5671 (AMQP端口) 

15672 (web管理后台端口) 

61613, 61614 (STOMP协议端口) 

1883, 8883 (MQTT协议端口) 

https://www.rabbitmq.com/networking.html



### 2.Spring Boot整合RabbitMQ

#### 2.1 简介

在spring boot项目中只需要引入对应的amqp启动器依赖即可，方便的**使用RabbitTemplate发送消息，使用注解接收消息。**

一般在开发过程中：

生产者工程：

application.yml文件配置RabbitMQ相关信息；

在生产者工程中编写配置类，用于创建交换机和队列，并进行绑定

注入RabbitTemplate对象，通过RabbitTemplate对象发送消息到交换机

消费者工程：

application.yml文件配置RabbitMQ相关信息

创建消息处理类，用于接收队列中的消息并进行处理



#### 2.2 配置

1. pom.xml：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

2. 主类+ `@EnableRabbit`

* 引入amqp场景;RabbitAutoConfiguration就会自动生效（**org.springframework.boot.autoconfigure**.amqp.RabbitAutoConfiguration）

* 给容器中自动配置了
  * RabbitTemplate、AmqpAdmin、CachingConnectionFactory、RabbitMessagingTemplate

ps：AmqpAdmin 可以用来创造 Exchange、Queue和两者之间的Binding
	RabbitTemplate 可以给MQ收发消息

使用这两个类的API操作基本感觉就和 web 界面使用的操作是一样的，该给哪些参数之间有些什么关系！所以点点 web 操作操作还是有必要的！



3. 消息如想放对象，写个config类给容器中放 MessageConverter
   * 视频中直接看源码真棒，比那些直接配置的舒服多了。知道来龙去脉 这就是会看源码的好处啊



#### 2.3 使用

> 上面配置完，下面使用按视频就是 
>
> > Exchange、Queue、Binding写单元测试（最好拿出来放Controller/web图形化配好？）**其实这些可以直接用注解配放Config包！！通过@Bean** 
> > @Bean Binding,Queue,Exchange  容器中的Binding,Queue,Exchange都会自动创建(RabbitMQ没有的情况) 
> > 注意：1）RabbitMQ只要有@Bean声明属性发生变化也不会覆盖    
> >      2）**@Bean启动时不会马上创建，需要有监听方法才会创建**
> >
> > ```java
> > // @RabbitListener(queues = "stock.release.stock.queue")
> >     // public void handle() {
> >     //
> >     // }
> > ```
> >
> > 但发送消息（`rabbitTemplate.convertAndSend`）还是得Service用
>
> 监听器拿消息写Services用两个注解，只要项目在运行就会实时监听消费！

###### @RabbitListener:类+方法上（监听哪些队列即可）

```java
    /**
     * queues:声明需要监听的所有队列
     * 三个参数会自动注入：
     * 1）org.springframework.amqp.core.Message
     * 2）T<发送的消息的类型> OrderReturnReasonEntity   就不用我们手动转换（JSONToObject），Spring会帮我们自动转换
     * 3）Channel:当前传输数据的通道
     *
     * Queue: 可以很多人都来监听.只要收到消息,队列删除消息,而且只能有一个收到此消息场景:
     * 1)、订单服务启动多个;同一个消息,只能有一个客户端收到
     * 2)、只有一个消息完全处理完,方法运行结束,我们就可以接收到下一个消息
     */
    @RabbitListener(queues = {"hello-java-queue"}) //这个注解也可放类上
    public void receiveMessage(Message message, OrderReturnReasonEntity content, Channel channel)
```

###### @RabbitHandLer:标在方法上（重载区分不同类型的消息）

* 单元测试发两个不同的实体对象
* 两个注解搭配使用，相当于重载拿不同的实体对象

```java
@RabbitListener(queues = {"hello-java-queue"}) //会不停监听这个队列中的消息进行消费
@Service("orderItemService")
public class OrderItemServiceImpl{

 @RabbitHandler
 public void receiveMessage(Entity01 xx){}
 
 @RabbitHandler
 public void receiveMessage(Entity02 xx){}
}
```



注意：模拟发了10个消息，启动了2个服务。但是此时单元测试也拿了3个消息。
	 因为启动单元测试就相当于是启动了springboot   多个服务应该是轮询拿



#### ==2.4 消息确认机制-可靠抵达==

> 可靠抵达：发送端确认+消费端确认

```properties
## 开启发送端消息抵达Broker确认
spring.rabbitmq.publisher-confirms=true

## 开启发送端消息抵达Queue确认
spring.rabbitmq.publisher-returns=true
## 只要消息抵达Queue，就会异步发送优先回调returnfirm
spring.rabbitmq.template.mandatory=true

## 手动ack消息，不使用默认的消费端确认
spring.rabbitmq.listener.simple.acknowledge-mode=manual
```

<img src="https://images.zzq8.cn/img/202301131650214.png" alt="image-20230113165049968" style="zoom:67%;" />

<center style="color: red;">XD：面试点-成功回调、失败回调、手动ACK</center>

> chat接口用到 mq事务延时消息-处理接口超时情况。juefei问回调怎么体现，我回调？

回调接口在异步编程中非常常见，在使用消息队列时，它通常用于以下场景：

1. **消息消费完成后的通知**：在消费者成功处理消息后，通过回调接口通知系统该消息已被成功消费，并可以执行后续操作。

2. **消息处理失败后的处理**：如果消费者处理消息失败，通过回调接口可以触发重试、记录日志、发送告警等操作。

##### 2.4.1 发送端确认

> 弹幕：真实工作中根本不会这么用，都是让类去实现对应回调接口
>
> 场景：可以把这些消息状态放到数据库，知道哪些消息没有可靠抵达就再重新发一次

0. ##### ==简介：两个过程 P->B、E->Q==

```css
1.生产者发送消息到Queue会经过两个过程【确认机制看做一种协议】
		1）消息从publisher到达Broker（到达后会回调confirmCallback，消费者被告知消息是否抵达服务器）【My 成功回调】
		2）消息从Exchange投递到Queue（失败后会回调returnCallback，消费者被告知消息是否抵达Queue）【My 失败回调】
```

1. ##### 打开确认模式

```properties
## 1）Publisher/Producer -> Broker(Excange)
spring.rabbitmq.publisher-confirms=true

## 2）Exchange -> Quenen（一般下面这两个配置一起写）
spring.rabbitmq.publisher-returns=true
## 消息在没有被队列接收时是否强行退回
spring.rabbitmq.template.mandatory=true
```

2. ##### 设置回调 -> 定制RabbitTemplate

```java
@PostConstruct   // (MyRabbitConfig对象创建完成以后，执行这个方法)
    public void initRabbitTemplate() {
        /**
         * 成功回调 发送消息触发confirmCallback回调
         * @param correlationData：当前消息的唯一关联数据（如果发送消息时未指定此值，则回调时返回null）
         * @param ack：消息是否成功收到（ack=true，消息抵达Broker）
         * @param cause：失败的原因
         */
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
            System.out.println("发送消息触发confirmCallback回调" +
                    "\ncorrelationData ===> " + correlationData +
                    "\nack ===> " + ack + "" +
                    "\ncause ===> " + cause);
        });
        /**
         * 消息未到达队列触发returnCallback回调  ->  例如路由键不对没有投递成功
         * 只要消息没有投递给指定的队列，就触发这个失败回调
         * @param message：投递失败的消息详细信息
         * @param replyCode：回复的状态码
         * @param replyText：回复的文本内容
         * @param exchange：接收消息的交换机
         * @param routingKey：接收消息的路由键
         */
        rabbitTemplate.setReturnCallback((message, replyCode, replyText, exchange, routingKey) -> {
            // 需要修改数据库 消息的状态【后期定期重发消息】
            System.out.println("消息未到达队列触发returnCallback回调" +
                    "\nmessage ===> " + message +
                    "\nreplyCode ===> " + replyCode + 
                    "\nreplyText ===> " + replyText +
                    "\nexchange ===> " + exchange + 
                    "\nroutingKey ===> " + routingKey);
        });
    }
```



##### 2.4.2 ==消费端确认&手动 ACK==

> 场景：如果不定制化，默认情况下消息抵达客户端后自动确认，服务端消息自动删除  `默认的自动确认会有问题`
> 	 问题：如一次5个消息到方法进行处理但只处理完1个就宕机。但web一看5个却都ack置为0了，实际上其它4个消息被默认ack但实际上还没处理！
>
> 解决：手动确认  保证每个消息都被正确消费，此时才可以broker删除这个消息       不手动确认，一旦宕机或闪断就消息丢失
>
> 体现：Message 会由 Unacked->Ready 等待下一次消费并不会消失，即使consumer宕机消息也不会丢失

> 一般用 RabbitMQ 都会启动手动 ACK  ->  只要解锁库存的消息失败，一定要告诉服务解锁失败。开启手动确认，不要删除消息，当前解锁失败需要重复解锁    手动模式需要 Channel

注意视频中终止 Debug 模式，仍然把剩下的消息给消费了的问题

因为这不是真正的宕机，这只是终止了程序，中终止程序前idea默认把这个方法执行完再中断。验证的话可以有用杀死进程的方式



在消费的方法中：像货物一样可以签收/拒收

```java
// 手动确认，消息会从unacked中删除，total数量减1
// boolean multiple：是否批量签收     我理解：一般都是一条消息一条消息处理，不会把整个channel中所有消息给一棒子打死
channel.basicAck(deliveryTag, false);

// 手动拒签
// boolean multiple：是否批量拒签
// boolean requeue：当前拒签消息是否发回服务器重新入队
channel.basicNack(deliveryTag, false, true);
```

示例：

```properties
## 手动ack消息，不使用默认的消费端确认
spring.rabbitmq.listener.simple.acknowledge-mode=manual
```

```java
try {
    // 解锁库存
    wareSkuService.unLockStock(locked);
    // 解锁成功，手动确认
    channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
} catch (Exception e) {
    // 解锁失败，消息入队
    channel.basicReject(message.getMessageProperties().getDeliveryTag(), true);
}
```





### [3.RabbitMQ延时队列(实现定时任务)](../gulimall/消息队列流程.jpg)

> 为了高并发不用 Seata 控制，用MQ保证最终一致性

#### 3.1.为什么用延时队列不用定时任务

解锁表如果用定时任务很麻烦！这里用延时队列 延迟一段时间再给解锁库存的服务发消息补偿回来
定时任务有时效性问题：一个30分钟过期的下单可能得59分钟后才被定时任务扫到

而延时队列，下订单的时候 -> 消息队列（30M）-> 关闭订单    没有时效性问题！

<img src="https://images.zzq8.cn/img/202301310936100.png" alt="image-20230131093624726" style="zoom: 67%;" />



#### 3.2.延时队列实现

> **TTL+死信  超过指定TTL还没被消费就称这个消息为死信  ->  死信会丢给死信交换机（DLX死信路由）  ->  死信交换机再丢给指定队列**

##### 3.2.1.队列过期（推荐）

![image-20230131105835211](https://images.zzq8.cn/img/202301311058168.png)

##### 3.2.2.消息过期

设置消息过期时间实现延时队列

因为MQ是惰性，发送3个消息，过期时间分别为5min，1min，1s，服务器得等第一个5min的过期并扔给死信路由才会检查第二个。





#### 3.3.MQ 架构

> 一个交换机即可，路由到不同的队列         **延时队列（TTL到了就放死信） & 死信队列（给消费者删，例如解锁库存）**

![image-20230131111753174](https://images.zzq8.cn/img/202301311117376.png)





#### 3.4.解锁库存

很多解锁细节，看着有些繁琐，直接 CV ，没有去捋了     后面大致捋了下



> 场景：
> 	1.下订单成功，用户手动取消 || 订单过期未支付
> 	2.其他业务调用失败，订单回滚，但库存锁定成功（最终一致性，需要解锁库存）
>
> 实现：
> 	监听死信队列，拿到库存锁定工作单解锁库存（解锁时判断是否允许解锁）





这里我有点一头雾水！！！视频中再想去找没看到

我可能知道原因了：因为正常逻辑订单延时队列先到

Queue order.delay.queue          TTL：1M

Queue stock.delay.queue		  TTL：2M

```
order module:
confirm... correlationData=>null ack => true
收到过期的订单信息，准备关闭订单202302011429244921620670634357006338
confirm... correlationData=>null ack => true

stock module:
******收到订单关闭，准备解锁库存的信息******
******收到解锁库存的信息******
```



> bug：
> 	订单解锁晚于库存解锁执行导致库存永远不会被解锁
> 	
> bug重现：
> 	机器卡顿，订单解锁的消息延迟抵达，造成订单解锁晚于库存解锁执行，此时库存解锁失败，因为订单还处于未支付状态，导致库存未解锁，并且消息已经确认
> 	
> 解决方案：
> 	方案一：
> 		库存解锁消息重新入队（不建议，因为无法判断消息延迟的具体时间，造成消息空转浪费资源）
> 	方案二：
> 		消费订单解锁消息时，往库存解锁的死信队列丢一条消息（同时是消费者和生产者）
>
> 
>
> bug业务场景：
> 	1.订单过期未支付
>
> 实现：
> 	生成订单时创建消息放入延时队列
> 	解锁订单方法监听死信队列
> 	**解锁订单时为了防止订单解锁晚于库存解锁的BUG，此时主动往解锁库存的死信队列发送一条消息**（看标题的图链接）





#### 3.5.可靠消息

> 柔性事务-**可靠消息**+最终一致性方案（异步确保型，视频是这个）✔
> 也是借助 MQ  总结一句：异步下单，提高并发，提升响应，提升购物体验。

其实 MQ 这一块完全可以单独抽取成一个 Module，封装处理好这些细节



看   [#2.4 消息确认机制-可靠抵达](#2.4 消息确认机制-可靠抵达)

##### 3.5.1.消息丢失

- 情况1：网络连接失败，消息未抵达Broker
  - 解决：发送消息时同时将消息持久化到MQ中并插入DB（DB消息状态为已抵达） 当出现异常时在catch处修改消息状态为错误抵达
- 情况2：消息抵达Broker，但为抵达queue，消息会丢失（只有抵达了queue消息才会持久化）
  - 解决：开启生产者确认机制，将触发returnCallback.returnedMessage的消息DB状态修改为错误抵达
- 情况3：消费者未ack时宕机，导致消息丢失
  - 解决：开启消费者手动ack



简而言之：注意try catch、保障消息确认机制-可靠抵达

```java
try {
    //TODO 确保每个消息发送成功，给每个消息做好日志记录，(给数据库保存每一个详细信息)保存每个消息的详细信息
    rabbitTemplate.convertAndSend("order-event-exchange", "order.release.other", orderTo);
} catch (Exception e) {
    //TODO 定期扫描数据库，重新发送失败的消息
    //while 不太好，如网络故障一时半会也好不了。最好就是上述的日志
}
```



##### 3.5.2.消息重复

- 情况1：业务逻辑已经执行，但是ack时宕机，消息由unack变为ready，消息重新入队
  - 解决：将接口设计成**幂等性**，例如库存解锁时判断工作单的状态，已解锁则无操作
- 解决2：防重表



##### 3.5.3.消息积压

- 情况1：生产者流量太大
  - 解决：减慢发送消息速率（验证码、防刷、重定向、削峰）
- 情况2：消费者能力不足或宕机
  - 解决1：上线更多消费者
  - 解决2：上线专门的队列消费服务，批量取出消息入库，离线处理业务慢慢处理
