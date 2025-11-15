import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/Supabase/supabase.service';
import { Observable, catchError, from, throwError, map } from 'rxjs';
import { orders } from '../../../interfaces/orders';

@Injectable({
  providedIn: 'root'
})
export class DeleteOrderService {

  constructor(private supabase:SupabaseService) { }

 dltOrder(id: number): Observable<orders> {
  const supabase = this.supabase.GoTrueClient();

  
  const request = supabase
    .from('orders')
    .delete()
    .eq('id', id)
    .select('*').single(); // Supabase retorna un array incluso si es 1 fila

  return from(request).pipe(
    map((res) => {
      if (res.error) {
        throw res.error;
      }
      return res.data as orders;
    }),
    catchError((err) => {
      console.error('Supabase error:', err);
      return throwError(() => err);
    })
  );
}


  
}
