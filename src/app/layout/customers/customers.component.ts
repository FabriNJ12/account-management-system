import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CustomersService } from '../../services/customers/customers.service';
import { customers } from '../../interfaces/customers';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditCustomersComponent } from './edit-customers/edit-customers.component';
import { FormsModule } from '@angular/forms';

type ColorClassMap = {
  cyan: string;
  blue: string;
  teal: string;
  pink: string;
  emerald: string;
  lime: string;
};

@Component({
  selector: 'app-customers',
  imports: [
    CommonModule,
    AddCustomerComponent,
    EditCustomersComponent,
    FormsModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent implements OnInit {
  constructor(
    private customersService: CustomersService,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    this.getClients();
  }

  async getClients() {
    const data = await this.customersService.getClients();
    this.clients = null;
    setTimeout(() => {
      this.ngZone.run(() => {
        this.clients = data;
        this.clientsAux = data;
      });
    }, 500);
  }

  showAlert: boolean = false;

  clients: customers[] | null = null;
  clientsAux: customers[] | null = null;

  colorPalette = ['cyan', 'blue', 'teal', 'pink', 'emerald', 'lime'];

  colorClasses: ColorClassMap = {
    cyan: 'bg-cyan-300/10 border-cyan-300/10 shadow-cyan-300/10',
    blue: 'bg-blue-300/10 border-blue-300/10 shadow-blue-300/10',
    teal: 'bg-teal-300/10 border-teal-300/10 shadow-teal-300/10',
    pink: 'bg-pink-300/10 border-pink-300/10 shadow-pink-300/10',
    emerald: 'bg-emerald-300/10 border-emerald-300/10 shadow-emerald-300/10',
    lime: 'bg-lime-300/10 border-lime-300/10 shadow-lime-300/10',
  };

  getColorClass(index: number) {
    const color = this.colorPalette[
      index % this.colorPalette.length
    ] as keyof ColorClassMap;

    return [this.colorClasses[color]];
  }

  getColorCard(index: number) {
    const color = this.colorPalette[index % this.colorPalette.length];
    return [
      `bg-${color}-300/10`,
      `border-${color}-300/10`,
      `shadow-${color}-300/10`,
    ];
  }

  showModal: boolean = false;
  showModalEditCustomers: boolean = false;

  @Output() signalToReload = new EventEmitter<void>();
  @ViewChild(EditCustomersComponent) editCustomerComp!: EditCustomersComponent;
  animate() {
    this.getClients();
    setTimeout(() => {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }, 200);
  }

  editCustomer(customer: customers) {
    this.editCustomerComp.getUser(customer);
    this.showModalEditCustomers = !this.showModalEditCustomers;
  }

  search: string = '';
  aux: number = 0;
  searchFuncion() {
    if ( !this.clients || !this.clientsAux) return;

    if (this.search === '') {
      this.clients = this.clientsAux;
      this.aux = 0;
      return
    }

    this.aux += 1;

    if (this.aux !== this.search.length) {
      this.clients = this.clientsAux.filter((e) =>
        e.name.toLowerCase().includes(this.search.toLowerCase())
      );
      this.aux = this.clients.length;
      return;
    }

    if (this.aux === this.search.length) {
      this.clients = this.clients?.filter((e) =>
        e.name.toLowerCase().includes(this.search.toLowerCase())
      );
      return;
    }
  }
}
