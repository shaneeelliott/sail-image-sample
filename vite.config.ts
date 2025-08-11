import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite config for the sample app to allow importing from the sibling package
export default defineConfig({
    plugins: [react()],
    esbuild: {
        loader: 'tsx',
        include: /.*\.[tj]sx?$/,
        exclude: [],
    },
    server: {
        host: '0.0.0.0', // Listen on all interfaces (IPv4 and IPv6)
        fs: {
            // Allow serving files from one level up to access `../sail-image-ts` sources
            allow: [
                path.resolve(__dirname, '../sail-image-ts'),
                path.resolve(__dirname, '../src/Curves'),
                path.resolve(__dirname, '../src/Components'),
                path.resolve(__dirname, 'src') // Allow access to the sample app's src directory
            ]
        }
    },
    resolve: {
        alias: {
            // Optional alias if you prefer `import { SailImage } from '@sail-image'`
            '@sail-image': '../sail-image-ts/src',
            // Force single copies from the sample app's node_modules to avoid version mismatch
            '@legacy': '../src/Curves'
        },
        dedupe: ['react', 'react-dom']
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-konva', 'konva', 'mathjs', 'natural-spline-interpolator'],
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
});


