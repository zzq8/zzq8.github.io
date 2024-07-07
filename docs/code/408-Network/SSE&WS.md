# WebSocket

双向实时通信：填补HTTP在实时通讯的不足

适用低延迟实时通讯

即时消息传递、音视频通话、在线会议和实时数据传输等，可以实现即时的数据传输和交流，不需要用户主动请求或刷新来获取更新数据
协同编辑，想象语雀文档/腾讯文档



How

告诉服务器，我想从HTTP升级成WS

![image-20240706104311784](/Users/xd/Library/Application Support/typora-user-images/image-20240706104311784.png)





为了保持 WebSocket 稳定的长连接，在连接建立之后，服务器和客户端之间通过心跳包来保持连接状态，以防止连接因为长时间没有数据传输而被切断。



一种特殊的数据包不包含任何实际数据，仅用来维持连接状态一个空数据帧

定期发送，确保链接仍然有效，避免长时间没有数据传输而被中断



如果一段时间内没有收到对方的心跳包，就可以认为连接已经断开









扫码原理：HTTP定时轮询（弊端多！）   -》 百度网盘：长轮询

https://www.bilibili.com/video/BV1Rh4y167Uh?t=122.6 【视频挺好】
https://www.bilibili.com/video/BV19N411474y?t=97.0

到网站笔记整理

https://golangguide.top/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80/%E7%BD%91%E7%BB%9C%E5%9F%BA%E7%A1%80/%E6%A0%B8%E5%BF%83%E7%9F%A5%E8%AF%86%E7%82%B9/%E4%B8%BA%E4%BB%80%E4%B9%88%E6%9C%89HTTP%E5%8D%8F%E8%AE%AE%EF%BC%8C%E8%BF%98%E8%A6%81%E6%9C%89websocket%E5%8D%8F%E8%AE%AE.html



**HTTP/1.1 是一种半双工协议，而不是全双工协议。**(设计之初只考虑看看网页，没考虑网页游戏 )

**相比之下，HTTP/2 是全双工协议。HTTP/2 允许同时在同一连接上双向传输多个消息（即多路复用），从而显著提高了传输效率和速度。这使得 HTTP/2 可以更有效地利用网络资源，减少延迟**