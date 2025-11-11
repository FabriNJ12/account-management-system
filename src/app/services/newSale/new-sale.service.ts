import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { newSale, newSaleReturn } from '../../interfaces/newSale';
import { SupabaseService } from '../../core/Supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class NewSaleService {
  constructor(private supabase: SupabaseService) {}

  async saveNewSale(saleInfo: newSale) {
    const supabase = this.supabase.GoTrueClient();

    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([saleInfo])
        .select() as {data:newSaleReturn[] | null; error:any};

        console.log(data)

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('error al guardar el pago', err);
      throw err;
    }
  }
}
