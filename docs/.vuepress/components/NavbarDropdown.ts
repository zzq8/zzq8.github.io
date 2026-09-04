/**
 * 覆盖主题的 NavbarDropdown（经 config.ts 的 webpack alias 精确注入，原版见
 * vuepress-theme-hope/lib/client/components/navbar/NavbarDropdown.js）：
 * 原版父级标题是纯 <button>，鼠标点击无任何动作（下拉仅靠 :hover 展开、键盘
 * 才能切换 open），配置里的 link 也会被忽略。这里给鼠标点击加上导航：跳到
 * 本组的 link（未配置则递归取第一个子项的链接），键盘 Enter/Space 仍是原版
 * 的展开/收起，移动端导航不走此组件，均不受影响。
 */
import type { VNode } from "vue";
import {
  computed,
  defineComponent,
  h,
  ref,
  resolveComponent,
  toRef,
} from "vue";
import { onContentUpdated, useRouter } from "vuepress/client";
import AutoLink from "@theme-hope/components/base/AutoLink";
import "@theme-hope/styles/navbar/navbar-dropdown.scss";

interface DropdownItem {
  text: string;
  icon?: string;
  link?: string;
  ariaLabel?: string;
  children?: DropdownItem[];
}

const firstLinkOf = (item: DropdownItem): string | null => {
  if (item.link) return item.link;
  for (const child of item.children ?? []) {
    const link = firstLinkOf(child);
    if (link) return link;
  }
  return null;
};

export default defineComponent({
  name: "NavbarDropdown",
  props: {
    /**
     * Dropdown config
     *
     * 下拉列表配置
     */
    config: {
      type: Object,
      required: true,
    },
  },
  slots: Object,
  setup(props, { slots }) {
    const config = toRef(props, "config") as { value: DropdownItem };
    const router = useRouter();
    const dropdownAriaLabel = computed(
      () => config.value.ariaLabel ?? config.value.text,
    );
    const open = ref(false);
    /**
     * Open the dropdown when user tab and click from keyboard.
     *
     * Use event.detail to detect tab and click from keyboard.
     * The Tab + Click is UIEvent > KeyboardEvent, so the detail is 0.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
     */
    const handleDropdown = (event: MouseEvent): void => {
      const isTriggerByTab = event.detail === 0;
      if (isTriggerByTab) {
        open.value = !open.value;
        return;
      }
      // 下拉菜单是标题 button 的 DOM 子元素，点击子项的事件会冒泡到这里，
      // 必须放行，否则会被下面的“跳第一个子项”覆盖（子 nav 永远选不中）
      if ((event.target as HTMLElement | null)?.closest?.(".vp-dropdown"))
        return;
      // 鼠标点击标题：导航到本组 link 或第一个子项（内部路由跳转，外链新开）
      const target = firstLinkOf(config.value);
      if (!target) return;
      if (/^https?:\/\//.test(target)) window.open(target, "_blank");
      else void router.push(target);
    };
    onContentUpdated(() => {
      open.value = false;
    });
    return (): VNode =>
      h("div", { class: ["vp-dropdown-wrapper", { open: open.value }] }, [
        h(
          "button",
          {
            type: "button",
            class: "vp-dropdown-title",
            "aria-label": dropdownAriaLabel.value,
            onClick: handleDropdown,
          },
          [
            slots.title?.() ?? [
              h(resolveComponent("VPIcon"), { icon: config.value.icon }),
              props.config.text,
            ],
            h("span", { class: "arrow" }),
            h(
              "ul",
              { class: "vp-dropdown" },
              config.value.children.map((child, index) => {
                const isLastChild = index === config.value.children.length - 1;
                return h(
                  "li",
                  { class: "vp-dropdown-item" },
                  "children" in child
                    ? [
                        h(
                          "h4",
                          { class: "vp-dropdown-subtitle" },
                          child.link
                            ? h(AutoLink, {
                                config: child,
                                onFocusout: () => {
                                  if (
                                    // No children
                                    child.children.length === 0 &&
                                    isLastChild
                                  )
                                    open.value = false;
                                },
                              })
                            : child.text,
                        ),
                        h(
                          "ul",
                          { class: "vp-dropdown-subitems" },
                          child.children.map((grandchild, grandIndex) =>
                            h(
                              "li",
                              { class: "vp-dropdown-subitem" },
                              h(AutoLink, {
                                config: grandchild,
                                onFocusout: () => {
                                  if (
                                    // Last item of grandchild
                                    grandIndex === child.children.length - 1 &&
                                    isLastChild
                                  )
                                    open.value = false;
                                },
                              }),
                            ),
                          ),
                        ),
                      ]
                    : h(AutoLink, {
                        config: child,
                        onFocusout: () => {
                          if (isLastChild) open.value = false;
                        },
                      }),
                );
              }),
            ),
          ],
        ),
      ]);
  },
});
