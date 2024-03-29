import { fileURLToPath, URL } from 'node:url'
const path = require('path');

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

import federation from '@originjs/vite-plugin-federation'
import { polyfillNode } from "esbuild-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'public', 'index.html'),
      },
    },
  },
  plugins: [
    vue(
      {
        template: {transformAssetUrls}
      }
    ),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    //   styles: {
    //     configFile: 'src/styles/settings.scss',
    //   },
    }),
    federation({
      name: "livestream",
      filename: "livestreamApp.js",
      exposes: {
        "./App": "./src/App.vue",
      },
      shared: ["vue", "axios", "buffer", "material-design-icons-iconfont", "socket.io", "socket.io-client", "vue-webrtc", "vuetify"],
    }),
    polyfillNode({ buffer: true, process: true })
  ],
  define: {
    'process.env': {},
    global: 'window'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "socket.io-client": "socket.io-client/dist/socket.io.js",
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  dependencies: {
    buffer: "^6.0.3",
  },
})