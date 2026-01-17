import { navbar } from "vuepress-theme-hope";

// 图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// https://fontawesome.com/search?m=free&o=r
// 专题话题的路径需在尾部添加 /，否则有可能出现链接错误。比如下方「生活」中的 baby/
export default navbar([
  { text: "浮生杂记", icon: "streamline-plump-color:fish", link: "/blog" },
  { text: "代码笔记", icon: "tabler:code", link: "/" },
  {
    text: "资源宝库",
    icon: "iconoir:book-solid",
    // prefix: "/",
    children: [
      {
        text: "alist",
        icon: "ic:baseline-source",
        target: "_blank",
        link: "https://alist.233377.xyz/",
      },
      {
        text: "书籍影音",
        icon: "mi:book",
        link: "/coding/Reading.html",
      }
    ],
  },{
    text: "网站相关",
    icon: "material-symbols:person",
    children: [
      { text: "关于作者", icon: "noto-v1:person-bowing", link: "intro" },
      {
        text: "更新历史",
        icon: "material-symbols:history",
        link: "/timeline/",
      },
    ],
  },
]);
