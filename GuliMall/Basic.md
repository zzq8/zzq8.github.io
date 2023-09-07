# 谷粒商城

> 谷粒商城是一个B2C模式的电商平台，销售自营商品给客户
>
> [雷神B站教程](https://www.bilibili.com/video/BV1np4y1C7Yf?p=2&spm_id_from=pageDriver&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)，分基础、高级、集群三篇。“不要做锤子之神，要做雷霆之神”
>
> [接口文档地址](https://easydoc.net/s/78237135/ZUqEdvA4/hKJTcbfd)    一些业务的实现感觉就挺贴近算法的，自我感觉数据库的设计是最重要的
>
> [别人前端代码](https://gitee.com/AdverseQ/gulimall-mall-front-end)            [别人后端代码](https://gitee.com/AdverseQ/gulimall_Advanced)
>
> Google到的笔记很详细：[别人笔记](https://blog.csdn.net/hancoder/article/details/106922139)   [别人代码](https://github.com/NiceSeason/gulimall-learning)
>
> 最高境界就是数据库设计师和系统架构师

# 一、前言

## 1. 项目简介

> 市面上有5种常见的电商模式 B2B、B2C、C2B、C2C、O2O

#### 1.1 B2B 模式

```markdown
B2B(Business to Business)，是指商家和商家建立的商业关系，如阿里巴巴
```

#### 1.2 B2C 模式

```markdown
B2C(Business to Consumer) 就是我们经常看到的供应商直接把商品买个
用户，即 “商对客” 模式，也就是我们呢说的商业零售，直接面向消费销
售产品和服务，如苏宁易购，京东，天猫，小米商城
```

etc.



## ==**2. 架构图：**==

![image-20220720220817554](http://image.zzq8.cn/img/202207202224096.png)

![image-20220722154237978](http://image.zzq8.cn/img/202207221542079.png)

## 3. 分布式基础概念

常见的负载均衡算法：记一下最后一个！

* 轮询：为第一个请求选择健康池中的第一个后端服务器，然后按顺序往后依次选择，直到最后一个，然后循环。 
* 最小连接：优先选择连接数最少，也就是压力最小的后端服务器，在会话较长的情况下可以考虑采取这种方式。 
* 散列：根据请求源的 IP 的散列（hash）来选择要转发的服务器。这种方式可以一定程度上保证特定用户能连接到相同的服务器。如果你的应用需要处理状态而要求用户能连接到 和之前相同的服务器，可以考虑采取这种方式。



在分布式系统中，各个服务可能处于不同主机，但是服务之间不可避免的需要互相调用，我们称为远程调用。 SpringCloud 中使用 HTTP+JSON 的方式完成远程调用、

![在这里插入图片描述](http://image.zzq8.cn/img/202207221518690.png)

# 二、Docker 学习

> 根据 [官网文档](https://docs.docker.com/engine/install/centos/) 来安装...
>
> 建议看看 [菜鸟](https://www.runoob.com/docker/docker-container-usage.html) 的教程入门一下 Docker！！！



因为 DockerHub 是国外网站，可以登录 **阿里云** 找到容器镜像服务，使用镜像加速器

```bash
# 配置镜像加速
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://chqac97z.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```



==**小 Tip 值得学习**==：用 Docker 就参考这个例子！

## 1. MySQL

### 1.1 安装

拉镜像 **注意 -v 已经 Docker 我下面的理念理解！**

-v 外部:Docker容器内部，以后想改配置到外部的 linux 挂载的文件里改容器也就跟着改了！

理解成 Linux 和 Docker容器（**可以理解为一个完整的Linux**【容器的 bin/bash 里没有 wget，外面 linux有】）是隔离的，所以需要端口映射目录挂载！！！看图

```bash
--- 1 拉去mysql镜像 【其实，run时发现没有pull也会自动pull，所以这步可以省略的】---
docker pull mysql #默认拉最新的
docker pull mysql:5.7 #拉取指定的

--- 2 启动mysql容器 ---
# --name指定容器名字 -v目录挂载 -p指定端口映射  -e设置mysql参数 -d后台运行
docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:5.7
#这个 -v 目录挂载经常用，MySQL、Redis... 
#因为 MySQL 相当于部署到了一台隔离的虚拟的 Linux(Docker 容器隔离) 上了，但我们又想看到期中一些目录
参数说明
-p 3306:3306：将容器的 3306 端口映射到主机的 3306 端口
-v /mydata/mysql/conf:/etc/mysql：将配置文件夹挂载到主机
-v /mydata/mysql/log:/var/log/mysql：将日志文件夹挂载到主机
-v /mydata/mysql/data:/var/lib/mysql/：将配置文件夹挂载到主机-e MYSQL_ROOT_PASSWORD=123456：初始化 123456 

--- 3 进入容器 ---
#验证 以root身份进入mysql容器内部  root@f126639a0424:/#  -it【交互模式】  bin/bash【控制台】
docker exec -it 容器名称|容器id bin/bash
docker exec -it mysql bin/bash
```

![image-20220724160235682](http://image.zzq8.cn/img/202207241602886.png)



> Linux ps （英文全拼：process status）命令用于显示当前进程的状态，类似于 windows 的任务管理器。
>
> docker ps

> 设置 docker 指定容器自动启动，这个语句在菜鸟找不到

```bash
docker update xxx --restart=always
```





### 1.2 配置

1. 在挂载的 conf 目录加 MySQL 配置

```bash
[client]
default-character-set=utf8
[mysql]
default-character-set=utf8
[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci' init_connect='SET NAMES utf8' character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve
```

2. 进 MySQL 容器 验证挂载生效！

```bash
# 使用 docker ps 来查看我们正在运行的容器：
docker ps

docker exec -it mysql bin/bash
cd /etc/mysql

# 重启指定 image，用于改完配置后重启
docker restart mysql

```



### 1.3 使用

```bash
# 进入容器  推荐大家使用 docker exec 命令，因为此命令会退出容器终端，但不会导致容器的停止。
# -it【交互模式】  bin/bash【控制台】
docker exec -it mysql /bin/bash

# 通过容器的 mysql 命令行工具连接
docker exec -it mysql mysql -uroot -p123456
```

`docker exec -it mysql mysql -uroot -p123456`



## 2. Redis

> 注意和 MySQL 不同，因为要通过配置文件启动 Redis 所以需要先创好文件！

1. 下载 latest 的版本就好 `docker pull redis`

2. ```bash
   # 先创好文件！ 修改需要自定义的配置(docker-redis默认没有配置文件，自己在宿主机建立后挂载映射)
   mkdir -p /mydata/redis/conf
   touch /mydata/redis/conf/redis.conf
   ```

3. ```bash
   docker run -p 6379:6379 --name redis -v /mydata/redis/data:/data \
   -v /mydata/redis/conf/redis.conf:/etc/redis/redis.conf \
   -d redis redis-server /etc/redis/redis.conf
   ```

4. `docker exec -it redis redis-cli`

---



```bash
# Redis 从cli中设置密码
config set requirepass test123

# 加配置
bind 0.0.0.0 开启远程权限
appendonly yes 开启aof持久化
```



# 三、项目准备

## 1. 前端

### 1.1 前言

> vsCode 好用的快捷键，Ctrl E 选中下一个同名单词 / Alt 点击光标多个
>
> ctrl + ` 打开终端

**启动项目：**

**我们关注与 node.js 的 npm 功能就行； NPM 是随同 NodeJS 一起安装的包管理工具**

* 导入vscode
* 终端 `npm install`（==相当于 Maven 下载依赖包==）
  * **这里是根据package.json下载后端是pom.xml**
  * 下载完的依赖会在 node_modules 包下面
* `npm run dev`



**Babel：将新特性代码自动转换成浏览器能兼容的老代码**

Webpack：打包工具

ES6 & Vue 快速入门



### 1.2 ES6

具体看文档：[03、前端开发基础知识](https://gitee.com/codezzq/study-notes/raw/master/%E8%B0%B7%E7%B2%92%E5%95%86%E5%9F%8E/03%E3%80%81%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86.pdf) 点 **原始数据** 可以看！

> let 有点强类型语言的意思：
>
> 1. var 声明的变量往往会越域，let 声明的变量有严格局部作用域（var 全局  let 局部）
> 2. var 可以声明多次，let 只能声明一次
> 3. var 会变量提升， let 不存在变量提升
> 4. const 声明常量（只读变量）
> 5. **对象解构**
> 6. 多行字符串相当于加强版的字符串，用==反引号 `== 
> 7. **${} 实现字符串拼接**
>    * 注意这里 7 要和 6 一起用！let info = \`我是${name}，今年${age}了\`;
>
> 1. ==[函数表达式](https://zh.javascript.info/function-expressions) 区别 **函数声明**==
>
> 2. etc.
>
> 3. 还有箭头函数+解构
>
>    ```javascript
>    const person = {
>        name: "jack",
>        age: 21,
>        language: ['java', 'js', 'css']
>    }
>                                                    
>    // var hello1 = (param) => console.log("hello," + param.name);
>    // hello1(person);
>    var hello2 = ({name}) => console.log("hello," + name);
>    hello2(person);



> 针对嵌套的 ajax ES6 提供 ==Promise==
>
> [Gitee 代码](https://gitee.com/codezzq/gulimall/blob/master/gulimall-product/src/main/resources/static/6.promise.html)  感觉可以理解成把 嵌套 调用，变成 链式 调用



>在JavaScript中`实参`与`形参`数量并不需要像JAVA一样必须在数量上严格保持一致，具有很大的灵活性。如下：==下面四个调用都能执行！==

```javascript
function test(str1, str2, str3) {
    // ......
}
test();                             // str1: undefined, str2: undefined, str3: undefined
test('hello');                      // str1: 'hello', str2: undefined, str3: undefined
test('hello', 'world');             // str1: 'hello', str2: 'world', str3: undefined
test('hello', 'world', '!');        // str1: 'hello', str2: 'world', str3: '!'
```



> 简化

```js
computed: {
    totalPrice: function(){} 
    等价于
    totalprice(){}
}
```



> js 两种方法构建一个正则表达式：
>
> * 使用一个正则表达式字面量，其由包含在斜杠之间的模式组成，如下所示：
>   * var re = /ab+c/;
>   * 脚本加载后，正则表达式字面量就会被编译。当正则表达式保持不变时，使用此方法可获得更好的性能。
> * 或者调用[`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)对象的构造函数，如下所示：
>   * var re = new RegExp("ab+c");
>   * 在脚本运行过程中，用构造函数创建的正则表达式会被编译。如果正则表达式将会改变，或者它将会从用户输入等来源中动态地产生，就需要使用构造函数来创建正则表达式。



### 1.3 模块化

> 模块化就是把代码进行拆分，方便重复利用。**类似 java 中的导包**：要使用一个包，必须先导包。而 JS 中没有包的概念，换来的是 模块。

模块功能主要由两个命令构成：`export`和`import`。 

* `export`命令用于规定模块的对外接口。
* `import`命令用于导入其他模块提供的功能。
  * 注意 import 还不算完，要用的话得在需要注入到对象中才能使用 **components**


`export`不仅可以导出对象，**一切JS变量都可以导出**。比如：基本类型变量、函数、数组、对象。



### 1.4 ==Vue 2==

> 详细点看：[Vue入门学习笔记](https://blog.csdn.net/qq_42295733/article/details/104077906)   &   [03、前端开发基础知识](https://gitee.com/codezzq/study-notes/raw/master/%E8%B0%B7%E7%B2%92%E5%95%86%E5%9F%8E/03%E3%80%81%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86.pdf) 
>
> 在 MVVM 之前，开发人员从后端获取需要的数据模型，然后要通过DOM操作Model 渲染到 View 中。而后当用户操作视图，我们还需要通过 DOM 获取 View 中的数据，然后同步到Model 中。 
>
> 而 MVVM 中的 VM 要做的事情就是把 DOM 操作完全封装起来，**开发人员不用再关心Model 和 View 之间是如何互相影响的**

#### **1.4.1 新建项目：**

* 当前工程要用 npm `npm init -y` 初始化项目，出来一个 package.json

* 终端 `npm install vue@2`（==相当于 Maven 下载依赖包==）加上@2，**新版本没有vue.js文件**
  * **这里是根据package.json下载后端是pom.xml**
  * 下载完的依赖会在 node_modules 包下面，且这个包下有 vue 包
* html 页面 script 引入 `./node_modules/vue/dist/`
* `npm run dev`



尚上优选笔记：

```shell
#全局安装命令行工具    实测：不执行这行下面的 vue 标识都识别不了  vue : 无法将“vue”项识别为 cmdlet、函数、脚本文件或可运行程序的名称
npm install --location=global @vue/cli
#创建一个项目
vue create vue-test #选择vue2
#进入到项目目录
cd vue-test
#启动程序
npm run serve
```

如果启动不起来 digital envelope routines::unsupported
可能是Node版本不一样，可以把 node_modules 目录删掉，重新 `npm install`  [不行，我换16版本才行]

#### **1.4.2 常用的属性:**

- v-if
- v-else-if
- v-else
- v-for
- v-on 绑定事件 , 简写`@`
- **v-model 数据双向绑定**（模型、视图）
  - [`.number`](https://cn.vuejs.org/guide/essentials/forms.html#number) ——将输入的合法符串转为数字             [建议看这个例子](https://blog.csdn.net/m0_67402013/article/details/123303586)

- v-bind 给组件绑定参数,简写 `:`
  - 数据库里数据是 int 这里就可以冒号绑定搞成数字  :active-value="1" :inactive-value="0"

- **v-html**

> 一些惊艳的示例：

**v-on、v-model...**

1. 事件修饰符（阻止冒泡，不然里面div点一下弹两个）
2. 按键修饰符（这个很有意思！可以监听键盘！）

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <div id="app">
                
        <!--事件中直接写js片段-->
        <button v-on:click="num++">点赞</button>
        <!--事件指定一个回调函数，必须是Vue实例中定义的函数-->
        <button @click="cancle">取消</button>
        <!--  -->
        <h1>有{{num}}个赞</h1>


        <!-- 事件修饰符 -->
        <div style="border: 1px solid red;padding: 20px;" v-on:click.once="hello">
            大div
            <div style="border: 1px solid blue;padding: 20px;" @click.stop="hello">
                小div <br />
                <a href="http://www.baidu.com" @click.prevent.stop="hello">去百度</a>
            </div>
        </div>



        <!-- 按键修饰符： -->
        <input type="text" v-model="num" v-on:keyup.up="num+=2" @keyup.down="num-=2" @click.ctrl="num=10"><br />

        提示：

    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>

    <script>
        new Vue({
            el:"#app",
            data:{
                num: 1
            },
            methods:{
                cancle(){
                    this.num--;
                },
                hello(){
                    alert("点击了")
                }
            }
        })
    </script>
</body>

</html>
```



**vue的函数调用加不加()都可以的（js里确实不行，不过vue里可以）**

```js
@click="addCategory()"        
--- vs ---  在 Vue 中两者都可以
@click="addCategory"
```





**使用 `props` 属性传递参数**

```js
<div id="app">
    <ul>
        <my_component_li v-for="item in items" v-bind:item="item"></my_component_li>
    </ul>
</div>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script>
    Vue.component(
        'my_component_li',{
            props: ['item'], //通过循环的遍历item，绑定属性，此属性‘item’作为媒介，传递给模板
            template:'<li>{{item}}</li>'
        }
    );

    //viewModel 实现与Model双向绑定，动态更新视图
    var vm = new Vue({
        el:"#app",
        data: {
            items: ["李泽玉考西电","西电必上岸","西电我来了"]
        }
    });
</script>

```

说明：

* v-for="item in items"：遍历 Vue 实例中定义的名为 items 的数组，并创建同等数量的组件
* v-bind:item="item"：将遍历的 item 项绑定到组件中 props 定义的名为 item 属性上；= 号左边的 item 为 props 定义的属性名，右边的为 item in items 中遍历的 item 项的值



**v-html**

```js
<body>

    <div id="app">
        <!-- 会变成 <span><h1>Hello</h1></span> -->
        <span v-html="msg"></span>
    </div>

    <script src="../node_modules/vue/dist/vue.js"></script>

    <script>
        new Vue({
            el: "#app",
            data: {
                msg: "<h1>Hello</h1>",
            }
        })
    </script>

</body>
```



> v-if  VS  v-show
>
> v-if 是直接 F12 中看不到代码了，v-show 是 display 属性为 false



==**计算属性 & 监听器**==

```js
<body>
    <div id="app">
        <!-- 某些结果是基于之前数据实时计算出来的，我们可以利用计算属性。来完成 -->
        <ul>
            <li>西游记； 价格：{{xyjPrice}}，数量：<input type="number" v-model="xyjNum"> </li>
            <li>水浒传； 价格：{{shzPrice}}，数量：<input type="number" v-model="shzNum"> </li>
            <li>总价：{{totalPrice}}</li>
            {{msg}}
        </ul>
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>

    <script>
        //watch可以让我们监控一个值的变化。从而做出相应的反应。
        new Vue({
            el: "#app",
            data: {
                xyjPrice: 99.98,
                shzPrice: 98.00,
                xyjNum: 1,
                shzNum: 1,
                msg: ""
            },
            computed: {
                totalPrice(){
                    return this.xyjPrice*this.xyjNum + this.shzPrice*this.shzNum
                }
            },
            watch: {
                xyjNum(newVal,oldVal){
                    if(newVal>=3){
                        this.msg = "库存超出限制";
                        this.xyjNum = 3
                    }else{
                        this.msg = "";
                    }
                }
            },
        })
    </script>

</body>
```



##### 注意：**组件的 data 必须是一个函数，不再是一个对象。**  data + return

可全局 / 局部

```js
<body>
    <div id="app">
        <button v-on:click="count++">我被点击了 {{count}} 次</button>

        <counter></counter>
        <counter></counter>
        <counter></counter>
        <counter></counter>
        <counter></counter>

        <button-counter></button-counter>
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>

    <script>
        //1、全局声明注册一个组件
        Vue.component("counter", {
            template: `<button v-on:click="count++">我被点击了 {{count}} 次</button>`,
            data() {
                return {
                    count: 1
                }
            }
        });

        //2、局部声明一个组件
        const buttonCounter = {
            template: `<button v-on:click="count++">我被点击了 {{count}} 次~~~</button>`,
            data() {
                return {
                    count: 1
                }
            }
        };

        new Vue({
            el: "#app",
            data: {
                count: 1
            },
            components: {
                'button-counter': buttonCounter
            }
        })
    </script>
</body>
```



为了简化开发，**Vue 为生命周期中的每个状态都设置了钩子函数（监听函数）**



#### 1.4.3 模块化开发

> 使用 vue-cli 快速搭建脚手架工程
>
> vue-cli是什么：vue-cli是vue的命令行工具，只要按照官网敲几行命令就可以新建一个基本的vue项目框架。方便快捷。
>
> vue-cli和webpack是什么关系：vue-cli 里面包含了webpack， 并且配置好了基本的webpack打包规则

1. npm install webpack -g（全局安装 webpack ）
2. npm install -g @vue/cli-init （全局安装 vue 脚手架 ）
3. 初始化 vue 项目（vue init webpack appname：vue 脚手架使用 webpack 模板初始化一个appname 项目）
4. 启动 vue 项目（项目的 package.json 中有 scripts，代表我们能运行的命令 npm start = npm run dev：启动项目 npm run build：将项目打包）



讲解一下目录🤺：

1. **build** 和 webpack 有关的代码
2. **config** 配置信息，如项目端口配置
3. **node_modules** 项目所有的依赖，相当于 Maven 下载依赖包
4. **src** 我们编写代码的地方
5. **.babellrc** 将新特性代码自动转换成浏览器能兼容的老代码
6. **package.json** 相当于后端的 pom.xml
7. **package-lock.json** 是上者的详细信息，包括去哪里下



src/main.js 主程序



#### 1.4.3 Element-UI

Element UI 基于 Vue 2.0 的桌面端组件库（具体看官网）

npm install element-ui

装完后可在 **package.json** 看到信息

在 main.js 导入

```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
```

看文档写就行了，文档明明白白，ui框架学习没啥成本，就是cv

踩坑：npm 安装后，用 <el-image> 的时候报错 

`Unknown custom element: <el-image> - did you register the component correctly?`

解决：文档 -> 快速上手 自己copy完整组件列表import {}里面的和use，到 src\element-ui\index.js  再把一些没有的组件删掉



#### 1.4.4 解决闪烁问题

```html
    <!--v-cloak 解决闪烁问题-->
    <style>
        [v-cloak] {
            display: none;
        }
    </style>
```



#### 1.4.5 ==生命周期方法==

```json
  			"components: {},",

            "data() {",
            "//这里存放数据",
            "return {",
            "",
            "};",
            "},",

            "//监听属性 类似于data概念",
            "computed: {},",
            "//监控data中的数据变化",
            "watch: {},",
            "//方法集合",
            "methods: {",
            "",
            "},",
            "//生命周期 - 创建完成（可以访问当前this实例）",
            "created() {",
            "",
            "},",
            "//生命周期 - 挂载完成（可以访问DOM元素）",
            "mounted() {",
            "",
            "},",
            "beforeCreate() {}, //生命周期 - 创建之前",
            "beforeMount() {}, //生命周期 - 挂载之前",
            "beforeUpdate() {}, //生命周期 - 更新之前",
            "updated() {}, //生命周期 - 更新之后",
            "beforeDestroy() {}, //生命周期 - 销毁之前",
            "destroyed() {}, //生命周期 - 销毁完成",
            "activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发",
            "}",
```



### 1.5 高级部分

==父子组件传递数据==：仔细看下面的例子便于理解！

```js
/**
 * 父子组件传递数据
 * 1)、子组件给父组件传递数据，事件机制；
 *    子组件给父组件发送一个事件，携带上数据。
 * // this.$emit("事件名",携带的数据...)
 */


//向父组件发送事件；参数含义（事件名推荐-的写法，任意多的数据都会带出去）
this.$emit("tree-node-click", data, node, component);

//父组件绑定这个事件（@tree-node-click），触发一个自己的方法treenodeclick
<category @tree-node-click="treenodeclick"></category>
```







## 2. 后端

导入[人人开源](https://gitee.com/renrenio)的项目到idea时，报错。通过改parent的boot版本解决！



> 在测试类测试 product 模块的功能，结果一直报错，怎么解决都搞不好
>
> 结果认真看有个 seata 的报错，我就去 pom 把 seata 依赖注销就好了！！！



> ==[org.junit.jupiter.api.Test和org.junit.Test区别](https://blog.csdn.net/qq_36050981/article/details/119565383)==
>
> 现在需要知道！主要是 spring boot 2.2之前使用的是 Junit4 之后是 Junit5，还需知道他们两个有什么区别看网站！
>
> 
>
> [关于@RunWith(SpringRunner.class)的作用](https://blog.csdn.net/qq_21108099/article/details/111496005)
>
> SpringBoot 测试类 需要从容器中获取实例是需要加上该注解，否则空指针，管你是啥IDE。貌似是Junit4用的注解



>@Value 取 user.name 取的是系统变量
>
>所以最好加前缀 coupon.user.name



## 3. 技术选型

结合 SpringCloud Alibaba 我们最终的技术搭配方案： 

* **SpringCloud Alibaba - Nacos：注册中心（服务发现/注册）**
* **SpringCloud Alibaba - Nacos：配置中心（动态配置管理）** 
* **SpringCloud - Ribbon：负载均衡** 
* **SpringCloud - Feign：声明式 HTTP 客户端（调用远程服务）** 
* **SpringCloud Alibaba - Sentinel：服务容错（限流、降级、熔断）** 
* **SpringCloud - Gateway：API 网关（webflux 编程模式）** 
* **SpringCloud - Sleuth：调用链监控** 
* **SpringCloud Alibaba - Seata：原 Fescar，即分布式事务解决方案**



# 四、项目开始

## 1. 注意小点

> 使用 MyBatis-Plus 时候，==ServiceImpl 可以不用 注入 Dao，可以直接使用 baseMapper==

```java
public class CategoryServiceImpl extends ServiceImpl<CategoryDao, CategoryEntity> implements CategoryService
    
    /**
     * 以前正常写法
     */
    @Autowired
    private CategoryDao categoryDao;

		/**
         * 现在用了 MyBatis-Plus 后
         * baseMapper 代替了 categoryDao(不用注入)
         */
        baseMapper.selectList(null);

//具体看 extends ServiceImpl 这个类的源码，public class ServiceImpl<M extends BaseMapper<T>, T> implements IService<T> 
//因为继承泛型是 categoryDao 到这个类投射成了 protected M baseMapper;
```



> @Mapper 接口时候方法签名中的形参的 @Param 可以用 MybatisX 插件生成
>
> ![image-20221019140152140](http://image.zzq8.cn/img/202210191401611.png)



> 感觉很洋气 ！善用 lambda 表达式 ！多看看学学，那个博客留言三级应该也可以简化成这样
>
> 实现树形结构的 三级分类，先给 entity 加一个
>
> ```
> @TableField(exist=false)
> private List<CategoryEntity> children;
> ```

```java
@Override
    public List<CategoryEntity> listWithTree() {
        // 查出所有分类
        List<CategoryEntity> entities = baseMapper.selectList(null);

        //从一级分类开始给每个递归给一个子list
        List<CategoryEntity> AllLevelMenus = entities.stream()
                .filter(entity -> entity.getParentCid() == 0)
                .map((entity) -> {
                    entity.setChildren(getChildrens(entity, entities));
                    //因为 map 的Lambda表达式必须是 Function 接口的一个实例，也就是需要参数需要返回值，上面这行没有返回值
                    return entity;
                })
                .sorted((menu1, menu2) -> menu1.getSort() - menu2.getSort())
                .collect(Collectors.toList());
        return AllLevelMenus;
    }

######################################################


    private List<CategoryEntity> getChildrens(CategoryEntity entity, List<CategoryEntity> all) {
        List<CategoryEntity> childrenList = all.stream()
                .filter(menu -> menu.getParentCid() == entity.getCatId())
                .map((menu) -> {
                    menu.setChildren(getChildrens(menu, all));
                    return menu;
                })
                .sorted((menu1, menu2) -> menu1.getSort() == null ? 0 : menu1.getSort() - (menu2.getSort() == null ? 0 : menu2.getSort()))
                .collect(Collectors.toList());
        return childrenList;
    }
```





> 1. vscode 注释报错，关闭ESlint的语法检查
>
>    * build -> webpack.base.conf.js 里面的 createLintingRule 注销掉
>
>    * ```js
>      const createLintingRule = () => ({
>        // test: /\.(js|vue)$/,
>        // loader: 'eslint-loader',
>        // enforce: 'pre',
>        // include: [resolve('src'), resolve('test')],
>        // options: {
>        //   formatter: require('eslint-friendly-formatter'),
>        //   emitWarning: !config.dev.showEslintErrorsInOverlay
>        // }
>      })
>      ```
>
> 2. console.log     不要再 String 拼接，直接多个变量  
>
>    * console.log('data'+data); // data:[object Object]   
>
>    * console.log('1', '2', data); // 1 data具体数据
>
> 3. getMenus 刷新的原因：如果多个人操作了这个页面呢，不再请求一次页面数据怎么是最新的？
>
>    ​       this.getMenus();
>
>    ​       this.expandedKey = [node.parent.data.catId];



> yaml 配置小点

```yaml
#可以加上下文路径  http://localhost:8080/renren-fast
server.servlet.context-path:/renren-fast
```



> **特殊注释说明，==学到了！！！==**

`//TODO: + 说明：`   在 idea 中这个注释会变成金色，且会在下面工具栏显示！类似快速备忘录功能
如果代码中有该标识，说明在标识处有功能代码待编写，待实现的功能在说明中会简略说明。搞完了就删掉TODO

![image-20220814161700939](http://image.zzq8.cn/img/202208141617036.png)

// XXX 勉强可以工作，但是性能差等原因.

// FIXME 代码是错误的，不能工作，需要修复.



> 因为数据库用的 **自增** 主键，所以要配置一下，不然 
>
> ```java
> @TableId
> private Long catId;
> 其中 
> IdType type() default IdType.NONE;
> ```

```yaml
mybatis-plus:
  global-config:
    db-config:
      id-type: auto
```



> 同时配置 **注解** 与 **配置文件** 注解会生效，配置文件失效

1. 测试点：

   - 在bootstrap.yml中配置：`id-type: auto`，

     注解为`@TableId(value = "id", type = IdType.ASSIGN_ID)`

     经过测试：注解生效。

   - 将配置移动到application.yml中测试结果与上面相同。

2. 结论：==注解优先配置生效==。



**MyBatis-Plus 逻辑删除有两种方法**

> 物理删除 ：从数据库中直接移除
>
> 逻辑删除 ：再数据库中没有被移除，而是通过一个变量来让他失效，类似于回收站！

* yaml 配置标志位、删除与未删除是 0/1
* 用 @TableLogic 注解配置



> yaml 配置日志，看 SQL 语句
>
> 看到 renren-fast 配置的是 logback-spring.xml

```yaml
logging:
  level:
    com.zzq.gulimall: debug  #就代表这个包下面所有的
```





## 2. [跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

**跨域：指的是浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是==浏览器对javascript施加的安全限制==。**

**同源策略：是指==协议，域名，端口==都要相同，其中有一个不同都会产生跨域；**

![image-20220813175848410](http://image.zzq8.cn/img/202208131758590.png)



> 理解 [简单请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#简单请求) 和[预检请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#预检请求)

不是简单请求的都需要发送一个预检请求 比如看标题链接，这里发的是 Application/json 浏览器响应

`Request Method: OPTIONS`

![image-20220813180934578](http://image.zzq8.cn/img/202208131809687.png)

**所以服务器不允许，就一个OPTIONS请求过去后。真实请求就没有发了！**



### 解决跨域

（一）使用nginx部署为同一域          感觉：套了一层又一层

![image-20220813182436081](http://image.zzq8.cn/img/202208131824168.png)

（二）配置当次请求允许跨域

![image-20220813185445762](http://image.zzq8.cn/img/202208131854872.png)

一个个 Model 配太繁琐，因为所有 Model 的方法都会经过 Gateway 所以网关搞一个配置类

主要就是搞一个 CorsWebFilter 的 Bean



一点一点的new，需要什么配置什么！！！看源码参数缺什么。学习一下雷神的思想，别的老师都是直接去网上复制

注意：

```java
	//配置跨域
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedOrigin("*");
        //设置允许携带cookies，不然跨域请求会丢失携带的cookies
        corsConfiguration.setAllowCredentials(true);
```

![image-20220813191254660](http://image.zzq8.cn/img/202208131912755.png)

为了解决浏览器跨域问题，W3C 提出了跨源资源共享方案，即 `CORS`(Cross-Origin Resource Sharing)。它允许浏览器向跨源服务器，发出XMLHttpRequest请求。spring mvc 4.2版本增加了对cors的支持，通过spring boot可以非常简单的实现跨域访问。

值得一看CorsConfig：[【跨域】使用CorsConfig和注解，解决跨域](https://juejin.cn/post/6947966470798180359)  和 [gateway跨域解决方案](https://juejin.cn/post/6941260113197924389)



==SSYX Project 补充：

1）在后端接口controller添加@CorsConfig跨域注解最简单解决跨域  （跨域有多种解决方案，现在暂时这么做）

2）可能后期还是以网关层面解决是最好==



#### 补充：

CORS与JSONP的使用目的相同，但是比JSONP更强大。

==JSONP只支持`GET`请求，CORS支持所有类型的HTTP请求。==JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。





## 3. [==axios和vue-axios的关系及使用区别==](https://www.panziye.com/java/web/4033.html)

所以说 axios 使用方式就是用this.$http：**Vue.prototype.$http = axios**  

```js
# 第一步：安装
npm install --save axios
# 第二步：在入口文件main.js中配置
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$http = axios
# 第三步：使用案例
this.$http.get('/user?id=666').then((response) => {
  console.log(response.data)
}).catch( (error) => {
    console.log(error);
});
```



## 4. 三级菜单：拖拽前端业务实现

* 能否拖拽的实现思路是自己简单一个 if 判断没有用雷神的
* 拖拽的 **handleDrop** 方法实现那三点cv的没有去看 (抽空可以再看看)



ref 给组件唯一标识（起个名字） this.$refs 拿到

```js
ref="menuTree"
//下面这样就可以唯一定位到上面属性指定的组件
this.$refs.menuTree.filter(val);
```



后台脚手架平台一般是后端顺手写出来的



## 5. 踩坑

### 逻辑删除

/product/brand/update    传的data：{brandId,showStatus}

SQL报错是因为mybatis-plus不支持更新逻辑删除的字段



注意wrapper要用数据库里的字段_，而不是entity里面的小驼峰

```wrapper.eq("brand_id",brand.getBrandId())
wrapper.eq("brand_id",brand.getBrandId())
        .set("show_status",brand.getShowStatus());
```



==MyBatisPlus中开启了逻辑删除则更新逻辑字段不再管用，总是自动带上show_status=1==

Preparing: UPDATE pms_brand SET show_status=? WHERE ==show_status=1== AND (brand_id = ?) 

加了配置文件全局的逻辑删除，用updateWrapper也是不行的，还是会在where后面拼接



解决：不用全局的逻辑删除，category 那个实体类用一下注解就行！



### 前端校验

> 排序必须是一个大于等于0的整数
>
> `v-model.number="dataForm.sort"`  和  `if (!Number.isInteger(value) || value<0)`



## 6. OSS（Object Storage Service）

服务端SDK在上传方面主要提供两种功能：

* 一种是直接上传文件到云端。
* 最好的是生成客户端上传所需要的上传凭证

项目采取：第二种服务端签名后直传。保证了一定的安全性

上传就不用经过自己的服务器了（不用占带宽），上传在客户端完成

总结：服务器拿 Token 前端页面带上到 OSS

![image-20220818222235756](http://image.zzq8.cn/img/202208182222062.png)

我这里用的是七牛云所以没用到下面，自己捣鼓了很久。难的就是前端的 vue 文件是直接 copy 的，大部分东西不知道作用！

解决aliyun-oss-spring-boot-starter导入报错的问题

https://blog.csdn.net/gao_jun1/article/details/111414976

注意区分：

```xml
<dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>aliyun-spring-boot-dependencies</artifactId>
                <version>1.0.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>2.1.8.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
</dependencyManagement>
```



## ==7. JSR 303==

> 前端校验主要是给一般用户看的，提高用户体验。因为可用 PostMan 绕过直接给后端发请求！

  "status": 400,

  "error": "Bad Request"

看到上面这个就证明校验不通过！

注意：spring-boot-starter-web 里面有 validation

### 使用过程

1. **以前总觉得 Controller 类还要在类头加注解，记忆混乱了。实测不用！**  后话：不懂

   1. Entity 字段加 @NotNull etc.
   1. Controller 方法形参加注解 @Valid 

   

2. 能使用，但报错不符合业务规定，**优化**：

```java
实体类：+message
@NotBlank(message = "品牌名必须提交")  //报错json变成 -> "defaultMessage": "品牌名必须提交",
Contrller：+BindingResult
public R save(@Valid @RequestBody BrandEntity brand, BindingResult result){
```

@Pattern 可以用正则表达式校验

注意：**java 正则确实不需要 / / 注意区分 js (var re = /ab+c/;)**



3. ==统一异常处理== 
   * 类+ **@RestControllerAdvice("com.zzq.gulimall.product.controller")**
   * 方法+ **@ExceptionHandler(需要处理的异常类.class)**

> 上面优化，每个方法都要到业务里处理异常太繁琐了，抽取解耦封装

**不用 BindingResult，建一个==异常类==集中处理所有异常**

这里雷神NB，参数先 Exception e，获取它的异常错误类 `e.getClass()` 替换大的 Exception异常，细化后就能又获取BindingResult对象。

Exception 是没有这个方法的！

![image-20220820145558332](http://image.zzq8.cn/img/202208201455426.png)

```java
@ExceptionHandler(MethodArgumentNotValidException.class) //处理对应异常
    public R handlerValidException(MethodArgumentNotValidException e /*感知异常*/)
```



最后 如果不能精确匹配异常，就来到最大的类 Exception ，再写一个方法来囊括



错误码Enum

return 的 R 错误码可以看尚硅谷的文档，一般可以是5位，业务场景2+错误码3。用个枚举类囊括



### 分组校验

> 场景：新增 / 修改时我们想要校验的字段和规则可能是不一样的！比如说，ID 字段 新增时不需要携带。而修改时必须要携带

==没有标注分组的校验注解就不会被校验==

看公司  反正你不用你也要写if else 我觉得还是用的好  不带直接弹回还省的浪费数据库资源

上手：比较麻烦，新建AddGroup、UpdateGroup这些空接口（只充当一个标识，问就是约定，规范），然后分组的时候填这些接口，**controller方法指定用哪个分组**  public R save(@Validated(AddGroup.class)

新建分组接口 -> 注解填分组 -> controller改成**@Validated({AddGroup.class})**



> ==问题：==
>
> ```java
> //不知道为什么这两样都行,但明明属性是数组
> @Validated({AddGroup.class})
> @Validated(AddGroup.class)
> 
> public @interface Validated {
>     Class<?>[] value() default {};
> }
> ```
>
> ==搜 Annotation 找出答案：==
>
> ##### 数组类型的属性
>
> 注解类添加数组类型的属性：int[] id() default {1,2,3};
> 使用类使用数组类型的属性：@Annotation(id={2,3,4})
> **如果数组属性只有一个值，这时候属性值部分可以省略大括号**，如：@Annotation(id=2)，表示数组属性只有一个值，值为2**(如同Butterknife中onClick注解)**
>
> 链接：https://www.jianshu.com/p/2867f0558687





正则处理不了校验（比如 Integer ），我们可以自定义校验注解

需要导入，**直接修复的时候有选择导入依赖的,不用手动**

![image-20220821105014376](http://image.zzq8.cn/img/202208211050573.png)

```
<dependency>
    <groupId>jakarta.validation</groupId>
    <artifactId>jakarta.validation-api</artifactId>
    <version>2.0.2</version>
</dependency>
```



### 自定义校验（仿照别的校验写）

可以多看下代码，学学雷神的思想境界！

> ```java
> //规定，建议看代码   以及P69 5：00
> String message() default "{com.zzq.common.valid.ListValue.message}";
> ```
>
> 默认的Message信息是在这个文件：**ValidationMessages_zh_CN.properties**



```
// 指定用什么校验，这里需要编写一个自己的自定义校验器。参照别的注解自己写一个
@Constraint(
    validatedBy = {}
)
```



## 8. SPU 与 SKU

>SPU（Standard Product Unit）：就是iphone xs 的一些标准信息（像素，尺寸等）-- > **基本属性** / 规格与包装
>
>SKU（stock keeping unit）：就是 xs 细化分不同颜色不同版本（多大内存）可能价格也不同（这是真正买的版本）-- > **销售属性**
>
>从广义上讲，类目>SPU>SKU



**分类（Category） -> 分组（AttrGroup） -> 属性（Attr）**



<img src="http://image.zzq8.cn/img/202208221109447.png" alt="image-20220822110956653" style="zoom: 67%;" />

<img src="http://image.zzq8.cn/img/202208221112300.png" alt="image-20220822111210105" style="zoom:67%;" />

<img src="http://image.zzq8.cn/img/202208221114306.png" alt="image-20220822111429154" style="zoom:67%;" />

勾中快速展示：就是把它展示到商品介绍上



## 9. 其他重要的点

### 关于 MyBatis-Plus

```
Query   PageUtils   都是gulimall-common的自定义类封装（来源于 renrenfast 封装）
去公司也是直接封装好的
```



### ==Jackson== 介绍

Jackson [/ˈdʒæksən/] 是当前用的比较广泛的，用来序列化和反序列化json的Java开源框架。Jackson社区相对比较活跃，更新速度也比较快， 从Github中的统计来看，Jackson是最流行的json解析器之一，**Spring MVC的默认json解析器便是Jackson。**

场景：三级菜单最后没有 chidren 就不用显示，不然前端列表显示一片空白

```java
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@TableField(exist = false)
private List<CategoryEntity> children;
```

进行 Json 转换会按照这个规则

```yaml
spring:
  jackson:
    date-format: yyyy-mm-dd HH:mm:ss
```



### Element UI Cascader 级联选择器

<img src="http://image.zzq8.cn/img/202208232052487.png" alt="image-20220823205206340" style="zoom:67%;" />





### Issue

假设x是一个已知仅包含字符串的列表（List）。以下代码可用于将列表转储到新分配的String数组中：

```java
 String[] y = x.toArray(new String[0]);
```



测了一下输出都是 abc

```java
List<String> list = Arrays.asList("a", "b", "c");
String[] strings = list.toArray(new String[0]);
String[] strings1 = list.toArray(new String[list.size()]);
```



### Other

合理的冗余字段是为了快速查询，减少IO次数

save功能，前端没有传这两个字段，想办法加这两个就不用再回到他们表再查了

记住还需保证冗余字段的数据一致，cascade 级联值得学习

![image-20220824161553329](http://image.zzq8.cn/img/202208241615461.png)



> 场景：添加一些不属于表里的字段（extends + 额外字段） / 只需表里几个字段，最好还是单独新建一些 VO... 把每种不同对象按照功能进行了不同的划分



### Object 划分

PO：各种 Entity

TO：微服务之间互相调用传输数，封装和发送出去的对象就是 TO

* 跨服务 OpenFeign 时，to包放common

VO：View Object 视图对象

* 接受页面传递来的数据，封装对象 
* 将业务处理完成的对象，封装成页面要用的数据





### 常用的封装类

>==要把 VO 的属性复制到 PO，一个个 set 很麻烦： BeanUtils==
>
>```java
>    public void saveAttr(AttrVo attr) {
>        AttrEntity attrEntity = new AttrEntity();
>//        attrEntity.setAttrName(attr.getAttrName());
>        BeanUtils.copyProperties(attr,attrEntity);
>    }
>```
>
>
>
>> spring 有一个工具类 StringUtils 
>>
>> 判断字符串是不是为空...很方便
>
>
>
>> 判断集合是不是空
>>
>> ```
>> if(!CollectionUtils.isEmpty(attrIds))
>> ```
>
>
>
>> 封装的 R 返回数据
>>
>> ```
>> public class R extends HashMap<String, Object>
>> ```







> 用map接参的，会挨锤的   map 开发一时爽，维护火葬场
>
> @RequestParam Map<String, Object> params







字段：属性类型[0-销售属性，1-基本属性，2-既是销售属性又是基本属性]

像这种字段，最好搞一个枚举常量。这样数据库更改规则了，我们只需要更改一下枚举类！

感觉和 接口类 = 实现类 的设计感觉一样，后面要换实现类了只用换实现类一个地方







Controller 与 Service 关系：Controller应该只需三句话           1（参数）、3（调用Service） 和 return

> 1、Controller：处理请求，接收和效验数据
>
> 2、Service接收Controller传来的数据，进行业务处理
>
> 3、Controller接收Service处理完的数据，封装页面指定的vo



### 技巧

==在线解析 Json  的网站，有可以把 Json 转成 Java 对象！！！==





### idea占用内存过大，服务过多

[JavaGuide 最重要的 JVM 参数总结](https://javaguide.cn/java/jvm/jvm-parameters-intro.html#_2-1-%E6%98%BE%E5%BC%8F%E6%8C%87%E5%AE%9A%E5%A0%86%E5%86%85%E5%AD%98%E2%80%93xms%E5%92%8C-xmx) 

给每一个微服务设置：`-Xmx100m`  注意：**内存调大 JMeter 压测吞吐量也会上来**

![image-20220828170939115](http://image.zzq8.cn/img/202208281709300.png)





### 为了方便重启一部分服务可以用，Compound 包起来

![image-20220828171101974](http://image.zzq8.cn/img/202208281711096.png)





### 集群负载均衡，取巧

为了下一章节演示nacos的负载均衡，参照9001新建9002

这里**取巧**不想新建重复体力劳动，可以利用IDEA功能，直接拷贝**虚拟端口映射**

![在这里插入图片描述](http://image.zzq8.cn/img/202208281717252.png)

![image-20220828171758542](http://image.zzq8.cn/img/202208281717694.png)

或 Environment variables: --server.port=9002



#### 后端加了事务 @Transactional 还没提交前的语句看不到数据库的变换

为了测试方便，将当前会话的隔离级别降低。有了它就可以很方便的看数据库的变化了，可读到没有提交的数据。

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

Navicat要在加一行SELECT * FROM `pms_spu_info`; 在当前窗口（一个会话）搜索数据才能读到

```mysql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT * FROM `pms_spu_info`;
```



### 踩坑

好使

stream() -> map() -> filter() -> collect()





### 采购

<img src="http://image.zzq8.cn/img/202208282303184.png" alt="image-20220828224528971" style="zoom: 67%;" />







### 用好数据库连接池：

[场景：springboot项目启动开始可以访问数据库，但是几分钟之后就会报错](https://blog.csdn.net/cobracanary/article/details/105257594)

idea报错信息：

```bash
HikariPool-1 - Failed to validate connection com.mysql.cj.jdbc.ConnectionImpl@18e7d21c (No operations allowed after connection closed.). Possibly consider using a shorter maxLifetime value.
```

那么问题就很明了，你的连接在三分钟的时候就已经和数据库断开了连接，但是你默认连接的存活时间是五分钟，所以导致你的springboot项目开始能访问数据库，一会之后就不能访问数据库了

Data source rejected establishment of connection,  message from server: "Too many connections"



```
MAX_LIFETIME = TimeUnit.MINUTES.toMillis(30L);
```



# 五、基础篇总结

#### 从商品保存开始就对业务走马观花，都是CV没去自己写



SpringBoot 2.0 基于 Spring 5 最大的变化就是引入了 React（响应式编程）->   Web Flux（可以非常容易的创建出高性能、高并发的 Web 应用）

例如：Gateway 的跨域 Filter 网关，CorsWebFilter 它是属于 Webflux





# 摘自评论

耗时三个月断断续续敲完，高级篇功能打通，准备面试！
文档地址：https://www.cnblogs.com/JuneQS/p/projectdemo.html
项目地址：https://gitee.com/JuneQ/mall-project
演示地址：http://projectdemo.top



边工边敲历经52天，终于结束了，集群篇因为电脑拉胯只能看




恭喜尚硅谷破百万关注，历时半年艰难学完一把辛酸泪（因为平时有工作），给点建议给想学和正在学的小伙伴
1、如有条件电脑内存至少16G起步，条件进一步加个屏幕，条件更进一步租一台至少4G内存的X86架构云服务器，所有部署的东西全扔云服务器上
2、P16，P17没法搭起来的建议照着rerenfast的github上的教程搭
3、项目搭起来后，每学完一章一定要用git提交一次，不然后续排错会令人崩溃
4、多记笔记，尤其是分布式，架构，锁相关的知识，有利于面试
5、IDEA的jrebel插件和ResetfulTool插件至少能提高一半的学习效率，必用
6、这章实在找不到解决办法看下弹幕，其余情况一律关闭
7、Maven依赖版本号一定要一模一样（除非你知道高版本怎么配置）
8、当前章节没达到老师的效果不要继续往下做，这个项目是线性的，你卡在这个环节后面基本也很难做下去，直到P325
9、单纯想学后端东西的，前端代码照抄，P28-P44跳过
10、ES的内存分配不要128MB，要256MB起步，商品上架的测试数据建议和老师的一模一样（除了图片），不然不好对照
11、nginx可以不用部署在服务器上，有windows版可以本地运行，跳过穿透
12、单点登录有条件直接用github的，不要用微博的，提高效率，可以用api.github.com/user这个接口
13、支付宝沙箱每周日12:00至每周一12:00维护不可用
14、个人认为新增商品，商品上架，保存订单数据，支付这四个功能为该项目最折磨人功能，一P能卡一两天
15、P100之前的内容属于当前JAVA后端能找到工作的最基本水平
16、调试环节是必要的，一定要跟着学，不会调试通过试用期堪忧
17、实际大多数公司的项目技术难点和涵盖范围不如这个项目（所以好多人边上班边学啊）

4、12



大佬，这个项目到底能不能写在简历中，很多人说，第一：商城项目烂大街。第二：这个项目涵盖的太多，如果面试官问的太多，可能有难度

不可以直接写，把知识点穿插写到你的其他项目里就行了，比如你写一个后台系统，防止表单重复提交你用到了鼓粒商城提交订单的幂等性设计，注册登录用到了QQ或者微信的单点登录，如果有定时任务就参考秒杀系统的定时任务设计
