# 先开代理，不然会很慢（依赖第一步）
# export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

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
alias python='python3'
alias cc='claude'
alias repo='cd /Users/xd/Documents/GitRepo'
alias upor='cd /Users/xd/Library/Mobile\ Documents/com\~apple\~CloudDocs/upor'
alias resume='cd /Users/xd/Library/Mobile\ Documents/com\~apple\~CloudDocs/Resume'
# alias ,ms="%PATH/TO/MY/SCRIPT%"
# alias ,ip="ipconfig getifaddr en0"
# alias ,sshconfig="vim ~/.ssh/config"
# alias ,gitconfig="vim ~/.gitconfig"
# alias b=",ms branch"
# alias umi="/Users/%MY_USERNAME%/Documents/Code/github.com/umijs/umi/packages/umi/bin/umi.js"
# # chore
# alias br="bun run"
# alias c='code .'
# alias i='webstorm .'
# alias cdtmp='cd `mktemp -d /tmp/sorrycc-XXXXXX`'
# alias pi="echo 'Pinging Baidu' && ping www.baidu.com"
# alias ip="ipconfig getifaddr en0 && ipconfig getifaddr en1"
# alias cip="curl cip.cc"
# alias qr='qrcode-terminal'
# alias ee="stree"
# alias hosts="vi /etc/hosts"
# ## system
# alias showFiles="defaults write com.apple.finder AppleShowAllFiles YES && killall Finder"
# alias hideFiles="defaults write com.apple.finder AppleShowAllFiles NO && killall Finder"
# # cd
# alias ..='cd ../'
# alias ...='cd ../../'
# alias ..l.='cd ../../ && ll'
# alias ....='cd ../../../'
# alias ~="cd ~"
# alias -- -="cd -"
alias ll='ls -alhG'
# alias ls='ls -G'
# # git
# alias git=hub
# alias gp="git push"
# alias gt="git status -sb"
# alias ga="git add ."
# alias gc="git commit -av"
# alias gcr="git checkout master && git fetch && git rebase"
# alias gclean="git reset --hard && git clean -df"
# alias grebase="git fetch && git rebase -i"

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
# source /opt/homebrew/opt/nvm/nvm.sh

# autojump
# source /opt/homebrew/etc/profile.d/autojump.sh

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
export PATH="/opt/homebrew/bin:$PATH"


# use starship theme (needs to be at the end)
eval "$(starship init zsh)"


# >>> conda initialize >>>
__conda_setup="$('/Users/$(whoami)/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/$(whoami)/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/$(whoami)/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/$(whoami)/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
export PATH="$HOME/.local/bin:$PATH"

# customize
export PATH="/Applications/Sublime Text.app/Contents/SharedSupport/bin:$PATH"
