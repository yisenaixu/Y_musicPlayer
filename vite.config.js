import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import { resolve } from 'node:path'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/

export default defineConfig({
  base: '/',
  plugins: [
    react(),

    createSvgIconsPlugin({
      // eslint-disable-next-line no-undef
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],

      symbolId: 'icon-[name]',
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://8.137.147.110:3000',
        changeOrigin: true,
        rewrite: p => p.replace(RegExp('^/api'), ''),
      },
    },
  },
})
