import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
export default defineConfig({
    plugins: [solid()],
    server: {
        middlewareMode: true,
        port: 3000,
        hmr: {
            protocol: 'ws',
            host: "localhost"
        }
    },
    build: {
        outDir: "dist"
    }
});
