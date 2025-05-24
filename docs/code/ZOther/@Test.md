# 代码CR规范总结

# 风格问题
1. 根据项目配置代码格式化风格，提交之前整体格式化代码。
2. 起名要做到清晰明了，有具体业务含义。
3. 方法起名规则  动词 + 名词。eg: queryOrderDetail, publishPrize。
4. 所有定义(接口，实现类，字段，方法，枚举等等)注释完备, 提高可读性。
5. 所有提供给外部的服务接口，保证注释明确，编写完整使用文档说明。
6. 静态变量建议使用统一的static在当前类或者公共类中维护，便于后续引用和重构维护。
7. 禁止魔法值逻辑。
8. 单个方法功能不宜太多，包含内容太多不容易复用，可读性变差。尽量按照简单的逻辑拆分。
9. <font style="color:#DF2A3F;">不要随意修改与本次迭代开发无关的其他人的代码</font>。

# 防御性编程
1. 提供给上游的共用方法对关键入参强校验正确性。所有的public方法的所有字段都需要校验。

**<font style="color:#DF2A3F;">错误示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/fc0ae95cd9580e9b57cbc41166a41528.png)

**<font style="color:#74B602;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/17185d5767e039db08cb7f5da39e9d2d.png)

2. 字段校验不只是要校验是否为空，要根据业务规则进行校验。
    1. 字符串校验长度。
    2. 数字校验上限和下限。
    3. 枚举类型要校验是否是合法枚举值。

**<font style="color:#74B602;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/67e5cf8038ef81dc2abdfab36e87f58d.png)

3. 领域模型数据校验内聚于领域模型内部，对外只暴露实际校验方法供其他流程调用。

**<font style="color:#DF2A3F;">错误示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/f69a595ed885f268dc0fe0a09e7f0411.png)

**<font style="color:#8CCF17;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/650bc2ed90117930a0436d689a322ad7.png)

4. <font style="color:rgb(23, 26, 29);">模型自检的关键场景</font>
    1. <font style="color:rgb(23, 26, 29);">外部RPC请求在模板方法中校验request模型</font>
    2. <font style="color:rgb(23, 26, 29);">接收到MQ消息时对DTO校验</font>
    3. <font style="color:rgb(23, 26, 29);">插入数据库时对DO校验</font>
5. <font style="color:rgb(23, 26, 29);">尽量做快速返回式编程，比如if null return，不是if !=null xxx，减少代码层级</font>

**<font style="color:#74B602;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/d4bb83b197f685de9cd55e1be58ac7d4.png)

**<font style="color:#74B602;"></font>**

# 远程调用
1. **返回结果三态的检查不能忘**

**<font style="color:#DF2A3F;">错误示例: 未判断下游返回体状态，直接返回体内的字段进行使用，导致NPE。</font>**

