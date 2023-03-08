# [黑马点评](https://www.bilibili.com/video/BV1PG4y1s7io/?spm_id_from=333.788&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)

> [一个专门学习 Redis 而生的项目](https://www.bilibili.com/video/BV1cr4y1671t/?spm_id_from=333.337.search-card.all.click&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)，参考大众点评做的。理论+实战   42h / 3 = 14
> Here the link is an instructional video, and the title link is a navigation video
>
> set: 共同关注
> zset: 排行榜应用实现，取Top N
> Geospatial 地理位置

# 一、基础篇

## 1.课程内容

> 实战篇性价比高，高级篇偏运维一点（高级、原理面试前整）

![image-20230304151001878](http://image.zzq8.cn/img/202303041510042.png)

## 2.Redis的JAVA客户端

> 单单使用 Jedis 的话记得配 `JedisPool`
> 使用Spring Data Redis的话默认实现的 lettuce，如想用 Jedis 需要单独引一下
>
> 需要注意的是，如果你需要对连接池进行更高级的配置，或者使用其他的连接池实现，可能需要手动引入 commons-pool2 依赖，并进行相应的配置。但通常情况下，使用 spring-boot-starter-data-redis 默认提供的配置已经足够满足大部分需求了。
> 实测：还是需要引入commons-pool2，因为data-redis里面这个依赖是optional true
> 总之，使用 `<optional>` 标签可以控制依赖的传递性，避免不必要的依赖冲突和版本冲突，但是需要注意，它的传递性也会被取消，需要手动处理相关的依赖。   **之所以有这个问题，是因为springboot版本低了的原因，导致有这个optional。后面高版本没有这个optional了！**

![image-20230304152602369](http://image.zzq8.cn/img/202303041526511.png)

### 2.1.RedisTemplate

> RedisTemplate 记得设置一下序列化对象，直接看这个类源码有四个属性要设
> 可以看这个四个属性的类型 `RedisSerializer` 接口有哪些实现类！**一般key用RedisSerializer.string、value用json对象**，==但有下面问题！==

优势：自动处理序列化问题，不用自己代码层面转来转去了

弊端：如下，占用额外内控空间去记录该反序列化的那个类的全路径类名

<img src="http://image.zzq8.cn/img/202303041658585.png" alt="image-20230304165847419" style="zoom:50%;" />

### 2.2.反序列化问题-StringRedisTemplate

> 使用上述配置序列化时，反序列化有浪费内存的问题。

#### 1）问题：

![image-20230304171121214](http://image.zzq8.cn/img/202303041711043.png)

#### 2）解决

为了节省内存空间,我们并不会使用JSON序列化器来处理value,而是统一使用String序列化器,要求只能存储String类型的key和value.当需要存储java对象时,手动完成对象的序列化和反序列化.  **代码复杂了点多了两个手动序列化操作，但是空间省了**

`StringRedisTemplate`：Spring默认提供了一个StringRedisTemplate类,它的key和value的序列化方式默认就是String方式.省去了我们自定义RedisTemplate的过程



# 二、实战篇

![image-20230306095441886](http://image.zzq8.cn/img/202303060954783.png)

# 1.短信登录

## 1.1.这里使用Hash保存用户信息

> JSON串的格式，引号冒号还需保存，如果想加一个还得把整个串干掉
>
> 所以从优化的角度，推荐使用hash

<img src="http://image.zzq8.cn/img/202303071617889.png" alt="image-20230307161347386" style="zoom: 67%;" />

> 注意 Hash 结构跟 String 结构区分，这里有Redis的一个 key 而 value（K、V）才是真正的 Hash 结构
>
> ==StringRedisTemplate 对象可以创建 Hash！！！== stringRedisTemplate.opsForHash().putAll(tokenKey, userMap);【HASH，KV】
>
> Note：一般存 key 会加上业务前缀做区分

![image-20230307161729539](http://image.zzq8.cn/img/202303071617089.png)

![image-20230307162022703](http://image.zzq8.cn/img/202303071620766.png)

为什么InterceptorRegistry不需要调用addPathPatterns("/**")也可以拦截所有请求





InterceptorRegistry 不需要调用 addPathPatterns("/**") 也可以拦截所有请求，是因为在 InterceptorRegistry 中添加的拦截器默认会拦截所有的请求。

当你向 InterceptorRegistry 中添加一个拦截器时，该拦截器会被注册到系统的拦截器链中，并被应用到所有请求上。在拦截器的 preHandle() 方法中，你可以对请求进行处理并决定是否允许请求继续执行或是拦截请求。

因此，当你向 InterceptorRegistry 中添加一个拦截器时，该拦截器会自动拦截所有请求，而不需要显式地指定拦截路径。



![img](data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2730%27%20height=%2730%27/%3e)![x d](https://chat.openai.com/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAGNmyxaesWqCN7TAgnaq3djk6QgrKcLKfInbBp9Brcrs%3Ds96-c&w=64&q=75)

但是我在源码看到的是 private final List<String> includePatterns = new ArrayList(); 不能理解为什么会默认拦截所有请求













Hutools Utils

1. 复制Bean的属性，好像同Spring有个工具类一样 `BeanUtil.copyProperties`

2. 将User对象转为HashMap存储到Redis `BeanUtil.beanToMap`

   * ```java
     //由于UserDTO类有属性是Long的，而StringRedisTemplate<String, String>，所以这里用hutools构造函数定制化全给String
     //也可笨方法new map自己转成String
     Map<String, Object> userMap = BeanUtil.beanToMap(userDTO, new HashMap<>(),
                     CopyOptions.create()
                             .setIgnoreNullValue(true)
                             .setFieldValueEditor((fieldName, fieldValue) -> fieldValue.toString()));
     ```

   * **弹幕: 就这个错误，我在谷粒商城的springsession的序列化器转换异常搞了半天，也是Long类型的！！！！！！**

3. 将Redis拿到的Hash填充到Bean `BeanUtil.fitlBeanWithMap`
