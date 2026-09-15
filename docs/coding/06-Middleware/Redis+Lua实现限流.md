用过的数据结构

- String
- hash (userInfo ?)
- zset (限流 / 排行榜)

## hash

hash vs str 操作对象用 hash , 如果有 update 操作它就是优势 (直接更新某个字段) **str 还需要经历取出反序列化, 改完, 序列化放回**  所以Hash适合: 用户信息等需要频繁更新的对象



hash变更的数据 user name age,尤其是是用户信息之类的，经常变动的信息！ 

hash **更适合于对象的 存储**，String更加适合字符串存储！

```json
## string
127.0.0.1:6379> set key1 v1 # 设置值
OK

## hash
127.0.0.1:6379> hset myhash field1 kuangshen # set一个具体 key-vlaue
(integer) 1
```

## zset

本脚本只用到 3 个 ZSET 命令，全部围绕 **score = 时间戳**：

| 命令                           | 作用                                  | 本脚本中的用途                                         |
| ------------------------------ | ------------------------------------- | ------------------------------------------------------ |
| `ZADD key score member`        | 添加一个成员                          | 放行后记一笔账：`ZADD permits now "uuid:1:1"`          |
| `ZRANGEBYSCORE key min max`    | 取出 score 在 `[min, max]` 区间的成员 | 找出**已经滑出窗口的旧账**（score ≤ `now - interval`） |
| `ZREMRANGEBYSCORE key min max` | 删除 score 在区间内的成员             | 对完账后**删掉旧账**（闭区间，含边界）                 |

```mermaid
flowchart LR
    A["放行请求"] --> B["ZADD 记账<br/>value 扣减"]
    B --> C["流水存活<br/>（窗口内）"]
    C --> D["score ≤ now - interval<br/>（滑出窗口）"]
    D --> E["下次请求检查时<br/>令牌加回 value，流水删除"]
```

1. **数据模型**：每个维度
   1. 一把"余额"（String `:value`）
   2. 一本"流水账"（ZSET `:permits`，score = 发放时间）

`余额 + 窗口内流水之和 = count` 恒成立。

1. **滑动窗口**：放行时 `ZADD` 记账；检查时把 score ≤ `now - interval` 的旧流水换算成令牌加回余额——额度随时间滑动自动恢复，无固定窗口的临界突刺。
2. **原子性**：多条规则在一次 Lua 调用里"先全部只读检查，再统一扣减"，Redis 单线程执行脚本保证并发安全，失败路径零状态修改。



Lua 脚本两阶段执行

第一阶段（第 22-55 行）：只读检查，先算账不花钱

1. 读余额，缺 key 视为满额
2. 计算过期流水，把令牌"回流"到余额

```lua
local expired_values = redis.call("zrangebyscore", permits_key, 0, now_ms - interval)
# `math.min` 兜底，防止时钟偏差等异常情况下加超上限
current_val = math.min(max_tokens, current_val + expired_count)
```



第二阶段（第 58-75 行）：统一扣减，先删旧账再记新账

```lua
-- ① 删除阶段一计算过的过期流水（不删的话，下次请求会把同一批令牌重复回收）
redis.call("zremrangebyscore", permits_key, 0, now_ms - interval)
-- ② 记新账：本次请求消耗的令牌入流水，score = now
redis.call("zadd", permits_key, now_ms, permit_record)
-- ③ 扣余额：阶段一算好的 current_val 已包含回收量，这里连同扣减一起落库
redis.call("set", value_key, current_val - permits)
-- ④ 给两把 key 续 TTL
local expire_time = math.ceil(interval * 2 / 1000)
if expire_time < 1 then expire_time = 1 end
redis.call("expire", value_key, expire_time)
redis.call("expire", permits_key, expire_time)
```

- **④ TTL 为什么是 2 倍窗口**：TTL 只负责清理冷数据，**限流正确性靠脚本内的过期回收保证**。==如果 TTL ≤ 窗口，最后一批流水可能还没等到"下一次请求"来回收==，两把 key 就被 Redis 删了——下次请求看到 key 不存在会视为满额，等于整桶重置，滑动窗口瞬间退化成固定窗口。留 2 倍余量，让最后一次记账总有时间被回收。







**Q5：多实例部署时，时间用谁的不一致怎么办？**
每个实例用自己的 `System.currentTimeMillis()` 传入，时钟偏差会轻微影响窗口边界判断（几毫秒级），`math.min` 兜底也防止了余额加超。要求实例间 NTP 同步即可，这也是业界通行做法。



````
**NTP 同步**就是：**让计算机的系统时间和标准时间服务器保持一致。**

NTP 全称是 **Network Time Protocol（网络时间协议）**。

例如你的服务器当前时间是：

```text
服务器：2026-09-10 18:20:15
标准时间：2026-09-10 18:20:08
```

服务器通过 NTP 向时间服务器校准：

```text
你的服务器
    ↓ NTP
时间服务器
    ↓
返回标准时间
    ↓
修正服务器系统时间
```

最终变成：

```text
服务器：2026-09-10 18:20:08
```
````

