import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import crypto from 'crypto'

if (!crypto.hash) {
  crypto.hash = function(algorithm, data) {
    return crypto.createHash(algorithm).update(data).digest()
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
