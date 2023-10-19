# idea&windows 快捷键及使用技巧

# 一、idea

#### `ctrl+[ ctrl+]` 可以快速跳转到方法大括号的起止位置，配合方法分隔符使用，不怕找不到方法在哪儿分割了

#### Shift+alt+左键 可以和 sublime 一样多个光标

#### ctrl+m 滚动到光标所在行

#### ==条件断点、异常断点好用（停在异常抛出前，有问题的那一行代码）==

#### idea ctrl shift f 整理代码！！             

####  ctrl+o查看类中所有的方法！！         

#### 先写输出语句括号里要输出的，再.sout试一下还有.if！！！     

#### ctrl alt /   看有哪些有哪些构造方法！！！   

#### alt向下移动该行/ ctrl+alt复制该行   



#### ==100.for== 快速生成for循环 选择fori会生成递加 选择forr会生成递减

#### ctrl 鼠标右键 可以高亮指定范围代码  还是 alt 鼠标右键也可以

#### shift shift 查类 再shift shift 选中从jar包找

#### alt + shift + m 可以把所选代码提取出来当方法

#### alt shift z 包代码例try catch

#### F4 / ctrl + H 看这个类结构，从哪里继承下来。。   ctrl + t 看这个接口有哪些实现类 ！

#### `Ctrl + shift + 数字键`。注意，这个快捷键只支持0-9十个数字助记符书签的快速添加。 shift + F11 直接标记， shift + F11 查看书签      ctrl + 数字是跳转

#### ==ctrl + home/end 到底部或顶部== ctrl + l 跳到指定行

#### 用【Shift + Enter】，可以【IDEA新建一行,并且光标移到新行】

#### ctrl + o  Ait + 7 可以看这个类有哪些属性  

#### ctrl . 可以收或打开括号   同ctrl+ -/+ ，==和输入法冲突==

#### 上面的标签，按ctrl点击可以打开explorer

#### ctrl+d 对比选中的两个文件代码，可比较两个 Entity 属性等

alt+left/right 跳到上次的光标位置

ctrl+alt+left/right 跳上一个浏览过的文件



ctrl+shift+a 输入maven就可用maven   idea右侧工具栏没有显示maven的时候，或者要加maven项目的时候用！！

