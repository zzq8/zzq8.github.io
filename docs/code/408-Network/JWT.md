# JWT

> Token 续期问题面试杭州问过 长沙那个也问过！！！        个人认为是频繁点
>

## 项目实现

### RuoYi

感觉跟直接用最简单方式 UUID 存 Redis 一样的做法！！！

我感觉这里 JWT 都有点多余，顶多是看上去更安全？？？？（我感觉是单体项目其实完全可 Session 解决，这里用 Token 避免分布式共享?其实UUID也行？）

感觉RuoYi是只用Redis ttl实现的， Token的作用像是只充当了个UUID和Redis关联

> 个人总结：
>
> * axios配置请求、响应拦截器
> * 前端 Session 存JWT解析数据为 UUID，   后端 Redis 对应这个 UUID 有 User 数据 
> * 靠 Redis 驱动，Redis 一过期就返回 401，前端响应拦截器就删 Session 重定向到 login.html
>
> #### # 前端存 Session 不过期
>
> 解密后的数据只有 **HEADER**  "alg": "HS512"  &  **PAYLOAD**  "login_user_key": "a667e3f6-5af2-4799-83d6-5c871507df08"
>
> 
>
> #### # 后端存 Redis 通过login_user_key对应，存用户信息 LoginUser.class
>
> 后端如果redis过期，则返回状态 401
>
> 
> 
>
>
> 核心方法：`com.ruoyi.framework.web.service.TokenService#getLoginUser`
>
> `com.ruoyi.framework.web.service.TokenService#verifyToken` 验证令牌有效期，相差不足20分钟，自动刷新Redis缓存

借助了 Redis

```java
public void refreshToken(LoginUser loginUser){
    loginUser.setLoginTime(System.currentTimeMillis());
    loginUser.setExpireTime(loginUser.getLoginTime() + expireTime * MILLIS_MINUTE);
    // 根据uuid将loginUser缓存
    String userKey = getTokenKey(loginUser.getToken());
    redisCache.setCacheObject(userKey, loginUser, expireTime, TimeUnit.MINUTES);
}
```

#### 后端设置 Token

1. 存Redis用户信息
2. 登录完成最终返回了一个真正的token字符串 `return tokenService.createToken(loginUser);`
3. Token 放在前端 session 里 

| Admin-Token | eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImI1OWNlOTUyLWQwOTctNGNmOC1hYzYwLTU1MzdlOTBhNDg5ZSJ9.YxyKCvcLmj2EvWXVSjop1b2cCrW-j5PLtVmSMvL1V6H1PZUZCSxpcSInnp3BT1Okt48DJ-b_QAG7--kRjRhuKw |
| ----------- | ------------------------------------------------------------ |

#### 前端有 Token 后的请求

1. 后端 `JwtAuthenticationTokenFilter extends OncePerRequestFilter` 解析 Token 拿 UUID （这个时候过期就抛异常）
2. 通过 UUID 再拿 Redis 存好的 UserInfo
3. 拿到 UserInfo 代表 Token 未过期，那么 refreshToken **不过这里我看只是setCacheObject，没有更换 Token**？？？（少于20分钟就refresh）

前端同样也搭配了 request拦截器、响应拦截器（axios）





看源码更新Token只更了 Redis，真正JWT没换啊？？？ 



## 视频学习

> https://www.bilibili.com/video/BV1Ke411X7V4/?spm_id_from=333.1007.top_right_bar_window_default_collection.content.click&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0

买了案例，我觉得前端 js 代码也很值得学习！

概念:

> 实际就是一个一次性字符串，会过期   parser 过期了会抛异常-就作废了
>
> **JWT最大特点不就是状态存储在客户端么，可以实现多点登录，服务端不用做很多的额外工作**
>
> * jwt颁发后，一般扩展包没提供让其失效方法。但是要让jwt失效依然很简单，因为jwt一般会放在redis或者mysql表，只要逻辑上去找到uid对应的jwt，删了就可以了。
>
> * 个人认为jwt解决最大的问题不是跨域，而是前后端分离后，纯接口方面的用户认证问题。

