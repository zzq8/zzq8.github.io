# RuoYi-Vue

> 该项目没用 MP，整完这个可以再整 [RuoYi-Cloud](https://doc.ruoyi.vip/ruoyi-cloud/)
>
> 基于SpringBoot、Spring Security、Jwt、Vue的前后端分离的后台管理系统

# 1.验证码

验证码生成使用了google kaptcha的验证码组件，没有重复造轮子

```java
@Resource(name = "captchaProducerMath")
private Producer captchaProducerMath;


// 核心方法 --> 返回一个数学表达式类似于： 5-1=?@4
// 这里的验证码生成使用了google kaptcha的验证码组件，没有重复造轮子，具体的生成逻辑作者重写了
// 这里生成表达式的方法（重写）在 com.ruoyi.framework.config包下的KaptchaTextCreator验证码文本生成器类			
String capText = captchaProducerMath.createText();


-----------------------------
Producer 接口下就两个方法
   * BufferedImage createImage(String var1);      //9-8=?@1
   * String createText();    //BufferedImage.class  一张图！
```



## 1.1.Redis 处理

Redis 写入两个内容：

1. `sys_config:sys.account.captchaEnabled`

   * configService.selectCaptchaEnabled();  // XD：这里是否开启状态也会写入 Redis

   * ```xml
     <select id="selectConfig" parameterType="SysConfig" resultMap="SysConfigResult">
         -- XD: 学到一招，相当于字符串拼接   fragment   
         <include refid="selectConfigVo"/>
         <include refid="sqlwhereSearch"/>
     </select>
     ```

     

2. `captcha_codes:e67884e45c464d418284441ab707b7b6` 

   * 验证码 `1+1=?@2` 答案 2 会写入 Redis， 1+1=? 会以流的形式转成图片给前端    【问题：登录的时候怎么把答案的key再带回给后端？   获取验证码的时候顺便把uuid也给了前端    前端Vue data部分直接给值！看 [1.2.前端](#1.2.前端) 代码块】  这个点谷粒商城雷神好像是直接用个隐藏的input实现的，这里直接就 vue data() 部分有个 uuid 直接赋值



## 1.2.前端

> 一套流程都是从前端发起，不搞懂前端运转就会 **不明不白**
>
> 拿验证码请求举例：`login.vue（getCodeImg方法封装到login.js） -> login.js(request同理) -> request.js` 之所以这样跳，是因为封装了

```js
data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
      ......
    };
  },


getCode() {
    getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
            this.codeUrl = "data:image/gif;base64," + res.img;
            this.loginForm.uuid = res.uuid;     //存在Vue的data里面的
        }
    });
}
```



### 1.2.1.Vue baseURL

> ```js
> // 创建axios实例
> const service = axios.create({
>   // axios中请求配置有baseURL选项，表示请求URL公共部分   【XD:这个很重要，所有URL Request前面加的一层的公共前缀】
>   baseURL: process.env.VUE_APP_BASE_API,
>   // 超时
>   timeout: 10000
> })
> ```
>
> .env.production 文件：`VUE_APP_BASE_API = '/dev-api'`
>
> 导致所有请求都会带上 http://localhost**/dev-api**/captchaImage

#### 问题一：.env.development

> Q: 为什么用的是   .env.development   文件的配置呢？

A: 您使用`npm run dev`命令启动开发服务器时，Vue.js会自动加载`.env.development`文件的配置，并将其中定义的环境变量应用于开发环境。您无需手动判断使用哪个配置文件，Vue.js会自动处理这些细节。



#### 问题二：vue.config.js -> proxy

标准的：配置反向代理服务器

> Q: http://localhost/dev-api/captchaImage    前端80，后端8080    这里没看到端口，Vue获取图片是请求的前端还是后端？

URL 请求前端，通过**反向代理**映射到后端      为什么呢？  -> 巧妙解决跨域问题，这里没用 Nginx

当然解决跨域也可以在后端处理，这不过这里前端处理掉了



##### 仍然疑惑：

那前端逻辑处理还不是要走  8080 要跨域，为什么F12调试地址栏不出来      这里不就又跨域了吗？  还不是从80到8080请求

```js
proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8080`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
```

配置 proxy 理解相当于平替了一下 Nginx 充当了一会代理服务器。但是真实环境更推荐使用 Nginx（专业） 



> Q: 这段代码能够处理跨域问题是因为它通过配置代理将请求转发到指定的目标URL。

在开发环境中，默认情况下，前端应用运行在一个开发服务器上，而后端 API 通常运行在另一个服务器上，两者的域名或端口不同，因此会涉及到跨域请求。

**通过配置代理，将前端应用发送的请求转发到目标URL，就可以绕过浏览器的同源策略，实现跨域请求**



> Q: 所以vue配置了proxy相当于部分替代了nginx的功能？相当于一个代理帮你去请求了8080的后端服务

**是的，配置Vue的代理相当于在开发环境下使用一个轻量级的代理服务器，帮助前端应用将请求转发到后端服务。这种代理功能可以部分替代Nginx等反向代理服务器的功能。**

通过Vue的代理配置，前端应用可以直接发送请求到代理服务器（一般默认为开发服务器的端口，比如80端口），然后代理服务器会将这些请求转发到后端服务（比如8080端口）上。

代理服务器会处理跨域请求，并在转发请求时修改请求头等信息，确保请求能够成功到达后端服务，并将后端服务的响应返回给前端应用。

这种代理配置的好处是，在开发环境下，前端开发人员可以直接通过代理服务器与后端服务进行交互，无需担心跨域问题，简化了开发过程。

**然而，需要注意的是，==Vue的代理只在开发环境下起作用==，用于方便地进行开发和调试。在生产环境中，应该使用真正的反向代理服务器（如Nginx）来处理前后端的请求转发和跨域问题。**

【因为：然而，在生产环境中，Vue的代理配置不会生效。在生产环境中，前端应用通常会经过打包构建，生成静态文件，然后部署到一个独立的Web服务器（如Nginx、Apache等）上。这时候，前端应用和后端API处于不同的域名或端口，需要使用真正的反向代理服务器来处理请求转发和跨域问题。】
所以：感觉还是能用的只要在一台服务器上还是保持这种情况



> Q: vue生产环境我也想配置proxy解决代理可以吗

XD: 应该是行的，只是不推荐

在Vue的生产环境中，配置代理（proxy）并不是一个常见或推荐的做法。Vue的代理配置主要是为了在开发环境下方便调试和解决跨域问题。

在生产环境中，建议使用适当的反向代理服务器（如Nginx）来处理前端应用和后端服务之间的请求转发和代理。反向代理服务器可以提供更强大和灵活的功能，同时具有更高的性能和稳定性。
