---
encrypt: true
updated: 2026-01-10 15:35:54
---

> ieshopprod也是一个java系统。电子产品销售是A+Rewards的主要功能，
>
> ieshopprod负责电子商务业务，包括订单，产品，SKU，付款，履行等功
>
> 能。  

>这块如不熟悉感觉可以找xx，毕竟文档跟培训都是他讲的

## A+Store在A+的定位
> A+Store为A+rewards提供**售卖供给来源**（外部商户券）以及**电商售卖能力**。
>
> 面向虚拟商品的一个售卖系统，B端运营管理
>
> 端到端的电商系统 供销存管控一体，也是有很多技术挑战在里面的
>
> ps：端到端解决方案指从需求发起，到需求满足的全程
>

![](https://image.233377.xyz/2026/974fb5aa16be7871cacd024dcad7404c.png)

## 整体业务流程
![](https://image.233377.xyz/2026/2256dab5d3e70389b0b967b1b25283cd.png)

## 资金信息流
![](https://image.233377.xyz/2026/a7652344a07190004321fa01b5d0a68e.png)

## 整体架构
![](https://image.233377.xyz/2026/3fb56c68aef3012119ec81293aee9dd6.png)

## 核心领域模型
### L0
![](https://image.233377.xyz/2026/bb63f796c64d3e75145b0defee42ee73.png)

### L1
![](https://image.233377.xyz/2026/51129b418f0375266b89c8e881529d05.png)

### 商品类型
+ **券（卡/体外券/体内券）**：购买后给用户发一张券，用户自行核销；有三种权益类型：营销平台的码池和体内券，码商API；
+ **充值**：一般是游戏充值；购买时需要用户填写充值账号，购买成功后eshop调用供应商接口<font style="color:#DF2A3F;">直接充值到用户填写账号中</font>；
+ **订阅**：一般是数娱会员，比如disney，IQIYI；购买时需要<font style="color:#DF2A3F;">用户填写订阅账号，并签约全球站代扣</font>；签约成功后，全球站立即执行一次代扣，eshop调用供应商订阅接口给用户充会员，后续依赖<font style="color:#DF2A3F;">全球站周期扣款</font>通知eshop给用户续期；

## 核心链路
### 供给管理/<font style="color:rgb(38, 38, 38);">商品创建</font>
![](https://image.233377.xyz/2026/f131eb5d4bfe3323ab1600a9b78cc328.png)

### <font style="color:rgb(38, 38, 38);">商品下单/支付/履约</font>
![](https://image.233377.xyz/2026/35d9845f992e60ce64d58d6d5880dc32.png)





## 5.22 xx师兄会议纪要+xx补充
> 场景：找 eshop 与 冰原狼 券信息的关联关系字段
>
> 玖承师兄通过给我们梳理 eshop 代码方式，连带业务疏通了一遍如下
>

### 大体流程
> eshop -via 券平台- icc icf imktuserprod imktcenter
>

+ 进货 NS 平台（采购平台，管理商品、库存）- **nssku、nsskusource **同步到 Eshop
+ 运营在 Eshop 管理商品：创建 product、sku
    - **sku - nssku**
+ 上架 feeds 流
+ 下单 （eshop 库存 -1）⭐️
+ 支付 （收单站通知 eshop，http -> amspaycontroller）
+ 履约（异步-定时任务扫task）
+ 退款
+ 库存信息同步 ns （ns 库存 -1）

### 捋代码得结论
StandardStockUnit.class   eshop 的 sku 在这个类里

券模板 id 放在**订单快照**里面

eshop F12 voucherxxxx 这个就是券字段，通过上述流程找到的这个字段！



下单阶段性提交：一阶段、二阶段 (是结偶和的，用的sofaMQ)  **注意：有一些服务是****<font style="color:#DF2A3F;">自发自收</font>****   收消息就已经到二阶段的，也会去走流程引擎各种节点**

引擎做一些事情 - bean去实现 biz-flow.xml
