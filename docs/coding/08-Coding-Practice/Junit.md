---
title: 测试用例
---



> 自测-证明测了
>
> **单测-不被篡改、保护稳定运行的一种手段**

## 操作流程

xd: 犯以下错误: 



知识铺垫

<font style="color:rgb(0, 0, 0);"> 1、</font> <font style="color:#DF2A3F;"> 接口入参对象除了校验 NotNull, NotBlank，还需要检验字段长度，枚举字段要校验在枚举范围内 </font>  
<font style="color:rgb(0, 0, 0);"> 2、打印 </font> <font style="color:#DF2A3F;"> 错误日志，需要有关键信息 </font> <font style="color:rgb(0, 0, 0);">，比如判断订单不存在，需要把 orderId 打印出来 </font>  
<font style="color:rgb(0, 0, 0);"> 3、</font> **<font style="color:rgb(0, 0, 0);"> 代码可重入，做好幂等，保证 </font>** **<font style="color:#DF2A3F;background-color:#FBDE28;"> 中途任何地方失败，这段代码可以从头再跑一遍 </font>**  
<font style="color:rgb(0, 0, 0);"> 4、尽量做快速返回式编程，比如 if null return，不是 if != null xxx，减少代码层级 </font>  
<font style="color:rgb(0, 0, 0);"> 5、代码可读性，代码分段，写好注释，或者抽方法出来，不要把全部逻辑写在一起，还没有换行，要有结构性 </font>

> <font style="color:rgb(0, 0, 0);"> 文案也校验一下，Assert 的异常文案 </font>
>
> <font style="color:rgb(0, 0, 0);"> 不要只 notNull，对象里面的关键字段也校验 </font>
>
> <font style="color:#DF2A3F;background-color:#FBDE28;"> DB 不能 mock！！！sql grammar </font>



<font style="color:rgb(0, 0, 0);"> 步骤-mock yy </font>

> <font style="color:rgb(0, 0, 0);"> 1.构建你的请求，以及定义一些 mock 能力 </font>  
> <font style="color:rgb(0, 0, 0);"> 2.去调用你要测试的目标方法 </font>  
> <font style="color:rgb(0, 0, 0);"> 3.去检测目标方法返回的东西是不是你预期的 </font>



## <font style="color:rgb(0, 0, 0);"> 碰到的问题集 </font>

> <font style="color:rgb(0, 0, 0);"> Mockito when 效果老是没生效，用 verify 校验问题！发现第二个参数实际用的是 String </font>
>
> <font style="color:rgb(0, 0, 0);"> 入参类型搞错，排错 xxx </font>

```java
// 在测试方法的最后，验证具体的调用
Mockito.verify(cacheManager).putObjectWithExpire(
    "STOP_CHAT_CACHE_KEY_PREFIX_userId123_202409282011727514756414_202409282021727514756405",
    Boolean.FALSE,
    120
);
```

> // 用到 mock 注解的得使用下面才能生效
>
> MockitoAnnotations.openMocks(this);
>
> **<font style="background-color:#FBDE28;"> 引申出 - 学解决思路：看包是属于哪里的，到源码定位到 jar 包名字然后  Google 这个 jar 名字使用手册！！！</font>**

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/135356742/1727346395904-e353b890-d2b9-4908-b3d3-d1552c7050ed.png)

 MockUtil.mockField(distributedLockService, "distributedLock", distributedLock);



> chat 监听器回调 mock   卡很久，发现有个 API 可以操作

       Mockito.doAnswer(new Answer() {
    
            @Override
    
            public Object answer(InvocationOnMock invocationOnMock) throws Throwable {
    
                System.out.println(invocationOnMock.getArguments());
    
                return invocationOnMock.getArguments();
    
            }
    
        }).when(botStreamChatFacade).streamChat(any(), any());

## ✨ Mock 方式两种 - <font style="color:#DF2A3F;"> 复习反射部分应用场景 </font>

### 注解方式

```javascript
   /**
     * ilmmodelClient
     */
    @Autowired
    @InjectMocks
    private IlmmodelClientImpl     ilmmodelClientImpl;

    /**
     * TtsFacade
     */
    @Mock
    private TtsFacade              ttsFacade;


MockitoAnnotations.openMocks(this);
```

### 代码方式

```javascript
// 1
TtsFacade ttsFacade = Mockito.mock(TtsFacade.class);

// 并不是 1,3 就直接可以了    别忘记还有个该 field 注入到源 class 的操作.   需要通过反射解决

// 3
Mockito.when(ttsFacade.executeGenericTts(Mockito.any())).thenReturn(mockResult);
```

**keypoint**

****

**全盘逻辑**

****

