import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase/supabase.service';
import { Clients } from '../../interfaces/clients';

@Injectable({
  providedIn: 'root',
})
export class GetUsersService {
  constructor(private supabaseClient: SupabaseService) {}

  async getClients(): Promise<Clients[]> {
    const supabase = this.supabaseClient.GoTrueClient();
    
    const { data, error } = await supabase.from('clients_dashboard').select('*');
    

    if (error) {
      console.error('error en el fetching de datos', error);
      return [];
    }

    return data;
  }
}
