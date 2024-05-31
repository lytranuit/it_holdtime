import { fileURLToPath, URL } from "node:url";

import { defineConfig, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages({
      dirs: "src/views",
    }),
  ],
  resolve: {
    alias: [
      { find: "~@syncfusion", replacement: "./node_modules/@syncfusion" },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  // server: {
  //   fs: {
  //     allow: [
  //       // search up for workspace root
  //       searchForWorkspaceRoot(process.cwd()),
  //       // your custom rules
  //       'C:\\Users\\tran\\Desktop\\netcore\\it\\it\\private'
  //     ],
  //   },
  // },
});
