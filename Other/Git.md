# Git

> [Git 学习游戏网站](https://oschina.gitee.io/learn-git-branching/)

# 一、常规流程

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

   

![img](http://image.zzq8.cn/img/202206011611310.png)







# TortoiseSVN

![image-20221020101841706](http://image.zzq8.cn/img/202210201018847.png)



这还只是一部分！！有很多图标被版本控制的操作没显示出来 例如 stash

# stash 命令

我们有时会遇到这样的情况，正在dev分支开发新功能，做到一半时有人过来反馈一个bug，让马上解决，但是新功能做到了一半你又不想提交，这时就可以使用git stash命令先把当前进度保存起来，然后切换到另一个分支去修改bug，修改完提交后，再切回dev分支，使用git stash pop来恢复之前的进度继续开发新功能。





# fetch 命令

场景：自己web页面新建了个分支，explorer fetch下就可以拿到分支checkout过去

**git fetch**：这将更新git remote 中所有的远程仓库所包含分支的最新commit-id, 将其记录到.git/FETCH_HEAD文件中

git pull : 首先，基于本地的FETCH_HEAD记录，比对本地的FETCH_HEAD记录与远程仓库的版本号，然后git fetch 获得当前指向的远程分支的后续版本的数据，然后再利用git merge将其与本地的当前分支合并。所以可以认为git pull是git fetch和git merge两个步骤的结合。



因此，git fetch是**从远程获取最新版本到本地，但不会自动merge**。
而git pull则是**会获取所有远程索引并合并到本地分支中**来。效果相同时git pull将更为快捷。



区分：pull    拉取/获取







# 1.[Conflict](https://blog.csdn.net/daigualu/article/details/68936061)

### 1）三个板块

左上（SVN版本库中）、右上（本地工作副本）、下面（合并这俩的文件后的显示窗口）

### 2）以行为单位 解决冲突

### 3）==三种颜色标识==

亮黄（增加+）、橙黄（删除-）、红色（冲突行?，并把两个版本的以橙黄显示在上面对比）

"=" 其实是两个 - ，意味着两边都删了这一行



加深理解：注意最左侧有个 “-”提示，代表此行不会纳入合并文件中
