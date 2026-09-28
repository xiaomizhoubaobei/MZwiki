import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';

/**
 * 开发服务器放行的自定义域名清单。
 *
 * Vite 默认只允许 localhost / IP 直连访问，通过域名（含反向代理场景）访问时
 * 会抛出 "Blocked request. This host ... is not allowed." 并中断请求。
 * 生产部署域名 wiki.mizhoubaobei.top 走 Node 中间件模式，需在此显式放行。
 *
 * 注意：`server.ts` 以 middleware 模式创建 Vite 服务时会复用本文件的 `server` 配置，
 * 因此新增域名只需维护此处一处。
 */
export const ALLOWED_HOSTS = [
  'wiki.mizhoubaobei.top'
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    // 放行生产域名与非本机访问，避免 Host 校验拦截
    allowedHosts: ALLOWED_HOSTS
  }
});
