---
updated: 2026-01-09 00:08:09
---

# MacOS

## 零、inbox

精读研究大佬的文档, 单独放一个文档 (转载)

编程字体我用 [Monolisa](https://www.monolisa.dev/) -> 怎么薅免费

**执行 `defaults write -g NSWindowShouldDragOnGesture -bool true`，然后就可以按住「⌘+⌃」然后鼠标点击任意地方拖动窗口了。来源 [Moving a macOS window by clicking anywhere on it (like on Linux) · mmazzarolo.com](https://mmazzarolo.com/blog/2022-04-16-drag-window-by-clicking-anywhere-on-macos/)，但是在 MacOS 13 下似乎失效了。**

## 一、Software

### 0.直接用

> 原大佬的笔记里有很多, 选了些我会用的

安装 HomeBrew 并用他安装 App 和 Cli 工具。App 可以在 [homebrew-cask — Homebrew Formulae](https://formulae.brew.sh/cask/) 里找有没有，Cli 工具可以在 [homebrew-core — Homebrew Formulae](https://formulae.brew.sh/formula/) 找有没有。

```
# 先开代理，不然会很慢（依赖第一步）
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

# 安装 HomeBrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# XD 整理过的 cask
brew install --cask \
  shottr \
  licecap \
  gas-mask \
  google-chrome  \
  espanso \
  iterm2 \
  sogouinput \
  telegram \
  thor \
  visual-studio-code \
  postman \
  typora \
  eudic

  wechat \
  iina \
  obs \
  docker \
  qq \
  obsidian \
# XD 安装 Cli 工具，以下是我的（以字母排序，方便你查找）
brew install \
  fd \
  fzf \
  tree \
  lazygit \
  translate-shell

  mkcert \
  ffmpeg \
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
* Eudic (brew[还没试过], App Store)
* Logi Options+ [鼠标滚动方向标准模式, 平滑滚动]
* Ecopaste

> 以下是我选择装的

* Office
* the unarchiver (zip可以系统自动解压, 但是rar不行要下)
* Lemon
* Omi (App Store)
* iina
* Aldente (保护电池)

> 其他

* KeyCastr 屏幕显示你按的键
* LICEcap 录 GIF 动图
* [**VideoFusion**](chatgpt://generic-entity?number=25) 视频剪辑（偏轻量）



### 1.Sublime

> 
>
> 常用命令
>
> - cmd+shift+p
>   - search: install package (安装插件)
>   - Search: key bindings
>
> 常用插件: 
>
> - Insert nums
> - pretty json
> - jsonPath
>
> 常用py:
>
> * json 去转义格式化
> * ~~批量replace后, 批量保存+关闭~~  ==> 这个原生可解决

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
```json
[
	//XXX 这里 MACOS super 代表 Command
	// { "keys": ["super+up"], "command": "select_lines", "args": {"forward": false} },
	// { "keys": ["super+down"], "command": "select_lines", "args": {"forward": true} },
	// { "keys": ["super+alt+down"], "command": "duplicate_line" },
	// { "keys": ["super+e"], "command": "find_under_expand" },
	// { "keys": ["supre+delete"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Line.sublime-macro"} },
	// { "keys": ["super+shift+l"], "command": "toggle_side_bar" },
	// { "keys": ["alt+up"], "command": "swap_line_up" },
	// { "keys": ["alt+down"], "command": "swap_line_down" },
	// { "keys": ["super+1"], "command": "next_bookmark" },
	// { "keys": ["super+2"], "command": "prev_bookmark" },
	// { "keys": ["super+shift+f11"], "command": "toggle_bookmark" },
	{ "keys": ["shift+f11"], "command": "clear_bookmarks" },
	{ "keys": ["super+plus+q+[+]+;+'"], "command": "increase_font_size" },

	// 这个虽然左边搜不着, 但是和右键的文案一直 command (尝试还真可以)

	// 这两个命令一起, 就是保存全部 + 关闭全部
	{ "keys": ["super+alt+s"], "command": "save_all" },
	{
        "keys": ["super+alt+w"],
        "command": "close_other_tabs"
    },
	//End


	// 20250917 --> Mac new, 保持同idea一致
	{ "keys": ["ctrl+option+shift+down"], "command": "next_modification" },
	{ "keys": ["ctrl+option+shift+up"], "command": "prev_modification" },
	{ "keys": ["super+d"], "command": "duplicate_line" },
	{ "keys": ["ctrl+g"], "command": "find_under_expand" },
	{ "keys": ["super+1"], "command": "toggle_side_bar" },
	{ "keys": ["super+shift+up"], "command": "swap_line_up" },
	{ "keys": ["super+shift++down"], "command": "swap_line_down" },
	{ "keys": ["ctrl+1"], "command": "next_bookmark" },
	{ "keys": ["ctrl+shift+1"], "command": "prev_bookmark" },
	{ "keys": ["ctrl+2"], "command": "prev_bookmark" },
	{ "keys": ["f3"], "command": "toggle_bookmark" },
	{ "keys": ["super+-"], "command": "fold" },
	{ "keys": ["super+="], "command": "unfold" },
	{ "keys": ["super+option+["], "command": "move_to", "args": {"to": "brackets"} },
	{ "keys": ["super+option+]"], "command": "move_to", "args": {"to": "brackets"} },
	{ "keys": ["super+r"], "command": "show_panel", "args": {"panel": "replace", "reverse": false} },
    { "keys": ["super+backspace"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Line.sublime-macro"} }, // 删除行
	{ "keys": ["super+alt+l"], "command": "reindent" },
	// Shift+Enter -> 新起一行（无论光标在行尾还是中间）
	{ "keys": ["shift+enter"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Add Line.sublime-macro"}, "context":
		[
			{ "key": "overlay_has_focus", "operator": "equal", "operand": false },
		]
	},
	// Cmd+[ -> 跳转回上一个位置 (IDEA: Back)
	{ "keys": ["super+["], "command": "jump_back" },
	{ "keys": ["super+alt+left"], "command": "jump_back" },
	// Cmd+] -> 跳转到下一个位置 (IDEA: Forward)
	{ "keys": ["super+]"], "command": "jump_forward" },
	{ "keys": ["super+alt+right"], "command": "jump_forward" },
	{ "keys": ["super+alt+z"], "command": "revert_hunk" },




	// TODO 想到什么 idea 验证一下, 问 GPT
	// ⭐️ 看command key技巧, 控制台 -->   sublime.log_commands(True)

	// plugin start -->
	{"keys": ["super+alt+l"], "command": "pretty_json" },
	{ "keys": ["super+alt+control+l"], "command": "json_unescape" },
	// StatusBarJsonPath package
	{"keys": ["super+alt+shift+c"], "command": "copy_json_path" },
	// <-- plugin end

	

]
```

#### plungin

> Json - 去除转义后格式化

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

见: 提示词 [Z_Prompt.md](../Z_Prompt.md)



> config

```yaml
search_shortcut: off
show_icon: false
```

### 3.Iterm2

iTerm2 和 zsh

先配置 iTerm2，这是[效果图](https://img.alicdn.com/imgextra/i1/O1CN01PPttEm1mCx3bddVjX_!!6000000004919-2-tps-2374-1532.png)。1）Appearance 里，General 的 Theme 选「Minimal」，Pane 里不要「Show per-pane title bar with split panes」，Dimming 里选上第一和第三个，2）Profiles 里，Working Directory 里选「Reuse previous session's directory」。

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

配置 ~/.zshrc，我的配置如下（略做删减）。这里有些 alias 是以 `,` 开头的，因为这样你敲 `,` 然后按「Tab」就可以[看到所有自己定义的命令](https://img.alicdn.com/imgextra/i3/O1CN01XUDvg01ZHRwduLZSo_!!6000000003169-0-tps-1422-194.jpg)了。为啥有些没有加 `,` ？历史原因… 因为其他都用习惯了就不改了。

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



### 3.IINA shortcut key

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

## 二、Shell

* networkquality 【⭐️ 自带测网速】
* ln -s target link 软链 [目标文件] [链接名]
  * 使用场景: py 的.env我想存 iCloud,  项目地址的.env就软链过去

* say hello (macOS 自带了语音功能，可以用`say`命令让 Mac 开口说话)
  * brew update && brew upgrade && brew cleanup ; say mission complete
    ==可以和`&&`或者`;`配合使用来提示你某任务已经完成==
  * ; 是“无脑顺序执行”
    && 是“成功才继续”




* export PATH="/opt/homebrew/bin:$PATH"
  * 其中`:`是个分隔符
  * **临时生效**：直接运行 export PATH="/opt/homebrew/bin:$PATH"。
    想要**永久生效**：将该命令写入你的 Shell 配置文件（如 ~/.zshrc 或 ~/.bash_profile）

* echo $SHELL / echo $PATH



小技巧

- 开了2个chrome窗口 macos如何快捷键切换 (cmd+`)   【现在用的很频繁】
- shell窗口里内容滚动不方便, 我的替代方案用CMD+上下滚动，不用鼠标滚轮
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

**执行 `defaults write -g NSWindowShouldDragOnGesture -bool true`，然后就可以按住「⌘+⌃」然后鼠标点击任意地方拖动窗口了。来源 [Moving a macOS window by clicking anywhere on it (like on Linux) · mmazzarolo.com](https://mmazzarolo.com/blog/2022-04-16-drag-window-by-clicking-anywhere-on-macos/)，但是在 MacOS 13 下似乎失效了。**

#### 2. dock 快速显示隐藏

https://apple.stackexchange.com/questions/33600/how-can-i-make-auto-hide-show-for-the-dock-faster

```sh
defaults write com.apple.dock autohide-time-modifier -int 0; killall Dock
```



## 四、FAQ

### 分辨率问题

> macmini连接一台4k分辨率显示器，在设置中设置显示器的缩放分辨率只会影响UI字体并不会影响真实的4k分辨率是吗

是的，当您连接一台4K分辨率的显示器到Mac mini上时，您可以在系统设置中调整显示器的缩放分辨率。这将影响显示器上的UI元素（如菜单栏、窗口和图标）的大小和清晰度，但不会实际改变显示器的物理分辨率。

Mac mini会输出其默认的分辨率（通常是显示器的原生分辨率），而您在系统设置中进行的缩放只会调整UI元素的大小，以适应更高或更低的分辨率。这意味着物理像素的数量不会改变，只是它们在屏幕上的显示大小会发生变化。

如果您想要实际更改显示器的分辨率，您可以在系统设置中选择显示器的原生分辨率或其他支持的分辨率选项。这将直接影响物理像素的数量，以获得更高的清晰度和细节。注意，更高的分辨率可能需要更强大的图形处理能力，并可能导致图形性能下降。



昨天去了王府井apm苹果店，和工作人员交流了一下，这个不是降分辨率，就是和win10一样只是调大了系统的字体（但是也不是完全一样，win10只是调节了字体，而macos是调节了字体，icon和窗口的大小）。在调节后的屏幕上会显示一个更低的分辨率，那个的意思是说现在的字体大小和更低分辨率的缺省字体一样的，正是这个不好的ui或者说系统提醒的这句话让大家有了误解。建议苹果可以在新版本中修改这句让人误解的话。

作者：Peterwen
链接：https://www.zhihu.com/question/443961913/answer/1726069699
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### 实现盒盖多久后自动关机, 而不是一直睡眠耗电

做不到

### 允许 “任何来源” 下载的 App 运行

1. 先尝试打开后, 看隐私有没有打开提示

2. 再尝试 -> 

打开 “终端” 执行如下命令（根据提示输入您的密码即可）：

```
sudo spctl --master-disable
```

XD: 此时隐私安全性里就多了一项: `任何来源`

### 设置软件键位 (Typora 举例)

⭐️ **增加系统快捷键** - 键盘设置里 - App快捷键 - 表情与符号（xd 这个菜单名一定要填对，其实看一下每个应用的task bar应该都能设置！！！）

* 在官网这里[键位映射表](https://support.typora.io/Shortcut-Keys/#change-shortcut-keys) 搜名字（应该也可打开软件直接看菜单栏！），要对应起来，Mac 设置到 App 快捷键

<img src="http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/image-20231215180744304.png" alt="image-20231215180744304" style="zoom: 25%;" />

### 为什么Vue项目总是在1024端口启动？

我猜你是Mac 用户～

在mac os中，非root用户是无法使用小于1024的常用端口的。
如果小于1024端口，会从1024开始。
