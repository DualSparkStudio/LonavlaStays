import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { razorpayApiPlugin } from './vite-plugins/razorpay-api'

// https://vite.dev/config/
export default defineConfig({
  plugins: [razorpayApiPlugin(), react()],
})
