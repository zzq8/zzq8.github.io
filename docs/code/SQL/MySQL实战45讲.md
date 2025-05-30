---
article: false
---
# MySQL实战45讲

> 取自极客时间专栏，用于自己复习！详细评论看官方的  作者：**林晓斌**，网名“丁奇”，前阿里资深技术专家
>
> 原理先行，再实践验证。切记不要不懂装懂！

## 一、基础篇

## 01丨基础架构：一条SQL查询语句是如何执行的？

### 1.MySQL 查询拆解

> 一条查询语句的执行过程一般是经过连接器、分析器、优化器、执行器等功能模块，最后到达存储引擎。

看一个事儿千万不要直接陷入细节里，你应该先鸟瞰其全貌，这样能够帮助你从高维度理解问题。

<font color=red>SQL 语句在 MySQL 的各个功能模块中的执行过程：</font>

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212021612352.png)

<center>MySQL 的逻辑架构图</center>

大体来说，MySQL 可以分为 Server 层和存储引擎层两部分。

> Server 层

包括连接器、查询缓存、分析器、优化器、执行器等，涵盖 MySQL 的大多数核心服务功能，以及所有的内置函数（如日期、时间、数学和加密函数等），所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图等。

> 存储引擎层

负责数据的存储和提取。其架构模式是插件式的，支持 InnoDB、MyISAM、Memory 等多个存储引擎。现在最常用的存储引擎是 InnoDB，它从 MySQL 5.5.5 版本开始成为了默认存储引擎。

也就是说，你执行 create table 建表的时候，如果不指定引擎类型，默认使用的就是 InnoDB。不过，你也可以通过指定存储引擎的类型来选择别的引擎，比如在 create table 语句中使用 engine=memory, 来指定使用内存引擎创建表。不同存储引擎的表数据存取方式不同，支持的功能也不同，在后面的文章中，我们会讨论到引擎的选择。

从图中不难看出，不同的存储引擎共用一个 **Server 层**，也就是从连接器到执行器的部分。你可以先对每个组件的名字有个印象，接下来我会结合开头提到的那条 SQL 语句，带你走一遍整个执行流程，依次看下每个组件的作用。

**事务（并不是所有的引擎都支持事务。比如 MySQL 原生的 MyISAM 引擎就不支持事务，这也是 MyISAM 被 InnoDB 取代的重要原因之一。）、**

==**索引、行锁...都是在这层实现！**==



### 2.连接器

第一步，你会先连接到这个数据库上，这时候接待你的就是连接器。连接器负责跟客户端建立连接、获取权限、维持和管理连接。连接命令一般是这么写的：

```cmd
mysql -h$ip -P$port -u$user -p
```

输完命令之后，你就需要在交互对话里面输入密码。虽然密码也可以直接跟在 -p 后面写在命令行中，但这样可能会导致你的密码泄露。如果你连的是生产服务器，强烈建议你不要这么做。

连接命令中的 mysql 是客户端工具，用来跟服务端建立连接。在完成经典的 TCP 握手后，连接器就要开始认证你的身份，这个时候用的就是你输入的用户名和密码。

- 如果用户名或密码不对，你就会收到一个"Access denied for user"的错误，然后客户端程序结束执行。
- 如果用户名密码认证通过，连接器会到权限表里面查出你拥有的权限。之后，这个连接里面的权限判断逻辑，都将依赖于此时读到的权限。

这就意味着，一个用户成功建立连接后，即使你用管理员账号对这个用户的权限做了修改，也不会影响已经存在连接的权限。修改完成后，只有再新建的连接才会使用新的权限设置。

连接完成后，如果你没有后续的动作，这个连接就处于空闲状态，你可以在 <font color=red>show processlist</font> 命令中看到它。文本中这个图是 show processlist 的结果，其中的 Command 列显示为“Sleep”的这一行，就表示现在系统里面有一个空闲连接。

扩展：show processlist 显示的信息都是来自MySQL系统库 information_schema 中的 processlist 表。所以使用下面的查询语句可以获得相同的结果：

```mysql
select * from information_schema.processlist #实测能查用公司MySQL服务器的人！
```

![img](data:image/png;base64,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)

客户端如果太长时间没动静，连接器就会自动将它断开。这个时间是由参数 wait_timeout 控制的，默认值是 8 小时。

如果在连接被断开之后，客户端再次发送请求的话，就会收到一个错误提醒： Lost connection to MySQL server during query。这时候如果你要继续，就需要重连，然后再执行请求了。

数据库里面，长连接是指连接成功后，如果客户端持续有请求，则一直使用同一个连接。短连接则是指每次执行完很少的几次查询就断开连接，下次查询再重新建立一个。

建立连接的过程通常是比较复杂的，所以我建议你在使用中要尽量减少建立连接的动作，也就是尽量使用长连接。

但是全部使用长连接后，你可能会发现，有些时候 MySQL 占用内存涨得特别快，**这是因为 MySQL 在执行过程中临时使用的内存是管理在连接对象里面的**。这些资源会在连接断开的时候才释放。所以如果长连接累积下来，可能导致内存占用太大，被系统强行杀掉（OOM），从现象看就是 MySQL 异常重启了。

怎么解决这个问题呢？你可以考虑以下两种方案。

1. 定期断开长连接。使用一段时间，或者程序里面判断执行过一个占用内存的大查询后，断开连接，之后要查询再重连。
2. 如果你用的是 MySQL 5.7 或更新版本，**可以在每次执行一个比较大的操作后，通过执行 mysql_reset_connection 来重新初始化连接资源**。这个过程不需要重连和重新做权限验证，但是会将连接恢复到刚刚创建完时的状态。



### 3.查询缓存

连接建立完成后，你就可以执行 select 语句了。执行逻辑就会来到第二步：查询缓存。

MySQL 拿到一个查询请求后，会先到查询缓存看看，之前是不是执行过这条语句。之前执行过的语句及其结果可能会以 key-value 对的形式，被直接缓存在内存中。key 是查询的语句，value 是查询的结果。如果你的查询能够直接在这个缓存中找到 key，那么这个 value 就会被直接返回给客户端。

如果语句不在查询缓存中，就会继续后面的执行阶段。执行完成后，执行结果会被存入查询缓存中。你可以看到，如果查询命中缓存，MySQL 不需要执行后面的复杂操作，就可以直接返回结果，这个效率会很高。

**但是大多数情况下我会建议你不要使用查询缓存，为什么呢？因为查询缓存往往弊大于利。**

查询缓存的失效非常频繁，只要有对一个表的更新，这个表上所有的查询缓存都会被清空。因此很可能你费劲地把结果存起来，还没使用呢，就被一个更新全清空了。对于更新压力大的数据库来说，查询缓存的命中率会非常低。除非你的业务就是有一张静态表，很长时间才会更新一次。比如，一个系统配置表，那这张表上的查询才适合使用查询缓存。

好在 MySQL 也提供了这种“按需使用”的方式。你可以将参数 **query_cache_type** 设置成 DEMAND（还有 ON、OFF），这样对于默认的 SQL 语句都不使用查询缓存。而对于你确定要使用查询缓存的语句，可以用 SQL_CACHE 显式指定，像下面这个语句一样：

```mysql
mysql> select SQL_CACHE * from T where ID=10；
show variables like '%query_cache%' # variables 可以看查询缓存参数 query_cache_type
```

需要注意的是，MySQL 8.0 版本直接将查询缓存的整块功能删掉了，也就是说 8.0 开始彻底没有这个功能了。（语句一更新就没命中率低，废时间）



### 4.分析器

> 做什么：词法分析 -> 语法分析

如果没有命中查询缓存，就要开始真正执行语句了。首先，MySQL 需要知道你要做什么，因此需要对 SQL 语句做解析。

分析器先会做“词法分析”。你输入的是由多个字符串和空格组成的一条 SQL 语句，MySQL 需要识别出里面的字符串分别是什么，代表什么。

MySQL 从你输入的"select"这个关键字识别出来，这是一个查询语句。它也要把字符串“T”识别成“表名 T”，把字符串“ID”识别成“列 ID”。

做完了这些识别以后，就要做“语法分析”。根据词法分析的结果，语法分析器会根据语法规则，判断你输入的这个 SQL 语句是否满足 MySQL 语法。

如果你的语句不对，就会收到“You have an error in your SQL syntax”的错误提醒，比如下面这个语句 select 少打了开头的字母“s”。

```mysql
mysql> elect * from t where ID=1;
 
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'elect * from t where ID=1' at line 1
```

一般语法错误会提示第一个出现错误的位置，所以你要关注的是紧接“use near”的内容。



### 5.优化器

> 怎么做

经过了分析器，MySQL 就知道你要做什么了。在开始执行之前，还要先经过优化器的处理。

优化器是在表里面有多个索引的时候，决定使用哪个索引；或者在一个语句有多表关联（join）的时候，决定各个表的连接顺序。比如你执行下面这样的语句，这个语句是执行两个表的 join：

```mysql
mysql> select * from t1 join t2 using(ID)  where t1.c=10 and t2.d=20;
```

- 既可以先从表 t1 里面取出 c=10 的记录的 ID 值，再根据 ID 值关联到表 t2，再判断 t2 里面 d 的值是否等于 20。
- 也可以先从表 t2 里面取出 d=20 的记录的 ID 值，再根据 ID 值关联到 t1，再判断 t1 里面 c 的值是否等于 10。

这两种执行方法的逻辑结果是一样的，但是执行的效率会有不同，而优化器的作用就是决定选择使用哪一个方案。

优化器阶段完成后，这个语句的执行方案就确定下来了，然后进入执行器阶段。如果你还有一些疑问，比如**优化器是怎么选择索引**的，有没有可能选择错等等，没关系，我会在后面的文章中单独展开说明优化器的内容。



### 6.执行器

MySQL 通过分析器知道了你要做什么，通过优化器知道了该怎么做，于是就进入了执行器阶段，开始执行语句。

开始执行的时候，要先判断一下你对这个表 T 有没有执行查询的权限，如果没有，就会返回没有权限的错误，如下所示 (在工程实现上，如果命中查询缓存，会在查询缓存返回结果的时候，做权限验证。查询也会在优化器之前调用 precheck 验证权限)。

```mysql
mysql> select * from T where ID=10;
 
ERROR 1142 (42000): SELECT command denied to user 'b'@'localhost' for table 'T'
```

如果有权限，就打开表继续执行。打开表的时候，执行器就会根据表的引擎定义，去使用这个引擎提供的接口。

比如我们这个例子中的表 T 中，ID 字段没有索引，那么执行器的执行流程是这样的：

1. 调用 InnoDB 引擎接口取这个表的第一行，判断 ID 值是不是 10，如果不是则跳过，如果是则将这行存在结果集中；
2. 调用引擎接口取“下一行”，重复相同的判断逻辑，直到取到这个表的最后一行。
3. 执行器将上述遍历过程中所有满足条件的行组成的记录集作为结果集返回给客户端。

至此，这个语句就执行完成了。

对于有索引的表，执行的逻辑也差不多。第一次调用的是“取满足条件的第一行”这个接口，之后循环取“满足条件的下一行”这个接口，这些接口都是引擎中已经定义好的。

你会在数据库的慢查询日志中看到一个 rows_examined 的字段，表示这个语句执行过程中扫描了多少行。这个值就是在执行器每次调用引擎获取数据行的时候累加的。

在有些场景下，执行器调用一次，在引擎内部则扫描了多行，因此**引擎扫描行数跟 rows_examined 并不是完全相同的。**我们后面会专门有一篇文章来讲存储引擎的内部机制，里面会有详细的说明。

```mysql
#注意在交互界面进行的设置，如果数据库进行重启，这些设置都会失效。如果要永久生效，需要修改配置文件：
show variables like 'slow_query_log%' # 慢查询是否开启，保存路径
show variables like 'long_query_time' # Unit s
```

补充：我们通过慢查询日志，可以定位到是哪一条语句查询比较慢，找到这条语句之后，如何去分析它慢的原因呢?最简单的方法，可以通过explain解析，执行命令：explain (sql语句)

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212051532175.png" alt="image-20221205153205065" style="zoom:50%;" />

<center>定位到慢查询可用 expalain 分析</center>

需要重点关注possible_keys、key、rows这几个属性值。

possible_keys表示该语句可能会用到的索引。

key表示该语句实际用到的索引。

rows表示该语句扫描的行数。

通过这些属性，我们可以大致的分析一下，第一条语句没有走索引，它扫描了9万多行数据，所以查询速度比较慢，而第二条语句走了主键索引，仅仅扫描了一条语句，所以它的执行速度比较快。这样我们就可以快速定位到问题，然后针对性的去解决。







> Personal Question：有个问题不太明白，为什么对权限的检查不在优化器之前做？
>
> 作者回复: 有些时候，SQL语句要操作的表不只是SQL字面上那些。比如如果有个[触发器](https://javaguide.cn/database/mysql/a-thousand-lines-of-mysql-study-notes.html#%E8%A7%A6%E5%8F%91%E5%99%A8)，得在执行器阶段（过程中）才能确定。优化器阶段前是无能为力的



> Question：
>
> 我给你留一个问题吧，如果表 T 中没有字段 k，而你执行了这个语句 select * from T where k=1, 那肯定是会报“不存在这个列”的错误： “Unknown column ‘k’ in ‘where clause’”。你觉得这个错误是在我们上面提到的哪个阶段报出来的呢？
>
> Answer：
>
> 我猜是 分析器阶段 Bingo





## 02丨日志系统：一条SQL更新语句是如何执行的？

### 1.前言

> 一条更新语句的执行流程又是怎样的呢？

之前你可能经常听 DBA 同事说，MySQL 可以恢复到半个月内任意一秒的状态，惊叹的同时，你是不是心中也会不免会好奇，这是怎样做到的呢？

我们还是从一个表的一条更新语句说起，下面是这个表的创建语句，这个表有一个主键 ID 和一个整型字段 c：

```mysql
mysql> create table T(ID int primary key, c int);
```

如果要将 ID=2 这一行的值加 1，SQL 语句就会这么写：

```mysql
mysql> update T set c=c+1 where ID=2;
```

前面我有跟你介绍过 SQL 语句基本的执行链路，这里我再把那张图拿过来，你也可以先简单看看这个图回顾下。首先，可以确定的说，查询语句的那一套流程，更新语句也是同样会走一遍。

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212021612352.png) 

