import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  theme: {
    extend: {
      colors: {
        "gh-light-gray": "#2d333b",
        "gh-med-gray": "#23272d",
        "gh-dark-gray": "#1c2128",
        "gh-button-border": "#cdd9e51a",
        "gh-button-color": "#373e47",
        "gh-button-hover": "#444c56",
        "gh-button-hover-border": "#768390",
        "gh-button-active": "#3d444d",
        "gh-button-active-border": "#636e7b",
        "gh-text-color": "#dbdce6",
      },
    },
  },
});
