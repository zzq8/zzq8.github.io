## SpringIntegration

> [视频讲的特好](https://www.bilibili.com/video/BV1Ak4y1k7B6/?spm_id_from=333.337.search-card.all.click&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)
> 应用集成模式与概念
> 两个系统，独立开发 独立运行的   系统集成

## 一、应用集成模式与概念

##### 常见集成模式：

1. 通过文件传输的形式（保障平台 - ERP通过xml）File Transfer                \<FTP>
2. 通过接口远程方法调用怕【WMS常用 -return json POJO到对方系统去保存Yigo】          \<HTTP>
3. 共享公共数据库方式，同1的文件传输类似通过外部【WMS也用 -保存到Yigo2-】      \<JDBC-API>
4. 通过Event到消息总线，相互发消息

<img src="http://images.zzq8.cn/img/image-20240307102045296.png" alt="image-20240307102045296" style="zoom: 33%;" />



ps: 最推崇的 = Messaging（和Spring事件驱动，消息中间件松耦合的概念十分相似）

* ABC相互之间可以完全不知道对方的，只需要去Message Bus消费自己需要的Event就行





##### 两个系统之间架设通道大致流程：

Endpoint 可以是FTP从FTP服务器拿文件塞进Interation，也可以是HTTP   【封装成一个个的 Message 格式】进入到下方的消息管道

Channel(消息通道) -> Filter(管道过滤器对传递消息处理，使符合接收方要求)还有些特别的Filter（Translator/Router）

<img src="http://images.zzq8.cn/img/image-20240307104731864.png" alt="image-20240307104731864" style="zoom: 50%;" />







## 二、SpringIntegration 

与上面ERP概念模型小区别是，输入输出的头尾两端的Message Endpoint是算Filters





是轻量级的消息传递机制

adapters（适配器）

remoting

messaging（=header + payload）

* ```java
  public interface Message<T> {
  	T getPayload();
  	MessageHeaders getHeaders();
  }
  ```

scheduling





message - message channel

Message Transformer