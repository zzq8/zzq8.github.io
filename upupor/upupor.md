# upuporStudy

https://eco.upupor.com/upupor/

可以看这个网址，记录作者对这个Blog的很多思路。。。。包括MinIO、mysql的备份，以及服务的部署！

![https://eco.upupor.com/assets/upupor-architecture.c16039e8.svg](https://eco.upupor.com/assets/upupor-architecture.c16039e8.svg)

# 一、前置环境

> 1. 过启动时候 log 看触发哪些配置项
> 2. 一个个功能模块过

## 1.flyway

作用：数据迁移

数据库会新产生一个 flyway_schema_history 的表

* 这个表会记录每一个 sql 脚本文件的操作，以及是否执行成功

小技巧：用 IDEA 操作数据库新增列会产生语句，这个时候就可以复制这个语句了！



SQL脚本文件有固定命名规则 

1. V开头
2. __两个下划线连接描述信息



## 2.环境变量

> `XD：我觉得这是开源值得学习的一个点，所有隐私部分用${} 然后单独搞个 application.properties 不被版本控制就行！`
>
> 详细我记录在 SpringBoot 笔记中了，**我这里用的是 application.properties(no version) + idea Environment variables** 搭配一起用，目的是测了下这两者都生效了！！！

针对一次会话的话 linux-export，windows-set

好像写到 application.properties 里面也可以，这个文件不版本控制就行

我这里选择用 idea 自带的 Environment variables 设置



# 二、邮件-注册

## 1.事件驱动-@EventListener

笔记：https://www.cnblogs.com/dafengdeai/articles/17073114.html

视频：https://www.bilibili.com/video/BV1Cd4y1q7Vm/?spm_id_from=333.337.search-card.all.click&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0

> ==Spring、SpringBoot常用扩展特性之事件驱动==  看代码demo  Spring Boot 2 项目
>
> 一般搭配以下两个注解一起使用：  **@EventListener @Async**
>
> 1. @0rder指定执行顺序在同步的情况下生效
> 2. @Async 异步执行需要 @EnableAsync 开启异步

> 事件驱动:即跟随当前时间点上出现的事件,调动可用资源,执行相关任务,使不断出现的问题得以解决,防止事务堆积.
> 如:注册账户时会收到短信验证码,火车发车前收到提醒,预定酒店后收到短信通知等.如:浏宽器中点击按钮请求后台,鼠标点击变化内容,键盘输入显示数据,服务接收请求后分发请求等.在解决上述问题时,应用程序是由"事件驱动运行的,这类程序在编写时往往可以采用相同的模型实现,我们可以将这种编程模型称为事件驱动模型.
> (PS:事件驱动模型其实是一种抽象模型,用于对由外部事件驱动系统业务逻辑这类应用程序进行建模.)

debug走到一步，不懂

```java
@Resource
private ApplicationEventPublisher eventPublisher;

//UNKNOWN @FunctionalInterface这里的作用是什么          @EventListener注解！！！！！？？？？
eventPublisher.publishEvent(sendEmailEvent);
```

==重点就是这三个类，搞清就行！！！可以看自己写的代码    注意：ApplicationEvent 可以不实现所以重心其实就两个类==

1. Spring事件驱动最基本的使用 `ApplicationEventPublisher`,`ApplicationEvent`,`ApplicationListener` （Spring抽象出了这基本的三个。  事件生产方、事件、事件消费方）
2. ApplicotionEventPublisher 子类 `ApplicationContext` （在启动类中这个常用一些applicationContext.publishEvent(new ApplicationEvent(this){})）
3. 事件源、监听器需要被spring管理
4. 监听器需要实现ApplicationListener<ApplicotionEvent>    xd: 可注解！
5. **可体现事件源和监听器之间的松耦合仅依赖spring、ApplicationEvent**（发布、监听两个类中都没有另一个的引用！）



XD：

1. publisher-生产者，       Listener（注解到方法）-消费者
   publishEvent几次，listener就会消费几次

2. ApplicationEvent 可以不实现，看顶层的这个接口源码其实也转成了 Object，但是按规范注释来说希望所有的事件类都最好实现 ApplicationEvent 

   * ```java
     ApplicationEventPublisher.class
     
     
     default void publishEvent(ApplicationEvent event) {
         publishEvent((Object) event);
     }
     	
     
     //所以事件类没有extends ApplicationEvent也行其实走的是这里
     void publishEvent(Object event);
     ```

     





# Z、知识点

## 1.实现ApplicationContextAware接口的作用

> 场景：发现工具类中 SpringContextUtils.getBean(TrueSend.class); 好奇为什么不@Autowaird

实现 `ApplicationContextAware` 接口的作用是允许一个类获取对 Spring 应用程序上下文（`ApplicationContext`）的访问权限。通过实现该接口，类可以获得对应用程序上下文的引用，从而能够进行更高级别的操作，例如获取和管理 Spring Bean、发布应用程序事件等。

具体来说，当一个类实现了 `ApplicationContextAware` 接口，它必须实现接口中的 `setApplicationContext()` 方法。Spring 在初始化该类的实例时，会自动调用 `setApplicationContext()` 方法，并将应用程序上下文作为参数传递给该方法。通过该方法，类可以将传递的应用程序上下文存储为一个成员变量，以便在需要时进行访问。

下面是一个示例：

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class MyBean implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public static <T> T getBean(Class<T> clazz) throws BeansException {
        return applicationContext.getBean(clazz);
    }
}

