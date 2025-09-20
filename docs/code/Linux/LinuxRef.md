---
article: false
updated: 2025-09-20 17:11:51
---
# LinuxRef

### linux

> su (Switch User)   sudo (SuperUser DO)

```
# su:
- 需要知道目标用户的密码,    root 是系统最高权限用户，可以无密码切换到任何用户
- 完全切换到新用户
- 适合长期使用另一个用户身份

# sudo:
- 需要知道当前用户的密码
- 临时以其他用户身份执行命令
- 需要在 sudoers 中配置权限
- 可以详细控制允许执行的命令
```


```
sudoers 是 sudo 权限的配置文件，让我详细解释：

# /etc/sudoers 或 /etc/sudoers.d/* 文件中
who     where=(as_whom)     what_commands

# 例如
admin   ALL=(browser_use_001)   NOPASSWD:ALL
# 谁    在哪=(以谁的身份)      执行什么命令


# 允许 admin 以 browser_use_001 身份执行所有命令，无需密码
admin ALL=(browser_use_001) NOPASSWD:ALL

```


> dig whois

dig 看“解析结果”；   ->  域名的 DNS 记录 !!!  这个还能多使使也好用

whois 看“注册信息”。  -> 这个无所谓点不怎么用吧麻烦还得查两次, 直接在线网站工具看吧

```
# 1. 查顶层分配（IANA → ARIN）
whois 104.21.64.1 | grep -i refer

# 2. 查实际归属（ARIN → Cloudflare）
whois -h whois.arin.net 104.21.64.1 | grep -i cloudflare
```



> dockerfile
> 镜像仓库只是提供系统环境, 具体的【软件源】还是默认的走的外网官方的  是吗 ?  对的
> 所以出现镜像是好的, 但是apt-get有网络问题


FROM ubuntu:20.04  # 无论从哪个镜像仓库拉取,内部的软件源配置都是一样的







> ubuntu 的进程
>
> Q: 我启动了一个python脚本python main.py 为什么会有上述4个进程

```
你看到的 4 个进程虽然都和 python 有关，但它们来源不一样，不是都因为你启动了 python main.py 才存在的。逐个解释一下：

root         581       1  0 Aug31 ?        00:00:33 /usr/bin/python3 /usr/bin/networkd-dispatcher --run-startup-triggers

👉 这是 系统服务，networkd-dispatcher 是 Ubuntu/Debian 系统里用来响应网络状态变化的守护进程，跟你运行的脚本无关。

root         663       1  0 Aug31 ?        00:00:00 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal

👉 这是 自动更新相关的服务，unattended-upgrades 用来在关机时执行待处理的安全更新，也和你的脚本无关。

root      123381       1  1 Sep04 ?        03:08:55 python main.py --port 8001

👉 这个才是你手动启动的脚本进程。它的 父进程 PID=1，说明可能是你用 nohup、systemd、docker 等方式后台运行的，脱离了原本的 shell。

root     1034192 1033590  0 02:07 pts/3    00:00:00 grep --color=auto python

👉 这个是你刚刚执行的 ps aux | grep python 命令本身产生的临时进程。

⸻

🔑 总结：
	•	前两个是 系统自带的 python 服务。
	•	第三个是你运行的 main.py。
	•	第四个是你自己查进程时产生的 grep。

所以，你启动的 python main.py 并不会额外产生 4 个进程，只是你系统里本来就有另外两个 python 服务在运行。

要确认哪些进程是你运行的，可以这样过滤：

ps -ef | grep "python main.py"

要我帮你看一下你的 python main.py 是否会再 fork 子进程吗？
```

123381    1 1 分别代表什么

```
UID        PID   PPID  C STIME TTY          TIME CMD
root    123381     1   1 Sep04 ?     03:08:55 python main.py --port 8001
```

* Process ID
* Parent Process ID
  * 这里是 1，说明它的父进程是 systemd 或 init
  * 这通常出现在你用 nohup、systemctl、docker 或者退出 shell 后后台进程被托管的情况
* percent of CPU utilization (近似值)
  * 表示该进程最近占用 CPU 的比例，范围一般是 0 ~ 99
  * 这里显示 1，说明它大概占用了 1% 左右的 CPU





> EOF 你问的 <<EOF 是 **Bash 的 Here Document（简称 Heredoc）语法**，作用是 **把多行文本重定向到命令或文件**。

`cat <<EOF > file.txt`
第一行内容
第二行内容
第三行内容
EOF





> mkdir 同时多个文件夹

mkdir -p ~/nginx/{conf/conf.d,html,log,conf/ssl}





> finder 看多个文件总大小

⸻

✅ 方法 1：用快捷键 Command + **Option** + I
	•	选中多个文件/文件夹
	•	按下 ⌘ + ⌥ + I（显示检查器）
	•	会弹出一个“检查器”窗口，实时显示选中项的 总大小
	•	优点：你继续选中/取消选择文件时，大小会 动态更新

⸻

❎ 方法 2：右键 → “显示简介”
	•	选中多个文件
	•	右键 → 显示简介 (Command + I)
	•	会弹出多个窗口，每个文件一个 → 不会自动统计总和
⚠️ 这个方法不方便统计总和





> sudo和su

- su: **switch user**  su - user1 # 切换到用户 user1，需要输入 user1 的密码





> ssh 免密连接
>
> scenario:
>
> - ssh 免密连接 Vps 机器
> - gitHub

Client: 本机生成一对公钥私钥 `ssh-keygen -t ed25519 -C "1024zzq@gmail.com"`(当它问你 Enter passphrase 的时候，直接回车留空。然后把新的 .pub 上传到 VPS 的 ~/.ssh/authorized_keys，以后就不会再问密码了。)  

