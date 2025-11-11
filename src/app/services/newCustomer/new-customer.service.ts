import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase/supabase.service';
import { newCustomer } from '../../interfaces/newCustomer';

@Injectable({
  providedIn: 'root',
})
export class NewCustomerService {
  constructor(private supase: SupabaseService) {}

  async saveNewCustomer(
    user: newCustomer
  ): Promise<{ success: boolean; message: string; exists: boolean }> {
    const supabase = this.supase.GoTrueClient();

    const { data: exist, error: SelectError } = await supabase
      .from('clients')
      .select('tel')
      .eq('tel', Number(user.tel))
      .maybeSingle();

    if (SelectError) {
      return {
        success: false,
        message: 'error al guardar cliente',
        exists: false,
      };
    }

    if (exist) {
      return {
        success: false,
        message: 'ya existe un cliente con ese telefono',
        exists: true,
      };
    }

    const { data: dataInserted, error: InsertError } = await supabase
      .from('clients')
      .insert([user]);

    if (InsertError) {
      return {
        success: false,
        message: 'Error insertando cliente.',
        exists: false,
      };
    }

    return {
      success: true,
      message: 'Cliente registrado correctamente.',
      exists: false,
    };
  }
}
