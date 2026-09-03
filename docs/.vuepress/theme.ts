import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme(
  {
    // 主题选项：https://theme-hope.vuejs.press/zh/config/theme/layout.html
    hostname: "https://233377.xyz",
    author: {
      name: "Piglet",
      url: "https://233377.xyz",
    },

    favicon: "/favicon.ico",
    logo: "/logo.png",

    // 加密配置
    encrypt: {
      config: {
        "/posts/Encrypt/": ["zzq", "123", "123456"],
        "/coding/08-Coding-Practice/": ["123"],
      },
    },

    // 网站文章的版权声明
    license: "CC BY-NC-ND 4.0",

    // copyright 默认为 Copyright © <作者>
    copyright: `
  版权声明：自由转载 - 非商用 - 非衍生 - 保持署名<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">（创意共享 4.0 许可证）</a>|
  Copyright © 2026-present Piglet
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

    // 覆盖主题自带 zh 文案里的两处问题（vuepress-theme-hope 的 routerLocales）：
    // 1. skipToContent 是「跳至主要內容」，「內」是繁体字。这条只有读屏软件会念到，
    //    但它是全站每一页的第一个可聚焦元素。
    // 2. 404 的四条提示只表达情绪，不说明发生了什么、下一步能做什么。
    // routerLocales 不在 LayoutLocaleOptions 的类型里（只在 LayoutLocaleData 上），
    // 但 getThemeData 会把 locales["/"] 整体并进 locale data，运行时生效。
    locales: {
      "/": {
        routerLocales: {
          skipToContent: "跳到主要内容",
          notFoundTitle: "页面不存在",
          notFoundMsg: [
            "这个地址下没有内容，可能已经改名或移走了。",
            "链接失效了。可以用上方搜索找标题，或从下面两个入口继续。",
          ],
          back: "返回上一页",
          home: "回到首页",
        },
      },
      // 博客文章详情页不显示侧边栏（sidebar.ts 里对应 key 已删）：
      // items 为空时 MainLayout 会连布局一起去掉侧栏
      "/posts/": {
        sidebar: false,
      },
    } as never,

    // 深色模式：toggle（默认浅色 + 一键切深色），不用 switch 的三态 auto——
    // 站点大量近白底截图，深色模式下会整篇变成灯箱；宣纸浅色即是设计主张
    darkmode: "toggle",
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
      avatar: "https://image.233377.xyz/1024/me.jpg",
      description: "Stay Hungry, Stay Foolish",
      intro: "/intro.html",
      medias: {
        Email: "mailto:547061946@qq.com",
      },
    },

    // 隐藏打印按钮
    // print: false,
    plugins: {
      blog: {
        article: "/article/",
        // XD 学一下这个，想实现如下效果   捣鼓蛮久，不会构建这个 filter！！！
        // https://theme-hope.vuejs.press/zh/config/plugins/blog.html#plugins-blog-filter
        filter: (page) =>
          page.filePathRelative?.startsWith("_posts/") &&
          !page.frontmatter.home,
        // excerpt 默认开启：列表卡片显示正文截取的摘要（观感由 index.scss 的
        // .vp-article-excerpt 摊平 + 三行截断接管）；excerptLength 用默认 300 字符
      },

      // git 插件不加配置，让主题默认记录 updatedTime，
      // 页面底部才能显示「最近更新: <日期>」（配合去掉 changelog）

      // icon: {
      //   // 关键词: "iconify", "fontawesome", "fontawesome-with-brands"
      //   assets: ["fontawesome", "iconify", "fontawesome-with-brands"],
      // },

      // 评论配置（Giscus）
      comment: {
        // Giscus
        provider: "Giscus",
        repo: "zzq8/zzq8.github.io",
        repoId: "R_kgDOI6WnBg",
        category: "General",
        categoryId: "DIC_kwDOI6WnBs4Cf8ho",
      },

      // 组件库（Badge / BiliBili 全站未使用，已移除；VidStack 被 _posts 一篇文章使用）
      components: {
        components: ["VidStack"],
      },

      // 站点数据，https://localhost/sitemap.xml
      // 踩坑一下午：处理依赖冲突问题！
      sitemap: {
        devServer: true,
        devHostname: "http://localhost:8080",
      },

      // Algolia 全文搜索：需要自己设置爬虫并生成下方配置，如不会自己设置，启用下方本地搜索
      docsearch: {
        // XDD：用这个搜索踩坑两天，场景：有数据但是vuepress去搜不到，解决：爬虫指定 lang 这个配置硬是找不到
        // appId, apiKey [前这两个通用的, 随便换index都是] 和 indexName 是必填的
        appId: "ADSVTUJF43",
        apiKey: "ce680cd766327882764fa072b3b72216",
        indexName: "233377.xyz",
      },

      feed: {
        atom: true,
        json: true,
        rss: true,
        count: 10,
        sorter: (a, b) =>
          Number(b.frontmatter.date) - Number(a.frontmatter.date),
      },
    },

    // changelog 默认关闭：文章底部的「更新日志」区块去掉，
    // PageMeta 会自动渲染「最近更新: <日期>」（plugin-git 的 latestUpdateAt 文案）

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
      // plantuml: true,  // 新版的 typora 还是不支持

      highlighter: {
        collapsedLines: false, // 禁用代码块折叠，代码块始终完整展开
        // shiki 代码高亮主题：逐个量过内置主题后，github 高对比版是唯一
        // 各 token 都过 4.5:1 的（默认 one-light 的注释对比度偏低，代码块里
        // 大量中文注释时尤其明显）
        themes: {
          light: "github-light-high-contrast",
          dark: "github-dark-high-contrast",
        },
      },
    },
  },
  // 第二个参数是行为选项（ThemeBehaviorOptions）：custom 开启「主题源码模式」，
  // webpack 会注入 custom condition，@theme-hope/* 从 lib/client 源码解析而非
  // 预打包 bundle——config.ts 的 ArticleList alias 替换依赖这一点
  { custom: true },
);
