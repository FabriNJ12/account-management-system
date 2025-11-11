import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Clients } from '../../../interfaces/clients';
import { GetHistoryClientService } from '../../../services/getHistoryClient/get-history-client.service';
import { HistoryClient } from '../../../interfaces/historyClient';
import { AddPayComponent } from './add-pay/add-pay.component';
import { BehaviorSubject } from 'rxjs';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { EditPayOrSaleComponent } from './edit-pay-or-sale/edit-pay-or-sale.component';

registerLocaleData(localeEs, 'es');
@Component({
  selector: 'app-client-info',
  imports: [
    CommonModule,
    AddPayComponent,
    AddSaleComponent,
    EditPayOrSaleComponent,
  ],
  templateUrl: './client-info.component.html',
  styleUrl: './client-info.component.css',
})
export class ClientInfoComponent {
  /** ----------- Inputs y Outputs ----------- **/
  @Input() ShowModal: boolean = false;
  @Output() emitSignal = new EventEmitter<boolean>();
  @Output() realoadSignal = new EventEmitter<void>();

  /** ----------- ViewChilds ----------- **/
  @ViewChild(AddPayComponent) addPay!: AddPayComponent;
  @ViewChild(AddSaleComponent) addSale!: AddPayComponent;

  /** ----------- Variables de estado ----------- **/
  ShowModalPay: boolean = false;
  ShowModalSale: boolean = false;
  client: Clients | null = null;
  history: HistoryClient[] | null = null;

  /** ----------- Reactive state (deuda) ----------- **/
  private debtSubject = new BehaviorSubject<number | null>(null);
  debt$ = this.debtSubject.asObservable();

  /** ----------- Constructor ----------- **/
  constructor(private getHistoryService: GetHistoryClientService) {}

  /** ----------- Métodos UI ----------- **/
  closeModal(): void {
    this.ShowModal = false;
    this.emitSignal.emit(false);
    setTimeout(() => {
      this.client = null;
      this.history = null;
    }, 300);
  }

  addPayFunc(): void {
    if (this.client) {
      this.addPay.getUserInfo(this.client);
    }
  }

  addSaleFunc() {
    if (this.client) {
      this.addSale.getUserInfo(this.client);
    }
  }

  reloadComponent(): void {
    this.realoadSignal.emit();
  }

  /** ----------- Lógica principal ----------- **/
  async getData(data: Clients) {
    if (!data) return;
    this.client = data;
    this.debtSubject.next(data.debt);
    this.history = await this.getHistoryService.getHistory(data.id);
  }

  async updateData(id: number | null) {
    if (!id) return;
    this.history = null;
    setTimeout(async () => {
      this.history = await this.getHistoryService.getHistory(id);
    }, 400);
  }

  updateDebt(value: number): void {
    if (!this.client) return;

    this.client.debt = value;
    this.debtSubject.next(value);
  }

  showModalRowInfo: boolean = false;
  @ViewChild(EditPayOrSaleComponent) editPayOrsale!: EditPayOrSaleComponent;

  GetInfoRow(item: HistoryClient) {
    if (!this.client) return;

    const id_client: number = this.client.id;

    this.editPayOrsale.getInfo(item, id_client);
  }
}
