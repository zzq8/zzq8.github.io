---
updated: 2026-01-08 00:05:38
---

## 本地事务 vs 分布式事务思考
> `<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">TransactionTemplate</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> 是 Spring 框架中的一部分，用于简化事务管理。它主要用于处理本地事务，而不是分布式事务。</font>
>
> **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务的处理</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">：如果您的应用需要处理分布式事务（即跨多个数据源或系统的事务）</font>
>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"></font>

<font style="color:#DF2A3F;background-color:rgb(247, 249, 253);">TODO：思考其他系统怎么处理的，A：同ALMP一样的</font>

<font style="color:#DF2A3F;background-color:rgb(247, 249, 253);">很少用到分布式事务，具体看eshop代码和xts代码</font>

```java
//Step1.开启两阶段分布式事务
//step1.1 开启分布式事务
//step1.2 分布式参与者一：发券
//如果结果为空，超时等情况，直接回滚第一阶段，不做任何处理
//step1.3 处理事务成功的逻辑
shardTransactionTemplate.execute(new TransactionCallbackWithoutResult() {
    @Override
    protected void doInTransactionWithoutResult(TransactionStatus status) {
        //step1.1 开启分布式事务
        shardBusinessActivityControlService.start
```



本地事务外面再套一层分布式锁是不是能达到类似分布式事务的效果

A：<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">将本地事务外面包裹一层分布式锁可以在某些情况下提供一定程度的原子性和一致性，类似于分布式事务的效果，但并不能完全替代分布式事务</font>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"></font>

---

ZDAL 单库单表 / 分库分表两套数据源、事务管理器、事务模板



```json
   /**
     * 分库分表数据源
     */
    @Bean(initMethod = "init")
    public ZdalDataSource shardingDataSource() {
        return ZdalDataSourceBuilder.create()
            //应用数据源,实际使用时换成应用自身的数据源
            .appDsName("ilmprod_ds")
            //如果appName为当前应用,不需要声明该字段
            .appName("ilmprod")
            //应用数据源版本,实际使用时换成应用自身的数据源版本
            .version("EI63711501")
            //这里使用的示例数据源非dbMesh数据源
            .useDbMesh(false).build();
    }
```



```java
    /**
     * 分库分表事务管理器
     */
    @Bean
    public PlatformTransactionManager txManagerForSharding(@Qualifier(value = "shardingDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
```



```java
    /**
     * 分库分表的事务模板
     *
     * @param txManagerForSharding
     * @return
     */
    @Bean
    public TransactionTemplate transactionTemplateForSharding(
        @Qualifier(value = "txManagerForSharding") PlatformTransactionManager txManagerForSharding) {
        return new TransactionTemplate(txManagerForSharding);
    }
```



```java
    /**
     * 事务模版
     */
    @Autowired
    @Qualifier("transactionTemplateForSharding")
    private TransactionTemplate            transactionTemplateForSharding;


// 【使用】
transactionTemplateForSharding.executeWithoutResult(status -> {});
```





### 思考
> <font style="color:rgb(51, 51, 51);">直接用事务模板TransactionTemplate与使用@Trasaction注解，两者作用一样吗</font>
>

`**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">TransactionTemplate</font>**`**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">: ALMP用的都是这种</font>**

    - <font style="background-color:rgb(247, 249, 253);">编程式事务管理。</font>
    - <font style="background-color:rgb(247, 249, 253);">需要手动创建和使用 </font>`<font style="background-color:rgb(247, 249, 253);">TransactionTemplate</font>`<font style="background-color:rgb(247, 249, 253);"> 对象，并在代码中显式地定义事务的边界。</font>
    - <font style="background-color:rgb(247, 249, 253);">适合需要更细粒度控制事务行为的场景。</font>

```java
/** 单表事务模板 */
@Autowired
@Qualifier("transactionTemplateForSingle")
private TransactionTemplate                 transactionTemplate;

// 开启事务
return transactionTemplate.execute()
```





`**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">@Transactional</font>**`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">:</font>

+ <font style="background-color:rgb(247, 249, 253);">声明式事务管理。</font>
+ <font style="background-color:rgb(247, 249, 253);">通过注解自动管理事务，方法开始时自动启动事务，方法结束时自动提交或回滚。</font>
+ <font style="background-color:rgb(247, 249, 253);">更加简洁和易于理解，适合大多数场景。</font>



+ **<font style="background-color:rgb(247, 249, 253);">基本作用</font>**<font style="background-color:rgb(247, 249, 253);">:</font>
    - <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">两者都可以实现事务的提交和回滚，确保在数据库操作时的一致性。</font>
+ **<font style="background-color:rgb(247, 249, 253);">特性</font>**<font style="background-color:rgb(247, 249, 253);">:</font>
    - `<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">@Transactional</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">更加方便，适合简单的业务流程，能够自动处理异常的回滚。</font>
    - `<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">TransactionTemplate</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> 提供了更高的灵活性，可以用于复杂的事务控制、显式的事务管理和嵌套事务等。</font>

## 什么时候用分布式事务
> 时刻谨记这个case，拿GuliMall想一下！  两套库
>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务通常用于需要跨多个数据库或微服务进行一致性操作的场景。以下是一个简单的示例来说明何时该使用分布式事务。</font>

### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">示例场景：在线购物系统</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">假设我们有一个在线购物平台，涉及以下两个服务：</font>

1. **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">订单服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">：负责创建和管理订单。</font>
2. **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">库存服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">：负责管理商品库存。</font>

#### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">业务流程</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">用户下单时，系统需要执行以下步骤：</font>

1. <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">在</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">订单服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">中创建一个新订单。</font>
2. <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">在</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">库存服务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">中减少对应商品的库存。</font>

#### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">问题场景</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">考虑以下可能发生的情况：</font>

1. **<font style="background-color:rgb(247, 249, 253);">成功创建订单但库存不足</font>**<font style="background-color:rgb(247, 249, 253);">：</font>
    - <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">用户在下单时，订单成功创建，但是在调用库存服务时发现库存不足。此时，订单已经创建，但商品库存却未更新，导致数据不一致。</font>
2. **<font style="background-color:rgb(247, 249, 253);">库存更新成功但订单创建失败</font>**<font style="background-color:rgb(247, 249, 253);">：</font>
    - <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">首先，库存服务成功减少了商品库存，但在订单服务中创建订单时发生了失败。此时，库存已被减少，但订单却未创建，同样造成数据不一致。</font>

#### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务的必要性</font>
<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">在上述场景中，为了确保数据的一致性：</font>

+ **<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">需要使用分布式事务</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">来确保这两项操作要么同时成功，要么同时失败。</font>
+ <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">例如，可以采用</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">两阶段提交（2PC）</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">协议，或者使用</font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">Saga 模式</font>**<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);"> </font><font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">进行事务管理。</font>

### <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">选择分布式事务的总结</font>
+ <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">当你的业务逻辑需要跨越多个数据库、微服务或外部系统，且这些操作之间存在强一致性要求时，应考虑使用分布式事务。</font>
+ <font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">分布式事务可以有效地解决因网络延迟、服务故障等引起的数据不一致问题。</font>

<font style="color:rgb(51, 51, 51);background-color:rgb(247, 249, 253);">这种情况下，若未使用分布式事务，可能导致系统出现不一致，最终影响用户体验和业务流程。因此，分布式事务在涉及复杂业务操作时显得尤为重要。</font>