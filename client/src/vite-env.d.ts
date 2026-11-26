/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  /** Current Supabase naming (sb_publishable_…). */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** Legacy Supabase naming (anon JWT). */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
