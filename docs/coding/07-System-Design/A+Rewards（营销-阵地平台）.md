---
updated: 2026-01-10 15:35:23
---

> imktuserprod 是一个 java 系统。它是 A+Rewards 和支付营销的后端系
>
> 统。由于 A+Rewards 是运行在 Wallet 中的小程序（如 GCash、Toss、
>
> Tngd），因此需要 AuthLogin 才能在主机钱包中获取用户 ID。A+Rewards
>
> 页面也由 imktuserprod 提供服务，还有会员资格、游戏玩法、优惠券口袋
>
> 和支付营销。  

大客户 - 对接支付宝 - 支付宝对接其他国家本地钱包 - 本地钱包里包含 A+Rewards 小程序 ！  
（发现的越多玩的越多，挣钱   东南亚穷薅羊毛）
>

## <font style="color:rgb(38, 38, 38);">GOL营销业务介绍</font>
> A+的核心是支付，**A+营销服务于支付**，通过**A+rewards（checkin营销产品）**为A+支付相较于竞对（Visa/MasterCard）提供**差异化竞争力**。
>
> 营销 - A+ 已经是东南亚 No.1   已经做了 3 年
>
> A+Rewards - 其实就是嵌到合作钱包的一个小程序
>
> 支付&营销 -via目的- 拿用户数据，有价值      痛点：增量用户
>
> 自己理解：chekcout（商服-收单）checkin（营销-卖券搞活动吸引流量）  
> 线上｜线下？也是一个区分点？
>
> + checkout（支付营销，券立减）
> + checkin（用户引导到这个店支付）
>
> CheckIn产品（如 A+Rewards）：主要目的是吸引用户、增加用户互动和粘性，通过奖励机制等方式提高用户活跃度。
>
> CheckOut产品（如 营销宝）：主要目的是优化用户的交易和结算体验，促进购买和支付，以提高销售转化率。
>

![](https://image.233377.xyz/2026/e84380b441045f67f7a9dbd601d3a7eb.png)

**第三阶段：**确认第一客户：C、B 端、partneer   商户是我们的第一客户（倾向它）

第四阶段：营销就是数据

## <font style="color:rgb(38, 38, 38);">⭐</font><font style="color:rgb(38, 38, 38);">️ GOL营销架构大图</font>
> 营销技术大图（可理解小淘宝了，有共同的技术难题）
>

![](https://image.233377.xyz/2026/2bd663e39109b84f51c5bcd99235f85c.png)

## <font style="color:rgb(38, 38, 38);">营销L0领域模型</font>
> L0 - 抽丝剥茧，把所有的融到这里
>

![](https://image.233377.xyz/2026/f778b451f735e8008504a41ac5f09cd7.png)

**渠道**：SKU 为什么要有渠道 - 因为不止有蚂蚁的还有外部 Google等的    发码  
vs 商服的渠道：商服说的“渠道”是支付渠道，你可以理解Antom收单支付产品对接的具体的支付方式，比如支付宝就是一个渠道	

**履约**：发商品（系统基本是虚拟商品，搞实体要物流啊）

### 附录：营销L1领域模型
> <font style="color:#DF2A3F;">如果要做，把文档下贴的链接的领域模型看明白</font>
>

搭建投放领域模型：[https://lark.alipay.com/oversea/ndt4gu/bqfcrirvg2zh5hfk](https://lark.alipay.com/oversea/ndt4gu/bqfcrirvg2zh5hfk)

Eshop商品售卖领域模型：[https://lark.alipay.com/oversea/ndt4gu/sirk8rza5ags1wuq](https://lark.alipay.com/oversea/ndt4gu/sirk8rza5ags1wuq)

营销平台模型：[https://lark.alipay.com/oversea/ndt4gu/uvvz4dy5o1qpmgxw](https://lark.alipay.com/oversea/ndt4gu/uvvz4dy5o1qpmgxw)

## ⭐️ A+Rewards系统核心链路
**页面渲染**  
![在这里插入图片描述](https://image.233377.xyz/2026/a74996cc7462495780ea5beec6f62439.png)


**<font style="color:rgb(38, 38, 38);">参与玩法（以签到玩法为例） </font>**  

  ![在这里插入图片描述](https://image.233377.xyz/2026/533640eafc544918ac8a843d1157723d.png)

**<font style="color:rgb(38, 38, 38);">活动领取</font>**  

![在这里插入图片描述](https://image.233377.xyz/2026/dbf438c7a473493290ea11ad4f6ca1e3.png)

外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传


**<font style="color:rgb(38, 38, 38);">活动核销</font>**  
![在这里插入图片描述](https://image.233377.xyz/2026/ff1c98921e7c4d079f4d3a649a6c0653.png)


外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传

Oauth 2.0 -> Token -> User

<font style="color:#DF2A3F;">分布式事务要 care 一下   Ant 用的 xts（框架）</font>

## Tips
重点地区/市场：目前主要关注东南亚市场

+ <font style="color:rgb(23, 26, 29);">DANA 印尼 </font>
+ <font style="color:rgb(23, 26, 29);">TNGD 马来 </font>
+ <font style="color:rgb(23, 26, 29);">GCASH 菲律宾 </font>
+ <font style="color:rgb(23, 26, 29);">ALIPAYHK 香港 </font>
+ <font style="color:rgb(23, 26, 29);">TrueMoney 泰国 </font>
+ <font style="color:rgb(23, 26, 29);">KakaoPay 韩国 </font>
+ <font style="color:rgb(23, 26, 29);">Toss 韩国 </font>

<font style="color:rgb(23, 26, 29);">这是我们接入的钱包，这些钱包APP里都有A+rewards小程序，感兴趣的可以翻墙去下载，需要境外手机卡注册账号</font>

<font style="color:rgb(23, 26, 29);">xd 实测 GCASH 注册成功后还要实名认证扫身份证，半途放弃！</font>