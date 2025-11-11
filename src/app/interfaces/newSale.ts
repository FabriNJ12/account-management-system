export interface newSale {
  product_name:string
  client_id: number;
  description?: string | null ;
  amount: number;
  date: string;
  
}

export interface newSaleReturn {
  product_name:string
  client_id: number;
  description?: string | null ;
  amount: number;
  date: string;
  id:number;
}