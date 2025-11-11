import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase/supabase.service';
import { customers } from '../../interfaces/customers';


@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private supabase: SupabaseService) {}

  async getClients(): Promise<customers[]> {
    const supabase = this.supabase.GoTrueClient();
    const { data, error } = await supabase.from('customers').select('*');
    if (error) {
      console.error('error en el fetching de datos', error);
      return [];
    }

    return data;
  }
}
