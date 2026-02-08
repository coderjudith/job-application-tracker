import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      // 🔧 Allow connections to ALL AWS services we need
      "Content-Security-Policy": "connect-src 'self' https://14r9xogm4c.execute-api.ap-southeast-2.amazonaws.com https://cognito-idp.ap-southeast-2.amazonaws.com https://cognito-identity.ap-southeast-2.amazonaws.com"
    }
  },
  build: {
    outDir: 'dist'
  },
  define: {
    global: {}
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    }
  }
})