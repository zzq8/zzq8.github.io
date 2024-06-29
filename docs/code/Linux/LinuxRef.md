---
article: false
---
# LinuxRef

> 把macos 笔记整合进来，然后把环境指南感觉可以删了

### Shell CLI

> https://wangchujiang.com/linux-command/
> 搜 Linux 命令解释好使！！！

* ls -l *jar
  * *号可以匹配任意字符

* 创建并写入内容   `echo "test" > file1.txt`
  * 实测多次运行就是追加的形式，追加行！

* ⭐️ grep "password" /var/log/mysqld.log (强大的文本搜索工具)
  * grep -rF xxx .命令作用  （Linux 查日志命令需要好好学习，MsgBroker 搜 id）
  * cat access.log | grep 'payed'
* ⭐️ `echo "547061946" | sudo -S <command>`
  * 在这个命令中，`<command>` 是你要以超级用户身份运行的实际命令。
  * 将密码作为输入通过管道传递给 `sudo` 命令，并使用 `-S` 选项我猜是 Standard 读取密码。
* ⭐️ export -p 显示所有环境变量
* ⭐️ $ 符号通常用于引用环境变量的值，echo $HOME 有一个HOME的环境变量
* ⭐️ 在macOS终端中，可以使用以下命令来查看当前使用的shell：bash
* ⭐️ linux 自带任务轮询  `crontab -e`
  * crond 是linux下用来周期性的执行某种任务或等待处理某些事件的一个守护进程，与windows下的计划任务类似
* ⭐️ pkill = 进程名    //pkill nginx  #杀死所有的nginx
* ⭐️ lsof -i:8080   //查看8080端口占用


* `nohup java -jar myblog-1.jar --server.port=80 &`
* `tail -f nohup.out`
  * 就可以实时看到这个 jar 的输出运行日志！！！（"f"代表"follow"）
* df -h  可以查linux内存占用，一般看类似 /dev/vda1     ‘/’开头的路径的容量就行！！！
  * 内存不足会导致的场景-XD均已实践以下两点：

    1. **xftp软件上传文件不到云服务器**  	
    2. **mysql 无法创建数据库**
* free -h
* which nginx
  * 如果您不确定 Nginx 的**可执行文件**在哪个目录下，可以通过在终端中输入 which nginx 命令来查找。该命令会返回 Nginx 可执行文件的完整路径。  Nginx 的可执行文件通常位于 /usr/sbin/nginx 目录下   注意不是/usr/bin/nginx
* whereis ==找文件==
* `find / -type d -name "*redis*"`  ==找文件夹==
* kill -9 进程ID（PID）
* ps -e|grep java
* netstat -nlp |grep :80  # 看指定端口 pid，方便后面 kill
* `export vs set` export 类似 win 的 `set MY_VARIABLE=value`，设置一个当前窗口会话的临时变量
  * 注意：export https_proxy=http://127.0.0.1:7890 。。。只在当前 cmd 中生效，一开始不知道！！！





* vim
  * / 关键字，回车即可。此为从文档当前位置向下查找关键字，按n键查找关键字下一个位置；
  * ？关键字，回车即可。此为从文档挡圈位置向上查找关键字，按n键向上查找关键字；





### Tips



* #### 一般写日志输出 sh test.sh > log.txt 其实 > 就等同于 1> 

首先了解下1和2在Linux中代表什么
在Linux系统中0 1 2是一个文件描述符

名称 代码 操作符 Java中表示 Linux 下文件描述符（Debian 为例)

| 名称                 | 代码 | 操作符           | Java中表示                     | Linux 下文件描述符（Debian 为例)             |
| -------------------- | ---- | ---------------- | ------------------------------ | -------------------------------------------- |
| 标准输入(stdin)      | 0    | < 或 <<          | [System.in](http://system.in/) | /dev/stdin -> /proc/self/fd/0 -> /dev/pts/0  |
| 标准输出(stdout)     | 1    | >, >>, 1> 或 1>> | System.out                     | /dev/stdout -> /proc/self/fd/1 -> /dev/pts/0 |
| 标准错误输出(stderr) | 2    | 2> 或 2>>        | System.err                     | /dev/stderr -> /proc/self/fd/2 -> /dev/pts/0 |



* 运行文件，应当前面带上目录。。。不然就是从环境变量找了

![image-20230531110912384](https://images.zzq8.cn/img/202305311109374.png)

#### Linux是多用户操作系统

操作系统按用户数量可以分为单用户系统和多用户系统。比如Windows就是典型的单用户系统，Linux就是典型的多用户系统。

有人可能会问，我的windows下有两个用户，怎么是单用户系统？Windows系统可以存在多个用户，但是多用户不可以同时在线操作（你见过一个pc两个屏幕，分别登录两个用户么？）。==Linux的多用户是指可多用户同时在线==，每打开一个终端就可以用一个新的用户登录。



***



我明白你想了解哪些操作系统允许多个用户同时在线。

在常见的桌面操作系统中，以下操作系统通常允许多个用户同时在线：

1. Windows Server 版本：Windows Server 版本（如 Windows Server 2019）通常支持多个远程用户同时登录和操作系统。这使得多个用户可以通过远程桌面服务 (Remote Desktop Services) 或其他远程连接方式访问服务器，并在同一时间内使用服务器的资源。
2. Linux：Linux 是一个多用户操作系统，支持多个用户同时登录和操作。用户可以通过 SSH (Secure Shell) 或其他远程登录方式访问 Linux 服务器，并在同一时间内使用服务器的资源。
3. macOS：macOS 也是一个多用户操作系统，允许多个用户同时登录和操作。每个用户可以通过登录到其自己的用户账户，并在同一时间内使用计算机的资源。

需要注意的是，对于桌面操作系统（如 Windows 10、macOS），它们通常限制了同时登录的用户数。默认情况下，Windows 10 通常只允许一个用户登录，而 macOS 也有类似的限制。但是，可以通过特定的配置或第三方工具来扩展这些限制，以支持多个用户同时登录。

综上所述，Windows Server 版本和许多 Linux 发行版通常支持多个用户同时在线操作。对于桌面操作系统，虽然它们也支持多用户，但通常有登录限制，除非进行特定的配置或使用第三方工具。



### 权限

[Linux 文件基本属性](https://www.runoob.com/linux/linux-file-attr-permission.html)：看完就知道文件属性了，重点看里面的两幅图！

![img](https://images.zzq8.cn/img/202209082225377.jpeg)

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
## 批量改文件夹权限
chmod -R 777 /mydata/elasticsearch/
```







### Scene

> 备份数据库：#介绍了有问题的原因

```bash
d=`date +%Y%m%d%H%M`
docker exec mysql mysqldump -uroot -pa59964360 --single-transaction --databases upupor > /home/minio/data/blog/SQLBackup/upupor${d}.sql
#此处再接命令会导致上面命令upupor${d}.sql文件名多换行
echo hh
gzip -c /home/minio/data/blog/SQLBackup/upupor${d}.sql > /home/minio/data/blog/SQLBackup/upupor${d}.sql.gz
rm -rf "/home/minio/data/blog/SQLBackup/upupor${d}.sql"
```





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

