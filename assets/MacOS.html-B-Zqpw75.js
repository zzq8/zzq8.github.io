import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as t,o as r,c as o,e,f as i,b as s,a as l}from"./app-C0tEYOd3.js";const d={},c=l('<h1 id="macos" tabindex="-1"><a class="header-anchor" href="#macos"><span>MacOS</span></a></h1><blockquote><p>由于第一次接触MacOS，花了三周的星期六（三天）来搭这台MacOS</p></blockquote><h2 id="software" tabindex="-1"><a class="header-anchor" href="#software"><span>Software</span></a></h2><blockquote><p>Apr. 12th 2024</p></blockquote><ul><li>Karabiner (win autohotkey)</li><li>Alfred (Lib &amp; Everything) <ul><li>in 关键词（可以搜文件里面的内容！）</li></ul></li><li>Stats</li><li>Clash</li><li>Easydict</li><li>IINA</li><li>Omi</li><li>Lunar（两台电脑连一台显示器软件方式切信号源通过 CLI）</li><li>iShot</li><li>腾讯会议</li><li>Dash</li><li>Espanso</li><li>Chrome</li><li>iTerm</li><li>Karabiner</li><li>Office</li><li>Parallels</li><li>QuickShade</li><li>Paste</li><li>SoundSource</li><li>Sublime</li><li>Lemon</li><li>Thor</li><li>Tiles + WGestures</li><li>Postman Navicat IDEA PS Sourcetree TinyRDM</li></ul><p>补充：</p>',6),u=e("p",null,"Typora",-1),p={href:"https://support.typora.io/Shortcut-Keys/#change-shortcut-keys",target:"_blank",rel:"noopener noreferrer"},m=e("img",{src:"http://images.zzq8.cn/img/image-20231215180744304.png",alt:"image-20231215180744304",style:{zoom:"25%"}},null,-1),v=e("li",null,[e("p",null,"SourceTree"),e("ul",null,[e("li",null,[e("p",null,"Q：M 系列芯片好多软件还不支持，TortoiseSVN、SQLServer这种。。头疼了很久 后补充："),e("ul",null,[e("li",null,"其实用 Shell 挺好用的"),e("li",null,"而且其实 idea 自带的就很好"),e("li",null,"后又发现 SourceTree 很好用，管理自己的 Git 蛮好")]),e("p",null,[i("XD: 240330, 发现一个不错的软件 看的从 0 到 Thor 图发现的， SourceTree "),e("strong",null,"注意 - sourceTree push 的时候如无法 auth 明明密码账号正确！解决 - 设置换 git 内核用 mac 本地的！！！")])])])],-1),b=l(`<h2 id="shortkey" tabindex="-1"><a class="header-anchor" href="#shortkey"><span>ShortKey</span></a></h2><ul><li>cmd+shift+h 用户目录</li><li>command＋shift＋G 访达跳转路径，同 win 上面那个里</li><li>cmd+shift+. 显示隐藏文件</li><li>cmd+ctrl+f 全屏</li><li>cmd+opt+v 剪切</li><li>⭐️ Command-I 显示简介 <ul><li>我推测 &quot;I&quot; 可能代表 &quot;Info&quot;，因为 &quot;Info&quot; 是「信息」的简写。因此，Command-I 可以被理解为「显示简介」或「显示信息」</li></ul></li><li>Shift+【 可以输出 「</li></ul><h2 id="tips" tabindex="-1"><a class="header-anchor" href="#tips"><span>Tips</span></a></h2><ul><li><p>MAC click dock APP icon 会切桌面同应用不同 window</p></li><li><p>😭 TODO 软链？ ln -s 表示软链， XD：删掉本来目录的 base.yml ，把自己目录做好的 base.yml 软链到本来目录！</p></li><li><p>对某段文字 Click Double 会自动选取系统认为的词组 Click Three Times 就会 check 这一整行</p></li><li><p>不显示隐藏文件 <code>command+shift+.</code> 可以临时切换显示隐藏文件。</p><p>使用以下方法永久设置（似乎对浏览器出发的文件选择器未生效）</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>defaults <span class="token function">write</span> com.apple.finder AppleShowAllFiles <span class="token parameter variable">-bool</span> <span class="token boolean">true</span> <span class="token comment"># 显示隐藏文件</span>
defaults <span class="token function">write</span> com.apple.finder AppleShowAllFiles <span class="token parameter variable">-bool</span> <span class="token boolean">false</span> <span class="token comment"># 不显示隐藏文件</span>
<span class="token function">killall</span> Finder <span class="token comment"># 重启 Finder</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>shell windows scroll 我的替代方案：用CMD+上下滚动，不用鼠标滚轮</p></li><li><p>开了2个chrome窗口 macos如何快捷键切换 (cmd+\`) 【现在用的很频繁】</p></li></ul><blockquote><p>macmini连接一台4k分辨率显示器，在设置中设置显示器的缩放分辨率只会影响UI字体并不会影响真实的4k分辨率是吗</p></blockquote><p>是的，当您连接一台4K分辨率的显示器到Mac mini上时，您可以在系统设置中调整显示器的缩放分辨率。这将影响显示器上的UI元素（如菜单栏、窗口和图标）的大小和清晰度，但不会实际改变显示器的物理分辨率。</p><p>Mac mini会输出其默认的分辨率（通常是显示器的原生分辨率），而您在系统设置中进行的缩放只会调整UI元素的大小，以适应更高或更低的分辨率。这意味着物理像素的数量不会改变，只是它们在屏幕上的显示大小会发生变化。</p><p>如果您想要实际更改显示器的分辨率，您可以在系统设置中选择显示器的原生分辨率或其他支持的分辨率选项。这将直接影响物理像素的数量，以获得更高的清晰度和细节。注意，更高的分辨率可能需要更强大的图形处理能力，并可能导致图形性能下降。</p><p>昨天去了王府井apm苹果店，和工作人员交流了一下，这个不是降分辨率，就是和win10一样只是调大了系统的字体（但是也不是完全一样，win10只是调节了字体，而macos是调节了字体，icon和窗口的大小）。在调节后的屏幕上会显示一个更低的分辨率，那个的意思是说现在的字体大小和更低分辨率的缺省字体一样的，正是这个不好的ui或者说系统提醒的这句话让大家有了误解。建议苹果可以在新版本中修改这句让人误解的话。</p><p>作者：Peterwen 链接：https://www.zhihu.com/question/443961913/answer/1726069699 来源：知乎 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。</p><blockquote><p>Q：MySQL 服务自启动</p></blockquote><p><code>sudo vim /Library/LaunchDaemons/com.mysql.startup.plist</code> 【没成功，不知道是否该转战brew】</p><ul><li>启动时间：LaunchAgents 目录中的 Launch Agents 是在用户登录时自动启动的，而 LaunchDaemons 目录中的 Launch Daemons 是在系统启动时自动启动的，不依赖于用户登录。</li><li>运行权限：LaunchAgents 目录中的 Launch Agents 是以当前登录用户的身份运行的，仅对该用户有效。而 LaunchDaemons 目录中的 Launch Daemons 是以系统的管理员权限（root 用户）运行的，并对所有用户有效。【所以在 LaunchDaemons 权限必须是 Root 否则无法启动！！！<code>chown root:wheel jetbrains.vmoptions.plist</code>】</li><li><mark>这个文件目录类似 Windows 的startup</mark></li><li>目的：从官方网站下载的 MySQL 版本，并希望将其设置为 macOS 的自启动服务</li><li>像MySQL这种服务得放LaunchDaemons里，像激活idea这种得放 LaunchAgents 里。。。注意权限是否够（然后我说得 lemon 软件看是否启动！！！设置里看不到）</li></ul><blockquote><p>为什么Vue项目总是在1024端口启动？</p></blockquote><p>我猜你是Mac 用户～</p><p>在mac os中，非root用户是无法使用小于1024的常用端口的。 如果小于1024端口，会从1024开始。</p><ul><li></li></ul><h2 id="mac-knowledge" tabindex="-1"><a class="header-anchor" href="#mac-knowledge"><span>Mac Knowledge</span></a></h2><ul><li><p>续航：公司 MacAir M2 五一假期拔掉充电线 盒盖待机放假回来看还有 50%+ 的电量</p></li><li><p>关闭 SIP</p><ul><li>针对 M 系列芯片，长按开机键进入到恢复模式，Terminal <code>csrutil disable</code></li></ul></li><li><p>好像网上下的 app 打不开的话可以执行一个命令就可以打开了</p><p>您提供的命令 <code>sudo xattr -d com.apple.quarantine /Applications/Tiny\\ RDM.app</code> 用于删除 <code>/Applications/Tiny RDM.app</code> 应用程序的扩展属性中的 com.apple.quarantine 标记。这个标记通常由 macOS 用于标识从互联网或其他不可信来源下载的应用程序，以便在首次运行时显示安全警告。</p><p>通过运行该命令，您可以移除 Tiny RDM 应用程序的下载标记，以便在下次运行时不再显示安全警告。请确保您已经正确指定应用程序的路径，并在终端中以管理员权限（sudo）运行该命令。</p><p>请注意，在执行此命令之前，您应该确认已经从可信的来源下载了 Tiny RDM 应用程序，并且信任该应用程序。如果您不确定应用程序的来源或是否应该删除下载标记，请谨慎操作或咨询相关的安全建议。</p></li></ul><h2 id="other" tabindex="-1"><a class="header-anchor" href="#other"><span>Other</span></a></h2><h4 id="sqlserver" tabindex="-1"><a class="header-anchor" href="#sqlserver"><span>SQLServer</span></a></h4><blockquote><p>使用Docker 运行 mcr.microsoft.com/azure-sql-edge 来使用</p></blockquote><p>Docker: 必须复杂密码</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-e</span> <span class="token string">&quot;ACCEPT_EULA=1&quot;</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;MSSQL_SA_PASSWORD=Aa59964360&quot;</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;MSSQL_PID=Developer&quot;</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;MSSQL_USER=SA&quot;</span> <span class="token parameter variable">-p</span> <span class="token number">1433</span>:1433 <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /Users/xd/Documents/SoftwareConfiguration/Docker/SQL:/SQL <span class="token parameter variable">--name</span> SQLServer <span class="token parameter variable">-d</span> mcr.microsoft.com/azure-sql-edge
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>SQLServer: 可以先运行第一行确定好路径 /var/opt/mssql/data/ 及其 scm7 名字</p><div class="language-sql line-numbers-mode" data-ext="sql" data-title="sql"><pre class="language-sql"><code><span class="token keyword">RESTORE</span> <span class="token keyword">DATABASE</span> <span class="token punctuation">[</span>ZS_SCM<span class="token punctuation">]</span> <span class="token keyword">FROM</span> <span class="token keyword">DISK</span><span class="token operator">=</span><span class="token string">&#39;/home/ZC_SCM0426002.BAK&#39;</span>
 <span class="token keyword">WITH</span> MOVE <span class="token string">&#39;scm7&#39;</span> <span class="token keyword">TO</span> <span class="token string">&#39;/var/opt/mssql/data/ZS_SCM.mdf&#39;</span><span class="token punctuation">,</span> MOVE <span class="token string">&#39;scm7_log&#39;</span> <span class="token keyword">TO</span> <span class="token string">&#39;/var/opt/mssql/data/ZS_SCM_log.ldf&#39;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h1><h1 id="-1" tabindex="-1"><a class="header-anchor" href="#-1"><span>---------</span></a></h1><h1 id="-2" tabindex="-1"><a class="header-anchor" href="#-2"><span></span></a></h1><h1 id="如何从-0-开始配置-macbook-pro" tabindex="-1"><a class="header-anchor" href="#如何从-0-开始配置-macbook-pro"><span>如何从 0 开始配置 MacBook Pro</span></a></h1>`,31),h={href:"https://www.sorrycc.com/",target:"_blank",rel:"noopener noreferrer"},g=e("blockquote",null,[e("p",null,"昨天新的 MBP 终于到了，要从 0 开始配置成趁手的还是需要一些时间的，我总共花了 4 小时左右。在此记录下，希望对大家有所帮助，这可以算是「装了啥」的详细版。如果我基于这篇文章再来一遍，应该可以减少到 2 小时以下。但是，应该不会再来一次了，自己的电脑走 TimeMachine 就好了。")],-1),q=e("h2",{id:"安装-clashx-你懂的",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#安装-clashx-你懂的"},[e("span",null,"安装 ClashX，你懂的")])],-1),_=e("p",null,"略。",-1),f=e("h2",{id:"安装-app-和-cli-工具",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#安装-app-和-cli-工具"},[e("span",null,"安装 App 和 Cli 工具")])],-1),k={href:"https://formulae.brew.sh/cask/",target:"_blank",rel:"noopener noreferrer"},S={href:"https://formulae.brew.sh/formula/",target:"_blank",rel:"noopener noreferrer"},x=l(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 先开代理，不然会很慢（依赖第一步）
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

# 安装 HomeBrew
/bin/bash -c &quot;$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)&quot;

# 用 HomeBrew 安装 App，以下是我可以用 HomeBrew 安装的 App 列表（以字母排序，方便你查找）
brew install --cask \\
  115browser \\
  1password \\
  alfred \\
  battery-buddy \\
  coteditor \\
  docker \\  
  eagle \\  
  espanso \\  
  figma \\  
  google-chrome  \\  
  gas-mask \\  
  handbrake \\  
  iina \\  
  iterm2 \\  
  karabiner-elements \\  
  keepingyouawake \\  
  keycastr \\  
  licecap \\  
  microsoft-remote-desktop \\  
  obs \\  
  obsidian \\  
  qq \\
  setapp \\  
  shottr \\  
  sogouinput \\  
  sourcetree \\  
  telegram \\  
  thor \\  
  usr-sse2-rdm \\  
  videofusion \\  
  visual-studio-code \\  
  wechat \\
  webstorm \\  
  zerotier-one

# 安装 Cli 工具，以下是我的（以字母排序，方便你查找）
brew install \\  
  autojump \\  
  bat \\  
  cmatrix \\  
  commitzen \\  
  deno \\  
  diff-so-fancy \\  
  fd \\  
  ffmpeg \\  
  fzf \\  
  gh \\  
  git \\  
  httpie \\  
  hub \\  
  hyperfine \\  
  imagemagick \\  
  jq \\  
  lazygit \\  
  mkcert \\  
  nvm \\  
  pnpm \\  
  the_silver_searcher \\  
  tig \\  
  tldr \\  
  tree \\  
  ugit \\  
  wget
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、用 SetApp 安装额外 App。</p><ul><li>Bartender</li><li>CleanMyMac X</li><li>CleanShot X</li><li>DevUtils</li><li>Downie</li><li>Focus</li><li>Sip</li><li>RapidAPI</li><li>Paste</li><li>Yoink</li></ul><p>3、用 Mac App Store 安装额外 App。</p><ul><li>Bob</li><li>Tot</li><li>RunCat</li><li>Infuse</li></ul><p>4、通过其他渠道安装额外 App。</p>`,6),w={href:"https://github.com/tw93/Pake",target:"_blank",rel:"noopener noreferrer"},y={href:"https://justgetflux.com/",target:"_blank",rel:"noopener noreferrer"},A=e("li",null,"Reeder（国区没有）",-1),M=e("li",null,"PDF Expert",-1),C={href:"https://github.com/gee1k/uPic",target:"_blank",rel:"noopener noreferrer"},O={href:"https://github.com/lencx/ChatGPT",target:"_blank",rel:"noopener noreferrer"},T=e("li",null,"阿里钉",-1),D=e("h2",{id:"准备本地目录",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#准备本地目录"},[e("span",null,"准备本地目录")])],-1),P={href:"https://img.alicdn.com/imgextra/i2/O1CN01s0ARb525kp39GuaWu_!!6000000007565-2-tps-480-562.png",target:"_blank",rel:"noopener noreferrer"},E=e("h2",{id:"配置-app",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#配置-app"},[e("span",null,"配置 App")])],-1),z=e("blockquote",null,[e("p",null,"按这个顺序会比较好。")],-1),L=e("p",null,"1、Karabiner-Elements",-1),$={href:"https://hackmd.io/@UXqYDTxCTie91Shvsppqyw/rk4u9i-pG?type=view",target:"_blank",rel:"noopener noreferrer"},j={href:"https://pqrs.org/osx/karabiner/complex_modifications/",target:"_blank",rel:"noopener noreferrer"},R=e("p",null,"如果你仔细看配置，会发现「F19」是由四个键「⌘⇧⌃⌥」组成的，在一些 App 的快捷键配置里你会看到四个键，不要奇怪，这也是他。",-1),N=e("p",null,"2、Alfred",-1),F=e("p",null,"做几个配置。1）开启 Powerpack，2）修改快捷键为刚才配的「F19」，3）把老电脑的 Alfred 配置复制到 ~/Documents/SoftwareConfiguration/Alfred 下，然后在「Advanced」里修改配置目录指向他，你的 Workflow 就全回来了，4）「Features > Web Bookmarks」里记得把「Google Chrome Bookmarks」选上，这样就可以用 Alfred 模糊搜 Chrome 书签，用于快速打开网站。",-1),H=e("p",null,"3、iTerm2 和 zsh",-1),I={href:"https://img.alicdn.com/imgextra/i1/O1CN01PPttEm1mCx3bddVjX_!!6000000004919-2-tps-2374-1532.png",target:"_blank",rel:"noopener noreferrer"},U={href:"https://starship.rs/",target:"_blank",rel:"noopener noreferrer"},W=l(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sh -c &quot;$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)&quot;
omz update
source ~/.zshrc
# starship 是 rust 写的 prompt 工具，极快
brew install starship
echo &#39;eval &quot;$(starship init zsh)&quot;&#39; &gt;&gt; ~/.zshrc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装 zsh 的插件，我个人用到了 zsh-autosuggestions、zsh-completions 和 fast-syntax-highlighting。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>git clone https://github.com/zsh-users/zsh-autosuggestions \${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-completions \${ZSH_CUSTOM:-\${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git \${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),B=e("code",null,",",-1),G=e("code",null,",",-1),K={href:"https://img.alicdn.com/imgextra/i3/O1CN01XUDvg01ZHRwduLZSo_!!6000000003169-0-tps-1422-194.jpg",target:"_blank",rel:"noopener noreferrer"},Z=e("code",null,",",-1),X=l(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># Disable brew auto update
export HOMEBREW_NO_AUTO_UPDATE=1
export ZSH=&quot;$HOME/.oh-my-zsh&quot;

plugins=(
  # 不会 git 插件，因为和我的 alias 设置冲突
  # git
  zsh-completions
  zsh-autosuggestions
  fast-syntax-highlighting
)

# Alias
alias ,ms=&quot;%PATH/TO/MY/SCRIPT%&quot;
alias ,ip=&quot;ipconfig getifaddr en0&quot;
alias ,sshconfig=&quot;vim ~/.ssh/config&quot;
alias ,gitconfig=&quot;vim ~/.gitconfig&quot;
alias b=&quot;,ms branch&quot;
alias umi=&quot;/Users/%MY_USERNAME%/Documents/Code/github.com/umijs/umi/packages/umi/bin/umi.js&quot;
# chore
alias br=&quot;bun run&quot;
alias c=&#39;code .&#39;
alias i=&#39;webstorm .&#39;
alias cdtmp=&#39;cd \`mktemp -d /tmp/sorrycc-XXXXXX\`&#39;
alias pi=&quot;echo &#39;Pinging Baidu&#39; &amp;&amp; ping www.baidu.com&quot;
alias ip=&quot;ipconfig getifaddr en0 &amp;&amp; ipconfig getifaddr en1&quot;
alias cip=&quot;curl cip.cc&quot;
alias qr=&#39;qrcode-terminal&#39;
alias ee=&quot;stree&quot;
alias hosts=&quot;vi /etc/hosts&quot;
## system
alias showFiles=&quot;defaults write com.apple.finder AppleShowAllFiles YES &amp;&amp; killall Finder&quot;
alias hideFiles=&quot;defaults write com.apple.finder AppleShowAllFiles NO &amp;&amp; killall Finder&quot;
# cd
alias ..=&#39;cd ../&#39;
alias ...=&#39;cd ../../&#39;
alias ..l.=&#39;cd ../../ &amp;&amp; ll&#39;
alias ....=&#39;cd ../../../&#39;
alias ~=&quot;cd ~&quot;
alias -- -=&quot;cd -&quot;
alias ll=&#39;ls -alhG&#39;
alias ls=&#39;ls -G&#39;
# git
alias git=hub
alias gp=&quot;git push&quot;
alias gt=&quot;git status -sb&quot;
alias ga=&quot;git add .&quot;
alias gc=&quot;git commit -av&quot;
alias gcr=&quot;git checkout master &amp;&amp; git fetch &amp;&amp; git rebase&quot;
alias gclean=&quot;git reset --hard &amp;&amp; git clean -df&quot;
alias grebase=&quot;git fetch &amp;&amp; git rebase -i&quot;

## timelapse
## ref: https://www.reddit.com/r/mac/comments/wshn4/another_way_to_timelapse_record_your_mac_screen/
function record() {
  cd ~/screencapture/jpg;
  RES_WIDTH=$(/usr/sbin/system_profiler SPDisplaysDataType | grep Resolution);
  RES_WIDTH=(\${RES_WIDTH:22:4});
  RES_WIDTH=$((RES_WIDTH/2));
  while :
  NOW=$(date +&quot;%y%m%d%H%M%S&quot;);
  do screencapture -C -t jpg -x ~/screencapture/jpg/$NOW.jpg;
    sleep 7 &amp; pid=$!
    NOW=$(date +&quot;%y%m%d%H%M%S&quot;);
    wait $pid
  done
}
function movie() {
  NOW=$(date +&quot;%y%m%d%H%M%S&quot;);
  cd ~/screencapture/jpg;
  cnt=0
  rm -rf .DS_Store;
  for file in *
    do
      if [ -f &quot;$file&quot; ] ; then
      ext=\${file##*.}
      printf -v pad &quot;%05d&quot; &quot;$cnt&quot;
      mv &quot;$file&quot; &quot;\${pad}.\${ext}&quot;
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
  osascript 2&gt; /dev/null &lt;&lt;EOF
  tell application &quot;Finder&quot;
    return POSIX path of (target of window 1 as alias)
  end tell
EOF
}
function mcd {
  mkdir $1 &amp;&amp; cd $1;
}
function cdf() {
  cd &quot;$(pfd)&quot;
}
function ,touch {
  mkdir -p &quot;$(dirname &quot;$1&quot;)&quot; &amp;&amp; touch &quot;$1&quot;
}
function ,take() {
  mkdir -p &quot;$(dirname &quot;$1&quot;)&quot; &amp;&amp; touch &quot;$1&quot; &amp;&amp; take &quot;$(dirname &quot;$1&quot;)&quot;
}

# load zsh-completions
autoload -U compinit &amp;&amp; compinit

# use nvm
source /opt/homebrew/opt/nvm/nvm.sh

# autojump
source /opt/homebrew/etc/profile.d/autojump.sh

# use starship theme (needs to be at the end)
eval &quot;$(starship init zsh)&quot;

# 必须在 plugins 之后
source $ZSH/oh-my-zsh.sh

# bun completions
[ -s &quot;/Users/chencheng/.bun/_bun&quot; ] &amp;&amp; source &quot;/Users/chencheng/.bun/_bun&quot;

# bun
export BUN_INSTALL=&quot;$HOME/.bun&quot;
export PATH=&quot;$BUN_INSTALL/bin:$PATH&quot;

# pnpm
export PNPM_HOME=&quot;/Users/chencheng/Library/pnpm&quot;
export PATH=&quot;$PNPM_HOME:$PATH&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、SSH</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>mkdir ~/.ssh
# file name 用 github，passphrase 随意
ssh-keygen -t ed25519 -C &quot;github&quot;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、额外的命令行工具：Bun 和 Projj</p><p>安装 Bun。我主要是用他的 run 命令，极快，上面也有别名 <code>br</code>，比如执行比如 <code>br dev</code> 即 <code>npm run dev</code>。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>curl -fsSL https://bun.sh/install | bash
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>安装 PROJJ，我用他来管理 Code 下的仓库，按「domain/group/repo」这样组织，找起来会比较容易。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>pnpm i projj projj-hooks -g
projj init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后编辑 ~/.projj/config.json，我的配置如下（记得把 name 和邮箱改成自己的）。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>{
  &quot;base&quot;: [
    &quot;/Users/%YOUR_USERNAME%/Documents/Code&quot;
  ],
  &quot;hooks&quot;: {
    &quot;postadd&quot;: &quot;projj_git_config_user&quot;
  },
  &quot;postadd&quot;: {
    &quot;github.com&quot;: {
      &quot;name&quot;: &quot;sorrycc&quot;,
      &quot;email&quot;: &quot;sorrycc@gmail.com&quot;
    }
  },
  &quot;alias&quot;: {
    &quot;github://&quot;: &quot;https://github.com/&quot;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后就可以愉快地用 PROJJ 添加项目了，比如。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>projj add git@github.com:umijs/umi.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>6、Espanso</p><p>我在 ~/Documents/SoftwareConfiguration/Espanso 下建了个 base.yml，内容如下（已删除个人敏感信息），并软链到 Espanso 原来的配置文件夹里。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>matches:
  # misc
  - trigger: &quot;;&gt;&gt;&quot;
    replace: ➡
  - trigger: &quot;;vv&quot;
    replace: ⬇
  - trigger: &quot;;^^&quot;
    replace: ⬆
  - trigger: &quot;;&lt;&lt;&quot;
    replace: ⬅
  # life
  - trigger: &quot;;mobi&quot;
    replace: 我的手机号
  - trigger: &quot;;mail&quot;
    replace: 我的邮箱
  - trigger: &quot;;addr&quot;
    replace: 我的家庭住址
  - trigger: &quot;;officeAddr&quot;
    replace: 公司地址
  # faq
  - trigger: &quot;;chongt&quot;
    replace: 冲突了，merge 下 master。
  # code
  - trigger: &quot;;log&quot;
    replace: console.log($|$)
  - trigger: &quot;;delay&quot;
    replace: const delay = (ms) =&gt; new Promise((res) =&gt; setTimeout(res, ms));
  # mac symbols
  - trigger: &quot;:cmd&quot;
    replace: &quot;⌘&quot;
  - trigger: &quot;:shift&quot;
    replace: &quot;⇧&quot;
  - trigger: &quot;:ctrl&quot;
    replace: &quot;⌃&quot;
  - trigger: &quot;:alt&quot;
    replace: &quot;⌥&quot;
  - trigger: &quot;:opt&quot;
    replace: &quot;⌥&quot;
  - trigger: &quot;:left&quot;
    replace: &quot;←&quot;
  - trigger: &quot;:right&quot;
    replace: &quot;→&quot;
  - trigger: &quot;:up&quot;
    replace: &quot;↑&quot;
  - trigger: &quot;:down&quot;
    replace: &quot;↓&quot;
  - trigger: &quot;:caps_lock&quot;
    replace: &quot;⇪&quot;
  - trigger: &quot;:esc&quot;
    replace: &quot;⎋&quot;
  - trigger: &quot;:eject&quot;
    replace: &quot;⏏&quot;
  - trigger: &quot;:return&quot;
    replace: &quot;↵&quot;
  - trigger: &quot;:enter&quot;
    replace: &quot;⌅&quot;
  - trigger: &quot;:tab&quot;
    replace: &quot;⇥&quot;
  - trigger: &quot;:backtab&quot;
    replace: &quot;⇤&quot;
  - trigger: &quot;:pgup&quot;
    replace: &quot;⇞&quot;
  - trigger: &quot;:pgdown&quot;
    replace: &quot;⇟&quot;
  - trigger: &quot;:home&quot;
    replace: &quot;↖&quot;
  - trigger: &quot;:end&quot;
    replace: &quot;↘&quot;
  - trigger: &quot;:space&quot;
    replace: &quot;␣&quot;
  - trigger: &quot;:del&quot;
    replace: &quot;⌫&quot;
  - trigger: &quot;:fdel&quot;
    replace: &quot;⌦&quot;  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>7、Thor</p><p>让你可以一键启动、显示或隐藏某个 App，对我来说是效率神器。但有时太快也不好，会让你无意间地快速切过去，比如钉钉、Reeder 和 Telegram 我后来就把他们去掉了。</p>`,17),Q={href:"https://img.alicdn.com/imgextra/i3/O1CN01PWmDZN24797TUfPbL_!!6000000007343-0-tps-594-1918.jpg",target:"_blank",rel:"noopener noreferrer"},V=e("p",null,"8、安装字体",-1),Y={href:"https://www.monolisa.dev/",target:"_blank",rel:"noopener noreferrer"},J={href:"https://github.com/adobe-fonts/source-code-pro",target:"_blank",rel:"noopener noreferrer"},ee={href:"https://dank.sh/",target:"_blank",rel:"noopener noreferrer"},ie={href:"https://www.typography.com/fonts/operator/overview",target:"_blank",rel:"noopener noreferrer"},ne={href:"https://github.com/lxgw/LxgwWenKai",target:"_blank",rel:"noopener noreferrer"},se=l(`<p>9、WebStorm</p><p>简单几步配置即可。1）安装 Github Copilot 和 Inspection Lens 插件，2）配置 Color Schema 为「Intellij Light」，3）配置 Font 为 MonoLisa，同时 Size 为 20，大点对眼睛好，哈哈。</p><p>10、VSCode</p><p>辅助编辑器，施工中。</p><p>目前包含的插件如下。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>dbaeumer.vscode-eslint
esbenp.prettier-vscode
GitHub.copilot
isudox.vscode-jetbrains-keybindings
kettanaito.nako
styled-components.vscode-styled-components
unifiedjs.vscode-mdx
usernamehw.errorlens
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),le={href:"https://marketplace.visualstudio.com/items?itemName=kettanaito.nako",target:"_blank",rel:"noopener noreferrer"},ae=l(`<p>配置如下。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>11、Git</p><p>先配 name 和 email。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>git config --global user.name &quot;Your Name&quot;
git config --global user.email &quot;you@your-domain.com&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>再执行这两条命令。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>git config --global --add push.default current
git config --global --add push.autoSetupRemote true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,7),te={href:"https://pawelgrzybek.com/auto-setup-remote-branch-and-never-again-see-an-error-about-the-missing-upstream/",target:"_blank",rel:"noopener noreferrer"},re=l(`<p>再修改 ~/.gitignore_global，加入和你 IDE 相关的 ignore 配置。我会把 .idea 加进去，这是和你相关的专有配置，如果给其他用 VSCode 的作者的项目提交时，都加上 .idea 的 .gitignore 配置，其实并不太礼貌。反之，VSCode 或其他编辑器工具的用户也要加上自己的。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>*~
.DS_Store
.idea
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>12、NVM 和 Node</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>nvm install 18
node -v
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>13、Eagle</p><p>Eagle 的库我保存在 ~/Documents/SoftwareConfiguration/Eagle 下。</p><p>14、Focus</p>`,7),oe={href:"https://img.alicdn.com/imgextra/i3/O1CN017Pt2Y827DxrmBSPh4_!!6000000007764-2-tps-1448-1408.png",target:"_blank",rel:"noopener noreferrer"},de=e("p",null,"15、Bob。",-1),ce={href:"https://github.com/clubxdev/bob-plugin-deeplx",target:"_blank",rel:"noopener noreferrer"},ue={href:"https://github.com/roojay520/bobplugin-google-translate",target:"_blank",rel:"noopener noreferrer"},pe=e("p",null,"16、Rectangle。",-1),me=e("p",null,"删了所有快捷键，只保留两个。「F19+C」居中，「F19+M」放最大。",-1),ve=e("p",null,"17、uPic",-1),be=e("p",null,"用了自定义图床，略。",-1),he=e("p",null,"18、Paste",-1),ge=e("p",null,"我的快捷键是「⌘⌥C」。配置里选上「Always paste as Plain Text」，去掉「Enable sound effects」。",-1),qe=e("p",null,"19、Reeder",-1),_e=e("p",null,"两个改动。在 Shortcuts 配置里，把「Mark All as Read…」的快捷键改成「⇧A」，然后去掉「Ask before marking all as read」。",-1),fe=e("p",null,"20、Google Chrome",-1),ke={href:"https://gist.github.com/derjanb/9f6c10168e63c3dc3cf0",target:"_blank",rel:"noopener noreferrer"},Se=e("code",null,"/Users/%YOUR_USERNAME%/Library/Application\\ Support/Google/Chrome/Default/Local\\ Extension\\ Settings/dhdgffkkebhmkfjojejmpbldmpobfkfo",-1),xe=e("p",null,"21、Telegram",-1),we=e("p",null,"登录时死活登不上，开了代理才行。",-1),ye=e("p",null,"22、Obsidian",-1),Ae=e("p",null,"我先试了用 Obsidian Sync 直接同步出本地文档库，但发现只包含文档，不包含插件。于是改成先用 git clone 完整仓库，再关联到 Obsidian Sync 的远程文档库。用 Git 做同步时有个要注意的是，.obsidian 目录下的 workspace 相关的 3 个文件不要提交，否则会很容易冲突。",-1),Me=e("p",null,"23、SourceTree",-1),Ce=e("p",null,"配置中「Git」Tab 下选「Use System Git」，否则会报找不到 git 的错误。",-1),Oe=e("p",null,"24、iA Writer",-1),Te={href:"https://img.alicdn.com/imgextra/i1/O1CN01YZ2Osn1qtmYrCS9tw_!!6000000005554-2-tps-502-752.png",target:"_blank",rel:"noopener noreferrer"},De=l('<ul><li>Show Preview「⌘P」</li><li>Hide Preview「⌘P」</li><li>Move Line Up「⌘⇧↑」</li><li>Move Line Down「⌘⇧↓」</li><li>Strikethrough「⌘⇧R」</li></ul><p>25、Shottr</p><p>快捷键里把所有都删了，只保留两个。Area screenshot 用「F19 + 7」，Scrolling screenshot 用「F19 + 8」。</p><p>26、Sip</p><p>Show Picker 的快捷键是「F19 + 2」。</p><p>27、CleanShotX</p><p>Capture Area 的快捷键是「F19 + 6」。</p><h2 id="系统设置" tabindex="-1"><a class="header-anchor" href="#系统设置"><span>系统设置</span></a></h2>',8),Pe={href:"https://img.alicdn.com/imgextra/i2/O1CN014aouuQ1HfZisiosbo_!!6000000000785-0-tps-2456-1572.jpg",target:"_blank",rel:"noopener noreferrer"},Ee=e("p",null,"2、Siri。直接禁掉。",-1),ze=e("p",null,"3、Trackpad。Scroll direction：Natural 去掉。",-1),Le=e("code",null,'"',-1),$e=e("code",null,"'",-1),je={href:"https://github.com/xiaochunjimmy/Sogou-Input-Skin",target:"_blank",rel:"noopener noreferrer"},Re=e("p",null,"5、Spotlight。只开 Applications、Bookmarks & History、Documents、Folders、System Preferences。",-1),Ne=e("p",null,"6、Mission Control。把 Hot Corners 里的全部关掉，不需要，因为有 Thor 了，可以更快切除应用。",-1),Fe=e("p",null,"7、Sharing。只留「AirPlay Receiver」即可，同时可以改下 computer name。",-1),He=e("p",null,"8、Security & Privacy。把「Use Apple Watch to unlock」打开。",-1),Ie=e("p",null,"9、Notification。不必要的全关掉，我只开了 Calendar、Find By、Reminders 和 Wallet。",-1),Ue=e("p",null,"10、Touch ID and Password。开启用 Apple Watch 解锁。",-1),We=e("code",null,"defaults write -g NSWindowShouldDragOnGesture -bool true",-1),Be={href:"https://mmazzarolo.com/blog/2022-04-16-drag-window-by-clicking-anywhere-on-macos/",target:"_blank",rel:"noopener noreferrer"},Ge=e("h2",{id:"参考",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#参考"},[e("span",null,"参考")])],-1),Ke={href:"https://www.robinwieruch.de/mac-setup-web-development/",target:"_blank",rel:"noopener noreferrer"},Ze={href:"https://www.swyx.io/new-mac-setup-2021",target:"_blank",rel:"noopener noreferrer"},Xe=e("p",null,"ChenCheng",-1);function Qe(Ve,Ye){const n=t("ExternalLinkIcon");return r(),o("div",null,[c,e("ul",null,[e("li",null,[u,e("ul",null,[e("li",null,[i("注意：在官网这里"),e("a",p,[i("键位映射表"),s(n)]),i(" 搜名字，要对应起来，Mac 设置到 App 快捷键")])]),m]),v]),b,e("blockquote",null,[e("p",null,[e("a",h,[i("ChenCheng's Personal Site"),s(n)])])]),g,q,_,f,e("p",null,[i("1、安装 HomeBrew 并用他安装 App 和 Cli 工具。App 可以在 "),e("a",k,[i("homebrew-cask — Homebrew Formulae"),s(n)]),i(" 里找有没有，Cli 工具可以在 "),e("a",S,[i("homebrew-core — Homebrew Formulae"),s(n)]),i(" 找有没有。")]),x,e("ul",null,[e("li",null,[e("a",w,[i("Flomo x Pake"),s(n)])]),e("li",null,[e("a",y,[i("Flux"),s(n)])]),A,M,e("li",null,[e("a",C,[i("uPic"),s(n)])]),e("li",null,[e("a",O,[i("ChatGPT x Tauri"),s(n)])]),T]),D,e("p",null,[i("我在 ~/Documents 下建了两个目录（新电脑还没施工完成，这里还会补充更多目录），Code 和 SoftwareConfiguration，"),e("a",P,[i("长这样"),s(n)]),i("。Code 用于存代码；SoftwareConfiguration 用于保存各种软件配置，我把 Alfred、Eagle 和 Espanso 的配置放在这里。")]),E,z,L,e("p",null,[i("参考 "),e("a",$,[i("Karabiner-Element 配置 F19 键 - HackMD"),s(n)]),i(" 。在 "),e("a",j,[i("Karabiner-Elements complex_modifications rules"),s(n)]),i(" 搜「Change caps_lock key」，import 后只保留一条和 F19 相关的，然后在命令行里编辑「~/.config/karabiner/karabiner.json」，把刚才那条规则的「caps_lock」换成「right_command」（两处）。这样你就把基本不会用到的「右⌘」废物利用变成了「F19」键，然后你的快捷键组合会多很多。")]),R,N,F,H,e("p",null,[i("先配置 iTerm2，这是"),e("a",I,[i("效果图"),s(n)]),i("。1）Appearance 里，General 的 Theme 选「Minimal」，Pane 里不要「Show per-pane title bar with split panes」，Dimming 里选上第一和第三个，2）Profiles 里，Working Directory 里选「Reuse previous session's directory」。")]),e("p",null,[i("安装 zsh 和 "),e("a",U,[i("starship"),s(n)]),i("，starship 是 rust 写的 prompt 工具，极快。")]),W,e("p",null,[i("配置 ~/.zshrc，我的配置如下（略做删减）。这里有些 alias 是以 "),B,i(" 开头的，因为这样你敲 "),G,i(" 然后按「Tab」就可以"),e("a",K,[i("看到所有自己定义的命令"),s(n)]),i("了。为啥有些没有加 "),Z,i(" ？历史原因… 因为其他都用习惯了就不改了。")]),X,e("p",null,[i("我的配置见"),e("a",Q,[i("图"),s(n)]),i("，快捷键供参考。")]),V,e("p",null,[i("编程字体我用 "),e("a",Y,[i("Monolisa"),s(n)]),i("，之前还用过 "),e("a",J,[i("Source Code Pro"),s(n)]),i("、"),e("a",ee,[i("Dank Mono"),s(n)]),i(" 和 "),e("a",ie,[i("Operator Mono"),s(n)]),i("。此外我还安装了"),e("a",ne,[i("霞鹜文楷"),s(n)]),i("和阿里普惠体，霞鹜文楷我用在了语雀等文档站和 Obsidian 里。")]),se,e("p",null,[i("主题是 "),e("a",le,[i("Nako - Visual Studio Marketplace"),s(n)]),i("。")]),ae,e("p",null,[i("你会收获两个好处。1）不需要「git push origin xxx」，只要「git push」，2）再也不会遇到「no upstream branch」的报错，也不需要「git push --set-upstream origin test && git push」。因为我们执行 git push 的大部分场景都是 push 到同名的 remote branch。来源是 "),e("a",te,[i("Auto setup remote branch and never again see an error about the missing upstream | pawelgrzybek.com"),s(n)]),i("。")]),re,e("p",null,[i("要稍微做下配置。1）添加 Block App，我加了钉钉、Reeder，2）Block Website 里我把内置的全删了，留了"),e("a",oe,[i("这些"),s(n)]),i("，3）Block App 的配置要选「强制退出」，「隐藏」的模式在 Mac 13.2 下有问题，不会生效或者表现奇怪。")]),de,e("p",null,[i("我的快捷键是「F19+A」划词翻译，「F19+S」截图翻译。插件装了 "),e("a",ce,[i("bob-plugin-deeplx"),s(n)]),i(" 和 "),e("a",ue,[i("bobplugin-google-translate"),s(n)]),i("。文本翻译我加了 Deepl X、有道、阿里、金山词霸，文本识别我用腾讯 OCR。")]),pe,me,ve,be,he,ge,qe,_e,fe,e("p",null,[i("登录 Google 账号后所有东西就都同步过来了，除了 Tampermonkey 的自定义脚本。但简单 Google 后也找到了办法，我参考 "),e("a",ke,[i("extract_tampermonkey_script.py · GitHub"),s(n)]),i(" 把 "),Se,i(" 这个文件夹下的内容复制到新电脑后就能用了。")]),xe,we,ye,Ae,Me,Ce,Oe,e("p",null,[i("把所有 Markdown 文件"),e("a",Te,[i("改成用 iA Writer 打开"),s(n)]),i("，因为 iA Writer 又轻又好看。然后我在「系统设置 > Keyboard > Keyboard Shortcuts > App Shortcuts」中增加了一些针对 IA Writer 的快捷键配置。")]),De,e("p",null,[i("1、General。1）Default Web Browser 用「Google Chrome」，2）Language & Region 里，把 First day of week 改成「Monday」，这样你的日历就会"),e("a",Pe,[i("从周一开始"),s(n)]),i("了。")]),Ee,ze,e("p",null,[i("4、Keyboard。1）Keyboard 里把 Key Repeat 调到「Fast」，把 Delay Util Repeat 调到「Short」，需要一点时间适应，适应后会感受到光标快速移动带来的效率提升，2）Text 里 use "),Le,i(" for double quotes，use "),$e,i(" for single quotes，然后把其他都禁掉，不需要系统帮忙改，基本都是帮倒忙的，3）Shortcuts 里，Mission Control 用「⌥A」,Application windows 用「⌥S」，Show Desktop 用「⌥D」，Input Sources 的 Select Previous 用 「⌘Space」，Screenshots 里 Save picture of selected area as a file 用「F19 + 3」，Copy picture of selected area to the clipboard 用「F19 + 4」，4）输入法删除默认的拼音改用搜狗拼音，登录后可以在不同电脑之间同步词库，搜狗输入法的皮肤我用的"),e("a",je,[i("Matrix 矩阵"),s(n)]),i("。")]),Re,Ne,Fe,He,Ie,Ue,e("p",null,[i("11、执行 "),We,i("，然后就可以按住「⌘+⌃」然后鼠标点击任意地方拖动窗口了。来源 "),e("a",Be,[i("Moving a macOS window by clicking anywhere on it (like on Linux) · mmazzarolo.com"),s(n)]),i("，但是在 MacOS 13 下似乎失效了。")]),Ge,e("ul",null,[e("li",null,[e("a",Ke,[i("Mac Setup for Web Development 2023"),s(n)])]),e("li",null,[e("a",Ze,[i("My 2021 New Mac Setup"),s(n)])])]),Xe])}const ii=a(d,[["render",Qe],["__file","MacOS.html.vue"]]),ni=JSON.parse('{"path":"/studynotes/ZOther/MacOS.html","title":"MacOS","lang":"zh-CN","frontmatter":{"description":"MacOS 由于第一次接触MacOS，花了三周的星期六（三天）来搭这台MacOS Software Apr. 12th 2024 Karabiner (win autohotkey) Alfred (Lib & Everything) in 关键词（可以搜文件里面的内容！） Stats Clash Easydict IINA Omi Lunar（两台电...","head":[["meta",{"property":"og:url","content":"https://doc.zzq8.cn/studynotes/ZOther/MacOS.html"}],["meta",{"property":"og:site_name","content":"Zz"}],["meta",{"property":"og:title","content":"MacOS"}],["meta",{"property":"og:description","content":"MacOS 由于第一次接触MacOS，花了三周的星期六（三天）来搭这台MacOS Software Apr. 12th 2024 Karabiner (win autohotkey) Alfred (Lib & Everything) in 关键词（可以搜文件里面的内容！） Stats Clash Easydict IINA Omi Lunar（两台电..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-15T14:45:27.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-15T14:45:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"MacOS\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-05-15T14:45:27.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Software","slug":"software","link":"#software","children":[]},{"level":2,"title":"ShortKey","slug":"shortkey","link":"#shortkey","children":[]},{"level":2,"title":"Tips","slug":"tips","link":"#tips","children":[]},{"level":2,"title":"Mac Knowledge","slug":"mac-knowledge","link":"#mac-knowledge","children":[]},{"level":2,"title":"Other","slug":"other","link":"#other","children":[]},{"level":2,"title":"安装 ClashX，你懂的","slug":"安装-clashx-你懂的","link":"#安装-clashx-你懂的","children":[]},{"level":2,"title":"安装 App 和 Cli 工具","slug":"安装-app-和-cli-工具","link":"#安装-app-和-cli-工具","children":[]},{"level":2,"title":"准备本地目录","slug":"准备本地目录","link":"#准备本地目录","children":[]},{"level":2,"title":"配置 App","slug":"配置-app","link":"#配置-app","children":[]},{"level":2,"title":"系统设置","slug":"系统设置","link":"#系统设置","children":[]},{"level":2,"title":"参考","slug":"参考","link":"#参考","children":[]}],"git":{"createdTime":1712997543000,"updatedTime":1715784327000,"contributors":[{"name":"Fighting","email":"1024zzq@gmail.com","commits":2},{"name":"MiniPC","email":"1024zzq@gmail.com","commits":2}]},"readingTime":{"minutes":17.03,"words":5109},"filePathRelative":"studynotes/ZOther/MacOS.md","localizedDate":"2024年4月13日","autoDesc":true}');export{ii as comp,ni as data};
