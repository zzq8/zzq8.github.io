# Jar包的部署/维护

# 一、部署

​	我部署的是jar包，直接改的端口号80用的是以下命令：

`nohup java -jar myblog-1.jar --server.port=80 &`

> 2023/01/06 补充：执行完上面命令后可以追加 `tail -f nohup.out`
> 就可以实时看到这个 jar 的输出运行日志！！！
>
>
> 在 Linux 中，`tail -f` 是一个常用的命令，用于实时跟踪（追踪）文件的变化并输出新添加的内容。

> **注意：--server.port 需要放 xx.jar 的后面！！！**
>
> nohup java -jar myblog.jar --server.port=80 &
>
>
> java -jar xxx.jar --spring.profiles.active=prod  --person.name=haha 扩宽思路，都可以改
>
> &代表在后台运行。
>
> nohup 意思是不挂断运行命令,当账户退出或终端关闭时,程序仍然运行
>
> 当用 nohup 命令执行作业时，缺省情况下该作业的所有输出被重定向到nohup.out的文件中，除非另外指定了输出文件。

可通过jobs命令查看后台运行任务

```
jobs
```

那么就会列出所有后台执行的作业，并且每个作业前面都有个编号。
如果想将某个作业调回前台控制，只需要 fg + 编号即可。

```
fg 23
```

查看某端口占用的线程的pid

```java
netstat -nlp |grep :80

ps -e|grep java
-ef
-e 显示所有进程。
-f 全格式。可能是full
```

杀死端口

`kill -9 pid`

不过真正部署还是推荐使用NGINX

```shell
linux系统里的VI是编辑文本的命令，在vi里查找相应关键字的方法为：
1./关键字，回车即可。此为从文档当前位置向下查找关键字，按n键查找关键字下一个位置；
2.？关键字，回车即可。此为从文档挡圈位置向上查找关键字，按n键向上查找关键字；
```



# 二、维护

> 今天在网上找了方法可以用，方法总结如下：

​	前言：相信不少小伙伴在项目需要打包上线时都遇到过一种情况，如服务器的地址或是端口变了，需要修改项目里的配置文件或静态资源，于是不得不将jar包拿下来修改再上传，或是重新打包上传，可谓是不胜烦琐，今天教大家一个小技巧，既如何直接在Linux里面修改配置文件和静态资源！

​	过程如下：

	1. 安装unzip    命令：`yum install -y unzip zip`
	2. 直接vim jar包名
	3. /要找的文件名定位修改的文件
	4. 在定位到后，该配置文件会标黄，直接回车进入编辑模式，即可编辑了
	5. 在编辑后wq保存成果，至此就修改完了。