![](https://img-blog.csdnimg.cn/img_convert/fc88718b6adb9594afbecab47bd0cdf0.png)

**<font style="color:#74B602;">正确示例：校验下游返回值状态，根据不同校验情况返回错误码。</font>**

![](https://img-blog.csdnimg.cn/img_convert/ab24eaa1ed6dc73b81d04138250e58a8.png)

2. 明确下游API是否幂等，幂等号生成规则是什么和幂等的维度是租户维度, 商户维度，活动维度？
3. 异常处理（比如你调用别人接口异常了怎么处理，是重试还是直接失败），出现异常之后上下游数据是否一致。
4. 超时处理（超时后是直接断开保护本系统还是等待返回？），出现超时之后上下游数据是否一致。
5. 外部调用的API升级时是否和老版本接口兼容，接口返回结构层面的兼容逻辑，例如状态码、返回值、返回结构等。

# 并发处理
1. 强制统一使用 SOFA 线程池，包含监控、超时堆栈、traceID（用于 RPC 自定义线程池）和动态配置的能力。SOFA 线程池 100% 兼容原生线程池。参见：[SOFA 线程池的使用文档](https://yuque.antfin-inc.com/middleware/sofaboot/gdcd1p)

**<font style="color:#DF2A3F;">错误示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/3d21418087e7d749c0d6fccf51be2c7c.png)

**<font style="color:#74B602;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/f3ad6616edcebef64902aa88e30f6bcc.png)

2. 异步处理的任务使用TracerRunnable代替Runnable，TracerCallable代替Callable，防止trace丢失。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/613b4c83c3c977e0223f25a22708f319.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/44470d05716cece189ac60179e99d302.png)

3. 线程上下文一定要记得清除

错误示例

![](https://img-blog.csdnimg.cn/img_convert/03ee7ea885d1a0e9918c12d2f81b76be.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/97224edd3c1a88e311a97872edd6c466.png)

4. 使用CountDownLatch进行异步转同步操作时，每个线程退出前必须调用countDown方法，线程执行代码注意catch异常，确保countDown方法可以执行，避免主线程无法执行至countDown方法，直到超时才返回结果。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/aba1802d32263d241ef488da1c5a1cb5.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/a5fd46a19229e2ac165356769eeb6974.png)

# 数据库操作
1. insert，update, delete数据完成时强制校验行数是否符合预期

**错误示例**

![](https://img-blog.csdnimg.cn/img_convert/f9577d4d9ada91fe6a590dc98e0af8d2.png)

**正确示例**

![](https://img-blog.csdnimg.cn/img_convert/1ef9a3d3d4350e9aff1318a250ecbe5b.png)

2. 查询sql语句不允许查询*，而是显示列出需要查询的字段
    1. <font style="color:rgb(13, 26, 38);">增加查询分析器解析成本。</font>
    2. <font style="color:rgb(13, 26, 38);">增减字段容易与resultMap配置不一致。</font>
    3. <font style="color:rgb(13, 26, 38);">多余字段增加网络消耗，尤其是 text 类型的字段。</font>

错误示例

![](https://img-blog.csdnimg.cn/img_convert/69c8b820c273cba926fdb76664bf1a6a.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/65452a8d5db18efd3d4193734ed9a842.png)

3. 不允许无脑 update

正确示例

![](https://img-blog.csdnimg.cn/img_convert/e8740d4e96c989c0e2d54b17f463fe6d.png)

错误示例

![](https://img-blog.csdnimg.cn/img_convert/18292d8a5b4792ac0ecc559f8c60d6c5.png)

4. 单条数据更新，使用id作为更新条件

错误示例

![](https://img-blog.csdnimg.cn/img_convert/e16f975276253ab71f2a8b13b191d928.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/16d04e197b803541da6bad4ad19a812f.png)

5. 查询一定要考虑索引

错误示例

![](https://img-blog.csdnimg.cn/img_convert/d772a53bff165aee6170d0b33268c17e.png)

正确示例

6. 一锁二判三更新

错误示例

![](https://img-blog.csdnimg.cn/img_convert/4f160e595abe71951deba0eba474a5d9.png)

![](https://img-blog.csdnimg.cn/img_convert/8fdabc95b88db72335c9752fbfb0dafc.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/55ff09e21b33c07be7f63808233ae10a.png)

7. 涉及多条数据循环调用sql插入时改成批量的，并且考虑每次批量插入的条数。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/a6daa17e399a41b20aede682eeb1f273.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/1183d9be9d32aaef45c2e19541e27bea.png)

8. 每次新增的查询语句是否能命中索引。

错误示例![](https://img-blog.csdnimg.cn/img_convert/d460e7d5771108c7cf912fd7e670eca2.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/0f47421a4706d474f869a7b0e9b8507f.png)

9. <font style="color:rgb(13, 26, 38);">在代码中写分页查询逻辑时，若count为0应直接返回，避免执行后面的分页语句</font>

正确示例
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/de59078cafdc4146b873caedf4fb24d3.png)


10. 索引设计是否合理，是唯一索引还是普通索引，尽量避免在线进行索引增加，删除操作

**<font style="color:#DF2A3F;">错误示例</font>**

[20240627-故障案例学习](https://yuque.antfin-inc.com/fu9ehx/bixhha/neoo69kr1yri39wo)

<font style="color:rgba(0, 0, 0, 0.88);">增加用信记录新增资产类型字段，同时删除了一个索引。导致查询请求走到全表，导致数据库RT飙高、CPU飙高，影响访问该库的所有业务。</font>

11. 分表场景单表局部热点风险

错误示例

分片的一个作用是提高可用性，降低单点带来的风险，但是如果分库分表位的选择不合理则无法发挥这个作用

举例代码如下：

![](https://img-blog.csdnimg.cn/img_convert/175bd775daf9b8cd71fec0dd5e97052e.png)

![](https://img-blog.csdnimg.cn/img_convert/6e49dfea401347499f916bc83251bc4a.png)

正确示例: 动态获取用户ID来作为分库分表的信息，降低单点风险

![](https://img-blog.csdnimg.cn/img_convert/e60ff9d43a636cdc3f79c1e440349953.png)

# 事务问题
1. 根据使用的是逻辑库还是物理库选择正确的事务模板。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/ec458e7f6f7c3480c94c7ae03e2c58ee.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/2abf1cd9480cb3aa080b4c917cc9a004.png)

2. 跨数据连接，事务无效

错误示例

![](https://img-blog.csdnimg.cn/img_convert/b4d8869227907ffd821273780312e30d.png)

正确示例

```plain
        sharingTransactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {

                    // 保存外部订单，数据源1
                    affiliateOutOrderRepository.insert(affiliateOutOrder);
                        
                    // 保存外部订单返佣
                    outOrderCommission.setInnerOrderId(affiliateOutOrder.getId());

                    // 保存外部订单返佣
                    affiliateOutOrderCommissionRepository.insert(outOrderCommission);
                    orderUserBenefit.setInnerOrderId(affiliateOutOrder.getId());
                    orderUserBenefit.setCommissionId(outOrderCommission.getId());
                    affiliateOutOrderUserBenefitRepository.insert(orderUserBenefit);
            }
        });
```

3. 长事务问题，事务中有远程调用

错误示例

![](https://img-blog.csdnimg.cn/img_convert/99f391fe724d77b9349d92a5315323a7.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/ec07bcfd31d43c1f910978673ac55cf0.png)

4. 合理设计索引，尽量缩小锁的范围
    1. 合理设计索引，可以尽量缩小锁的范围，从而减少锁竞争提高并发性能。
5. ~~单条数据库操作不要开事务~~

~~错误示例~~

~~正确示例~~

6. 事务性消息一定要再事务中发送

错误示例

正确示例

![](https://img-blog.csdnimg.cn/img_convert/eabff4a780d3d5fd3d78c36b75137c33.png)

# 消息问题
1. 重复、流失、乱序、限流

错误示例

正确示例

2. 可重入问题

错误示例

正确示例

3. 什么时候用事务性消息，更新DB和发消息在一个事务中，避免DB更新失败，机器故障或者重启导致消息未发送，产生不一致

错误示例

正确示例

4. 事务型消息一定要有checker

[事务型消息原理](https://yuque.antfin-inc.com/middleware/msgbroker/pubsub)

# 缓存问题
1. 缓存必须要使用common库

**<font style="color:#DF2A3F;">错误示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/6d7480e4ad81279b4d30bb377c16f802.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/2cb298f6a61ae508beebb596fc7c9a45.png)

2. 缓存key的设计需要仔细考虑
    1. 环境隔离
    2. 压测隔离
    3. 不兼容时的版本隔离

[[P4]用户反馈零售通频道页商品不展示](https://yuque.antfin-inc.com/gc206i/cflnuu/pqu9da?)

错误示例

![](https://img-blog.csdnimg.cn/img_convert/43cacdc8ec80a23dbb8afc77318e02e3.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/6900c047c8a041c79175711e2ebb6bc2.png)

3. 序列化的方式

序列化方式统一规定使用JSON，不使用HESSIAN

**<font style="color:#74B602;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/7d9e92519ba98b28a1fb4ee465e4147d.png)

4. key的null存储

错误示例
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ca1a6ba3154c4f43bc68db0d4c906298.png)


正确示例

![](https://img-blog.csdnimg.cn/img_convert/cf5c84ad1d548938368b8f2bc9d64544.png)

5. key的过期时间

错误示例

![](https://img-blog.csdnimg.cn/img_convert/8b0189e2b1aeb0f73d46980bbfaf2c43.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/81381e2130be24ad39e9fe383fe99c6b.png)

6. key的击穿影响分析

[【P3】0531 LZD-支付咨询(分站点)下跌](https://yuque.antfin.com/sd/ufwbxo/puaiys2d4wikb4e1?singleDoc#)

错误示例



正确示例

7. key的更新策略
    1. 过期删除：当缓存过期时，主动失效，当击穿缓存时回源查询并更新缓存。
    2. 主动刷新: 缓存中key不过期，在DB中数据变化时，主动构建新值并更新到缓存中
8. 兼容性问题

错误示例: 

![](https://img-blog.csdnimg.cn/img_convert/326d86847179b01a71cae3e372f57b2a.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/7e8792c093f0cce9098a0e5075d30411.png)

# 金额问题
1. 必须使用multiMoney，MultiBigDecimalMoney类，要考虑精度和四舍五入算法。

正确示例

![](https://img-blog.csdnimg.cn/img_convert/231b5aba8c46ab47f9b6c16503f05c47.png)

2. 金额计算使用统一封装工具类，严禁自行计算。

正确示例

![](https://img-blog.csdnimg.cn/img_convert/b88ec5a5bda1dd67009d581d80ef9ba4.png)

3. 注意金额计算相同功能的不同实现差别，比如 add, addTo。divide, divideBy。

错误示例

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cf7b880594554d169af197cac418be70.png)


正确示例

![](https://img-blog.csdnimg.cn/img_convert/db55b87b343954696e5ffd426620877d.png)

4. 增减金额平衡性校验

错误示例

![](https://img-blog.csdnimg.cn/img_convert/2db6e63c8aa9fa4ac74732b9553118a0.png)

**<font style="color:#74B602;">正确示例</font>**

<font style="color:rgba(0, 10, 26, 0.89);">组合商品中，子订单中金额总和(total_pay_amount)等于支付总单中金额(pay_amount)</font>

![](https://img-blog.csdnimg.cn/img_convert/c1e82eca7c54cc46bbade2e2b375593c.png)

![](https://img-blog.csdnimg.cn/img_convert/4c59b5edfba77a67c38331ba21e1a645.png)

![](https://img-blog.csdnimg.cn/img_convert/c7ae065fe1e5c183e9dc72ef575f500c.png)

<font style="color:rgba(0, 10, 26, 0.89);"></font>

# 编码规约
1. 使用诸如StringUtil, CollectionUtils等工具类操作，而不是直接采用原始类型，因为已经对null值进行了处理

错误示例:下列代码没有判断lineMap是否为null，直接取size，有空指针风险，换成MapUtils.isEmpty更为可靠

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9459e4b54d424276b96644d5a1466409.png)


正确示例

![](https://img-blog.csdnimg.cn/img_convert/7b5d8e7962964bd7b470da7be0e48dd5.png)



2. 不使用复杂的if else 条件，而是抽成判断是否满足if条件的方法。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/8e7e28298bd004738c0ce9b52e8a03fb.png)![](https://img-blog.csdnimg.cn/img_convert/2a789ec160915dc07d0cdb7b93507f7e.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/9301330a3b0e772587380d2ec8d5a83d.png)

3. 杜绝使用BeanUtils.copyProperties，尤其是Entity、Model和VO之间。同一名字不同类型不能拷贝，导致字段值缺失。老老实实set&get。

错误示例

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ac4ef8ad35dc4f91b6778ec3671e2d3a.png)


正确示例

![](https://img-blog.csdnimg.cn/img_convert/69d8f5db9cbf870f93ee2dbefe016b39.png)

4. POJO中的变量直接赋值，禁止夹杂额外逻辑。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/2fa52cade3e76efc247072e3275cb4a4.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/ce2b9a93215f8aac1b36fb496c67ca92.png)

5. 根据业务规则找准try-catch的范围，try-catch范围不准结果都不好。比如说是for循环里面try-catch还是整个循环try-catch 是两种不同的结果。允许失败跳过的情况内部处理。不允许失败的情况外部处理。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/b000fdd2d035a5ab78c64d83f5bd57e8.png)

正确示例

![](https://img-blog.csdnimg.cn/img_convert/802da43c14e1039c432cccc3aec17dd0.png)

6. 避免使用多个级联get，容易造成数组越界，NPE，使用Optional操作的判空操作。

错误示例

![](https://img-blog.csdnimg.cn/img_convert/f2c4802ee82a9ae50ae3aff75365edbd.png)

正确示例

```plain
        standardProductView.setOnSaleTimeStart(
            Optional.ofNullable(product.getOnSaleBeginTime()).map(Date::getTime).orElse(null));
        standardProductView.setOnSaleTimeEnd(
            Optional.ofNullable(product.getOnSaleEndTime()).map(Date::getTime).orElse(null));
```

7. 对外部提供的服务接口定义查询和响应禁用枚举。

**<font style="color:#DF2A3F;">错误示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/56b2071a645583eea12f548335cf5374.png)

**<font style="color:#74B602;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/290a45dd7fd02830f0da0aa1496a8aa1.png)

# 日志打印
1. <font style="color:rgb(64, 64, 64);">模板类尽量把应该打的日志统一打好，并且统一格式，开发同学尽量使用模板类。</font>

错误示例

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9c9bed0ab21f4a9f822353c841540c33.png)


正确示例：在ServiceTemplate模板类中会统一格式打印日志。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d8f1a7a7493d435683462e75053b8fec.png)


2. 打印异常日志时一定包含堆栈信息，如果仅包含提示信息，异常堆栈被丢弃，问题排查困难。

**<font style="color:#DF2A3F;">错误示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/dcdd1bd57a06f8e39a0658c2309dad42.png)

![](https://img-blog.csdnimg.cn/img_convert/1c33ad4f9105c999703a136a07c1c415.png)

**<font style="color:#74B602;">正确示例</font>**

![](https://img-blog.csdnimg.cn/img_convert/c416d96104d0cbef627c50c248e79087.png)

3. 日志打印保持格式清晰，关键字段齐备，做到监控可配置，排查问题快速定位。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9349a33b53944dad916d4f2e73ca40e0.png)


![](https://img-blog.csdnimg.cn/img_convert/3604c7fd9f06e63be12fd0e187752154.png)

![](https://img-blog.csdnimg.cn/img_convert/dfefbc21688194b372ad6b166a9239fd.png)

4. <font style="color:rgba(0, 0, 0, 0.8);">在日志输出时，字符串变量之间的拼接使用占位符的方式。String字符串的拼接会使用StringBuilder的append，有性能影响。</font>

![](https://img-blog.csdnimg.cn/img_convert/8465efefdb9ddcfdd80e960160fbcd58.png)



# 性能问题
1. 所有接口必须要有性能监控的日志，放到模版日志里
2. C端接口不需要经过压测才能上线
3. C端要注意使用缓存
4. 非关键依赖，同步转异步

# 设计问题
1. 领域模型要核对友好，上下游关键字段是否可核对。一层核对，二层核对，三层核对。
2. 考虑发布兼容性，发布中间态存在新逻辑，新数据，老逻辑，老数据。
3. 考虑隔离性
    1. 不同商户，用户，渠道数据如何隔离。
    2. 不同商户，用户，渠道故障如何隔离。
4. 清晰明了的切流灰度逻辑。
    1. 切流方法是是什么，参数中心，drm？
    2. 切流维度是什么，商户，用户，活动？
    3. 新老逻辑是否能回切？

# 测试用例
1. 每个迭代必须提供自测用例，可以规避很多不必要的线上问题。
2. 单元测试一个方法测试一个功能的各种情况，不要把所有的功能融合在一个方法中。
3. 单元测试用例的编写要考虑先写一种执行成功的情况，还要覆盖失败的case，并且要按照场景进行覆盖。
4. 清除数据，准备数据，执行用例，校验数据（返回结果的校验，db的校验）







# 测试用例-XD补充

> 自测-证明测了
>
> **单测-不被篡改、保护稳定运行的一种手段**
>

## 操作流程
xd: 犯以下错误: 



知识铺垫

<font style="color:rgb(0, 0, 0);">1、</font><font style="color:#DF2A3F;">接口入参对象除了校验NotNull,NotBlank，还需要检验字段长度，枚举字段要校验在枚举范围内</font>  
<font style="color:rgb(0, 0, 0);">2、打印</font><font style="color:#DF2A3F;">错误日志，需要有关键信息</font><font style="color:rgb(0, 0, 0);">，比如判断订单不存在，需要把orderId打印出来</font>  
<font style="color:rgb(0, 0, 0);">3、</font>**<font style="color:rgb(0, 0, 0);">代码可重入，做好幂等，保证</font>****<font style="color:#DF2A3F;background-color:#FBDE28;">中途任何地方失败，这段代码可以从头再跑一遍</font>**  
<font style="color:rgb(0, 0, 0);">4、尽量做快速返回式编程，比如if null return，不是if !=null xxx，减少代码层级</font>  
<font style="color:rgb(0, 0, 0);">5、代码可读性，代码分段，写好注释，或者抽方法出来，不要把全部逻辑写在一起，还没有换行，要有结构性</font>

> <font style="color:rgb(0, 0, 0);">文案也校验一下，Assert的异常文案</font>
>
> <font style="color:rgb(0, 0, 0);">不要只notNull，对象里面的关键字段也校验</font>
>
> <font style="color:#DF2A3F;background-color:#FBDE28;">DB 不能 mock！！！sql grammar</font>
>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);">步骤-mock yy</font>

> <font style="color:rgb(0, 0, 0);">1.构建你的请求，以及定义一些mock能力</font>  
> <font style="color:rgb(0, 0, 0);">2.去调用你要测试的目标方法</font>  
> <font style="color:rgb(0, 0, 0);">3.去检测目标方法返回的东西是不是你预期的</font>
>

<font style="color:rgb(0, 0, 0);"></font>

## <font style="color:rgb(0, 0, 0);">碰到的问题集</font>
> <font style="color:rgb(0, 0, 0);">Mockito when效果老是没生效，用 verify 校验问题！发现第二个参数实际用的是 String</font>
>
> <font style="color:rgb(0, 0, 0);">入参类型搞错，排错xxx</font>
>

```java
// 在测试方法的最后，验证具体的调用
Mockito.verify(cacheManager).putObjectWithExpire(
    "STOP_CHAT_CACHE_KEY_PREFIX_userId123_202409282011727514756414_202409282021727514756405",
    Boolean.FALSE,
    120
);
```

> // 用到mock注解的得使用下面才能生效
>
>  MockitoAnnotations.openMocks(this);
>
> **<font style="background-color:#FBDE28;">引申出 - 学解决思路：看包是属于哪里的，到源码定位到jar包名字然后  Google这个jar名字使用手册！！！</font>**
>

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/135356742/1727346395904-e353b890-d2b9-4908-b3d3-d1552c7050ed.png)

 MockUtil.mockField(distributedLockService, "distributedLock", distributedLock);

**<font style="background-color:#FBDE28;"></font>**

> chat 监听器回调mock   卡很久，发现有个API可以操作
>

       Mockito.doAnswer(new Answer() {
    
            @Override
    
            public Object answer(InvocationOnMock invocationOnMock) throws Throwable {
    
                System.out.println(invocationOnMock.getArguments());
    
                return invocationOnMock.getArguments();
    
            }
    
        }).when(botStreamChatFacade).streamChat(any(), any());

## ✨ Mock 方式两种 - <font style="color:#DF2A3F;">复习反射部分应用场景</font>
### 注解方式
```javascript
   /**
     * ilmmodelClient
     */
    @Autowired
    @InjectMocks
    private IlmmodelClientImpl     ilmmodelClientImpl;

    /**
     * TtsFacade
     */
    @Mock
    private TtsFacade              ttsFacade;


MockitoAnnotations.openMocks(this);
```

### 代码方式
```javascript
// 1
TtsFacade ttsFacade = Mockito.mock(TtsFacade.class);

// 并不是1,3就直接可以了    别忘记还有个该field注入到源class的操作.   需要通过反射解决

// 3
Mockito.when(ttsFacade.executeGenericTts(Mockito.any())).thenReturn(mockResult);
```

**keypoint**

****

**全盘逻辑**

****

```javascript
private static void backupOriginalField(Object target, String fieldName,
                                            Object mock) throws IllegalAccessException,
                                                         NoSuchFieldError {
        // TODO: 2025/1/11 单侧为什么需要获取真实对象而非代理对象？
        // 获取真实对象而非代理对象
        target = getSingletonTarget(target);

        Field field = getField(target, fieldName);
        Object originFieldValue = field.get(target);
        // 如果已经替换过了，抛出异常
        Object replaced = REPLACED_FIELDS
            .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
        if (!Objects.isNull(replaced)) {
            // 不应该重复替换原成员
            throw new IllegalStateException("非法覆盖" + target + "成员" + fieldName + "原始引用记录");
        }

        field.set(target, mock);
        log.debug("已替换" + target + "对象的成员" + fieldName + "为" + mock);

        if (!Objects.isNull(originFieldValue)) {
            // ConcurrentHashMap不能put null对象，null成员也没有必要备份
            REPLACED_FIELDS.computeIfAbsent(target, (key) -> new ConcurrentHashMap<>())
                .put(fieldName, originFieldValue);
        }
    }


private static Field getField(Object target, String fieldName) {
        Field field = null;
        Class<?> type = target.getClass();
  // TODO 这里为什么while,  看catch逻辑会向父类找  所以while
        while (type != null) {
            try {
                field = type.getDeclaredField(fieldName);
                break;
            } catch (NoSuchFieldException e) {
                type = type.getSuperclass();
            }
        }

        if (field == null) {
            throw new NoSuchFieldError();
        }

        field.setAccessible(true);
        return field;
    }
```

todo解释: 

+ <font style="color:rgb(51, 51, 51);">如果 </font>`<font style="color:rgb(51, 51, 51);">IlmmodelClientImpl</font>`<font style="color:rgb(51, 51, 51);"> 是作为一个 Spring Bean 声明的，并且这个类中使用了 AOP 相关注解（如 </font>`<font style="color:rgb(51, 51, 51);">@Transactional</font>`<font style="color:rgb(51, 51, 51);"> 或 </font>`<font style="color:rgb(51, 51, 51);">@Aspect</font>`<font style="color:rgb(51, 51, 51);">），则在注入时通常会得到一个代理对象</font>
+ **<font style="color:rgb(51, 51, 51);">Proxy 类型</font>**<font style="color:rgb(51, 51, 51);">：Spring 可以使用两种类型的代理：基于 JDK 的代理（接口代理）和基于 CGLIB 的代理（子类代理）。</font>
+ <font style="color:rgb(51, 51, 51);">AopUtils.isAopProxy(ilmmodelClientImpl)</font>

<font style="color:rgb(51, 51, 51);"></font>

+ computeIfAbsent适用于两层嵌套的map   拿到/初始化里层map

```javascript
// NoSuchFieldException
Field field = clazz.getDeclaredField("ttsFacade");
// todo 如果我不加这一行的话，field 无法被获取到吗  ---> 是的  IllegalAccessException
// --- 下面两行操作都不行
//field.setAccessible(true);


Object o = field.get(ilmmodelClientImpl);
// 设置field的值为mock
field.set(ilmmodelClientImpl, ttsFacadeMock);
```

## TODO测试 - mock污染问题
> 用反射的形式写工具类: MockUtil.mockFieldIfNotMocked(ilmmodelClientImpl, "ttsFacade",TtsFacade.class);
>
> 就是想解决这个问题
>

GPT e.g. : 

```javascript
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

    @Test
    public void testGetUserById() {
        User mockUser = new User("1", "Alice");
        when(userRepository.findById("1")).thenReturn(mockUser);

        User user = userService.getUserById("1");
        assert user.getName().equals("Alice");
    }

    @Test
    public void testGetUserName() {
        // 这里我们没有为 userRepository 设置 mock 行为
        // 直接调用了 getUserById，但状态可能会影响到结果

        // precondition
        User mockUser = new User("1", "Bob");
        when(userRepository.findById("1")).thenReturn(mockUser);

        // This may lead to unexpected behavior if the previous test leaves the 
        // mock's state unchanged or affected.
        String userName = userService.getUserName("1"); // 预期得到 "Bob"

        assert userName.equals("Bob");

        // 假设我们在其他方法中没有清理任何状态
        // 但实际上这个测试可能会失败，因为 Mock 的行为在
        // 先前的测试中可能已经被修改。
    }
}

```

```java
/*

 * Ant Group
 * Copyright (c) 2004-2024 All Rights Reserved.
   */
   package com.alipay.ibotservice;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.aop.framework.AopProxyUtils;
import org.springframework.aop.support.AopUtils;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

/**

 * mock工具，解决mock污染的问题

 * @author yongyi

 * @version MockUtil.java, v 0.1 2024年07月25日 20:28 yongyi
   */
   @Slf4j
   public class MockUtil {

   private static final Map<Object, Map<String, Object>> REPLACED_FIELDS = new ConcurrentHashMap<>();

   /**

    * 替换目标的某个成员对象。

    * 如果这个成员已经被替换过，返回现有替身，否则替换为一个mockito对象。

    * 在每个测试方法完成后，会自动还原为原成员对象。
      *

    * @param target    目标

    * @param fieldName 替换的成员名

    * @param clazz     替换的成员的类型
      */
      @SneakyThrows
      public static synchronized <T> T mockFieldIfNotMocked(Object target, String fieldName,
                                                        Class<T> clazz) {
      // 获取真实对象而非代理对象
      target = getSingletonTarget(target);

      Object replaced = REPLACED_FIELDS
          .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
      if (!Objects.isNull(replaced)) {
          // 已经替换过了，返回当前对象
          log.debug(target + "对象的成员" + fieldName + "已被自动mock");
          Field field = getField(target, fieldName);
          //noinspection unchecked
          return (T) field.get(target);
      }

      // 替换为一个mockito mock
      T mock = mock(clazz);
      backupOriginalField(target, fieldName, mock);

      return mock;
      }

   /**

    * 替换目标的某个成员对象。

    * 如果这个成员已经被替换过，返回现有替身，否则替换为一个mockito对象。

    * 在每个测试方法完成后，会自动还原为原成员对象。
      *

    * @param target    目标

    * @param fieldName 替换的成员名

    * @param clazz     替换的成员的类型
      */
      @SneakyThrows
      public static synchronized <T> T spyFieldIfNotMocked(Object target, String fieldName,
                                                       Class<T> clazz) {
      // 获取真实对象而非代理对象
      target = getSingletonTarget(target);

      Object replaced = REPLACED_FIELDS
          .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
      if (!Objects.isNull(replaced)) {
          // 已经替换过了，返回当前对象
          log.debug(target + "对象的成员" + fieldName + "已被自动mock");
          Field field = getField(target, fieldName);
          //noinspection unchecked
          return (T) field.get(target);
      }

      // 替换为一个mockito mock
      T mock = spy(clazz);
      backupOriginalField(target, fieldName, mock);

      return mock;
      }

   /**

    * 替换目标的某个成员。如果这个成员已经替换过，依然再次替换。

    * 在每个测试方法完成后，会自动还原为原成员对象。

    * @param target 目标

    * @param fieldName 替换的成员名

    * @param mock 替身
      */
      @SneakyThrows
      public static synchronized void mockField(Object target, String fieldName, Object mock) {
      // 获取真实对象而非代理对象
      target = getSingletonTarget(target);
      Object replaced = REPLACED_FIELDS
          .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
      if (!Objects.isNull(replaced)) {
          // 已经替换过了，覆盖
          log.error("发现重复替换" + target + "对象的成员" + fieldName);
          Field field = getField(target, fieldName);
          field.set(target, mock);
          return;
      }

      backupOriginalField(target, fieldName, mock);
      }

   @SneakyThrows
   public static synchronized void resetOriginalFields() {
       for (Entry<Object, Map<String, Object>> entry : REPLACED_FIELDS.entrySet()) {
           Object target = entry.getKey();
           for (Entry<String, Object> origin : entry.getValue().entrySet()) {
               Field field = getField(target, origin.getKey());
               field.set(target, origin.getValue());
           }
       }
       REPLACED_FIELDS.clear();
   }

   private static Object getSingletonTarget(Object target) {
       while (AopUtils.isAopProxy(target)) {
           // 获取真实对象而非代理对象
           target = AopProxyUtils.getSingletonTarget(target);
       }
       if (Objects.isNull(target)) {
           throw new IllegalArgumentException("target is null");
       }
       return target;
   }

   private static Field getField(Object target, String fieldName) {
       Field field = null;
       Class<?> type = target.getClass();
       while (type != null) {
           try {
               field = type.getDeclaredField(fieldName);
               break;
           } catch (NoSuchFieldException e) {
               type = type.getSuperclass();
           }
       }

       if (field == null) {
           throw new NoSuchFieldError();
       }
       
       field.setAccessible(true);
       return field;

   }

   private static void backupOriginalField(Object target, String fieldName,
                                           Object mock) throws IllegalAccessException,
                                                        NoSuchFieldError {
       // 获取真实对象而非代理对象
       target = getSingletonTarget(target);

       Field field = getField(target, fieldName);
       Object originFieldValue = field.get(target);
       // 如果已经替换过了，抛出异常
       Object replaced = REPLACED_FIELDS
           .computeIfAbsent(target, (key) -> new ConcurrentHashMap<>()).get(fieldName);
       if (!Objects.isNull(replaced)) {
           // 不应该重复替换原成员
           throw new IllegalStateException("非法覆盖" + target + "成员" + fieldName + "原始引用记录");
       }
       
       field.set(target, mock);
       log.debug("已替换" + target + "对象的成员" + fieldName + "为" + mock);
       
       if (!Objects.isNull(originFieldValue)) {
           // ConcurrentHashMap不能put null对象，null成员也没有必要备份
           REPLACED_FIELDS.computeIfAbsent(target, (key) -> new ConcurrentHashMap<>())
               .put(fieldName, originFieldValue);
       }

   }
   }

```