```javascript
private static void backupOriginalField(Object target, String fieldName,
                                            Object mock) throws IllegalAccessException,
                                                         NoSuchFieldError {
        // TODO: 2025/1/11 单侧为什么需要获取真实对象而非代理对象？
        // 获取真实对象而非代理对象
        target = getSingletonTarget(target);

        Field field = getField(target, fieldName);
        Object originFieldValue = field.get(target);
        // 如果已经替换过了，抛出异常
        Object replaced = REPLACED_FIELDS
            .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
        if (!Objects.isNull(replaced)) {
            // 不应该重复替换原成员
            throw new IllegalStateException("非法覆盖" + target + "成员" + fieldName + "原始引用记录");
        }

        field.set(target, mock);
        log.debug("已替换" + target + "对象的成员" + fieldName + "为" + mock);

        if (!Objects.isNull(originFieldValue)) {
            // ConcurrentHashMap 不能 put null 对象，null 成员也没有必要备份
            REPLACED_FIELDS.computeIfAbsent(target, (key) -> new ConcurrentHashMap<>())
                .put(fieldName, originFieldValue);
        }
    }


private static Field getField(Object target, String fieldName) {
        Field field = null;
        Class<?> type = target.getClass();
  // TODO 这里为什么 while,  看 catch 逻辑会向父类找  所以 while
        while (type != null) {
            try {
                field = type.getDeclaredField(fieldName);
                break;
            } catch (NoSuchFieldException e) {
                type = type.getSuperclass();
            }
        }

        if (field == null) {
            throw new NoSuchFieldError();
        }

        field.setAccessible(true);
        return field;
    }
```

todo 解释: 

+ <font style="color:rgb(51, 51, 51);"> 如果 </font> `<font style="color:rgb(51, 51, 51);">IlmmodelClientImpl</font>` <font style="color:rgb(51, 51, 51);"> 是作为一个 Spring Bean 声明的，并且这个类中使用了 AOP 相关注解（如 </font> `<font style="color:rgb(51, 51, 51);">@Transactional</font>` <font style="color:rgb(51, 51, 51);"> 或 </font> `<font style="color:rgb(51, 51, 51);">@Aspect</font>` <font style="color:rgb(51, 51, 51);">），则在注入时通常会得到一个代理对象 </font>
+ **<font style="color:rgb(51, 51, 51);"> Proxy 类型 </font>** <font style="color:rgb(51, 51, 51);">：Spring 可以使用两种类型的代理：基于 JDK 的代理（接口代理）和基于 CGLIB 的代理（子类代理）。</font>
+ <font style="color:rgb(51, 51, 51);"> AopUtils.isAopProxy(ilmmodelClientImpl)</font>

<font style="color:rgb(51, 51, 51);"> </font>

+ computeIfAbsent 适用于两层嵌套的 map   拿到/初始化里层 map

```javascript
// NoSuchFieldException
Field field = clazz.getDeclaredField("ttsFacade");
// todo 如果我不加这一行的话，field 无法被获取到吗  ---> 是的  IllegalAccessException
// --- 下面两行操作都不行
//field.setAccessible(true);


Object o = field.get(ilmmodelClientImpl);
// 设置 field 的值为 mock
field.set(ilmmodelClientImpl, ttsFacadeMock);
```

## TODO 测试 - mock 污染问题

> 用反射的形式写工具类: MockUtil.mockFieldIfNotMocked(ilmmodelClientImpl, "ttsFacade", TtsFacade.class);
>
> 就是想解决这个问题

GPT e.g. : 

```javascript
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

    @Test
    public void testGetUserById() {
        User mockUser = new User("1", "Alice");
        when(userRepository.findById("1")).thenReturn(mockUser);

        User user = userService.getUserById("1");
        assert user.getName().equals("Alice");
    }

    @Test
    public void testGetUserName() {
        // 这里我们没有为 userRepository 设置 mock 行为
        // 直接调用了 getUserById，但状态可能会影响到结果

        // precondition
        User mockUser = new User("1", "Bob");
        when(userRepository.findById("1")).thenReturn(mockUser);

        // This may lead to unexpected behavior if the previous test leaves the 
        // mock's state unchanged or affected.
        String userName = userService.getUserName("1"); // 预期得到 "Bob"

        assert userName.equals("Bob");

        // 假设我们在其他方法中没有清理任何状态
        // 但实际上这个测试可能会失败，因为 Mock 的行为在
        // 先前的测试中可能已经被修改。
    }
}

```

