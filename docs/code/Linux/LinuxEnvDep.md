---
article: false
updated: 2025-09-13 11:09:12
---
# LinuxEnvDep

> 以前碰过 Redis 没设密码被挖矿，现在设成简单密码依旧。。。

## 1.基础环境

### 1.1.[Docker](https://www.runoob.com/docker/centos-docker-install.html)

> https://www.runoob.com/docker/ubuntu-docker-install.html
>
> 看这个装

docker logs nginx

看报错超有用, 比如起不来看下原因是config那个配置错了

```
/docker-entrypoint.sh: Configuration complete; ready for start up
nginx: [emerg] host not found in upstream "host.docker.internal" in /etc/nginx/conf.d/default.conf:11
```





1. 查看 Docker 网桥默认网关（宿主机 IP）：

   ip addr show docker0

   一般是: 172.17.0.1

==todo 研究 ip addr==



> ==为什么要用172.17.0.1指向宿主机==           这是重点内容, 不然 nginx config 就会写错 (不能用 127.0.0.1 要用 172.17.0.1)
>
> 1️⃣ 背景：Docker 网络隔离

- Docker 容器默认使用 **bridge 网络模式**（桥接网络）
- 每个容器有自己的私有 IP（比如 172.17.0.2），容器之间和宿主机是通过网桥 docker0 通信
- **容器无法直接通过 localhost 访问宿主机**，因为 localhost 对容器来说是容器自己



> 172.17.0.1 是保留的指向宿主机的吗, 剩余的172.17.0.2~172.17.255.255 (/16 子网掩码) 是docker容器自己的私有ip吗

```
宿主机(docker0)   172.17.0.1
    │
    │ bridge 网络
    │
容器1   172.17.0.2
容器2   172.17.0.3
容器3   172.17.0.4
...
```

172.17.0.1 不是保留 IP，只是 Docker 默认桥接网关 IP



启动 docker 容器的时候映射端口,  然后就可以用  172.17.0.2(**宿主机 IP**):5244  访问了





> 实测用idea操作Docker比用 xshell 舒服太多了！！！

> 理解成 Linux 和 Docker容器（**可以理解为一个完整的Linux**【容器的 bin/bash 里没有 wget，外面 linux有】）是隔离的，所以需要端口映射、目录挂载！！！
>
> 一个镜像可以创建多个容器
>
> 容器可  --restart=always 
>
> ==当你在Docker容器中进行文件挂载时，宿主机必须存在这个文件==     实测目录不用会自己新建

curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

systemctl start docker

docker search jdk

为了永久性保留更改，您可以修改 `/etc/docker/daemon.json` 文件并添加上 registry-mirrors 键值。

```csharp
{
	"registry-mirrors": ["https://registry.docker-cn.com","https://pee6w651.mirror.aliyuncs.com"]
}

```

修改保存后重启 Docker 以使配置生效。

`systemctl restart docker`



### 1.2.JAVA

1. 拉取指定的版本 `docker pull java:8`

2. 运行上面拉去的镜像成容器 `docker run -d -it --name java java:8`    【必须加 -it 否则STATUS为Exited】

- `-d`：（daemon）  守护进程【后台运行】
  - 如果不加`-d`选项，表示在前台（foreground）模式下运行容器。这意味着容器的输出将直接显示在当前终端上，并且您将无法继续在该终端中执行其他命令，直到容器停止。【前台运行】
- `-it`：表示分配一个伪终端（pseudo-TTY），并将其与容器的标准输入（stdin）关联起来，以便可以与容器进行交互。
  - `-it`参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
  - 这意味着你可以在启动的Java 8容器中进行交互式操作
  - ==xd 实测如果我不加这个容器run完状态是 exit==
  - interactive + tty（Linux 终端(*TTY*). *TTY* 是Teletype 或Teletypewriter 的缩写） 我这里理解为Terminal更好记
    - shell 交互命令的接口  所以最后还可以给 bash | /bin/bash
- `--name java`：表示为容器指定一个名称，这里命名为"java"。
- `java:8`：表示使用名为"java"的Docker镜像的版本8。

3. docker exec -it java bash

### 1.3.MySQL

1. `docker pull mysql:5.7`