[参考网站](https://www.cnblogs.com/linnuo/p/9084125.html)



## 10、假如生产环境出现CPU占用过高，请谈谈你的分析思路和定位

看阳哥的大厂面试题第2季

[看本地脑图](../JUC/2019互联网面试题第2季.mmap) 有讲这道题目

定位到进程中惹事的线程，通过 jstack 处理定位到问题发生的行数





## win 增量发版

> 🤺 [打包上线](https://blog.csdn.net/qq_36591505/article/details/109805312)：替换jar包中的class文件

替换或者导入jar包时，jar包被自动压缩，springboot规定嵌套的jar包不能在被压缩的情况下存储。



在我们部署项目的时候经常会增量发版，尤其在项目上生产后，我们想增量改一个类文件；不想整个服务重新打jar包，这个时候就需要将jar包中的class文件替换成新的class文件即可。



**实测将jar lib 里面的 jar 搞出来替换再放进去可以**，切记要改 jar 包里面的 jar 包时候要先拿出来！一次只能操作一层 jar 包，否则我估计会压缩。

==而在 jar 包里再打开 jar 包再放然后保存，第二个 jar 好像就会压缩！这时不管用！实测==



发版感觉可以搞个 IO 流，配合 SVN log 路径，集中放到一个包里。这样可以增量替换！







# 三、常用 Linux 命令

> https://wangchujiang.com/linux-command/

在 Linux 系统中，`/sbin` 和 `/bin` 目录分别是系统管理员可执行文件和普通用户可执行文件的存储目录。这两个目录的主要区别在于它们包含的程序对系统运行的关键程度不同。

```bash
#如果您不确定 Nginx 的可执行文件在哪个目录下，可以通过在终端中输入 which nginx 命令来查找。该命令会返回 Nginx 可执行文件的完整路径。
#Nginx 的可执行文件通常位于 /usr/sbin/nginx 目录下   注意不是/usr/bin/nginx
which nginx

#查看8080端口占用
lsof -i:8080
netstat -nlp |grep :80  # 看指定端口 pid，方便后面 kill

# cat find
cat access.log |grep 'payed'


free -m  #查看还有多少 MB 内存可用
free -h  #查不到资料但是这个更好用

#查看正在运行的某个进程
ps aux|grep nginx
ps -ef|grep java


# 重命名
mv file1.txt file2.txt
# 创建多级目录
mkdir -p /mydata/redis/conf
# 创建新的空文件
touch /mydata/redis/conf/redis.conf

su root #切换到root用户
sudo systemctl start docker #以管理员身份

# shell已经为我们准备好了这个续行符 "\"，来把一行命令分解成多行，注意 \ 前面要空格
#v volume  e enviriment 
docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```





# 四、Linux 基础知识

[Linux 文件基本属性](https://www.runoob.com/linux/linux-file-attr-permission.html)：看完就知道文件属性了，重点看里面的两幅图！

![img](http://image.zzq8.cn/img/202209082225377.jpeg)

文件的权限字符为： **-rwxrwxrwx** ， 这九个权限是三个三个一组的！

其中，我们可以使用数字来代表各个权限，各权限的分数对照表如下：

- r:4
- w:2
- x:1

每种身份(owner/group/others)各自的三个权限(r/w/x)分数是需要累加的，例如当权限为： **-rwxrwx---** 分数则是：

- owner = rwx = 4+2+1 = 7
- group = rwx = 4+2+1 = 7
- others= --- = 0+0+0 = 0

所以等一下我们设定权限的变更时，该文件的权限数字就是 **770**。变更权限的指令 chmod 的语法是这样的：

```
chmod [-R] xyz 文件或目录
chmod -R 770 /mydata/elasticsearch/
```

常用：

```yaml
# 批量改文件夹权限
chmod -R 777 /mydata/elasticsearch/
```





# 五、Shell

![image-20230531110912384](http://image.zzq8.cn/img/202305311109374.png)





> 为什么单独运行java -cp ./*:../app/* com.bokesoft.yes.dev.DevSuite会报以下错误zsh: no matches found: ./*:../app/*
> 但是把这行单独放到一个.sh文件运行就又可以

这个错误是由于在单独运行`java -cp ./*:../app/* com.bokesoft.yes.dev.DevSuite`命令时，所使用的shell（比如zsh）会对通配符（`*`）进行扩展，但是在当前目录下没有匹配的文件时，会报错。

在单独执行命令时，如果当前目录下没有符合`./*`和`../app/*`通配符模式的文件或目录，shell会报错并显示"zsh: no matches found"。

然而，当你将这行命令放入一个.sh文件中并执行该文件时，shell会将整个命令作为字符串传递给解释器，并且不会对通配符进行扩展。因此，在脚本文件中执行时，通配符不会引发错误。

如果你想在命令行中单独运行这个命令而不报错，你可以使用引号将通配符模式括起来，以阻止shell扩展通配符。例如：

```
java -cp './*:../app/*' com.bokesoft.yes.dev.DevSuite //:号应该是分隔符，系统可能都不一样   这里后的app好像没用就用bat文件里的就行
```

这样，通配符将被视为字符串的一部分，而不会被shell进行扩展。

