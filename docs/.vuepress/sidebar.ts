import { sidebar } from "vuepress-theme-hope";

// 图标文档：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// 图标库: https://fontawesome.com/search?m=free&o=r
export default sidebar({
  //"" -> http://localhost:8080/xx  代表 xx 不填就是首页
  "": [
    // 指定显示页面
    {
      text: "代码编程",
      icon: "fa-solid fa-code",
      prefix: "/coding/",
      children: "structure",
    },
    {
      text: "博客文章",
      icon: "fa-solid fa-feather-pointed",
      prefix: "/_posts/",
      link: "/blog",
      collapsible: true,
      children: "structure",
    },
  ],
});
