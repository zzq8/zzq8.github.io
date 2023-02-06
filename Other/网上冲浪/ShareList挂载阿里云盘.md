> 2022/2/21
>
> 起因是看到别人博客搞了个文件系统很多文件且文件很大，兴趣就来了。经过了解发现是挂载了阿里云盘，用的ShareList技术。
>
> 于是乎我也想整一个。昨天折腾了一下午换来了一个501，今天终于弄好了。

# ShareList挂载阿里云盘

## 一、操作

找了很多篇文章，踩了很多坑。用了docker，用了宝塔，也自己试着二进制装跑bash。结果都没能达成目的。折腾了半天结果发现有大佬开发的一键脚本。

真正让我成功的是这篇文章：

https://media.cooluc.com/source/sharelist

想看更详细点的就这篇：

https://zhuanlan.zhihu.com/p/398231563?ivk_sa=1024320u



其他的就不用看了，已经全部帮忙踩过一遍坑了。



## 二、注意点

唯一需要注意的是：

**目录加密**

在需加密目录内新建 `.passwd` 文件，`type`为验证方式，`data`为验证内容。
目前只支持用户名密码对加密（由[auth.basic](https://github.com/reruin/sharelist/blob/master/app/plugins/auth.basic.js)插件实现）。 例如：

```
type: basic 
data:   
	- user1:111111   
	- user2:aaaaaa 
```

`user1`用户可使用密码`111111`验证，`user2`用户可使用密码`aaaaaa`验证。和官方文档不一样。



## 三、总结

最后放一下ShareList官方地址（里面有文档）：https://github.com/reruin/sharelist