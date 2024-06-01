# Clash

> Clash的 config.yml 配置文件也可以直接导入到 `Shadowrocket` !

场景：把 config.yml 导入到 Profiles 选中报错 (我想公司一份，全局一份好切换 个性配置)，这时候对这个文件里的所有点进行了检查

* 机场默认给的是 base64 的订阅地址，proxy-providers 配置 url 的时候需要在订阅地址后加上 `&flag=clash` 换成文件
* 如果报错那可能是订阅不新，拉不下来。。使用最新的订阅地址   默认拉下来会在 \.config\clash\providers\proxy 生成一个对应的文件
  * 换完新的订阅，记得重启一下 Clash 不然老是报错 `all DNS requests failed, first error: Post "https://rubyfish.cn/dns-query": tls: failed to verify certificate: x509: certificate is valid for cloudaemon.rubyfish.cn, dns.rubyfish.cn, not
    rubyfish.cn`