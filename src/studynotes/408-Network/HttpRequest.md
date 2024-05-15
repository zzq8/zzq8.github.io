# HttpRequest

[http 请求包含哪几个部分（请求行、请求头、请求体）](https://blog.csdn.net/f110300641/article/details/115342356)

> 这里放一些常见的，具体的去搜

## 一、General（请求行）

* Request URL: http://127.0.0.1:8848/nacos/

* Request Method: GET

* Status Code:304（响应状态码） 

* Remote Address: 127.0.0.1:8848（HTTP请求的源地址）

  * HTTP协议在三次握手时使用的就是这个Remote Address地址，在发送响应报文时也是使用这个Remote Address地址。因此，如果请求者伪造Remote Address地址，他将无法收到HTTP的响应报文，此时伪造没有任何意义。这也就使得Remote Address默认具有防篡改的功能。

  * 如果http请求经过代理服务器转发，用户的真实ip会丢失，为了避免这个情况，代理服务器通常会增加一个叫做x_forwarded_for的头信息，把连接它的客户端IP（即你的上网机器IP）加到这个头信息里，这样就能保证网站的web服务器能获取到真实IP

* Referrer Policy: strict-origin-when-cross-origin（引用策略，有八种）
  * Referer提供访问来源的信息，告诉服务器，用户在访问当前资源之前的位置，发生传场景包含：加载图片、样式文件、JS文件、请求。浏览器会将当前网址作为Referer字段，放在 HTTP 请求的头信息发送。



## 二、Request Headers（请求头）

* `Accept`: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8
  * 请求头用来告知服务器 客户端可以处理的内容类型(用MIME类型来表示)，借助内容协商机制服务器从备选项中选择一项进行应用，并使用Content-Type应答头通知客户端它的选择。
  
* Accept-Encoding: gzip, deflate, br 
  * 请求头用来告知服务器 客户端可以处理的编码方式
  
* Accept-Language: zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7 

* Cache-Control: max-age=0 

* Content-Type：xxx         这个补充到笔记，请求也有这不光response

* Connection: keep-alive 

  * 面试常问1.1和1.0的区别。。有必要说明的是，HTTP/1.0 仍提供了长连接选项，即在请求头中加入`Connection: Keep-alive`。同样的，在 HTTP/1.1 中，如果不希望使用长连接选项，也可以在请求头中加入`Connection: close`，这样会通知服务器端：“我不需要长连接，连接成功后即可关闭”。

    ------

    著作权归Guide所有 原文链接：https://javaguide.cn/cs-basics/network/http1.0-vs-http1.1.html#%E8%BF%9E%E6%8E%A5%E6%96%B9%E5%BC%8F

* `Cookie`: JSESSIONID=B4717473F69FD975072100C7E181E807; JSESSIONID=BF468917A7A82EB64D8E913D8F4457F5 
  * 这两个Name一样但是Path不一样
  * ==Cookie是Web服务器发送给客户端的一小段信息，客户端请求时，可以读取该信息发送到服务器端==
  
* [DNT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT): 1 （**D**o **N**ot **T**rack）
  * **已弃用：**不再推荐此功能。尽管某些浏览器可能仍然支持它

* `Host`: 127.0.0.1:8848 
  * 场景：Ngixn 转发会丢失这个，需配置的时候加个参数set上去

* If-Modified-Since: Fri, 29 Apr 2022 02:20:32 GMT 

* Sec-Fetch-Dest: document 

* Sec-Fetch-Mode: navigate 

* Sec-Fetch-Site: same-origin 

* Sec-Fetch-User: ?1 

* Upgrade-Insecure-Requests: 1 

* User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 sec-ch-ua: "Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108" 

* sec-ch-ua-mobile: ?0 

* sec-ch-ua-platform: "Windows"



## [三、Response Headers（响应头）](https://www.runoob.com/http/http-header-fields.html)

> 包含服务器类型，日期，长度，内容类型等
>
> 响应正文响应正文就是服务器返回的HTML页面或者json数据  text/html  application/json

* Connection: keep-alive
  * 可以看到请求头也有这个属性
  * 服务器可以解析请求头中的 Connection 字段来了解客户端的连接偏好，并相应地处理连接的保持与关闭。
  
* Content-Encoding: gzip

* Content-Language: zh-CN

* `Content-Type`: text/html;charset=utf-8
  * 对应请求头的 Accept 告诉你采用的是哪个
  
* Date: Thu, 12 Jan 2023 08:27:16 GMT

* `Set-Cookie`: xxx
  * 设置和页面关联的Cookie
  
* Content-Length: 6867

* Keep-Alive: timeout=60 
  * 这意味着在客户端与服务器之间的通信中，如果在 60 秒内没有新的请求或响应发生，连接可能会被关闭。
  
  * CATIC 商网就是做了这个限制，然后直接报错 504 (Gateway Time-out) 但实际上，你只要请求丢过去了他后台服务器就还在执行。返回值如果不重要的话，我这里就是 return true 不太重要     响应值丢了就丢了  反正接口幂等了
  
  * **Response Headers的参数Keep-Alive: timeout=60该在哪里设置**
  
    * **---对于Apache服务器：**
      对于 Apache Tomcat，你可以通过修改 `server.xml` 文件来配置
  
      ```
      <Connector port="8080" protocol="HTTP/1.1"
                 connectionTimeout="60" />
      ```
  
    * **---对于Nginx服务器：**
      在 Nginx 的配置文件（通常是 `nginx.conf` 或位于 `sites-available` 目录中的虚拟主机配置文件）中，可以添加以下指令来设置 `Keep-Alive` 的超时时间：
  
      ```
      keepalive_timeout 60s;
      ```
  
      上述配置中，`keepalive_timeout` 设置为 `60s` 表示超时时间为60秒。
  
      请注意，以上配置示例仅供参考，实际配置可能会根据你的服务器环境和需求而有所不同。在修改服务器配置之前，请确保备份现有配置文件，并确保你对服务器配置有足够的了解。
  
      完成配置更改后，重新启动服务器以使更改生效。之后，服务器会在响应头中包含 `Keep-Alive: timeout=60`，指示客户端保持持久连接的时间为60秒。
  
    
  
    
  



***

<center>---扩展知识---</center>







## 四、[XHR ](https://zh.wikipedia.org/wiki/XMLHttpRequest)

> XMLHttpRequest
>
> https://www.cnblogs.com/xiaohuochai/p/6036475.html
>
> 概括起来，就是一句话，ajax通过原生的`XMLHttpRequest`对象发出HTTP请求，得到服务器返回的数据后，再进行处理
>
> Chrome  F12 筛选请求的时候可以勾这个(就只会捕获 Ajax 请求)，其实本质是 ajax 核心。。。。我理解为所有交互的请求都是这个
> ajax技术的核心是XMLHttpRequest对象(简称XHR)











***







http协议本身是一种无状态的协议

会话跟踪是一种灵活、轻便的机制，它使Web上的状态编程变为可能。
HTTP是一种无状态协议，每当用户发出请求时，服务器就会做出响应，客户端与服务器之间的联系是离散的、非连续的。当用户在同一网站的多个页面之间转换时，根本无法确定是否是同一个客户，会话跟踪技术就可以解决这个问题。当一个客户在多个页面间切换时，服务器会保存该用户的信息。
有四种方法可以实现会话跟踪技术：URL重写、隐藏表单域、Cookie、Session。
1）.隐藏表单域：<input type="hidden">，非常适合步需要大量数据存储的会话应用。
2）.URL 重写:URL 可以在后面附加参数，和服务器的请求一起发送，这些参数为名字/值对。
3）.Cookie:一个 Cookie 是一个小的，已命名数据元素。服务器使用 SET-Cookie 头标将它作为 HTTP
响应的一部分传送到客户端，客户端被请求保存 Cookie 值，在对同一服务器的后续请求使用一个
Cookie 头标将之返回到服务器。与其它技术比较，Cookie 的一个优点是在浏览器会话结束后，甚至
在客户端计算机重启后它仍可以保留其值
4）.Session：使用 setAttribute(String str,Object obj)方法将对象捆绑到一个会话

## Session 缺点

> **其实Session是依据Cookie来识别是否是同一个用户**。

### 为什么要使用Session技术？

**Session比Cookie使用方便，Session可以解决Cookie解决不了的事情【Session可以存储对象，Cookie只能存储字符串。】。**

### Sessin 缺点：

* **Session**: 每个用户经过我们的应用认证之后，我们的应用都要在服务端做一次记录，以方便用户下次请求的鉴别，<font color=red>通常而言session都是保存在内存</font>中，而随着**认证用户的增多，服务端的开销会明显增大**。
* **CSRF**: 因为是基于cookie来进行用户识别的, cookie如果被截获，用户就会很容易受到**跨站请求伪造的攻击**
* **==扩展性==**: 用户认证之后，服务端做认证记录，如果认证的记录被保存在内存中的话，这意味着用户**下次请求还必须要请求在这台服务器上**,这样才能拿到授权的资源，这样在分布式的应用上，相应的限制了负载均衡器的能力。这也意味着限制了应用的扩展能力。



解决系统之间Session不共享问题：把Session数据放在Redis中（使用Redis模拟Session）【**建议**】

针对Cookie存在跨域问题，有几种解决方案：

1. 服务端将Cookie写到客户端后，客户端对Cookie进行解析，将Token解析出来，此后请求都把这个Token带上就行了
2. 多个域名共享Cookie，在写到客户端的时候设置Cookie的domain。
3. 将Token保存在SessionStroage中（不依赖Cookie就没有跨域的问题了）



## [Cookie](https://mp.weixin.qq.com/s/JW7mxXEqrV1rZ_pQOteXGQ)





## token

> JWT -- JSON WEB TOKEN

基于token的鉴权机制类似于http协议也是无状态的，它不需要在服务端去保留用户的认证信息或者会话信息。这就意味着基于token认证机制的应用不需要去考虑用户在哪一台服务器登录了，这就为应用的扩展提供了便利。

流程上是这样的：

- 用户使用用户名密码来请求服务器
- 服务器进行验证用户的信息
- 服务器通过验证发送给用户一个token
- 客户端存储token，并在每次请求时附送上这个token值
- 服务端验证token值，并返回数据

这个token必须要在每次请求时传递给服务端，它应该保存在请求头里， 另外，服务端要支持`CORS(跨来源资源共享)`策略，一般我们在服务端这么做就可以了`Access-Control-Allow-Origin: *`。







## 计网面试题

### TCP和UDP的区别，TCP靠什么保证可靠连接？

> TCP通过以下机制来保证可靠连接：
>
> 1. 序列号和确认应答：TCP将每个发送的数据包进行编号，接收方通过发送确认应答来确认已接收到的数据包。发送方根据确认应答确定是否需要重传丢失的数据包。
> 2. 重传机制：如果发送方未收到确认应答或检测到数据包丢失，它会自动重传该数据包，确保数据的可靠传输。
> 3. 滑动窗口：TCP使用滑动窗口机制来控制发送方发送的数据量，以适应网络的拥塞情况，保证发送速率与接收速率的匹配。
> 4. 拥塞控制：TCP通过拥塞窗口和拥塞避免算法来控制发送速率，避免网络拥塞并保证整体性能。



### 讲一下TCP三次握手 为什么要3次，两次或者四次不行吗

TCP 建立连接时，通过三次握手能**防止历史连接的建立，能减少双方不必要的资源开销，能帮助双方同步初始化序列号**。序列号能够保证数据包不重复、不丢弃和按序传输。





## Base64

介绍：

* base64 - ==只是一种编码方法，并不是加密算法==  所有的数据都是明文存储
* **可以把任意的二进制（图片、视频、音频、字符串）转成可打印的字符**

原理：

* 由来 2^6=64位二进制，把所有字符串转成二进制然后每6位一个转成base64
* 编码后的长度要是4的倍数，不是则需最后补上一个等号





## Chrome & JS

### F12-crul

f12 右键一个请求 copy as cURL 可以得到一个 curl 命令集， Ant Work 中就是这样给我们接口信息，我们组数据做 QA 对语料喂给 GPT

### Chrome-Url

> url地址栏区分大小写吗

在大多数常见的浏览器中，URL地址栏通常是不区分大小写的。这意味着无论您输入的是大写字母、小写字母还是大小写混合，浏览器都会将其视为相同的URL。

例如，以下URL在地址栏中是等效的：

复制

```
http://www.example.com
HTTP://WWW.EXAMPLE.COM
http://www.Example.com
```

不过需要注意的是，尽管地址栏不区分大小写，但是URL路径和查询参数部分可能会受到服务器的影响。某些服务器可能会对URL路径和查询参数进行区分大小写的处理。这意味着在特定的服务器环境中，`/path` 和 `/Path` 可能被视为不同的路径。





在Spring Boot中，默认情况下，`@GetMapping("/A")` 和 `@GetMapping("/a")` 是被视为两个不同的路径的。这是因为Spring Boot默认情况下是区分路径的大小写的。

所以，当您使用`@GetMapping("/A")`注解时，它将映射到路径`/A`，而`@GetMapping("/a")`将映射到路径`/a`。这两个路径被视为不同的URL。

如果您希望路径大小写不敏感，即`/A`和`/a`被视为相同的路径，可以在Spring Boot的配置中进行相应的设置。您可以在`application.properties`或`application.yml`文件中添加以下配置：

```
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
```



> What does %2F mean in a URL?     ASCII Encoding Reference

场景：我用电脑识别 QR_Code 到 URL 浏览器  发现把里面的 `/` 全部转移成 `%2F` 了

联想到 `空格` 是 `%20` 于是系统总结下：

常见的需要转义的字符：https://www.w3schools.com/tags/ref_urlencode.ASP

在线 URLDecode 解码工具



### F12-JS

> 实用 JS 到 Console

1）复制一个 input 的 Selector, **我这里也有便捷方式，发现input有个 `readonly` 控制的不可编辑！！！把这个删了就行！~**

在 JavaScript 字符串中需要转义的特殊字符：

- 反斜杠 `\`: 反斜杠用于转义后面的字符，例如 `\\` 表示一个普通的反斜杠字符。
- 引号 `"` 和 `'`: 如果字符串本身包含引号，需要使用反斜杠进行转义，例如 `\"` 或 `\'`。
- 换行符 `\n`: 表示换行。
- 回车符 `\r`: 表示回车。
- 制表符 `\t`: 表示水平制表符。

![image-20231120173938571](http://images.zzq8.cn/img/image-20231120173938571.png)

2）js如何给td标签设置值

```js
//tdElement 可以通过 getElementById / querySelector 获取
tdElement.innerHTML = '新的值'; // 设置 <td> 的内容
tdElement.textContent = '新的值';
tdElement.innerText = '新的值';
```





### Chrome-ShortcutKey

> [Chrome 官网快捷键总结](https://support.google.com/chrome/answer/157179)

| 操作                                                         | 快捷键                               |
| :----------------------------------------------------------- | ------------------------------------ |
| 为网站名称添加 `www.` 和 `.com`，然后在当前标签页中打开该网址 | 输入网站名称并按 **Ctrl + Enter** 键 |
| 打开新的标签页并执行 Google 搜索                             | 输入搜索字词并按 Alt + Enter 键      |
| 跳转到地址栏                                                 | **Ctrl + l** 或 Alt + d 或 F6        |

* shift+esc 任务管理器

* **ctrl+shift+delete 清缓存必备**
* F12 == ctrl+shift+i



> 搜索技巧

只搜索某个站点： 空格域名

排除某个站点： 空格 -域名



### HTML 刷新

让网页多长时间（秒）刷新自己，或在多长时间后让网页自动链接到其它网页。

```
<meta http-equiv="refresh" content="1;url=http://www.baidu.com/">
or
<body onload="parent.location='http://www.baidu.com'">
```



## Curl

> https://www.ruanyifeng.com/blog/2019/09/curl-reference.html

curl -XPOST localhost:8888/user  -d 'id=42' -d 'name=Tom'  (POST学习！！)

curl -XPOST localhost:8888/user -H 'Content-Type:application/json' -d '{"id":42, "name":"Tom"}'

* 使用-d参数以后，HTTP 请求会自动加上标头Content-Type : application/x-www-form-urlencoded。并且会自动将请求转为 POST 方法，因此可以省略-X POST。
