import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { webpackBundler } from "@vuepress/bundler-webpack";
import { defineUserConfig } from "vuepress";
import type { App } from "vuepress";

import theme from "./theme.js";

// public/resources 资源索引：public 目录只做静态拷贝、不会生成页面，
// 「资源列表」页（/resources.html）的数据只能构建期扫描目录生成，
// 写成临时模块供 ResourceList 组件静态 import（与主题 sidebarData 同套路）
interface ResourceItem {
  path: string;
  name: string;
  dir: string;
  ext: string;
  size: number;
  mtime: number;
}

const writeResourcesIndex = async (app: App): Promise<void> => {
  const root = app.dir.source(".vuepress/public/resources");
  const items: ResourceItem[] = [];
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      // .DS_Store 是 macOS 垃圾文件；.zshrc 等其它点文件是分享内容，保留
      if (entry.name === ".DS_Store") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      const rel = path.relative(root, full).split(path.sep).join("/");
      const { size, mtimeMs } = fs.statSync(full);
      const dirname = path.dirname(rel);
      items.push({
        path: `/resources/${rel}`,
        name: entry.name,
        dir: dirname === "." ? "" : dirname,
        ext: path.extname(entry.name).replace(/^\./, "").toLowerCase(),
        size,
        mtime: mtimeMs,
      });
    }
  };
  if (fs.existsSync(root)) walk(root);
  items.sort((a, b) =>
    a.path.localeCompare(b.path, "zh-Hans-CN", { numeric: true }),
  );
  await app.writeTemp(
    "resources/list.js",
    `export const resources = ${JSON.stringify(items)};\n`,
  );
};

// ---------- 文档级加密：frontmatter 写 `encrypt: true`（密码默认 123）----------
// 或 `encrypt: "自定义密码"`。主题加密按「路径前缀 + bcrypt token」工作
// （客户端 usePathEncrypt 匹配 themeData.encrypt.config，LocalEncrypt 弹
// 密码框，SSR 不输出正文），而 themeData 由主题内部插件在 onPrepared 写入
// 临时文件、此时页面均已创建——本插件在其后运行（用户插件注册晚于主题），
// 读取该临时 JSON，把加密页的 route path 补进 encrypt.config 后重写，
// 完全复用主题现成的密码弹窗与会话/本地记忆逻辑。

// 密码 → bcrypt 哈希（带缓存；bcrypt-ts 由 vuepress-theme-hope 依赖携带，
// pnpm 隔离下须经其真实路径解析）
const passwordHashes = new Map<string, string>();
const hashPassword = (password: string): string => {
  const cached = passwordHashes.get(password);
  if (cached) return cached;
  const themePkg = fileURLToPath(
    new URL(
      "../../node_modules/vuepress-theme-hope/package.json",
      import.meta.url,
    ),
  );
  const { hashSync } = createRequire(fs.realpathSync(themePkg))(
    "bcrypt-ts/node",
  );
  const hash: string = hashSync(password);
  passwordHashes.set(password, hash);
  return hash;
};

const patchFrontmatterEncrypt = async (app: App): Promise<void> => {
  const pages = app.pages.filter((page) => {
    const value = page.frontmatter.encrypt;
    return value === true || (typeof value === "string" && value.length > 0);
  });
  if (pages.length === 0) return;
  const file = app.dir.temp("internal/themeData.js");
  if (!fs.existsSync(file)) return;
  const content = await fs.promises.readFile(file, "utf8");
  const matched = content.match(/JSON\.parse\(("(?:[^"\\]|\\.)*")\)/);
  if (!matched) return;
  const themeData = JSON.parse(JSON.parse(matched[1]));
  const encrypt = (themeData.encrypt ??= {});
  encrypt.config ??= {};
  for (const page of pages) {
    const value = page.frontmatter.encrypt;
    // 主题客户端匹配用 decodeURI 后的路径（usePathEncrypt 的
    // startsWith(decodeURI(path), key)），page.path 是编码形式，须转回解码
    encrypt.config[decodeURI(page.path)] = {
      tokens: [hashPassword(value === true ? "123" : String(value))],
    };
  }
  // replace 的替换串必须用函数形式：bcrypt 哈希里的 $ 是 replace 特殊符号
  await app.writeTemp(
    "internal/themeData.js",
    content.replace(matched[1], () =>
      JSON.stringify(JSON.stringify(themeData)),
    ),
  );
};

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
    // 博客文章（_posts/）未在 frontmatter 写 date 时，取 git「最近更新」时间
    // 兜底（与页面底部「最近更新」同源：plugin-git 的 updatedTime）——主题 blog
    // 插件默认回落的是首次提交时间（createdTime）。用户插件注册晚于主题且
    // extendsPage 按注册顺序执行，此时 git 数据与主题写入的 routeMeta.date 均已
    // 定稿，故需自行补写两处：routeMeta.date（文章列表/时间轴的展示与排序）、
    // frontmatter.date（feed 排序与发布时间）
    {
      name: "vuepress-plugin-posts-updated-date",
      extendsPage: (page) => {
        if (!page.filePathRelative?.startsWith("_posts/")) return;
        if (page.frontmatter.date) return;
        const updatedTime = (
          page.data.git as { updatedTime?: number } | undefined
        )?.updatedTime;
        if (!updatedTime) return;
        page.frontmatter.date = new Date(updatedTime);
        page.routeMeta.date = updatedTime;
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
    // 资源索引页数据源：构建/启动时扫一次；dev 期间监听目录变动重建索引
    // （dev server 对 public 有静态 watch，webpack 对 temp 模块有编译 watch，
    // 索引重写后页面会自动更新）。chokidar 未被项目直接依赖，用原生 fs.watch
    {
      name: "vuepress-plugin-resources-index",
      onPrepared: (app) => writeResourcesIndex(app),
      onWatched: (app, watchers) => {
        const root = app.dir.source(".vuepress/public/resources");
        if (!fs.existsSync(root)) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const watcher = fs.watch(root, { recursive: true }, () => {
          clearTimeout(timer);
          // 批量拷贝文件会连发一堆事件，防抖后重扫
          timer = setTimeout(() => void writeResourcesIndex(app), 300);
        });
        watchers.push(watcher as (typeof watchers)[number]);
      },
    },
    // frontmatter 加密：加密页与主题路径加密页行为对齐（不进 feed/seo/sitemap，
    // 且不生成摘要——主题靠 excerptFilter 排除路径加密页，这里手动对齐，否则
    // meta description / 博客列表卡片摘要会泄漏正文片段），路径 → 密码条目在
    // onPrepared 末尾注入 themeData（见上方说明）
    {
      name: "vuepress-plugin-frontmatter-encrypt",
      extendsPage: (page) => {
        const value = page.frontmatter.encrypt;
        if (value !== true && !(typeof value === "string" && value.length > 0))
          return;
        page.frontmatter.feed = false;
        page.frontmatter.seo = false;
        page.frontmatter.sitemap = false;
        page.frontmatter.excerpt = false;
        delete page.frontmatter.description;
        delete page.data.excerpt;
        delete page.routeMeta.excerpt;
      },
      onPrepared: (app) => patchFrontmatterEncrypt(app),
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
