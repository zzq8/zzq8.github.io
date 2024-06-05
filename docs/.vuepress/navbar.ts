import { navbar } from "vuepress-theme-hope";

// 图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// https://fontawesome.com/search?m=free&o=r
// 专题话题的路径需在尾部添加 /，否则有可能出现链接错误。比如下方「生活」中的 baby/
export default navbar([
  { text: "浮生杂记", icon: "fa-solid fa-fish", link: "/blog" },
  { text: "代码笔记", icon: "fa-solid fa-code", link: "/code/" },
  // { text: "浮生杂记", icon: "fish-fins", link: "/daily/" },
  {
    text: "资源宝库",
    icon: "book",
    prefix: "/resources/",
    children: [
      {
        text: "书籍资源",
        icon: "book-open",
        link: "books/",
      },
      {
        text: "影音资源",
        icon: "play",
        link: "videos/",
      },
      {
        text: "Demo",
        icon: "fa-solid fa-handshake",
        link: "demo/",
      },
    ],
  },{
    text: "网站相关",
    icon: "id-card",
    children: [
      { text: "关于作者", icon: "user", link: "/about-the-author/" },
      {
        text: "更新历史",
        icon: "history",
        link: "/timeline/",
      },
    ],
  },
]);