2. ```bash
   docker run -p 3306:3306 --name mysql \
   -v /root/mysql/log:/var/log/mysql \
   -v /root/mysql/data:/var/lib/mysql \
   -v /root/mysql/conf:/etc/mysql \
   -e MYSQL_ROOT_PASSWORD=123456 \
   -d mysql:5.7
   ```

3. `docker exec -it mysql bash`



##### 修改密码

修改默认密码 `ALTER USER 'root'@'localhost' IDENTIFIED BY 'new password';` 其中‘new password’替换成你要设置的密码，注意:密码设置必须要大小写字母数字和特殊符号（,/';:等）,不然不能配置成功

* MySQL版本5.7.6版本以前用户可以使用如下命令：**[实测有用](https://blog.csdn.net/muziljx/article/details/81541896)**：场景提示密码过期需修改

  ```delphi
  mysql> SET PASSWORD = PASSWORD('123456'); 
  ```



##### 开启mysql的远程访问-Navicat

1. 执行以下命令开启远程访问限制（注意：下面命令开启的IP是 所有的，如要开启192.168.0.1，用IP代替%）：`grant all privileges on *.* to 'root'@'%' identified by 'password' with grant option;`
2. 刷新权限表 `flush privileges; `
3. 按Ctrl+D退出数据库后输入 `service mysqld restart` 重启mysql服务





### 1.4.Redis

> 如果要通过配置文件启动 Redis 就需要先创好文件！

1. `docker pull redis`

2. ```bash
   docker run -p 6379:6379 --name redis \
   -v /root/redis/data:/data \
   -v /root/redis/conf:/etc/redis \
   --requirepass 'Redis密码' \
   -d redis
   ```

3. `docker exec -it redis bash`

4. Redis 从cli中设置密码 `config set requirepass xxx`



### 1.5.Nginx



#### compose 方式

```
👌 明白了，我给你一份 完整的推荐版 docker-compose.yml，并且附上新建目录、导出配置文件的命令，保证你一步一步跑起来没坑。

⸻

🔹 1. 新建目录结构

在你的 VPS 上执行：

mkdir -p ~/nginx/{conf/conf.d,html,log,conf/ssl}


⸻

🔹 2. 导出 Nginx 默认配置

把容器里的默认配置拷贝到宿主机：

# 导出主配置文件
docker run --rm nginx cat /etc/nginx/nginx.conf > ~/nginx/conf/nginx.conf

# 导出默认虚拟主机配置
docker run --rm nginx cat /etc/nginx/conf.d/default.conf > ~/nginx/conf/conf.d/default.conf


⸻

🔹 3. 创建 docker-compose.yml

在 ~/nginx 目录下执行：

cat > ~/nginx/docker-compose.yml <<EOF
version: '3.9'

services:
  nginx:
    image: nginx:latest
    container_name: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # 主配置文件 (只读)
      - ./conf/nginx.conf:/etc/nginx/nginx.conf:ro

      # 虚拟主机配置目录 (只读)
      - ./conf/conf.d:/etc/nginx/conf.d:ro

      # 网站根目录 (只读)
      - ./html:/usr/share/nginx/html:ro

      # 日志目录 (可写)
      - ./log:/var/log/nginx

      # SSL 证书目录 (只读)
      - ./conf/ssl:/etc/nginx/ssl:ro
EOF


⸻

🔹 4. 启动 Nginx

cd ~/nginx
docker-compose up -d


⸻

🔹 5. 测试

echo "<h1>Hello from Docker Nginx</h1>" > ~/nginx/html/index.html
curl http://localhost

浏览器访问 http://你的服务器IP，应该能看到 Hello from Docker Nginx。

⸻

⚡ 推荐习惯：
	•	以后改配置只要编辑 ~/nginx/conf/conf.d/*.conf 就行，别直接改 nginx.conf。
	•	SSL 证书放在 ~/nginx/conf/ssl/，然后在 conf.d 里写 server { listen 443 ssl; ... }。

⸻

要不要我顺便给你一个 带 HTTPS 的 default.conf 模板，你只要把证书文件放进去就能跑 HTTPS？
```

* 使用 Docker 自带的 Compose 插件
  * docker compose up -d
* cat <<EOF > file.txt
  第一行内容
  第二行内容
  第三行内容
  EOF







```
server {
    listen 80;
    server_name rich.233377.xyz;

    # 访问日志和错误日志
    access_log /var/log/nginx/rich.access.log;
    error_log  /var/log/nginx/rich.error.log;

    # 反向代理到本机 Python 服务
    location / {
        proxy_pass http://172.17.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- 如果不支持，你可以用 **宿主机 IP** 替代，比如 proxy_pass http://172.17.0.1:8001;
  - 







> 注意 `nginx.conf` 是个文件不是文件夹  `touch ~/nginx/conf/nginx.conf`
>
> 再把这个文件填上网上的内容了就可以了，但是挂载的这些其他目录还是空的改没东西还是没东西
>
> ```
> /roc/docker/nginx  -- 自己的根目录
> ├── nginx.conf -- 主配置文件
> ├── html 
> 	└──  index.html -- 存放 nginx 默认 index.html
> ├── conf.d 
> 	└──  default.conf -- 默认的子配置文件
> └── log -- nginx 日志存放目录
> 	└──  xxx.log  
> ```

1. `docker pull nginx`

2. 自己宿主机新建一个对应的文件并从网上给上默认内容 `touch ~/nginx/conf/nginx.conf`

3. ```bash
   docker run -d -p 443:443 -p 80:80 \
   --name nginx \
   -v ~/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
   -v ~/nginx/conf/conf.d:/etc/nginx/conf.d \
   -v ~/nginx/log:/var/log/nginx \
   -v ~/nginx/html:/usr/share/nginx/html \
   -v ~/nginx/conf/ssl:/etc/nginx/ssl \
   nginx
   ```

4. html 也可以自己随便给个index.html文件 【非必须】

### 1.6.MinIO

> 9090是web网页后台，9000是url请求地址
>
> Buckets-Access Policy 记得改  public

1. `docker pull minio/minio`

2. mkdir -p ~/minio/config
   mkdir -p ~/minio/data

3. ```
   docker run -p 9000:9000 -p 9090:9090 \
        --net=host \
        --name minio \
        -d --restart=always \
        -e "MINIO_ACCESS_KEY=minioadmin" \
        -e "MINIO_SECRET_KEY=minioadmin" \
        -v ~/minio/data:/data \
        -v ~/minio/config:/root/.minio \
        minio/minio server \
        /data --console-address ":9090" -address ":9000"
   ```

   * `--net=host`: 使用主机网络模式，将容器与主机共享网络命名空间，使得容器可以通过主机的IP地址访问网络。
   * `minio/minio server`: 使用minio/minio镜像来运行MinIO服务器。
   * `/data --console-address ":9090" -address ":9000"`: 指定MinIO服务器的数据存储路径为`/data`，Web控制台的访问地址为":9090"，MinIO服务器的访问地址为":9000"。

4. http://101.34.55.204:9090/





## 2.upupor

Navicat连接，新建空数据库



> 推荐直接 idea 连接服务器的 Docker 省时省力！！！   直接idea运行Dockerfile

1. 使用 Dockerfile 定制镜像

   * `vim Dockerfile` 

   * ```
     FROM java:8 
     ADD upupor-web-1.0.0.jar  /blog/upupor-web-1.0.0.jar
     EXPOSE 2020
     ENTRYPOINT ["java","-jar","/blog/upupor-web-1.0.0.jar"]
     ```

   * `docker build -t blog .`

2. 即可看到  `docker imagse`

3. 需要用到Env variment相当于普通 java -jar之前的export步骤**（注意docker run jar的话，像mysql、redis的ip地址不能为localhost必须为服务器ip！！！）**

   1. `vim .docker_blog_env`

4. `docker run -d --name=upupor -p 2020:2020 blog`

   * 如果配置文件没用敏感信息就  --env-file ~/blog/.docker_blog_env blog
   * 我这里直接用了 application.properties 里面写好了敏感信息所以上述这部省略





## Git-备份

### [1.前置配置](https://blog.csdn.net/weixin_42310154/article/details/118340458)

> 云服务器的 Git 我捣鼓了好久~
> 由于云服务器网络、地区CN   http协议去连 Github 有点抽风，固我第一次尝试了 ssh 协议！！！   好使

1. 生成ssh key  `ssh-keygen -t rsa -C "xxx@xxx.com"` 
2. 获取ssh key公钥内容（id_rsa.pub）   `cat ~/.ssh/id_rsa.pub`
3. 把 cat 到的公钥内容放入 Github SSH配置里
4. 验证是否设置成功   `ssh -T git@github.com`

#### 通俗解释！！

重点来了：**一定要知道ssh key的配置是针对每台主机的！**，比如我在某台主机上操作git和我的远程仓库，想要push时不输入账号密码，走ssh协议，就需要配置ssh key，放上去的key是**当前主机的ssh公钥**。那么如果我换了一台其他主机，想要实现无密登录，也就需要重新配置。

下面解释开头提出的问题：
（1）为什么要配？
配了才能实现push代码的时候不需要反复输入自己的github账号密码，更方便
（2）每使用一台主机都要配？
是的，每使用一台新主机进行git远程操作，想要实现无密，都需要配置。并不是说每个账号配一次就够了，而是每一台主机都需要配。
（3）配了为啥就不用密码了？
因为配置的时候是把当前主机的公钥放到了你的github账号下，相当于当前主机和你的账号做了一个关联，你在这台主机上已经登录了你的账号，此时此刻github认为是该账号主人在操作这台主机，在配置ssh后就信任该主机了。所以下次在使用git的时候即使没有登录github，也能直接从本地push代码到远程了。当然这里不要混淆了，你不能随意push你的代码到任何仓库，你只能push到你自己的仓库或者其他你有权限的仓库！



### 2.备份 MinIO

> 场景：备份 MinIO 的文件到 Git
>
> 1. 使用 `crontab -e` 
> 2. 一分钟执行一次  `* * * * * /home/minio/data/blog/test.sh  >> /home/minio/data/test.log 2>&1`
>
> 问题：我需要保证我的shell脚本的git命令 auth 这一步
>
> ​	手动一行行命令的时候用 `http` 可以：`git remote set-url origin http://github.com/zzq8/MinIO-upupor.git`
>
> ​	但是shell中批量总是报错！！！auth问题，网上冲浪发现用ssh好使   1）需要云服务器加私钥 2）把公钥加到Git
> ​	`git remote set-url origin git@github.com:zzq8/MinIO-upupor.git`

test.sh:

```bash
cd /home/minio/data/blog
git pull origin master
git add .
git commit -m 'backup upupor static resource'
git push
```



### 3.备份 sql

```bash
d=`date +%Y%m%d%H%M`
## 因为upupor的mysql数据库服务部署在docker容器中,所以`mysqldump`在容器中执行,然后将备份好的文件写到宿主主机地址      > 后的目录需要提前建好
docker exec mysql mysqldump -uroot -pxxx --single-transaction --databases upupor > /home/minio/data/blog/SQLBackup/upupor${d}.sql
gzip -c /home/minio/data/blog/SQLBackup/upupor${d}.sql > /home/minio/data/blog/SQLBackup/upupor${d}.sql.gz
rm -rf /home/minio/data/blog/SQLBackup/upupor${d}.sql
```



`00 03 * * * /home/minio/data/blog/SQLBackup/sqlbackup.sh  >> /home/minio/data/sqlbackup.log 2>&1`











## 



***



## 

## 







## ---下面是手工---

## Linux环境部署(JRE、MySQL、Nginx)

> 起因: 使用了一下云服务器的Redis开了6379端口写了点SpringBoot整合Redis的测试代码，结果用着用着突然连接断了，且腾讯云发来警告CPU和带宽被跑满。Redis没设密码结合百度发现中招了(可能被肉鸡了)，花了挺多时间不想再搞了就直接重装系统了，正好花点时间写一篇环境的部署的总结。



> 后话：今天学了用Docker，不过自己写的这篇很多东西还可以借鉴

## 一、JRE

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

## 二、MySQL

### 1. 安装

1. 下载并安装MySQL官方的 [Yum](https://so.csdn.net/so/search?q=Yum) Repository

   `wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm`

2.  使用上面的命令就直接下载了安装用的Yum Repository，大概25KB的样子，然后就可以直接yum安装

   `yum -y install mysql57-community-release-el7-10.noarch.rpm`

3. 之后就开始安装MySQL服务器

   `yum -y install mysql-community-server`

### 2. 设置

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

### 3. 开启mysql的远程访问

1. 执行以下命令开启远程访问限制（注意：下面命令开启的IP是 所有的，如要开启192.168.0.1，用IP代替%）：`grant all privileges on *.* to 'root'@'%' identified by 'password' with grant option;`
2. 刷新权限表 `flush privileges; `
3. 按Ctrl+D退出数据库后输入 `service mysqld restart` 重启mysql服务

### 4. 为firewalld添加开放端口

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

### 5. 更改mysql的语言

1. 首先重新登录mysql，然后输入status，可以看到，红色框框处不是utf-8

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202207241646499.png)

2. 因此我们先退出mysql，然后再到etc目录下的my.cnf文件下修改一下文件内容 `vim /etc/my.cnf`

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202207241646626.png)

