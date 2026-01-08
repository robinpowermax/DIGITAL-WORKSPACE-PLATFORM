
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', 
  server: {
    watch: {
      usePolling: true,
      interval: 100
    },
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    // 强制清理旧目录
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'esbuild', // 切换到 esbuild，无需额外安装 terser 依赖，解决环境兼容性问题
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2000
  }
});
