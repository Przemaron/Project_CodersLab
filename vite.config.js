import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const exercisePath = '';

// https://vitejs.dev/config/
export default defineConfig({
  root: exercisePath,
  server: {
    port: 3000    
  },
  plugins: [react()],
})
