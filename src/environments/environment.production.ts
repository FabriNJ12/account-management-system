declare global {
  interface ImportMetaEnv {
    NG_APP_SUPABASE_URL: string;
    NG_APP_SUPABASE_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const environment = {
  production: true,
  supabaseUrl: import.meta.env.NG_APP_SUPABASE_URL,
  supabaseKey: import.meta.env.NG_APP_SUPABASE_KEY,
};

export {};
