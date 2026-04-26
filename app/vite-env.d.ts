/// <reference types="vite/client" />

declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_KEY?: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_KEY?: string;
}

interface Window {
  __APP_ENV__?: {
    SUPABASE_URL?: string;
    SUPABASE_KEY?: string;
  };
}
