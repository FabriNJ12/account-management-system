import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/Supabase/supabase.service';
import { orders } from '../../../interfaces/orders';
import { BehaviorSubject, from, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private supabase: SupabaseService) {}


  callbd(): Observable<orders[]> {
    const supabase = this.supabase.GoTrueClient();
    return from(supabase.from('orders').select('*')).pipe(
      map((res) => {
        if (res.error) throw Error(res.error.message);
        return res.data ?? [];
      })
    );
  }

   _clients$ = new BehaviorSubject<string[]>([])
  public $client = this._clients$.asObservable()
  
  getClients(): Observable<string[]> {
    const supabase = this.supabase.GoTrueClient()

    return from(supabase.from('clients').select('name')).pipe(
      map((res) => {
        if (res.error) throw Error(res.error.message)
        const rows = (res.data ?? []) as { name: string }[]
        const names = rows.map(r => r.name)
        return names
      })
    )
  }
}
