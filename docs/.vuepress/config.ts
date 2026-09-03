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
