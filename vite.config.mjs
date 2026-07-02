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
        port: 3000,
        strictPort: true,
        origin: `${process.env.DDEV_PRIMARY_URL}:3000`,
        cors: {
            origin: /https?:\/\/([A-Za-z0-9\-.]+)?(\.ddev\.site)(?::\d+)?$/,
        }
    },
}));
