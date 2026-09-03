/**
 * 资源列表页（/resources.html）的检索组件：数据来自构建期扫描
 * public/resources 生成的临时模块（config.ts 的
 * vuepress-plugin-resources-index），提供按文件名 / 目录的即时过滤。
 * 静态资源在 public 下只做拷贝、没有路由，因此文件链接全部新标签打开。
 */
import { computed, defineComponent, h, ref } from "vue";
import { withBase } from "vuepress/client";

interface ResourceItem {
  path: string;
  name: string;
  dir: string;
  ext: string;
  size: number;
  mtime: number;
}

// 构建期生成的临时模块，无类型声明，形状见 ResourceItem
// @ts-expect-error
import { resources } from "@temp/resources/list.js";

const formatSize = (size: number): string =>
  size >= 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} MB`
    : size >= 1024
      ? `${Math.round(size / 1024)} KB`
      : `${size} B`;

const formatDate = (ms: number): string =>
  new Date(ms).toLocaleDateString("zh-CN");

export default defineComponent({
  name: "ResourceList",

  setup() {
    const query = ref("");

    const filtered = computed(() => {
      const keyword = query.value.trim().toLowerCase();
      if (!keyword) return resources as ResourceItem[];
      return (resources as ResourceItem[]).filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.dir.toLowerCase().includes(keyword),
      );
    });

    // 按目录分组展示，组内保持索引的排序顺序
    const groups = computed(() => {
      const map = new Map<string, ResourceItem[]>();
      for (const item of filtered.value) {
        const list = map.get(item.dir) ?? [];
        list.push(item);
        map.set(item.dir, list);
      }
      return [...map.entries()];
    });

    return () => [
      h("input", {
        class: "resources-search",
        type: "search",
        placeholder: "输入关键词过滤文件名 / 目录…",
        value: query.value,
        onInput: (event: Event) => {
          query.value = (event.target as HTMLInputElement).value;
        },
      }),
      h(
        "p",
        { class: "resources-count" },
        filtered.value.length > 0
          ? `共 ${filtered.value.length} 个文件`
          : "没有匹配的资源",
      ),
      ...groups.value.map(([dir, items]) => [
        h(
          "h2",
          { class: "resources-dir", key: dir },
          dir === "" ? "根目录" : dir,
        ),
        h(
          "ul",
          { class: "resources-list", key: `${dir}-list` },
          items.map((item) =>
            h("li", { key: item.path }, [
              h(
                "a",
                {
                  href: withBase(encodeURI(item.path)),
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                item.name,
              ),
              h(
                "span",
                { class: "resources-meta" },
                `${item.ext || "其他"} · ${formatSize(item.size)} · ${formatDate(item.mtime)}`,
              ),
            ]),
          ),
        ),
      ]),
    ];
  },
});
