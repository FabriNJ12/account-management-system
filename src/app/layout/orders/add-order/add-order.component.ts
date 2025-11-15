import { CommonModule } from '@angular/common';
import { OnInit, Pipe, PipeTransform } from '@angular/core';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { orders } from '../../../interfaces/orders';
import { AddOrderService } from '../../../services/ordersModule/addOrder/add-order.service';
import { OrdersService } from '../../../services/ordersModule/orders/orders.service';
type Status = 'loading' | 'nothing' | 'error' | 'success';

@Pipe({
  name: 'filterClients',
  pure: true,
})
export class FilterClientsPipe implements PipeTransform {
  transform(clients: string[] , client_name: string): string[] {
    if (!client_name) return clients;

    client_name = client_name.toLowerCase();

    return clients.filter((c) => c.toLowerCase().includes(client_name));
  }
}

@Component({
  selector: 'app-add-order',
  imports: [CommonModule, FormsModule, FilterClientsPipe],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css',
})
export class AddOrderComponent  {
  /* ===========================
        INPUTS / OUTPUTS
  ============================ */
  @Input() showModal = false;
  @Output() signalToClose = new EventEmitter<boolean>();
  @Output() signalToNotify = new EventEmitter<void>();
  @Output() updateOrders = new EventEmitter<orders[]>();

  /* ===========================
            VIEWCHILD
  ============================ */
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  /* ===========================
            PROPIEDADES
  ============================ */
  showDropDown: boolean = false;

  clients: string[] | null = null

  productName: string = '';
  alert: boolean = false;
  client_name: string = '';

  Status: Status = 'nothing';
  order: orders | null = null;

  /* ===========================
              MÉTODOS
  ============================ */

  constructor(private addOrderService: AddOrderService, private ordersService:OrdersService) {}

  closeModal() {
    this.showModal = false;
    this.signalToClose.emit(false);
    setTimeout(() => {
      this.reset();
    }, 300);
  }

  private reset() {
    this.alert = false;
    this.productName = '';
    this.client_name = '';
  }

  submit() {
    if (this.productName === '') {
      this.alert = true;
      return;
    }

    this.order = {
      product_name: this.productName,
      client_name: this.client_name,
    };

    this.callBD();
  }

  private callBD() {
    if (!this.order) return;
    this.Status = 'loading'

    this.addOrderService.addOrder(this.order).subscribe({
      error: (err) => {
        this.Status = 'nothing';
        return;
      },
      next: (data: orders[]) => {
        setTimeout(() => {
          this.Status = 'nothing';
          this.closeModal();
          this.signalToNotify.emit();
          this.updateOrders.emit(data)
        }, 400);
      },
    });
  }

  test() {
    this.Status = 'loading';

    setTimeout(() => {
      this.Status = 'nothing';
      this.closeModal();
      this.signalToNotify.emit();
    }, 400);
  }

  /* ===========================

  /* ===========================
        CLICK FUERA DEL MENU
  ============================ */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (
      this.showDropDown &&
      this.dropdownMenu &&
      !this.dropdownMenu.nativeElement.contains(event.target)
    ) {
      this.showDropDown = false;
    }
  }

  getNames(): void {
    this.ordersService.$client.subscribe((clients) => {
      this.clients = clients;
    });
  }
}
