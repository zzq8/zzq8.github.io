# Git-云服务器使用
> > 有时间再梳理这篇文章, 只保留有用的   不要繁琐,繁琐了不会看
>
> 日常自己仓库就三步:
>
> * git status -sb (--short, --branch)   ==xd 不会了就 git status -help==
> * git commit -av
> * git push
>
> 
>
> * git log --oneline (单行形式展示日志)
> * git rm -r --cached xx (清除指定文件的 git 版本控制)
> * git checkout <上一个版本的提交哈希值> -- <文件路径> （git 回滚指定文件到上一个版本）
>
> 
>
> 知识：
>
> * `--`在命令行中的作用是提供一个明确的分隔符，以确保命令的选项、参数或文件路径被正确解析。
>   * 例如，`git log -- -file.txt`中的`--`用于明确表示`-file.txt`是参数而不是选项
>   * 例如，`git checkout branch-name -- file.txt`中的`--`用于分隔`branch-name`和`file.txt`，以明确表示`file.txt`是文件路径而不是分支名称。
## [1.前置配置](https://blog.csdn.net/weixin_42310154/article/details/118340458)

> 云服务器的 Git 我捣鼓了好久~
> 由于云服务器网络、地区CN   http协议去连 Github 有点抽风，固我第一次尝试了 ssh 协议！！！   好使

1. 生成ssh key  `ssh-keygen -t rsa -C "xxx@xxx.com"` 
2. 获取ssh key公钥内容（id_rsa.pub）   `cat ~/.ssh/id_rsa.pub`
3. 把 cat 到的公钥内容放入 Github SSH配置里
4. 验证是否设置成功   `ssh -T git@github.com`

### 通俗解释！！

重点来了：**一定要知道ssh key的配置是针对每台主机的！**，比如我在某台主机上操作git和我的远程仓库，想要push时不输入账号密码，走ssh协议，就需要配置ssh key，放上去的key是**当前主机的ssh公钥**。那么如果我换了一台其他主机，想要实现无密登录，也就需要重新配置。

下面解释开头提出的问题：
（1）为什么要配？
配了才能实现push代码的时候不需要反复输入自己的github账号密码，更方便
（2）每使用一台主机都要配？
是的，每使用一台新主机进行git远程操作，想要实现无密，都需要配置。并不是说每个账号配一次就够了，而是每一台主机都需要配。
（3）配了为啥就不用密码了？
因为配置的时候是把当前主机的公钥放到了你的github账号下，相当于当前主机和你的账号做了一个关联，你在这台主机上已经登录了你的账号，此时此刻github认为是该账号主人在操作这台主机，在配置ssh后就信任该主机了。所以下次在使用git的时候即使没有登录github，也能直接从本地push代码到远程了。当然这里不要混淆了，你不能随意push你的代码到任何仓库，你只能push到你自己的仓库或者其他你有权限的仓库！



## 1.备份 MinIO

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



token   可以当密码auth的时候

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

# GitHub搜索技巧

> 不要小看这个，真的可以挖掘Github这个宝藏库

- in关键字限制搜索范围 ',' 是或的意思  `xxx in:name,readme,description`

- 查找star大于1000，fork数在500到1000 `xxx stars:>1000 forks:500..1000`
- awesome系列，一般用来收集学习、工具、书籍类相关的项目 `awesome xxx`
  - 【陌生】搜出来第一条会有副红色眼镜    言下之意，你要学什么东西就用这个命令试试。   至少我搜了下SpringBoot还是蛮不错的
- 高亮显示某行代码 一行：代码地址后面紧跟 `#L10` 多行：`#Lx - #Ln`
- 项目内搜索 使用英文字母 `t` ,开启项目内搜索





# Git

