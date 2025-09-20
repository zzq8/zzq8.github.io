---
article: 
category: 
tag: 
created: 2025-09-20 17:03:35
updated: 2025-09-20 20:37:48
---

# mysql

全部搞到  mysql 45 那里 去!!!!!!







> 面试后未掌握的知识点

- mysql的索引选择模模糊糊(a=b>c=)
- 三个日志只答了binlog/redolog
- 二阶段提交用的哪个日志(我答redolog))



> 笔记地址
>
> https://www.xiaogenban1993.com/blog/23.04/mysql_%E4%BB%8E%E5%A4%B4%E5%88%B0%E5%B0%BE%E7%9A%84mysql#5-bin-log

## 通用知识

> 联合索引那部分 mysql45讲

块->页->行

b+ 树是多叉搜索树 (好处: 扁平  同一层好检索, 跨层不好检索效率低)

- 树的每个节点是一个页，其中叶子节点是真正存储数据的，又叫`数据页`
- 而其他节点只存储索引值+页号，叫做`目录页`



> 聚簇索引(主键索引) / 非聚簇索引(二级索引)

聚簇索引叶子节点存的是这一行完整的数据

非聚簇索引的叶子索引存的的聚簇索引的id (需要回表)



## 日志

binlog 在事务提交时写入，redo log 在事务提交时刷盘，

undo log 在事务开始时生成。【脑袋看】

常问

- 二阶段提交



- redolog 作用

## binlog

binlog (逻辑日志 文件:mysql-bin.0000001):   记录的是一句句 sql
- 需要在 my.ini 手动开启 log-bin
	- 配置文件名字示例 mysql.bin.00001 (check), 文件不可读需要通过命令转成 sql 文件
- `show binlgo events;` 可以看到

## redolog

一页是16kb


redolog (二进制日志  文件:ib_logfile0, 磁盘空间  第多少页第几个字节从a->b); 故障恢复
- 作为数据页的一部分存在
- 事务 commit 会刷盘
- 故障恢复: 顺序写redolog还没刷盘到 IBD 文件  【有个flag证明哪些是脏页脏数据，  binlog不能做是因为它是全量且没有一个flag证明是脏数据】
  - ==redolog 和 内存中脏页 (还没刷盘的数据) 是保持一致的一个情况==, 故障恢复就是恢复这一部分
  - 因为事务提交的时候 redolog 是一定要刷盘的 【看两阶段提交的图就懂了】


## undolog


undo log (没有额外文件, 可以看做特殊页类型)
- row_id, trx_id, roll_pointer (想象单链表)
- https://www.bilibili.com/video/BV1U14y1d79M?t=1545.0
