import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // ផ្ទុក .env ដើម្បីយកមកប្រើក្នុងនេះបាន
  const env = loadEnv(mode, process.cwd(), '');

  return {
    optimizeDeps: {
      include: ['xlsx'],
    },
    plugins: [react()],
    server: {
      // --- ADD THESE TWO LINES ---
      port: 5175,       // Assign Education app its own lane
      strictPort: true, // Fail if 5175 is busy instead of jumping
      // ---------------------------
      proxy: {
        '/api': {
          // Point this to your EDU Backend (8081)
          target: env.VITE_API_URL || 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})