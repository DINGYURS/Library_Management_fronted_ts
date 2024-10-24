import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // import.meta.env.BASE_URL 配置路径
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({
      autoInstall: true
    })
  ],
  server: {
    host: '0.0.0.0',
    cors: true,
    port: 8888,
    open: false, //自动打开
    proxy: {
      '/api': {
        // target: 'http://120.55.62.76:9000', // 真实接口地址, 后端给的基地址
        target: 'http://127.0.0.1:9000', // 真实接口地址, 后端给的基地址
        changeOrigin: true, // 允许跨域
        secure: false, //设置是否使用安全连接（https）
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  }
})