<center>MySQL 的逻辑架构图</center>

你执行语句前要先连接数据库，这是连接器的工作。

前面我们说过，在一个表上有更新的时候，跟这个表有关的查询缓存会失效，所以这条语句就会把表 T 上所有缓存结果都清空。这也就是我们一般不建议使用查询缓存的原因。

接下来，分析器会通过词法和语法解析知道这是一条更新语句。优化器决定要使用 ID 这个索引。然后，执行器负责具体执行，找到这一行，然后更新。

**与查询流程不一样的是，更新流程还涉及两个重要的日志模块**，它们正是我们今天要讨论的主角：redo log（重做日志）和 binlog（归档日志）。如果接触 MySQL，那这两个词肯定是绕不过的，我后面的内容里也会不断地和你强调。不过话说回来，redo log 和 binlog 在设计上有很多有意思的地方，这些设计思路也可以用到你自己的程序里。

### 2.redo log

> redo log 是 InnoDB 引擎特有的日志。
>
> 一个固定大小，**“循环写”**的日志文件，记录的是物理日志——“在某个数据页上做了某个修改”（页的概念看小结）。
>
> [一直费解的，这个日志存在的必要性：](https://cloud.tencent.com/developer/article/1757612)
>
> 想要恢复**未刷盘但已经写入 redo log 和 binlog 的数据**到内存时，binlog 是无法恢复的。虽然 binlog 拥有全量的日志，但没有一个标志让 innoDB 判断哪些数据已经刷盘，哪些数据还没有。
>
> 但 redo log 不一样，只要刷入磁盘的数据，都会从 redo log 中抹掉，数据库重启后，直接把 redo log 中的数据都恢复至内存就可以了。这就是为什么 redo log 具有 crash-safe 的能力，而 binlog 不具备。

不知道你还记不记得《孔乙己》这篇文章，酒店掌柜有一个粉板，专门用来记录客人的赊账记录。如果赊账的人不多，那么他可以把顾客名和账目写在板上。但如果赊账的人多了，粉板总会有记不下的时候，这个时候掌柜一定还有一个专门记录赊账的账本。

如果有人要赊账或者还账的话，掌柜一般有两种做法：

- 一种做法是直接把账本翻出来，把这次赊的账加上去或者扣除掉；
- 另一种做法是先在粉板上记下这次的账，等打烊以后再把账本翻出来核算。

在生意红火柜台很忙时，掌柜一定会选择后者，因为前者操作实在是太麻烦了。首先，你得找到这个人的赊账总额那条记录。你想想，密密麻麻几十页，掌柜要找到那个名字，可能还得带上老花镜慢慢找，找到之后再拿出算盘计算，最后再将结果写回到账本上。

这整个过程想想都麻烦。相比之下，还是先在粉板上记一下方便。你想想，如果掌柜没有粉板的帮助，每次记账都得翻账本，效率是不是低得让人难以忍受？

同样，在 MySQL 里也有这个问题，如果每一次的更新操作都需要写进磁盘，然后磁盘也要找到对应的那条记录，然后再更新，整个过程 IO 成本、查找成本都很高。为了解决这个问题，MySQL 的设计者就用了类似酒店掌柜粉板的思路来提升更新效率。

而粉板和账本配合的整个过程，其实就是 MySQL 里经常说到的 WAL 技术，WAL 的全称是 Write-Ahead Logging，它的关键点就是**先写日志，再写磁盘**，也就是先写粉板，等不忙的时候再写账本。

> Question：写redo日志也是写io（我理解也是外部存储）。同样耗费性能。怎么能做到优化呢
>
> Answer：写redo log是顺序写（固定的位置循环写入），不用去“找位置”，而更新数据需要找位置

具体来说，当有一条记录需要更新的时候，InnoDB 引擎就会先把记录写到 redo log（粉板）里面，并更新内存，这个时候更新就算完成了。同时，InnoDB 引擎会在适当的时候，将这个操作记录更新到磁盘里面，而这个更新往往是在系统比较空闲的时候做，这就像打烊以后掌柜做的事。

如果今天赊账的不多，掌柜可以等打烊后再整理。但如果某天赊账的特别多，粉板写满了，又怎么办呢？这个时候掌柜只好放下手中的活儿，把粉板中的一部分赊账记录更新到账本中，然后把这些记录从粉板上擦掉，为记新账腾出空间。

与此类似，InnoDB 的 redo log 是固定大小的，比如可以配置为一组 4 个文件，每个文件的大小是 1GB，那么这块“粉板”总共就可以记录 4GB 的操作。从头开始写，写到末尾就又回到开头循环写，如下面这个图所示。

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212071028735.png)write pos 是当前记录的位置，一边写一边后移，写到第 3 号文件末尾后就回到 0 号文件开头。checkpoint 是当前要擦除的位置，也是往后推移并且循环的，擦除记录前要把记录更新到数据文件。

write pos 和 checkpoint 之间的是“粉板”上还空着的部分，可以用来记录新的操作。如果 write pos 追上 checkpoint，表示“粉板”满了，这时候不能再执行新的更新，得停下来先擦掉一些记录，把 checkpoint 推进一下。

有了 redo log，InnoDB 就可以保证即使数据库发生异常重启，之前提交的记录都不会丢失，这个能力称为**crash-safe**。

> Question：为什么 redo log 具有 crash-safe 的能力，而 binlog 没有？
>
> [Answer](https://cloud.tencent.com/developer/article/1757612)：虽然 binlog 拥有全量的日志，但没有一个标志让 innoDB 判断哪些数据已经刷盘，哪些数据还没有。
>
> 但 redo log 不一样，只要刷入磁盘的数据，都会从 redo log 中抹掉，数据库重启后，直接把 redo log 中的数据都恢复至内存就可以了。

要理解 crash-safe 这个概念，可以想想我们前面赊账记录的例子。只要赊账记录记在了粉板上或写在了账本上，之后即使掌柜忘记了，比如突然停业几天，恢复生意后依然可以通过账本和粉板上的数据明确赊账账目。

### 3.binlog

> 你一般看到 binlog 就要想到**主从复制**。当然，除了主从复制之外，binlog 还能帮助我们实现**数据恢复**。
>
> 有两种模式，statement 格式的话是记sql语句， row 格式会记录行的内容，记两条，更新前和更新后都有。
>
> 一个无限大小，**“追加写”**的日志文件，记录的是逻辑日志——“给 ID=2 这一行的 c 字段加1”。

前面我们讲过，MySQL 整体来看，其实就有两块：一块是 Server 层，它主要做的是 MySQL 功能层面的事情；还有一块是引擎层，负责存储相关的具体事宜。上面我们聊到的粉板 redo log 是 InnoDB 引擎特有的日志，而 Server 层也有自己的日志，称为 binlog（归档日志）。

==我想你肯定会问，为什么会有两份日志呢？==

因为最开始 MySQL 里并没有 InnoDB 引擎。MySQL 自带的引擎是 MyISAM，但是 MyISAM 没有 crash-safe 的能力，binlog 日志只能用于归档。而 InnoDB 是另一个公司以插件形式引入 MySQL 的，既然只依靠 binlog 是没有 crash-safe 能力的，所以 InnoDB 使用另外一套日志系统——也就是 redo log 来实现 crash-safe 能力。

==这两种日志有以下三点不同：==

1. redo log 是 InnoDB 引擎特有的；binlog 是 MySQL 的 Server 层实现的，所有引擎都可以使用。
2. redo log 是物理日志，记录的是“在某个数据页上做了什么修改”；binlog 是逻辑日志，记录的是这个语句的原始逻辑，比如“给 ID=2 这一行的 c 字段加 1 ”。
3. redo log 是循环写的，空间固定会用完；binlog 是可以追加写入的。“追加写”是指 binlog 文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。

有了对这两个日志的概念性理解，我们再来看执行器和 InnoDB 引擎在执行这个简单的 update 语句时的内部流程。

1. 执行器先找引擎取 ID=2 这一行。ID 是主键，引擎直接用树搜索找到这一行。如果 ID=2 这一行所在的数据页本来就在内存中，就直接返回给执行器；否则，需要先从磁盘读入内存，然后再返回。
2. 执行器拿到引擎给的行数据，把这个值加上 1，比如原来是 N，现在就是 N+1，得到新的一行数据，再调用引擎接口写入这行新数据。
3. 引擎将这行新数据更新到内存中，同时将这个更新操作记录到 redo log 里面，此时 redo log 处于 prepare 状态。然后告知执行器执行完成了，随时可以提交事务。
4. 执行器生成这个操作的 binlog，并把 binlog 写入磁盘。
5. 执行器调用引擎的提交事务接口，引擎把刚刚写入的 redo log 改成提交（commit）状态，更新完成。

这里我给出这个 update 语句的执行流程图，图中浅色框表示是在 InnoDB 内部执行的，深色框表示是在执行器中执行的。

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212071121771.png)

<center>update 语句执行流程</center>

你可能注意到了，最后三步看上去有点“绕”，将 redo log 的写入拆成了两个步骤：prepare 和 commit，这就是"两阶段提交"。

### 4.两阶段提交

为什么必须有“两阶段提交”呢？这是为了让两份日志之间的逻辑一致。要说明这个问题，我们得从文章开头的那个问题说起：**怎样让数据库恢复到半个月内任意一秒的状态？**

前面我们说过了，binlog 会记录所有的逻辑操作，并且是采用“追加写”的形式。**如果你的 DBA 承诺说半个月内可以恢复，那么备份系统中一定会保存最近半个月的所有 binlog，同时系统会定期做整库备份。**这里的“定期”取决于系统的重要性，可以是一天一备，也可以是一周一备。

当需要恢复到指定的某一秒时，比如某天下午两点发现中午十二点有一次误删表，需要找回数据，那你可以这么做：

- 首先，找到最近的一次全量备份，如果你运气好，可能就是昨天晚上的一个备份，从这个备份恢复到临时库；
- 然后，从备份的时间点开始，将备份的 binlog 依次取出来，重放到中午误删表之前的那个时刻。

这样你的临时库就跟误删之前的线上库一样了，然后你可以把表数据从临时库取出来，按需要恢复到线上库去。

好了，说完了数据恢复过程，我们回来说说，为什么日志需要“两阶段提交”。这里不妨用反证法来进行解释。

由于 redo log 和 binlog 是两个独立的逻辑，如果不用两阶段提交，要么就是先写完 redo log 再写 binlog，或者采用反过来的顺序。我们看看这两种方式会有什么问题。

仍然用前面的 update 语句来做例子。假设当前 ID=2 的行，字段 c 的值是 0，再假设执行 update 语句过程中在写完第一个日志后，第二个日志还没有写完期间发生了 crash，会出现什么情况呢？

1. **先写 redo log 后写 binlog**。假设在 redo log 写完，binlog 还没有写完的时候，MySQL 进程异常重启。由于我们前面说过的，redo log 写完之后，系统即使崩溃，仍然能够把数据恢复回来，所以恢复后这一行 c 的值是 1。
   但是由于 binlog 没写完就 crash 了，这时候 binlog 里面就没有记录这个语句。因此，之后备份日志的时候，存起来的 binlog 里面就没有这条语句。
   然后你会发现，如果需要用这个 binlog 来恢复临时库的话，由于这个语句的 binlog 丢失，这个临时库就会少了这一次更新，恢复出来的这一行 c 的值就是 0，与原库的值不同。
2. **先写 binlog 后写 redo log**。如果在 binlog 写完之后 crash，由于 redo log 还没写，崩溃恢复以后这个事务无效，所以这一行 c 的值是 0。但是 binlog 里面已经记录了“把 c 从 0 改成 1”这个日志。所以，在之后用 binlog 来恢复的时候就多了一个事务出来，恢复出来的这一行 c 的值就是 1，与原库的值不同。

可以看到，如果不使用“两阶段提交”，那么数据库的状态就有可能和用它的日志恢复出来的库的状态不一致。

你可能会说，这个概率是不是很低，平时也没有什么动不动就需要恢复临时库的场景呀？

其实不是的，不只是误操作后需要用这个过程来恢复数据。当你需要扩容的时候，也就是需要再多搭建一些备库来增加系统的读能力的时候，现在常见的做法也是用全量备份加上应用 binlog 来实现的，这个“不一致”就会导致你的线上出现主从数据库不一致的情况。

简单说，redo log 和 binlog 都可以用于表示事务的提交状态，而两阶段提交就是让这两个状态保持逻辑上的一致。

### 5.小结

今天，我介绍了 MySQL 里面最重要的两个日志，即物理日志 redo log 和逻辑日志 binlog。

