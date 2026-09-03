---
updated: 2026-06-14 02:47:58
icon: qlementine-icons:mac-24
title: MacOS
description: 从0到1构建mac
---

## 零、inbox

LinuxRef 文档移过来, 合并 !!!



精读研究大佬的文档, 单独放一个文档 (转载)

编程字体我用 [Monolisa](https://www.monolisa.dev/) -> 怎么薅免费

## 一、Software

### 0.直接用

> 原大佬的笔记里有很多, 选了些我会用的

安装 HomeBrew 并用他安装 App 和 Cli 工具。

- App 可以在 [homebrew-cask — Homebrew Formulae](https://formulae.brew.sh/cask/) 里找有没有
- Cli 工具可以在 [homebrew-core — Homebrew Formulae](https://formulae.brew.sh/formula/) 找有没有。

```
# 先开代理，不然会很慢（依赖第一步）
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

# 安装 HomeBrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

----------------------------------------

# XD 整理过的 cask
brew install --cask \
  shottr \
  google-chrome  \
  espanso \
  iterm2 \
  sogouinput \
  eudic \
  thor \
  gas-mask \
  typora \
  caffeine \
  
  input0 \
  licecap \
  postman \
	visual-studio-code \
  wechat \
  telegram \
  iina \
  obs \
  docker \
  qq \
  obsidian \
  
# XD 安装 Cli 工具
brew install \
  fd \
  fzf \
  mole \
  
  tree \
  lazygit \
  translate-shell

  sleepwatcher \
  mkcert \
  ffmpeg \
  

# 安装 brew 没有的部分, CLI 版本的 picgo
npm install picgo -g
```



注意很多 brew 都可以装 (区分 Cli/Cask) !!!

> 以下是我肯定要装的

* Chrome (brew), idea, pycharm, postman (brew)~~, (Navicat, TinyRDM)~~
* Sublime (brew)
* iTerm2 (brew)
* Thor launcher (brew)
* Espanso (brew)
  * translate-shell (brew)

* Typora (brew)
* Eudic (brew [还没试过], App Store)
* Logi Options+ [鼠标滚动方向标准模式, 平滑滚动]
  * 如果不是罗技数据, 则用 `mos` 软件兜底: ``brew install --cask mos` (记得把 高级-> 转换键 打开, 这样可以横向滚动)

* ~~Ecopaste~~, [Deck](https://github.com/yuzeguitarist/Deck) (这个好还免费)

* `fd | fzf` (搜索引擎 | 搜索结果 UI)
  * fd 先找出所有文件
    ↓
    交给 fzf
    ↓
    你交互式筛选
* caffeine 这种 GUI 还是比 `caffeinate` CLI 命令更方便一点


> 以下是我选择装的

* [input0](https://github.com/10xChengTu/input0) (用了一下也还好用, 用 **Paraformer 中英粤** 这样中英混着说)

* sleepwatcher

  * brew services start sleepwatcher

  * 约定大于配置, 新建以下两个 bash 命令文件:
    ~/.sleep
    ~/.wakeup

  * ```bash
    #!/bin/bash
    
    echo "sleep triggered at $(date)" >> /tmp/sleepwatcher.log
    
    (
        sleep $((12 * 60 * 60))
        osascript -e 'tell application "System Events" to shut down'
    ) &
    
    echo $! > /tmp/sleepwatcher_shutdown.pid
    ```
    
  * ```bash
    #!/bin/bash
    
    echo "wakeup triggered at $(date)" >> /tmp/sleepwatcher.log
    
    if [ -f /tmp/sleepwatcher_shutdown.pid ]; then
        kill "$(cat /tmp/sleepwatcher_shutdown.pid)" 2>/dev/null
        rm /tmp/sleepwatcher_shutdown.pid
    fi
    ```
    
    * $! 是什么: 最近一次后台运行进程”的 PID


* Office
* the unarchiver (zip 可以系统自动解压, 但是 rar 不行要下)
* ~~Lemon~~ (发现一个 **[Mole](https://github.com/tw93/Mole)** CLI 方式清理推的多)
* Omi (App Store)
* iina
* Aldente (保护电池)

> 其他

* KeyCastr 屏幕显示你按的键
* LICEcap 录 GIF 动图
* [**VideoFusion**](chatgpt://generic-entity?number=25) 视频剪辑（偏轻量）



Chrome Plugin

[globalSpeed 配置](https:233377.xyz/resource/Global Speed - Sun Jun 14 2026.json)

* ✨ TODO 隐藏用法, 跳广告!!! 直接倍速广告有效!



### 1.Sublime

> 注册到 subl 命令到 CLI
>
> 常用命令
>
> - cmd+shift+p
>   - Search: install package (安装插件)
>   - Search: key bindings
>   - Search: set json/xxx (换文件格式)
>
> 常用插件: 
>
> - Insert nums
> - pretty json (虽然这里面有 jq, 但是还是可以单独再下个 jq 那个 filter finder 框会在当前页展开更方便)
> - CoolBase64
> - jsonPath
>
> 常用 py:
>
> * json 去转义格式化
> * ~~批量 replace 后, 批量保存+关闭~~  ==> 这个原生可解决

#### Setting

```json
{
	// 设置Sans-serif（无衬线）等宽字体，以便阅读
	"font_face": "YaHei Consolas Hybrid",
	// 字体大小
	"font_size": 14,
	// 使光标闪动更加柔和
	"caret_style": "phase",
	// 高亮当前行
	"highlight_line": true,
	// 高亮有修改的标签
	"highlight_modified_tabs": true,
	// 主题设置
	"theme": "Default Dark.sublime-theme",
	"ignored_packages":
	[
		"Vintage",
	],
	"color_scheme": "Mariana.sublime-color-scheme",
	"update_check": false,
	"open_files_in_new_window": "false",

	//MacOS
	"find_selected_text": true,
	
	"index_files": true,
	"update_check": false,
}
```

#### Keybinddings
via [Default (OSX).sublime-keymap](/resources/Default%20(OSX).sublime-keymap)

#### plungin

> Json - 去除转义后格式化

[CloseOtherTabs.py](/resources/sublime-plugins/CloseOtherTabs.py)

[escape_string.py](/resources/sublime-plugins/escape_string.py)

[json_unescape.py](/resources/sublime-plugins/json_unescape.py)

```python
# 文件路径：
#   Packages/User/json_unescape.py

import sublime
import sublime_plugin
import codecs
import json
import re


class JsonUnescapeCommand(sublime_plugin.TextCommand):
    """
    将所选文本从 \\uXXXX 反转义，并尝试：
    1) 修复 latin-1/utf-8 编码错位
    2) 把合法 JSON pretty-print
    如果没有选区，则默认作用于整个文件。
    """
    def run(self, edit):
        view = self.view
        sels = view.sel()

        # 如果没有任何选区，就把全文作为目标
        if all(r.empty() for r in sels):
            sels = [sublime.Region(0, view.size())]

        # 反向遍历，避免替换导致后续 Region 位移
        for region in reversed(sels):
            raw = view.substr(region)

            # 去掉首尾引号（如果整段都被同一种引号包裹）
            if (raw.startswith('"') and raw.endswith('"')) or \
               (raw.startswith("'") and raw.endswith("'")):
                raw_inner = raw[1:-1]
            else:
                raw_inner = raw

            # 1) unicode_escape 解码
            try:
                text = codecs.decode(raw_inner, 'unicode_escape')
            except Exception:
                text = raw_inner

            # 2) 修复“乱码”（latin1→utf8 的常见错位）
            try:
                text = text.encode('latin1').decode('utf-8')
            except Exception:
                pass

            # 3) 若是 JSON，再格式化
            try:
                obj = json.loads(text)
                text = json.dumps(obj, ensure_ascii=False, indent=4)
            except Exception:
                pass

            # 写回
            view.replace(edit, region, text)
```

### 2.Espanso

> match

[base.yml](/resources/base.yml)

> config

```yaml
search_shortcut: off
show_icon: false
```

### 3.Iterm2

iTerm2 和 zsh

先配置 iTerm2，这是 [效果图](https://img.alicdn.com/imgextra/i1/O1CN01PPttEm1mCx3bddVjX_!!6000000004919-2-tps-2374-1532.png)。1）Appearance 里，General 的 Theme 选「Minimal」，Pane 里不要「Show per-pane title bar with split panes」，Dimming 里选上第一和第三个，2）Profiles 里，Working Directory 里选「Reuse previous session's directory」。

安装 zsh 和 [starship](https://starship.rs/)，starship 是 rust 写的 prompt 工具，极快。

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
omz update
source ~/.zshrc
# starship 是 rust 写的 prompt 工具，极快
brew install starship
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
```

安装 zsh 的插件，我个人用到了 zsh-autosuggestions、zsh-completions 和 fast-syntax-highlighting。

```
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting
```

配置 ~/.zshrc，我的配置如下（略做删减）。这里有些 alias 是以 `,` 开头的，因为这样你敲 `,` 然后按「Tab」就可以 [看到所有自己定义的命令](https://img.alicdn.com/imgextra/i3/O1CN01XUDvg01ZHRwduLZSo_!!6000000003169-0-tps-1422-194.jpg) 了。为啥有些没有加 `,` ？历史原因… 因为其他都用习惯了就不改了。

```
# Disable brew auto update
export HOMEBREW_NO_AUTO_UPDATE=1
export ZSH="$HOME/.oh-my-zsh"

plugins=(
  # 不会 git 插件，因为和我的 alias 设置冲突
  # git
  zsh-completions
  zsh-autosuggestions
  fast-syntax-highlighting
)

# Alias
alias ,ms="%PATH/TO/MY/SCRIPT%"
alias ,ip="ipconfig getifaddr en0"
alias ,sshconfig="vim ~/.ssh/config"
alias ,gitconfig="vim ~/.gitconfig"
alias b=",ms branch"
alias umi="/Users/%MY_USERNAME%/Documents/Code/github.com/umijs/umi/packages/umi/bin/umi.js"
# chore
alias br="bun run"
alias c='code .'
alias i='webstorm .'
alias cdtmp='cd `mktemp -d /tmp/sorrycc-XXXXXX`'
alias pi="echo 'Pinging Baidu' && ping www.baidu.com"
alias ip="ipconfig getifaddr en0 && ipconfig getifaddr en1"
alias cip="curl cip.cc"
alias qr='qrcode-terminal'
alias ee="stree"
alias hosts="vi /etc/hosts"
## system
alias showFiles="defaults write com.apple.finder AppleShowAllFiles YES && killall Finder"
alias hideFiles="defaults write com.apple.finder AppleShowAllFiles NO && killall Finder"
# cd
alias ..='cd ../'
alias ...='cd ../../'
alias ..l.='cd ../../ && ll'
alias ....='cd ../../../'
alias ~="cd ~"
alias -- -="cd -"
alias ll='ls -alhG'
alias ls='ls -G'
# git
alias git=hub
alias gp="git push"
alias gt="git status -sb"
alias ga="git add ."
alias gc="git commit -av"
alias gcr="git checkout master && git fetch && git rebase"
alias gclean="git reset --hard && git clean -df"
alias grebase="git fetch && git rebase -i"

## timelapse
## ref: https://www.reddit.com/r/mac/comments/wshn4/another_way_to_timelapse_record_your_mac_screen/
function record() {
  cd ~/screencapture/jpg;
  RES_WIDTH=$(/usr/sbin/system_profiler SPDisplaysDataType | grep Resolution);
  RES_WIDTH=(${RES_WIDTH:22:4});
  RES_WIDTH=$((RES_WIDTH/2));
  while :
  NOW=$(date +"%y%m%d%H%M%S");
  do screencapture -C -t jpg -x ~/screencapture/jpg/$NOW.jpg;
    sleep 7 & pid=$!
    NOW=$(date +"%y%m%d%H%M%S");
    wait $pid
  done
}
function movie() {
  NOW=$(date +"%y%m%d%H%M%S");
  cd ~/screencapture/jpg;
  cnt=0
  rm -rf .DS_Store;
  for file in *
    do
      if [ -f "$file" ] ; then
      ext=${file##*.}
      printf -v pad "%05d" "$cnt"
      mv "$file" "${pad}.${ext}"
      cnt=$(( $cnt + 1 ))
    fi
  done;
  rm -rf 00000.jpg;
  for pic in *.jpg;
    do convert $pic -resize 50% $pic;
  done;
  ffmpeg -r 24 -i %05d.jpg -b 20000k ~/screencapture/mov/$USER-$NOW.mov;
  rm -rf ./*.jpg;
}

function pfd() {
  osascript 2> /dev/null <<EOF
  tell application "Finder"
    return POSIX path of (target of window 1 as alias)
  end tell
EOF
}
function mcd {
  mkdir $1 && cd $1;
}
function cdf() {
  cd "$(pfd)"
}
function ,touch {
  mkdir -p "$(dirname "$1")" && touch "$1"
}
function ,take() {
  mkdir -p "$(dirname "$1")" && touch "$1" && take "$(dirname "$1")"
}

# load zsh-completions
autoload -U compinit && compinit

# use nvm
source /opt/homebrew/opt/nvm/nvm.sh

# autojump
source /opt/homebrew/etc/profile.d/autojump.sh

# use starship theme (needs to be at the end)
eval "$(starship init zsh)"

# 必须在 plugins 之后
source $ZSH/oh-my-zsh.sh

# bun completions
[ -s "/Users/chencheng/.bun/_bun" ] && source "/Users/chencheng/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# pnpm
export PNPM_HOME="/Users/chencheng/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
```

4、SSH

```
mkdir ~/.ssh
# file name 用 github，passphrase 随意
ssh-keygen -t ed25519 -C "github"
# 编辑配置，内容如下
touch ~/.ssh/config
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/github
# 添加到系统 keychain
ssh-add --apple-use-keychain ~/.ssh/github
# 添加 public key 到 github
gh auth login
gh ssh-key add ~/.ssh/github.pub -t github
```



### 4.IINA shortcut key

```
# Generated by IINA

#@iina Shift+Meta+v video-panel
#@iina Shift+Meta+a audio-panel
#@iina Shift+Meta+s sub-panel
Ctrl+Meta+v cycle video
Ctrl+Meta+s cycle sub
Ctrl+Meta+a cycle audio
SPACE cycle pause
Meta+. stop
RIGHT seek 5
LEFT seek -5
Alt+RIGHT frame-step
Alt+LEFT frame-back-step
Shift+LEFT sub-seek -1
Shift+RIGHT sub-seek 1
Meta+s screenshot
Meta+l ab-loop
Meta+L cycle-values loop "inf" "no"
#@iina Shift+Meta+p playlist-panel
] playlist-next
[ playlist-prev
#@iina Shift+Meta+c chapter-panel
Shift+Meta+> add chapter 1
Shift+Meta+< add chapter -1
Alt+DOWN add speed -0.5
Alt+UP add speed 0.5
Alt+Meta+[ multiply speed 0.9091
Alt+Meta+] multiply speed 1.1
Alt+0 set speed 1.0
Meta+0 set window-scale 0.5
Meta+1 set window-scale 1
Meta+2 set window-scale 2
#@iina Meta+3 fit-to-screen
#@iina Meta+- smaller-window
#@iina Meta+= bigger-window
#@iina Ctrl+Meta+p toggle-pip
#@iina Shift+Meta+r show-current-file-in-finder
Ctrl+Meta+f cycle fullscreen
Ctrl+Meta+t cycle ontop
#@iina Alt+Meta+m toggle-music-mode
UP add volume 5
DOWN add volume -5
Meta+/ cycle mute
Shift+( add audio-delay 0.5
Shift+) add audio-delay -0.5
Alt+Shift+( add audio-delay 0.1
Alt+Shift+) add audio-delay -0.1
Shift+_ set audio-delay 0
#@iina Meta+D find-online-subs
Z add sub-delay -0.5
X add sub-delay 0.5
Alt+Z add sub-delay -0.1
Alt+X add sub-delay 0.1
C set sub-delay 0
ESC set fullscreen no
ENTER set fullscreen yes
q quit
p cycle pause   # toggle pause/playback mode
. frame-step   # advance one frame and pause
, frame-back-step   # go back by one frame and pause
m cycle mute
Shift+PGUP seek 600
Shift+PGDWN seek -600
G add sub-scale +0.1   # increase the subtitle font size
F add sub-scale -0.1   # decrease the subtitle font size
r add sub-pos -1
R add sub-pos +1
t add sub-pos +1
v cycle sub-visibility   # hide or show the subtitles
Alt+v cycle secondary-sub-visibility   # hide or show the secondary subtitles
f cycle fullscreen   # toggle fullscreen
E cycle edition   # next edition
POWER quit
PLAY cycle pause
PAUSE cycle pause
PLAYPAUSE cycle pause
STOP quit
Meta+RIGHT seek 60
Meta+LEFT seek -60
NEXT playlist-next
PREV playlist-prev
VOLUME_UP add volume 2
VOLUME_DOWN add volume -2
MUTE cycle mute
CLOSE_WIN quit
```

### Typora

#### Plugins

> issue via https://github.com/obgnail/typora_plugin/issues/1208
>
> plugin repo via https://github.com/bfyes/Typora-plugin-on-Mac

现存问题:

- 代码块太长了, 不折叠
- 标题不能折叠

一键安装:

```json
git clone https://github.com/bfyes/Typora-plugin-on-Mac.git
cd Typora-plugin-on-Mac
bash install.sh
```

该插件以及弄过的用户配置:

```
[pie_menu]
ENABLE = true

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 4, 0 ]
size = "16px"
icon = "fa fa-gear"
callback = "preferences.call"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 3, 0 ]
size = "16px"
icon = "fa fa-indent"
callback = "md_padding.call"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 2, 0 ]
size = "16px"
icon = "fa fa-font"
callback = "text_stylize.call"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 1, 0 ]
size = "16px"
icon = "fa fa-caret-up"
evil = "() => this.utils.jumpToEdge(true)"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 0, 0 ]
size = "16px"
icon = "fa fa-caret-down"
evil = "() => this.utils.jumpToEdge(false)"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 3, 1 ]
size = "16px"
icon = "fa fa-search"
callback = "search_multi.call"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 2, 1 ]
size = "16px"
icon = "fa fa-th-list"
callback = "right_outline.call"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 1, 1 ]
size = "16px"
icon = "fa fa-image"
callback = "image_viewer.call"

[[action_buttons.BUTTONS]]
enable = true
coordinate = [ 0, 1 ]
size = "16px"
icon = "fa fa-sitemap fa-rotate-270"
callback = "markmap.onButtonClick"

[global]
LOCALE = "zh-CN"

[collapse_paragraph]
ENABLE = true

[truncate_text]
ENABLE = true

[fence_enhance]
AUTO_FOLD_LINES = 20
FOLD_OVERFLOW = "hidden"
DEFAULT_FOLD = true
EXPAND_ON_FOCUS = true
FOLD_ON_BLUR = true

[right_outline]
DEFAULT_SHOW_OUTLINE = true

```

#### picgo core

> flarecloud R2 oss 需要装插件用命令: 
> https://docs.picgo.app/zh/core/guide/commands#install-add
>
> https://docs.picgo.app/zh/core/guide/commands#upload-u
>
> Doc Reference: https://www.shejibiji.com/archives/9420

`npm install picgo -g`

`picgo add s3`

`subl /Users/xd/.picgo/config.json`

Typora 配置 `picgo upload`

## 二、Shell

✨ [.zshrc](/resources/.zshrc)



* networkquality 【⭐️ 自带测网速】
* caffeinate: mac 自带命令, 让 Mac 一直保持运行（就算你不操作）【适合不合盖需要跑任务，不想要电脑自动休眠】
* `ln -s /path/to/original /path/to/link` 【创建软链, 快捷方式】(**cmd+opt+drag** = ln -i 创建文件的快捷方式)
  * 使用场景: py 的 .env 我想存 iCloud,  项目地址的 .env 就软链过去
    * **硬链接 = 给同一个文件起两个名字。** 【不加 -s 参数】
    * **软链接 = 一个文件里记录“另一个文件在哪里”。**
  
* say hello (macOS 自带了语音功能，可以用 `say` 命令让 Mac 开口说话)
  * brew update && brew upgrade && brew cleanup ; say mission complete
    ==可以和 `&&` 或者 `;` 配合使用来提示你某任务已经完成==
  * ; 是“无脑顺序执行”
    && 是“成功才继续”




* **fd base.yml -x open {}**
  - exec: 英文 execute 的缩写，意为 "执行"。-x 可理解为 "交叉执行" 或 "对每个结果执行"。
  - {} 含义 文件路径占位符
  
* export PATH ="/opt/homebrew/bin:$PATH "
  * 其中 `:` 是个分隔符
  * * *临时生效**：直接运行 export PATH ="/opt/homebrew/bin:$PATH "。
    想要 **永久生效**：将该命令写入你的 Shell 配置文件（如 ~/.zshrc 或 ~/.bash_profile）

* echo $SHELL / echo $ PATH



小技巧

- 开了 2 个 chrome 窗口 macos 如何快捷键切换 (cmd+`)   【现在用的很频繁】
- shell 窗口里内容滚动不方便, 我的替代方案用 CMD+上下滚动，不用鼠标滚轮
- Shell 操作历史的搜索， ctrl-r 快捷键

## 三、Shortcut Key

> 官方快捷键: https://support.apple.com/zh-cn/102650

Finder

* cmd+/ 可以看到当前文件夹多少个项目, 还剩多大空间 [实用]

* opt+cmd+c 复制文件路径 [实用]

* cmd+opt+drag = ln - i 创建文件的快捷方式

* cmd+shift+h 用户目录

* command＋shift＋G 访达跳转到指定路径

* cmd+opt+v 剪切

* Command-I 显示简介

* cmd+shift+. 显示隐藏文件

  * 使用以下方法永久设置（似乎对浏览器出发的文件选择器未生效）

    ```shell
    defaults write com.apple.finder AppleShowAllFiles -bool true # 显示隐藏文件
    defaults write com.apple.finder AppleShowAllFiles -bool false # 不显示隐藏文件
    killall Finder # 重启 Finder
    ```




* cmd+ctrl+f 全屏

## 四、Technique

#### 1. 拖动软件

> 我设置后鼠标到下面的 dock 出现的很慢, 用以下方式解决

```
defaults write com.apple.dock autohide-delay -float 0
killall Dock
```

other via 参考:

**执行 `defaults write -g NSWindowShouldDragOnGesture -bool true`，然后就可以按住「⌘+⌃」然后鼠标点击任意地方拖动窗口了。来源 [Moving a macOS window by clicking anywhere on it (like on Linux) · mmazzarolo.com](https://mmazzarolo.com/blog/2022-04-16-drag-window-by-clicking-anywhere-on-macos/)，但是在 MacOS 13 下似乎失效了。**

关闭: defaults delete -g NSWindowShouldDragOnGesture

#### 2. dock 快速显示隐藏

https://apple.stackexchange.com/questions/33600/how-can-i-make-auto-hide-show-for-the-dock-faster

```sh
defaults write com.apple.dock autohide-time-modifier -int 0; killall Dock
```



## 四、FAQ

### 分辨率问题

> macmini 连接一台 4k 分辨率显示器，在设置中设置显示器的缩放分辨率只会影响 UI 字体并不会影响真实的 4k 分辨率是吗

是的，当您连接一台 4K 分辨率的显示器到 Mac mini 上时，您可以在系统设置中调整显示器的缩放分辨率。这将影响显示器上的 UI 元素（如菜单栏、窗口和图标）的大小和清晰度，但不会实际改变显示器的物理分辨率。

Mac mini 会输出其默认的分辨率（通常是显示器的原生分辨率），而您在系统设置中进行的缩放只会调整 UI 元素的大小，以适应更高或更低的分辨率。这意味着物理像素的数量不会改变，只是它们在屏幕上的显示大小会发生变化。

如果您想要实际更改显示器的分辨率，您可以在系统设置中选择显示器的原生分辨率或其他支持的分辨率选项。这将直接影响物理像素的数量，以获得更高的清晰度和细节。注意，更高的分辨率可能需要更强大的图形处理能力，并可能导致图形性能下降。



昨天去了王府井 apm 苹果店，和工作人员交流了一下，这个不是降分辨率，就是和 win10 一样只是调大了系统的字体（但是也不是完全一样，win10 只是调节了字体，而 macos 是调节了字体，icon 和窗口的大小）。在调节后的屏幕上会显示一个更低的分辨率，那个的意思是说现在的字体大小和更低分辨率的缺省字体一样的，正是这个不好的 ui 或者说系统提醒的这句话让大家有了误解。建议苹果可以在新版本中修改这句让人误解的话。

作者：Peterwen
链接：https://www.zhihu.com/question/443961913/answer/1726069699
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### 实现盒盖多久后自动关机, 而不是一直睡眠耗电

一开始我以为做不到

但是实际上有一个解决方案: `sleepwatcher` 相当于是系统的事件 hook+shell

| **文件**    | **时机** |
| ----------- | -------- |
| .sleep      | 睡眠前   |
| .wakeup     | 唤醒后   |
| .poweron    | 开机     |
| .shutdown   | 关机前   |
| .displayoff | 熄屏     |
| .displayon  | 亮屏     |

### 允许 “任何来源” 下载的 App 运行

1. 先尝试打开后, 看隐私有没有打开提示

2. 再尝试 -> 

打开 “终端” 执行如下命令（根据提示输入您的密码即可）：

```
sudo spctl --master-disable
```

XD: 此时隐私安全性里就多了一项: `任何来源`

### 设置软件键位 (Typora 举例)

⭐️ **增加系统快捷键** - 键盘设置里 - App 快捷键 - 表情与符号（xd 这个菜单名一定要填对，其实看一下每个应用的 task bar 应该都能设置！！！）

* 在官网这里 [键位映射表](https://support.typora.io/Shortcut-Keys/#change-shortcut-keys) 搜名字（应该也可打开软件直接看菜单栏！），要对应起来，Mac 设置到 App 快捷键

<img src="http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/image-20231215180744304.png" alt="image-20231215180744304" style="zoom: 25%;" />

### 为什么 Vue 项目总是在 1024 端口启动？

我猜你是 Mac 用户～

在 mac os 中，非 root 用户是无法使用小于 1024 的常用端口的。
如果小于 1024 端口，会从 1024 开始。
