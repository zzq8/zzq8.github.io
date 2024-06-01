import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "代码笔记", icon: "code", link: "/studynotes/" },
  { text: "浮生杂记", icon: "fish-fins", link: "/daily/" },
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