```java
/*

 * Ant Group
 * Copyright (c) 2004-2024 All Rights Reserved.
   */
   package com.alipay.ibotservice;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.aop.framework.AopProxyUtils;
import org.springframework.aop.support.AopUtils;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

/**

 * mock 工具，解决 mock 污染的问题

 * @author yongyi

 * @version MockUtil.java, v 0.1 2024 年 07 月 25 日 20:28 yongyi
   */
   @Slf4j
   public class MockUtil {

   private static final Map<Object, Map<String, Object>> REPLACED_FIELDS = new ConcurrentHashMap<>();

   /**

    * 替换目标的某个成员对象。

    * 如果这个成员已经被替换过，返回现有替身，否则替换为一个 mockito 对象。

    * 在每个测试方法完成后，会自动还原为原成员对象。
      *

    * @param target    目标

    * @param fieldName 替换的成员名

    * @param clazz     替换的成员的类型
      */
      @SneakyThrows
      public static synchronized <T> T mockFieldIfNotMocked(Object target, String fieldName,
                                                        Class<T> clazz) {
      // 获取真实对象而非代理对象
      target = getSingletonTarget(target);

      Object replaced = REPLACED_FIELDS
          .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
      if (!Objects.isNull(replaced)) {
          // 已经替换过了，返回当前对象
          log.debug(target + "对象的成员" + fieldName + "已被自动mock");
          Field field = getField(target, fieldName);
          //noinspection unchecked
          return (T) field.get(target);
      }

      // 替换为一个 mockito mock
      T mock = mock(clazz);
      backupOriginalField(target, fieldName, mock);

      return mock;
      }

   /**

    * 替换目标的某个成员对象。

    * 如果这个成员已经被替换过，返回现有替身，否则替换为一个 mockito 对象。

    * 在每个测试方法完成后，会自动还原为原成员对象。
      *

    * @param target    目标

    * @param fieldName 替换的成员名

    * @param clazz     替换的成员的类型
      */
      @SneakyThrows
      public static synchronized <T> T spyFieldIfNotMocked(Object target, String fieldName,
                                                       Class<T> clazz) {
      // 获取真实对象而非代理对象
      target = getSingletonTarget(target);

      Object replaced = REPLACED_FIELDS
          .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
      if (!Objects.isNull(replaced)) {
          // 已经替换过了，返回当前对象
          log.debug(target + "对象的成员" + fieldName + "已被自动mock");
          Field field = getField(target, fieldName);
          //noinspection unchecked
          return (T) field.get(target);
      }

      // 替换为一个 mockito mock
      T mock = spy(clazz);
      backupOriginalField(target, fieldName, mock);

      return mock;
      }

   /**

    * 替换目标的某个成员。如果这个成员已经替换过，依然再次替换。

    * 在每个测试方法完成后，会自动还原为原成员对象。

    * @param target 目标

    * @param fieldName 替换的成员名

    * @param mock 替身
      */
      @SneakyThrows
      public static synchronized void mockField(Object target, String fieldName, Object mock) {
      // 获取真实对象而非代理对象
      target = getSingletonTarget(target);
      Object replaced = REPLACED_FIELDS
          .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
      if (!Objects.isNull(replaced)) {
          // 已经替换过了，覆盖
          log.error("发现重复替换" + target + "对象的成员" + fieldName);
          Field field = getField(target, fieldName);
          field.set(target, mock);
          return;
      }

      backupOriginalField(target, fieldName, mock);
      }

   @SneakyThrows
   public static synchronized void resetOriginalFields() {
       for (Entry<Object, Map<String, Object>> entry : REPLACED_FIELDS.entrySet()) {
           Object target = entry.getKey();
           for (Entry<String, Object> origin : entry.getValue().entrySet()) {
               Field field = getField(target, origin.getKey());
               field.set(target, origin.getValue());
           }
       }
       REPLACED_FIELDS.clear();
   }

   private static Object getSingletonTarget(Object target) {
       while (AopUtils.isAopProxy(target)) {
           // 获取真实对象而非代理对象
           target = AopProxyUtils.getSingletonTarget(target);
       }
       if (Objects.isNull(target)) {
           throw new IllegalArgumentException("target is null");
       }
       return target;
   }

   private static Field getField(Object target, String fieldName) {
       Field field = null;
       Class<?> type = target.getClass();
       while (type != null) {
           try {
               field = type.getDeclaredField(fieldName);
               break;
           } catch (NoSuchFieldException e) {
               type = type.getSuperclass();
           }
       }

       if (field == null) {
           throw new NoSuchFieldError();
       }
       
       field.setAccessible(true);
       return field;

   }

   private static void backupOriginalField(Object target, String fieldName,
                                           Object mock) throws IllegalAccessException,
                                                        NoSuchFieldError {
       // 获取真实对象而非代理对象
       target = getSingletonTarget(target);

       Field field = getField(target, fieldName);
       Object originFieldValue = field.get(target);
       // 如果已经替换过了，抛出异常
       Object replaced = REPLACED_FIELDS
           .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
       if (!Objects.isNull(replaced)) {
           // 不应该重复替换原成员
           throw new IllegalStateException("非法覆盖" + target + "成员" + fieldName + "原始引用记录");
       }
       
       field.set(target, mock);
       log.debug("已替换" + target + "对象的成员" + fieldName + "为" + mock);
       
       if (!Objects.isNull(originFieldValue)) {
           // ConcurrentHashMap 不能 put null 对象，null 成员也没有必要备份
           REPLACED_FIELDS.computeIfAbsent(target, (key) -> new ConcurrentHashMap<>())
               .put(fieldName, originFieldValue);
       }

   }
   }

```