jwt--> JSONWeb Token，以JSON为载体，在不同系统（或语言）之间安全的传送信息，常用于认证授权方面。

三段：头部（Header）。载荷（PlayLoad）。签名（signature）   【它是一个很长的字符串，中间用点（`.`）分隔成三个部分】





## 双 Token

> 我看我后来学的项目基本都是单 Token 看网上也比较认同
> 但是网上教程大部分为 **双Token ** access_token、refresh_token  
>      --个人觉得没必要维护 2 个Token之所以有这样例子我也会思考存在必要性。。。。我猜2个token是因为节省相对 1token频繁续期？
> 而2token可以在access_token过期后再刷，1token的话就每次时间<20就刷每次判断？
>
> **刷的操作都在 axios响应拦截器里**

大致思路：重点在前端 请求/响应拦截器

后 -> 前（登录）：Token 放 session/local storage

前 -> 后：axios 请求拦截器带上放header-`config.headers['accessToken'] = token;` 后端拦截校验
		如过期，响应拦截器调用刷新2个token，此时拿的是refresh_token校验（过期是过期的access_token）





还有一种更方便的，不生成token直接生成一个guid当token用，redis里存过期时间。就是有点不安全哈



* ==我们的方案是这样的，设置token过期时间30分钟，每次请求的时候走过滤器判断token是否过期，如果将要过期取token里用户名重新生成token返回前端，如果已经过期重新跳登==
  * 和RuoYi一样，只不过RuoYi是只用Redis ttl实现的， Token的作用像是只充当了个UUID和Redis关联




* 怎么还让后端给你判断是否快过期，401就表示无权限就是已经过期了。前端自己记住token有限期，每次操作都前端直接检验下token有效期，例如设定在最后30分钟范围内的操作会刷新token，就可以保证30分钟内有操作就可以无感刷新。临近过期又超过30分钟没操作，就活该过期重登录。当然这30分钟可以根据产品灵活设定。



* 每次更新accessToken都会刷新refresh token？的只要一直在操作就不会过期而
  refreshtoken一般是一天一周这种只要你中途打开页面就又续期了
* 如果是这样的话，refreshtoken的意义是什么呢。我一直以为使用refreshtoken的意义就是为了每次网络传输只使用有效期很短的accesstokenä，既然现在每次都要传递这两个，还不如只使用一个accesstoken来直接续期，因为我实在想不到refreshtoken存
* 能想到的大概是请求带accesstoken，被抓包后accesstoken容易被利用爬，所以把accesstoken几分钟有效，失效就用refresh去重新获取，但现在https加密，而且可以从很多角度去避免这种问题，实际项目中一个token搞定也不会有什么问题，用双token很多时候是给自己找麻烦





* 我这边的做法是：
  后端返回token的有效期，比如2小时
  前端通过有效期时间逆推出token的过期时间之后，把过期时间存入本地缓存中然后在axios拦截器里，去获取当前的时间，去对比判断token有没有过期过期了就调用refreshToken接口，获得新token
* 就是调用refreshTokenα，把旧 token给他然后换取新的token



* 不是很认可所谓的双token方案。
  1.传统的web系统，只要用户在操作那么就一定在线，只有用户长期不操作才会下线。也就是让用户在操作中不下线是第一保障。
  2.最早双token方案在哪出现的？在开放的api接口请求中。而不是在web应用设计里。
  3.接2，开放API里？为了降低API服务的压力。可以通过简单比对token来快速处理外部应用访问。出现问题后哪怕全部token都失效，client全部刷新一次也基本是无感知的。
  4.双token明显增加前后端的工作量，而并不一定能提升体验。还要专门设计一套token体系。
  5.一般应用在使用jwt后，基本上都存在过期问题，要解决的是这个问题。简单一点，解析jwt后发现即将过期就生成一个新token，在请求中返回。复杂一点本地缓存自动刷新，只要用户的最近一次访问存在足够时间就刷新token的过期时间。
  6.真当KPI项目搞啊？