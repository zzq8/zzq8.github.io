/**
 * 覆盖主题的 ArticleList（经 config.ts 的 webpack alias 精确注入，原版见
 * vuepress-theme-hope/lib/client/components/blog/ArticleList.js）：
 * 1. 列表按年份分组，年份变化处插入「XXXX 年」标题。上游 useBlogType 的顺序
 *    不保证全局时间倒序（多目录文章会交错乱序），组件内先显式按日期倒序
 *    排序，否则同一年会出现多个重复的年份标题
 * 2. 点击文章标题 / 封面在新标签页打开
 * 分页、滚动定位、浏览量统计逻辑照抄原版。
 */
import type { PropType, VNode } from "vue";
import { isSupported, usePageview } from "@vuepress/plugin-comment/pageview";
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vuepress/client";
import ArticleItem from "@theme-hope/components/blog/ArticleItem";
import Pagination from "@theme-hope/components/blog/Pagination";
import DropTransition from "@theme-hope/components/transitions/DropTransition";
import { useBlogLocale } from "@theme-hope/composables/blog/useBlogLocale";
import { useBlogOptions } from "@theme-hope/composables/blog/useBlogOptions";
import "@theme-hope/styles/blog/article-list.scss";

interface ArticlePointer {
  info: { date?: number };
  path: string;
}

export default defineComponent({
  name: "ArticleList",

  props: {
    items: {
      type: Array as PropType<ArticlePointer[]>,
      required: true,
    },
  },

  slots: Object,

  setup(props, { slots }) {
    const route = useRoute();
    const router = useRouter();
    const blogLocale = useBlogLocale();
    const blogOptions = useBlogOptions();
    const updatePageview = usePageview();

    const currentPage = ref(1);
    const articlePerPage = computed(
      () => blogOptions.value.articlePerPage ?? 10,
    );

    // 年份分组要求严格的时间序，而上游顺序不可靠（主题内置 article type 的
    // sorter 受页面发现顺序影响，posts 与 coding 文章会交错）。这里按日期
    // 倒序显式排一份（无日期的视为最旧排最后），分页切片与分组都基于它
    const sortedItems = computed(() =>
      [...props.items].sort((a, b) => (b.info.date ?? 0) - (a.info.date ?? 0)),
    );

    const currentArticles = computed(() =>
      sortedItems.value.slice(
        (currentPage.value - 1) * articlePerPage.value,
        currentPage.value * articlePerPage.value,
      ),
    );

    const updatePage = async (page: number): Promise<void> => {
      currentPage.value = page;
      const query = { ...route.query };
      const needUpdate = !(
        query.page === page.toString() || // Page equal as query
        // Page is 1 and query is empty
        (page === 1 && !query.page)
      );
      if (needUpdate) {
        if (page === 1) delete query.page;
        else query.page = page.toString();
        await router.push({ path: route.path, query });
      }
      if (isSupported) {
        await nextTick();
        updatePageview({ selector: ".vp-pageview" });
      }
    };

    // 按年份分组渲染：文章日期是 UTC 时间戳，用于分组粒度足够
    const renderArticles = (): VNode[] => {
      const result: VNode[] = [];
      let lastYear: number | null = null;

      currentArticles.value.forEach(({ info, path }, index) => {
        const year = info.date ? new Date(info.date).getFullYear() : null;

        if (year !== null && year !== lastYear) {
          result.push(
            h(
              "h2",
              { class: "vp-article-year", id: `year-${year}` },
              `${year} 年`,
            ),
          );
          lastYear = year;
        }

        result.push(
          h(DropTransition, { appear: true, delay: index * 0.04 }, () =>
            h(ArticleItem, { key: path, info, path }, slots),
          ),
        );
      });

      return result;
    };

    // 点击文章标题 / 封面 → 新标签页打开
    // （捕获阶段先于浏览器默认导航执行，此时设置 target 即可生效）
    const openArticleInNewTab = (event: MouseEvent): void => {
      const anchor = (event.target as HTMLElement).closest("a");

      if (anchor?.closest(".vp-article-title, .vp-article-cover")) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }
    };

    // todo 跳新标签的版本
    // 「点击文章 → 新标签页打开」。主题的 ArticleItem 把整张卡片做成了
    // 点击本页跳转（.vp-article-wrapper 的 onClick → router.push），标题只是
    // 嵌在内的 RouteLink，且 .vp-article-title 类在 <header> 上而非 <a> 上，
    // 所以只能捕获阶段接管：命中卡片时阻断原导航，用 window.open 开新标签
    // const openArticleInNewTab = (event: MouseEvent): void => {
    //   // 带修饰键或非左键点击放行，交给浏览器默认行为（新窗口、后台标签等）
    //   if (
    //       event.button !== 0 ||
    //       event.metaKey ||
    //       event.ctrlKey ||
    //       event.shiftKey ||
    //       event.altKey
    //   )
    //     return;
    //
    //   const target = event.target as HTMLElement;
    //   const card = target.closest<HTMLElement>(".vp-article-wrapper");
    //
    //   // 卡片外的点击、摘要折叠箭头不处理
    //   if (!card || target.closest("summary")) return;
    //   // 卡片内自带的链接（分类 / 标签等）保持主题原行为
    //   const link = target.closest("a");
    //   if (link && !link.querySelector(".vp-article-title")) return;
    //
    //   const anchor = card
    //       .querySelector<HTMLElement>(".vp-article-title")
    //       ?.closest("a");
    //   const path = anchor?.getAttribute("href");
    //   if (!path) return;
    //
    //   // 阻断主题的整卡 router.push 与标题 RouteLink 的默认导航
    //   event.preventDefault();
    //   event.stopPropagation();
    //   window.open(path, "_blank", "noopener,noreferrer");
    // };

    onMounted(() => {
      const { page } = route.query;
      void updatePage(page ? Number(page) : 1);
      watch(currentPage, () => {
        // List top border distance
        const distance =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          document.querySelector("#article-list")!.getBoundingClientRect().top +
          window.scrollY;
        setTimeout(() => {
          window.scrollTo(0, distance);
        }, 100);
      });
    });

    return () =>
      h(
        "div",
        {
          id: "article-list",
          class: "vp-article-list",
          role: "feed",
          onClickCapture: openArticleInNewTab,
        },
        currentArticles.value.length > 0
          ? [
              ...renderArticles(),
              h(Pagination, {
                current: currentPage.value,
                perPage: articlePerPage.value,
                total: sortedItems.value.length,
                onUpdateCurrentPage: updatePage,
              }),
            ]
          : h(
              "h2",
              { class: "vp-empty-hint" },
              blogLocale.value.empty.replace(
                "$text",
                blogLocale.value.article.toLocaleLowerCase(),
              ),
            ),
      );
  },
});
