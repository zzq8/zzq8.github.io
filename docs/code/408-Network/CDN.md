---
article: true
tags: Network
date: 2024-06-29
---

# CDN

> 感觉怪怪的还是没搞好，先就这么用着吧。好像网站貌似变快了？！
>
> [测速网站](https://www.17ce.com/site)
>
> 
>
> 还是得看官方文档，搞了一天端午加一周的晚上时间看别人二手文章描述又描述不清！！混淆我！！！！突然开窍看了眼官网描述，草  原来是这个意思：
>
> 回源 HOST
> 即回源域名，CDN 节点在回源时，能够指定访问的源站 IP 地址下具体的站点域名。当您的源站只有一个和加速域名一致的站点，默认为加速域名即可，若源站为 COS 源或第三方对象存储时，回源 HOST 不可修改，控制台默认为回源地址。
>
> 说明：
> 什么是 CDN 回源 HOST 配置?
> 回源 HOST 是指加速域名在 CDN 节点回源过程指向源访问的站点域名，若您在源站服务器内同时部署了若干个 Web 站点，配置正确的回源 HOST 可以帮助您顺利访问指定的站点域名。

## 目前配置

#### DNS 设置

| 类型  | 名称 | 值              |
| ----- | ---- | --------------- |
| CNAME | www  | zzq8.github.io. |
| CNAME | @    | zzq8.github.io. |

#### CDN 设置

- **CDN加速域名**: `zzq8.cn`
- **CDN配置的源站地址**: `github 4 个 ip 地址`
- **CDN配置的回源HOST**: `zzq8.cn`

#### GitHub Pages 设置

- **自定义域名**: `zzq8.cn`
- **强制HTTPS**: 启用



==总结：@ CNAME到zzq8.github.io.而不是CDN给的域名   很奇怪，但却是达到效果貌似==

## 记录类型

> 尽管直接在根域名上使用 CNAME 记录是违反 DNS 标准的，但通过使用 A 记录、URL 转发、ALIAS/ANAME 记录或 CNAME Flattening 等技术，可以实现类似的效果。具体选择取决于你的 DNS 提供商支持的功能。

在域名配置中，CNAME记录和A记录是两种常见的DNS记录类型，它们的功能和用途有显著区别。以下是对这两种记录的详细解释：

### A记录（Address Record）

- **用途**：A记录用于将域名直接映射到一个IP地址。

- **格式**：`host.example.com -> 192.0.2.1`

- **使用场景**：适用于将域名直接指向服务器的IP地址。例如，如果您的服务器IP地址是 `192.0.2.1`，您可以创建一条A记录将 `www.example.com` 指向该IP地址。

- 优点

  - 直接指向IP地址，解析速度快。
  - 简单明了，适用于指向静态IP的情况。
  
- 缺点

  - 如果服务器IP地址改变，需要手动更新A记录。

### CNAME记录（Canonical Name Record）

- **用途**：CNAME记录用于将一个域名别名指向另一个域名。

- **格式**：`alias.example.com -> canonical.example.com`

- **使用场景**：适用于将一个子域名指向另一个域名。例如，如果您想将 `blog.example.com` 指向 `example-blog.com`，您可以创建一条CNAME记录。

- 优点

  - 便于维护。如果目标域名的IP地址改变，您只需要更新目标域名的记录，而不需要更改CNAME记录。
  - 适用于负载均衡和CDN配置，因为这些服务通常会提供一个域名作为入口。
  
- 缺点

  - 解析速度可能稍慢，因为需要额外的一次DNS查询。
  - ==不允许将根域名（如 `example.com`）配置为CNAME记录，只能用于子域名。==
    - xd 实测可以啊，不要信！！！





参考：https://www.mcoder.cc/2019/12/27/use_cdn_in_github_pages/





## Cloudflare 20250629

> 打开代理那个小黄云, 就是默认帮你CDN了
>
> 在 Cloudflare 的 DNS 设置中，你会看到每个记录旁边有一个小云朵图标：
>
> - ☁️ **灰色云朵（仅 DNS）**：
>
>   - 表示该记录**没有经过 Cloudflare 代理**
>   - **不启用 Cloudflare 的 CDN、WAF、防护等功能**
>   - 相当于 Cloudflare 只是一个普通 DNS 提供商，解析后你服务器直接暴露在公网中
>
>   
>
> - 🌥️ **橙色云朵（代理中）**：
>
>   - 表示该记录**启用了 Cloudflare 的代理**
>   - 启用 **CDN**、缓存、DDoS 防护、**SSL**、WAF 等 Cloudflare 功能
>   - 用户访问的是 Cloudflare 的边缘节点，真实 IP 被隐藏



Cloudflare默认启用的HTTP/3（使用QUIC）协议基于UDP，UDP协议在国内限速非常严重，导致连接虽快但访问速度却极其缓慢。

![img](https://linux.do/uploads/default/optimized/4X/8/a/1/8a1e474b7aa6815b58fcbffd3f0f7f6fd179236e_2_268x500.jpeg)



## 把它关了就行™
