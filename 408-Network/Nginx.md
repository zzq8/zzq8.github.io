# Nginx

> [狂神Nginx学习笔记](https://www.kuangstudy.com/bbs/1377454518035292162)
>
> Nginx 三大作用：1）动静分离  2）反向代理  3）负载均衡
>
> 特点：一旦启动永远不需要重启，但是我们需要重新加载配置文件 `nginx -s reload`

常用配置：Nginx 代理后会丢失很多东西，比如 host.. 也可以使用 nginx 设置每一个请求的唯一 id

**nginx server_name 多个的话，空格隔开就行**
恰好nginx -t检查不会报错。 跟其它配置混一起，感觉有时生效，有时不生效，排查了好久。现在看来是nginx把 “a.example.com,”当成匹配规则了。

```bash
#主配置文件
http{
    #添加其他配置，注意分号不要丢
   	 include /etc/nginx/conf.d/*.conf;
    }
    
    
#其它配置
server {
    listen       80;
    server_name  1024zzq.com;
    location / {
        proxy_pass   http://101.34.55.204:8080;
        index  index.html index.htm;
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
		#proxy_set_header X-Request-Id $request_id;
    }
#    access_log /logs/1024.zzq.com.access.log;
}
```



# 一、反向代理

## 正向代理 vs 反向代理 的概念

```java
    正向代理：例如翻墙软件，客户端请求到香港的一台服务器，由这台服务器再请求到美国等其它被墙地区的服务器。
    代理客户端的
        客户端 -- 代理服务器 -- 目标服务器
        
        
    反向代理：例如百度的服务器肯定不止一台，你会先访问到代理服务器再给你决定具体让你到哪一台服务器拿数据
    代理服务器端的
    
    反向代理（Reverse Proxy）方式是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个服务器。

```
正向代理：（翻墙）

![正向代理](https://kuangstudy.oss-cn-beijing.aliyuncs.com/bbs/2021/01/25/kuangstudy46bdad36-d3e0-43b0-a223-43360b7e8fc7.png)

反向代理：（百度）

![反向代理](https://kuangstudy.oss-cn-beijing.aliyuncs.com/bbs/2021/01/25/kuangstudy62a15097-6e2a-4dbe-bcf5-f0d7cab81089.png)



# 二、负载均衡

> session问题：SpringCache+Redis 保存Cookie解决

```java
upstream lb{
    server 127.0.0.1:8080 weight=1;
    server 127.0.0.1:8081 weight=1;
}
location / {
    proxy_pass http://lb;
}
```



# 三、动静分离

> 有错误不要蒙头瞎搞，瞎百度。先凝练自己的问题。    第一步是查 log 我就是靠这个分析出了错误！
>
> 问题：假如项目没用Thymeleaf 用的vue 是不是就不需要nginx处理动静分离了

```
upstream gulimall { 
	server 127.0.0.1:88;
}

include conf.d/*.conf;
```

```
server {
    listen       80;
    server_name  *.gulimall.com;
    location /static {
        root html;
    }

    location / { 
      proxy_set_header Host $host; 
      proxy_pass http://gulimall;  
    }
}
```





# 四、其它用途

access.log

看过一篇订阅号，可以通过这个访问日志拿到所有访问者的ip地址  然后写脚本进行限制恶意访问





# 五、配置详解

## 5.1.root & alias

> 场景：想搭建本地静态资源Web服务器
>
> 在Nginx中，`root` 和 `alias` 都是用于定义服务器上的文件路径的指令，但它们之间存在一些区别。

`root` 指令用于定义一个目录作为请求的根目录。当一个请求到达时，Nginx将在指定的根目录下查找相应的文件。以下是一个示例：

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
}
```

在上面的配置中，当用户访问 `example.com` 时，Nginx将在 `/var/www/html` 目录下查找相应的文件并返回给用户。如果用户请求的URI是 `/index.html`，Nginx将尝试找到并返回 `/var/www/html/index.html` 文件。

`alias` 指令用于指定一个别名路径，它用于将请求映射到文件系统中的不同位置，而不是直接将请求与根目录进行拼接。以下是一个示例：

```nginx
server {
    listen 80;
    server_name example.com;
    location /static/ {
        alias /var/www/static/;
    }
}
```

在上面的配置中，当用户访问 `example.com/static/file.txt` 时，Nginx将在 `/var/www/static/` 目录下查找相应的文件并返回给用户。与 `root` 不同的是，`alias` 可以指定一个不同于URI的文件系统路径。（==记得alias最后要带上 /==）

总结一下：

- `root` 指令指定的路径是与URI拼接的，适用于将请求直接映射到文件系统路径。
- `alias` 指令指定了一个别名路径，用于将请求映射到文件系统中的不同位置。





实践：特喵的感觉一样的效果

```nginx
location / {
            #root   html;
            #root /Users/xd/Documents/GitRepo/StudyNotes;
            alias /Users/xd/Documents/GitRepo/StudyNotes/;    #不加 / 会访问不到
            index  index.html index.htm;
        }
```



https://www.cnblogs.com/qingshan-tang/p/12763522.html

```json
五.重点

　　重点是理解alias与root的区别，root与alias主要区别在于nginx如何解释location后面的uri，这使两者分别以不同的方式将请求映射到服务器文件上。

　　alias（别名）是一个目录别名。

　　　　例子：

　　　　　　location /123/abc/ {

　　　　　　　　root /ABC;
　　　　　　}
　　　　　　当请求http://qingshan.com/123/abc/logo.png时，会返回 /ABC/123/abc/logo.png文件，即用/ABC 加上 /123/abc。
 

 

　　root（根目录）是最上层目录的定义。

例子：

　　　　　　location /123/abc/ {

　　　　　　　　alias /ABC;
　　　　　　}
　　　　　　当请求http://qingshan.com/123/abc/logo.png时，会返回 /ABC/logo.png文件，即用/ABC替换 /123/abc。
```

