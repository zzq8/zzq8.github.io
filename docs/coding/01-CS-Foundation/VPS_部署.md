---
icon: devicon:linux
---

# VPS

## 零、前言

> 前言: vps 梯子到期, 看到别人 [blog](https://blog.sorrycc.com/gfw-2026) 推荐的梯子, 打算买一下
>
> ✨ ==突然看到这篇: [写给小白的自建2$/月的US原生家宽ip/HK节点解决方案](https://linux.do/t/topic/482315) 打算变卦尝试==
>
> - 但是看了下好像是伪需求, 像钻石一样的我伪需求
> - 加上线路鸡+落地鸡两套连招后好像很贵
>
> 故放弃, 还是随便找个 100+ 的 vps 用就好了

[VPS 测评网站](https://digvps.com/review)



我直接甩 ai:

```json
Q: https://digvps.com/review/racknerd  我要买这一家的 1c1g 的推荐一下买哪个地区
A: 洛杉矶 LA DC02（Asia Optimized）

Q: 帮我以 linux.do 该论坛为主, 调研 vps 买哪个, 主要科学上网用最好 200 以内人民币
```



## 一、流程

✨✨ [写给小白的自建科学上网教程：从技术原理到实践操作](https://linux.do/t/topic/520757)

> https://digvps.com/review/racknerd 买西部的洛杉矶
>
> ⭐️ 买完之后记得重装下系统为 debian 12，不然 ping 不通。(Debian 比 Ubuntu VPS 资源占用较低)

```markdown
## 融合怪测试 (等待6~7分钟) 【我一般没跑】
curl -L https://gitlab.com/spiritysdx/za/-/raw/main/ecs.sh -o ecs.sh && chmod +x ecs.sh && bash ecs.sh

## 网络质量测试 (等待4~5分钟) 【看下三网延时】
bash <(curl -Ls Net.Check.Place) -4

## ip质量测试 (等待1~2分钟) 【看 ai/流媒体 解锁没】
bash <(curl -Ls IP.Check.Place)

⭐️⭐️ [一键Linux管理脚本](https://github.com/eooce/ssh_tool) 【一般装协议+看机器】
- `free -h` 发现装好后就自带 1g 虚拟内存 (~~swap和zram~~)
- 用 2333boy 的一键脚本搭建一个 vless+reality
```

### 1. 生成 vless

### ⭐️ 方法1

直接用以下一键Linux管理脚本, 选 2333boy 的

`bash <(curl -fsSL ssh_tool.eooce.com)`

#### 方法2

> `bash <(wget -qO- -o- https://github.com/233boy/sing-box/raw/main/install.sh)`

执行完后直接就可以得到一个 vless
直接无脑==vless+reality==，如果是surge/loon的话，就用hy2

https://233boy.com/sing-box/sing-box-script/

### 2. 订阅转换

用的 linuxdo 大佬的: https://linuxdo.icmpmiao.cc/



