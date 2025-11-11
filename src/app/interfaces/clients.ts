export interface Clients {
  id: number;
  name: string;
  tel: string;
  debt: number;
  lastpay:Date | null;
  lastPay_method: string | null;
}