-----------------即可在 CcEmailUtils.class 等没有被Spring管理的工具类中使用Spring对象
    TrueSend trueSend = SpringContextUtils.getBean(TrueSend.class);
```

通过实现 `ApplicationContextAware` 接口，类可以直接访问应用程序上下文，从而获得更多的灵活性和功能。例如，可以根据需要获取其他 Bean 的引用、发布应用程序事件、访问配置属性等。



## 2.[Spring-静态资源启用版本控制](../JavaFramework/SpringBoot#9）Spring-静态资源启用版本控制)

> 记到了 SpringBoot.md 中，具体 link title

犹记毕业第一年时，公司每次发布完成后，都会在一个群里通知【版本更新，各部门清理缓存，有问题及时反馈】之类的话。归根结底就是资源缓存的问题，浏览器会将请求到的静态资源，如JS、CSS等文件缓存到用户本地，当用户再次访问时就不需要再次请求这些资源了，以此也是提升了用户体验。但是也正是因为这些资源缓存，导致客户端的静态文件往往不是当前最新版本。后来有同事增加了时间戳、随机数等，确实这也解决了客户端缓存的问题，但是却又带来了新的麻烦，导致每次访问都要请求服务器，无形中增加了服务器的压力。



















Minio 

* 必须要手动上传不能资源管理器复制进去

* 资源管理器上传的文件不是源文件，好像被它加密了

* 配合Spring的版本    在上传到minio时计算下md5后再上传

  * ```python
    # 生产
    targetDic = "/upupor/apps/codes/upupor/upupor-web/src/main/resources/static"
    targetPath = os.walk(targetDic)
    ossTargetDic = "/upupor_static"
    
    def getMd5(localFile):
        f = open(localFile,'rb')
        md5_obj = hashlib.md5()
        md5_obj.update(f.read())
        hash_code = md5_obj.hexdigest()
        f.close()
        md5 = str(hash_code).lower()
        return md5
    
    #
    client = Minio(
        endpoint="ip:port",
        access_key="xxxx",
        secret_key="xxxxxx",
        secure=False,
    )
    
    # client.trace_on(sys.stdout)
    
    for path,dir_list,file_list in targetPath:
        for file_name in file_list:
            if '.map' in file_name:
                continue
            if '.DS_Store' in file_name:
                continue
            # 本地文件
            localFile = os.path.join(path, file_name)
            # 计算md5值
            md5value = getMd5(localFile)
            # 将md5值添加到文件名上
            local_file_md5_name = localFile.replace(targetDic,'').replace('\\','/')\
                                  .replace('.svg','-'+md5value+".svg")\
                                  .replace('.webp','-'+md5value+".webp")\
                                  .replace('.js','-'+md5value+".js")\
                                  .replace('.css','-'+md5value+".css")\
                                  .replace('.png','-'+md5value+".png")\
                                  .replace('.jpeg','-'+md5value+".jpeg")\
                                  .replace('.jpg','-'+md5value+".jpg")\
                                  .replace('.ico','-'+md5value+".ico")
            ossObjectName = ossTargetDic + local_file_md5_name
            # if exist == True:
            #     print('已存在,无需上传------------'+ossObjectName)
            #     continue
            # print('正在上传... ' + ossObjectName)
    
            in_get_content_type="application/octet-stream";
            md5FileName = local_file_md5_name.split('/',-1)[-1]
            suffix = md5FileName.split('.',-1)[-1];
            if suffix == 'js':
                in_get_content_type='application/x-javascript'
    
            if suffix == 'css':
                in_get_content_type='text/css'
    
            
            if suffix == 'svg':
                in_get_content_type='image/svg+xml'
    
            #print(in_get_content_type)
            #print(suffix)
            client.fput_object(bucket_name="upupor-img", object_name=ossObjectName, file_path=localFile,content_type=in_get_content_type)
            print(ossObjectName + '  已上传')
    ```

## 











TODO

* blog文章加密方式，为什么
* 站内信息
* LOG_PATH_IS_UNDEFINEDbackup   文件夹发现会压缩错误日志到里面！
* 上传音频





Question:

* Nginx 配置头像静态资源访问不到，因为我代码是保存到指定的本地目录而项目是以jar包方式运行导致会保存到jar的相对路径
  * 所有资源保存需要
*  静态资源启用版本控制             #XD UNKONW这里启用了hash版本文件名为了避免缓存，但是minio我不知道在哪里配置跟上hash名字访问！！！
