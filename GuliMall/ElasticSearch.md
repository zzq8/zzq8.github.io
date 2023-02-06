# Elasticsearch

Port：9200              kibana：5601

> [全文搜索](https://baike.baidu.com/item/全文搜索引擎)属于最常见的需求，开源的 [Elasticsearch](https://www.elastic.co/) （以下简称 Elastic）是目前全文搜索引擎的首选。
>
> 它可以快速地**储存、搜索和分析海量数据**。维基百科、Stack Overflow、Github 都采用它。
>
> ### Elasticsearch: Store, Search, and Analyze
>
> 
>
> 秒级的从我们海量数据中检索到我们感兴趣的数据，因为放在内存中。
>
> 将MySQL数据往ES里面存一份

# 一、入门

> 在此系统中两种： 后话 -> ES我这里学的非常模糊，后面商品搜索也是照抄代码，暂时掠过待有需要回头再学
>
> 1. 商品搜索
> 2. 日志搜索

### 倒排索引机制：分词

![image-20220907215603856](https://images.zzq8.cn/img/202209072156269.png)



### 基本概念

Elasticsearch也是基于Lucene的全文检索库，本质也是存储数据，很多概念与MySQL类似的。

对比关系：

```
索引（indices）----------------------Databases 数据库

  类型（type）--------------------------Table 数据表

     文档（Document）----------------------Row 行

	    字段（Field）-------------------------Columns 列 
```



要注意的是：**Elasticsearch本身就是分布式的**，因此即便你只有一个节点，Elasticsearch默认也会对你的数据进行分片和副本操作，当你向集群添加新数据时，数据也会在新加入的节点中进行平衡。

==ES 将数据存于内存的！==

内存：因为天然支持分布式，可以多装几台 ES 放在不同的服务器。就会将数据分片存储，10 W个数据，这台存几千那台几千。容量不够数量来凑！



## Docker 安装 ES

### 下载镜像文件 

> **踩坑：我没有指定版本号，Tag：latest 看一下 created 居然是三年前的 5.6.12！**
>
> hub.docker.com 还是去这个网站 pull

```bash
docker pull elasticsearch:7.4.2 #存储和检索数据 
docker pull kibana:7.4.2  #可视化检索数据，类似 navicat 之于 mysql 的可视化界面


#配置，具体看基础篇 Docker 有 MySQL 的使用例子
mkdir -p /mydata/elasticsearch/config
mkdir -p /mydata/elasticsearch/data
echo "http.host: 0.0.0.0" >> /mydata/elasticsearch/config/elasticsearch.yml


docker run --name elasticsearch -p 9200:9200 -p 9300:9300 \
-e "discovery.type=single-node" \
-e ES_JAVA_OPTS="-Xms64m -Xmx512m" \
-v /mydata/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-d elasticsearch:7.4.2


以后再外面装好插件重启即可；
特别注意：
chmod -R 777 /mydata/elasticsearch/ 保证权限
-e ES_JAVA_OPTS="-Xms64m -Xmx256m" \ 测试环境下，设置 ES 的初始内存和最大内存，否则导致过大启动不了 ES
```

kibana：

```bash
docker run --name kibana -e ELASTICSEARCH_HOSTS=http://zzq8.cn:9200 -p 5601:5601 \
-d kibana:7.4.2
```



# 二、使用

> 参照官方文档，具体一些命令怎么用 [官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)

## 使用 postman 测试

> 对 ES 的所有操作，它都封装成了 Rest Api

第二次发送这个请求 version 就是 2 ，result 变成 update

zzq8.cn:9200/customer/external/1  路径 index/type/id 可以理解成 数据库/表/数据

<img src="https://images.zzq8.cn/img/202209101952264.png" alt="image-20220910195209067" style="zoom:50%;" />



## 乐观锁

更新携带 ?if_seq_no=0&if_primary_term=1

根据 seq_no 来比对版本

# 三、查询

## 1. _cat 看基本信息

```mysql
GET /_cat/nodes：查看所有节点
GET /_cat/health：查看 es 健康状况
GET /_cat/master：查看主节点
GET /_cat/indices：查看所有索引 show databases;
```



## 2. _update 更新

带 _update 就会对比原来的数据，如果更新和原来一样就会 noop（no opration）不进行操作。带 _update 的记得要按照下面这样写：==加 doc==

```json
{ 
    "doc":{ "name": "John Doew"}
}
```



不带发 post 和 put 就都会直接更新不会对比数据，version会往上涨





## 3. Query DSL

> Elasticsearch提供了一个可以执行查询的Json风格的DSL。这个被称为Query DSL，该查询语言非常全面。

### 1）匹配所有

```json
GET /atguigu/_search
{
    "query":{
        "match_all": {}
    }
}
```

- `query`：代表查询对象
- `match_all`：代表查询所有



### 2）条件匹配

```json
GET bank/_search
{
  "query":{
    "match":{
      "account_number": 20
    }
  }
}
```



### 3）match_phrase 短句匹配

==match_phrase和match的区别，观察如下实例：==

* match_phrase是做短语匹配
* match是分词匹配，例如990 Mill匹配含有**990或者Mill**的结果

```json
GET bank/_search
{
  "query":{
    "match_phrase": {
      "address": "mill road"
    }
  }
}
```



### 4）multi_math 多字段匹配

state或者address中包含mill，并且在查询过程中，会对于查询条件进行分词。

```json
GET bank/_search
{
  "query": {
    "multi_match": {
      "query": "mill",
      "fields": [
        "state",
        "address"
        ]
    }
  }
}
```



### 5）bool用来做复合查询

布尔查询又叫**组合查询**

`bool`把各种其它查询通过`must`（与）、`must_not`（非）、`should`（或）的方式进行组合

```json
GET bank/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "gender": "M"
          }
        },
        {
          "match": {
            "address": "mill"
          }
        }
      ],
      "must_not": [
        {
          "match": {
            "age": "18"
          }
        }
      ],
      "should": [
        {
          "match": {
            "lastname": "Wallace"
          }
        }
      ]
    }
  }
}
```





### 6）Filter【结果过滤】

所有的查询都会影响到文档的评分及排名。如果我们需要在查询结果中进行过滤，并且**不希望过滤条件影响评分**，那么就不要把过滤条件作为查询条件来用。而是使用`filter`方式：

```json
GET bank/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "address": "mill"
          }
        }
      ],
      "filter": {
        "range": {
          "balance": {
            "gte": "10000",
            "lte": "20000"
          }
        }
      }
    }
  }
}
```

这里先是查询所有匹配address=mill的文档，然后再根据10000<=balance<=20000进行过滤查询结果

`range`查询允许以下字符：

| 操作符 |   说明   |
| :----: | :------: |
|   gt   |   大于   |
|  gte   | 大于等于 |
|   lt   |   小于   |
|  lte   | 小于等于 |



### 7）term

match模糊匹配 term精确匹配

```json
#像age这种精确取值 match换成用term
GET bank/_search
{
  "query": {
    "term": {
      "age": 28
    }
  }
}
```





## 4. nested 去扁平化

![image-20221018170313908](https://images.zzq8.cn/img/202210181703256.png)

## 5. 分词器

#使用 standard 分词，会把一个个单词分开
#中文需额外搞分词器 => [ik 分词器](https://github.com/medcl/elasticsearch-analysis-ik/releases)

```
POST _analyze
{
  "analyzer": "standard",
  "text": "the quick brown fox jumps over the lazy dog."
}
```



ik_smart、ik_max_word

#### 分词器可以有自定义词库，给一个远程文本地址，配置后就可根据里面的分

重启 ES 即可识别



==我这里直接拿 Nginx 当了文件服务器==，配置好路由。/usr/share/nginx/html 放上 /es/fenci.txt

  http://zzq8.cn:9201/es/fenci.txt
