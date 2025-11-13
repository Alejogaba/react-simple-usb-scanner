import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts' // ¡Importa esto!

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true }) // ¡Añade esto!
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'ReactSimpleUsbScanner',
      // Asegúrate de que esto coincida con tu package.json
      fileName: (format) => `react-simple-usb-scanner.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // ¡Externaliza React!
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})