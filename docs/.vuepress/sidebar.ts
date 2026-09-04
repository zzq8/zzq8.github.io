import { sidebar } from "vuepress-theme-hope";

// 图标文档：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// 图标库: https://icon-sets.iconify.design/
// "" 兜底所有页面（含首页——nav「代码笔记」就链到首页），只放代码笔记分组。
// 博客文章详情页（/posts/）由 config.ts 的 posts-no-sidebar 插件注入
// frontmatter.sidebar: false 整体关掉（theme 选项 locales 的自定义 key 在
// 单语言站点不生效，故不走 locale 配置）。
// 注意：item 的 prefix 与兜底 key 的拼配——主题会把「key + item.prefix」
// 无脑拼成 sidebarData 的数据 key（"" + "/coding/" → "/coding/" ✓），
// 而运行时对以 / 开头的 prefix 原样引用，两边要对得上，拼错了就是 undefined.map
// 书籍两个 key 必须写文件夹原始名（含 &）——构建期按原始 filePathRelative
// 收结构、运行时用 decodeURI(routePath) 前缀匹配 key；& 书的路由被 config.ts
// 的 book-ampersand-path 插件还原成原始路径，两边才对得上
export default sidebar({
  "": [
    // 指定显示页面
    {
      text: "代码笔记",
      icon: "fluent-color:code-20",
      prefix: "/coding/",
      // collapsible: true,
      link: "/coding/_README",
      expanded: true,
      children: "structure",
    },
  ],
  "/《Java面试指北》/": [
    {
      text: "《Java面试指北》",
      icon: "tabler:brand-java",
      link: "/《Java面试指北》/",
      expanded: true,
      children: "structure",
    },
  ],
  "/《后端面试高频系统设计&场景题》/": [
    {
      text: "《后端面试高频系统设计&场景题》",
      icon: "tabler:sitemap",
      link: "/《后端面试高频系统设计&场景题》/",
      expanded: true,
      children: "structure",
    },
  ],
});
