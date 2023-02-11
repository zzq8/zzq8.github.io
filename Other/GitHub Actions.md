# [GitHub Actions](https://docs.github.com/en/actions)

> [100秒解释什么是DevOps CI/CD 中国DevOps社区](https://www.bilibili.com/video/BV1C34y1t79H/?spm_id_from=333.788.recommend_more_video.1&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)
>
> [【CICD】github新功能actions全方位讲解！！](https://www.bilibili.com/video/BV1RE411R7Uy/?spm_id_from=333.337.search-card.all.click&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)
>
> 起因：LeetCode 自动打卡签到领积分        可见Actions可以拿来跑一些好用的脚本，例如定时签到类的 / 看视频感觉更多的是持续集成
>
> 1）可以围绕自己的仓库做一些流程自动化
>
> 2）CI/CD代表`持续集成`和`持续交付`  自动化构建部署    **Continuous Integration/Continuous Deployment**
>
> ​	CI：新代码更新集成到现有的代码库中（GitHub Actions就是这个服务）
>
> 
>
> **CI/CD提供了如下两个主要的好处：它可以帮助你将原本必须由开发人员手动完成的事情自动化（应用交付给客户时候需要经过三个步骤：测试、构建、部署），从而提高你的速度；它也会在小问题发展成重大灾难之前及早地发现它们，从而提高代码质量。**
>
> Devops的核心实践之一是持续集成：好像是有个CI服务器。就是为了避免下面的问题。   我理解：GitHub Actions不同的是	不需要CI服务器了，直接GitHub提供云中的Linux容器给你操作  1）get code 2）setup node 3）test/build/dploy
>
> My：持续集成的流水线，以前的问题 码农1写了个API 码农2也写了一个UI  但是合并时候发现不兼容  **合并地狱**就需要推翻。而CI/CD会持续集成，每天提交的都会Actions跑看有没有问题。Actions里面写了测试...有问题就会马上显示出来！    
>
>
> https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html

一个简单的实例：actions GitHub的官方用户

```yaml
name:MYCI
on:
  #GitHub Action on:schedule 到指定时间执行任务 / on:push 就是推送就执行
  push:
    branches:
    - master
    paths:
    - src/*
jobs:
  #任务名字可随意
  jobl:
    #是个枚举一般用这个可以了
    runs-on: ubuntu-latest
    steps: #拷贝代码 输出hello 
    #这里可用 git clone xxx 将代码拷贝，但是还要cd到目录/代码私有麻烦。 GitHub考虑到了用下面的省事
    #这里是复用GitHub的流程，其实它有个用户叫actions仓库叫checkout（看了确实是！）  封装了下载代码的流程
    - uses: actions/checkout@vl
    #运行shell
    - run: echo hello
```



LeetCode的示例：

```yaml
name: auto action runner
run-name: ${{ github.actor }} is running
on:
  schedule:
    - cron: '50 16 * * *'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
	
	  #理解了 user/repositoty/release version 下面三条就好理解都是装环境，能指定版本是因为ubuntu里全装了
      - name: Node
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        id: pnpm-install
        with:
          version: 7
          run_install: false

      - name: Install dependencies
        run: pnpm install

      - name: run
        run: pnpm dev ${{ secrets.ACCOUNT }} ${{ secrets.PASSWORD }}
```





敏感信息放setting里面有个secrets可以设置 ${{}} 引用

可以放个 Docker 在它里面放node的iamge

可以跑个 nginx run的时候curl localhost:8080 是可以证明跑成功的