---
article: false
---
# MacOS

# Latest



> ➜  ~ echo $SHELL
> /bin/zsh





> export PATH="/opt/homebrew/bin:$PATH"

* export：将一个环境变量设置为全局变量，使它对当前终端会话和子进程可用。
* PATH：一个系统环境变量，用来存储可执行程序的搜索路径。当你在终端输入命令时，系统会按顺序在 PATH 中定义的目录里查找对应的可执行文件。
* /opt/homebrew/bin：这是 Homebrew 在 Apple Silicon（M1/M2 等）设备上的默认安装路径。
* **:$PATH：将现有的 PATH 变量值追加到新路径的后面，避免覆盖原有的搜索路径。**



echo $PATH  
验证



**临时生效**：直接运行 export PATH="/opt/homebrew/bin:$PATH"。

**永久生效**：将该命令写入你的 Shell 配置文件（如 ~/.zshrc 或 ~/.bash_profile）。



## Setting

> 允许 “任何来源” 下载的 App 运行

打开 “终端” 执行如下命令（根据提示输入您的密码即可）：

```
sudo spctl --master-disable
```

XD: 此时隐私安全性里就多了一项: `任何来源`



## Software

> 解压工具, 像zip可以系统自动解压但是rar不行要下

the unarchiver







> Sublime

Setting

```
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
}
```



Keybinddings

```
[
	//XXX 这里 MACOS super 代表 Command
	{ "keys": ["super+up"], "command": "select_lines", "args": {"forward": false} },
	{ "keys": ["super+down"], "command": "select_lines", "args": {"forward": true} },
	{ "keys": ["super+alt+down"], "command": "duplicate_line" },
	{ "keys": ["super+e"], "command": "find_under_expand" },
	{ "keys": ["supre+delete"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Line.sublime-macro"} },
	{ "keys": ["super+shift+l"], "command": "toggle_side_bar" },
	{ "keys": ["alt+up"], "command": "swap_line_up" },
	{ "keys": ["alt+down"], "command": "swap_line_down" },
	{ "keys": ["super+1"], "command": "next_bookmark" },
	{ "keys": ["super+2"], "command": "prev_bookmark" },
	{ "keys": ["super+shift+f11"], "command": "toggle_bookmark" },
	{ "keys": ["shift+f11"], "command": "clear_bookmarks" },
	{ "keys": ["super+-"], "command": "fold" },
	{ "keys": ["super+="], "command": "unfold" },
	{ "keys": ["super+["], "command": "move_to", "args": {"to": "brackets"} },
	{ "keys": ["super+]"], "command": "move_to", "args": {"to": "brackets"} },
	{ "keys": ["super+alt+l"], "command": "reindent" },
	//TODO Git下载。 这个快捷键虽然左边搜不到，但是确实有用！！！其它上方工具栏应该同理！
	{ "keys": ["super+shift+w"], "command": "close_other_tabs" },
	{ "keys": ["super+alt+shift+w"], "command": "close_other_windows" },
	//End

	{ "keys": ["super+r"], "command": "show_panel", "args": {"panel": "replace", "reverse": false} },

	// Mac new, 保持同idea一致
	{ "keys": ["ctrl+option+shift+down"], "command": "next_modification" },
	{ "keys": ["ctrl+option+shift+up"], "command": "prev_modification" },
	{ "keys": ["super+d"], "command": "duplicate_line" },
]
```





***

# Before

> 由于第一次接触MacOS，花了三周的星期六（三天）来搭这台MacOS
>

## Software

> Apr. 12th 2024

* ~~Karabiner (win autohotkey的键位映射)~~
* ~~Alfred (Lib & Everything)~~【感觉自带的够用】
  * in 关键词（可以搜文件里面的内容！）
* ~~Stats~~ 
* **Clash**
* ~~Easydict（Eudic 替代）~~
* IINA
* Omi
* Lunar（两台电脑连一台显示器软件方式切信号源通过 CLI）
* iShot
* 腾讯会议
* Dash
* Espanso
* Chrome
* iTerm2
* Karabiner
* Office
* Parallels
* QuickShade
* ~~Paste~~ (ecopaste 免费)
* SoundSource
* Sublime
* Lemon
* Thor
* Tiles + WGestures
* Postman Navicat IDEA PS Sourcetree TinyRDM





