import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { newPay } from '../../interfaces/newPay';
import { SupabaseService } from '../../core/Supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class NewPayService {
  constructor(private supabase: SupabaseService) {}

  async saveNewPay(newPay: newPay) {
    const supabase = this.supabase.GoTrueClient();
    try {
      const { data, error } = await supabase
        .from('pays')
        .insert([newPay])
        .select();

      if (error) throw error;

      console.log('pago guardado', data);
      return data;
    } catch (err) {
      console.error('error al guardar el pago', err);
      throw err;
    }
  }
}
