import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  theme: {
    extend: {
      colors: {
        "gh-med-gray": "#2d333b",
        "gh-dark-gray": "#23272d",
        "gh-button-border": "#cdd9e51a",
        "gh-button-color": "#373e47",
        "gh-button-hover": "#444c56",
        "gh-button-hover-border": "#768390",
        "gh-button-active": "#3d444d",
        "gh-button-active-border": "#636e7b",
      },
    },
  },
});
