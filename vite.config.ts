// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";
import { loadEnv } from "vite";

// Load non-VITE_ env vars into process.env for server routes (never exposed to client)
const serverEnv = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  vite: {
    plugins: [mcpPlugin()],
    resolve: {
      alias: [
        {
          find: /^entities\/escape$/,
          replacement: path.resolve(process.cwd(), "node_modules/entities/lib/esm/escape.js"),
        },
        {
          find: /^entities\/decode$/,
          replacement: path.resolve(process.cwd(), "node_modules/entities/lib/esm/decode.js"),
        },
        {
          find: /^entities\/lib\/decode\.js$/,
          replacement: path.resolve(process.cwd(), "node_modules/entities/lib/decode.js"),
        },
        {
          find: /^entities\/lib\/encode\.js$/,
          replacement: path.resolve(process.cwd(), "node_modules/entities/lib/encode.js"),
        },
        {
          find: /^entities$/,
          replacement: path.resolve(process.cwd(), "node_modules/entities/lib/esm/index.js"),
        },
      ],
    },
  },
});
