import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase/supabase.service';
import { HistoryClient } from '../../interfaces/historyClient';

@Injectable({
  providedIn: 'root',
})
export class GetHistoryClientService {
  constructor(private supabase: SupabaseService) {}

  async getHistory(clientId: number) {
    const supabase = this.supabase.GoTrueClient();

    // Traer ventas
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('id, product_name, amount, date, description')
      .eq('client_id', clientId);

    // Traer pagos
    const { data: pays, error: errorPays } = await supabase
      .from('pays')
      .select('id, payment_method, amount, date, description')
      .eq('client_id', clientId);

    if (salesError || errorPays) {
      console.error(salesError || errorPays);
      return [];
    }

    // Mapear explícitamente para unificar propiedades y tipo
    const salesHistory: HistoryClient[] =
      sales?.map((s) => ({
        id: s.id,
        type: 'Venta',
        description: s.product_name, // usamos product_name aquí
        amount: s.amount,
        date: s.date,
        description2:s.description
      })) || [];

    const paysHistory: HistoryClient[] =
      pays?.map((p) => ({
        id: p.id,
        type: 'Pago',
        description: p.payment_method, // usamos description aquí
        amount: p.amount,
        date: p.date,
        description2:p.description
      })) || [];

    // Combinar y ordenar por fecha descendente
    const history: HistoryClient[] = [...salesHistory, ...paysHistory].sort(
      (b, a) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return history;
  }
}
