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
