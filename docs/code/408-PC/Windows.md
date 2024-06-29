---
article: false
---
# [Windows](https://www.zhihu.com/question/33635511/answer/57567053)

win 上用linux CLI：

2020年9月，==WSL== 2开始向Windows 10 Version 1903/1909和Windows 10 May 2020（20H1/Version 2004）的用户推送。WSL 2支持[GUI](https://zh.wikipedia.org/wiki/GUI)应用[[19\]](https://zh.wikipedia.org/zh-cn/适用于Linux的Windows子系统#cite_note-19)。





C:\Windows   路径 exe 文件可以直接 cmd 调用
* 将文件重命名为 jq.exe
* cmd： jq --version

# 1.常用快捷键

* #### win+ppause 看电脑系统参数

* #### Win+K 打开「连接」设备 快速连耳机   （暂时联想记忆为Link）

* recent  

* regedit

* #### calc   mspaint   notepad

* #### ctrl+D 删除文件

* #### win+P设置屏幕投影功能

* #### 在文本输入过程中，键入Windows徽标键  + 。 (句点) . 将显示表情符号键盘。

* #### Ctrl+Alt+Tab 打开切换界面，可以使用鼠标在打开的项目之间切换

* #### Alt+Esc 其实类似 Alt + Tab ，不过它是让我们在没有最小化的窗口之间快速切换；按第一次打开的顺序切换【自我感觉少一步视图，更快】

  * Alt+Esc键快速切换打开程序和Alt+Tab切换有两处不同，其他效果都是一样的。不同之一就是Alt+Esc没有缩略图预览，它是按照从右向左的顺序依次切换。
  * 当您只打开两个或三个窗口时， Alt+效果最好。Esc如果您打开的窗口超过三个，我们建议使用[Alt+Tab](https://www.computerhope.com/jargon/a/alt-tab.htm)或[Windows key](https://www.computerhope.com/jargon/w/winkey.htm)+[Tab](https://www.computerhope.com/jargon/t/tab.htm)在打开的窗口之间切换。

* #### ==而当你摁下 Alt 键的同时摁 Prt Scr==，它就会默认帮你截取当前窗口，而不是当前屏幕。这在一些媒体图片制作和屏幕截取中，非常方便。

* win+.  /  win+;   emoji

* ctrl+esc 开始界面

* Win+1/2..会跳到下面任务栏指定的应用   偶然发现！！！

* ctrl + home 可以到头，而home只能到光标在这行行头

* ctrl+. 可以切换中英文标点

* Win+，：临时查看桌面



> ==快捷方式可以绑定快捷键！！！==

<img src="https://images.zzq8.cn/img/202211181821108.png" alt="image-20221118182139346" style="zoom: 50%;" />



# 2.开机自启

> 一些电脑自启动的东西，可以丢到一个目录

`C:\Users\Fighting\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

* AutoHotkey Script
* espanso Shortcut
* WGestures 2 Shortcut
* 天若识字



# 3.CMD

> Shell和cmd都是命令行界面下的**解释器**，用于执行命令和脚本。它们的作用类似，但是它们是针对不同的操作系统而设计的。
>
> 在macOS中，默认的shell是Bash（Bourne-Again SHell）直到macOS Catalina（版本10.15）中，Apple将默认的shell从Bash切换到了Zsh（Z Shell）。
>

> 而在unix系统中，/表示目录。由于web遵循unix命名，所以在网址（URL）中，/表示目录。

## Tips

* ⭐️ 当前行输错了：可以`esc`  / ctrl c 到下一行重新键入

* `@echo off` 命令用于关闭命令提示符窗口中的命令回显，这样在执行命令时，命令行窗口将不会输出命令本身。
* 在 Windows 命令行中，使用双冒号（::）可以添加注释
* set /p sourceDir=请输入源文件夹路径（例如：D:\test）：  【录入用户键入！！】
* 在Windows中，要设置环境变量，可以使用以下命令：

  1. 使用 `set` 命令：可以使用 `set` 命令来设置临时环境变量，例如：   

     ```
     set MY_VARIABLE=value
     ```

     这将在当前命令提示符会话中设置名为 `MY_VARIABLE` 的环境变量，并将其值设置为 `value`。==但是，这种方式设置的环境变量只在当前会话中有效，关闭会话后会失效。==

  2. 使用系统属性窗口：你可以通过打开系统属性窗口来设置永久环境变量。你可以按下 `Win + Pause/Break` 键来打开系统属性窗口，然后选择 "高级系统设置"，在弹出的对话框中选择 "环境变量"。在环境变量对话框中，你可以添加、编辑或删除系统或用户级别的环境变量。



## Know

==windows 不区分大小写==（所以文件夹大写小写都一样），Linux 区分

windows 访问文件是 "\\\\" 反斜杠还得注意转义的问题，而linux是正斜杠 "/" 没有转义问题

==运行  sysdm.cpl  快速打开环境变量==（system administrator . control panel）



* #### start www.baidu.com

* #### explorer http://www.baidu.com

* ```bash
  # .url文件写入，文件名需英文 / win10 直接新建快捷方式就行！
  [InternetShortcut]
  URL=http://www.baidu.com
  ```



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





# 4.删除文件夹没权限！

Everyone -> 勾选 替换子容器和对象的所有者（重点！容易忽略）

要是还删不了了，就到资源监视器中**搜索句柄**搜这个文件夹名字，我这里是被Typora占用了，结束的就可以了

**新发现：可能并不是权限问题，就是单纯被占用了   句柄里查被谁占用关掉就行  例如typora、sublime**

新发现：直接到删不了的目录里面一层去删就行









# 5.守护进程

nssm相对sc有什么优势：类似linux环境下的守护进程

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







# Tips

ARM架构不是指的操作系统的指令集架构吗，为什么win11既能支持ARM又能支持x86

你说得对，ARM架构指的是处理器的指令集架构，而不是操作系统本身的架构。ARM架构的处理器和x86架构的处理器使用不同的指令集，因此需要不同的操作系统和应用程序来支持。

Windows 11是一种多架构操作系统，它被设计为能够在不同架构的处理器上运行。这意味着它可以同时支持基于ARM架构和x86架构的设备。为了实现这一点，微软在Windows 11中引入了一个名为"Universal WindowsPlatform"（通用Windows平台）的技术，它允许开发人员编写一次代码，然后将应用程序打包为可以在不同架构的设备上运行的应用程序包。因此，不管是ARM架构还是x86架构的设备，Windows11都可以运行应用程序，而无需进行修改或适配。