补充：

* Typora

  * 注意：在官网这里[键位映射表](https://support.typora.io/Shortcut-Keys/#change-shortcut-keys) 搜名字（应该也可打开软件直接看菜单栏！），要对应起来，Mac 设置到 App 快捷键

  <img src="http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/image-20231215180744304.png" alt="image-20231215180744304" style="zoom: 25%;" />

* ~~SourceTree~~

  * Q：M 系列芯片好多软件还不支持，TortoiseSVN、SQLServer这种。。头疼了很久
    后补充：

    * 其实用 Shell 挺好用的
    * 而且其实 idea 自带的就很好
    * 后又发现 SourceTree 很好用，管理自己的 Git 蛮好

    XD: 240330, 发现一个不错的软件 看的从 0 到 Thor 图发现的，  SourceTree
    **注意 - sourceTree push 的时候如无法 auth 明明密码账号正确！解决 - 设置换 git 内核用 mac 本地的！！！**
  
  ==解决：直接用 vscode 就好！！！==



## ShortKey

> 官方快捷键: https://support.apple.com/zh-cn/102650

FInder

* 复制文件夹路径: 选中文件 opt+cmd+c
* cmd+opt+drag = ln - i 创建文件的快捷方式
* cmd+shift+h 用户目录
* command＋shift＋G 访达跳转路径，同 win 上面那个里
* cmd+shift+. 显示隐藏文件



* cmd+ctrl+f 全屏
* cmd+opt+v 剪切
* ⭐️ Command-I	显示简介
  * 我推测 "I" 可能代表 "Info"，因为 "Info" 是「信息」的简写。因此，Command-I 可以被理解为「显示简介」或「显示信息」
* Shift+【 可以输出 「



## Tips

* terminal -> networkquality 【自带测网速】



* ⭐️ **增加系统快捷键** - 键盘设置里 - App快捷键 - 表情与符号（xd 这个菜单名一定要填对，其实看一下每个应用的task bar应该都能设置！！！）
  
* MAC click dock APP icon 会切桌面同应用不同 window
  
* 😭 TODO 软链？
  ln -s 表示软链，    XD：删掉本来目录的 base.yml ，把自己目录做好的 base.yml 软链到本来目录！

* 对某段文字 Click Double 会自动选取系统认为的词组      Click Three Times 就会 check 这一整行

* 不显示隐藏文件
  `command+shift+.` 可以临时切换显示隐藏文件。

  使用以下方法永久设置（似乎对浏览器出发的文件选择器未生效）

  ```shell
  defaults write com.apple.finder AppleShowAllFiles -bool true # 显示隐藏文件
  defaults write com.apple.finder AppleShowAllFiles -bool false # 不显示隐藏文件
  killall Finder # 重启 Finder
  ```

* shell windows scroll     我的替代方案：用CMD+上下滚动，不用鼠标滚轮

* Shell 操作历史的搜索， ctrl-r 快捷键

* 开了2个chrome窗口 macos如何快捷键切换 (cmd+`)   【现在用的很频繁】



> macmini连接一台4k分辨率显示器，在设置中设置显示器的缩放分辨率只会影响UI字体并不会影响真实的4k分辨率是吗

是的，当您连接一台4K分辨率的显示器到Mac mini上时，您可以在系统设置中调整显示器的缩放分辨率。这将影响显示器上的UI元素（如菜单栏、窗口和图标）的大小和清晰度，但不会实际改变显示器的物理分辨率。

Mac mini会输出其默认的分辨率（通常是显示器的原生分辨率），而您在系统设置中进行的缩放只会调整UI元素的大小，以适应更高或更低的分辨率。这意味着物理像素的数量不会改变，只是它们在屏幕上的显示大小会发生变化。

如果您想要实际更改显示器的分辨率，您可以在系统设置中选择显示器的原生分辨率或其他支持的分辨率选项。这将直接影响物理像素的数量，以获得更高的清晰度和细节。注意，更高的分辨率可能需要更强大的图形处理能力，并可能导致图形性能下降。



昨天去了王府井apm苹果店，和工作人员交流了一下，这个不是降分辨率，就是和win10一样只是调大了系统的字体（但是也不是完全一样，win10只是调节了字体，而macos是调节了字体，icon和窗口的大小）。在调节后的屏幕上会显示一个更低的分辨率，那个的意思是说现在的字体大小和更低分辨率的缺省字体一样的，正是这个不好的ui或者说系统提醒的这句话让大家有了误解。建议苹果可以在新版本中修改这句让人误解的话。

作者：Peterwen
链接：https://www.zhihu.com/question/443961913/answer/1726069699
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



> Q：MySQL 服务自启动

`sudo vim /Library/LaunchDaemons/com.mysql.startup.plist` 【没成功，不知道是否该转战brew】

* 启动时间：LaunchAgents 目录中的 Launch Agents 是在用户登录时自动启动的，而 LaunchDaemons 目录中的 Launch Daemons 是在系统启动时自动启动的，不依赖于用户登录。
* 运行权限：LaunchAgents 目录中的 Launch Agents 是以当前登录用户的身份运行的，仅对该用户有效。而 LaunchDaemons 目录中的 Launch Daemons 是以系统的管理员权限（root 用户）运行的，并对所有用户有效。【所以在 LaunchDaemons 权限必须是 Root 否则无法启动！！！`chown root:wheel jetbrains.vmoptions.plist`】
* ==这个文件目录类似 Windows 的startup==
* 目的：从官方网站下载的 MySQL 版本，并希望将其设置为 macOS 的自启动服务
* 像MySQL这种服务得放LaunchDaemons里，像激活idea这种得放 LaunchAgents 里。。。注意权限是否够（然后我说得 lemon 软件看是否启动！！！设置里看不到）



> 为什么Vue项目总是在1024端口启动？

我猜你是Mac 用户～

在mac os中，非root用户是无法使用小于1024的常用端口的。
如果小于1024端口，会从1024开始。

* 

## Mac Knowledge

* 续航：公司 MacAir M2 五一假期拔掉充电线   盒盖待机放假回来看还有 50%+ 的电量



* 关闭 SIP

  * 针对 M 系列芯片，长按开机键进入到恢复模式，Terminal `csrutil disable`

* 好像网上下的 app 打不开的话可以执行一个命令就可以打开了

  您提供的命令 `sudo xattr -d com.apple.quarantine /Applications/Tiny\ RDM.app` 用于删除 `/Applications/Tiny RDM.app` 应用程序的扩展属性中的 com.apple.quarantine 标记。这个标记通常由 macOS 用于标识从互联网或其他不可信来源下载的应用程序，以便在首次运行时显示安全警告。

  通过运行该命令，您可以移除 Tiny RDM 应用程序的下载标记，以便在下次运行时不再显示安全警告。请确保您已经正确指定应用程序的路径，并在终端中以管理员权限（sudo）运行该命令。

  请注意，在执行此命令之前，您应该确认已经从可信的来源下载了 Tiny RDM 应用程序，并且信任该应用程序。如果您不确定应用程序的来源或是否应该删除下载标记，请谨慎操作或咨询相关的安全建议。



## Other

#### SQLServer

> 使用Docker 运行 mcr.microsoft.com/azure-sql-edge 来使用

Docker: 必须复杂密码

```shell
docker run -e "ACCEPT_EULA=1" -e "MSSQL_SA_PASSWORD=Aa59964360" -e "MSSQL_PID=Developer" -e "MSSQL_USER=SA" -p 1433:1433 \
-v /Users/xd/Documents/SoftwareConfiguration/Docker/SQL:/SQL --name SQLServer -d mcr.microsoft.com/azure-sql-edge
```

SQLServer: 可以先运行第一行确定好路径 /var/opt/mssql/data/ 及其 scm7 名字

```sql
RESTORE DATABASE [ZS_SCM] FROM DISK='/home/ZC_SCM0426002.BAK'
 WITH MOVE 'scm7' TO '/var/opt/mssql/data/ZS_SCM.mdf', MOVE 'scm7_log' TO '/var/opt/mssql/data/ZS_SCM_log.ldf';
```









***

# 

# 



# ---------

#  



# 如何从 0 开始配置 MacBook Pro

> [ChenCheng's Personal Site](https://www.sorrycc.com/)



> 昨天新的 MBP 终于到了，要从 0 开始配置成趁手的还是需要一些时间的，我总共花了 4 小时左右。在此记录下，希望对大家有所帮助，这可以算是「装了啥」的详细版。如果我基于这篇文章再来一遍，应该可以减少到 2 小时以下。但是，应该不会再来一次了，自己的电脑走 TimeMachine 就好了。

## 安装 ClashX，你懂的

略。

## 安装 App 和 Cli 工具

1、安装 HomeBrew 并用他安装 App 和 Cli 工具。App 可以在 [homebrew-cask — Homebrew Formulae](https://formulae.brew.sh/cask/) 里找有没有，Cli 工具可以在 [homebrew-core — Homebrew Formulae](https://formulae.brew.sh/formula/) 找有没有。

```
# 先开代理，不然会很慢（依赖第一步）
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

# 安装 HomeBrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 用 HomeBrew 安装 App，以下是我可以用 HomeBrew 安装的 App 列表（以字母排序，方便你查找）
brew install --cask \
  115browser \
  1password \
  alfred \
  battery-buddy \
  coteditor \
  docker \  
  eagle \  
  espanso \  
  figma \  
  google-chrome  \  
  gas-mask \  
  handbrake \  
  iina \  
  iterm2 \  
  karabiner-elements \  
  keepingyouawake \  
  keycastr \  
  licecap \  
  microsoft-remote-desktop \  
  obs \  
  obsidian \  
  qq \
  setapp \  
  shottr \  
  sogouinput \  
  sourcetree \  
  telegram \  
  thor \  
  usr-sse2-rdm \  
  videofusion \  
  visual-studio-code \  
  wechat \
  webstorm \  
  zerotier-one

# 安装 Cli 工具，以下是我的（以字母排序，方便你查找）
brew install \  
  autojump \  
  bat \  
  cmatrix \  
  commitzen \  
  deno \  
  diff-so-fancy \  
  fd \  
  ffmpeg \  
  fzf \  
  gh \  
  git \  
  httpie \  
  hub \  
  hyperfine \  
  imagemagick \  
  jq \  
  lazygit \  
  mkcert \  
  nvm \  
  pnpm \  
  the_silver_searcher \  
  tig \  
  tldr \  
  tree \  
  ugit \  
  wget
```

2、用 SetApp 安装额外 App。

- Bartender
- CleanMyMac X
- CleanShot X
- DevUtils
- Downie
- Focus
- Sip
- RapidAPI
- Paste
- Yoink

3、用 Mac App Store 安装额外 App。

- Bob
- Tot
- RunCat
- Infuse

4、通过其他渠道安装额外 App。

- [Flomo x Pake](https://github.com/tw93/Pake)
- [Flux](https://justgetflux.com/)
- Reeder（国区没有）
- PDF Expert
- [uPic](https://github.com/gee1k/uPic)
- [ChatGPT x Tauri](https://github.com/lencx/ChatGPT)
- 阿里钉

## 准备本地目录

我在 ~/Documents 下建了两个目录（新电脑还没施工完成，这里还会补充更多目录），Code 和 SoftwareConfiguration，[长这样](https://img.alicdn.com/imgextra/i2/O1CN01s0ARb525kp39GuaWu_!!6000000007565-2-tps-480-562.png)。Code 用于存代码；SoftwareConfiguration 用于保存各种软件配置，我把 Alfred、Eagle 和 Espanso 的配置放在这里。

## 配置 App

> 按这个顺序会比较好。

1、Karabiner-Elements

参考 [Karabiner-Element 配置 F19 键 - HackMD](https://hackmd.io/@UXqYDTxCTie91Shvsppqyw/rk4u9i-pG?type=view) 。在 [Karabiner-Elements complex_modifications rules](https://pqrs.org/osx/karabiner/complex_modifications/) 搜「Change caps_lock key」，import 后只保留一条和 F19 相关的，然后在命令行里编辑「~/.config/karabiner/karabiner.json」，把刚才那条规则的「caps_lock」换成「right_command」（两处）。这样你就把基本不会用到的「右⌘」废物利用变成了「F19」键，然后你的快捷键组合会多很多。

如果你仔细看配置，会发现「F19」是由四个键「⌘⇧⌃⌥」组成的，在一些 App 的快捷键配置里你会看到四个键，不要奇怪，这也是他。

2、Alfred

做几个配置。1）开启 Powerpack，2）修改快捷键为刚才配的「F19」，3）把老电脑的 Alfred 配置复制到 ~/Documents/SoftwareConfiguration/Alfred 下，然后在「Advanced」里修改配置目录指向他，你的 Workflow 就全回来了，4）「Features > Web Bookmarks」里记得把「Google Chrome Bookmarks」选上，这样就可以用 Alfred 模糊搜 Chrome 书签，用于快速打开网站。

3、iTerm2 和 zsh

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

5、额外的命令行工具：Bun 和 Projj

安装 Bun。我主要是用他的 run 命令，极快，上面也有别名 `br`，比如执行比如 `br dev` 即 `npm run dev`。

```
curl -fsSL https://bun.sh/install | bash
```

安装 PROJJ，我用他来管理 Code 下的仓库，按「domain/group/repo」这样组织，找起来会比较容易。

```
pnpm i projj projj-hooks -g
projj init
```

然后编辑 ~/.projj/config.json，我的配置如下（记得把 name 和邮箱改成自己的）。

```
{
  "base": [
    "/Users/%YOUR_USERNAME%/Documents/Code"
  ],
  "hooks": {
    "postadd": "projj_git_config_user"
  },
  "postadd": {
    "github.com": {
      "name": "sorrycc",
      "email": "sorrycc@gmail.com"
    }
  },
  "alias": {
    "github://": "https://github.com/"
  }
}
```

然后就可以愉快地用 PROJJ 添加项目了，比如。

```
projj add git@github.com:umijs/umi.git
```

6、Espanso

我在 ~/Documents/SoftwareConfiguration/Espanso 下建了个 base.yml，内容如下（已删除个人敏感信息），并软链到 Espanso 原来的配置文件夹里。

```
matches:
  # misc
  - trigger: ";>>"
    replace: ➡
  - trigger: ";vv"
    replace: ⬇
  - trigger: ";^^"
    replace: ⬆
  - trigger: ";<<"
    replace: ⬅
  # life
  - trigger: ";mobi"
    replace: 我的手机号
  - trigger: ";mail"
    replace: 我的邮箱
  - trigger: ";addr"
    replace: 我的家庭住址
  - trigger: ";officeAddr"
    replace: 公司地址
  # faq
  - trigger: ";chongt"
    replace: 冲突了，merge 下 master。
  # code
  - trigger: ";log"
    replace: console.log($|$)
  - trigger: ";delay"
    replace: const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  # mac symbols
  - trigger: ":cmd"
    replace: "⌘"
  - trigger: ":shift"
    replace: "⇧"
  - trigger: ":ctrl"
    replace: "⌃"
  - trigger: ":alt"
    replace: "⌥"
  - trigger: ":opt"
    replace: "⌥"
  - trigger: ":left"
    replace: "←"
  - trigger: ":right"
    replace: "→"
  - trigger: ":up"
    replace: "↑"
  - trigger: ":down"
    replace: "↓"
  - trigger: ":caps_lock"
    replace: "⇪"
  - trigger: ":esc"
    replace: "⎋"
  - trigger: ":eject"
    replace: "⏏"
  - trigger: ":return"
    replace: "↵"
  - trigger: ":enter"
    replace: "⌅"
  - trigger: ":tab"
    replace: "⇥"
  - trigger: ":backtab"
    replace: "⇤"
  - trigger: ":pgup"
    replace: "⇞"
  - trigger: ":pgdown"
    replace: "⇟"
  - trigger: ":home"
    replace: "↖"
  - trigger: ":end"
    replace: "↘"
  - trigger: ":space"
    replace: "␣"
  - trigger: ":del"
    replace: "⌫"
  - trigger: ":fdel"
    replace: "⌦"  
```

7、Thor

让你可以一键启动、显示或隐藏某个 App，对我来说是效率神器。但有时太快也不好，会让你无意间地快速切过去，比如钉钉、Reeder 和 Telegram 我后来就把他们去掉了。

我的配置见[图](https://img.alicdn.com/imgextra/i3/O1CN01PWmDZN24797TUfPbL_!!6000000007343-0-tps-594-1918.jpg)，快捷键供参考。

8、安装字体

编程字体我用 [Monolisa](https://www.monolisa.dev/)，之前还用过 [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)、[Dank Mono](https://dank.sh/) 和 [Operator Mono](https://www.typography.com/fonts/operator/overview)。此外我还安装了[霞鹜文楷](https://github.com/lxgw/LxgwWenKai)和阿里普惠体，霞鹜文楷我用在了语雀等文档站和 Obsidian 里。

9、WebStorm

简单几步配置即可。1）安装 Github Copilot 和 Inspection Lens 插件，2）配置 Color Schema 为「Intellij Light」，3）配置 Font 为 MonoLisa，同时 Size 为 20，大点对眼睛好，哈哈。

10、VSCode

辅助编辑器，施工中。

目前包含的插件如下。

```
dbaeumer.vscode-eslint
esbenp.prettier-vscode
GitHub.copilot
isudox.vscode-jetbrains-keybindings
kettanaito.nako
styled-components.vscode-styled-components
unifiedjs.vscode-mdx
usernamehw.errorlens
```

主题是 [Nako - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=kettanaito.nako)。

配置如下。

```
。
```

11、Git

先配 name 和 email。

```
git config --global user.name "Your Name"
git config --global user.email "you@your-domain.com"
```

再执行这两条命令。

```
git config --global --add push.default current
git config --global --add push.autoSetupRemote true
```

你会收获两个好处。1）不需要「git push origin xxx」，只要「git push」，2）再也不会遇到「no upstream branch」的报错，也不需要「git push --set-upstream origin test && git push」。因为我们执行 git push 的大部分场景都是 push 到同名的 remote branch。来源是 [Auto setup remote branch and never again see an error about the missing upstream | pawelgrzybek.com](https://pawelgrzybek.com/auto-setup-remote-branch-and-never-again-see-an-error-about-the-missing-upstream/)。

再修改 ~/.gitignore_global，加入和你 IDE 相关的 ignore 配置。我会把 .idea 加进去，这是和你相关的专有配置，如果给其他用 VSCode 的作者的项目提交时，都加上 .idea 的 .gitignore 配置，其实并不太礼貌。反之，VSCode 或其他编辑器工具的用户也要加上自己的。

```
*~
.DS_Store
.idea
```

12、NVM 和 Node

```
nvm install 18
node -v
```

13、Eagle

Eagle 的库我保存在 ~/Documents/SoftwareConfiguration/Eagle 下。

14、Focus

要稍微做下配置。1）添加 Block App，我加了钉钉、Reeder，2）Block Website 里我把内置的全删了，留了[这些](https://img.alicdn.com/imgextra/i3/O1CN017Pt2Y827DxrmBSPh4_!!6000000007764-2-tps-1448-1408.png)，3）Block App 的配置要选「强制退出」，「隐藏」的模式在 Mac 13.2 下有问题，不会生效或者表现奇怪。

15、Bob。

我的快捷键是「F19+A」划词翻译，「F19+S」截图翻译。插件装了 [bob-plugin-deeplx](https://github.com/clubxdev/bob-plugin-deeplx) 和 [bobplugin-google-translate](https://github.com/roojay520/bobplugin-google-translate)。文本翻译我加了 Deepl X、有道、阿里、金山词霸，文本识别我用腾讯 OCR。

16、Rectangle。

删了所有快捷键，只保留两个。「F19+C」居中，「F19+M」放最大。

17、uPic

用了自定义图床，略。

18、Paste

我的快捷键是「⌘⌥C」。配置里选上「Always paste as Plain Text」，去掉「Enable sound effects」。

19、Reeder

两个改动。在 Shortcuts 配置里，把「Mark All as Read…」的快捷键改成「⇧A」，然后去掉「Ask before marking all as read」。

20、Google Chrome

登录 Google 账号后所有东西就都同步过来了，除了 Tampermonkey 的自定义脚本。但简单 Google 后也找到了办法，我参考 [extract_tampermonkey_script.py · GitHub](https://gist.github.com/derjanb/9f6c10168e63c3dc3cf0) 把 `/Users/%YOUR_USERNAME%/Library/Application\ Support/Google/Chrome/Default/Local\ Extension\ Settings/dhdgffkkebhmkfjojejmpbldmpobfkfo` 这个文件夹下的内容复制到新电脑后就能用了。

21、Telegram

登录时死活登不上，开了代理才行。

22、Obsidian

我先试了用 Obsidian Sync 直接同步出本地文档库，但发现只包含文档，不包含插件。于是改成先用 git clone 完整仓库，再关联到 Obsidian Sync 的远程文档库。用 Git 做同步时有个要注意的是，.obsidian 目录下的 workspace 相关的 3 个文件不要提交，否则会很容易冲突。

23、SourceTree

配置中「Git」Tab 下选「Use System Git」，否则会报找不到 git 的错误。

24、iA Writer

把所有 Markdown 文件[改成用 iA Writer 打开](https://img.alicdn.com/imgextra/i1/O1CN01YZ2Osn1qtmYrCS9tw_!!6000000005554-2-tps-502-752.png)，因为 iA Writer 又轻又好看。然后我在「系统设置 > Keyboard > Keyboard Shortcuts > App Shortcuts」中增加了一些针对 IA Writer 的快捷键配置。

- Show Preview「⌘P」
- Hide Preview「⌘P」
- Move Line Up「⌘⇧↑」
- Move Line Down「⌘⇧↓」
- Strikethrough「⌘⇧R」

25、Shottr

快捷键里把所有都删了，只保留两个。Area screenshot 用「F19 + 7」，Scrolling screenshot 用「F19 + 8」。

26、Sip

Show Picker 的快捷键是「F19 + 2」。

27、CleanShotX

Capture Area 的快捷键是「F19 + 6」。

## 系统设置

1、General。1）Default Web Browser 用「Google Chrome」，2）Language & Region 里，把 First day of week 改成「Monday」，这样你的日历就会[从周一开始](https://img.alicdn.com/imgextra/i2/O1CN014aouuQ1HfZisiosbo_!!6000000000785-0-tps-2456-1572.jpg)了。

2、Siri。直接禁掉。

3、Trackpad。Scroll direction：Natural 去掉。

4、Keyboard。1）**Keyboard 里把 Key Repeat 调到「Fast」，把 Delay Util Repeat 调到「Short」**，需要一点时间适应，适应后会感受到光标快速移动带来的效率提升，2）Text 里 use `"` for double quotes，use `'` for single quotes，然后把其他都禁掉，不需要系统帮忙改，基本都是帮倒忙的，3）Shortcuts 里，Mission Control 用「⌥A」,Application windows 用「⌥S」，Show Desktop 用「⌥D」，Input Sources 的 Select Previous 用 「⌘Space」，Screenshots 里 Save picture of selected area as a file 用「F19 + 3」，Copy picture of selected area to the clipboard 用「F19 + 4」，4）输入法删除默认的拼音改用搜狗拼音，登录后可以在不同电脑之间同步词库，搜狗输入法的皮肤我用的[Matrix 矩阵](https://github.com/xiaochunjimmy/Sogou-Input-Skin)。

5、Spotlight。只开 Applications、Bookmarks & History、Documents、Folders、System Preferences。

6、Mission Control。把 Hot Corners 里的全部关掉，不需要，因为有 Thor 了，可以更快切除应用。

7、Sharing。只留「AirPlay Receiver」即可，同时可以改下 computer name。

8、Security & Privacy。把「Use Apple Watch to unlock」打开。

9、Notification。不必要的全关掉，我只开了 Calendar、Find By、Reminders 和 Wallet。

10、Touch ID and Password。开启用 Apple Watch 解锁。

11、**执行 `defaults write -g NSWindowShouldDragOnGesture -bool true`，然后就可以按住「⌘+⌃」然后鼠标点击任意地方拖动窗口了。来源 [Moving a macOS window by clicking anywhere on it (like on Linux) · mmazzarolo.com](https://mmazzarolo.com/blog/2022-04-16-drag-window-by-clicking-anywhere-on-macos/)，但是在 MacOS 13 下似乎失效了。**

## 参考

- [Mac Setup for Web Development 2023](https://www.robinwieruch.de/mac-setup-web-development/)
- [My 2021 New Mac Setup](https://www.swyx.io/new-mac-setup-2021)

ChenCheng