生成的`ls -al ~/.ssh` 会在这个目录, .pub 就是公钥

Server: 把公钥放到 vps 服务器的 `vim ~/.ssh/authorized_keys` 中就行 (没有就新建)



VPS

> swap和zram
>
> 挂探针  https://vps.huisu.moe/





> `bash <(wget -qO- -o- https://github.com/233boy/sing-box/raw/main/install.sh)`

可以得到一个 vless

https://233boy.com/sing-box/sing-box-script/



订阅转换

https://linuxdo.icmpmiao.cc/





swap和zram

```bash
#!/bin/bash
set -e

# ==============================
# 一键启用 ZRAM + Swapfile 脚本
# 适配 Ubuntu/Debian/CentOS/RHEL
# ==============================

SWAPFILE="/swapfile"
SWAPSIZE="2G"          # 磁盘 swap 大小
ZRAM_PERCENT="50"      # zram 占用内存百分比
ZRAM_ALGO="zstd"       # 压缩算法

echo "[1/5] 检测系统类型..."
if [ -f /etc/debian_version ]; then
    DISTRO="debian"
elif [ -f /etc/redhat-release ]; then
    DISTRO="rhel"
else
    echo "❌ 不支持的系统，请手动安装 zram"
    exit 1
fi
echo "✅ 检测到发行版: $DISTRO"

# ------------------------------
# 检查 zram 模块是否可用
# ------------------------------
echo "[2/5] 检查 zram 支持..."
if modprobe -n zram >/dev/null 2>&1; then
    ZRAM_SUPPORTED=true
    echo "✅ 内核支持 zram"
else
    ZRAM_SUPPORTED=false
    echo "⚠️ 内核不支持 zram，将只启用 swapfile"
fi

# ------------------------------
# 安装 zram 工具并启用 zram
# ------------------------------
if [ "$ZRAM_SUPPORTED" = true ]; then
    echo "[3/5] 安装 zram 工具..."
    if [ "$DISTRO" = "debian" ]; then
        sudo apt update
        sudo apt install -y zram-tools
        sudo tee /etc/default/zramswap >/dev/null <<EOF
ALGO=$ZRAM_ALGO
PERCENT=$ZRAM_PERCENT
ZRAM_NUM_DEVICES=1
EOF
        sudo systemctl daemon-reload
        sudo systemctl restart zramswap || {
            echo "❌ zramswap 启动失败，请查看日志：journalctl -xeu zramswap.service"
            ZRAM_SUPPORTED=false
        }
    elif [ "$DISTRO" = "rhel" ]; then
        sudo yum install -y epel-release
        sudo yum install -y zram-generator-defaults
        sudo tee /etc/systemd/zram-generator.conf >/dev/null <<EOF
[zram0]
zram-size = ram / 2
compression-algorithm = $ZRAM_ALGO
EOF
        sudo systemctl daemon-reexec
        sudo systemctl start /dev/zram0
        sudo swapon --priority 100 /dev/zram0
    fi
fi

# ------------------------------
# 创建磁盘 swapfile
# ------------------------------
echo "[4/5] 创建 swapfile..."
if [ ! -f "$SWAPFILE" ]; then
    sudo fallocate -l $SWAPSIZE $SWAPFILE
    sudo chmod 600 $SWAPFILE
    sudo mkswap $SWAPFILE
fi
sudo swapon --priority 10 $SWAPFILE

# 写入 fstab 确保持久化
if ! grep -q "$SWAPFILE" /etc/fstab; then
    echo "$SWAPFILE none swap sw,pri=10 0 0" | sudo tee -a /etc/fstab
fi

# ------------------------------
# 验证
# ------------------------------
echo "[5/5] 验证配置..."
swapon --show
free -h

if [ "$ZRAM_SUPPORTED" = true ]; then
    echo "✅ zram + swapfile 已启用完成"
else
    echo "✅ swapfile 已启用，zram 不可用"
fi
```







> - **Ubuntu Server**
>
>   - 在新项目里越来越常见，原因是：
>     - 社区活跃，更新快，LTS 版本支持 5 年（比如 Ubuntu 20.04 LTS 到 2025、22.04 到 2027）。
>     - 云厂商（AWS、Azure、GCP、阿里云）默认镜像里 **Ubuntu 占比更高**。
>     - 对容器（Docker/K8s）、AI 框架支持好。
>     - 包管理器 apt 生态比 yum 更新更及时。
>
> - **CentOS 7**
>
>   - 2014 年发布，生命周期到 **2024-06 已经结束维护**（EOL）。
>   - 企业里老系统用得多（因为很多系统几年前上生产时选的是 CentOS 7，稳定性好），现在依旧能见到。
>   - 但因为停更了，新部署基本不会再推荐。
>
>   
>
> - 老的金融、电信、政企项目 → **还是跑 CentOS 7**（稳定、习惯、兼容性考虑）。
> - 新的互联网、云原生、AI 项目 → **更多用 Ubuntu Server 20.04/22.04**。

Vim 常用

- 看行号 `:set nu`
- 假设你想跳到第 42 行：  `:42` 
- 删整个文件内容
  - 按 gg → 跳到文件开头
  - 按 D 进入删除模式
  - 按 G → 跳到文件末尾



`grep -rn -F 'xxxx' -C 10`



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

![image-20230531110912384](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202305311109374.png)

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

https://www.runoob.com/linux/linux-comm-chmod.html

[Linux 文件基本属性](https://www.runoob.com/linux/linux-file-attr-permission.html)：看完就知道文件属性了，重点看里面的两幅图！

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202209082225377.jpeg)

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

