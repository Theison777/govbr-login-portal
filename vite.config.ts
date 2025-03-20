
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure the output directory is correct
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Make sure assets are handled correctly
    assetsDir: 'assets',
  },
  // Add base config to handle subdirectory deployments if needed
  base: '/',
}));
