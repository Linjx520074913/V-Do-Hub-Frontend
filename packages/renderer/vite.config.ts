import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import resolve from 'vite-plugin-resolve'
import electron from 'vite-plugin-electron/renderer'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
	mode: process.env.NODE_ENV,
	root: __dirname,
	plugins: [
		vue(),
		electron(),
		resolve(
		/**
		 * Here you can specify other modules
		 * 🚧 You have to make sure that your module is in `dependencies` and not in the` devDependencies`,
		 *    which will ensure that the electron-builder can package it correctly
		 */
		{
			// If you use electron-store, this will work - ESM format code snippets
			'electron-store': 'const Store = require("electron-store"); export default Store;',
		}
		),
	],
	resolve: {
		alias:{
			'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
			"@": path.resolve(__dirname, "./src"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@common": path.resolve(__dirname, "../common"),
		}
	},
	base: './',
	build: {
		outDir: '../../dist/renderer',
		emptyOutDir: true,
		sourcemap: true,
	},
	server: {
		host: pkg.env.VITE_DEV_SERVER_HOST,
		port: pkg.env.VITE_DEV_SERVER_PORT,
	},

	// 全局css 
	css: {
		preprocessorOptions: { 
			scss: {
				additionalData: `@import "@/common/theme/index.scss";`,
			}
		}
    	},
})
