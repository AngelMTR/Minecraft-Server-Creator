import UnoCSS from 'unocss/vite'
import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

export default defineConfig({
    plugins: [
        preact(),
        UnoCSS({
            preflights: false,
        }),
    ],
    resolve: {
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
            '@': path.resolve(__dirname, './src'),
        }
    }
})
