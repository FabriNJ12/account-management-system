import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase/supabase.service';
import { customers } from '../../interfaces/customers';

@Injectable({
  providedIn: 'root',
})
export class EditCustomersService {
  constructor(private supabase: SupabaseService) {}

  async saveCustomer(
    dataClient: customers
  ): Promise<{ success: boolean; message: string; exists: boolean }> {
    const supabase = this.supabase.GoTrueClient();

    // 1️⃣ Buscar si ya existe un cliente con el mismo teléfono
    const { data: exist, error: selectError } = await supabase
      .from('clients')
      .select('id')
      .eq('tel', dataClient.tel)
      .maybeSingle();

    if (selectError) {
      console.error('Error al realizar la consulta:', selectError);
      return {
        success: false,
        message: 'Error al buscar cliente.',
        exists: false,
      };
    }

    // 2️⃣ Si ya existe un cliente con ese teléfono
    if (exist) {
      return {
        success: false,
        message: 'Ya existe un cliente con ese teléfono.',
        exists: true,
      };
    }

    // 3️⃣ Si no existe, actualizamos el cliente por su ID
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        tel: dataClient.tel,
        name: dataClient.name,
      })
      .eq('id', dataClient.id);

    if (updateError) {
      console.error('Error al actualizar cliente:', updateError);
      return {
        success: false,
        message: 'Error al actualizar cliente.',
        exists: false,
      };
    }

    return {
      success: true,
      message: 'Cliente actualizado correctamente.',
      exists: false,
    };
  }
}
