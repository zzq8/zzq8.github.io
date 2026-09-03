import ResourceList from "./components/ResourceList.js";
import SocialLink from "./components/SocialLink.js";
import { defineClientConfig } from "vuepress/client";

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("SocialLink", SocialLink);
    app.component("ResourceList", ResourceList);
  },
});