==补充：在事务中语句更新会生成 undo log（回滚日志）吗？ 衍生出 多版本和 row trx_id 的概念== [08丨事务到底是隔离的还是不隔离的？](#08丨事务到底是隔离的还是不隔离的？)
对于 MySQL 数据库来说，**不仅事务的更新操作会记录在 Binlog 中，非事务**的 UPDATE 语句也会被记录在 Binlog 中。
Undo Log：记录了`事务`执行前的数据，用于回滚事务 和 实现MVCC功能

redo log 用于保证 crash-safe 能力。innodb_flush_log_at_trx_commit 这个参数设置成 1 的时候，表示每次事务的 redo log 都直接持久化到磁盘。这个参数我建议你设置成 1，这样可以保证 MySQL 异常重启之后数据不丢失。

sync_binlog 这个参数设置成 1 的时候，表示每次事务的 binlog 都持久化到磁盘。这个参数我也建议你设置成 1，这样可以保证 MySQL 异常重启之后 binlog 不丢失。

```mysql
show variables like 'innodb_flush_log_at_trx_commit' #我查默认是 1
show variables like 'sync_binlog' #我查默认是 1
```

我还跟你介绍了与 MySQL 日志系统密切相关的“两阶段提交”。两阶段提交是跨系统维持数据逻辑一致性时常用的一个方案，即使你不做数据库内核开发，日常开发中也有可能会用到。



> Q：文章的最后，我给你留一个思考题吧。前面我说到定期全量备份的周期“取决于系统重要性，有的是一天一备，有的是一周一备”。那么在什么场景下，一天一备会比一周一备更有优势呢？或者说，它影响了这个数据库系统的哪个指标？



#### 补充

> 数据页：InnoDB 将存储的数据划分为若干个「页」，以页作为磁盘和内存交互的基本单位，一个页的大小默认为 16KB

```mysql
show status like 'innodb_page_size';
```

也就是说，即便我们只查询一条记录，InnoDB 也会把至少 16KB 的内容从磁盘读到内存中。

可以把「页」理解为一个容器，这个容器是用来存储「记录」的。





## 03丨事务隔离：为什么你改了我还看不见？

### 1.前言

提到事务，你肯定不陌生，和数据库打交道的时候，我们总是会用到事务。最经典的例子就是转账，你要给朋友小王转 100 块钱，而此时你的银行卡只有 100 块钱。

转账过程具体到程序里会有一系列的操作，比如查询余额、做加减法、更新余额等，这些操作必须保证是一体的，不然等程序查完之后，还没做减法之前，你这 100 块钱，完全可以借着这个时间差再查一次，然后再给另外一个朋友转账，如果银行这么整，不就乱了么？这时就要用到“事务”这个概念了。

简单来说，事务就是要保证一组数据库操作，要么全部成功，要么全部失败。在 MySQL 中，事务支持是在引擎层实现的。你现在知道，MySQL 是一个支持多引擎的系统，但并不是所有的引擎都支持事务。比如 **MySQL 原生的 MyISAM 引擎就不支持事务**，这也是 MyISAM 被 InnoDB 取代的重要原因之一。

今天的文章里，我将会以 InnoDB 为例，剖析 MySQL 在事务支持方面的特定实现，并基于原理给出相应的实践建议，希望这些案例能加深你对 MySQL 事务原理的理解。

### 2.隔离性与隔离级别

提到事务，你肯定会想到 ACID（Atomicity、Consistency、Isolation、Durability，即原子性、一致性、隔离性、持久性），今天我们就来说说其中 I，也就是“隔离性”。

当数据库上有多个事务同时执行的时候，就可能出现脏读（dirty read）、不可重复读（non-repeatable read）、幻读（phantom read）的问题【统称`一致性问题`】，为了解决这些问题，就有了“隔离级别”的概念。

在谈隔离级别之前，你首先要知道，你隔离得越严实，效率就会越低。因此很多时候，我们都要在二者之间寻找一个平衡点。SQL 标准的事务隔离级别包括：读未提交（read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化（serializable ）。下面我逐一为你解释：

[增加对应解决哪个问题 ](https://www.liaoxuefeng.com/wiki/1177760294764384/1219071817284064)  加上英文后续

- `Read Uncommitted` 读未提交是指，一个事务还没提交时，它做的变更就能被别的事务看到。**（脏读（Dirty Read）及 不可重复读、幻读）**
  - Read Uncommitted是隔离级别最低的一种事务级别。在这种隔离级别下，一个事务会读到另一个事务更新后但未提交的数据，如果另一个事务回滚，那么当前事务读到的数据就是脏数据，这就是脏读（Dirty Read）。
- `Read Committed` 读提交是指，一个事务提交之后，它做的变更才会被其他事务看到。**（不可重复读（Non Repeatable Read）及 幻读）**
  - 不可重复读是指，在一个事务内，多次读同一数据，在这个事务还没有结束时，如果另一个事务恰好修改了这个数据，那么，在第一个事务中，两次读取的数据就可能不一致。
  - ==Oracle 和 SQL Server 的默认隔离级别。==
- `Repeatable Read` 可重复读是指，一个事务执行过程中看到的数据，总是跟这个事务在启动时看到的数据是一致的。当然在可重复读隔离级别下，未提交变更对其他事务也是不可见的。**（幻读（Phantom Read））**
  - 幻读是指，在一个事务中，第一次查询某条记录，发现没有，但是，当试图更新这条不存在的记录时，竟然能成功，并且，再次读取同一条记录，它就神奇地出现了。
  - REPEATABLE-READ 隔离级别是基于 MVCC 实现的
  - ==MySQL 的默认隔离级别。==
- `Serializable` 串行化，顾名思义是对于同一行记录，“写”会加“写锁”，“读”会加“读锁”。当出现读写锁冲突的时候，后访问的事务必须等前一个事务执行完成，才能继续执行。

XD：

1）以commit为界，读未提交是commit之前的修改都可见

2）读已提交是commit之后可见

3）可重复读就是以事务启动那个时间点的数据为准，就是那个点开个视图



其中“读提交”和“可重复读”比较难理解，所以我用一个例子说明这几种隔离级别。假设数据表 T 中只有一列，其中一行的值为 1，下面是按照时间顺序执行两个事务的行为。

```mysql
mysql> create table T(c int) engine=InnoDB;
insert into T(c) values(1);
```

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212081721046.png)


我们来看看在不同的隔离级别下，事务 A 会有哪些不同的返回结果，也就是图里面 V1、V2、V3 的返回值分别是什么。

- 若隔离级别是“读未提交”， 则 V1 的值就是 2。这时候事务 B 虽然还没有提交，但是结果已经被 A 看到了。因此，V2、V3 也都是 2。
- 若隔离级别是“读提交”，则 V1 是 1，V2 的值是 2。事务 B 的更新在提交后才能被 A 看到。所以， V3 的值也是 2。
- 若隔离级别是“可重复读”，则 V1、V2 是 1，V3 是 2。之所以 V2 还是 1，遵循的就是这个要求：事务在执行期间看到的数据前后必须是一致的。
- 若隔离级别是“串行化”，则在事务 B 执行“将 1 改成 2”的时候，会被锁住。直到事务 A 提交后，事务 B 才可以继续执行。所以从 A 的角度看， V1、V2 值是 1，V3 的值是 2。

**在实现上，数据库里面会创建一个视图，访问的时候以视图的逻辑结果为准。在“可重复读”隔离级别下，这个视图是在事务启动时创建的，整个事务存在期间都用这个视图。在“读提交”隔离级别下，这个视图是在每个 SQL 语句开始执行的时候创建的。这里需要注意的是，“读未提交”隔离级别下直接返回记录上的最新值，没有视图概念；而“串行化”隔离级别下直接用加锁的方式来避免并行访问。**

我们可以看到在不同的隔离级别下，数据库行为是有所不同的。==Oracle 数据库的默认隔离级别其实就是“读提交”==，因此对于一些从 Oracle 迁移到 MySQL 的应用，为保证数据库隔离级别的一致，你一定要记得将 MySQL 的隔离级别设置为“读提交”。

配置的方式是，将启动参数 transaction-isolation 的值设置成 READ-COMMITTED。你可以用 show variables 来查看当前的值。如果使用InnoDB，默认的隔离级别是Repeatable Read。

```mysql
mysql> show variables like 'transaction_isolation';
 
+-----------------------+----------------+
 
| Variable_name | Value |
 
+-----------------------+----------------+
 
| transaction_isolation | READ-COMMITTED |
 
+-----------------------+----------------+
```

总结来说，存在即合理，哪个隔离级别都有它自己的使用场景，你要根据自己的业务情况来定。我想**你可能会问那什么时候需要“可重复读”的场景呢**？我们来看一个数据校对逻辑的案例。

假设你在管理一个个人银行账户表。一个表存了每个月月底的余额，一个表存了账单明细。这时候你要做数据校对，也就是判断上个月的余额和当前余额的差额，是否与本月的账单明细一致。你一定希望在校对过程中，即使有用户发生了一笔新的交易，也不影响你的校对结果。

这时候使用“可重复读”隔离级别就很方便。事务启动时的视图可以认为是静态的，不受其他事务更新的影响。



### 3.事务隔离的实现

理解了事务的隔离级别，我们再来看看事务隔离具体是怎么实现的。这里我们展开说明“可重复读”。(MySQL default isolation level)

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202306031634681.png" alt="image-20230603163250059" style="zoom:50%;" />

在 MySQL 中，实际上==每条记录在更新的时候都会同时记录一条回滚操作==。记录上的最新值，通过回滚操作，都可以得到前一个状态的值。

假设一个值从 1 被按顺序改成了 2、3、4，在`回滚日志 undo log` 里面就会有类似下面的记录。

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212081753521.png" style="zoom:67%;" />

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202306031640164.png" alt="image-20230603163923678" style="zoom: 67%;" />

当前值是 4，但是在查询这条记录的时候，**不同时刻启动的事务会有不同的 read-view**。如图中看到的，在视图 A、B、C 里面，这一个记录的值分别是 1、2、4，==同一条记录在系统中可以存在多个版本，就是数据库的多版本并发控制（MVCC)==。对于 read-view A，要得到 1，就必须将当前值依次执行图中所有的回滚操作得到。                 MVCC 可以看作是行级锁的一个升级，所以 MyISAM 不支持 MVCC，而 InnoDB 支持

**补充：**多版本并发控制（MVCC）是一种用来解决`读-写冲突`的**无锁并发控制**

- `读-读`：不存在任何问题，也不需要并发控制
- `读-写`：有线程安全问题，可能会造成事务隔离性问题，可能遇到脏读，幻读，不可重复读
- `写-写`：有线程安全问题，可能会存在更新丢失问题，比如第一类更新丢失，第二类更新丢失

所以**在数据库中，因为有了 MVCC，所以我们可以形成两个组合：**

> 补充：
>
> MVCC（多版本并发控制）是一种数据库事务控制技术，它可以解决读写冲突的问题，其基本思想是在数据库中维护多个版本的数据，以便在并发读写操作时，每个事务都可以读取到自己所需要的数据版本，从而避免了数据读写冲突的问题。
>
> 悲观锁SQL落地：具体来说，`SELECT ... FOR UPDATE` 语句会对查询到的行加上排它锁（Exclusive Lock），这意味着其他事务不能同时对这些行进行修改。在多个事务同时查询同一组数据时，如果其中一个事务使用了 `FOR UPDATE`，则其他事务必须等待该事务释放锁之后才能进行修改操作。
>
> > 行级锁都是基于索引的，如果一条 SQL 语句用不到索引是不会使用行级锁的，而会使用表级锁把整张表锁住，这点需要咱们格外的注意
> >
> > - 当 `SELECT... FOR UPDATE` 查询条件明确指定主键时，为**行锁**。
> > - 当 `SELECT... FOR UPDATE` 查询条件明确指定索引时，为**行锁**，所有满足此条件的行都会被加锁。
> > - 当 `SELECT... FOR UPDATE` 查询条件所指定主键为一个范围时，为**行锁**，所有满足此条件的行都会被加锁。
> > - 当 `SELECT... FOR UPDATE` 查询条件无主键、无索引时，为**表锁**。
> > - 当 `SELECT... FOR UPDATE` 查询条件明确指定索引或主键时，但查询无结果时，不会加行锁，更不会加表锁
>
> ```sql
> 以下是一个使用悲观锁解决写写冲突的实例语句：
> 
> START TRANSACTION;
> SELECT * FROM my_table WHERE id = 1 FOR UPDATE;
> -- 对 id 为 1 的数据行加悲观锁
> UPDATE my_table SET column1 = 'new value' WHERE id = 1;
> COMMIT;
> -- 事务结束，释放锁
> 在这个例子中，事务首先使用 SELECT ... FOR UPDATE 语句对 id 为 1 的数据行进行加锁。这将导致其他事务在尝试修改相同数据行时被阻塞，直到该事务释放锁。然后，事务执行更新操作并提交事务，释放锁。
> ```

- `MVCC + 悲观锁：select * from xxxx where id = 1 for update;`
  MVCC 解决读写冲突，悲观锁解决写写冲突
- `MVCC + 乐观锁：update t_goods set count = count -1 , version = version + 1 where good_id=2 and version = 1`
  MVCC 解决读写冲突，乐观锁解决写写冲突

**同时你会发现，即使现在有另外一个事务正在将 4 改成 5，这个事务跟 read-view A、B、C 对应的事务是不会冲突的。**（XD：MVCC 解决读写冲突。我在自己视图改自己的，你们读取你们自己视图的互不冲突）

你一定会问，回滚日志总不能一直保留吧，什么时候删除呢？答案是，在不需要的时候才删除。也就是说，系统会判断，当没有事务再需要用到这些回滚日志时，回滚日志会被删除。

什么时候才不需要了呢？就是当系统里没有比这个回滚日志更早的 read-view 的时候。

基于上面的说明，我们来讨论一下为什么建议你尽量不要使用长事务。

长事务意味着系统里面会存在很老的事务视图。由于这些事务随时可能访问数据库里面的任何数据，所以这个事务提交之前，数据库里面它可能用到的回滚记录都必须保留，这就会导致大量占用存储空间。

在 MySQL 5.5 及以前的版本，回滚日志是跟数据字典一起放在 ibdata 文件里的，即使长事务最终提交，回滚段被清理，文件也不会变小。我见过数据只有 20GB，而回滚段有 200GB 的库。最终只好为了清理回滚段，重建整个库。

除了对回滚段的影响，长事务还占用锁资源，也可能拖垮整个库，这个我们会在后面讲锁的时候展开。

### 4.事务的启动方式

如前面所述，长事务有这些潜在风险，我当然是建议你尽量避免。其实很多时候业务开发同学并不是有意使用长事务，通常是由于误用所致。MySQL 的事务启动方式有以下几种：

