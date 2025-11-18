import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase/supabase.service';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { late_debt } from '../../interfaces/late_debt';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  constructor(private supabase: SupabaseService) {}

  _totalDebt$ = new BehaviorSubject<number>(0);
  $totalDebt = this._totalDebt$.asObservable();

  async fetchDebt() {
    const supabase = this.supabase.GoTrueClient();

    const { data, error } = await supabase
      .from('debts')
      .select('deuda_total')
      .single(); // devuelve un solo objeto

    if (error) {
      console.error('Error fetching debt:', error.message);
      this._totalDebt$.next(0); // opcional, reset si hay error
      return;
    }

    this._totalDebt$.next(data?.deuda_total ?? 0);
  }

  _uiError$ = new BehaviorSubject<string | null>(null);
  uiError$ = this._uiError$.asObservable();

  _late_paying$ = new BehaviorSubject<late_debt | null>(null);
  $late_paying = this._late_paying$.asObservable();

  lateDebt(): Observable<late_debt | null> {
    return from(
      this.supabase
        .GoTrueClient()
        .from('clients_debt_status')
        .select('*')
        .maybeSingle()
    ).pipe(map((res) => res.data ?? null));
  }
}
