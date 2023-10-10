# [http 请求包含哪几个部分（请求行、请求头、请求体）](https://blog.csdn.net/f110300641/article/details/115342356)

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
* Content-Encoding: gzip
* Content-Language: zh-CN
* `Content-Type`: text/html;charset=utf-8
  * 对应请求头的 Accept 告诉你采用的是哪个
* Date: Thu, 12 Jan 2023 08:27:16 GMT
* `Set-Cookie`: xxx
  * 设置和页面关联的Cookie
* Content-Length: 6867
* Keep-Alive: timeout=60 