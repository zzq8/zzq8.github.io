> 用好检索功能就相当于事情解决了一半！
> 无论是百度还是GitHub都可以学一下

```java
in:name test               #仓库标题搜索含有关键字test
in:descripton test         #仓库描述搜索含有关键字
in:readme test             #Readme文件搜素含有关键字
stars:>3000 test           #stars数量大于3000的搜索关键字
stars:1000..3000 test      #stars数量大于1000小于3000的搜索关键字
forks:>1000 test           #forks数量大于1000的搜索关键字
forks:1000..3000 test      #forks数量大于1000小于3000的搜索关键字
size:>=5000 test           #指定仓库大于5000k(5M)的搜索关键字
pushed:>2019-02-12 test    #发布时间大于2019-02-12的搜索关键字
created:>2019-02-12 test   #创建时间大于2019-02-12的搜索关键字
user:test                  #用户名搜素
license:apache-2.0 test    #明确仓库的 LICENSE 搜索关键字
language:java test         #在java语言的代码中搜索关键字
user:test in:name test     #组合搜索,用户名test的标题含有test的
```


[原文地址](https://blog.csdn.net/qq_36119192/article/details/99690742)