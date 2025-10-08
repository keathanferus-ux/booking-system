/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_EMAIL_HOST: string
  readonly VITE_EMAIL_PORT: string
  readonly VITE_EMAIL_USER: string
  readonly VITE_EMAIL_PASS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
