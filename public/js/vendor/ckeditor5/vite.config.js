// vite.config.js
import { createRequire } from 'node:module';
import { resolve } from 'path'
const require = createRequire(import.meta.url);

import { defineConfig } from 'vite';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

export default defineConfig({
    plugins: [
        ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })
    ],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: (chunkInfo) => {
                    // [https://github.com/vitejs/vite/issues/8115]
                    if (chunkInfo.name !== 'style.css') return
                    return 'ckeditor5-bundle.css'
                }
            }
        },
        lib: {
            entry: resolve(__dirname, 'lib/main.js'),
            name: 'CKEDITOR',
            fileName: 'ckeditor5-bundle'
        }
    }
});
