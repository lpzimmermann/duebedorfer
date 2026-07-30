import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this app from a /duebedorfer/ subpath, but the
  // Android app (via Capacitor) loads the bundle from its local assets,
  // so it needs relative paths instead.
  base: mode === 'capacitor' ? './' : '/duebedorfer/',
  plugins: [react()],
}))
