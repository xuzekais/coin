import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import eslint from 'vite-plugin-eslint';
import svgLoader from 'vite-svg-loader';
import UnocssConfig from './unocss.config';
import Unocss from 'unocss/vite';
import devops from '../devops.config';

export default defineConfig(({ command, mode }) => {
    
    const env = loadEnv(mode, process.cwd(), '');

    return {
        server: {
            host: '127.0.0.1',
            port: devops.port,
            hmr: {
                port: devops.port
            }
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
                '@app': resolve(__dirname, '../src'),
            }
        },
        plugins: [
            vue(),
            vueJsx({
                // options are passed on to @vue/babel-plugin-jsx
            }),
            // eslint({ cache: false }),
            svgLoader(),
            Unocss(UnocssConfig),
        ],
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                },
                output: {
                    chunkFileNames: 'public/js/[name]-[hash].js',
                    entryFileNames: 'public/js/[name]-[hash].js',
                    assetFileNames: 'public/[ext]/[name]-[hash].[ext]',
                    dir: 'dist',
                },
            },
        },
        define: {
            __APP_ENV__: env.APP_ENV,
        }
    }
});