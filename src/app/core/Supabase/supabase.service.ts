import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment_local } from '../../../environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private client: SupabaseClient;

  // constructor() {
  //   this.client = createClient(
  //     environment.supabaseUrl,
  //     environment.supabaseKey
  //   );
  // }

  constructor() {
    this.client = createClient(
      environment_local.supabaseUrl,
      environment_local.supabaseKey
    );
  }

  GoTrueClient(): SupabaseClient {
    return this.client;
  }
}