1. 显式启动事务语句， begin 或 start transaction。配套的提交语句是 commit，回滚语句是 rollback。
2. set autocommit=0，这个命令会将这个线程的自动提交关掉。意味着如果你只执行一个 select 语句，这个事务就启动了，而且并不会自动提交。这个事务持续存在直到你主动执行 commit 或 rollback 语句，或者断开连接。

有些客户端连接框架会默认连接成功后先执行一个 set autocommit=0 的命令。这就导致接下来的查询都在事务中，如果是长连接，就导致了意外的长事务。

因此，我会建议你总是使用 set autocommit=1, 通过显式语句的方式来启动事务。

但是有的开发同学会纠结“多一次交互”的问题。对于一个需要频繁使用事务的业务，第二种方式每个事务在开始时都不需要主动执行一次 “begin”，减少了语句的交互次数。如果你也有这个顾虑，我建议你使用 commit work and chain 语法。

在 autocommit 为 1 的情况下，用 begin 显式启动的事务，如果执行 commit 则提交事务。**如果执行 commit work and chain，则是提交事务并自动启动下一个事务，这样也省去了再次执行 begin 语句的开销。同时带来的好处是从程序开发的角度明确地知道每个语句是否处于事务中。**

你可以在 information_schema 库的 innodb_trx 这个表中查询长事务，比如下面这个语句，用于查找持续时间超过 60s 的事务。

```mysql
select * from information_schema.innodb_trx where TIME_TO_SEC(timediff(now(),trx_started))>60
```

### 5.小结

> 补充面试题：==说一下mysql中事务的实现原理==
>
> 1. mysql是由mvcc实现的事务控制
>
> 2. MVCC的实现依赖于：隐藏字段、ReadView、undolog
>
> 3. ReadView 数据的可见性和事务的隔离级别有关
>
> 
>
>
> PS: 隐藏字段 
>
> * DB_TRX_ID(事务ID)
> * DB_ROLL_PTR(指向该行的 undo log)
> * DB_ROW_ID（如果没有主键则会自动生成这个当主键）

这篇文章里面，我介绍了 MySQL 的事务隔离级别的现象和实现，根据实现原理分析了长事务存在的风险，以及如何用正确的方式避免长事务。希望我举的例子能够帮助你理解事务，并更好地使用 MySQL 的事务特性。

> Q：如何避免长事务对业务的影响？
>
> **首先，从应用开发端来看：**
>
> 1. 确认是否使用了 set autocommit=0。这个确认工作可以在测试环境中开展，把 MySQL 的 general_log 开起来，然后随便跑一个业务逻辑，通过 general_log 的日志来确认。一般框架如果会设置这个值，也就会提供参数来控制行为，你的目标就是把它改成 1。
> 2. 确认是否有不必要的只读事务。有些框架会习惯不管什么语句先用 begin/commit 框起来。我见过有些是业务并没有这个需要，但是也把好几个 select 语句放到了事务中。这种只读事务可以去掉。
> 3. 业务连接数据库的时候，根据业务本身的预估，通过 SET MAX_EXECUTION_TIME 命令，来控制每个语句执行的最长时间，避免单个语句意外执行太长时间。（为什么会意外？在后续的文章中会提到这类案例）
>
> **其次，从数据库端来看：**
>
> 1. 监控 information_schema.Innodb_trx 表，设置长事务阈值，超过就报警 / 或者 kill；
> 2. Percona 的 pt-kill 这个工具不错，推荐使用；
> 3. 在业务功能测试阶段要求输出所有的 general_log，分析日志行为提前发现问题；
> 4. 如果使用的是 MySQL 5.6 或者更新版本，把 innodb_undo_tablespaces 设置成 2（或更大的值）。如果真的出现大事务导致回滚段过大，这样设置后清理起来更方便。





## 04丨深入浅出索引（上）

### 1.前言

提到数据库索引，我想你并不陌生，在日常工作中会经常接触到。比如某一个 SQL 查询比较慢，分析完原因之后，你可能就会说“给某个字段加个索引吧”之类的解决方案。但到底什么是索引，索引又是如何工作的呢？今天就让我们一起来聊聊这个话题吧。

数据库索引的内容比较多，我分成了上下两篇文章。索引是数据库系统里面最重要的概念之一，所以我希望你能够耐心看完。在后面的实战文章中，我也会经常引用这两篇文章中提到的知识点，加深你对数据库索引的理解。

一句话简单来说，索引的出现其实就是为了提高数据查询的效率，就像书的目录一样。一本 500 页的书，如果你想快速找到其中的某一个知识点，在不借助目录的情况下，那我估计你可得找一会儿。同样，对于数据库的表而言，索引其实就是它的“目录”。

#### 补充：索引的优缺点

##### 优点:


* 使用索引可以大大加快 数据的检索速度（大大减少检索的数据量）, 这也是创建索引的最主要的原因。
* 通过创建唯一性索引，可以保证数据库表中每一行数据的唯一性。

<h4>缺点:</h4>
* 创建索引和维护索引需要耗费许多时间。**当对表中的数据进行==增删改==的时候，如果数据有索引，那么索引也需要动态的修改，会降低 SQL 执行效率。**
* 索引需要使用物理文件存储，也会耗费一定空间。

但是，<b>使用索引一定能提高查询性能吗?</b>

大多数情况下，索引查询都是比全表扫描要快的。但是如果数据库的数据量不大，那么使用索引也不一定能够带来很大提升。

<a href="https://javaguide.cn/database/mysql/mysql-index.html#%E7%B4%A2%E5%BC%95%E7%9A%84%E4%BC%98%E7%BC%BA%E7%82%B9">原文链接</a>

##### 面试题-百万级别以上的数据如何删除？ 

看下文 title



### 2.索引的常见模型

> 索引就是数据结构!!一种为了提升检索效率的数据结构。在 MySQL 中，无论是 Innodb 还是 MyIsam，都使用了 B+树作为索引结构
>
> 哈希表这种结构适用于只有等值查询的场景
> 有序数组索引只适用于静态存储引擎
> 搜索树

索引的出现是为了提高查询效率，但是实现索引的方式却有很多种，所以这里也就引入了索引模型的概念。可以用于提高读写效率的数据结构很多，这里我先给你介绍三种常见、也比较简单的数据结构，它们分别是**哈希表、有序数组和搜索树**。

下面我主要从使用的角度，为你简单分析一下这三种模型的区别。

#### 2.1.哈希表

哈希表是一种以键 - 值（key-value）存储数据的结构，我们只要输入待查找的值即 key，就可以找到其对应的值即 Value。哈希的思路很简单，把值放在数组里，用一个哈希函数把 key 换算成一个确定的位置，然后把 value 放在数组的这个位置。

不可避免地，多个 key 值经过哈希函数的换算，会出现同一个值的情况。处理这种情况的一种方法是，拉出一个链表。

假设，你现在维护着一个身份证信息和姓名的表，需要根据身份证号查找对应的名字，这时对应的哈希索引的示意图如下所示：

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212101020092.png" style="zoom:50%;" />

<center>图 1 哈希表示意图</center>

图中，User2 和 User4 根据身份证号算出来的值都是 N，但没关系，后面还跟了一个链表。假设，这时候你要查 ID_card_n2 对应的名字是什么，处理步骤就是：首先，将 ID_card_n2 通过哈希函数算出 N；然后，按顺序遍历，找到 User2。

需要注意的是，图中四个 ID_card_n 的值并不是递增的，这样做的好处是增加新的 User 时速度会很快，只需要往后追加。但缺点是，因为不是有序的，所以哈希索引做区间查询的速度是很慢的。

你可以设想下，如果你现在要找身份证号在 [ID_card_X, ID_card_Y] 这个区间的所有用户，就必须全部扫描一遍了。

所以，**哈希表这种结构适用于只有等值查询的场景**，比如 Memcached 及其他一些 NoSQL 引擎。

#### 2.2.有序数组

而**有序数组在等值查询（二分）和范围查询场景中的性能就都非常优秀**。还是上面这个根据身份证号查名字的例子，如果我们使用有序数组来实现的话，示意图如下所示：

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212101020345.png" style="zoom:50%;" />

<center>图 2 有序数组示意图</center>

这里我们假设身份证号没有重复，这个数组就是按照身份证号递增的顺序保存的。这时候如果你要查 ID_card_n2 对应的名字，用二分法就可以快速得到，这个时间复杂度是 O(log(N))。

同时很显然，这个索引结构支持范围查询。你要查身份证号在 [ID_card_X, ID_card_Y] 区间的 User，可以先用二分法找到 ID_card_X（如果不存在 ID_card_X，就找到大于 ID_card_X 的第一个 User），然后向右遍历，直到查到第一个大于 ID_card_Y 的身份证号，退出循环。

如果仅仅看查询效率，有序数组就是最好的数据结构了。但是，在需要更新数据的时候就麻烦了，你往中间插入一个记录就必须得挪动后面所有的记录，成本太高。

所以，**有序数组索引只适用于静态存储引擎**，比如你要保存的是 2017 年某个城市的所有人口信息，这类不会再修改的数据。

#### 2.3.==搜索树==

二叉搜索树也是课本里的经典数据结构了。还是上面根据身份证号查名字的例子，如果我们用二叉搜索树来实现的话，示意图如下所示：

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212101021739.png" style="zoom:50%;" />

<center>图 3 二叉搜索树示意图</center>

二叉搜索树的特点是：每个节点的左儿子小于父节点，父节点又小于右儿子。这样如果你要查 ID_card_n2 的话，按照图中的搜索顺序就是按照 UserA -> UserC -> UserF -> User2 这个路径得到。这个时间复杂度是 O(log(N))。

**当然为了维持 O(log(N)) 的查询复杂度，你就需要保持这棵树是平衡二叉树**。为了做这个保证，更新的时间复杂度也是 O(log(N))。

**补充：**二叉查找树由于存在退化成链表的可能性，会使得查询操作的时间复杂度从 O(logn)降低为 O(n)。为了解决二叉查找树会在极端情况下退化成链表的问题，后面就有人提出**平衡二叉查找树（AVL 树）**。

树可以有二叉，也可以有多叉。多叉树就是每个节点有多个儿子，儿子之间的大小保证从左到右递增。二叉树是搜索效率最高的，但是实际上==大多数的数据库存储却并不使用二叉树。其原因是，索引不止存在内存中，还要写到磁盘上==。

你可以想象一下一棵 100 万节点的平衡二叉树，树高 20。一次查询可能需要访问 20 个数据块。在机械硬盘时代，从磁盘随机读一个数据块需要 10 ms 左右的寻址时间。也就是说，对于一个 100 万行的表，如果使用二叉树来存储，单独访问一个行可能需要 20 个 10 ms 的时间，这个查询可真够慢的。

