---
icon: arcticons:clash
---



# Clash

## Inbox-前言

### 教程

✨ [写给小白的自建科学上网教程：从技术原理到实践操作](https://linux.do/t/topic/520757)

✨ [各平台代理工具汇总（半年一更）](https://linux.do/t/topic/375351)

- PC: [V2rayN](https://github.com/2dust/v2rayN) / [Clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases)
- IOS: [Shadowrocket](https://apps.apple.com/ae/app/shadowrocket/id932747118)

### 节点/机场来源

- [XD-自建 VPS](VPS_部署.md)
- 买机场, 省事 (我一般买几个按量付费的机场)
  - 论坛 v2ex, linuxdo 一大把
  - [毒药机场评测站](https://www.duyaoss.com/archives/1086/)

ps: 个人是 vps + 按量备用



> 下属两者不是同一个配置, 注意 !!! 不能通用

## 一、Clash-Meta & Merlin-Clash

> **Clash.Meta ≈ Mihomo 内核**

linuxdo 网友总结的:

[Clash配置文件详解](https://linux.do/t/topic/163682)

✨ Config 我用的这个模板:[Clash/Clash Verge自用配置](Clash/Clash Verge自用配置)

## 二、Shadowrocket

### 修改位置

✨可以通过模块的方式修改位置: [IOS_位置修改.md](../../_posts/XD/IOS_位置修改.md)

### 配置文件

> fork 了该大佬的[配置](https://github.com/LingJingMaster/Shadowrocket-Rules), 加了些模块的 `HTTPS 解密` 所需域名

使用远程地址导入的方式：

https://raw.githubusercontent.com/zzq8/Shadowrocket-Rules/refs/heads/main/Shadowrocket.conf
