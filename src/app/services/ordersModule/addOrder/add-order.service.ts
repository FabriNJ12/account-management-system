import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/Supabase/supabase.service';
import { orders } from '../../../interfaces/orders';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AddOrderService {
  constructor(private supabase: SupabaseService) {}

  addOrder(newOrder: orders): Observable<orders[]> {
    const supabase = this.supabase.GoTrueClient();

    const request = supabase.from('orders').insert(newOrder).select('*');

    return from(request).pipe(
      map((res) => {
        if (res.error) throw res.error;
        return res.data as orders[];
      })
    );
  }
}