[**补充：**](https://new.qq.com/rain/a/20211223A01TAX00)

1）由于树是存储在磁盘中的，访问每个节点，都对应一次磁盘 I/O 操作（假设一个节点的大小「小于」操作系统的最小读写单位块的大小），也就是说**树的高度就等于每次查询数据时磁盘 IO 操作的次数**，所以树的高度越高，就会影响查询性能。

2）这里有点不理解，为什么树高20就是20个数据块？  

每个叶子结点就是一个块，每个块包含两个数据，块之间通过链式方式链接。树高20的话，就要遍历20个块

**B+树的非叶子节点不保存数据，只进行数据索引（关键字记录的指针）**

**B+树叶子节点保存了父节点的所有关键字记录的指针，所有数据地址必须要到叶子节点才能获取到。所以每次数据查询的次数都一样；**



**补充：**数据库存储大多不适用二叉树，因为树高过高，会适用N叉树。  这里 N 叉树没很理解，B+树难道是 N 叉？

==答：是的。B树和平衡二叉树不同，B树属于多叉树又名**平衡多路查找树**（查找路径不只两个）==

**B+Tree这种多叉树，更加矮宽，更适合存储在磁盘中**

为了让一个查询尽量少地读磁盘，就必须让查询过程访问尽量少的数据块。那么，我们就不应该使用二叉树，而是要使用“N 叉”树。这里，“N 叉”树中的“N”取决于数据块的大小。

以 InnoDB 的一个整数字段索引为例，这个 N 差不多是 1200。这棵树高是 4 的时候，就可以存 1200 的 3 次方个值，这已经 17 亿了。考虑到树根的数据块总是在内存中的，一个 10 亿行的表上一个整数字段的索引，查找一个值最多只需要访问 3 次磁盘。其实，树的第二层也有很大概率在内存中，那么访问磁盘的平均次数就更少了。

N 叉树由于在读写上的性能优点，以及适配磁盘的访问模式，已经被广泛应用在数据库引擎中了。

不管是哈希还是有序数组，或者 N 叉树，它们都是不断迭代、不断优化的产物或者解决方案。数据库技术发展到今天，跳表、LSM 树等数据结构也被用于引擎设计中，这里我就不再一一展开了。

你心里要有个概念，数据库底层存储的核心就是基于这些数据模型的。每碰到一个新数据库，我们需要先关注它的数据模型，这样才能从理论上分析出这个数据库的适用场景。

截止到这里，我用了半篇文章的篇幅和你介绍了不同的数据结构，以及它们的适用场景，你可能会觉得有些枯燥。但是，我建议你还是要多花一些时间来理解这部分内容，毕竟这是数据库处理数据的核心概念之一，在分析问题的时候会经常用到。当你理解了索引的模型后，就会发现在分析问题的时候会有一个更清晰的视角，体会到引擎设计的精妙之处。

现在，我们一起进入相对偏实战的内容吧。

在 MySQL 中，索引是在存储引擎层实现的，所以并没有统一的索引标准，即不同存储引擎的索引的工作方式并不一样。而即使多个存储引擎支持同一种类型的索引，其底层的实现也可能不同。由于 InnoDB 存储引擎在 MySQL 数据库中使用最为广泛，所以下面我就以 InnoDB 为例，和你分析一下其中的索引模型。

### 3.InnoDB 的索引模型

在 InnoDB 中，表都是根据主键顺序以索引的形式存放的，这种存储方式的表称为索引组织表。又因为前面我们提到的，InnoDB 使用了 B+ 树索引模型，所以数据都是存储在 B+ 树中的。

每一个索引在 InnoDB 里面对应一棵 B+ 树。

假设，我们有一个主键列为 ID 的表，表中有字段 k，并且在 k 上有索引。

这个表的建表语句是：

```mysql
mysql> create table T(
        id int primary key, 
        k int not null, 
        name varchar(16),
        index (k))engine=InnoDB;
```

表中 R1~R5 的 (ID,k) 值分别为 (100,1)、(200,2)、(300,3)、(500,5) 和 (600,6)，两棵树的示例示意图如下。

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212101040832.png" style="zoom:50%;" />

<center>图 4 InnoDB 的索引组织结构</center>

从图中不难看出，根据叶子节点的内容，索引类型分为主键索引和非主键索引。

主键索引的叶子节点存的是整行数据。在 InnoDB 里，主键索引也被称为聚簇索引（clustered index）。

非主键索引的叶子节点内容是主键的值。在 InnoDB 里，非主键索引也被称为二级索引（secondary index）。

根据上面的索引结构说明，我们来讨论一个问题：**基于主键索引和普通索引的查询有什么区别？**

- 如果语句是 select * from T where ID=500，即主键查询方式，则只需要搜索 ID 这棵 B+ 树；
- 如果语句是 select * from T where k=5，即普通索引查询方式，则需要先搜索 k 索引树，得到 ID 的值为 500，再到 ID 索引树搜索一次。这个过程称为`回表`。

也就是说，基于非主键索引的查询需要多扫描一棵索引树。因此，我们在应用中应该尽量使用主键查询。

### 4.索引维护

B+ 树为了维护索引有序性，在插入新值的时候需要做必要的维护。以上面这个图为例，如果插入新的行 ID 值为 700，则只需要在 R5 的记录后面插入一个新记录。如果新插入的 ID 值为 400，就相对麻烦了，需要逻辑上挪动后面的数据，空出位置。

而更糟的情况是，如果 R5 所在的数据页已经满了，根据 B+ 树的算法，这时候需要申请一个新的数据页，然后挪动部分数据过去。这个过程称为页分裂。在这种情况下，性能自然会受影响。

除了性能外，页分裂操作还影响数据页的利用率。原本放在一个页的数据，现在分到两个页中，整体空间利用率降低大约 50%。

当然有**分裂**就有**合并**。当相邻两个页由于删除了数据，利用率很低之后，会将数据页做合并。合并的过程，可以认为是分裂过程的逆过程。

基于上面的索引维护过程说明，我们来讨论一个案例：

> 你可能在一些建表规范里面见到过类似的描述，要求建表语句里一定要有自增主键。当然事无绝对，我们来分析一下哪些场景下应该使用自增主键，而哪些场景下不应该。

自增主键是指自增列上定义的主键，在建表语句中一般是这么定义的： NOT NULL PRIMARY KEY AUTO_INCREMENT。

插入新记录的时候可以不指定 ID 的值，系统会获取当前 ID 最大值加 1 作为下一条记录的 ID 值。

**也就是说，自增主键的插入数据模式，正符合了我们前面提到的递增插入的场景。每次插入一条新记录，都是追加操作，都不涉及到挪动其他记录，也不会触发叶子节点的分裂。**

而有业务逻辑的字段做主键，则往往不容易保证有序插入，这样写数据成本相对较高。

除了考虑性能外，我们还可以从存储空间的角度来看。假设你的表中确实有一个唯一字段，比如字符串类型的身份证号，那应该用身份证号做主键，还是用自增字段做主键呢？

由于每个非主键索引的叶子节点上都是主键的值。如果用身份证号做主键，那么每个二级索引的叶子节点占用约 20 个字节，而如果用整型做主键，则只要 4 个字节，如果是长整型（bigint）则是 8 个字节。

**补充：身份证号因为有 char 'x' 17+3=20**

**显然，主键长度越小，普通索引的叶子节点就越小，普通索引占用的空间也就越小。**

==所以，从性能和存储空间方面考量，自增主键往往是更合理的选择。==

有没有什么场景适合用业务字段直接做主键的呢？还是有的。比如，有些业务的场景需求是这样的：

1. 只有一个索引；
2. 该索引必须是唯一索引。

你一定看出来了，这就是典型的 KV 场景。

由于没有其他索引，所以也就不用考虑其他索引的叶子节点大小的问题。

这时候我们就要优先考虑上一段提到的“尽量使用主键查询”原则，直接将这个索引设置为主键，可以避免每次查询需要搜索两棵树。

### 5.小结

今天，我跟你分析了数据库引擎可用的数据结构，介绍了 InnoDB 采用的 B+ 树结构，以及**为什么 InnoDB 要这么选择。B+ 树能够很好地配合磁盘的读写特性，减少单次查询的磁盘访问次数。**

由于 InnoDB 是索引组织表，一般情况下我会建议你创建一个自增主键，这样非主键索引占用的空间最小。但事无绝对，我也跟你讨论了使用业务逻辑字段做主键的应用场景。

> Q：
>
> 最后，我给你留下一个问题吧。对于上面例子中的 InnoDB 表 T，如果你要重建索引 k，你的两个 SQL 语句可以这么写：
>
> ```mysql
> alter table T drop index k;
> alter table T add index(k);
> ```
>
> 如果你要重建主键索引，也可以这么写：
>
> ```mysql
> alter table T drop primary key;
> alter table T add primary key(id);
> ```
>
> 我的问题是，对于上面这两个重建索引的作法，说出你的理解。如果有不合适的，为什么，更好的方法是什么？
>
> A：
>
> 在评论区，有同学问到为什么要重建索引。我们文章里面有提到，索引可能因为删除，或者页分裂等原因，导致数据页有空洞，重建索引的过程会创建一个新的索引，把数据按顺序插入，这样页面的利用率最高，**也就是索引更紧凑、更省空间**。
>
> 这道题目，我给你的“参考答案”是：
>
> 重建索引 k 的做法是合理的，可以达到省空间的目的。但是，重建主键的过程不合理。不论是删除主键还是创建主键，都会将整个表重建。所以连着执行这两个语句的话，第一个语句就白做了。**这两个语句，你可以用这个语句代替 ： alter table T engine=InnoDB**。在专栏的第 12 篇文章《为什么表数据删掉一半，表文件大小不变？》中，我会和你分析这条语句的执行流程。



#### ==补充：[int（4）、int（8）、int（11） 分别占用几个字节 ？](https://blog.csdn.net/qq_33378853/article/details/106723332)==

他们都是 4 个字节。

我们以 int(11) 为例来说，11 代表该数据类型指定的显示宽度，指定能够显示的数值中数字的个数。
该声明指明，在 id 字段中的数据一般只显示 11 位数字的宽度。



**显示宽度**只用于显示，并不能限制**取值范围和占用空间**，如：int(3) 会占用 4 个字节的存储空间，并且允许的最大值也不会是 999，而是 int 整型所允许的最大值。





## 05丨深入浅出索引（下）

### 1.前言

在上一篇文章中，我和你介绍了 InnoDB 索引的数据结构模型，今天我们再继续聊聊跟 MySQL 索引有关的概念。

在开始这篇文章之前，我们先来看一下这个问题：

在下面这个表 T 中，如果我执行 select * from T where k between 3 and 5，需要执行几次树的搜索操作，会扫描多少行？

下面是这个表的初始化语句。

```mysql
mysql> create table T (
        ID int primary key,
        k int NOT NULL DEFAULT 0, 
        s varchar(16) NOT NULL DEFAULT '',
        index k(k))
        engine=InnoDB;
 
insert into T values(100,1, 'aa'),(200,2,'bb'),(300,3,'cc'),(500,5,'ee'),(600,6,'ff'),(700,7,'gg');
```

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212121140730.png" style="zoom:50%;" />

<center>图 1 InnoDB 的索引组织结构</center>

现在，我们一起来看看这条 SQL 查询语句的执行流程：

1. 在 k 索引树上找到 k=3 的记录，取得 ID = 300；
2. 再到 ID 索引树查到 ID=300 对应的 R3；
3. 在 k 索引树取下一个值 k=5，取得 ID=500；
4. 再回到 ID 索引树查到 ID=500 对应的 R4；
5. 在 k 索引树取下一个值 k=6，不满足条件，循环结束。

在这个过程中，**回到主键索引树搜索的过程，我们称为回表**。可以看到，这个查询过程读了 k 索引树的 3 条记录（步骤 1、3 和 5），回表了两次（步骤 2 和 4）。

在这个例子中，由于查询结果所需要的数据只在主键索引上有，所以不得不回表。那么，有没有可能经过索引优化，避免回表过程呢？

### 2.覆盖索引

如果执行的语句是 select ID from T where k between 3 and 5，这时只需要查 ID 的值，而 ID 的值已经在 k 索引树上了，因此可以直接提供查询结果，不需要回表。也就是说，在这个查询里面，索引 k 已经“覆盖了”我们的查询需求，我们称为覆盖索引。

**由于覆盖索引可以减少树的搜索次数，显著提升查询性能，所以使用覆盖索引是一个常用的性能优化手段。**

需要注意的是，在引擎内部使用覆盖索引在索引 k 上其实读了三个记录，R3~R5（对应的索引 k 上的记录项），但是对于 MySQL 的 Server 层来说，它就是找引擎拿到了两条记录，因此 MySQL 认为扫描行数是 2。

> 备注：关于如何查看扫描行数的问题，我将会在第 16 文章《如何正确地显示随机消息？》中，和你详细讨论。

基于上面覆盖索引的说明，我们来讨论一个问题：**在一个市民信息表上，是否有必要将身份证号和名字建立联合索引？**

假设这个市民表的定义是这样的：

```mysql
CREATE TABLE `tuser` (
  `id` int(11) NOT NULL,
  `id_card` varchar(32) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `ismale` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_card` (`id_card`),
  KEY `name_age` (`name`,`age`)
) ENGINE=InnoDB
```

我们知道，身份证号是市民的唯一标识。也就是说，如果有根据身份证号查询市民信息的需求，我们只要在身份证号字段上建立索引就够了。而再建立一个（身份证号、姓名）的联合索引，是不是浪费空间？

如果现在有一个高频请求，要根据市民的身份证号查询他的姓名，这个联合索引就有意义了。它可以在这个高频请求上用到覆盖索引，不再需要回表查整行记录，减少语句的执行时间。

当然，索引字段的维护总是有代价的。因此，**在建立冗余索引来支持覆盖索引**时就需要权衡考虑了。这正是业务 DBA，或者称为业务数据架构师的工作。

### 3.最左前缀原则

> **顾名思义，就是最左优先，在创建多列索引时，要根据业务需求，where子句中使用最频繁的一列放在最左边。**
> 联合索引：根据创建联合索引的顺序，以最左原则进行where检索，比如（age，name）以age=1 或 age= 1 and name=‘张三’可以使用索引，单以name=‘张三’ 不会使用索引，考虑到存储空间的问题，还请根据业务需求，将查找频繁的数据进行靠左创建索引。
>
> 问题：where age,name 使用索引吗？[使用！ ](https://developer.aliyun.com/ask/281197) mysql查询优化器会判断纠正这条sql语句该以什么样的顺序执行效率最高，最后才生成真正的执行计划

补充：最左前缀原则：顾名思义是最左优先，以最左边的为起点任何连续的索引都能匹配上。

（1）如果第一个字段是范围查询需要单独建一个索引；

（2）在创建多列索引时，要根据业务需求，where子句中使用最频繁的一列放在最左边；

**当创建index(a,b,c)复合索引时，想要索引生效的话，只能使用 a和ab、ac和abc三种组合！**（其中 ac 只用到a）

实例：以下是常见的几个查询：

```js
mysql>SELECT `a`,`b`,`c` FROM A WHERE `a`='a1' ; //索引生效
mysql>SELECT `a`,`b`,`c` FROM A WHERE `b`='b2' AND `c`='c2'; //索引失效
mysql>SELECT `a`,`b`,`c` FROM A WHERE `a`='a3' AND `c`='c3'; //索引生效，实际上只使用了索引a
+++++ where a=3 and b>4 and c=5  //只用到了a、b 因为c不能在范围之后

--- 几个不支持索引的特别的点
1）where a<>1会使用到索引吗
	对于条件 a<>1，数据库优化器可能不会选择使用复合索引 (a, b, c)。这是因为在不等于条件下，查询需要返回不等于指定值的所有记录，而复合索	引是按照索引的顺序来存储数据的。因此，优化器可能会认为全表扫描（Table Scan）比使用复合索引更高效。
2）where a is null and b is not null    
	isnull支持索引但是isnotnull不支持
3）where abs(a)=3
	函数不支持


