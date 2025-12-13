---
article: false
---
# [SpringSecurity](https://www.bilibili.com/video/BV1mm4y1X7Hc/?spm_id_from=333.337.search-card.all.click&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)

> 6 h   SpringSecurity + JWT   核心：认证 & 授权
>
> [别人笔记](https://www.yuque.com/huanfqc/springsecurity/springsecurity#WkaHz)
>
> 题外话：ali 的 SpringBoot 启动模板真不错，还带测试Controller+html 
> https://start.aliyun.com/

## 一、铺垫

### 1.介绍

springsecurity是安全框架，准确来说是安全管理框架。相比与另外一个安全框架**Shiro**，springsecurity提供了更丰富的功能，社区资源也比Shiro丰富

springsecurity框架用于Web应用的需要进行`认证`和`授权`

认证：验证当前访问系统的是不是本系统的用户，并且要确认具体是哪个用户

授权：经过认证后判断当前用户是否有权限进行某个操作。认证和授权也是SpringSecurity作为安全框架的核心功能

**认证和授权也是SpringSecurity作为安全框架的核心功能**

### 2.项目流程

1. 搭SpringBoot项目（aliyun 模板好用）

2. 引入 SpringSecurity 依赖
   * 这时进入 localhost:8080 会跳到这个框架会自带一个登陆静态页面！
     会拦截你所有 /* 请求，需要登陆后才能访问到
   * `username`：user，`password`：idea控制台有  登陆了才能访问到　

ps: 除了拦截所有请求到登陆页面，也有 https://localhost:8080/logout 登出 API

### 3.流程图

springsecurity的权限管理，是先授权后认证，所以我们先学习认证这一部分

流程图如下，注意下图的jwt指的是 `json web token`，jwt是登录校验的时候用的技术，可以根据指定的算法进行信息的加密和解密

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/1689586875709-6eb3d7ed-ee86-4245-9b5f-5bbe49b7144b.jpg)

##### 需要调整的点：默认帮我们实现很多东西，我们需要定制改

1. 登陆界面得换成系统的，肯定不能用 SpringSecutiry 默认的了
2. 账号密码不能用默认的，得和真实 user 表关联
3. 前后端不分离好像用的是后端的 Session 存的Tonken，分离的话肯定不能这样。

### 4.springsecurity原理

SpringSecurity的原理其实就是一个过滤器链(10+)，内部包含了提供各种功能的过滤器。例如快速入门案例里面使用到的三种过滤器，如下图

监听器 -> 过滤器链 -> dispatcherservlet(前置拦截器 -> mapperHandle -> 后置拦截器 -> 最终拦截器)

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/1689586875966-f65f8796-6a23-4978-bfe1-ee7bc9eb3f8c.jpg)

一、UsernamePasswordAuthenticationFilter: 负责处理我们在登陆页面填写了用户名密码后的登陆请求。入门案例的认证工作主要有它负责

二、ExceptionTranslationFilter：处理过滤器链中抛出的任何AccessDeniedException和AuthenticationException

三、FilterSecurityInterceptor：负责权限校验的过滤器

`注意上图，橙色部分表示认证，黄色部分表示异常处理，红色部分表示授权`



## 二、认证

> 需要结合上面的 `流程图 & 原理` 部分看

### 1.认证流程图（橙色部分）

`UsernamePasswordAuthenticationFilter`
`UserDetailsService`

我们来详细学一下上面 '1. springsecurity原理' 的橙色部分，也就是认证那部分的知识

1. Authentication接口: 它的实现类，表示当前访问系统的用户，封装了用户相关信息
2. AuthenticationManager接口：定义了认证Authentication的方法
3. UserDetailsService接口：加载用户特定数据的核心接口。里面定义了一个根据用户名查询用户信息的方法
4. UserDetails接口：提供核心用户信息。通过UserDetailsService根据用户名获取处理的用户信息要封装成UserDetails对象返回。然后将这些信息封装到Authentication对象中

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/1689586876374-c2b3efaa-da08-48b1-85b9-f862639ddf9d.jpg)

<center>认证流程图（!important）</center>

ps: 第 10 步好像是通过 ThreadLocal 存给红色授权过滤器拿信息



### 2.思路分析

`第一步和第四步换成自己的代码：`

「4」对应流程图调整点 2，需要重写该类从数据库去对比认证

「1」对应流程图调整点 1、3，第 10 步校验通过反 Token。用户提交账号密码时候提交到我们自己的 Controller，后续流程依旧是掉系统的【重点】

引入 `Redis`、`JWT` 依赖（不用对 JWT 有太过深入的了解，基本调用工具类就可以了！！！）

#### - 后端：

![image-20231222154855650](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/image-20231222154855650.png)

#### - 前端：

![image-20231222155309514](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/image-20231222155309514.png)



### 3.认证实现-UserDetailsService

> 重写流程图-第四个类    认证登陆接口的账号、密码的后台默认实现改为落库查询

被security拦截业务接口，出现登录页面之后，我们需要通过输入数据库里的用户和密码来登录，而不是使用security默认的用户和密码进行登录

思路: 只需要新建一个实现类，在这个实现类里面实现Security官方的UserDetailsService接口，然后重写里面的loadUserByUsername方法

注意: 重写好loadUserByUsername方法之后，我们需要把拿到 '数据库与用户输入的数据' 进行比对的结果，也就是user对象这个结果封装成能被 'Security官方的UserDetailsService接口' 接收的类型。所以可以自定义的 JavaBean 类去继承官方的 `UserDetails` 类对象

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserMapper userMapper;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName,username);

        User user = userMapper.selectOne(wrapper);
        if (Objects.isNull(user)) {
            throw new RuntimeException("用户名密码错误！");
        }
        //TODO 根据用户查询权限信息 添加到Loginuser中
        return new LoginUser(user);
    }
}

----------------------------
  
public class LoginUser implements UserDetails{
  private User xxuser;
  @Override
  //用于获取用户密码。由于使用的实体类是User，所以获取的是数据库的用户密码
  public String getPassword() {
      return xxuser.getPassword();
  }
  ...
}
```



#### 3.1.密码加密校验问题

**注意：如果要测试，需要往用户表中写入用户数据，并且如果你想让用户的密码是明文存储，需要在密码前加｛noop｝。**
Username：Admin，Password：{noop}123456

不然 Error: `There is no PasswordEncoder mapped for the id "null"`

具体为什么会这样，看流程图 7.

^^^

实际项目中我们不会把密码明文存储在数据库中。

默认使用的PasswordEncoder要求数据库中的密码格式为：｛id};password。它会根据id去判断密码的加密方式。但是我们一般不会采用这种方式。所以就需要替換PasswordEncoder。

我们一般使用SpringSecurity为我们提供的BCryptPasswordEncoder。

**我们只需要使用把BCryptPasswordEncoder对象注入Spring容器中，SpringSecurity就会使用该PasswordEncoder来进行密码校验**。我们可以定义一个SpringSecurity的配置类，SpringSecurity要求这个配置类要继承WebSecurityConfigurerAdapter。



默认密码加密器是一个工厂方法创建的，包含了多个加密类型，所以需要用{加密类型id}区分，自己创建bean就不需要了



> 疑问：1）必须实现Security提供的WebSecurityConfigurerAdapter类，2）并提供一个PasswordEncoder.class类型Bean到Spring容器才能修改SpringSecurity的默认密码规则吗
>
> 为什么需要实现WebSecurityConfigurerAdapter才能替换PasswordEncoder Bean，我直接提供一个PasswordEncoder Bean到Spring容器不行吗
>
> 
>
> A: 实际上，你可以直接提供一个 `PasswordEncoder` Bean 到 Spring 容器中，而无需实现 `WebSecurityConfigurerAdapter` 类。
>
> 在 Spring Security 中，`WebSecurityConfigurerAdapter` 是一个方便的基类，用于配置和自定义安全相关的设置。但它不是必需的，特别是当你只想替换 `PasswordEncoder` Bean 时。

```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        // 返回自定义的 PasswordEncoder Bean
        return new MyPasswordEncoder();
    }
    // 其他配置...
}
```



ps: 

1）这个 Title 只需这一处代码即可解决，此时登陆校验数据库密码就会根据指定的 PasswordEncoder 去解密校验

2）BCryptPasswordEncoder  使用

![img](https://cdn.nlark.com/yuque/0/2023/jpg/35597420/1689586878080-d2e1f168-a4c4-4ff7-8e53-a7bc7dfb1788.jpg?x-oss-process=image%2Finterlace%2C1)

<center>BCryptPasswordEncoder.class 随机加盐（即每次 encode 都会不一样，，，，，不可逆）</center>





### 4.登陆接口-xxx（JWT）

> 重写流程图-第一个类，自定义登录接口实现这个功能需要使用到jwt
> 用到上面 3.认证 后台实现落库查Form

jwt不叫加密，是编码和摘要

jwt里面会有一个特有的秘钥 这个秘钥是用户自己设定的 会保存到token里面 校验时会根据这个秘钥校验（jwtUtil 两个方法一个create 一个parse 创建的时候有过期时间的，parse时候会解析这个 token String是否过期！）



XD：

1. `SecurityConfig` 放开 `/user/login` 的访问，自己去写登陆接口
2. `authenticationManager.authenticate(UsernamePasswordAuthenticationToken.class);` 来校验当前 Form 表单用户信息
3. 成功给 Token。。。存 Redis



### 5.校验其他接口-定义jwt认证过滤器

> 配置只放开了登录接口，其他接口全到这个过滤器来。有 Token 遍走 Redis 拿用户信息放 `SecurityContextHolder` 里即可！
>
> 个人对这里jwt作用理解：  区分概念  **登陆接口 vs  其他接口** 
> 先登陆有了 Token 其他接口携带此 Token 进行访问是否 403
>
> 1. TTL（jwt Token字符串解析会判断有无过期，不关注原理只要只要jwt能做就行）
> 2. 有 Token 代表用户已经登陆过
>    解析 Token 得到 id
>    通过 id 去 Redis 拿用户信息比如 username 
>    设置SpringSecurity的UsernamePasswordAuthenticationToken
>
> ps：相当于登陆接口只会一次查库，其他接口都是走的 Token

对4.登陆实现的延续

[SpringSecurity过滤器链-图](#4.springsecurity原理)  结合这个图，这个过滤器应该放在第一个粉色的块（即 `UsernamePasswordAuthenticationFilter` 前面！）

```java
//把token校验过滤器添加到过滤器链中
//第一个参数是上面注入的我们在filter目录写好的类，第二个参数表示你想添加到哪个过滤器之前
http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
```



> > `SecurityContextHolder.getContext().setAuthentication(authenticationToken);` 图片过滤链会用这个取上下文登陆信息, 即访问其他接口会判断你这里存的用户信息有没有
>
>
> 上面我们实现登录接口的时，当某个用户登录之后，该用户就会有一个token值，我们可以通过认证过滤器，由于有token值，并且token值认证通过，也就是证明是这个用户的token值，那么该用户访问我们的业务接口时，就不会被Security拦截。简单理解作用就是登录过的用户可以访问我们的业务接口，拿到对应的资源

1. 获取token
2. 解析token获取其中的userid
3. 从redis中获取用户信息
4. 存入SecurityContextHolder



我的理解是jwt不可能放全量的用户信息，要么查数据库，要么查缓存



Q: 为什么之前视频里UsernamePasswordAuthenticationToken存的是username和password，而这里存的是loginUser和null？

一个是登录，一个是验证两个场景，不要混在一起看
因为这里封装的是已经认证过的了。这里应该是只要验证这个用户有无 Token 有 Token 肯定就是验证过密码的可以直接放行的只关心 id



Q：那为什么不只放 ID

我也只放了 ID 也行



### 6.退出登录

> XD: 感觉 Token 也只是为了拿 ID，然后数据有无还得看 Redis，例如下面注销登录就是删 Redis 就行了
>
> 我们怎么退出登录呢，也就是让某个用户的登录状态消失，也就是让token失效 ?
>
> 实现起来也比较简单，只需要定义一个登陆接口，然后获取SecurityContextHolder中的认证信息，删除redis中对应的数据即可



## 三、授权

> 相当于只是在认证的基础上，jwt认证过滤器上 set 上权限的 List

### 1.实现

在SpringSecurity中，会使用默认的FilterSecurityInterceptor来进行权限校验。在FilterSecurityInterceptor中会从SecurityContextHolder获取其中的Authentication，然后获取其中的权限信息。当前用户是否拥有访问当前资源所需的权限

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/1689586875966-f65f8796-6a23-4978-bfe1-ee7bc9eb3f8c.jpg)

<center>认证过滤器-可理解为第一个粉块</center>

所以我们在项目中只需要把当前登录用户的权限信息也存入Authentication，然后设置我们的资源所需要的权限即可



使用：

1. 启动类 `@EnableGlobalMethodSecurity(prePostEnabled = true)`
2. Controller URL_API Method `@RequestMapping("/hello")`
   `@PreAuthorize("hasAnyAuthority('test')")` //有test权限才能访问指定接口



实现：

1. 查库的时候 User JavaBean 权限属性 set 进去
2. 认证过滤器 set 到 `SecurityContextHolder`

### 2.RBAC权限模型

RBAC权限模型 (Role-Based Access Control) ，是权限系统用到的经典模型，基于角色的权限控制。该模型由以下五个主要组成部分构成:

一、用户: 在系统中代表具体个体的实体，可以是人员、程序或其他实体。用户需要访问系统资源

二、角色: 角色是权限的集合，用于定义一组相似权限的集合。角色可以被赋予给用户，从而授予用户相应的权限

三、权限: 权限表示系统中具体的操作或功能，例如读取、写入、执行等。每个权限定义了对系统资源的访问规则

四、用户-角色映射: 用户-角色映射用于表示用户与角色之间的关系。通过为用户分配适当的角色，用户可以获得与角色相关联的权限

五、角色-权限映射: 角色-权限映射表示角色与权限之间的关系。每个角色都被分配了一组权限，这些权限决定了角色可执行的操作



## 四、自定义异常处理

上面的我们学习了 '认证' 和 '授权'，实现了基本的权限管理，然后也学习了从数据库获取授权的 '授权-RBAC权限模型'，实现了从数据库获取用户具备的权限字符串。到此，我们完整地实现了权限管理的功能。

但是，当认证或授权出现报错时，我们希望响应回来的json数据有实体类的code、msg、data这三个字段，怎么实现呢

我们需要学习Spring Security的异常处理机制，就可以在认证失败或者是授权失败的情况下也能和我们的接口一样返回相同结构的json，这样可以让前端能对响应进行统一的处理

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/1689586875966-f65f8796-6a23-4978-bfe1-ee7bc9eb3f8c.jpg)

在SpringSecurity中，如果我们在认证或者授权的过程中出现了异常会被ExceptionTranslationFilter捕获到，如上图。在ExceptionTranslationFilter中会去判断是认证失败还是授权失败出现的异常，其中有如下两种情况

一、如果是`认证过程中`出现的异常会被封装成AuthenticationException然后调用AuthenticationEntryPoint对象的方法去进行异常处理。

二、如果是`授权过程中`出现的异常会被封装成AccessDeniedException然后调用AccessDeniedHandler对象的方法去进行异常处理。

总结: **如果我们需要自定义异常处理，我们只需要创建AuthenticationEntryPoint和AccessDeniedHandler的实现类对象，然后配置给SpringSecurity即可**





## 五、其他

### 1.一些其他的过滤器

'登录成功的处理器' AuthenticationSuccessHandler

failureHandler表示 '登录认证失败的处理器'

LogoutSuccessHandlerr '登出成功的处理器'

这三个处理器，然后在config再一配就行



### 2.以前没这么用过，postman测

由于 `HttpServletRequest` 和 `HttpServletResponse` 对象是局部对象，它们的作用域仅限于当前请求的处理过程中。一旦请求处理完成，这些对象将被销毁。

需要注意的是，虽然 `HttpServletRequest` 和 `HttpServletResponse` 对象是局部的，但您可以在Servlet中将它们传递给其他方法或对象，以便在请求处理过程中共享和操作它们的内容。

```java
 //WebUtils是我们在utils目录写好的类
 WebUtils.renderString(response,json);

----------------------

public static String renderString(HttpServletResponse response, String string) {
    try{
        response.setStatus(200);
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.getWriter().print(string);
    }
    catch (IOException e){
        e.printStackTrace();
    }
    return null;
}
```

