import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext'
		}
	},
	build: {
		target: 'esnext'
	},
	server: {
		host: true,
		allowedHosts: ['pbtes06.pasbol.com.bo:5173']
	}
})
