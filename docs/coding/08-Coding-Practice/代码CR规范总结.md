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