XD: 联合索引给(a,b,c)添加，如果where a,c,b 索引会生效吗？（生效，优化器会优化）
```

详细点的Table：假设index(a,b,c)

| Where语句                                               | 素引是否被使用                                               |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| where a = 3                                             | Y,使用到a                                                    |
| where a = 3 and b = 5                                   | Y,使用到a，b                                                 |
| where a = 3 and b = 5 and c = 4                         | Y,使用到a,b,c                                                |
| where b = 3 或者 where b = 3 and c = 4 或者 where c = 4 | N                                                            |
| where a = 3 and c = 5                                   | 使用到a， 但是c不可以，b中间断了                             |
| where a = 3 and b > 4 and c = 5                         | 使用到a和b， c不能用在范围之后，b断了                        |
| where a is null and b is not null                       | is null 支持索引 但是is not null 不支持,所以 a 可以使用索引,但是 b不一定能用上索引（8.0） |
| where a <> 3                                            | 不能使用索引                                                 |
| where abs(a) =3                                         | 不能使用 索引                                                |
| where a = 3 and b like ‘kk%’ and c = 4                  | Y,使用到a,b,c                                                |
| where a = 3 and b like ‘%kk’ and c = 4                  | Y,只用到a                                                    |
| where a = 3 and b like ‘%kk%’ and c = 4                 | Y,只用到a                                                    |
| where a = 3 and b like ‘k%kk%’ and c = 4                | Y,使用到a,b,c                                                |

补充：

* **无过滤不索引**
  * 语句没有where 只有 order by不会用索引explain的type为all，所以要加上where才会走索引
* order by非最左 filesort（也需和where的一样遵循最左匹配原则）
  * 在MySQL的`EXPLAIN`语句中，当查询执行使用了`Using filesort`时，表示MySQL需要进行排序操作，但无法使用索引来完成排序，而是需要通过临时文件进行排序



看到这里你一定有一个疑问，如果为每一种查询都设计一个索引，索引是不是太多了。如果我现在要按照市民的身份证号去查他的家庭地址呢？虽然这个查询需求在业务中出现的概率不高，但总不能让它走全表扫描吧？反过来说，单独为一个不频繁的请求创建一个（身份证号，地址）的索引又感觉有点浪费。应该怎么做呢？

这里，我先和你说结论吧。**B+ 树这种索引结构，可以利用索引的“最左前缀”，来定位记录。**

为了直观地说明这个概念，我们用（name，age）这个联合索引来分析。

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212121140664.jpeg" style="zoom:50%;" />

<center>图 2 （name，age)索引示意图</center>

可以看到，==索引项是按照索引定义里面出现的字段顺序排序的==（对应这期的问题）。

当你的逻辑需求是查到所有名字是“张三”的人时，可以快速定位到 ID4，然后向后遍历得到所有需要的结果。

**如果你要查的是所有名字第一个字是“张”的人，你的 SQL 语句的条件是"where name like ‘张 %’"。这时，你也能够用上这个索引，查找到第一个符合条件的记录是 ID3，然后向后遍历，直到不满足条件为止。**

可以看到，不只是索引的全部定义，只要满足最左前缀，就可以利用索引来加速检索。这个最左前缀可以是联合索引的最左 N 个字段，也可以是字符串索引的最左 M 个字符。

基于上面对最左前缀索引的说明，我们来讨论一个问题：**在建立联合索引的时候，如何安排索引内的字段顺序。**

这里我们的评估标准是，索引的复用能力。因为可以支持最左前缀，所以当已经有了 (a,b) 这个联合索引后，一般就不需要单独在 a 上建立索引了。因此，**第一原则是，如果通过调整顺序，可以少维护一个索引，那么这个顺序往往就是需要优先考虑采用的。**

所以现在你知道了，这段开头的问题里，我们要为高频请求创建 (身份证号，姓名）这个联合索引，并用这个索引支持“根据身份证号查询地址”的需求。

那么，如果既有联合查询，又有基于 a、b 各自的查询呢？查询条件里面只有 b 的语句，是无法使用 (a,b) 这个联合索引的，这时候你不得不维护另外一个索引，也就是说你需要同时维护 (a,b)、(b) 这两个索引。

这时候，我们要**考虑的原则就是空间**了。比如上面这个市民表的情况，name 字段是比 age 字段大的 ，那我就建议你创建一个（name,age) 的联合索引和一个 (age) 的单字段索引。

### 4.索引下推

上一段我们说到满足最左前缀原则的时候，最左前缀可以用于在索引中定位记录。这时，你可能要问，那些不符合最左前缀的部分，会怎么样呢？

我们还是以市民表的联合索引（name, age）为例。如果现在有一个需求：检索出表中“名字第一个字是张，而且年龄是 10 岁的所有男孩”。那么，SQL 语句是这么写的：

```mysql
mysql> select * from tuser where name like '张 %' and age=10 and ismale=1;
```

你已经知道了前缀索引规则，所以这个语句在搜索索引树的时候，只能用 “张”，找到第一个满足条件的记录 ID3。当然，这还不错，总比全表扫描要好。

然后呢？

当然是判断其他条件是否满足。 

在 MySQL 5.6 之前，只能从 ID3 开始一个个回表。到主键索引上找出数据行，再对比字段值。

而 MySQL 5.6 引入的索引下推优化（index condition pushdown)， 可以在索引遍历过程中，对索引中包含的字段先做判断，直接过滤掉不满足条件的记录，减少回表次数。

图 3 和图 4，是这两个过程的执行流程图。

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212121145257.jpeg" style="zoom:50%;" />

<center>图 3 无索引下推执行流程</center>

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212121145015.jpeg" style="zoom:50%;" />

<center>图 4 索引下推执行流程</center>

在图 3 和 4 这两个图里面，每一个虚线箭头表示回表一次。

图 3 中，在 (name,age) 索引里面我特意去掉了 age 的值，这个过程 InnoDB 并不会去看 age 的值，只是按顺序把“name 第一个字是’张’”的记录一条条取出来回表。因此，需要回表 4 次。

图 4 跟图 3 的区别是，InnoDB 在 (name,age) 索引内部就判断了 age 是否等于 10，对于不等于 10 的记录，直接判断并跳过。在我们的这个例子中，只需要对 ID4、ID5 这两条记录回表取数据判断，就只需要回表 2 次。

### 5.小结

今天这篇文章，我和你继续讨论了数据库索引的概念，包括了覆盖索引、前缀索引、索引下推。你可以看到，在满足语句需求的情况下， 尽量少地访问资源是数据库设计的重要原则之一。我们在使用数据库的时候，尤其是在设计表结构时，也要以减少资源消耗作为目标。



> Question：
>
> 实际上主键索引也是可以使用多个字段的。DBA 小吕在入职新公司的时候，就发现自己接手维护的库里面，有这么一个表，表结构定义类似这样的：
>
> ```mysql
> CREATE TABLE `geek` (
>   `a` int(11) NOT NULL,
>   `b` int(11) NOT NULL,
>   `c` int(11) NOT NULL,
>   `d` int(11) NOT NULL,
>   PRIMARY KEY (`a`,`b`),
>   KEY `c` (`c`),
>   KEY `ca` (`c`,`a`),
>   KEY `cb` (`c`,`b`)
> ) ENGINE=InnoDB;
> ```
>
> 公司的同事告诉他说，由于历史原因，这个表需要 a、b 做联合主键，这个小吕理解了。
>
> 但是，学过本章内容的小吕又纳闷了，既然主键包含了 a、b 这两个字段，那意味着单独在字段 c 上创建一个索引，就已经包含了三个字段了呀，为什么要创建“ca”“cb”这两个索引？
>
> 同事告诉他，是因为他们的业务里面有这样的两种语句：
>
> ```mysql
> select * from geek where c=N order by a limit 1;
> select * from geek where c=N order by b limit 1;
> ```
>
> 我给你的问题是，这位同事的解释对吗，为了这两个查询模式，这两个索引是否都是必须的？为什么呢？
>
> 
>
> Answer: ==未理解== 分开声明的两个 key 在 where 后一起用两个 key 都会走吗？
>
> 上期的问题是关于对联合主键索引和 InnoDB 索引组织表的理解。
>
> 我直接贴 @老杨同志 的回复略作修改如下（我修改的部分用橙色标出）：
>
> 表记录
> –a--|–b--|–c--|–d--
> 1 2 3 d
> 1 3 2 d
> 1 4 3 d
> 2 1 3 d
> 2 2 2 d
> 2 3 4 d
> 主键 a，b 的聚簇索引组织顺序相当于 order by a,b ，也就是先按 a 排序，再按 b 排序，c 无序。
>
> 索引 ca 的组织是先按 c 排序，再按 a 排序，同时记录主键
> –c--|–a--|–主键部分b-- （注意，这里不是 ab，而是只有 b）
> 2 1 3
> 2 2 2
> 3 1 2
> 3 1 4
> 3 2 1
> 4 2 3
> 这个跟索引 c 的数据是一模一样的。
>
> 索引 cb 的组织是先按 c 排序，在按 b 排序，同时记录主键
> –c--|–b--|–主键部分a-- （同上）
> 2 2 2
> 2 3 1
> 3 1 2
> 3 2 1
> 3 4 1
> 4 3 2
>
> 所以，结论是 ca 可以去掉，cb 需要保留。





## 06丨全局锁和表锁：给表加个字段怎么有这么多阻碍？:(

> 这一章没怎么懂 FTWRL、MDL

### 1.前言

今天我要跟你聊聊 MySQL 的锁。数据库锁设计的初衷是处理并发问题。作为多用户共享的资源，当出现并发访问的时候，数据库需要合理地控制资源的访问规则。而锁就是用来实现这些访问规则的重要数据结构。

**根据加锁的范围，MySQL 里面的锁大致可以分成全局锁、表级锁和行锁三类**。今天这篇文章，我会和你分享全局锁和表级锁。而关于行锁的内容，我会留着在下一篇文章中再和你详细介绍。

这里需要说明的是，锁的设计比较复杂，这两篇文章不会涉及锁的具体实现细节，主要介绍的是碰到锁时的现象和其背后的原理。

### 2.全局锁

顾名思义，全局锁就是对整个数据库实例加锁。MySQL 提供了一个加全局读锁的方法，命令是 Flush tables with read lock (FTWRL)。当你需要让整个库处于只读状态的时候，可以使用这个命令，之后其他线程的以下语句会被阻塞：数据更新语句（数据的增删改）、数据定义语句（包括建表、修改表结构等）和更新类事务的提交语句。

**全局锁的典型使用场景是，做全库逻辑备份。**也就是把整库每个表都 select 出来存成文本。

以前有一种做法，是通过 FTWRL 确保不会有其他线程对数据库做更新，然后对整个库做备份。注意，在备份过程中整个库完全处于只读状态。

但是让整库都只读，听上去就很危险：

- 如果你在主库上备份，那么在备份期间都不能执行更新，业务基本上就得停摆；
- 如果你在从库上备份，那么备份期间从库不能执行主库同步过来的 binlog，会导致主从延迟。

看来加全局锁不太好。但是细想一下，备份为什么要加锁呢？我们来看一下不加锁会有什么问题。

假设你现在要维护“极客时间”的购买系统，关注的是用户账户余额表和用户课程表。

现在发起一个逻辑备份。假设备份期间，有一个用户，他购买了一门课程，业务逻辑里就要扣掉他的余额，然后往已购课程里面加上一门课。

如果时间顺序上是先备份账户余额表 (u_account)，然后用户购买，然后备份用户课程表 (u_course)，会怎么样呢？你可以看一下这个图：

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212121837867.png)

<center>图 1 业务和备份状态图</center>

可以看到，这个备份结果里，用户 A 的数据状态是“账户余额没扣，但是用户课程表里面已经多了一门课”。如果后面用这个备份来恢复数据的话，用户 A 就发现，自己赚了。

作为用户可别觉得这样可真好啊，你可以试想一下：如果备份表的顺序反过来，先备份用户课程表再备份账户余额表，又可能会出现什么结果？

也就是说，不加锁的话，备份系统备份的得到的库不是一个逻辑时间点，这个视图是逻辑不一致的。

说到视图你肯定想起来了，我们在前面讲事务隔离的时候，其实是有一个方法能够拿到一致性视图的，对吧？

是的，就是在可重复读隔离级别下开启一个事务。

> 备注：如果你对事务隔离级别的概念不是很清晰的话，可以再回顾一下第 3 篇文章[《事务隔离：为什么你改了我还看不见？》](#03丨事务隔离：为什么你改了我还看不见？)中的相关内容。

官方自带的逻辑备份工具是 mysqldump。当 mysqldump 使用参数–single-transaction 的时候，导数据之前就会启动一个事务，来确保拿到一致性视图。而由于 MVCC 的支持，这个过程中数据是可以正常更新的。

你一定在疑惑，有了这个功能，为什么还需要 FTWRL 呢？**一致性读是好，但前提是引擎要支持这个隔离级别。**比如，对于 MyISAM 这种不支持事务的引擎，如果备份过程中有更新，总是只能取到最新的数据，那么就破坏了备份的一致性。这时，我们就需要使用 FTWRL 命令了。

所以，**single-transaction 方法只适用于所有的表使用事务引擎的库。**如果有的表使用了不支持事务的引擎，那么备份就只能通过 FTWRL 方法。这往往是 DBA 要求业务开发人员使用 InnoDB 替代 MyISAM 的原因之一。

你也许会问，**既然要全库只读，为什么不使用 set global readonly=true 的方式呢**？确实 readonly 方式也可以让全库进入只读状态，但我还是会建议你用 FTWRL 方式，主要有两个原因：

- 一是，在有些系统中，readonly 的值会被用来做其他逻辑，比如用来判断一个库是主库还是备库。因此，修改 global 变量的方式影响面更大，我不建议你使用。
- 二是，在异常处理机制上有差异。如果执行 FTWRL 命令之后由于客户端发生异常断开，那么 MySQL 会自动释放这个全局锁，整个库回到可以正常更新的状态。而将整个库设置为 readonly 之后，如果客户端发生异常，则数据库就会一直保持 readonly 状态，这样会导致整个库长时间处于不可写状态，风险较高。

业务的更新不只是增删改数据（DML)，还有可能是加字段等修改表结构的操作（DDL）。不论是哪种方法，一个库被全局锁上以后，你要对里面任何一个表做加字段操作，都是会被锁住的。

但是，即使没有被全局锁住，加字段也不是就能一帆风顺的，因为你还会碰到接下来我们要介绍的表级锁。

### 3.表级锁

MySQL 里面表级别的锁有两种：一种是表锁，一种是元数据锁（meta data lock，MDL)。

**表锁的语法是 lock tables … read/write。**与 FTWRL 类似，可以用 unlock tables 主动释放锁，也可以在客户端断开的时候自动释放。需要注意，lock tables 语法除了会限制别的线程的读写外，也限定了本线程接下来的操作对象。

举个例子, 如果在某个线程 A 中执行 lock tables t1 read, t2 write; 这个语句，则其他线程写 t1、读写 t2 的语句都会被阻塞。同时，线程 A 在执行 unlock tables 之前，也只能执行读 t1、读写 t2 的操作。连写 t1 都不允许，自然也不能访问其他表。

在还没有出现更细粒度的锁的时候，表锁是最常用的处理并发的方式。而对于 InnoDB 这种支持行锁的引擎，一般不使用 lock tables 命令来控制并发，毕竟锁住整个表的影响面还是太大。

**另一类表级的锁是 MDL（metadata lock)。**MDL 不需要显式使用，在访问一个表的时候会被自动加上。MDL 的作用是，保证读写的正确性。你可以想象一下，如果一个查询正在遍历一个表中的数据，而执行期间另一个线程对这个表结构做变更，删了一列，那么查询线程拿到的结果跟表结构对不上，肯定是不行的。

因此，在 MySQL 5.5 版本中引入了 MDL，当对一个表做增删改查操作的时候，加 MDL 读锁；当要对表做结构变更操作的时候，加 MDL 写锁。

- 读锁之间不互斥，因此你可以有多个线程同时对一张表增删改查。
- 读写锁之间、写锁之间是互斥的，用来保证变更表结构操作的安全性。因此，如果有两个线程要同时给一个表加字段，其中一个要等另一个执行完才能开始执行。

虽然 MDL 锁是系统默认会加的，但却是你不能忽略的一个机制。比如下面这个例子，我经常看到有人掉到这个坑里：给一个小表加个字段，导致整个库挂了。

你肯定知道，给一个表加字段，或者修改字段，或者加索引，需要扫描全表的数据。在对大表操作的时候，你肯定会特别小心，以免对线上服务造成影响。而实际上，即使是小表，操作不慎也会出问题。我们来看一下下面的操作序列，假设表 t 是一个小表。

> 备注：这里的实验环境是 MySQL 5.6。

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212131454238.jpeg)

我们可以看到 session A 先启动，这时候会对表 t 加一个 MDL 读锁。由于 session B 需要的也是 MDL 读锁，因此可以正常执行。

之后 session C 会被 blocked，是因为 session A 的 MDL 读锁还没有释放，而 session C 需要 MDL 写锁，因此只能被阻塞。

如果只有 session C 自己被阻塞还没什么关系，但是之后所有要在表 t 上新申请 MDL 读锁的请求也会被 session C 阻塞。前面我们说了，所有对表的增删改查操作都需要先申请 MDL 读锁，就都被锁住，等于这个表现在完全不可读写了。

如果某个表上的查询语句频繁，而且客户端有重试机制，也就是说超时后会再起一个新 session 再请求的话，这个库的线程很快就会爆满。

你现在应该知道了，事务中的 MDL 锁，在语句执行开始时申请，但是语句结束后并不会马上释放，而会等到整个事务提交后再释放。

基于上面的分析，我们来讨论一个问题，**如何安全地给小表加字段？**

首先我们要解决长事务，事务不提交，就会一直占着 MDL 锁。在 MySQL 的 information_schema 库的 innodb_trx 表中，你可以查到当前执行中的事务。如果你要做 DDL 变更的表刚好有长事务在执行，要考虑先暂停 DDL，或者 kill 掉这个长事务。

但考虑一下这个场景。如果你要变更的表是一个热点表，虽然数据量不大，但是上面的请求很频繁，而你不得不加个字段，你该怎么做呢？

这时候 kill 可能未必管用，因为新的请求马上就来了。比较理想的机制是，在 alter table 语句里面设定等待时间，如果在这个指定的等待时间里面能够拿到 MDL 写锁最好，拿不到也不要阻塞后面的业务语句，先放弃。之后开发人员或者 DBA 再通过重试命令重复这个过程。

MariaDB 已经合并了 AliSQL 的这个功能，所以这两个开源分支目前都支持 DDL NOWAIT/WAIT n 这个语法。

```mysql
ALTER TABLE tbl_name NOWAIT add column ...
ALTER TABLE tbl_name WAIT N add column ... 
```

### 4.小结

今天，我跟你介绍了 MySQL 的全局锁和表级锁。

全局锁主要用在逻辑备份过程中。对于全部是 InnoDB 引擎的库，我建议你选择使用–single-transaction 参数，对应用会更友好。

表锁一般是在数据库引擎不支持行锁的时候才会被用到的。如果你发现你的应用程序里有 lock tables 这样的语句，你需要追查一下，比较可能的情况是：

- 要么是你的系统现在还在用 MyISAM 这类不支持事务的引擎，那要安排升级换引擎；
- 要么是你的引擎升级了，但是代码还没升级。我见过这样的情况，最后业务开发就是把 lock tables 和 unlock tables 改成 begin 和 commit，问题就解决了。

MDL 会直到事务提交才释放，在做表结构变更的时候，你一定要小心不要导致锁住线上查询和更新。

> Answer:
>
> 最后，我给你留一个问题吧。备份一般都会在备库上执行，你在用–single-transaction 方法做逻辑备份的过程中，如果主库上的一个小表做了一个 DDL，比如给一个表上加了一列。这时候，从备库上会看到什么现象呢？
>
> 
>
> Qeustion:
>
> 假设这个 DDL 是针对表 t1 的， 这里我把备份过程中几个关键的语句列出来：
>
> ```
> Q1:SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
> Q2:START TRANSACTION  WITH CONSISTENT SNAPSHOT；
> /* other tables */
> Q3:SAVEPOINT sp;
> /* 时刻 1 */
> Q4:show create table `t1`;
> /* 时刻 2 */
> Q5:SELECT * FROM `t1`;
> /* 时刻 3 */
> Q6:ROLLBACK TO SAVEPOINT sp;
> /* 时刻 4 */
> /* other tables */
> ```
>
> 在备份开始的时候，为了确保 RR（可重复读）隔离级别，再设置一次 RR 隔离级别 (Q1);
>
> 启动事务，这里用 WITH CONSISTENT SNAPSHOT 确保这个语句执行完就可以得到一个一致性视图（Q2)；
>
> 设置一个保存点，这个很重要（Q3）；
>
> show create 是为了拿到表结构 (Q4)，然后正式导数据 （Q5），回滚到 SAVEPOINT sp，在这里的作用是释放 t1 的 MDL 锁 （Q6）。当然这部分属于“超纲”，上文正文里面都没提到。
>
> DDL 从主库传过来的时间按照效果不同，我打了四个时刻。题目设定为小表，我们假定到达后，如果开始执行，则很快能够执行完成。
>
> 参考答案如下：
>
> 1. 如果在 Q4 语句执行之前到达，现象：没有影响，备份拿到的是 DDL 后的表结构。
> 2. 如果在“时刻 2”到达，则表结构被改过，Q5 执行的时候，报 Table definition has changed, please retry transaction，现象：mysqldump 终止；
> 3. 如果在“时刻 2”和“时刻 3”之间到达，mysqldump 占着 t1 的 MDL 读锁，binlog 被阻塞，现象：主从延迟，直到 Q6 执行完成。
> 4. 从“时刻 4”开始，mysqldump 释放了 MDL 读锁，现象：没有影响，备份拿到的是 DDL 前的表结构。



## 07丨行锁功过：怎么减少行锁对性能的影响？:)

> 重要：[死锁和死锁检测](#3.死锁和死锁检测)

### 1.前言

在上一篇文章中，我跟你介绍了 MySQL 的全局锁和表级锁，今天我们就来讲讲 MySQL 的行锁。

MySQL 的行锁是在引擎层由各个引擎自己实现的。但并不是所有的引擎都支持行锁，比如 MyISAM 引擎就不支持行锁。不支持行锁意味着并发控制只能使用表锁，对于这种引擎的表，同一张表上任何时刻只能有一个更新在执行，这就会影响到业务并发度。InnoDB 是支持行锁的，这也是 MyISAM 被 InnoDB 替代的重要原因之一。

我们今天就主要来聊聊 InnoDB 的行锁，以及如何通过减少锁冲突来提升业务并发度。

顾名思义，行锁就是针对数据表中行记录的锁。这很好理解，比如事务 A 更新了一行，而这时候事务 B 也要更新同一行，则必须等事务 A 的操作完成后才能进行更新。

当然，数据库中还有一些没那么一目了然的概念和设计，这些概念如果理解和使用不当，容易导致程序出现非预期行为，比如两阶段锁。

### 2.从两阶段锁说起

> 需要锁多个行，就把最可能造成锁冲突放后面。这样执行完就立马 commit 了

我先给你举个例子。在下面的操作序列中，事务 B 的 update 语句执行时会是什么现象呢？假设字段 id 是表 t 的主键。![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212131523685.jpeg)这个问题的结论取决于事务 A 在执行完两条 update 语句后，持有哪些锁，以及在什么时候释放。你可以验证一下：实际上事务 B 的 update 语句会被阻塞，直到事务 A 执行 commit 之后，事务 B 才能继续执行。

知道了这个答案，你一定知道了事务 A 持有的两个记录的行锁，都是在 commit 的时候才释放的。

也就是说，**在 InnoDB 事务中，行锁是在需要的时候才加上的，但并不是不需要了就立刻释放，而是要等到事务结束时才释放。这个就是两阶段锁协议。**

知道了这个设定，对我们使用事务有什么帮助呢？那就是，==如果你的事务中需要锁多个行，要把最可能造成锁冲突、最可能影响并发度的锁尽量往后放。==我给你举个例子。

假设你负责实现一个电影票在线交易业务，顾客 A 要在影院 B 购买电影票。我们简化一点，这个业务需要涉及到以下操作：

1. 从顾客 A 账户余额中扣除电影票价；
2. 给影院 B 的账户余额增加这张电影票价；
3. 记录一条交易日志。

也就是说，要完成这个交易，我们需要 update 两条记录，并 insert 一条记录。当然，为了保证交易的原子性，我们要把这三个操作放在一个事务中。那么，你会怎样安排这三个语句在事务中的顺序呢？

试想如果同时有另外一个顾客 C 要在影院 B 买票，那么这两个事务冲突的部分就是语句 2 了。因为它们要更新同一个影院账户的余额，需要修改同一行数据。

根据两阶段锁协议，不论你怎样安排语句顺序，所有的操作需要的行锁都是在事务提交的时候才释放的。所以，如果你把语句 2 安排在最后，比如按照 3、1、2 这样的顺序，那么影院账户余额这一行的锁时间就最少。这就最大程度地减少了事务之间的锁等待，提升了并发度。

好了，现在由于你的正确设计，影院余额这一行的行锁在一个事务中不会停留很长时间。但是，这并没有完全解决你的困扰。

如果这个影院做活动，可以低价预售一年内所有的电影票，而且这个活动只做一天。于是在活动时间开始的时候，你的 MySQL 就挂了。你登上服务器一看，CPU 消耗接近 100%，但整个数据库每秒就执行不到 100 个事务。这是什么原因呢？

这里，我就要说到死锁和死锁检测了。

### 3.死锁和死锁检测

> 自己理解：避免死锁的方案
>
> 数据库层面：
>
> 1）首先数据库有两个变量默认开启来避免了，但是因为死锁检测是默认开启的有额外负担,所以我们要做的是 控制并发  
>
> 2）从数据库设计上优化，你可以考虑通过将一行改成逻辑上的多行来减少锁冲突。还是以影院账户为例，可以考虑放在多条记录上，比如 10 个记录，影院的账户总额等于这 10 个记录的值的总和。
>
> Java层面：
>
> 3）在开发时一般都是按照顺序加锁来避免死锁。比如都是按照先拿t1,再拿t2（避免下图）
>
> * 即加锁顺序：要求线程在加锁时，必须按照相同的顺序来加锁。这样可以避免出现互相等待对方释放锁的情况。
> * 场景：WMS 举例 A Thread(库存、货架)     B(货架、库存)    死锁通常与事务和并发操作有关

当并发系统中不同线程出现循环资源依赖，涉及的线程都在等待别的线程释放资源时，就会导致这几个线程都进入无限等待的状态，称为死锁。这里我用数据库中的行锁举个例子。

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212131532800.jpeg)这时候，事务 A 在等待事务 B 释放 id=2 的行锁，而事务 B 在等待事务 A 释放 id=1 的行锁。 事务 A 和事务 B 在互相等待对方的资源释放，就是进入了死锁状态。当出现死锁以后，有两种策略：（XD：两者可同时存在，不是二选一)

- 一种策略是，直接进入等待，直到超时。这个超时时间可以通过参数 innodb_lock_wait_timeout 来设置。（默认值是`50`秒）
- 另一种策略是，发起死锁检测，发现死锁后，主动回滚死锁链条中的某一个事务，让其他事务得以继续执行。将参数 innodb_deadlock_detect 设置为 on，表示开启这个逻辑。（默认值是`ON`）

在 InnoDB 中，innodb_lock_wait_timeout 的默认值是 50s，意味着如果采用第一个策略，当出现死锁以后，第一个被锁住的线程要过 50s 才会超时退出，然后其他线程才有可能继续执行。对于在线服务来说，这个等待时间往往是无法接受的。

`show variables like 'innodb_lock_wait_timeout' #50s`

