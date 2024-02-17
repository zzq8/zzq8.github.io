> 起因: 使用了一下云服务器的Redis开了6379端口写了点SpringBoot整合Redis的测试代码，结果用着用着突然连接断了，且腾讯云发来警告CPU和带宽被跑满。Redis没设密码结合百度发现中招了(可能被肉鸡了)，花了挺多时间不想再搞了就直接重装系统了，正好花点时间写一篇环境的部署的总结。

# Linux环境部署(JRE、MySQL、Nginx)

> 后话：今天学了用Docker，不过自己写的这篇很多东西还可以借鉴

# 一、JRE

Oracle 下个JDK还需要登录，下载超慢... 所以用国内的镜像源。

[国内下载镜像地址](https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/8/jre/x64/linux/)

1. 解压  `tar -zxvf xxx`
2. 环境变量配置：`vi /etc/profile`

```bash
export JRE_HOME=/home/environment/jdk8u312-b07-jre
export CLASSPATH=$JRE_HOME/lib/rt.jar:$JRE_HOME/lib/ext
export PATH=$PATH:$JRE_HOME/bin
```

3. 添加完后执行 ：source /etc/profile   （重置环境变量，使得修改生效）
4. 查看是否成功

![image-20220101201225905](https://gitee.com/codezzq/blogImage/raw/master/img/image-20220101201225905.png)

附录：

[Oracle JDK与OpenJDK的区别](https://www.cnblogs.com/wangzfChina/p/13065902.html?ivk_sa=1024320u)

[Linux /etc/profile文件详解](https://www.cnblogs.com/alliance/p/7093784.html)

[linux source命令](https://www.cnblogs.com/xzpin/p/11072787.html)

# 二、MySQL

## 1. 安装

1. 下载并安装MySQL官方的 [Yum](https://so.csdn.net/so/search?q=Yum) Repository

   `wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm`

2.  使用上面的命令就直接下载了安装用的Yum Repository，大概25KB的样子，然后就可以直接yum安装

   `yum -y install mysql57-community-release-el7-10.noarch.rpm`

3. 之后就开始安装MySQL服务器

   `yum -y install mysql-community-server`

## 2. 设置

1.  首先启动MySQL `systemctl start  mysqld.service`，查看MySQL运行状态 `systemctl status mysqld.service`

![image-20220101204701233](https://gitee.com/codezzq/blogImage/raw/master/img/image-20220101204701233.png)

2. 此时MySQL已经开始正常运行，不过要想进入MySQL还得先找出此时root用户的密码，通过如下命令可以在日志文件中找出密码：`grep "password" /var/log/mysqld.log`

![image-20220101204949194](https://gitee.com/codezzq/blogImage/raw/master/img/image-20220101204949194.png)

3. 通过默认密码进入数据库，此时不能做任何事情，因为MySQL默认必须修改密码之后才能操作数据库

4. 修改默认密码 `ALTER USER 'root'@'localhost' IDENTIFIED BY 'new password';` 其中‘new password’替换成你要设置的密码，注意:密码设置必须要大小写字母数字和特殊符号（,/';:等）,不然不能配置成功

   * MySQL版本5.7.6版本以前用户可以使用如下命令：**[实测有用](https://blog.csdn.net/muziljx/article/details/81541896)**：场景提示密码过期需修改

     ```delphi
     mysql> SET PASSWORD = PASSWORD('123456'); 
     ```

> ps: 当然想设简单一点的密码也可以
>
> 解决办法：
>
> > 查看 mysql 初始的密码策略，`SHOW VARIABLES LIKE 'validate_password%';`
>
> ![image-20220101205730050](https://gitee.com/codezzq/blogImage/raw/master/img/image-20220101205730050.png)
>
> 关于 mysql 密码策略相关参数；
> 	1）、validate_password_length  固定密码的总长度；
> 	2）、validate_password_dictionary_file 指定密码验证的文件路径；
> 	3）、validate_password_mixed_case_count  整个密码中至少要包含大/小写字母的总个数；
> 	4）、validate_password_number_count  整个密码中至少要包含阿拉伯数字的个数；
> 	5）、validate_password_policy 指定密码的强度验证等级，默认为 MEDIUM；
> 		关于 validate_password_policy 的取值：
> 		0/LOW：只验证长度；
> 		1/MEDIUM：验证长度、数字、大小写、特殊字符；
> 		2/STRONG：验证长度、数字、大小写、特殊字符、字典文件；
> 	6）、validate_password_special_char_count 整个密码中至少要包含特殊字符的个数；
>
> > 例如：
> >
> > 1. `set global validate_password_policy=LOW;` 只验证长度
> >
> > 2. `set global validate_password_length=6; ` 固定密码长度只要6位
> > 3. `ALTER USER 'root'@'localhost' IDENTIFIED BY '123456'; ` 修改密码

## 3. 开启mysql的远程访问

1. 执行以下命令开启远程访问限制（注意：下面命令开启的IP是 所有的，如要开启192.168.0.1，用IP代替%）：`grant all privileges on *.* to 'root'@'%' identified by 'password' with grant option;`
2. 刷新权限表 `flush privileges; `
3. 按Ctrl+D退出数据库后输入 `service mysqld restart` 重启mysql服务

## 4. 为firewalld添加开放端口

1. 预备知识

```bash
systemctl status firewalld #查看firewalld状态
systemctl start firewalld #开启防火墙
systemctl stop firewalld #关闭防火墙
```

2. 添加mysql端口3306和Tomcat端口8080

```bash
firewall-cmd --zone=public --add-port=3306/tcp --permanent
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --reload #重新载入
```

## 5. 更改mysql的语言

1. 首先重新登录mysql，然后输入status，可以看到，红色框框处不是utf-8

![img](https://images.zzq8.cn/img/202207241646499.png)

2. 因此我们先退出mysql，然后再到etc目录下的my.cnf文件下修改一下文件内容 `vim /etc/my.cnf`

![img](https://images.zzq8.cn/img/202207241646626.png)

```bash
#开头处
[client]
default-character-set=utf8mb4

#结尾处
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
```

3. 保存更改后的my.cnf文件后，重启下mysql `service mysqld restart`，然后进入mysql输入status再次查看，你就会发现变化啦

![img](https://images.zzq8.cn/img/202207241647349.png)

ps: 可以到Windows下用cmd命令启动mysql啦，个人喜欢用Navicat

## 6. Linux-Mysql导入sql文件

1. 创建空数据库 `create database xx`
2. `use xx`
3. 导入sql文件 `source /home/xx.sql;`  ==注意：在 Windows 下路径也要变成左斜杠==

#### <font color=red>实测：运行 SQL 文件的时长，取决于外存的好坏。例如 C 盘是固体对比其他盘机械硬盘差距很大！</font>

70分钟 vs 2分钟

## 附录

[wget 是一个下载文件的工具](https://www.cnblogs.com/ftl1012/p/9265699.html)

[rpm是一个包管理器，用于生成、安装、查询、核实、更新以及卸载单个软件包。](https://www.cnblogs.com/diantong/p/10245526.html)

[Linux grep 命令](https://www.runoob.com/linux/linux-comm-grep.html)

[mysql使用utf8mb4经验吐血总结](https://blog.csdn.net/qq_17555933/article/details/101445526)

[CentOS7安装MySQL（完整版）](https://blog.csdn.net/qq_36582604/article/details/80526287)

[MySQL 5.7 解压版 安装教程(图文详细)【Windows】](https://www.cnblogs.com/horvey/p/10151706.html)



# 三、Nginx

## 1. 前言

目的：使用NGINX反向代理，将80端口转发到8080端口，反向代理（Reverse Proxy）方式是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个服务器。具体看图。

**正向代理**（代理客户端）：

场景：科学上网，客户端请求到香港的一台服务器，由这台服务器再请求到美国等其它被墙地区的服务器。

![正向代理](https://gitee.com/codezzq/blogImage/raw/master/img/kuangstudy46bdad36-d3e0-43b0-a223-43360b7e8fc7.png)

**反向代理**（代理服务器端）：

场景：例如百度的服务器肯定不止一台，你会先访问到代理服务器再给你决定具体让你到哪一台服务器拿数据。

![反向代理](https://gitee.com/codezzq/blogImage/raw/master/img/kuangstudy62a15097-6e2a-4dbe-bcf5-f0d7cab81089.png)



## 2. 具体操作

1. 下载安装Nginx `yum install nginx`
2. 加入开机启动 `systemctl enable nginx`
3. 使用命令 `find / -name "nginx.conf"` 进行查找nginx配置文件，进行配置 `vim /etc/nginx/nginx.conf` 
4. 批量注释服务配置如图（vim命令看附录），因为一个服务器一般会有很多个服务要跑，如果直接在服务配置修改的话就不方便拓展，这里将server注释，也就是不用这个server，而是在include另外添加配置文件。咱们可以理解为nginx.conf是一个总配置文件，include所包含的是子配置文件，如果要添加一个服务，就可以再/etc/nginx/conf.d/目录下去添加一个子配置文件，这里也是用的这种方式。

![image-20220102103441091](https://gitee.com/codezzq/blogImage/raw/master/img/image-20220102103441091.png)

5. 在/etc/nginx/conf.d/目录下创建*.conf文件，我这里命名为myblog.conf `vim /etc/nginx/conf.d/myblog.conf` 填入以下数据：

```bash
server {
    listen       80;  #监听80端口
    server_name  1024zzq.com;  #转发到哪个地址
    location / {
        proxy_pass   http://101.34.55.204:8080;  #代理到哪个地址
        index  index.html index.htm;
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
#    access_log /logs/1024.zzq.com.access.log; #表示记录日志信息
}
```

6. 启动Nginx `systemctl start nginx`



# 四、其他附录

[什么是YUM](https://blog.csdn.net/weixin_34055910/article/details/92964753)

[YUM](http://yum.baseurl.org/)(Yellowdog Updater Modified)是Fedora、CentOS、RedHat中的软件包管理器。基于 RPM 包管理，YUM通过分析RPM header数据，自动处理依赖关系，从指定服务器自动下载安装所有依赖的软件包。

[YUM其他介绍](http://c.biancheng.net/view/824.html)

[linux中yum与rpm区别（重点）](https://www.cnblogs.com/ryanzheng/p/11322375.html)

[usr 是 unix system resources 的缩写](http://www.360doc.com/content/18/0412/15/11935121_745034658.shtml)