![image-20230223150958814](http://image.zzq8.cn/img/202302231509949.png)





键盘End键可以到浏览器页面最底部，有道云笔记有效

问题就在于List有多个实现类，如 LinkedList或者Vector等等，现在你用的是ArrayList，也许哪一天你需要换成其它的实现类呢？，这时你只要改变这一行就行了：List list = new LinkedList(); 其它使用了list地方的代码根本不需要改动。假设你开始用 ArrayList alist = new ArrayList(), 这下你有的改了，特别是如果你使用了 ArrayList特有的方法和属性。 ,如果没有特别需求的话,最好使用List list = new LinkedList(); ,便于程序代码的重构. 这就是面向接口编程的好处



* 变量.null：if(变量 == null) 
* 变量.nn：if(变量 != null) 
* 变量.notnull：if(变量 != null)



# 二、[Windows](https://www.zhihu.com/question/33635511/answer/57567053)

> Shell和cmd都是命令行界面下的解释器，用于执行命令和脚本。它们的作用类似，但是它们是针对不同的操作系统而设计的。
>
> Shell是Unix和Linux操作系统下的命令行解释器，它是一种脚本语言，通过命令行界面执行各种操作和管理系统。Shell可以处理输入和输出，控制进程和文件系统，以及执行各种命令和脚本。Shell还提供了一些内置命令和函数，可以方便地操作和处理文本、文件和系统。常见的Shell包括Bash、Csh、Ksh等。
>
> cmd是Windows操作系统下的命令行解释器，它也是一种脚本语言，可以执行各种操作和管理系统。cmd可以处理输入和输出，控制进程和文件系统，以及执行各种命令和脚本。cmd也提供了一些内置命令和函数，可以方便地操作和处理文本、文件和系统。与Shell不同的是，cmd的命令语法和内置函数与Unix和Linux的Shell不同，而是针对Windows操作系统进行设计。
>
> 因此，Shell和cmd都是命令行界面下的解释器，用于执行命令和脚本。Shell是Unix和Linux操作系统下的命令行解释器，而cmd是Windows操作系统下的命令行解释器。
>
> 
>
> 在macOS中，默认的shell是Bash（Bourne-Again SHell）直到macOS Catalina（版本10.15）中，Apple将默认的shell从Bash切换到了Zsh（Z Shell）。
>
> 可以这段放 Mac笔记上！！！！

> 而在unix系统中，/表示目录。由于web遵循unix命名，所以在网址（URL）中，/表示目录。

==windows 不区分大小写==（所以文件夹大写小写都一样），Linux 区分

windows 访问文件是 "\\\\" 反斜杠还得注意转义的问题，而linux是正斜杠 "/" 没有转义问题

==运行  sysdm.cpl  快速打开环境变量==（system administrator . control panel）

* #### ctrl+esc 开始界面

* #### Win+1/2..会跳到下面任务栏指定的应用   偶然发现！！！

* #### ctrl + home 可以到头，而home只能到光标在这行行头

* #### ctrl+. 可以切换中英文标点

* #### Win+，：临时查看桌面

* #### arp -a

* #### start www.baidu.com

  * #### explorer http://www.baidu.com

  * ```bash
    # .url文件写入，文件名需英文 / win10 直接新建快捷方式就行！
    [InternetShortcut]
    URL=http://www.baidu.com
    ```

  * 说明：让网页多长时间（秒）刷新自己，或在多长时间后让网页自动链接到其它网页。

    <meta http-equiv="refresh" content="1;url=http://www.baidu.com/">
    or
    <body onload="parent.location='http://www.baidu.com'">

* #### recent  

* #### regedit

* #### calc   mspaint   notepad

* #### ctrl+D 删除文件

* #### 键盘D-destination 的意思

* #### win+P设置屏幕投影功能

* #### 在文本输入过程中，键入Windows徽标键  + 。 (句点) . 将显示表情符号键盘。

* #### Ctrl+Alt+Tab 打开切换界面，可以使用鼠标在打开的项目之间切换

* #### Alt+Esc 其实类似 Alt + Tab ，不过它是让我们在没有最小化的窗口之间快速切换；按第一次打开的顺序切换【自我感觉少一步视图，更快】

  * Alt+Esc键快速切换打开程序和Alt+Tab切换有两处不同，其他效果都是一样的。不同之一就是Alt+Esc没有缩略图预览，它是按照从右向左的顺序依次切换。
  * 当您只打开两个或三个窗口时， Alt+效果最好。Esc如果您打开的窗口超过三个，我们建议使用[Alt+Tab](https://www.computerhope.com/jargon/a/alt-tab.htm)或[Windows key](https://www.computerhope.com/jargon/w/winkey.htm)+[Tab](https://www.computerhope.com/jargon/t/tab.htm)在打开的窗口之间切换。

* #### ==而当你摁下 Alt 键的同时摁 Prt Scr==，它就会默认帮你截取当前窗口，而不是当前屏幕。这在一些媒体图片制作和屏幕截取中，非常方便。

* #### Curl是拿什么         暂时理解成获取网页信息吧



> ==快捷方式可以绑定快捷键！！！==

<img src="https://images.zzq8.cn/img/202211181821108.png" alt="image-20221118182139346" style="zoom: 50%;" />



> #### 删除文件夹没权限！

Everyone -> 勾选 替换子容器和对象的所有者（重点！容易忽略）

要是还删不了了，就到资源监视器中**搜索句柄**搜这个文件夹名字，我这里是被Typora占用了，结束的就可以了



新发现：直接到删不了的目录里面一层去删就行

## 1）cmd

### CMD Shell

* `@echo off` 命令用于关闭命令提示符窗口中的命令回显，这样在执行命令时，命令行窗口将不会输出命令本身。
* 在 Windows 命令行中，使用双冒号（::）可以添加注释
* set /p sourceDir=请输入源文件夹路径（例如：D:\test）：  【录入用户键入！！】





#### nssm相对sc有什么优势：类似linux环境下的守护进程

> 想把 tomcat 整成服务！  sc 发现把tomcat9.exe变成服务启动不了   nssm 可以！
> tomcat9.exe 是由 service.bat install 命令生成！！！
>
> > 发现：tomcat中，只有这个tomcat9.exe能做成服务，其它bat做不成（bat都是新open一个黑底白字的cmd）
> > bokedee的bat就能直接做成服务
> >
> > 做成服务的这两者sc做成的都不能跑！所以 nssm 还是牛的
>
> ```shell
> service.bat remove
> service.bat install
> ```

NSSM（Non-Sucking Service Manager）和SC（Service Control）都是Windows系统中的服务管理工具。它们都可以用于创建、配置、启动、停止和删除Windows服务。

以下是NSSM相对于SC的一些优势：

1. 更加稳定：NSSM比SC更加稳定，可以更好地处理Windows服务的异常情况，如服务崩溃、服务死锁等。
2. 更加灵活：NSSM提供了更多的选项和配置，可以对服务进行更加细粒度的控制，如服务启动类型、服务重启策略、服务优先级等。
3. 更加易用：NSSM提供了可视化的用户界面，可帮助用户更加轻松地创建和管理Windows服务。
4. 更加可靠：NSSM支持服务的自动重启，并提供了对服务的监控和报警机制，可帮助用户及时发现和解决服务问题。

总之，NSSM相对于SC具有更加稳定、灵活、易用和可靠的优势，尤其适用于需要管理大量Windows服务的场景，如服务器集群、容器等。



> cd %~dp0
>
> %cd% 当前目录

在Windows命令提示符下，"%~dp0"是一种特殊的参数变量，它表示当前批处理文件所在的目录的完整路径，包括盘符和路径。
"d"表示仅返回驱动器号和路径，"p"表示仅返回路径，"0"表示当前脚本的名称，即批处理文件的名称。



> 右键标记即可复制cmd里面的文字



>查看外网 IP 地址，可以 curl 查ip的网站        实测curl ipinfo.io 可，ip.cn没内容

也可以在 curl 后加别的网址，例如 [http://ip.cn](https://link.zhihu.com/?target=http%3A//ip.cn)。另外，也可以直接把 [http://ipinfo.io](https://link.zhihu.com/?target=http%3A//ipinfo.io) 复制到浏览器中访问。curl 是 Windows 10 系统新增的命令。



> **通过 Ping DNS 来决定看用哪一个 DNS 比如我现在测试的 223.5.5.5 比 114.114.114.114 要快！**



> 1. Linux 命令终端的清屏命令/快捷键：Clear，Ctrl+L
> 2. Windows [CMD](https://so.csdn.net/so/search?q=CMD&spm=1001.2101.3001.7020) 或者 Navicat 命令窗口的清屏命令：Clear 或者 CLS
>    * 实测 CMD 只能 cls



> **修改环境变量不重启生效：set PATH=C:**



> cd /d [对应目录]  //可以跨盘cd



>Hosts 改完需要以下命令生效
>ipconfig /flushdns



> 端口被占

```bash
#查看被占用端口对应的 PID
netstat -aon|findstr "9000"

#查看指定 PID 的进程
tasklist|findstr "1"

#强制（/F参数）杀死 pid 为 9000 的所有进程包括子进程（/T参数）：
taskkill /T /F /PID 9000 
```





## 2）MySQL

删除 my.ini 指定的 data文件的资料（也可备份里面的库，我这里没成功ibdata1一替换就有问题）



1. mysqld --remove mysql5.7

* mysqld --defaults-file="D:\programming environment\mysql-5.7.39-winx64\my.ini" --initialize --console（作用：此时data目录里面就有数据了，数据库的表什么都在这个目录）
  mysqld --defaults-file="D:\programming environment\mysql-8.0.22-winx64\my.ini" --initialize --console

* mysqld --install mysql5.7 --defaults-file="D:\programming environment\mysql-5.7.39-winx64\my.ini"
  mysqld --install mysql8.0 --defaults-file="D:\programming environment\mysql-8.0.22-winx64\my.ini"



alter user 'root'@'localhost' identified by '123456';





# 三、Typora

* #### 代码块： ctrl + shift + k

* #### 插入链接：ctrl + k

* #### 行 Entry，段 Shift+Entry（两者决定行间隙）





# 四、Sublime

* #### 在 Sublime Text 4 中，当你尝试替换文本时，它默认会保持替换的文本与原始文本的大小写一致。这意味着，如果你选择替换为大写文本，但原始文本是小写的，替换后的文本也会保持小写。

  * 踩坑，ctrl h左下角有个选项 preserve case

* #### 搜索可以用正则，正则中的表达式可以用()包到里面，替换的时候可以用 $1..n（代表第1..n个括号） 来复用匹配到的内容！！！真的好用

  * ==正则组引用==

* #### ctrl+shift+f  可以查（匹配）整个文件夹里的内容，高频使用

* #### [快速插入多行递增数字](https://blog.csdn.net/cxrsdn/article/details/82496800)

  * ##### ctrl+shift+p ---> install package control ---> 搜索 Insert Nums

* #### 列模式批量操作（以矩形的形式选取内容）

  －鼠标右键＋Shift

  －或者鼠标中键

  －增加选择：Ctrl，减少选择：Alt




# 五、Chrome

> [Chrome 官网快捷键总结](https://support.google.com/chrome/answer/157179)



| 操作                                                         | 快捷键                               |
| :----------------------------------------------------------- | ------------------------------------ |
| 为网站名称添加 `www.` 和 `.com`，然后在当前标签页中打开该网址 | 输入网站名称并按 **Ctrl + Enter** 键 |
| 打开新的标签页并执行 Google 搜索                             | 输入搜索字词并按 Alt + Enter 键      |
| 跳转到地址栏                                                 | **Ctrl + l** 或 Alt + d 或 F6        |

在 Google 的搜索界面时可以 / 来聚焦到输入框

Shift+Enter 新开浏览器界面搜

* shift+esc 任务管理器

**ctrl+shift+delete 清缓存必备**



## 搜索技巧

只搜索某个站点： 空格域名

排除某个站点： 空格 -域名
