import { fileURLToPath } from "node:url";
import { webpackBundler } from "@vuepress/bundler-webpack";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  // 网站路径默认为主域名。如果网站部署在子路径下，比如 xxx.com/yyy，那么 base 应该被设置为 "/yyy/"
  base: "/",

  // 网站语言，默认为中文
  lang: "zh-CN",
  // 网站标题
  title: "Piglet",
  // 网站描述
  description: "自我提升笔记，记录并输出一切能让自己提升的知识。",

  theme,

  // 博客文章详情页（_posts/，路由经 sanitizeFileName 变为 /posts/）整体关掉侧边栏：
  // theme 选项 locales 里的自定义 key（如 "/posts/"）在单语言站点不生效——主题
  // locale 数据只按站点配置 locales 的 key 生成，自定义 key 会被静默丢弃。
  // 这里在页面数据序列化前注入 frontmatter.sidebar = false，items 为空时
  // MainLayout 会连布局一起去掉侧栏（新文章自动生效）
  plugins: [
    {
      name: "vuepress-plugin-posts-no-sidebar",
      extendsPage: (page) => {
        if (page.filePathRelative?.startsWith("_posts/")) {
          page.frontmatter.sidebar = false;
        }
      },
    },
    // 无一级标题的页面（page.title 为空，如 h1 写在代码围栏里）用文件名兜底：
    // 否则标题为空会走 resolveLinkInfo 的 `meta.title || path` 回落，侧边栏等
    // 处把路由路径（如 /coding/00-Inbox/Temp.html）直接当名字显示。
    // title 是基本类型，data.title / routeMeta.title 在页面创建时已按空值定下
    // （PageTitle 渲染 data.title，侧边栏标签走 routeMeta），需逐个覆盖；
    // README/index 是目录索引页，文件名无意义，跳过。
    // 主题的 extendsPage 先注册先执行，这里在其后覆盖 routeMeta 生效
    {
      name: "vuepress-plugin-fallback-title",
      extendsPage: (page) => {
        if (page.title || !page.filePathRelative) return;
        const filename =
          page.filePathRelative.split("/").pop()?.replace(/\.md$/i, "") ?? "";
        if (!filename || /^(readme|index)$/i.test(filename)) return;
        page.title = filename;
        page.data.title = filename;
        page.frontmatter.title = filename;
        page.routeMeta.title = filename;
      },
    },
  ],

  // 是否开启页面预拉取，如果服务器宽带足够，可改为 true，会提升其他页面加载速度
  shouldPrefetch: false,

  // 修改页面模板，https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/packages/theme/templates/index.build.html
  // 配置参考：https://vuepress.github.io/zh/reference/theme-api.html#templatebuild
  templateBuild: "./docs/.vuepress/templateBuild.html",

  // 禁止文件夹生成静态文件，参考 [VuePress 文档]（https://v2.vuepress.vuejs.org/zh/guide/page.html#routing）
  pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],

  bundler: webpackBundler({
    configureWebpack: (config): void => {
      config.resolve ??= {};
      config.resolve.alias ??= {};
      // 把主题的博客文章列表组件换成自己的实现（年份分组 + 文章新标签打开），
      // $ 表示精确匹配，不影响其他 @theme-hope 子路径。
      // 必须插到对象最前：主题已注册前缀 alias "@theme-hope"，webpack 按
      // 插入顺序匹配且首个命中即短路，后加的精确 key 永远轮不到
      config.resolve.alias = {
        "@theme-hope/components/blog/ArticleList$": fileURLToPath(
          new URL("./components/ArticleListByYear.ts", import.meta.url),
        ),
        ...config.resolve.alias,
      };
    },
  }),
});
