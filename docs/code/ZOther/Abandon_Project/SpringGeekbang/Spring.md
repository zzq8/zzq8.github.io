---
article: false
---
# [玩转 Spring 全家桶](https://time.geekbang.org/course/intro/100023501)

> 进 title link 看课程目录、课程介绍

平板问题：

springboot datasource自动装配mysql数据源。。h2为什么不用配数据源





> 项目需要有自己的parel如何处置springboot的parent

spring-boot-dependencies 放到 \<denpendencyManagement>

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202302231452941.png" alt="image-20230223145242628" style="zoom: 25%;" />





> CommandLineRunner 接口的作用

CommandLineRunner 接口是 Spring Boot 中的一个接口，用于在应用启动后执行一些特定的任务。该接口只有一个方法 run()，当 Spring Boot 应用启动完成后，会自动执行 run() 方法。CommandLineRunner 接口常用于执行一些初始化任务，例如读取配置文件、初始化数据等。**与之类似的还有另一个接口 ApplicationRunner**，不同之处在于它的 run() 方法接收的参数是一个 ApplicationArguments 对象，该对象封装了命令行参数的信息。通常情况下，我们可以通过实现 CommandLineRunner 或 ApplicationRunner 接口，在 Spring Boot 应用启动后自动执行一些初始化任务。



> h2数据库为什么不需要配置

嵌入式数据库：H2数据库是一款嵌入式数据库，也就是说它可以被嵌入到Java应用程序中，作为Java程序的一个库。因此，H2数据库不需要独立的服务器进程，不需要额外的配置和管理，只需要在Java应用程序中进行简单的配置即可使用。









# 配置多个数据源

> 图片很清楚了

我理解：重写三个bean   

1. DataSourceProperties     这样即可在configuration配置我的数据源，区分开其他的加前缀
2. DataSource  通过上者的 API Create 数据源，大致就是initializeDataSourceBuilder方法通过 ClassLoader 拿 driverClassName 创建
3. PlatformTransactionManager    每个数据库都要设好自己对应的事务管理器

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202302231721768.png" alt="image-20230223172146262" style="zoom: 25%;" />