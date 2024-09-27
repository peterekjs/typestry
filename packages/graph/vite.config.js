import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: [pkg.name, ...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
    },
    sourcemap: true,
    target: 'esnext',
    minify: true,
  },
  plugins: [dtsPlugin()],
})
