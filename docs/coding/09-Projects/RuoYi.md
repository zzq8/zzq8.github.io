---
article: false
---
# RuoYi-Vue

> 该项目没用 MP，整完这个可以再整 [RuoYi-Cloud](https://doc.ruoyi.vip/ruoyi-cloud/)
>
> 基于SpringBoot、Spring Security、Jwt、Vue的前后端分离的后台管理系统   【权限管理系统】
>
> 楠哥的太浅了，粗略过了一遍
> 现在在过 [王清江](https://www.bilibili.com/video/BV1zm4y1A7yQ?p=7&spm_id_from=pageDriver&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0) 的  约等于 26 h   26/3=9          哪些点想看就可以看他[公众号的讲义](https://mp.weixin.qq.com/mp/appmsgalbum?search_click_id=4558257005716448117-1704794396839-8017893460&__biz=Mzg5OTgxOTg0Ng==&action=getalbum&album_id=2441331662295973890#wechat_redirect)

## 1.验证码

> 本来想重写 Controller 了解验证码 IO 流的形式的～

验证码生成使用了google kaptcha的验证码组件，没有重复造轮子

```java
@Resource(name = "captchaProducerMath")
private Producer captchaProducerMath;


// 核心方法 --> 返回一个数学表达式类似于： 5-1=?@4
// 这里的验证码生成使用了google kaptcha的验证码组件，没有重复造轮子，具体的生成逻辑作者重写了
// 这里生成表达式的方法（重写）在 com.ruoyi.framework.config包下的KaptchaTextCreator验证码文本生成器类			
String capText = captchaProducerMath.createText();


-----------------------------
Producer 接口下就两个方法
   * BufferedImage createImage(String var1);      //9-8=?@1
   * String createText();    //BufferedImage.class  一张图！
```



### 1.1.Redis 处理

Redis 写入两个内容：

1. `sys_config:sys.account.captchaEnabled`

   * configService.selectCaptchaEnabled();  // XD：这里是否开启状态也会写入 Redis

   * ```xml
     <select id="selectConfig" parameterType="SysConfig" resultMap="SysConfigResult">
         -- XD: 学到一招，相当于字符串拼接   fragment   
         <include refid="selectConfigVo"/>
         <include refid="sqlwhereSearch"/>
     </select>
     ```

     

2. `captcha_codes:e67884e45c464d418284441ab707b7b6` 

   * 验证码 `1+1=?@2` 答案 2 会写入 Redis， 1+1=? 会以流的形式转成图片给前端    【问题：登录的时候怎么把答案的key再带回给后端？   获取验证码的时候顺便把uuid也给了前端    前端Vue data部分直接给值！看 [1.2.前端](#1.2.前端) 代码块】  这个点谷粒商城雷神好像是直接用个隐藏的input实现的，这里直接就 vue data() 部分有个 uuid 直接赋值



### 1.2.前端

> 一套流程都是从前端发起，不搞懂前端运转就会 **不明不白**
>
> 拿验证码请求举例：`login.vue（getCodeImg方法封装到login.js） -> login.js(request同理) -> request.js` 之所以这样跳，是因为封装了

```js
data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
      ......
    };
  },


getCode() {
    getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
            this.codeUrl = "data:image/gif;base64," + res.img;
            this.loginForm.uuid = res.uuid;     //存在Vue的data里面的
        }
    });
}
```



#### 1.2.1.Vue baseURL

> ```js
> // 创建axios实例
> const service = axios.create({
>   // axios中请求配置有baseURL选项，表示请求URL公共部分   【XD:这个很重要，所有URL Request前面加的一层的公共前缀】
>   baseURL: process.env.VUE_APP_BASE_API,
>   // 超时
>   timeout: 10000
> })
> ```
>
> .env.production 文件：`VUE_APP_BASE_API = '/dev-api'`
>
> 导致所有请求都会带上 http://localhost**/dev-api**/captchaImage

##### 问题一：.env.development

> Q: 为什么用的是   .env.development   文件的配置呢？

A: 您使用`npm run dev`命令启动开发服务器时，Vue.js会自动加载`.env.development`文件的配置，并将其中定义的环境变量应用于开发环境。您无需手动判断使用哪个配置文件，Vue.js会自动处理这些细节。



##### 问题二：vue.config.js -> proxy

标准的：配置反向代理服务器

> Q: http://localhost/dev-api/captchaImage    前端80，后端8080    这里没看到端口，Vue获取图片是请求的前端还是后端？

URL 请求前端，通过**反向代理**映射到后端      为什么呢？  -> 巧妙解决跨域问题，这里没用 Nginx

当然解决跨域也可以在后端处理，这不过这里前端处理掉了



##### 仍然疑惑：

那前端逻辑处理还不是要走  8080 要跨域，为什么F12调试地址栏不出来      这里不就又跨域了吗？  还不是从80到8080请求

```js
proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8080`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
```

配置 proxy 理解相当于平替了一下 Nginx 充当了一会代理服务器。但是真实环境更推荐使用 Nginx（专业） 



> Q: 这段代码能够处理跨域问题是因为它通过配置代理将请求转发到指定的目标URL。

在开发环境中，默认情况下，前端应用运行在一个开发服务器上，而后端 API 通常运行在另一个服务器上，两者的域名或端口不同，因此会涉及到跨域请求。

**通过配置代理，将前端应用发送的请求转发到目标URL，就可以绕过浏览器的同源策略，实现跨域请求**



> Q: 所以vue配置了proxy相当于部分替代了nginx的功能？相当于一个代理帮你去请求了8080的后端服务

**是的，配置Vue的代理相当于在开发环境下使用一个轻量级的代理服务器，帮助前端应用将请求转发到后端服务。这种代理功能可以部分替代Nginx等反向代理服务器的功能。**

通过Vue的代理配置，前端应用可以直接发送请求到代理服务器（一般默认为开发服务器的端口，比如80端口），然后代理服务器会将这些请求转发到后端服务（比如8080端口）上。

代理服务器会处理跨域请求，并在转发请求时修改请求头等信息，确保请求能够成功到达后端服务，并将后端服务的响应返回给前端应用。

这种代理配置的好处是，在开发环境下，前端开发人员可以直接通过代理服务器与后端服务进行交互，无需担心跨域问题，简化了开发过程。

**然而，需要注意的是，==Vue的代理只在开发环境下起作用==，用于方便地进行开发和调试。在生产环境中，应该使用真正的反向代理服务器（如Nginx）来处理前后端的请求转发和跨域问题。**

【因为：然而，在生产环境中，Vue的代理配置不会生效。在生产环境中，前端应用通常会经过打包构建，生成静态文件，然后部署到一个独立的Web服务器（如Nginx、Apache等）上。这时候，前端应用和后端API处于不同的域名或端口，需要使用真正的反向代理服务器来处理请求转发和跨域问题。】
所以：感觉还是能用的只要在一台服务器上还是保持这种情况



> Q: vue生产环境我也想配置proxy解决代理可以吗

XD: 应该是行的，只是不推荐

在Vue的生产环境中，配置代理（proxy）并不是一个常见或推荐的做法。Vue的代理配置主要是为了在开发环境下方便调试和解决跨域问题。

在生产环境中，建议使用适当的反向代理服务器（如Nginx）来处理前端应用和后端服务之间的请求转发和代理。反向代理服务器可以提供更强大和灵活的功能，同时具有更高的性能和稳定性。



## 2.登陆

后端逻辑三步：

1. 校验验证码
2. 校验密码
3. 生成 Token 给前端（TODO 作用）

使用异步任务管理器，结合线程池，实现了异步的操作日志记录，和业务逻辑实现异步解耦合。
XD: `ScheduledThreadPoolExecutor`



三个 XHR：

1. http://localhost:1024/dev-api/login
2. getInfo (前端每一个页面跳转都要执行，在全局路由实现)
   * 获取当前用户的角色和权限信息，存储到 Vuex 中
     * vuex：Vue提供的状态管理工具，用于统一管理我们项目中各种数据的交互和重用，存储我们需要用到数据对象。
3. getRouters
   * 菜单 Entry 信息
   * recursionFn 递归实现，parentID 控制父子关系形成好树状结构





### 日志

AsyncFactory.class 发现使用 API 方式获取 Bean

```java
/**
 * XD：这里是因为本类只是个工具类，没有加 @Component 托管到 Spring    所以用这种 API 方式获取 Bean
 * 使用 SpringUtils.getBean(ISysLogininforService.class) 可以在任何地方手动获取 Bean 对象，不受 Spring 容器的控制。
 * 而 @Autowired 注解需要在受 Spring 管理的类中使用，由 Spring 容器负责注入依赖。
 */
// 插入数据  
SpringUtils.getBean(ISysLogininforService.class).insertLogininfor(logininfor);
```







## 3.用户管理

> 菜单栏的东西大体都一样的，分析了这一个其他都差不多
> 这里system/user 有 list & tree 两个数据要获取
>
> http://localhost:1024/dev-api/system/user/list?pageNum=1&pageSize=10

### 3.1.List-centerPanel

这里的 pageNum & pageSize 是通过工具类 ServletUtils 原生方式获取的：

```java
getRequestAttributes().getRequest().getParameter(name);
------
pageDomain.setPageNum(Convert.toInt(ServletUtils.getParameter(PAGE_NUM), 1));
pageDomain.setPageSize(Convert.toInt(ServletUtils.getParameter(PAGE_SIZE), 10));
```





### 3.2.Tree-LeftPanel

同路由菜单一样 recursionFn 递归







### PS：PageHelper

分页数据使用的是：Mybatis + PageHelper

`PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);`

setReasonable 修正参数的作用：

PageHelper 中的 reasonable 对参数进行逻辑处理，保证参数的正确性，

pageNum = 0/-1, 就修正为 pageNum = 1



CURD-URD 略。。





## 4.强退

> 在 Boke 有些系统也有这个功能，这里也有感兴趣学一下

1. 删 Redis 用户信息根据token key删（简单删除就行）
2. 每个请求会经过过滤器进行权限校验 token 





## [5.限流](https://mp.weixin.qq.com/s/g-aB24n31pZuGPSgqrsqCA)

分为 全局限流 vs ip限流             

> `RateLimiterAspect.class           RateLimiter`
>
> 用的 Redis 记录次数以及 TTL 
> 底层使用的是 AOP 明面是一个注解加到置顶 API 限流

service：`lua` 对redis 执行 incr，自增到注解指定的 100 时候就不自增直接 return



限流部分代码：

```java
@Aspect
@Component
public class RateLimiterAspect{
    @Before("@annotation(rateLimiter)")
    public void doBefore(JoinPoint point, RateLimiter rateLimiter)
```

JoinPoint point    这个类可以获取 AOP 前置通知（Before Advice）注解标注的类名及其方法名当Redis的key

Redis Key：  `rate_limit:com.ruoyi.web.controller.system.SysUserController-list`

```java
MethodSignature signature = (MethodSignature) point.getSignature();
Method method = signature.getMethod();
Class<?> targetClass = method.getDeclaringClass();
stringBuffer.append(targetClass.getName()).append("-").append(method.getName());
return stringBuffer.toString();
```





## 5.定时任务

主要迷惑前端页面配置好到数据库，后端quartz具体怎么执行的



1. 项目启动的时候就会执行数据库已有的：通过 `@PostConstruct` 注解 轮询库然后 createScheduleJob
2. 新增则 ScheduleUtils.*createScheduleJob*(scheduler, job);



## 6.[防止重复提交过滤](https://mp.weixin.qq.com/s?__biz=Mzg5OTgxOTg0Ng==&mid=2247484003&idx=1&sn=0524c11d551a34866bb31148ff0d199a&chksm=c04c324af73bbb5c9861aa31289d5545fb3b5a1984932926b0010fa263c2ded7006b539e5972&scene=178&cur_album_id=2441331662295973890#rd)

##### 前端：

前端可以针对同一个按钮进行拦截，在 request.js 中有   **request拦截器**  （如果请求数据和请求URL和**最近一次**请求一致，并且请求间隔小于1000ms，就进行请求拦截，直接拒绝当前请求。）



##### 后端：

从我上面的描述，发现了一个bug，总有手快的人，喜欢点A按钮，然后立刻点B按钮，然后又立刻点A按钮。那么对于A按钮是重复提交了，但是又不满足前端判断重复请求的条件，于是重复请求进入了后端，这时候就需要后端再次校验，是不是重复请求。

* 防止重复提交拦截器, 获取注解类不为空即判断（看下）
* *判断请求**url**和数据是否和上一次相同，*    借助 Redis 存 「唯一标识（指定key + url + 消息头『${token.header}』）:values」  `compareParams(nowDataMap, preDataMap) && compareTime(nowDataMap, preDataMap, annotation.interval())`
* 经过debug发现后端判断重复逻辑和前端其实差不多。**难点在于如何确定同一个人的同一个请求，ry使用的url+token的方式**，确定同一个人同一个请求。



## [7.@Anonymous](https://mp.weixin.qq.com/s?__biz=Mzg5OTgxOTg0Ng==&mid=2247483889&idx=1&sn=d0b4e57c288e0bf0667bd5b2d05003e7&chksm=c04c31d8f73bb8ce03437c29224397393c2c19460f261a628b851970be2f92e16112a81ecadb&scene=178&cur_album_id=2441331662295973890#rd)

> 自定义注解，配合SpringSecurity实现注解地方放行访问     .antMatchers("/actuator/*").permitAll()   “?”里是注解过的地方

1. `PermitAllUrlProperties.class` 注解解释器项目启动的时候遍历所有 URL 方法和对应类有没有加这个注解，整成一个 List 暴露到@Configuration容器
2. SecurityConfig 配置类中遍历上面类暴露到 List 迭代允许 `permitAllUrl.getUrls().forEach(url -> registry.antMatchers(url).permitAll());`



### Tips:注解

我们一般知道，注解是给程序看的，给机器看的，当然也是给程序员看的。注解如果没有==注解解析器==（注解处理器，注解解释器），那么注解就没有什么作用。所以@Anonyous一定是在某个地方被干嘛干嘛了！

上三个都是有注解的搭配着注解解析器实现相应功能，限流、定时任务、防重



## 8.Token过期问题

> 杭州面试问到这个，全是针对项目的技术栈在问！！！

若依是支持token续期的，具体续期的代码在TokenService类下的verifyToken()方法中，默认是不到20分钟就进行续期，但是必须发生请求才行，可以通过

更改MILLIS_MINUTE_TEN修改续期判断的剩余时间。按理说只要一直都在发生请求的话是不会出现token过期的情况的。



在Ruoyi开源项目中，对于令牌续期（Token Renewal）问题的处理通常如下：

1. 刷新令牌（Refresh Token）：Ruoyi使用JWT（JSON Web Token）进行身份验证和授权。JWT令牌包含了用户的身份信息和权限，并设置了一个有效期。当令牌即将过期时，可以使用刷新令牌来获取新的访问令牌，而无需重新进行用户身份验证。
2. 拦截器处理：Ruoyi使用拦截器（Interceptor）来对请求进行拦截和处理。在拦截器中，会检查JWT令牌的有效性和过期时间。如果令牌即将过期，拦截器会执行刷新令牌的逻辑，获取新的令牌并将其返回给客户端。客户端可以使用新的令牌继续进行后续请求。
3. 过期错误处理：如果令牌已经过期，拦截器会捕获到过期错误，并返回相应的错误响应给客户端。客户端可以根据错误响应中的提示信息，重新进行用户身份验证或刷新令牌操作。
4. 刷新令牌接口：Ruoyi通常会提供一个刷新令牌的接口，用于客户端发送刷新令牌的请求。该接口会根据刷新令牌的有效性，颁发一个新的访问令牌，并返回给客户端。客户端可以使用新的访问令牌继续进行后续请求。



`刷新令牌的拦截器通常是通过Spring Security框架的拦截器实现的 `    GPT:

```java
public class JwtTokenRefreshFilter extends OncePerRequestFilter {
  
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    // 检查请求中是否携带有效的JWT令牌
    
    // 验证JWT令牌的有效性和过期时间
    
    // 如果令牌即将过期，执行刷新令牌的操作
    
    // 将新的令牌添加到响应头中
    
    // 继续执行过滤器链，处理后续请求
  }
  
}
```

