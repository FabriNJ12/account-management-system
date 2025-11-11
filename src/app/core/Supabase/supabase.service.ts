import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl: string = 'https://fprhrkjlspgvdqeolipm.supabase.co';
  private supabaseKey: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcmhya2psc3BndmRxZW9saXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDQ2NDAsImV4cCI6MjA3NzI4MDY0MH0.AIdYxHDH91OxY5loU5sNiaJzCR7YWV4pCTLLs1LO1h8';

  private client: SupabaseClient;

  constructor() {
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
  }

  GoTrueClient(): SupabaseClient {
    return this.client;
  }
}
