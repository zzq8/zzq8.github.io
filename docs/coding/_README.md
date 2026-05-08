---
title: Catalog
order: 1
index: false
updated: 2026-04-22 00:27:38
---
做技术笔记还行, 但是做博客不太行
折腾很久想 _blank 打开博客文章做不到, 这样让博客主页像个摆设...
<Catalog />



### typora

下个插件

- front matter配置好

### icon

https://icon-sets.iconify.design/



### TODO

- TODO blog 点完链接需要打开新标签页面 !!!
- 看官网有个代码折叠, 挺好



想要一个类似 https://www.flowya.io/# 的软件

或者用 iterm2 Hotkey Window 替代 

- **alias todo="glow ~/todo.md"**

- item2

  一个 tmux session

  ↓

  里面固定：

  - 左边 Claude Code

  - 右边 TODO

  - 下边 logs





```
你这种需求，其实非常适合：

Hotkey Terminal + Markdown TODO

也就是：

快捷键呼出一个悬浮终端
↓
里面就是你的 TODO / 看板
↓
再按一次隐藏

这套东西的优点是：

* 本地文件
* 秒开
* 极轻
* 无 Electron
* 无同步
* 无数据库
* git friendly
* AI 很容易接入

很多程序员最后都会从：

Notion/Jira/Trello

回归到：

一个 markdown 文件

因为：

真正重要的是“随时出现”

而不是复杂功能。

⸻

一、核心结构

你最终会得到：

⌥Space
↓
顶部滑出一个小终端
↓
显示 TODO 看板
↓
ESC 隐藏

像游戏控制台一样。

⸻

二、核心组件

我推荐：

组件	用途
iTerm2￼	悬浮终端
glow / bat / less	美化 markdown
taskwarrior / todo.txt	CLI TODO
fzf	模糊搜索
tmux	持久 session
Hammerspoon（可选）	自动化
yazi / lf（可选）	文件浏览

⸻

三、第一步：做悬浮窗口（最关键）

安装：

iTerm2￼

然后：

Settings → Keys

开启：

Create a Dedicated Hotkey Window

或者：

Show/hide iTerm2 with a system-wide hotkey

推荐快捷键：

⌥Space

然后勾选：

* Floating window
* Pin hotkey window
* All Spaces

这样：

任何时候按一下就出来

类似 Quake 控制台。  ￼

⸻

四、第二步：做 TODO 文件

例如：

~/todo.md

内容：

# TODO
## NOW
- [ ] 修 OpenClaw IM 问题
- [ ] Typora plugin
## NEXT
- [ ] agent workflow
- [ ] Mac mini backup
## DONE
- [x] 配置 sleepwatcher

⸻

五、第三步：美化显示

安装：

brew install glow

然后：

glow ~/todo.md

效果会像：

终端里的 Notion

非常舒服。

⸻

六、做到“一键打开 TODO”

你可以在 shell 里：

alias todo="glow ~/todo.md"

以后：

todo

就能看。

⸻

七、进阶：真正的 Kanban

这里开始有意思了。

安装：

brew install taskwarrior

它是：

CLI 世界的神级 TODO

例如：

task add "fix imessage"
task next
task done 1

⸻

八、再进阶：fzf 看板（程序员最爱）

安装：

brew install fzf

然后：

cat ~/todo.md | fzf

你会得到：

模糊搜索 TODO

瞬间定位任务。

⸻

九、终极形态（非常适合你）

你可以做：

一个 tmux session
↓
里面固定：
- 左边 Claude Code
- 右边 TODO
- 下边 logs

然后：

⌥Space

随时呼出。

这已经是很多：

* infra
* AI coding
* DevOps
* SRE

玩家的终极工作流。

⸻

十、为什么程序员最后喜欢这种

因为它：

极快

不是：

打开 notion
等待 webview
同步
登录
切 workspace

而是：

⌥Space
0.1 秒出现

⸻

极稳定

Markdown 文件：

* 10 年后还能打开
* git 可管理
* Claude 可直接修改
* shell 可处理

⸻

AI 极容易接入

比如：

claude "读取 ~/todo.md 并规划今天任务"

这种非常自然。

而 Notion/Jira 很难。

⸻

十一、我给你的推荐路线

我感觉你会非常适合：

iTerm2 Hotkey Window
+
tmux
+
Markdown TODO
+
glow
+
fzf

这是：

Mac heavy user / AI coding

特别舒服的一套。
```

