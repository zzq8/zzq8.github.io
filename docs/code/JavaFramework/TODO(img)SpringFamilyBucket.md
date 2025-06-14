# TODO(img) Spring全家桶

> TODO：笔记太松散了，比较少     可以筛选  拿营养部分
>
> #### 重要：没看完一节一定去[极客的对应视频](https://time.geekbang.org/course/detail/100023501-80193)底下的评论过一下  
>
> 有问题就要带着问题去解决！
> 240403 再回顾，慢就是快。   要主动学习这样学习内容的留存率更高
>
> 20h -> 2h/Day    ===>    10 Day    expect April 19th Finished
>
> #### PDF 课件和源代码下载地址：
>
> [https://gitee.com/geektime-geekbang/geektime-spring-family](https://gitee.com/geektime-geekbang/geektime-spring-family)
>
> [https://github.com/digitalsonic/geektime-spring-family](https://github.com/digitalsonic/geektime-spring-family)
>
> ps：2019年制作的课程，虽然版本已经跟不上现在的步子了，但还是希望能给你带去一些帮助。     架构发展：单机 - 集群 - 云

## 线上咖啡项目-SpringBucks

金额相关不用浮点类型, 而是引用 joda-money jar包    +  usertype.core  jar来实现映射

Q: 老师，请问金融项目，使用浮点数 double 会出什么问题吗？

作者回复: 比如精度、货币转换、单位等等的，还是建议用 Money 类，不要用 Double

BigDecimal只是处理精度而已，对于货币而言，还有货币种类、货币单位、货币转换等很多东西需要考虑的。比如元转分，分转元这些Money都提供了支持。

你想啊，不同的币种他们的单位不同，小数的位数也不同，以人民币为例，我可以用元表示，也可以用分表示，后者数字是前者的100倍，如果我换个币种呢，也许是1000倍，比如伊拉克第纳尔，金额要和货币绑定在一起。你也许还会碰上货币转换等等工作，所以还是用专门的API比较方便。

## ｜JDBC

### H2

> h2 内存数据库举例（可初始化内嵌数据库 Config/Code 中可指定 schema&data SQL文件）

#### Q: 如何查看 H2 内存数据库的内容？

> 一开始跟着视频走, 只能 commandLine 启动类 log 一下看, 现在能 Web

你应该在应用程序中运行 H2 web server，这样就可以通过 H2 Console 来访问内存数据库。在 Spring 应用程序中，你可以在应用上下文中声明了一个 web server bean：

```java
import org.h2.tools.Server;
...

@Configuration
public class DataConfig {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public Server h2WebServer() throws SQLException {
        return Server.createWebServer("-web", "-webAllowOthers", "-webDaemon", "-webPort", "8082");
    }
}
```

现在，在应用程序运行期间，你可以在浏览器中输入 [http://localhost:8082](http://localhost:8082) 来访问数据库了。

参考 [View content of H2 or HSQLDB in-memory database](https://stackoverflow.com/questions/7309359/view-content-of-h2-or-hsqldb-in-memory-database)。



补充:

+ `spring.h2.console.enabled=true`
  - log - `jdbc:h2:mem:3e44a043-0e60-4cc1-9491-117ff59842fz`(这里 dbname 可以配置的) 
+ Web JDBC URL 填以下 Log 的 'jdbc:h2:mem:testdb' (搞了很久这个地方)

```java
2024-04-15 16:50:32.481  INFO 44526 --- [           main] o.s.b.a.h2.H2ConsoleAutoConfiguration    : H2 console available at '/h2'. Database available at 'jdbc:h2:mem:testdb'
```



#### 方法一：手工

> 代码方式 - 显式的配置一些参数

> DIY 3 个 Bean, MODE=MySQL
>
> 重点只有 DataSource，其他其实只是辅助

```java
@Value("classpath:db/schema.sql")
private Resource schemaScripts;

@Value("classpath:db/data.sql")
private Resource dataScripts;

@Value("classpath*:mapper/*.xml")
private Resource[] mappers;

@Bean
ConfigurationCustomizer mybatisConfigurationCustomizer() {
    return configuration -> {
        configuration.setUseGeneratedKeys(true);
        configuration.setUseGeneratedKeys(true);
        configuration.setCacheEnabled(false);
        configuration.setLazyLoadingEnabled(false);
        configuration.setDefaultExecutorType(ExecutorType.BATCH);
        configuration.setUseColumnLabel(true);
        configuration.setLogImpl(StdOutImpl.class);
    };
}

@Bean
public DataSource dataSource() {
    JdbcDataSource ds = new JdbcDataSource();
    ds.setURL("jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1;");
    ds.setUser("sa");
    ds.setPassword("sa");

    ResourceDatabasePopulator initializer = new ResourceDatabasePopulator();
    initializer.setScripts(schemaScripts, dataScripts);
    DatabasePopulatorUtils.execute(initializer, ds);
    return ds;
}

@Bean
public org.mybatis.spring.SqlSessionFactoryBean inmemSessionFactory() {
    org.mybatis.spring.SqlSessionFactoryBean sessionFactoryBean = new org.mybatis.spring.SqlSessionFactoryBean();
    sessionFactoryBean.setDataSource(dataSource());
    sessionFactoryBean.setMapperLocations(mappers);
    return sessionFactoryBean;
}
```

![](https://img-blog.csdnimg.cn/img_convert/b479191fb8035facdcd089735d56d011.png)

> Q：启动时候 DIY 打印 DataSource#toString 为什么能看到 DB 的 URL 信息
>
> A：由于 DataSource ds = new JdbcDataSource();
>
> 所以 ds.toString() 调用的是 JdbcDataSource#toString
>
> 即 return this.getTraceObjectName() + ": url=" + this.url + " user=" + this.userName;  
> 可以看到 url 信息，及其 user 信息！

```java
datasource=====ds0: url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1; user=sa
connection=====conn3: url=jdbc:h2:mem:testdb user=SA
```

+ 如果没有配数据源 JdbcDataSource，则默认的   
  "dataSource": {"type": "com.zaxxer.hikari.HikariDataSource"}  
  具体可以通过 actuator 核实！
+ 除了 DataSource，SpringBoot 还帮我们配了 "transactionTemplate"、"jdbcTemplate"



Total：SpringBoot 帮我们配置了 DataSource、DataSourceTransactionManager、JdbcTemplate都是由他们的 xx+AutoConfiguration 配置的，例如 DataSourceAutoConfiguration -> DataSource

都是按需装配的，用户 DIY 的优先级在前

#### [方法二](https://gitee.com/geektime-geekbang/geektime-spring-family/blob/master/Chapter%202/datasource-demo/src/main/resources/data.sql)：自动

除了上面代码方式配置外：

直接 SpringBoot 全管理，schema.sql 等 sql 文件放 resource 根目录

### [多数据源](https://gitee.com/geektime-geekbang/geektime-spring-family/blob/master/Chapter%202/multi-datasource-demo/src/main/java/geektime/spring/data/multidatasourcedemo/MultiDataSourceDemoApplication.java)

> Q: 为什么要 exclude,  第5节中提到：如果自行配置了数据源，那么spring不会再自动配置数据源。这边也是自行配置数据源，spring应该不会再自动配置数据源。所以，为什么还需要exclude三个自动配置的类。
>
> A: 作者回复: 我在其他同学的留言中解释过这个问题了，可以翻一下哈。的确不exclude的是可以的，但明确不使用的东西就从项目依赖中去掉，是个不错的习惯。
>
> 第5节是在讲如果要配置多个数据源该怎么办，SpringBoot的自动配置多数都是针对只有一个DataSource的，所以我在课程中提了，要么给主要的DataSource Bean增加@Primary注解，要么就把几个自动配置类排除掉。
>
> > 略懂，更偏向 a1 Good habit



> ⭐️ Q： spring boot 是如何保证 bean 的生成顺序是：fooDataSourceProperties -> fooDataSource -> fooTxManager，否则最先生成的是 fooTxManager，其依赖的 fooTxManager 仍未生成，这不就报错了么？ 
>
> A：Spring自己会计算依赖关系，把依赖最底层的Bean先创建出来



> ⭐️ Q: 为啥生成 fooDataSource 时，是方法内直接调用 fooDataSourceProperties() 方法，而非在方法入参注入 fooDataSourceProperties 变量？
>
> A：注入和调用方法的效果是一样的，这里有些小小的黑魔法，Spring对这里的调用做了处理。官方文档里有这么一句话：All @Configuration classes are subclassed at startup-time with CGLIB. In the subclass, the child method checks the container first for any cached (scoped) beans before it calls the parent method and creates a new instance.  
> Translate: 子方法在调用父方法并创建新实例之前，首先检查容器中是否有任何缓存（作用域）bean



> Q： 如果要生成 fooJdbcTemplate 和 barJdbcTemplate，代码要如何写呢？我参照了 fooTxManager 生成方式，并且按照上一节课“如何配置单数据源”读取数据的方式，程序报错： Caused by: org.h2.jdbc.JdbcSQLSyntaxErrorException: Table "FOO" not found; SQL statement: SELECT * FROM FOO [42102-200]。
>
> A: 因为你排除了SpringBoot的数据源自动配置，所以SpringBoot不会为你初始化Schema和Data，因此就没有你要的数据表。
>
> > 其实也可 Code 自定义这两个的路径配置

```java
//-------初始化数据库脚本代码
/*
 * 这个bean只是为了在多数据源环境初始化schema即data
 */
@Bean
public DataSourceInitializer fooDataSourceInitializer(@Qualifier("fooDataSource") DataSource dataSource) {
    ResourceDatabasePopulator resourceDatabasePopulator = new ResourceDatabasePopulator();
    resourceDatabasePopulator.addScript(new ClassPathResource("foo-schema.sql"));
    resourceDatabasePopulator.addScript(new ClassPathResource("foo-data.sql"));

    DataSourceInitializer dataSourceInitializer = new DataSourceInitializer();
    dataSourceInitializer.setDataSource(dataSource);
    dataSourceInitializer.setDatabasePopulator(resourceDatabasePopulator);
    return dataSourceInitializer;
}
```



> Q：是版本还是什么问题，去掉了第三个excluded的JDBCTemplate类，两个其中一个bean加上@Primary才跑通
>
> A: JdbcTemplateAutoConfiguration要求只有一个DataSource Bean，我们的代码里配置了两个，自然运行会报错，在指定了@Primary后，就有了主Bean，就能正常运行了。



> Q：两个数据源都加载进去了，怎么使用呢，比如说怎么使用第一个 ，怎么使用第二个？
>
> A：作者回复: 这个就是要你自己来实现的了，有两个数据源，就会有两套事务的配置，两个JdbcTemplate，什么都是两个，你自己选择用哪个。我们在答疑课里针对多数据源做了些说明，你可以跳过去看看。



配置多数据源的两种方式：

**方法一：**

1. 配置 @Primary 类型的Bean
   1. 第一种比较简单，所以没做Demo

---------------

方**法二：**

1. Springboot 注解  Exclude SpringBoot 自动配置以下三个类
   - DataSourceAutoConfiguration
   - DataSourceTransactionManager<font style="color:#262626;">AutoConfiguration</font>
     * <font style="color:#262626;">父接口 PlatformTransactionManager</font>
   - JdbcTemplate<font style="color:#262626;">AutoConfiguration</font>
2. <font style="color:#262626;">自定义 @Bean </font>DataSourceProperties, DataSource, PlatformTransactionManager

### DB 连接池

SpringBoot 1.x 是 tomcat-jdbc 的连接池（如想用2.x的需排除这个）

2.x 就是 HikariCP (好处: 官方自带, 快! )

ps: Tomcat不是服务器么？  A: Tomcat也有数据库连接池



Druid  好处

+ **监控功能**, 仅仅小的性能开销     
+ SQL 防注入    
+ 数据库密码加密 (yml 配置加密后的就行)
+ 慢查询日志
  - 可以启动时候配置 -Ddruid.stat.logSlowSql=true (默认 3s 也可以设)



> ### 扩展参数配置  TODO Notes
>
> 常用: 命令行参数
>
> <font style="color:rgb(77, 77, 77);">通过</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">java -jar app.jar --name="Spring" --server.port=9090</font><font style="color:rgb(77, 77, 77);">方式来传递参数。</font>
>
> <font style="color:rgb(77, 77, 77);">参数用</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">--xxx=xxx</font><font style="color:rgb(77, 77, 77);">的形式传递。</font>
>
> <font style="color:rgb(77, 77, 77);"></font>
>
> <font style="color:rgb(77, 77, 77);">其实还有 -D </font>
>
> <font style="color:rgb(77, 77, 77);">注意Java系统属性位置</font><font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">java -Dname="isea533" -jar app.jar</font><font style="color:rgb(77, 77, 77);">，可以配置的属性都是一样的，优先级不同。  

</font><font style="color:rgb(77, 77, 77);">两个网址: 很好</font>

>[<font style="color:rgb(77, 77, 77);">https://blog.csdn.net/isea533/article/details/50281151</font>](https://blog.csdn.net/isea533/article/details/50281151)
>
>[<font style="color:rgb(77, 77, 77);">https://blog.51cto.com/u_16213381/7078734</font>](https://blog.51cto.com/u_16213381/7078734)

### 事务抽象

编程式事务 vs 声明式事务 (AOP)



Q: 开始事务好像不需要@EnableTransactionManagement注解，老师里面的代码，我试了一下，去掉这个注解，事务回滚也是生效的。

作者回复: 你不需要添加，是因为Spring Boot自动配置里加上了。如果不在Spring Boot的工程里，你还是需要加的。



补充 SpringBoot 笔记

在@Transactional注解中如果不配置rollbackFor属性,那么事物只会在遇到RuntimeException的时候才会回滚,加上rollbackFor=Exception.class,可以让事物在遇到非运行时异常时也回滚

XD 这一点可以看源码注释! <font style="color:#DF2A3F;background-color:rgb(246, 247, 251);">也就是说如果我 throw 的异常不是 RuntimeException 类型的, 我注解这里就要额外配置一下!!!</font>

<font style="color:#DF2A3F;background-color:rgb(246, 247, 251);"></font>

<font style="color:#DF2A3F;background-color:rgb(246, 247, 251);">Section: 不带事务的方法调用一个带事务的方法    使得事务生效的两种方法: </font>

方法二(TODO RecordNotes): 声明式事务除了用 AopContext 掉外, 还可以 注入调用

```java
    @Autowired
    FooService fooService;

    @Override
    public void invokeInsertThenRollback() throws RollbackException {
//        insertThenRollback();   //这里事务不会生效
//        ((FooService)(AopContext.currentProxy())).insertThenRollback();
        fooService.insertThenRollback();
    }
```

### actuator

> beans 用的多些, 看 bean 有无在, 依赖谁

management.endpoints.web.exposure.include=*  //*可以换成以下值  可多个 ,号隔开

health, beans, info    env



## | O/R Mapping

### JPA vs MyBatis

> JPA是规范，Hibernate是JPA的一种实现，Spring Data JPA可以帮助大家更方便地使用JPA，它底层用了Hibernate。Hibernate替我们做了ORM的工作，简单的场景中，你并不需要手写SQL
>
> MyBatis是另一种ORM的框架, <font style="color:#DF2A3F;background-color:rgb(246, 247, 251);">DBA对SQL能有更大的把控力度</font>，然后大部分工程都用MyBatis，那渐渐规范就变成了用MyBatis。但这并不是说Hibernate不好，其实它作为老牌ORMapping框架，还是很不错的。  


JDBC是各种操作的基础，

>JPA是个规范，
>
>Hibernate是JPA的一种实现，
>
>Spring Data JPA用的是Hibernate，
>
>MyBatis是另一种ORM的框架，
>
>Hibernate不用自己手写SQL，但其实复杂的HQL写到最后跟写SQL也没啥大差别了。
>
>三年前用过JPA，简单SQL还行，复杂的用mybatis更爽，试试就知道啦!

![](https://img-blog.csdnimg.cn/img_convert/e0e7b70a664bec8260b7cfe9d1cdaddb.png)



### MyBatis

**该注解用于 insert 时候, auto_increment 处理**

@Options(useGeneratedKeys = true)

```java
id bigint not null auto_increment,
------------------------------------
@Insert("insert into t_coffee (name, price, create_time, update_time)"
        + "values (#{name}, #{price}, now(), now())")
@Options(useGeneratedKeys = true)     //自增长主键id，在插入数据后自动获取到该主键值
```



**以下处理是金额落库与代码层面的 Mapping **

mybatis.type-handlers-package=geektime.spring.data.mybatisdemo.handler

```java
price bigint not null,
-------------------------
/**
 * 在 Money 与 Long 之间转换的 TypeHandler，处理 CNY 人民币
 */
public class MoneyTypeHandler extends BaseTypeHandler<Money>
```



## | NoSQL

### Redis

> 线上用的比较多的两种部署方式：
>
> + 哨兵
> + 集群
>
> 主要作分布式缓存，不能 A 机器取旧值 B 取新值
>
> 写一次可以读十次 1:10 我们可以考虑放缓存  

启动类 @EnableCaching(proxyTargetClass = true) ，由此可见，我们整个缓存的运行机制是基于 AOP 的  
联想：声明式事务 也是一样基于 AOP

>重要：对 Redis 的操作一定要设置一个过期时间（重要的事情讲三遍的那种）  
>作者回复: 我们一般的用法是把Redis当缓存来用，既然是缓存就要有个失效时间，不然缓存的内容越来越多，内存相对磁盘而言还是很昂贵的。Redis里的数据一旦没了，我们要求有手段能够补偿回来。其实，显示情况也可能是这样的，Redis扛不住压力挂了，背后的DB更扛不住……

#### 哨兵

> 通知、监控、故障迁移、服务发现
>
> Q：所以什么时候用哨兵，什么时候用集群呢？
>
> 作者回复: 如果可以，我建议都用集群模式吧

#### 集群

> 数据自动分片（Hash Slot）

#### redisTemplate VS Repository

> Q：能否再讲讲既然有了redisTemplate,什么情况下需要使用Redis Repository 
>
> 作者回复: 比如，你按ID存了一个数据到Redis里，但又希望能按别的维度来查询时，一种方式就是自己维护二级索引，而RedisRepository可以帮你做这个二级索引，让你根据自己需要来查询。



Q：老师，教程中介绍了Redis多种调用方式，RedisTemplate、RedisRepository、@Cachexxx注解。能介绍一下这几种方式的使用场景吗？碰到什么情况应该使用什么方式？

作者回复: RedisTemplate是万能的，各种情况下都能用，不过是手工操作的；@Cachable用在把某个方法的返回值缓存的情况，可以不用自己写，Spring替你做了，这个就会比较方便。Repository这个就比较少用到，像操作数据库的Repository一样来操作Redis，如果你针对一些数据有二级索引的需求，不妨看看这个，它替你做了主键以外的索引。



## | 数据访问进阶

### AOP

> 官网蛮好看，注意 AOP 是看 SpringFramework 不是 SpringBoot  
> [https://docs.spring.io/spring-framework/reference/core/aop/ataspectj.html](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj.html)

@AspectJ 指的是一种将切面声明为带有注释的常规 Java 类的风格。  
所以带注解的 AOP 都是 AspectJ support

+ @Order 数字越小优先级越高
+ @Aspect 说明这是一个切面类，注意还需 @Componet 修饰这个类成 Bean
+ @Around vs @Pointcut（可复用，Blog 使用的是这种）

```java
//    @Around("execution(* geektime.spring.springbucks.repository..*(..))")
    @Around("repositoryOps()")
    public Object logPerformance(ProceedingJoinPoint pjp)

    @Pointcut("execution(* geektime.spring.springbucks.repository..*(..))")
    private void repositoryOps() {}
```

ps: <font style="color:rgb(0, 0, 153);">execution </font><font style="color:rgb(25, 30, 30);">最常使用切入点指示符，还可以 </font><font style="color:rgb(36, 41, 46);background-color:rgb(246, 248, 250);">bean(idOrNameOfBean) 。具体看</font>[<font style="background-color:rgb(246, 248, 250);">官网</font>](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/pointcuts.html)

### <font style="background-color:rgb(246, 248, 250);">stopwatch</font>

Q: 为什么要用Threadlocal来包装stopwatch呢？

作者回复: 我在执行前后需要使用同一个StopWatch，所以需要有个地方暂存一下，而且每次为请求计时都需要一个不同的StopWatch，不能共用一个，既然是一个线程在处理一个请求，那比较简单的方法就是放在ThreadLocal里。



Q：为什么要在postHandle里start又stop呢

作者回复: 为了分段计时，StopWatch就跟秒表一下，可以记几段时间

### P6Spy

> 为什么需要这么多的日志？  
> 在产线中遇到各种问题的时候，你唯一能够依靠的就是你的日志！
>
> 生产会将日志分类，有针对数据访问层 DAL 的 digest 的日志，专门就是拦截 DAO方法的执行
>
> sql 的执行会放在 sql.log

HikariCP 数据源本身是不支持 log 打印的，可以加一个 P6Spy 来做一个 SQL 的输出（具体还是看文档，有 Integrationg p6Spy catalog）

+ 引入 jar
+ 配置 p6spy 的 driverName，url，username&password
+ 配置 spy.properties 比如单行日志、用SLF4J记录sql、开启慢查询

Druid 本身就有内置 SQL 输出

+ 可以禁用日志输出，自定义一个 Filter 比如对敏感信息的一个脱敏



Q: 老师，请问一下log4j日志的原理和aop日志的原理的区别是什么

作者回复: 你说的是两个完全不同的东西，不是很理解你想问的点。Log4j就是用来打印日志的框架；AOP是用来做面向切面编程的，我们在切面里用日志框架打印了日志。



## | Spring MVC

> 核心：DispatcherServlet，是所有请求的入口。核心组成部分如下：
>
> + Controller
> + xxxResolver
>   - ViewResolver
>   - HandlerExceptionResolver
>   - MultipartResolver
> + HandlerMapping (请求映射处理逻辑)
>
> 这个章节讲解 DispatcherServlet 是怎么处理一个请求的 



@ResponseStatus(HttpStatus.CREATED)

+ 可以指定 response status 的状态码，这里会是 201



### Spring 的应用程序上下文

关于上下文常用的接口及其实现：「先有个印象」

+ BeanFactory（一般不直接使用）
  - DefaltListableBeanFactory
+ ApplicationContext（使用这个）
  - ClassPathXmLApplicationContext
  - FileSystemXmlApplicationContext
  - AnnotationConfigApplicationContext
+ WebApplicationContext



扩展：传统的Spring MVC工程的确是有两个上下文的

+ DispatcherServlet（Servlet WebApplicationContext -> Root WebApplicationContext）



### Spring MVC 请求处理流程（大致）

> Front controller 就是 DispatcherServlet
>
> 1. org.springframework.web.servlet.DispatcherServlet#doService
> 2. this.doDispatch(request, response);
>    1. 处理 handle

![](https://img-blog.csdnimg.cn/img_convert/905612521d1014eb63d9b95af7d37862.png)

扩展：大家可能会在代码当中看到像 render 这样的，大家可能把它称作是渲染（会有争议）  所以在文档当中用 “呈现”  这个词来代表我们的 render



### 如何定义处理方法

看 Cotoller 支持哪些方法参数、返回参数：（文档是个好东西！！！）

[https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/arguments.html](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/arguments.html)



+ PostMapping()
  - Mapping Requiests (xxxMapping 里的参数可以限定请求/响应的 context-Type 类型「consumes / produces = MediaType.xxx」)



### 

## | SpringBoot

Program arguments (CLl arguments to your application. ) 添加 --debug  

就可以看到那些类自动配置上了，可以看 bean ！！！



# TODO-第九章03

这个视频并不是Ant独有学习资料，暂时告一段落以后学完

优先级降低！！！