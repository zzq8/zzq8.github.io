# 第一季:SpringBoot2核心技术

> 三刷总算想起做点笔记，这点很重要   [语雀官方笔记](https://www.yuque.com/atguigu/springboot)   重点看源码讲解的视频、Web开发这一章
>
> [每导入一个 starter 改写哪些配置直接看官网！！！有些什么配置一目了然！](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)
>
> 还有自动化配置文档，这个倒idea双shift找properties也行
>
> 看到了P25，由于求职形势逼迫。搁浅... 做项目快速上手能干，往后再回头了    

<img src="http://image.zzq8.cn/img/202302111035624.png" alt="image" style="zoom: 80%;" />

上面图片的所有基础原生开发，都有另一套方案用响应式替代。支持两种模式开发 `@ConditionalOnWebApplication(type = Type.SERVLET)`
Spring5 除现在用的原生Servlet外多了一套解决方案：响应式开发！！于是SpringBoot出2跟着整   第一季就是掌握整个Sevlet技术栈

**第二季响应式还没出，坐等**，底层依赖reactor、Netty-reactor 异步非阻塞的方式占用少量资源处理大量并发



# ------基础入门------

# 一、Spring与SpringBoot

## 1.Spring能做什么

### 1.1.Spring的能力

[Spring 生态很庞大](https://spring.io/projects/spring-boot)：细数自己用过的。微观是Spring框架 宏观是一套解决方案生态圈！

* Spring Boot
* Spring Cloud (Spring Cloud Alibaba)
* Spring Framework (Features:Integration->Caching)
* Spring Data (JDBC、JPA、Redis [implementation](https://docs.spring.io/spring-data/data-redis/docs/current/reference/html/#redis:support:cache-abstraction) for Spring 3.1 cache abstraction)
* Spring Session (Data Redis)
* Spring AMQP (RabbitMQ)

### 1.2.Spring5重大升级

#### 1.2.1.响应式编程

<img src="http://image.zzq8.cn/img/202302111528869.png" alt="image-20230211152821781" style="zoom: 67%;" />

#### 1.2.2.内部源码设计

由于Spring5重大升级 内部源码设计基于Java8的一些新特性，如：接口默认实现。重新设计源码架构！

Spring5基于jdk8，jdk8特性多了接口的默认实现。带来的变化：
**问题场景**：要是以前底层还需搞个==适配器模式==（适配器实现接口，实现类继承适配器重写 -> 避免必须实现一些不需要的方法）
**处理**：接口都统一给一个默认实现，就不需要适配器类了！！！



## 2.为什么用SpringBoot

> 举例如要组装成一台电脑集合上面的技术 **配置地狱**，而这就是SpringBoot的存在意义它是一个高层框架底层是Spring为了整合Spring整个技术栈
> 专心于业务逻辑（框架的框架），免于那么多繁琐的配置。不用自己手动组装电脑了，直接买个品牌机！无需掌握各种组装技术！！！

### [2.1.SpringBoot优点](https://spring.io/projects/spring-boot)

> 以下摘自官网，Title Link 可入 ~ 可以细看心里解读解读
>
> Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".
> 能快速创建出生产级别的Spring应用

- Create stand-alone Spring applications

- - 创建独立Spring应用

- Embed Tomcat, Jetty or Undertow directly **(no need to deploy WAR files)**

- - 内嵌web服务器

- Provide opinionated 'starter' dependencies to simplify your build configuration

- - 自动starter依赖，简化构建配置**（防止各jar包冲突）**

- Automatically configure Spring and 3rd party libraries whenever possible

- - 自动配置Spring以及第三方功能**（激动人心的特性，对于固定化配置全给你配好 例如mysql redis只要告诉地址之类的而不需要再告诉它什么东西怎么做例如配置数据源。）**

- Provide production-ready features such as metrics, health checks, and externalized configuration

- - 提供生产级别的监控、健康检查及外部化配置**（针对运维来说巴适，例如写个配置文件无需回头改代码再发布）**

- Absolutely no code generation and no requirement for XML configuration

- - 无代码生成、无需编写XML**（自动配置）**



SpringBoot是整合Spring技术栈的一站式框架

SpringBoot是简化Spring技术栈的快速开发脚手架



### 2.2.时代背景

陌生的两个东西：[听视频老师讲讲](https://www.bilibili.com/video/BV19K4y1L7MT?p=3&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)

* Spring Cloud Data Flow（那张经典图三板斧中的，连接一切）
* 云原生（同运维有很大关系！） Serverless（区别直接买一台几核几G的服务造成浪费，这个可以做到用多少占多少。虽然现在不理解但是先码上）





# 二、了解自动配置原理

> 两大优秀特性：依赖管理、自动配置

## 1.依赖管理

### 1.1.版本仲裁

```xml
1）依赖管理    
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.4.RELEASE</version>
</parent>

2）他的父项目：几乎声明了所有开发中常用的依赖的版本号,自动版本仲裁机制
 <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>2.3.4.RELEASE</version>
  </parent>

-------------------------------------------------------
1、引入依赖默认都可以不写版本
2、引入非版本仲裁的jar，要写版本号。
-------------------------------------------------------

3）舍弃父依赖的版本控制，自定义版本
查看spring-boot-dependencies里面规定当前依赖的版本 用的 key。
在当前项目里面重写配置
<properties>
    <mysql.version>5.1.43</mysql.version>
</properties>
```



### 1.2.starter场景启动器

> 重点第五点，这个starter又会带出 `spring-boot-autoconfigure` 具体看自动配置

```xml
1、见到很多 spring-boot-starter-* ： *就某种场景   All official starters follow a similar naming pattern; 
2、只要引入starter，这个场景的所有常规需要的依赖我们都自动引入
3、SpringBoot所有支持的场景
https://docs.spring.io/spring-boot/docs/current/reference/html/using-spring-boot.html#using-boot-starter
4、见到的  *-spring-boot-starter： 第三方为我们提供的简化开发的场景启动器。
5、所有场景启动器最底层的依赖   每个 official starts 下的第一个 dependency 就是下面这个 ↓
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter</artifactId>
  <version>2.3.4.RELEASE</version>
  <scope>compile</scope>
</dependency>
```





## ==2.自动配置（重要）==

```java
@SpringBootApplication
等同于
@SpringBootConfiguration              #配置类
@EnableAutoConfiguration              #按需自动配置          **核心**
    	1）@AutoConfigurationPackage
    		  @Import(AutoConfigurationPackages.Registrar.class) //扫描的是配置类，区分@ComponentScan
        2）@Import(AutoConfigurationImportSelector.class) //META-INF/spring.factories  
@ComponentScan("com.atguigu.boot")    #扫描主启动类下所有组件
```




### 2.1.效果体现

#### 2.1.1.What

自动配置好了一切，包括SpringMVC常用组件（功能）   
搜一下以前的帖子，Spring整合SpringMVC的帖子发现xml会配一大堆东西！！！这些组件springBoot启动的时候会把组件都装配到容器中，不用配。

* 前端控制器DispatcherServlet：拦截所有的前端的请求；
* 字符编码characterEncodingFilter：解决返回中文字符串乱码问题；
* 视图解析器viewResolver：对返回的视图进行渲染呈现；
* 文件上传解析器multipatResolver：文件上传；



代码验证：打印所有启动时候装载的 Beans

```java
//返回一个IOC容器
ConfigurableApplicationContext run = SpringApplication.run(MainApplication.class, args);
String[] names = run.getBeanDefinitionNames();
Arrays.stream(names).forEach(System.out::println);
```



#### ==2.1.2.Why==

> 这个jar里有几乎SpringBoot所需要全场景，有很多爆红的类其实导入相应的dependency就不会爆红了
>
> `spring-boot-starter-web` -> `spring-boot-starter` -> `spring-boot-autoconfigure`

For example：以MySQL 配置数据源为例：DataSourceProperties 



### 2.2.@AutoConfigurationPackage🌟

ChatGPT：转念一想，这两个注解都如字面意思   这样就很好区分异同

> springboot @ComponentScan和@AutoConfigurationPackage的区别
>
> 
>
> `@ComponentScan` 和 `@AutoConfigurationPackage` 都是 Spring Boot 中用来扫描组件和自动配置的注解，它们的区别在于：
>
> 1. `@ComponentScan`：这个注解是用来指定 Spring 扫描组件的位置，会扫描指定的包及其子包中的所有类，找到标记为 `@Component`、`@Service`、`@Repository` 等注解的类，并将其注册为 Spring 的 Bean。
> 2. `@AutoConfigurationPackage`：这个注解是用来指定自动配置所在的包，它会扫描指定的包及其子包中的所有类，找到标记为 `@Configuration` 的类，并将其注册为 Spring 的 Bean。
>
> 简而言之，`@ComponentScan` 和 `@AutoConfigurationPackage` 都是用来扫描组件的注解，区别在于 `@ComponentScan` 扫描的是标记了特定注解的组件类，而 `@AutoConfigurationPackage` 扫描的是配置类。在 Spring Boot 应用中，通常会在启动类上使用 `@SpringBootApplication` 注解，该注解中已经包含了 `@ComponentScan` 和 `@AutoConfigurationPackage`，因此一般不需要单独使用这两个注解。



### 2.3.@Import(AutoConfigurationImportSelector.class)🌟

1、利用getAutoConfigurationEntry(annotationMetadata);给容器中批量导入一些组件
2、调用List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes)获取到所有需要导入到容器中的配置类
3、利用工厂加载 Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader)；得到所有的组件
4、从META-INF/spring.factories位置来加载一个文件。
	默认扫描我们当前系统里面所有META-INF/spring.factories位置的文件
    spring-boot-autoconfigure-2.3.4.RELEASE.jar包里面也有 `META-INF/spring.factories`
    

作用：文件里面写死了spring-boot一启动就要给容器中加载的所有配置类，并不是所有都生效@Condition 例如AOP、Batch就需导入相关包才生效

学习：可以找找各个第三方jar包里面的 xxxxxAutoConfiguration 分析是否生效装配进来了



总结：

1. 用户配的优先 @ConditionalOnMissingBean

2. 如果用户配的bean名字不符合规范，就给你纠正过来，如下给容器中加入了文件上传解析器：

```java
    @Bean
	@ConditionalOnBean(MultipartResolver.class)  //容器中有这个类型组件
	@ConditionalOnMissingBean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME) //容器中没有这个名字 multipartResolver 的组件
	public MultipartResolver multipartResolver(MultipartResolver resolver) {
        //给@Bean标注的方法传入了对象参数，这个参数的值就会从容器中找。
        //SpringMVC multipartResolver。防止有些用户配置的文件上传解析器不符合规范
		// Detect if the user has created a MultipartResolver but named it incorrectly
		return resolver;
	}
```
3. 一般这些自动配置类都绑了xxxxProperties里面拿。xxxProperties和配置文件进行了绑定



判断场景自动配置那些生效那些没生效：

- - 自己分析，引入场景对应的自动配置一般都生效了

  - 配置文件中debug=true开启自动配置报告。Negative（不生效）\Positive（生效）【方便分析源码】

    

  - - 自定义器  **XXXXXCustomizer**；【不熟】

















> 想不起配置文件怎么配 SQL 于是有了下文

### 以MySQL 配置数据源为例：DataSourceProperties 

```
DataSourceAutoConfiguration -> 组件 -> DataSourceProperties -> application.properties
```

总结：

- SpringBoot先加载所有的自动配置类  xxxxxAutoConfiguration
- 每个自动配置类按照条件进行生效，默认都会绑定配置文件指定的值。xxxxProperties里面拿。xxxProperties和配置文件进行了绑定
- 生效的配置类就会给容器中装配很多组件
- 只要容器中有这些组件，相当于这些功能就有了
- 定制化配置

- - 用户直接自己@Bean替换底层的组件
  - 用户去看这个组件是获取的配置文件什么值就去修改。

**xxxxxAutoConfiguration ---> 组件  --->** **xxxxProperties里面拿值  ----> application.properties**

![image-20220901180324251](http://image.zzq8.cn/img/202209011803186.png)



![image-20220901213237083](http://image.zzq8.cn/img/202209012132180.png)









![image-20230217115759420](http://image.zzq8.cn/img/202302171158502.png)



![image-20220901220507136](http://image.zzq8.cn/img/202209012205178.png)



### SpringBoot 自动装配

> 有时间一定要自己回顾一遍，自己跟着 Debug。还有**spring-factories的详细原理**
>
> 看一下这个 spring boot autoconfigure 是不是所有 jar 都会包括

1、利用getAutoConfigurationEntry(annotationMetadata);给容器中批量导入一些组件
2、调用List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes)获取到所有需要导入到容器中的配置类
3、利用工厂加载 Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader)；得到所有的组件
4、从META-INF/spring.factories位置来加载一个文件。
	==默认扫描我们当前系统里面所有META-INF/spring.factories位置的文件==
    spring-boot-autoconfigure-2.3.4.RELEASE.jar包里面也有META-INF/spring.factories

![img](http://image.zzq8.cn/img/202209012113729.png)



加载所有jar包META-INF/spring.factories文件EnableAutoConfiguration属性指定的类，指的是：

![](http://image.zzq8.cn/img/202209012117863.png)















































































***

# ==------分割线------==









# 1）常用注解

> 搞个时间重新排个版！知识待完善

[第一季：SpringBoot2核心技术-基础入门](https://www.yuque.com/atguigu/springboot/vgzmgh)

[Spring注解驱动](https://liayun.blog.csdn.net/article/details/115053350)

* #### @RquestBody

  * 获取请求体，**必须发送POST请求**。SpringMVC自动将请求体的数据**（json），转为对应Java对象**（+形参Entity上）
  
  * ```java
    //以较简单的User对象接收前端传过来的ison数据(SpringMVC会智能的将符合要求的数据装配进该User对象中)
    public String test(@RequestBody User user){}
    ```



* #### @ResponseBody

  * 例如，异步获取`json`数据，加上`@Responsebody`注解后，就会直接返回`json`数据。
  * @RestController = @Controller + `@ResponseBody`



* #### @Scope

  * 配置类里面使用@Bean标注在方法上给容器注册组件，默认也是单实例的

  * ```java
    //@Scope("prototype") // 现在还不是多例，还需要指定代理模式
    //* 原生 Spring JDK代理  * 现在 SpringBoot 2.X 之后都是CGlib，这里用 CGlib
    @Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS) 
    ```



* #### @Value

  * 1）必须把当前类加入spring的容器管理@Component，注意要在主启动类下，测试类的话用SpringBoot的测试注解，这个也分4/5注意。（容易忽略，不加 [[貌似](https://m.yisu.com/zixun/723340.html)] 得到的为 null）
  * 2）变量不能用static修饰！！！
  * 如果想要注入静态 [spring @value 注入static 注入静态变量方法](https://blog.csdn.net/ZYC88888/article/details/87863038)
  * **先说明冒号的作用 ：可以设置默认值 **@Value("${prop.url:'http://myurl.com'}")



* #### @SpringBootApplication(<font color=red>exclude = DataSourceAutoConfiguration.class</font>)

  * 适用场景：pom 引入的 Common 有数据源，但是本 Demo 不需要。启动报错要求配
  * 后话：个人觉得pom exclude 应该也行

  

* #### ==@EnableConfigurationProperties==

  * 说白了 @<font color=red>Enable</font>ConfigurationProperties 相当于把使用 @ConfigurationProperties 的类进行了一次注入
    **因为这个类没有@Conponent，用这种方法放到 IOC 容器中才能用**    只有容器中的组件才能有SpringBoot提供的强大的功能
  * 场景：如果@ConfigurationProperties是在第三方包中，那么@component是不能注入到容器的。只有@EnableConfigurationProperties才可以注入到容器。   RedisCacheConfiguration配置kv的序列化的时候需要把其它配置也给拿上就需要CacheProperties放入容器使用

* #### @ConfigurationProperties

  * 解决：以前得IO流拿properties里的k v


​	

* #### @Import & @ComponentScan

  * 我使用的场景：配置类放在 common 模块，其它模块都来用这个配置类
  * 导入组件默认组件名字是 com.example.boot.bean.Cat 全类名
  * 也可以导入dependence jar里的class



* #### @PostConstruct

  * 场景：MyRabbitConfig对象创建完成以后，执行这个方法`rabbitTemplate.setConfirmCallback`用于设置确认回调 ConfirmCallback 

> # [@RequestParam，@PathParam，@PathVariable等注解区别](https://blog.csdn.net/u011410529/article/details/66974974)

* #### @PathVariable("page")

  * ```java
    @GetMapping(value = "/{page}.html")
    public String listPage(@PathVariable("page") String page) {
    	return page;
    }
    ```




* 使用@RequestParam时，URL是这样的：http://host:port/path?参数名=参数值

  使用@PathVariable时，URL是这样的：http://host:port/path/参数值

  

* #### @PathParam  发现post请求的话只能用这个来拿参数 注意参数过长拿不到需要用request类拿

  
  * My：应该是Get URL有大小限制？  也不对request不是拿到了吗
  
  * ```java
    @PathParam("imegse") String imageBase64 //@PostMapping("/photo") 拿不到参数
    String channel = request.getParameter("imegse"); //能拿到
    ```
  
    
  

***

* #### @Builder

  * Lombok annotation为你的类生成相对略微复杂的构建器API，放随意参数的构造器 链式调用就行



* #### @Bean

  * ```java
    //    @Autowired
    //    CacheProperties cacheProperties;  //因为下面是 @Bean 直接放参数用就行！
        @Bean //原来@Bean注解想容器注入对象的时候，会自动将容器中已经有的对象传入到@Bean注解的方法参数中
        public RedisCacheConfiguration redisCacheConfiguration(CacheProperties cacheProperties) { //这个参数能拿值？  这个方法就是给容器放东西，方法传的所有参数所有参数都会从容器中进行确定  所以会自动去IOC中拿
    ```

    

* #### @GetMapping

  * ```java
    //场景：return	String 内容是支付宝付款页面
    @ResponseBody
    @GetMapping(value = "/aliPayOrder",produces = "text/html")
    ```



* #### @ComponentScan("com.example") -> @SpringBootApplication(scanBasePackages = "com.example")



* #### @Configuration(proxyBeanMethods = false)//默认是true   //告诉SpringBoot这是一个配置类 == 配置文件

  底层会有非常多这样的写法，为的就是加速容器启动过程，减少判断（前提：类组件之间无依赖关系）

  * ```java
    MyConfig bean = run.getBean(MyConfig.class);
    System.out.println(bean); //`com.example.boot.config.MyConfig$$EnhancerBySpringCGLIB$$1@38fc34fd`    默认是Full模式，每一次都从容器中拿       相对的还有Lite即false模式，为什么这么叫因为这样不用去容器中对照来一个返回一个！
    最佳实战：别人不依赖这些组件（Person里面拿Pet）就给调成false
    System.out.println(bean.ss() == bean.ss()); //true
    ```

  * 最佳实战：

    - 配置 类组件之间无依赖关系用Lite模式加速容器启动过程，减少判断
  
    - 配置类组件之间有依赖关系，方法会被调用得到之前单实例组件，用Full模式
  
  
  * Mark！！！==Bean的加载顺序==
    在spring ioc的过程中，
    * 1）优先解析@Component，@Service，@Controller...注解的类。
    * 2）其次解析配置类，也就是@Configuration标注的类
    * 3）最后开始解析配置类中定义的bean。

但是tomXXX的条件注解依赖的是user01，user01是被定义的配置类中的，
所以此时配置类的解析无法保证先后顺序，就会出现不生效的情况。     me：所以才会有condition这些？





* #### @ImportResource("classpath:beans.xml")

  * 这里之所以要classpath，个人理解：resources不是相对路径
  * 总有些老jar包或公司老配置需要的



 








# 2）技术点

## 1）一些小点

* #### SpringBoot,因为默认加入了==Slf4j-api和logback==的依赖,所以只需要添加[lombok](https://so.csdn.net/so/search?q=lombok&spm=1001.2101.3001.7020)的依赖即可.

  * 注意IDEA 2020.3以及之后的版本内置了lombok插件



* #### ==Spring Boot 2.+默认连接池HikariCP==  ”黑卡丽“，光的意思很快 日本人发明。区分Druid连接池为监控而生扩展点多..

* #### ==Spring MVC 的默认json解析器便是 Jackson==

  * 如果用了 Nacos 会依赖导入 fastjson（雷神用了这个）




* ```
  logging:
    level:
      com.example.distributedlock.dao: debug #一定要加这一行指定目录，不然报错
  ```



* #### 快速定位报错原因

  * ![image-20221017164745509](http://image.zzq8.cn/img/202210171647567.png)





## 2）Pom文件：

 * #### [Pom.xml  -> \<relativePath>](https://blog.csdn.net/gzt19881123/article/details/105255138)

   ![image-20221017102235784](http://image.zzq8.cn/img/202210171022851.png)

   ```
   设定一个空值将始终从仓库中获取，不从本地路径获取，如<relativePath/> 看这句就很明了了！这里就是去本地../bokeerp路径去拿这个pom文件
   Maven parent.relativePath
   默认值为../pom.xml
   查找顺序：relativePath元素中的地址–本地仓库–远程仓库 
   ```
   
   ==**Maven 寻找父模块pom.xml 的顺序如下：**==
   
   ```
    (1)  first in the reactor of currently building projects
          这里一个maven概念 反应堆（reactor ），
          意思就是先从工程里面有依赖相关的模块中找你引入的
          parent 的pom.xml，
        
    (2) then in this location on the filesystem
         然后从 你定义的  <relativePath > 路径中找，
         当然你如果只是 /  即空值，则跳过该步骤，  
         默认值 ../pom.xml 则是从上级目录中找啦。
   
    (3)  then the local repository
       这个就不说了，如果 （1） （2） 步骤没有则从 本地仓库找啦。
   
    (4) and lastly in the remote repo
     这个还用说吗，上面都找不到了，最后只能从远程仓库找啦，再找不到就报错给你看 
     
     
   一般新建 Spring Boot 工程，默认是 <relativePath /> <!-- lookup parent from repository --> ，意思就是不会从上层目录寻找。会直接先从 local repository，如果没有则会从 remote repo 寻找，如果也没有，则报错。
   ```
   
   

## 3）Test 测试类：

* #### ==[org.junit.jupiter.api.Test和org.junit.Test区别](https://blog.csdn.net/qq_36050981/article/details/119565383)==

  * 现在需要知道！主要是 spring boot ==2.2之前使用的是 Junit4 之后是 Junit5==，还需知道他们两个有什么区别看网站！
    * 都要 public 
    * @RunWith

* #### [关于@RunWith(SpringRunner.class)的作用](https://blog.csdn.net/qq_21108099/article/details/111496005)

  * SpringBoot 测试类 需要从容器中获取实例是需要加上该注解，否则空指针，管你是啥IDE。貌似是Junit4用的注解

  * ```java
    //不加@RunWith(SpringRunner.class)就取不到容器中的 Bean
        @Autowired
        private RestHighLevelClient client;
    
        @Test
        public void contextLoads() {
            System.out.println(client);  //null
        }
    ```

    

#### [补充：@SpringBootTest](https://blog.csdn.net/wwwwwww31311/article/details/115461920)

我们新建 SpringBoot 程序发现 src 包和 test 包路径一开始初始化就是一样的！

* 因为测试类包名得和主启动类一致才能跑测试类
* 如果不想修改包名，那么需要在注解上加上@SpringBootTest(classes = xxx.class)
  * 但这里会产生额外的问题，因为此时springboot已经把该类当成一个独立的测试类了，这意味着这个测试类对应独立的IOC容器，所以此时我们无法注入到main包中的组件，案例如下,main包下的路径是com.sobot.demo7,而同理，test包下com.sobot.demo7路径下测试类，可以正常装配userMapper组件com.sobot.demo8路径下测试类，则根本无法找到userMapper这个组件
    * ![在这里插入图片描述](https://img-blog.csdnimg.cn/f8be2ba0c5f64f779696924284214be8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Z6D5Zy-546L5a2Q5pmX,size_20,color_FFFFFF,t_70,g_se,x_16)







## ==[4）有参数的@Bean，@Configuration注解](https://codeantenna.com/a/6mscWp9KMx)==

> ：）以前竟然不知道

```java
//    @Autowired
//    CacheProperties cacheProperties;  //因为下面是 @Bean 直接放参数用就行！

    @Bean //原来@Bean注解想容器注入对象的时候，会自动将容器中已经有的对象传入到@Bean注解的方法参数中
    public RedisCacheConfiguration redisCacheConfiguration(CacheProperties cacheProperties) { //这个参数能拿值？  这个方法就是给容器放东西，方法传的所有参数所有参数都会从容器中进行确定  所以会自动去IOC中拿
```





## 5）数据校验

[分布式高级](../gulimall/分布式高级#注册流程)



## 6）拦截器

实现步骤:

```java
com.zzq.gulimall.cart.intercept.CartIntercept   #编写拦截器
public class CartIntercept implements HandlerInterceptor
    
com.zzq.gulimall.cart.config.GulimallWebConfig    #注册拦截器
@Configuration
public class GulimallWebConfig implements WebMvcConfigurer
```























# 3）碰到过的问题



> 配置文件热部署：因为这个Bean是启动时加载的，并不是运行时候实时拿

```yaml
#spring cache
  cache:
    type: redis
    redis:
      time-to-live: 100000 #这里我想热部署，搞一下午  jrebel+devtools 都不行还得重启项目
```





> 静态资源访问不到，因为加了上下文路径

```yaml
#会导致问题
server:
  servlet:
    context-path: /yigo
    
#暂时用的是这个解决
spring:
  mvc:
    static-path-pattern: /static/**
```





> 未解决：父 Module有
>
> [网上还有个解决方法不理解但可行!<path>](https://www.cnblogs.com/wandoupeas/p/spring-boot-configuration-processor-not-configured.html#!comments)   看下面会出其它问题

```xml
父有这个按道理子引入父应该也有
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
</dependency>


但是子必须自己导入并加个 optional 才可以
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```





> @import公共模块的实体类导致lombok的注解失效  Gulimall未解决不做了，是做到限流突然就这个问题不做了

![image-20230211140746713](http://image.zzq8.cn/img/202302111407769.png)

今天重新导入这个项目时，看到 idea 的这个报错突然醒悟！！！看上面笔记当时为什么用它的场景

```java
<!--                    有这个注解会导致 lombok 注解不能正常编译！！！要么加进来要么去掉这个注解！-->
<!--                    <annotationProcessorPaths>-->
<!--                        <path>-->
<!--                            <groupId>org.springframework.boot</groupId>-->
<!--                            <artifactId>spring-boot-configuration-processor</artifactId>-->
<!--                            <version>2.1.8.RELEASE</version>-->
<!--                        </path>-->
<!--                    </annotationProcessorPaths>-->
```

