# WebSocket

### 优势

**双向实时通信**，特有的ws协议，可跨域
填补HTTP在实时通讯的不足

### 场景

适用低延迟实时通讯

即时消息传递、音视频通话、在线会议和实时数据传输等，可以实现即时的数据传输和交流，不需要用户主动请求或刷新来获取更新数据
协同编辑，想象语雀文档/腾讯文档

### 使用

如果这时候是**想建立 websocket 连接**，就会在 HTTP 请求里带上一些**特殊的 header 头**     告诉服务器，我想从HTTP升级成WS

```json
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: T2a6wZlAwhgQNqruZ2YUyg==\r\n
```

* header 头的意思是，浏览器想**升级协议（Connection: Upgrade）**，并且**想升级成 websocket 协议（Upgrade: websocket）**。

* 同时带上一段**随机生成的 base64 码（Sec-WebSocket-Key）**，发给服务器。
  如果服务器正好支持升级成 websocket 协议。就会走 websocket 握手流程，同时根据客户端生成的 base64 码，用某个**公开的**算法变成另一段字符串，放在 HTTP 响应的 `Sec-WebSocket-Accept` 头里，同时带上`101状态码`，发回给浏览器。

  > http 状态码=200（正常响应）的情况，大家见得多了。101 确实不常见，它其实是指**协议切换**。

* 

![image-20240706104311784](/Users/xd/Library/Application Support/typora-user-images/image-20240706104311784.png)

### 心跳机制

为了保持 WebSocket 稳定的长连接，在连接建立之后，服务器和客户端之间通过心跳包来保持连接状态，以防止连接因为长时间没有数据传输而被切断。

一种特殊的数据包不包含任何实际数据，仅用来维持连接状态一个空数据帧

定期发送，确保链接仍然有效，避免长时间没有数据传输而被中断

如果一段时间内没有收到对方的心跳包，就可以认为连接已经断开









扫码原理：HTTP定时轮询（弊端多！）   -》 百度网盘：长轮询

https://www.bilibili.com/video/BV1Rh4y167Uh?t=122.6 【视频挺好】
https://www.bilibili.com/video/BV19N411474y?t=97.0

到网站笔记整理

https://golangguide.top/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80/%E7%BD%91%E7%BB%9C%E5%9F%BA%E7%A1%80/%E6%A0%B8%E5%BF%83%E7%9F%A5%E8%AF%86%E7%82%B9/%E4%B8%BA%E4%BB%80%E4%B9%88%E6%9C%89HTTP%E5%8D%8F%E8%AE%AE%EF%BC%8C%E8%BF%98%E8%A6%81%E6%9C%89websocket%E5%8D%8F%E8%AE%AE.html



### 醍醐灌顶

**HTTP/1.1 是一种半双工协议，而不是全双工协议。**(设计之初只考虑看看网页，没考虑网页游戏 )

**相比之下，HTTP/2 是全双工协议。HTTP/2 允许同时在同一连接上双向传输多个消息（即多路复用），从而显著提高了传输效率和速度。这使得 HTTP/2 可以更有效地利用网络资源，减少延迟**





# SSE

> ALMP 大语言模型平台用到 - 用户给Bot发消息

Web服务端推送技术

单向通信，http GET实际还是它，不可跨域