> [Git 学习游戏网站](https://oschina.gitee.io/learn-git-branching/)

# 一、常规流程

> 命令行还是可以会一下，后面其实都可以用 TortoiseGit 图形化操作了...

## 前置设置

```bash
--- 非必要，可随便填方便在 Git 上看是谁提交过来的 ---
# 配置用户名
git config --global user.name "username" //（名字）
# 配置邮箱
git config --global user.email "username@email.com" //(注册账号时用的邮箱)


--- 配置 ssh 免密登录 ---   # https://gitee.com/help/articles/4181#article-header0
* 进入 git bash；使用：ssh-keygen -t rsa -C "xxxxx@xxxxx.com"命令。 连续三次回车。一般用户目录下会有两个文件
* 或者 cat ~/.ssh/id_rsa.pub
* 登录进入 gitee，在设置里面找到 SSH KEY 将.pub 文件的内容粘贴进去使用 ssh -T git@gitee.com 测试是否成功即可
```



## 推送流程

1. git init 

2. git remote add origin https://gitee.com/codezzq/myblog
   建立一个远程仓库（连接起来）

   git remote add[别名] [远程地址]

3. git add .

4. git commit -m "test"   

5. git push -u origin master

   git push[别名] [分支名]



ps: 第2步在第五步之前实现都是可以的

idea 如果想导入 SVN 项目的话，例如 Git 可以这样：git clone [远程地址]

push的时候可以把 .gitignore放到项目里 和src平级，被ignore的文件在idea里显示的是金黄色的



# 二、强制提交

有时候你想push一个文件，

报错：error: failed to push some refs to 'https://gitee.com/codezzq/myblog'

原因：当前push的东西和仓库的东西不匹配，也就是说你仓库里可能是整个项目，而你push的却只是一个文件

解决方案一：就直接强制push了。相当于清空仓库把本地的再给push上

执行完代码代入上面的场景就是：仓库里的项目没有了，值剩下你push 的一个文件

```
$ git push -u origin master -f
```

合作项目的时候，还是建议不要用这种方法的好。 
顺便搜索了下别的解决方案：

1. push前先将远程repository修改pull下来：

```
$ git pull origin master
$ git push -u origin master
```

2. 若不想merge远程和本地修改，可以先创建新的分支：

```
$ git branch [name]
$ git push -u origin [name]
```

 

# 三、Git branch使用

https://www.jianshu.com/p/305723736c7c

```csharp
//查看所有分支列表，包括本地和远程
git branch -a
//切换分支
git checkout [分支名]
```

Git新建分支出现fatal: Not a valid object name: ‘master‘错误 :

**原因是没有提交一个对象，要先commit之后才会真正建立master分支，此时才可以建立其它分支。**



## 无法获取远程分支

```csharp
//无法获取远程分支
//原因 git branch -a 这条命令并没有每一次都从远程更新仓库信息，我们可以手动更新一下
git fetch origin 
git branch -a
```

## 创建分支

语法：git branch 分支名

## 创建并且切换到分支里

git checkout -b 分支名



# 四、总结：

1. 状态查看操作（查看工作区、暂存区状态）

   git status

   

2. 添加操作（将工作区的“新建/修改”添加到暂存区（缓存区））

   git add[file name]

   

3. 提交操作（将暂存区的内容提交到本地库）

   git commit -m "commit message" [file name]




> 超好用！！！
>
> `git commit -av` 是一个用于提交 Git 修改的命令。它结合了 `-a` 和 `-v` 两个选项，具有以下含义：
>
> - `-a`（或 `--all`）选项表示自动将所有已修改的文件添加到暂存区（Git Index），包括已经被 Git 跟踪的文件的修改。这样，你无需手动使用 `git add` 命令来将修改的文件添加到暂存区，Git 会自动处理。
> - `-v`（或 `--verbose`）选项表示在提交时显示更详细的信息，包括每个修改的文件的 diff 内容。这对于查看每个文件的具体修改内容和变化非常有用。
>
> 因此，当你运行 `git commit -av` 命令时，Git 将自动添加所有已修改的文件到暂存区，并在提交时显示每个文件的 diff 内容。
>
>
> 注意：进入这个命令后跟编辑 vim 流程一样，输入 message 后需要 `:wq` 即可提交

![img](https://images.zzq8.cn/img/202206011611310.png)







# TortoiseSVN

![image-20221020101841706](https://images.zzq8.cn/img/202210201018847.png)



这还只是一部分！！有很多图标被版本控制的操作没显示出来 例如 stash

# stash 命令

我们有时会遇到这样的情况，正在dev分支开发新功能，做到一半时有人过来反馈一个bug，让马上解决，但是新功能做到了一半你又不想提交，这时就可以使用git stash命令先把当前进度保存起来，然后切换到另一个分支去修改bug，修改完提交后，再切回dev分支，使用git stash pop来恢复之前的进度继续开发新功能。





# fetch 命令

场景：自己web页面新建了个分支，explorer fetch下就可以拿到分支checkout过去

**git fetch**：这将更新git remote 中所有的远程仓库所包含分支的最新commit-id, 将其记录到.git/FETCH_HEAD文件中

git pull : 首先，基于本地的FETCH_HEAD记录，比对本地的FETCH_HEAD记录与远程仓库的版本号，然后git fetch 获得**当前指向的远程分支**的后续版本的数据，然后再利用git merge将其与本地的当前分支合并。所以可以认为git pull是git fetch和git merge两个步骤的结合。（注意此时是分支，还需手动fetch主干的信息，才能拿到最新的分支checkout）



因此，git fetch是**从远程获取最新版本到本地，但不会自动merge**。
而git pull则是**会获取所有远程索引并合并到本地分支中**来。效果相同时git pull将更为快捷。



区分：pull    拉取/获取



# rebase 变基

Git中的变基（rebase）和合并（merge）是两种不同的代码整合方式。

合并（merge）是指将两个或多个不同的分支合并成一个新的分支，通常使用git merge命令。合并操作会创建一个新的提交，包括合并后的所有修改。

变基（rebase）是一种将一个分支的修改应用到另一个分支上的操作，通常使用git rebase命令。变基操作会将一系列的提交按照顺序一个一个地应用到另一个分支上，使得目标分支中的提交线性排列，从而避免了合并产生的提交历史分支。

两种方式的区别在于它们对代码历史记录的影响。合并会保留原来的分支历史记录，而变基会将原来的分支历史记录“重放”在目标分支上，因此会修改目标分支的提交历史记录。

一般来说，合并适合于处理不同的功能或特性的分支，而变基适合于将一个分支的修改应用到另一个分支上，使得提交历史更加清晰和线性。但是，变基操作有可能会导致冲突，需要手动解决，因此使用时需要谨慎。







Git的变基（Rebase）和合并（Merge）是两种常见的代码合并方式，它们之间的主要区别在于合并后代码库的提交历史记录以及合并冲突的处理方式。

1. 合并（Merge）

合并是将两个或多个分支的修改合并为一个新的提交。合并会将多个分支的修改合并为一个新的提交，该提交会有多个父提交。合并会在提交历史记录中保留每个分支的修改记录，所以可以看到每个分支的修改历史。合并通常适用于多人同时在同一个分支上进行开发的情况，或者需要在分支之间保留历史记录的情况。

合并通常使用以下命令：

```
phpCopy code
git merge <branch-name>
```

1. 变基（Rebase）

变基是将当前分支的修改，以及指定分支的修改合并到一个新的基底分支上，然后将当前分支指向新的基底分支。变基会将当前分支的修改在提交历史记录中移动到指定分支的后面，并创建一个新的提交。变基的结果是，当前分支的修改历史记录与指定分支的修改历史记录合并为一个线性历史记录。

变基通常使用以下命令：

```
phpCopy code
git rebase <branch-name>
```

主要区别：

- 合并会在提交历史记录中保留每个分支的修改记录，而变基会将修改历史记录移动到一个新的基底分支上，并创建一个新的提交，不保留原始分支的修改历史记录。
- 合并通常用于合并多个分支的修改，而变基通常用于在一个分支上更新另一个分支的修改。
- 合并通常会产生合并冲突，需要手动解决，而变基也可能会产生冲突，但是由于变基只改变当前分支的历史记录，因此解决冲突的方式也更加直观和简单。

综上所述，变基和合并都是常见的代码合并方式，它们的选择取决于具体的需求和情况。在选择变基或合并时，需要考虑提交历史记录的重要性、合并冲突的处理复杂度以及其他因素。





# 1.[Conflict](https://blog.csdn.net/daigualu/article/details/68936061)

### 1）三个板块

左上（SVN版本库中）、右上（本地工作副本）、下面（合并这俩的文件后的显示窗口）

### 2）以行为单位 解决冲突

### 3）==三种颜色标识==

亮黄（增加+）、橙黄（删除-）、红色（冲突行?，并把两个版本的以橙黄显示在上面对比）

"=" 其实是两个 - ，意味着两边都删了这一行



加深理解：注意最左侧有个 “-”提示，代表此行不会纳入合并文件中



# 2.global ignore

> 231008 Boke 再理解

* 整库- TortoiseSVN右键有个ignore，给文件夹添加属性，然后commit可以把文件夹的属性提交【这个应该是适用于整个库的】
* 如下写的可以从配置文件里设置 / setting -> Global ignore pattern: 设置也是一样的效果！！！【**记得需要重新右键commit打开一个新的框才能看到效果**   不然我老是觉得没有生效】



> commit 界面有个 no changelist 列表，这里面都是未被版本控制的文件
>
> 突然想明白一个事，这里全局忽略文件写路径的时候， 脑袋里要有 Versioned / Non-Versioned 两种文件的概念
> 然后写Non-Versioned的文件的相对路径，不要写带Versioned的有关的路径了！

可以通过svn的全局配置文件给忽略掉不显示

```
### XD
[miscellany]
global-ignores = *.iml .idea *.class *.md5 *.log classes *.log.* localhost_access_log.*.txt *.so *.tmp generated-sources generated-test-sources maven-archiver MyTest.java
```
