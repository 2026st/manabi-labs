import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: true
    },
    define: {
      "import.meta.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL ?? ""),
      "import.meta.env.SUPABASE_KEY": JSON.stringify(env.SUPABASE_KEY ?? "")
    }
  };
});
