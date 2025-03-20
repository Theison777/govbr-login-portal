
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
  // Configurações otimizadas para implantação na Lovable
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: true,
    sourcemap: false,
    // Melhorar a compatibilidade com navegadores
    target: 'es2015',
    // Otimizações para produção
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  // Configuração base para garantir que os caminhos estejam corretos
  base: '/',
}));
