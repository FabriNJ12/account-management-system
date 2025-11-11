import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase/supabase.service';
import { HistoryClient } from '../../interfaces/historyClient';

@Injectable({
  providedIn: 'root',
})
export class EditPayOrSaleService {
  constructor(private supabase: SupabaseService) {}

  async saveChanges(
    info: HistoryClient,
    id: number
  ): Promise<{ success: boolean; message: string; debt?: number }> {
    const Supabase = this.supabase.GoTrueClient();

    if (!info?.id || !info.amount) {
      return {
        success: false,
        message: 'Datos insuficientes para actualizar.',
      };
    }

    const isPayment = info.type === 'Pago';
    const table = isPayment ? 'pays' : 'sales';

    const updateData = isPayment
      ? {
          amount: info.amount,
          date: info.date,
          description: info.description2,
          payment_method: info.description,
        }
      : {
          amount: info.amount,
          date: info.date,
          description: info.description2,
          product_name: info.description,
        };

    const { error } = await Supabase.from(table)
      .update(updateData)
      .eq('id', info.id);

    if (error) {
      console.error('Error actualizando item:', error);
      return {
        success: false,
        message: 'Se produjo un error al actualizar el registro.',
      };
    }

    const { data: debt, error: debtError } = await Supabase.from(
      'clients_dashboard'
    )
      .select('debt')
      .eq('id', id)
      .single();

    if (debtError) {
      return {
        success: true,
        message: 'registro actualizado pero no se pudo obtener la deuda',
      };
    }

    return {
      success: true,
      message: 'Item actualizado correctamente.',
      debt: debt.debt,
    };
  }
}
