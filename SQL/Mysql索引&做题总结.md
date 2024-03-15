> 该文档得重新索引归类，不然太乱了。。。不好检索

# MySQL索引

> 索引(Index)是帮助MySQL高效获取数据的数据结构。 0.5s    0.000001s
>
> 索引是数据结构

使用`select…for update`给数据加锁的时候，咱们需要注意锁的级别，MySQL InnoDB 默认行级锁。

==行级锁都是基于索引的，如果一条 SQL 语句用不到索引是不会使用行级锁的，而会使用表级锁把整张表锁住，这点需要咱们格外的注意==

要使用行级锁：查询或者更新条件必须是索引字段

# 索引的分类

* 主键索引（PRIMERY KEY)
* 唯一索引（UNIQUE KEY）
  * 避免重复列
* 常规索引（KEY/INDEX）
  * 用index，key关键字来设置
* 全文索引（FullText）
  * 只有在特定的数据库引擎中才有



加了索引之后的效果：

![img](https://gitee.com/codezzq/blogImage/raw/d7b1ce934a79f339f7416ca6fba4981969d003bf/img/image-20201124203324012.png)

注：索引在小数据量的时候用处不大，但是在大数据的时候，区别十分明显。

# 索引原则

* 索引不是越多越好
* 不要对经常变动的数据加索引
* 小数据量的表不需要加索引
* 索引一般加在常用来查询的字段上

> 索引的数据结构

Hash 类型的索引

Btree：InnoDB的默认数据结构



#### 注意自连接

交叉连接（CROSS JOIN）一般用来返回连接表的笛卡尔积。

> 本节的末尾介绍了笛卡尔积，不了解笛卡尔积的读者可以先阅读文章末尾部分，然后再继续学习交叉连接。

交叉连接的语法格式如下：

SELECT <字段名> FROM <表1> CROSS JOIN <表2> [WHERE子句]

或

SELECT <字段名> FROM <表1>, <表2> [WHERE子句] 

==BUT==：要用 cross join 才能用 on，实测用 ，不行！！！

cross join weather w2 on datediff(w1.recordDate,w2.recordDate) = 1







总结，using() 只是join中指定连接条件的简写，在简单的连接中常用。在==列名称不同==时或连接条件复杂时就无法用了，使用 a left join b on ... 是更常见的做法。













# 做 LeetCode 汇总

#### 注意 update 没有 from

```mysql
DELETE FROM 表名
UPDATE 表名 SET 字段名=新值
```

**2024/2/1 再扩展： update mysql vs Sqlserver这部分语法有区别**

原因：

```
update t2 set t2.StorageNum=1
from InventoryAdjustDetail t1 join wm_quant t2 on t1.wm_quantID=t2.oid

报错：
1064 - You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'from InventoryAdjustDetail t1 join wm_quant t2 on t1.wm_quantID=t2.oid' at line 2
```

需要：

```
UPDATE InventoryAdjustDetail t1
JOIN wm_quant t2 ON t1.wm_quantID = t2.oid
SET t2.StorageNum = 1;
```

如果是sqlserver数据库上述语法有问题吗： ==在SQL Server中，可以使用FROM子句来指定要进行连接的表，并在SET子句中更新目标表的列。==







#### 可以把 null 字段过滤成 0    或者用 if

```mysql
select e1.employee_id, IFNULL(e2.salary ,0) bonus
from employees e1 left join
```



#### IF 表达式 IF( expr1 , expr2 , expr3 ) expr1 的值为 TRUE，则返回值为 expr2 expr1 的值为FALSE，则返回值为 expr3

```mysql
update salary set sex = if(sex = 'm','f','m')
```



#### mysql 中调用下面的语句提示该错误

> In MySQL, you can’t modify the same table which you use in the SELECT part.

```mysql
delete from Person where id in (
    select t1.id from Person t1, Person t2 where t1.email = t2.email and t1.id > t2.id
);
```

解决方法:  建立一张临时的中间表

```mysql
delete from Person where id in (
    select id from(
          select t1.id as id from Person t1, Person t2 where t1.email = t2.email and t1.id > t2.id
    ) as tmp
);
```



#### 如果表名用了别名，要将别名放在delete和from之间

```mysql
把重复的用Delete 删除就好了

delete u
from Person u , Person v
where v.id < u.id and u.email = v.email 
```



#### ==用 Group by 删除后面id值大的重复的数据==

```mysql
DELETE from Person 
Where Id not in (
    Select Id 
    From(
    Select MIN(Id) as id
    From Person 
    Group by Email
   ) t
)
```



#### [学习自连接](https://zhuanlan.zhihu.com/p/141083771)：自连接：自己和自己做笛卡尔积



#### 名字首字母大写，后面小写

> JavaGuide 中都搜不到 upper lower 这两个函数

```mysql
concat(upper(left(name,1)),lower(substring(name,2))) name # substr 好像也可以
```



#### group_concat([distinct] 字段名 [order by 排序字段 asc/desc] [separator '分隔符'])

```mysql
group_concat 返回带有来自一个组的连接的非NULL值的字符串结果。组内字符串连接

group_concat(distinct product order by product separator ',') as products
```



#### 列转行用union all：一开始我没那么理解

> XD再学习：同一个表不同列放一列

```mysql
#'store1' store 值store1在store这个字段名（别名）下！
select product_id, 'store1' store, store1 price from products where store1 is not null
union 
select product_id, 'store2' store, store2 price from products where store2 is not null
union
select product_id, 'store3' store, store3 price from products where store3 is not null
```

补充：==UNION去重且排序  UNION ALL不去重不排序==

> 尽量用 UNION ALL 代替 UNION
>
> UNION 会把两个结果集的所有数据放到临时表中后再进行去重操作，更耗时，更消耗 CPU 资源。
>
> UNION ALL 不会再对结果集进行去重操作，获取到的数据包含重复的项。
>
> 不过，如果实际业务场景中不允许产生重复数据的话，还是可以使用 UNION。



==union语句注意事项==：没答出来

         1.通过union连接的SQL它们分别单独取出的列数必须相同；
    
         2.不要求合并的表列名称相同时，以第一个sql 表列名为准；
    
         3.使用union 时，完全相等的行，将会被合并，由于合并比较耗时，一般不直接使用 union 进行合并，而是通常采用union all 进行合并；(因为数据库资源要比应用服务器资源更加珍贵,去重工作可交给后台)
    
         4.被union 连接的sql 子句，单个子句中不用写order by ，因为不会有排序的效果。但可以对最终的结果集进行排序；

**union会自动将完全重复的数据去除掉，union all会保留那些重复的数据；**



#### case的使用

```mysql
case 
	 when xx then xx
	 when xx then xx
	 ...
	 else xx
end
```

任何与`null`值的对比都将返回`null`. 因此返回结果为否,这点可以用代码 `select if(1 = null, 'true', 'false')`证实.

我在这里犯了两个错误。第一个是常见的not in 和null之间的错误，==任何与null值的比对都会返回null==，因此判断语句就无法生效。

```mysql
select 3 not in (null,2)
```



#### [第二高的薪水](https://leetcode.cn/problems/second-highest-salary/)

```mysql
select (select distinct salary from Employee order by salary desc limit 1,1) as SecondHighestSalary
```



#### DATEDIFF() 函数返回两个日期之间的天数。

&  [具体所有 Date 相关函数](https://www.w3school.com.cn/sql/sql_dates.asp) 建议看这个

#### Date 时间格式的处理函数：取date类型字段为 2021年8月 的数据

```mysql
# 1
SELECT DATEDIFF('2008-12-30','2008-12-29') AS DiffDate
# -1
SELECT DATEDIFF('2008-12-29','2008-12-30') AS DiffDate


#Date学习  简单点：Date可以当 String处理
date between '2021-08-01'and '2021-08-31' #日期也可以between，注意：得带引号不然就错了！！！
year(date)=2021 and month(date)=08
date like '2021-08%'
date regexp '2021-08'
substring(date,1,7) = '2021-08'
#在mysql中可以使用MONTH()函数来获取月份，它会从指定日期值中获取月份值。MONTH()函数需要接受date参数，语法格式为“MONTH(date);”，返回指定date对应的月份，范围为“1～12”。
year(date); MONTH(date); day(date);
```



#### 要创建1天间隔，请使用以下表达式：

```mysql
interval 1 day
# 场景：查询近30天活跃用户数
where activity_date > date_sub('2019-07-27', interval 30 day)
DATE_ADD()
# 其实有更简单的：注意会有负数要 and
where datediff('2019-07-27', activity_date) < 30 AND activity_date <= '2019-07-27'
```



#### ==可以 group by 多个字段，且可以用 Select 查出的东西==

```mysql
GROUP BY Subject, Semester

select day(date) hhh from xx group by hhh
```



#### year(time_stamp) = 2020

```mysql
SELECT user_id, max(time_stamp) last_stamp
FROM Logins
WHERE year(time_stamp) = 2020
GROUP BY user_id

# me
where time_stamp >= '2020-01-01 00:00:00' and time_stamp <= '2020-12-31 23:59:59'
```



#### [sum() 里面可以 case when then end](https://leetcode.cn/problems/capital-gainloss/comments)

```mysql
select stock_name,
sum(case when operation='buy' then -price
else  price  end ) as 'capital_gain_loss'
from Stocks
group by stock_name
```





#### [SQL中 select count(1) count中的1 到底是什么意思呢?和count(*)的区别](https://www.cnblogs.com/xiaoqiqistudy/p/11210716.html)

如果表没有主键，那么count(1)比count(\*)快。 

如果有主键，那么count(key value，union key value)比count(\*)快。 

如果表只有一个字段，count(*)最快。



1、COUNT(字段) 会统计该字段在表中出现的次数，忽略字段为null 的情况。==即不统计字段为null 的记录。== 

2、COUNT(*) 则不同，它执行时返回检索到的行数的计数，不管这些行是否包含null值，

3、COUNT(1)跟COUNT(*)类似，不将任何列是否null列入统计标准，仅用1代表代码行，所以在统计结果的时候，不会忽略列值为NULL的行。



#### between '2019-01-01' and '2019-03-31'



#### 发现函数的下标都是从 1 开始的



#### 字符串匹配指定字串

```mysql
# 180cm,75kg,27,male
select substring_index(profile,',',-1) #SUBSTRING_INDEX(str  ,substr  ,n)：返回字符substr在str中第n次出现位置之前的字符串;
select regexp_substr(profile,"male|female")
```





# Boke

> left join
>
> Q: t1一条t2两条两表的tm字段一样left join on tm会select出几条

根据您的描述，表 t1 中有一条数据，表 t2 中有两条数据，并且这两个表中的 "tm" 字段的值相同。如果您执行了一个左连接（LEFT JOIN）并且连接条件是 "tm" 字段相等，那么根据左连接的定义，结果中将包括满足连接条件的所有 t1 行以及与之匹配的 t2 行。

在这种情况下，由于 t1 中只有一条数据，而 t2 中有两条数据与之匹配，左连接的结果将包括 t1 行的复制，并且每个 t1 行都将与每个匹配的 t2 行组合，从而产生 2 条结果记录。

**因此，使用左连接（LEFT JOIN）并且连接条件是 "tm" 字段相等时，将会选择出 2 条记录。**





>  like的用法

LIKE '%_1'  为什么能匹配到24061  **因为下划线 `_` 是另一个通配符，表示匹配任意单个字符。**



LIKE '%[_]1'  

==在这个查询中，我们使用了方括号 `[ ]` 来将下划线 `_` 视为普通字符而不是通配符。这样，查询将只匹配以 "_1" 结尾的字符串，而不会将 "24061" 匹配进来。==



当使用 `LIKE` 运算符进行字符串匹配时，可以使用通配符来指定模式。在 SQL 中，通配符用于匹配字符串中的特定字符或字符序列。

以下是通配符的一些常见用法：

1. 百分号 `%`：用于匹配任意字符（包括零个字符）。
   - 例如，`LIKE '%abc%'` 将匹配包含 "abc" 子串的任意字符串，如 "xyzabc", "123abc456" 等。
2. 下划线 `_`：用于匹配任意单个字符。
   - 例如，`LIKE 'a_c'` 将匹配 "abc"、"axc"、"ayc" 等。
3. 方括号 `[]`：用于指定字符集合中的任意一个字符。
   - 例如，`LIKE '[abc]'` 将匹配 "a"、"b" 或 "c" 中的任意一个字符。
4. 反向方括号 `[^]`：用于指定字符集合之外的任意一个字符。
   - 例如，`LIKE '[^abc]'` 将匹配除了 "a"、"b" 和 "c" 之外的任意一个字符。





> 项目上SqlServer死锁，接口日志是把其中一个当成死锁的牺牲品解决。。。[SSMS 有个活动监视器](https://www.cnblogs.com/chillsrc/archive/2013/05/18/3085360.html)（联想任务管理器就知道是微软的东西）进程那里可以看死锁的语句

网上另外的补充：

[update join会导致锁表。](https://www.icode9.com/content-4-1266770.html)

拆解为单个sql去修改，去掉inner join update。





> 有如下Table：
>
> 414902/P-41	   NaN
> ATE/GQK/19A01210
> ATE/GQK/19A01210 赤道几内亚
>
> 对于如下两行两列的表，我想根据第一列的字段去重，保留第二行两个字段都有值。sqlserver怎么做
> 也会有其它数据第二列是空的情况我也需要，只不过当第一列一样第二列既有空的又有值的我想保留有值的一行

答：上述查询使用了GROUP BY子句将数据按照第一列进行分组，然后使用MAX函数获取每个组中第二列和第三列的最大值。通过这种方式，如果第一列重复的记录中有至少一行的第二列有值，那么MAX函数将返回有值的行，否则将返回空值。

请注意，上述查询假设第二列和第三列的数据类型是可比较的，例如字符串或数字类型。如果第二列和第三列的数据类型不同，您可能需要相应地调整查询以适应实际情况。

```sql
SELECT Column1, MAX(Column2) AS Column2, MAX(Column3) AS Column3
FROM YourTable
GROUP BY Column1
```



> Sum 去除null值，发现只有最外层包有用    **因为Select 语句是无记录，0Row导致其它公式为null（1、4）**
>
> 它不是null，而是整行没有N/A

```sql
SELECT
	SUM (isnull(RL_RECV_QTY, 0)) a, --null
    isnull(SUM (RL_RECV_QTY), 0),   --0
	SUM (RL_RECV_QTY),  --null
    SUM (COALESCE(RL_RECV_QTY,0))  --null
```



> WITH、COALESCE学习！！！想把两个列数一样的查询 例如  
>
> 1）A、B
> 2）A、C
>
> 组成一个查询变成 A、B、C
>
> Union 是叠加行，这个有点叠加列的意思！

当涉及复杂的查询或需要多次使用相同的子查询结果时，使用 WITH 子句（也称为公共表表达式或 CTE）可以更清晰地组织和重用查询逻辑。WITH 子句用于定义一个临时的命名查询，它可以在后续的查询中像表一样引用。

以下是 WITH 子句的基本语法：

公共表达式（Common Table Expressions，CTE）：使用"WITH"关键字来定义一个CTE，**即一个可以在查询中被引用的临时结果集**。使用CTE可以简化复杂查询的编写，并提高可读性。

1. 考虑使用临时表或公共表达式（CTE）：==如果查询中的子查询使用频繁，可以将其结果存储在临时表或使用 CTE==，以避免多次执行相同的子查询。

```sql
WITH cte_name (column1, column2, ..., columnN) AS (
    -- 查询定义
    SELECT ...
    FROM ...
    WHERE ...
)
-- 后续查询
SELECT ...
FROM cte_name
WHERE ...

-------------------------------  实测：不要漏了 as 会报错
WITH SalesCTE AS (
  SELECT ProductID, SUM(Quantity) AS TotalSales
  FROM Sales
  GROUP BY ProductID
)
SELECT *
FROM SalesCTE
WHERE TotalSales > 100
```

在上述语法中，`cte_name` 是公共表表达式的名称，可以在后续的查询中使用。括号中的列名列表是可选的，用于指定公共表表达式的列名。







COALESCE 函数用于处理 NULL 值。它接受多个参数，并返回第一个非 NULL 参数的值。如果所有参数都为 NULL，则返回 NULL。

以下是 COALESCE 函数的示例用法：

```sql
SELECT
    COALESCE(column1, column2, ..., columnN) AS result
FROM
    table_name;
```

在上述示例中，COALESCE 函数将逐个检查列 `column1`、`column2`、...、`columnN`，并返回第一个非 NULL 的列值作为结果。







实际语句:

```sql
WITH UsedTrays AS (
    SELECT 
        CASE trayllx
            WHEN '1' THEN '小托盘'
            WHEN '2' THEN '中托盘'
            WHEN '3' THEN '大托盘'
            WHEN '托盘' THEN '收货托盘'
            WHEN '仓库' THEN '保税仓库'
        END AS trayType,
        COUNT(d2.oid) AS used
    FROM TrayRow d1
    JOIN Dict_Pallet d2 ON (RIGHT(d2.Name, 2) = d1.Name or d2.Name= d1.Name) AND d2.Enable = 1
    WHERE EXISTS (
        SELECT 1
        FROM wm_quant q
        WHERE q.QT_PALLET = d2.oid AND (q.QT_ONHAND_QTY > 0 OR q.DVERID > 0)
    )
    GROUP BY trayllx
),
NotUsedTrays AS (
    SELECT 
        CASE trayllx
            WHEN '1' THEN '小托盘'
            WHEN '2' THEN '中托盘'
            WHEN '3' THEN '大托盘'
            WHEN '托盘' THEN '收货托盘'
            WHEN '仓库' THEN '保税仓库'
        END AS trayType,
        COUNT(d2.oid) AS notUsed
    FROM TrayRow d1
    JOIN Dict_Pallet d2 ON (RIGHT(d2.Name, 2) = d1.Name or d2.Name= d1.Name) AND d2.Enable = 1
    WHERE NOT EXISTS (
        SELECT 1
        FROM wm_quant q
        WHERE q.QT_PALLET = d2.oid AND (q.QT_ONHAND_QTY > 0 OR q.DVERID > 0)
    )
    GROUP BY trayllx
)
SELECT 
    COALESCE(UsedTrays.trayType, NotUsedTrays.trayType) AS trayType,
    COALESCE(UsedTrays.used, 0) AS used,
    COALESCE(NotUsedTrays.notUsed, 0) AS notUsed
FROM UsedTrays
FULL JOIN NotUsedTrays ON UsedTrays.trayType = NotUsedTrays.trayType;
```







> 优化慢查询，原本要20s。  优化后毫秒级   整个查询3k row  子查询 6k row
>
> **工作的这处优化我猜测：可能是结果集太大了，不适合 not in 要 join 效率高**

<img src="https://images.zzq8.cn/img/202307201700091.png" alt="image-20230720170008892" style="zoom: 67%;" />





> **复合索引和组合索引**是同一个概念，都是指对多个列同时创建一个索引。在不同的数据库管理系统中，可能会使用不同的术语来描述同样的概念。例如，在MySQL中，通常使用“复合索引”（Composite Index）来描述这个概念；而在Oracle数据库中，则更常用“组合索引”（Composite Index）这个词汇来描述这个概念。
>
> 联合索引（Compound Index）：也称为复合索引（Composite Index）



> SQLServer 拼接null就是null
> 当NULL值与任何其他值进行拼接时，结果都将为NULL。这是因为NULL表示缺失或未知的值，它与任何具体的值进行拼接都无法确定其结果。

```sql
select '1'+null+'2' //null
```





>  exists 和 not exists 条件

如果子查询返回数据，则返回1或0。常用于判断条件。

```mysql
select *
FROM GYSFHHZ d
WHERE NOT EXISTS (
  SELECT 1
  FROM GYSWM_Shiphead h
  WHERE h.oid = d.soid
);
```



> SQLServer if else

select case when 1=1 then 1 else 2 end



> 工作中犯的错误   BigInt不要用 ‘’ 包起来 where / set

<img src="https://images.zzq8.cn/img/202304251506846.png" alt="image-20230425150628798" style="zoom: 67%;" />



> ==这是SQL Server中MERGE语句的语法形式，用于合并（更新或插入）源表中的数据到目标表中。具体语法如下：==

```sql
MERGE INTO 目标表名称 AS 目标表别名
USING 源表表达式 AS 源表别名
ON 目标表列 = 源表列
WHEN MATCHED THEN
    UPDATE SET 目标表列 = 源表列
WHEN NOT MATCHED THEN
    INSERT (列1, 列2, ...) VALUES (值1, 值2, ...)
```

MySQL 的版本：

如果在 `user_records` 表中已经存在 `user_id` 为 123，且 `record_date` 为 '2023-05-16' 的记录，那么该 SQL 语句将更新 `record_value` 的值为 100。否则，将插入一条新的记录，其中 `user_id` 为 123，`record_date` 为 '2023-05-16'，`record_value` 为 100。

```sql
INSERT INTO user_records (user_id, record_date, record_value)
VALUES (123, '2023-05-16', 100)
ON DUPLICATE KEY UPDATE record_value = 100;
```











> Group by 作用

* select 后可以用 聚合函数
* 另外，还可以使用 GROUP BY 语句进行数据去重，以避免结果集中出现重复的行



==做题时候发现：使用group by开头的 select 必须明确写清列名不能 *==

```mysql
select * from student s join score c on s.id=c.studentid group by s.id  -- Error
select s.id, s.name from student s join score c on s.id=c.studentid group by s.id  -- success
```

1. SELECT 语句中使用了 *，表示查询所有列。在 GROUP BY 语句中分组的列应该是 SELECT 语句中列名的子集，否则会导致查询结果不准确或错误。因此，建议明确指定 SELECT 语句中需要查询的列，以免出现不必要的问题。
2. 在 GROUP BY 语句中，只按学生 ID 进行分组，而未对其他列进行聚合函数处理（如 COUNT、SUM、AVG 等）。这意味着，如果一个学生的成绩表中有多条记录，则查询结果将随机返回一个记录，而不是计算该学生的总分或平均分等聚合值。



> 子查询 + Group by 实践
>
> -- 要求:查询平均成绩大于等于68分的同学的信息并按总分从高到低排序。显示字段: 学生基本信息，总分，
> -- 平均分 语文成绩，数学成绩，英语成绩

```sql
SELECT
	s.id,
	s. NAME,
	sum(c.score) sum,
	round(avg(c.score)) avg,
	(select score from score where studentid=s.id and course='语文') '语文', -- 可以复用上面的结果！！
    (select score from score where studentid=s.id and course='数学') '数学',
   (select score from score where studentid=s.id and course='英语') '英语'
FROM
	student s
JOIN score c ON s.id = c.studentid
GROUP BY
	s.id
HAVING
	avg >= 68
ORDER BY
	sum DESC
```





# 面试

> [1）Union 和 Union All  --> 具体看上面](#列转行用union all：一开始我没那么理解)





> 2）数据库很多请求打过来自己有什么优化方法，除了分表

https://blog.csdn.net/qq_21993785/article/details/81017671  

==慢查询==：查询时间超过了我们设定的时间的语句

1. ***\*SQL查询语句优化\****
2. ***\*主从复制，读写分离，负载均衡\****
3. ***\*数据库分表、分区、分库\****





> [3）分表、分区、分库](https://zq99299.github.io/note-architect/hc/02/03.html#%E5%A6%82%E4%BD%95%E5%AF%B9%E6%95%B0%E6%8D%AE%E5%BA%93%E5%81%9A%E6%B0%B4%E5%B9%B3%E6%8B%86%E5%88%86)  这篇文章挺好！！！
>
> 基于上面的补充，浅问了ChartGPT
>
> ### 概念
>
> MySQL分库分表是一种数据库技术，目的是把大量的数据分散到多个数据库或数据表中，以提高数据库的可扩展性和稳定性。这样做的好处是：
>
> 1. 减少单个数据库的负载：分散数据能够缓解单个数据库的压力，防止数据库因为负载过大而瘫痪。
> 2. 提高可扩展性：通过分散数据到多个数据库或数据表中，可以方便地添加更多的数据库和数据表，以适应增长的数据量。
> 3. 提高数据的安全性：数据分散到多个数据库或数据表中，每个数据库或数据表的数据量都比较小，如果有一个数据库出现问题，不会影响其他的数据库。
>
> 分库分表的方法有很多种，如基于哈希，范围，时间等，具体选择哪种方法取决于实际需求。通常使用中间件（例如Sharding-JDBC）来实现分库分表，使得实现和维护更加简便。
>
> 
>
> > 常见的两种分库分表的方式: 
> >
> > 1）mycat是一个中间件的第三方应用，sharding-jdbc是一个jar包 (这就是为什么我在Pom.xml里看过配这个的原因)
> >
> > 2）使用mycat时不需要改代码，而使用sharding-jdbc时需要修改代码

* 分库：分库是根据业务不同把相关的表切分到不同的数据库中，比如web、bbs、blog等库

* 分表：通过分表可以提高表的访问效率。有两种拆分方法：
  * 垂直切分，即将表按照功能模块、关系密切程度划分出来，部署到不同的库上。例如，我们会建立定义数据库workDB、商品数据库payDB、用户数据库userDB等，分别用于存储项目数据定义表、商品定义表、用户数据表等。
  
  * 水平切分,当一个表中的数据量过大时,我们可以把该表的数据按照某种规则,例如userID散列,进行划分,然后存储到多个结构相同的表,和不同的库上.例如,我们的userDB中的用户数据表中,每一个表的数据量都很大,就可以把userDB切分为结构相同的多个userDB:partoDB、part1DB等,再将userDB上的用户数据表userTable,切分为很多userTable:userTableO、userTable1等,然后将这些表按照一定的规则存储到多个userDB上.
    水平拆分的实现，具体可以看下面的笔记！
    * 垂直拆分的关注点在于 **业务相关性**
    * 水平拆分指的是将单一数据表按照某一种规则拆分到多个数据库和多个数据表中，关注点在 **数据的特点**。

分库分表实际上是分布式存储中一种数据分片的解决方案

### 水平拆分实现

分库分表的方法有很多种，其中常用的有：   可以看titile那篇文章！

1. 基于哈希：将数据按照一定的算法（例如哈希算法）划分到多个数据库或多个数据表中，这种方法适用于数据分布均匀的情况。
   * 这种拆分规则比较适用于实体表，比如说用户表，内容表，我们一般按照这些实体表的 ID 字段来拆分。比如说我们想把用户表拆分成 16 个库，64 张表，那么可以先对用户 ID 做哈希，哈希的目的是将 ID 尽量打散，然后再对 16 取余，这样就得到了分库后的索引值；对 64 取余，就得到了分表后的索引值。【分库分表-拆分成 16 个库和 64 张表，那么一次数据的查询会变成 `16*64=1024`    所以需要`分区键`，以及那些个与分区键映射表从而达到先拿分区键再拿完整数据的目的。。。避免1024次查询】
2. 基于范围：将数据按照给定的范围分配到多个数据库或多个数据表中，这种方法适用于数据量较大且有规律的情况。
3. 基于位置：将数据按照数据所在的位置（例如国家、省份）分配到多个数据库或多个数据表中，这种方法适用于对数据位置敏感的情况。
4. 基于时间：将数据按照数据的创建时间或更新时间分配到多个数据库或多个数据表中，这种方法适用于对时间敏感的情况。

不同的应用场景对应不同的分库分表方法，在选择分库分表方法时，需要根据实际情况考虑应用场景、数据量、数据分布情况等因素。



  **注意：分库分表最难解决的问题是统计，还有跨表的连接（比如这个表的订单在另外一张表），解决这个的方法就是使用中间件，比如大名鼎鼎的MyCat，用它来做路由，管理整个分库分表，乃至跨库跨表的连接**

分库解决的是数据库端 并发量的问题。分库和分表并不一定两个都要上，比如数据量很大，但是访问的用户很少，我们就可以只使用分表不使用分库。如果数据量只有1万，而访问用户有一千，那就只使用分库。



`总的来说，在面对数据库容量瓶颈和写并发量大的问题时，你可以采用垂直拆分和水平拆分来解决，不过你要注意，这两种方式虽然能够解决问题，但是也会引入诸如查询数据必须带上分区键，列表总数需要单独冗余存储等问题。`

而且，你需要了解的是在实现分库分表过程中，数据从单库单表迁移多库多表是一件即繁杂又容易出错的事情，而且如果我们初期没有规划得当，后面要继续增加数据库数或者表数时，我们还要经历这个迁移的过程。所以，从我的经验出发，对于分库分表的原则主要有以下几点：

1. ==如果在性能上没有瓶颈点那么就尽量不做分库分表；==
2. 如果要做，就尽量一次到位，比如说 16 库 64 表就基本能够满足为了几年内你的业务的需求。
3. 很多的 NoSQL 数据库，例如 Hbase，MongoDB 都提供 auto sharding 的特性，如果你的团队内部对于这些组件比较熟悉，有较强的运维能力，那么也可以考虑使用这些 NoSQL 数据库替代传统的关系型数据库。

其实，在我看来，有很多人并没有真正从根本上搞懂为什么要拆分，拆分后会带来哪些问题，只是一味地学习大厂现有的拆分方法，从而导致问题频出。 **所以，你在使用一个方案解决一个问题的时候一定要弄清楚原理，搞清楚这个方案会带来什么问题，要如何来解决，要知其然也知其所以然，这样才能在解决问题的同时避免踩坑。**



分库需了解：

ID 问题：了解 1 最简单的设置步长

1. **还是自增，只不过自增步长设置一下。比如现在有三张表，步长设置为3，三张 表 ID 初始值分别是1、2、3。 这样第一张表的 ID 增长是 1、4、7。第二张表是 2、5、8。第三张表是3、6、9，这样就不会重复了。** 
2. UUID，这种最简单，但是不连续的主键插入会导致严重的页分裂，性能比较差。 
3. 分布式 ID，比较出名的就是 Twitter 开源的 sonwlake 雪花算法









# 自我学习

> 常翻的一张图，SQL JOINS 
>
> `假如 T1(a,b)  T2(a,a)  两表 join / left join / right join 都会有两行，因为交集部分 a 有两个！` 因为按道理 on 的时候得是唯一键    但是此时(a,a)并不是唯一键
> 2023-12-13 Record, Because i Don't understand

![img](https://images.zzq8.cn/img/202309071713371.png)



## ACID

* 原子性（Atomicity） ： 事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；
* 一致性（Consistency）： 执行事务前后，数据保持一致，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；
* 隔离性（Isolation）： 并发访问数据库时，一个用户的事务不被其他事务所干扰，各并发事务之间数据库是独立的；
* 持久性（Durability）： 一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

🌈 这里要额外补充一点：只有保证了事务的持久性、原子性、隔离性之后，一致性才能得到保障。也就是说 A、I、D 是手段，C 是目的！ 想必大家也和我一样，被 ACID 这个概念被误导了很久! 我也是看周志明老师的公开课[《周志明的软件架构课》](https://time.geekbang.org/opencourse/intro/100064201)才搞清楚的（多看好书！！！）。

![image-20230907171603497](https://images.zzq8.cn/img/202309071716290.png)







#### [MySQL中字段类型与合理的选择字段类型；int(11)最大长度是多少？varchar最大长度是多少？](https://segmentfault.com/a/1190000010012140)

对于VARCHAR类型，MySQL会根据存储的实际数据长度来动态分配存储空间，因此VARCHAR类型的存储空间是根据实际存储的数据长度来动态分配的，并不会浪费存储空间。

然而，在创建表时，如果没有明确指定VARCHAR类型的长度，MySQL将使用默认长度来定义该字段。在MySQL中，VARCHAR类型的默认长度为1，这意味着如果没有明确指定VARCHAR类型的长度，MySQL将为该字段分配一个字节的存储空间，这显然不足以存储实际数据。

因此，在创建表时，如果没有明确指定VARCHAR类型的长度，可能会导致存储空间的浪费。例如，在VARCHAR类型的字段中存储了10个字符，如果没有指定长度，则MySQL将使用默认长度1来定义该字段，这将导致MySQL为该字段分配11个字节的存储空间，其中1个字节用于存储长度信息，**10个字节用于存储实际数据，因此将浪费1个字节的存储空间。**

因此，为了避免存储空间的浪费，建议在创建表时明确指定VARCHAR类型的长度，以确保MySQL为该字段分配足够的存储空间来存储实际数据。



> 在 MySQL 中，SQL 语句的执行顺序如下：

1. FROM 子句：指定要查询的表
2. JOIN 子句：使用 JOIN 连接表
3. WHERE 子句：筛选满足条件的行
4. GROUP BY 子句：将数据按照指定的列分组
5. HAVING 子句：筛选满足条件的分组
6. SELECT 子句：选择要查询的列以及进行计算和聚合的函数
7. DISTINCT 关键字：去重
8. ORDER BY 子句：按照指定的列排序
9. LIMIT 关键字：限制查询结果的数量





> mysql limit 0,10   第一个参数是0开始

小技巧-对于深分页：

limit 100000,30;    ->     where id>10000 limit 30;



#### 全连接是外连接吗

是的，全连接是一种外连接（outer join），它包括左外连接（left outer join）和右外连接（right outer join）的结果。

```mysql
SELECT *
FROM table1
FULL OUTER JOIN table2 ON table1.column = table2.column;
```





#### mysql中创建表时候必须指定主键吗

在MySQL中，创建表时并不一定必须指定主键，但是建议为每个表指定一个主键。如果表中没有主键，那么它就是一个无主键表（unkeyed table），也称为堆表（heap table）。**在无主键表中，MySQL会为每一行隐式地分配一个ROWID**（或HEAPID），作为行的唯一标识符，但是这种行标识符并不是真正的主键。





#### mysql没有索引查行数据怎么查

如果MySQL表没有索引，可以使用全表扫描的方式来查找行数据。全表扫描是指MySQL会扫描整个表的每一行数据，然后逐行进行比较，找到符合条件的行数据。

##### 全表扫码顺序有主键就根据主键扫，没有主键就是根据rowid来的是吗   Yes

在MySQL中，如果表没有主键，那么MySQL会使用隐藏的ROWID（也称为物理地址或行指针）作为默认的聚簇索引，用于支持数据的物理存储和访问，因此在进行全表扫描时，MySQL会按照ROWID的顺序进行扫描。

需要注意的是，ROWID是MySQL系统自动分配的，用于唯一标识表中每一行数据的物理地址，每次数据插入或删除都可能会导致ROWID的变化，因此ROWID的值不是稳定的，不应该依赖于ROWID进行数据访问和操作。

如果表定义了主键，则MySQL会使用主键作为聚簇索引进行数据的物理存储和访问，因此在进行全表扫描时，MySQL会按照主键的顺序进行扫描。主键可以是单个列或多个列的组合，主键值必须唯一，不允许为空。

在实际应用中，为了提高查询效率，建议在表中定义主键或者合适的索引来支持查询操作。如果表没有主键或者合适的索引，可能会导致查询效率低下，甚至出现全表扫描的情况。



## 高性能：有哪些常见的 SQL 优化手段？

### * 避免使用 SELECT *

* SELECT * 会消耗更多的 CPU （数据传输量增加：SELECT * 会返回表中的所有列，包括不需要的列）
* SELECT * 无用字段增加网络带宽资源消耗，增加数据传输时间，尤其是大字段（如 varchar、blob、text）。
* SELECT * 无法使用 MySQL 优化器覆盖索引的优化（基于 MySQL 优化器的“覆盖索引”策略又是速度极快，效率极高，业界极为推荐的查询优化方式）
  * MySQL优化器覆盖索引是指查询可以直接使用索引来满足查询需求，而无需访问实际的数据行。也就是不需要“回表”操作了
* SELECT <字段列表> 可减少表结构变更带来的影响

### * 尽量避免多表做 join

阿里巴巴《Java 开发手册》中有这样一段描述：

> 【强制】超过三个表禁止 join。需要 join 的字段，数据类型保持绝对一致;多表关联查询时，保证被关联 的字段需要有索引。

![image-20230908141221249](https://images.zzq8.cn/img/202309081412617.png)

join 的效率比较低，主要原因是因为其使用嵌套循环（Nested Loop）来实现关联查询，三种不同的实现效率都不是很高：

实际业务场景避免多表 join 常见的做法有两种：

1. 单表查询后在内存中自己做关联 ：对数据库做单表查询，再根据查询结果进行二次查询，以此类推，最后再进行关联。
2. 数据冗余，把一些重要的数据在表中做冗余，尽可能地避免关联查询。很笨的一种做法，表结构比较稳定的情况下才会考虑这种做法。进行冗余设计之前，思考一下自己的表结构设计的是否有问题。

更加推荐第一种，这种在实际项目中的使用率比较高，除了性能不错之外，还有如下优势：

1. 拆分后的单表查询代码可复用性更高 ：join 联表 SQL 基本不太可能被复用。
2. 单表查询更利于后续的维护 ：不论是后续修改表结构还是进行分库分表，单表查询维护起来都更容易。

不过，如果系统要求的并发量不大的话，我觉得多表 join 也是没问题的。很多公司内部复杂的系统，要求的并发量不高，很多数据必须 join 5 张以上的表才能查出来。

知乎上也有关于这个问题的讨论：[MySQL 多表关联查询效率高点还是多次单表查询效率高，为什么？](https://www.zhihu.com/question/68258877)，感兴趣的可以看看。

摘取知乎这篇一部分：但是确实大多数业务都会考虑把这种合并操作放到service层，我觉得有几方面考虑：

第一：单机数据库计算资源很贵，数据库同时要服务写和读，都需要消耗CPU，为了能让数据库的吞吐变得更高，而业务又不在乎那几百微妙到毫秒级的延时差距，业务会把更多计算放到service层做，毕竟计算资源很好水平扩展，数据库很难啊，所以大多数业务会把纯计算操作放到service层做，而将数据库当成一种带事务能力的kv系统来使用，这是一种重业务，轻DB的架构思路

### 建议不要使用外键与级联

阿里巴巴《Java 开发手册》中有这样一段描述：

不得使用外键与级联，一切外键概念必须在应用层解决。

![image-20230908145317711](https://images.zzq8.cn/img/202309081453445.png)

网络上已经有非常多分析外键与级联缺陷的文章了，个人认为不建议使用外键主要是因为对分库分表不友好，性能方面的影响其实是比较小的。







### 尽量使用自增 id 作为主键。

如果主键为自增 id 的话，每次都会将数据加在 B+树尾部（本质是双向链表），时间复杂度为 O(1)。在写满一个数据页的时候，直接申请另一个新数据页接着写就可以了。

如果主键是非自增 id 的话，为了让新加入数据后 B+树的叶子节点还能保持有序，它就需要往叶子结点的中间找，查找过程的时间复杂度是 O(lgn)。如果这个也被写满的话，就需要进行页分裂。页分裂操作需要加悲观锁，性能非常低。

不过， 像分库分表这类场景就不建议使用自增 id 作为主键，应该使用分布式 ID 比如 uuid 。

相关阅读：[数据库主键一定要自增吗？有哪些场景不建议自增？](https://mp.weixin.qq.com/s/vNRIFKjbe7itRTxmq-bkAA)。

看起来确实是没有主键的样子。然而实际上，mysql的innodb引擎内部会帮你生成一个名为`ROW_ID`列，它是个6字节的隐藏列，你平时也看不到它，但实际上，它也是自增的。有了这层兜底机制保证，**数据表肯定会有主键和主键索引**。

跟ROW_ID被隐藏的列还有`trx_id`字段，用于记录当前这一行数据行是被**哪个事务**修改的，和一个`roll_pointer`字段，这个字段是用来指向当前这个数据行的上一个版本，通过这个字段，可以为这行数据形成一条版本链，从而实现**多版本并发控制（MVCC）**。有没有很眼熟，这个在之前写的[文章](https://mp.weixin.qq.com/s?__biz=Mzg5NDY2MDk4Mw==&mid=2247488340&idx=1&sn=6c5a0743918d582eb6ee76571d992897&scene=21#wechat_redirect)里出现过。

对照MySQL45讲？？？TODO





### 批量操作 

对于数据库中的数据更新，如果能使用批量操作就要尽量使用，减少请求数据库的次数，提高性能。

```sql
# 反例
INSERT INTO `cus_order` (`id`, `score`, `name`) VALUES (1, 426547, 'user1');
INSERT INTO `cus_order` (`id`, `score`, `name`) VALUES (1, 33, 'user2');
INSERT INTO `cus_order` (`id`, `score`, `name`) VALUES (1, 293854, 'user3');

# 正例
INSERT into `cus_order` (`id`, `score`, `name`) values(1, 426547, 'user1'),(1, 33, 'user2'),(1, 293854, 'user3');
```



### 删除长期未使用的索引

删除长期未使用的索引，不用的索引的存在会造成不必要的性能损耗 MySQL 5.7 可以通过查询 sys 库的 schema_unused_indexes 视图来查询哪些索引从未被使用