```bash
#开头处
[client]
default-character-set=utf8mb4

#结尾处
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
```

3. 保存更改后的my.cnf文件后，重启下mysql `service mysqld restart`，然后进入mysql输入status再次查看，你就会发现变化啦

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202207241647349.png)

ps: 可以到Windows下用cmd命令启动mysql啦，个人喜欢用Navicat

### 6. Linux-Mysql导入sql文件

1. 创建空数据库 `create database xx`
2. `use xx`
3. 导入sql文件 `source /home/xx.sql;`  ==注意：在 Windows 下路径也要变成左斜杠==

##### <font color=red>实测：运行 SQL 文件的时长，取决于外存的好坏。例如 C 盘是固体对比其他盘机械硬盘差距很大！</font>

70分钟 vs 2分钟

### 附录

[wget 是一个下载文件的工具](https://www.cnblogs.com/ftl1012/p/9265699.html)

[rpm是一个包管理器，用于生成、安装、查询、核实、更新以及卸载单个软件包。](https://www.cnblogs.com/diantong/p/10245526.html)

[Linux grep 命令](https://www.runoob.com/linux/linux-comm-grep.html)

[mysql使用utf8mb4经验吐血总结](https://blog.csdn.net/qq_17555933/article/details/101445526)

[CentOS7安装MySQL（完整版）](https://blog.csdn.net/qq_36582604/article/details/80526287)

[MySQL 5.7 解压版 安装教程(图文详细)【Windows】](https://www.cnblogs.com/horvey/p/10151706.html)



## 三、Nginx

### 1. 前言

目的：使用NGINX反向代理，将80端口转发到8080端口，反向代理（Reverse Proxy）方式是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个服务器。具体看图。

**正向代理**（代理客户端）：

场景：科学上网，客户端请求到香港的一台服务器，由这台服务器再请求到美国等其它被墙地区的服务器。

![正向代理](https://gitee.com/codezzq/blogImage/raw/master/img/kuangstudy46bdad36-d3e0-43b0-a223-43360b7e8fc7.png)

**反向代理**（代理服务器端）：

场景：例如百度的服务器肯定不止一台，你会先访问到代理服务器再给你决定具体让你到哪一台服务器拿数据。

![反向代理](https://gitee.com/codezzq/blogImage/raw/master/img/kuangstudy62a15097-6e2a-4dbe-bcf5-f0d7cab81089.png)



### 2. 具体操作

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
##    access_log /logs/1024.zzq.com.access.log; #表示记录日志信息
}
```

6. 启动Nginx `systemctl start nginx`



## 四、其他附录

[什么是YUM](https://blog.csdn.net/weixin_34055910/article/details/92964753)

[YUM](http://yum.baseurl.org/)(Yellowdog Updater Modified)是Fedora、CentOS、RedHat中的软件包管理器。基于 RPM 包管理，YUM通过分析RPM header数据，自动处理依赖关系，从指定服务器自动下载安装所有依赖的软件包。

[YUM其他介绍](http://c.biancheng.net/view/824.html)

[linux中yum与rpm区别（重点）](https://www.cnblogs.com/ryanzheng/p/11322375.html)

[usr 是 unix system resources 的缩写](http://www.360doc.com/content/18/0412/15/11935121_745034658.shtml)



