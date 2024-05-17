import {defineConfig} from 'tsup'

export default defineConfig({
  format: ['cjs'], // Build for commonJS
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2022',
})
