import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  plugins: [react()],
  base: '/green-borrow-bloom/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 2. Add this alias
    },
  },
})