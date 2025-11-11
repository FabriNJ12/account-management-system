import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    console.log('urlSupa:', environment.supabaseUrl);
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  GoTrueClient(): SupabaseClient {
    return this.client;
  }
}
