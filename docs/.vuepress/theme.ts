import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  // 主题选项：https://theme-hope.vuejs.press/zh/config/theme/layout.html
  hostname: "https://zzq8.cn",
  author: {
    name: "Piglet",
    url: "https://zzq8.cn",
  },

  favicon: "/favicon.ico",
  logo: "/logo.png",

  // 加密配置
  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
      "/posts/personal/": ["zzq", "123", "123456"],
      "/coding/StudyList.html": ["zzq", "123", "123456"],
      "/coding/08-Coding-Practice/": ["123"],
    },
  },

  // 网站文章的版权声明
  license: "CC BY-NC-ND 4.0",

  // copyright 默认为 Copyright © <作者>
  copyright: `
  版权声明：自由转载 - 非商用 - 非衍生 - 保持署名<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">（创意共享 4.0 许可证）</a>|
  Copyright © 2026-present Piglet</a>
  `,
  displayFooter: true,
  // 页脚，支持使用 HTMLString 以显示备案信息等
  // footer: `CC BY-NC-ND 4.0 Licensed`,

  // 是否全局启用路径导航
  breadcrumb: false,

  // 页面元数据：贡献者，最后修改时间，编辑链接
  contributors: false,
  lastUpdated: true,
  editLink: false,

  // 深色模式配置
  darkmode: "switch",
  // 全屏按钮
  fullscreen: true,

  // 默认为 GitHub. 同时也可以是一个完整的 URL
  repo: "https://github.com/zzq8/zzq8",
  // 自定义仓库链接文字。默认从 `repo` 中自动推断为 "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
  repoLabel: "GitHub",
  // 是否在导航栏内显示仓库链接，默认为 `true`
  repoDisplay: true,
  // 文档存放路径
  docsDir: "docs",

  // navbar
  navbar: navbar,
  // 导航栏布局
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    // "SocialLink", "Repo",
    end: ["SocialLink", "Outlook", "Search"],
  },
  // 是否在向下滚动时自动隐藏导航栏
  // navbarAutoHide: "always",

  // sidebar
  sidebar: sidebar,
  // 侧边栏排序规则
  // sidebarSorter: ['readme', 'order', 'title'],

  // 页面布局 Frontmatter 配置：https://theme-hope.vuejs.press/zh/config/frontmatter/layout.html#pageinfo
  pageInfo: ["Category", "Tag", "Word", "ReadingTime", "PageView"],

  // 主题功能选项：https://theme-hope.vuejs.press/zh/config/theme/feature.html
  blog: {
    articleInfo: ["Date", "PageView", "Category", "Tag", "ReadingTime"],
    name: "Piglet",
    avatar: "https://images.zzq8.cn/1024/me.jpg",
    description: "Stay Hungry, Stay Foolish",
    intro: "/intro.html",
    medias: {
      Email: "mailto:547061946@qq.com"
    },
  },

  // 隐藏打印按钮
  // print: false,
  plugins: {
    blog: {
      article: "/article/",
      // XD 学一下这个，想实现如下效果   捣鼓蛮久，不会构建这个 filter！！！
      filter: page => page.filePathRelative?.startsWith('_posts/') && !page.frontmatter.home,
      excerptLength: 50
    },

    git: {
      updatedTime: false
    },

    // icon: {
    //   // 关键词: "iconify", "fontawesome", "fontawesome-with-brands"
    //   assets: ["fontawesome", "iconify", "fontawesome-with-brands"],
    // },

    // 评论配置（仅做样例，记得更换）
    comment: {
      /*
      // 在本地运行 `pnpm docs:dev` 并使用非 localhost 域名时，容易出现 403 错误，移除本部分即可解决
      provider: "Waline",
      serverURL: "https://waline.newzone.top",
      reaction: [
        "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/twemoji/13.1.0/72x72/1f44d.png",
        "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/twemoji/13.1.0/72x72/1f44f.png",
        "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/twemoji/13.1.0/72x72/1f60e.png",
        "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/twemoji/13.1.0/72x72/1f602.png",
        "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/twemoji/13.1.0/72x72/1f635-200d-1f4ab.png",
      ],
      // 部署 Waline：https://waline.js.org/guide/get-started.html
      // pageview: true, // 浏览量统计
      locales: {
        "/": {
          // 表情互动提示文字
          reactionTitle: "已到达文章底部，欢迎留言、表情互动~",
          reaction0: "赞一个",
          reaction1: "支持下",
          reaction2: "有点酷",
          reaction3: "啥玩意",
          reaction4: "看不懂",
          // Waline 等级标签
          admin: "盛年不重来，一日难再晨",
          level0: "锻体",
          level1: "炼气",
          level2: "筑基",
          level3: "金丹",
          level4: "元婴",
          level5: "化神",
        },
      },
      */

      // Giscus
      provider: "Giscus",
      repo: "zzq8/zzq8.github.io",
      repoId: "R_kgDOI6WnBg",
      category: "General",
      categoryId: "DIC_kwDOI6WnBs4Cf8ho",
    },

    // 组件库
    components: {
      components: ["Badge", "BiliBili", "VidStack"],
    },

    // 站点数据，https://localhost/sitemap.xml
    // 踩坑一下午：处理依赖冲突问题！
    sitemap: {
      devServer: true,
      devHostname: 'http://localhost:8080'
    },

    // Algolia 全文搜索：需要自己设置爬虫并生成下方配置，如不会自己设置，启用下方本地搜索
    docsearch: {
      // XDD：用这个搜索踩坑两天，场景：有数据但是vuepress去搜不到，解决：爬虫指定 lang 这个配置硬是找不到
      // appId, apiKey [前这两个通用的, 随便换index都是] 和 indexName 是必填的
      appId: "ADSVTUJF43",
      apiKey: "ce680cd766327882764fa072b3b72216",
      indexName: "upor.xyz",
    },

    // 本地搜索，和上方二选一
    slimsearch: {
      // 索引全部内容
      indexContent: true,
    },

    feed: {
      atom: true,
      json: true,
      rss: true,
      count: 10,
      sorter: (a, b) => Number(b.frontmatter.date) - Number(a.frontmatter.date),
    },

    
  },

  changelog: true,

  // 开发模式下是否启动热更新，显示所有更改并重新渲染
  hotReload: true,

  // 禁用不需要的配置
  // https://plugin-md-enhance.vuejs.press/zh/guide/
  markdown: {
    sub: true, // 上下角标
    sup: true,
    tasklist: true, // 任务列表
    figure: true, // 启用 figure
    imgLazyload: true, // 启用图片懒加载
    // imgMark: true, // 启用图片标记
    imgSize: true, // 启用图片大小
    include: true, //导入文件
    component: true, // 使用 component 代码块来在 Markdown 中添加组件
    footnote: true,
    // tabs: true, // 选项卡
    alert: true, // GFM 警告
    attrs: true, // 使用特殊标记为 Markdown 元素添加属性
    hint: true, // 提示容器
    mark: true, // 使用 == == 进行标记。请注意两边需要有空格。
    align: true, // 启用自定义对齐
    // codetabs: true, // 代码块分组
    // demo: true, //代码演示

    mermaid: true,
  },

});