但是，我们又不可能直接把这个时间设置成一个很小的值，比如 1s。这样当出现死锁的时候，确实很快就可以解开，但如果不是死锁，而是简单的锁等待呢？所以，超时时间设置太短的话，会出现很多误伤。

所以，正常情况下我们还是要采用第二种策略，即：主动死锁检测，而且 innodb_deadlock_detect 的默认值本身就是 on。主动死锁检测在发生死锁的时候，是能够快速发现并进行处理的，但是它也是有额外负担的。

`show variables like 'innodb_deadlock_detect' #on 如果他要加锁访问的行上有锁，他才要检测`  

你可以想象一下这个过程：每当一个事务被锁的时候，就要看看它所依赖的线程有没有被别人锁住，如此循环，最后判断是否出现了循环等待，也就是死锁。

那如果是我们上面说到的所有事务都要更新同一行的场景呢？

每个新来的被堵住的线程，都要判断会不会由于自己的加入导致了死锁，这是一个时间复杂度是 O(n) 的操作。假设有 1000 个并发线程要同时更新同一行，那么死锁检测操作就是 100 万这个量级的。虽然最终检测的结果是没有死锁，但是这期间要消耗大量的 CPU 资源。因此，你就会看到 CPU 利用率很高，但是每秒却执行不了几个事务。

