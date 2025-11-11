import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Clients } from '../../../../interfaces/clients';
import { newSale, newSaleReturn } from '../../../../interfaces/newSale';
import { NewSaleService } from '../../../../services/newSale/new-sale.service';

type Status = 'loading' | 'nothing' | 'error' | 'success';

export interface Sale {
  product_name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-add-sale',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css',
})
export class AddSaleComponent {
  constructor(private newSaleService: NewSaleService) {}
  @Input() ShowModalSale: boolean = false;
  alert: boolean = false;
  @Output() closeSignal = new EventEmitter<boolean>();
  @Output() newDebt = new EventEmitter<number>();
  @Output() signalToReload = new EventEmitter<Clients>();
  saleInfo: newSale | null = null;
  Status: Status = 'nothing';

  closeModal() {
    this.ShowModalSale = false;
    this.closeSignal.emit(false);
    setTimeout(() => {
      this.reset();
    }, 300);
  }

  private reset(): void {
    this.price = 0;
    this.name = '';
    this.description = '';
    this.alert = false;
  }

  sale: Sale | null = null;
  client: Clients | null = null;
  name: string = '';
  price: number | null = null;
  description: string = '';

  getUserInfo(data: Clients): void {
    this.client = data;
  }

  async submit(): Promise<void> {
    // ✅ Preparar y validar los datos antes de enviar
    const saleInfo = this.validateAndPrepareSale();
    if (!saleInfo || !this.client) return;

    this.Status = 'loading';

    try {
      const data: newSaleReturn[] | null =
        await this.newSaleService.saveNewSale(saleInfo);
      const newDebt = this.client.debt + saleInfo.amount;

      this.handleSuccess(newDebt);
    } catch (err: any) {
      console.error(err);
      this.Status = 'error';
    } finally {
      setTimeout(() => (this.Status = 'nothing'), 400);
    }
  }

  private validateAndPrepareSale(): newSale | null {
    if (!this.price || this.price <= 0 || !this.name.trim()) {
      this.alert = true;
      return null;
    }

    return {
      product_name: this.name.toLowerCase(),
      client_id: this.client?.id ?? 0,
      amount: this.price,
      date: new Date().toLocaleString('sv', {
        timeZone: 'America/Argentina/Buenos_Aires',
      }),
      description: this.description.toLowerCase(),
    };
  }

  private handleSuccess(newDebt: number): void {
    if (!this.client) return;
    this.closeModal();
    this.signalToReload.emit(this.client);
    setTimeout(() => this.newDebt.emit(newDebt), 200);
  }
}
