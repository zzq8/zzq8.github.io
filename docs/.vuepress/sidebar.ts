import { sidebar } from "vuepress-theme-hope";

// 图标文档：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// 图标库: https://icon-sets.iconify.design/
// "" 兜底所有页面（含首页——nav「代码笔记」就链到首页），只放代码笔记分组。
// 博客文章详情页（/posts/）在 theme.ts 的 locales["/posts/"] 里整体关掉 sidebar。
// 注意：item 的 prefix 与兜底 key 的拼配——主题会把「key + item.prefix」
// 无脑拼成 sidebarData 的数据 key（"" + "/coding/" → "/coding/" ✓），
// 而运行时对以 / 开头的 prefix 原样引用，两边要对得上，拼错了就是 undefined.map
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
});
