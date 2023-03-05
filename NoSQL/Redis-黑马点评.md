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

![image-20230304152602369](http://image.zzq8.cn/img/202303041526511.png)

### 2.1.RedisTemplate

> RedisTemplate 记得设置一下序列化对象，直接看这个类源码有四个属性要设
> 可以看这个四个属性的类型 `RedisSerializer` 接口有哪些实现类！**一般key用RedisSerializer.string、value用json对象**，==但有下面问题！==

优势：自动处理序列化问题，不用自己代码层面转来转去了

弊端：如下，占用额外内控空间去记录该反序列化的那个类的全类路径名

![image-20230304165847419](http://image.zzq8.cn/img/202303041658585.png)

### 2.2.反序列化问题-StringRedisTemplate

> 使用上述配置序列化时，反序列化有浪费内存的问题。

#### 1）问题：

![image-20230304171121214](http://image.zzq8.cn/img/202303041711043.png)

#### 2）解决

为了节省内存空间,我们并不会使用JSON序列化器来处理value,而是统一使用String序列化器,要求只能存储String类型的key和value.当需要存储java对象时,手动完成对象的序列化和反序列化.  **代码复杂了点多了两个手动序列化操作，但是空间省了**

`StringRedisTemplate`：Spring默认提供了一个StringRedisTemplate类,它的key和value的序列化方式默认就是String方式.省去了我们自定义RedisTemplate的过程



# 二、实战篇

# 1.短信登录