根据上面的分析，我们来讨论一下，**怎么解决由这种热点行更新导致的性能问题呢？**问题的症结在于，死锁检测要耗费大量的 CPU 资源。

**一种头痛医头的方法，就是如果你能确保这个业务一定不会出现死锁，可以临时把死锁检测关掉。**但是这种操作本身带有一定的风险，因为业务设计的时候一般不会把死锁当做一个严重错误，毕竟出现死锁了，就回滚，然后通过业务重试一般就没问题了，这是业务无损的。而关掉死锁检测意味着可能会出现大量的超时，这是业务有损的。

**另一个思路是控制并发度。**根据上面的分析，你会发现如果并发能够控制住，比如同一行同时最多只有 10 个线程在更新，那么死锁检测的成本很低，就不会出现这个问题。一个直接的想法就是，在客户端做并发控制。但是，你会很快发现这个方法不太可行，因为客户端很多。我见过一个应用，有 600 个客户端，这样即使每个客户端控制到只有 5 个并发线程，汇总到数据库服务端以后，峰值并发数也可能要达到 3000。

因此，这个并发控制要做在数据库服务端。如果你有中间件，可以考虑在中间件实现；如果你的团队有能修改 MySQL 源码的人，也可以做在 MySQL 里面。基本思路就是，对于相同行的更新，在进入引擎之前排队。这样在 InnoDB 内部就不会有大量的死锁检测工作了。

可能你会问，**如果团队里暂时没有数据库方面的专家，不能实现这样的方案，能不能从设计上优化这个问题呢？**

你可以考虑通过将一行改成逻辑上的多行来减少锁冲突。还是以影院账户为例，可以考虑放在多条记录上，比如 10 个记录，影院的账户总额等于这 10 个记录的值的总和。这样每次要给影院账户加金额的时候，随机选其中一条记录来加。这样每次冲突概率变成原来的 1/10，可以减少锁等待个数，也就减少了死锁检测的 CPU 消耗。

这个方案看上去是无损的，但其实这类方案需要根据业务逻辑做详细设计。如果账户余额可能会减少，比如退票逻辑，那么这时候就需要考虑当一部分行记录变成 0 的时候，代码要有特殊处理。







### 4.小结

今天，我和你介绍了 MySQL 的行锁，涉及了两阶段锁协议、死锁和死锁检测这两大部分内容。

其中，我以两阶段协议为起点，和你一起讨论了在开发的时候如何安排正确的事务语句。这里的原则 / 我给你的建议是：如果你的事务中需要锁多个行，要把最可能造成锁冲突、最可能影响并发度的锁的申请时机尽量往后放。

但是，调整语句顺序并不能完全避免死锁。所以我们引入了死锁和死锁检测的概念，以及提供了三个方案，来减少死锁对数据库的影响。减少死锁的主要方向，就是控制访问相同资源的并发事务量。

> Question:
>
> 如果你要删除一个表里面的前 10000 行数据，有以下三种方法可以做到：
>
> - 第一种，直接执行 delete from T limit 10000;
> - 第二种，在一个连接中循环执行 20 次 delete from T limit 500;
> - 第三种，在 20 个连接中同时执行 delete from T limit 500。
>
> 你会选择哪一种方法呢？为什么呢？
>
> 
>
> Answer:
>
> 我在上一篇文章最后，留给你的问题是：怎么删除表的前 10000 行。比较多的留言都选择了第二种方式，即：在一个连接中循环执行 20 次 delete from T limit 500。
>
> 确实是这样的，第二种方式是相对较好的。
>
> 第一种方式（即：直接执行 delete from T limit 10000）里面，单个语句占用时间长，锁的时间也比较长；而且大事务还会导致主从延迟。
>
> 第三种方式（即：在 20 个连接中同时执行 delete from T limit 500），会人为造成锁冲突。



==在开发时一般都是按照顺序加锁来避免死锁。比如都是按照先拿t1,再拿t2.==

作者回复: 是个好的实践经验👍🏿

> 当涉及多个资源的并发访问时，我将用一个简单的例子来说明按顺序加锁如何避免死锁。
>
> 假设有两个资源 A 和 B，以及两个线程 T1 和 T2。这两个线程分别需要同时访问资源 A 和资源 B。
>
> 如果没有按照顺序加锁的机制，线程 T1 和 T2 可能会以不同的顺序获取资源的锁，导致死锁的发生。
>
> 示例1：不按顺序加锁的情况
>
> - T1：获取 A 的锁
> - T2：获取 B 的锁
> - T1：等待 B 的锁
> - T2：等待 A 的锁
>
> 在这个例子中，T1 先获取了资源 A 的锁，而 T2 先获取了资源 B 的锁。接下来，T1 等待资源 B 的锁，而 T2 等待资源 A 的锁。由于两个线程都在等待对方所持有的资源，形成了死锁。
>
> 现在，让我们看看按顺序加锁的情况。
>
> 示例2：按顺序加锁的情况
>
> - T1：获取 A 的锁
> - T1：获取 B 的锁
> - T2：获取 A 的锁
> - T2：获取 B 的锁
>
> 在这个例子中，无论是 T1 还是 T2 都按照相同的顺序获取锁，即先获取 A 的锁，然后获取 B 的锁。这样，即使两个线程同时竞争资源，它们仍然会按照相同的顺序获取锁，避免了循环依赖和死锁的发生。
>
> 通过上述示例，可以看出按顺序加锁可以避免不正确的资源竞争和循环依赖，从而减少死锁的风险。然而，实际场景可能更加复杂，需要根据具体情况设计和选择合适的加锁策略，并综合考虑其他死锁预防和处理机制来确保系统的稳定性。





## 08丨事务到底是隔离的还是不隔离的？

### 1.前言

我在第 3 篇文章和你讲事务隔离级别的时候提到过，如果是可重复读隔离级别，事务 T 启动的时候会创建一个视图 read-view，之后事务 T 执行期间，即使有其他事务修改了数据，事务 T 看到的仍然跟在启动时看到的一样。也就是说，一个在可重复读隔离级别下执行的事务，好像与世无争，不受外界影响。

但是，我在上一篇文章中，和你分享行锁的时候又提到，一个事务要更新一行，如果刚好有另外一个事务拥有这一行的行锁，它又不能这么超然了，会被锁住，进入等待状态。问题是，既然进入了等待状态，那么等到这个事务自己获取到行锁要更新数据的时候，它读到的值又是什么呢？

我给你举一个例子吧。下面是一个只有两行的表的初始化语句。

```mysql
mysql> CREATE TABLE `t` (
  `id` int(11) NOT NULL,
  `k` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
insert into t(id, k) values(1,1),(2,2);
```

![](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212141738821.png)

<center>图 1 事务 A、B、C 的执行流程</center>

这里，我们需要注意的是事务的启动时机。

**begin/start transaction 命令并不是一个事务的起点，在执行到它们之后的第一个操作 InnoDB 表的语句**，事务才真正启动。如果你想要马上启动一个事务，可以使用 start transaction with consistent snapshot 这个命令。

> 第一种启动方式，一致性视图是在第执行第一个快照读语句时创建的；
> 第二种启动方式，一致性视图是在执行 start transaction with consistent snapshot 时创建的。

还需要注意的是，在整个专栏里面，我们的例子中如果没有特别说明，都是默认 autocommit=1。

在这个例子中，事务 C 没有显式地使用 begin/commit，表示这个 update 语句本身就是一个事务，语句完成的时候会自动提交。事务 B 在更新了行之后查询 ; 事务 A 在一个只读事务中查询，并且时间顺序上是在事务 B 的查询之后。

这时，如果我告诉你事务 B 查到的 k 的值是 3，而事务 A 查到的 k 的值是 1，你是不是感觉有点晕呢？

所以，今天这篇文章，我其实就是想和你说明白这个问题，希望借由把这个疑惑解开的过程，能够帮助你对 InnoDB 的事务和锁有更进一步的理解。

在 MySQL 里，有两个“视图”的概念：

- 一个是 view。它是一个用查询语句定义的虚拟表，在调用的时候执行查询语句并生成结果。创建视图的语法是 create view … ，而它的查询方法与表一样。
- 另一个是 InnoDB 在实现 MVCC 时用到的一致性读视图，即 consistent read view，用于支持 RC（Read Committed，读提交）和 RR（Repeatable Read，可重复读）隔离级别的实现。

它没有物理结构，作用是事务执行期间用来定义“我能看到什么数据”。

在第 3 篇文章[《事务隔离：为什么你改了我还看不见？》](#03丨事务隔离：为什么你改了我还看不见？)中，我跟你解释过一遍 MVCC 的实现逻辑。今天为了说明查询和更新的区别，我换一个方式来说明，把 read view 拆开。你可以结合这两篇文章的说明来更深一步地理解 MVCC。

### 2.“快照”在 MVCC 里是怎么工作的？

> 我的理解：row trx_id + undo log 所以这个事务的快照，就是“静态”的了 就能秒级
>
> 是的，MySQL使用MVCC（多版本并发控制）来实现事务的版本控制，同时使用UndoLog来支持事务的回滚。

在可重复读隔离级别下，事务在启动的时候就“拍了个快照”。注意，这个快照是基于整库的。

这时，你会说这看上去不太现实啊。如果一个库有 100G，那么我启动一个事务，MySQL 就要拷贝 100G 的数据出来，这个过程得多慢啊。可是，我平时的事务执行起来很快啊。

实际上，我们并不需要拷贝出这 100G 的数据。我们先来看看这个快照是怎么实现的。

InnoDB 里面每个事务有一个唯一的事务 ID，叫作 transaction id。它是在事务开始的时候向 InnoDB 的事务系统申请的，是按申请顺序严格递增的。

而每行数据也都是有多个版本的。每次事务更新数据的时候，都会生成一个新的数据版本，并且把 transaction id 赋值给这个数据版本的事务 ID，记为 row trx_id。同时，旧的数据版本要保留，并且在新的数据版本中，能够有信息可以直接拿到它。

也就是说，数据表中的一行记录，其实可能有多个版本 (row)，每个版本有自己的 row trx_id。

如图 2 所示，就是一个记录被多个事务连续更新后的状态。

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202302131727261.png" alt="image-20230213172729310" style="zoom:50%;" />

<center>图 2 行状态变更图</center>

图中虚线框里是同一行数据的 4 个版本，当前最新版本是 V4，k 的值是 22，它是被 transaction id 为 25 的事务更新的，因此它的 row trx_id 也是 25。

你可能会问，前面的文章不是说，语句更新会生成 undo log（回滚日志）吗？那么，**undo log 在哪呢？**

实际上，图 2 中的三个虚线箭头，就是 undo log；而 V1、V2、V3 并不是物理上真实存在的，而是每次需要的时候根据当前版本和 undo log 计算出来的。比如，需要 V2 的时候，就是通过 V4 依次执行 U3、U2 算出来。

明白了多版本和 row trx_id 的概念后，我们再来想一下，InnoDB 是怎么定义那个“100G”的快照的。

按照可重复读的定义，一个事务启动的时候，能够看到所有已经提交的事务结果。但是之后，这个事务执行期间，其他事务的更新对它不可见。

因此，一个事务只需要在启动的时候声明说，“以我启动的时刻为准，如果一个数据版本是在我启动之前生成的，就认；如果是我启动以后才生成的，我就不认，我必须要找到它的上一个版本”。

当然，如果“上一个版本”也不可见，那就得继续往前找。还有，如果是这个事务自己更新的数据，它自己还是要认的。

在实现上， InnoDB 为每个事务构造了一个数组，用来保存这个事务启动瞬间，当前正在“活跃”的所有事务 ID。“活跃”指的就是，启动了但还没提交。

数组里面事务 ID 的最小值记为低水位，当前系统里面已经创建过的事务 ID 的最大值加 1 记为高水位。

这个视图数组和高水位，就组成了当前事务的一致性视图（read-view）。

而数据版本的可见性规则，就是基于数据的 row trx_id 和这个一致性视图的对比结果得到的。

这个视图数组把所有的 row trx_id 分成了几种不同的情况。

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202302131728617.png" alt="image-20230213172858315" style="zoom:50%;" />

<center>图 3 数据版本可见性规则</center>

这样，对于当前事务的启动瞬间来说，一个数据版本的 row trx_id，有以下几种可能：

1. 如果落在绿色部分，表示这个版本是已提交的事务或者是当前事务自己生成的，这个数据是可见的；
2. 如果落在红色部分，表示这个版本是由将来启动的事务生成的，是肯定不可见的；
3. 如果落在黄色部分，那就包括两种情况
   a. 若 row trx_id 在数组中，表示这个版本是由还没提交的事务生成的，不可见；
   b. 若 row trx_id 不在数组中，表示这个版本是已经提交了的事务生成的，可见。

比如，对于图 2 中的数据来说，如果有一个事务，它的低水位是 18，那么当它访问这一行数据时，就会从 V4 通过 U3 计算出 V3，所以在它看来，这一行的值是 11。

你看，有了这个声明后，系统里面随后发生的更新，是不是就跟这个事务看到的内容无关了呢？因为之后的更新，生成的版本一定属于上面的 2 或者 3(a) 的情况，而对它来说，这些新的数据版本是不存在的，所以这个事务的快照，就是“静态”的了。

所以你现在知道了，**InnoDB 利用了“所有数据都有多个版本”的这个特性，实现了“秒级创建快照”的能力。**
