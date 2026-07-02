import { defineConfig } from 'vite';
import ViteRestart from 'vite-plugin-restart';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    base: command === 'serve' ? '' : '/dist/',
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    build: {
        outDir: 'web/dist',
        emptyOutDir: true,
        manifest: 'manifest.json',
        rollupOptions: {
            input: {
                custom: 'src/js/custom.js',
                swipers: 'src/js/swipers.js',
                style: 'src/scss/custom.scss',
            },
        },
    },
    plugins: [
        ViteRestart({
            reload: ['templates/**/*.twig'],
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5174,
        strictPort: true,
        origin: `${process.env.DDEV_PRIMARY_URL_WITHOUT_PORT}:5174`,
        cors: {
            origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(\.ddev\.site)(?::\d+)?$/
        },
        hmr: {
            overlay: true
        },
        watch: {
            usePolling: true
        }
    },
}));
