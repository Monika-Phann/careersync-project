import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS SECTION TO FIX THE PORT
  server: {
    port: 5174,       // Careersync-User uses 5173, so Mentor uses 5174
    strictPort: true, // If 5174 is busy, it will fail instead of jumping to 5175
    host: true,
  },
})