---
article: false
---
# 尚上优选

> 41h/3=14   2_week    尚上优选类似多多买菜、美团优选    230910 END+++   Fighting？
>
> 依托社区和团长社交关系实现生鲜商品流通的新零售模式

# 一、准备-配置

### 1.knife4j

> knife4j > swagger2 里面有它的jar是它的增强版

@Bean return Docket.class 这样是为了分组    例如后台系统一个，用户前台一个

```java
	//具体怎么配置Goolge就好
	@Bean
    public Docket webApiConfig()
    
    @Bean
    public Docket adminApiConfig()
```

访问Knife4j的文档地址：**http://ip:port/doc.html**即可查看文档

初印象：好用 内容很详细。。**重点还能调试模拟PostMan发请求！！！**

### 2.Module

VO包下的类一般封装查询条件，比如JD想检索商品 即可把所有检索点放VO实体类

### 3.Node.js

> Node.js是一个事件驱动I/O服务端JavaScript环境，基于Google的V8引擎，V8引擎执行Javascript的速度非常快，性能非常好。`简单的说 Node.js 就是运行在服务端的 JavaScript`

### 4.VSCode

vs新建工作区 -> 将当前保存为工作区会有一个xxx.code-workspace的文件。。。类似java的父目录，下面就可以新建各种 Module
项目是放在工作区中运行，可以一个正式项目  一个test项目



权限

整合 spring security 可以弄。但这里不整了就简单弄基础功能



# 二、代码学习

## 1.MP 框架API(Get It)

==这里已经挪到 lambda 笔记中==

MP中有Lambda的Wrapper（为了避免了字段硬编码和拼写错误的问题，即使用普通QueryWrapper的缺陷）

> 对于 `QueryWrapper` 类的 `like` 方法，它不支持使用 Lambda 表达式作为参数。只有 `LambdaQueryWrapper` 类支持使用 Lambda 表达式。
>
> 在 `LambdaQueryWrapper` 中，我们可以使用 `Role::getRoleName` 来指定查询条件的字段。而在 `QueryWrapper` 中，我们需要使用字符串 `"role_name"` 来指定数据库表中的字段名。
>
>
> ==TODO 搞不懂这里的第一个参数的Lambda为什么拿的是@TableField("role_name")的值==

```java
//创建条件构造器对象
LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();

//TODO 搞不懂这里的第一个参数的Lambda为什么拿的是@TableField("role_name")的值   private String roleName;
wrapper.like(Role::getRoleName,roleName);
```

😡TODO：这两个类的`like` 方法是通过继承父类 `AbstractWrapper` 来获得，具体在这两个类中也没看到重写，不清楚怎么弄的？？？
ctrl+p方法签名里面有AnnotationFunction，但是实际点击源码看没看到（ctrl+左键看不到！）

既然这两个类都是通过继承父类AbstractWrapper获得的like方法，那么父类怎么区分这两个类分别给他们各自的like实现



这种差异是因为 `LambdaQueryWrapper` 类在设计时针对 Lambda 表达式进行了特殊处理，以提供更加便捷的语法。而 `QueryWrapper` 类则是基于传统的字符串字段名的方式。

![image-20230902215155311](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/image-20230902215155311.png)





