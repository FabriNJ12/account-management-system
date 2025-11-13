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
import { flatMap } from 'rxjs';

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
  // =========================================================
  // 🔧 DEPENDENCIAS E INYECCIONES
  // =========================================================
  constructor(
    private customersService: CustomersService,
    private ngZone: NgZone
  ) {}

  // =========================================================
  // 🌀 CICLO DE VIDA
  // =========================================================
  async ngOnInit() {
    this.getClients();
  }

  // =========================================================
  // 📦 ESTADO Y VARIABLES DE CONTROL
  // =========================================================
  showAlert: boolean = false;
  showModal: boolean = false;
  showModalEditCustomers: boolean = false;

  clients: customers[] | null = null;
  clientsAux: customers[] | null = null;

  search: string = '';
  aux: number = 0;

  // =========================================================
  // 🎨 UI / ESTILOS / COLORES DINÁMICOS
  // =========================================================
  colorPalette = ['cyan', 'blue', 'teal', 'pink', 'emerald', 'lime'];

  colorClasses: Record<string, string> = {
    cyan: 'bg-cyan-300/10 border-cyan-300/10 shadow-cyan-300/10',
    blue: 'bg-blue-300/10 border-blue-300/10 shadow-blue-300/10',
    teal: 'bg-teal-300/10 border-teal-300/10 shadow-teal-300/10',
    pink: 'bg-pink-300/10 border-pink-300/10 shadow-pink-300/10',
    emerald: 'bg-emerald-300/10 border-emerald-300/10 shadow-emerald-300/10',
    lime: 'bg-lime-300/10 border-lime-300/10 shadow-lime-300/10',
  };

  getColorClass(index: number) {
    const color = this.colorPalette[index % this.colorPalette.length];
    return this.colorClasses[color];
  }

  getColorCard(index: number) {
    const color = this.colorPalette[index % this.colorPalette.length];
    return [
      `bg-${color}-300/10`,
      `border-${color}-300/10`,
      `shadow-${color}-300/10`,
    ];
  }

  // =========================================================
  // 📡 EVENTOS Y OUTPUTS
  // =========================================================
  @Output() signalToReload = new EventEmitter<void>();
  @ViewChild(EditCustomersComponent) editCustomerComp!: EditCustomersComponent;

  // =========================================================
  // ⚙️ LÓGICA DE NEGOCIO / FUNCIONAL
  // =========================================================
  async getClients() {
    const data:customers[] = await this.customersService.getClients();
    this.clients = null;

    const dataSorted:customers[] = data.sort((a,b) => a.id - b.id)
    

    // Simula pequeña transición visual
    setTimeout(() => {
      this.ngZone.run(() => {
        this.clients = dataSorted;
        this.clientsAux = dataSorted;
      });
    }, 500);
  }

  editCustomer(customer: customers) {
    this.editCustomerComp.getUser(customer);
    this.showModalEditCustomers = !this.showModalEditCustomers;
  }

  animate() {
    this.getClients();
    setTimeout(() => {
      this.showAlert = true;
      setTimeout(() => (this.showAlert = false), 3000);
    }, 200);
  }

  // =========================================================
  // 🔍 FILTRADO / BÚSQUEDA
  // =========================================================
  searchFuncion() {
    if (!this.clients || !this.clientsAux) return;

    if (this.search.trim() === '') {
      this.clients = this.clientsAux;
      this.aux = 0;
      return;
    }

    this.aux += 1;
    const searchTerm = this.search.toLowerCase();

    const source =
      this.aux !== this.search.length ? this.clientsAux : this.clients;
    this.clients = source.filter((e) =>
      e.name.toLowerCase().includes(searchTerm)
    );
    this.aux = this.clients.length;
  }

  asc: boolean = false;
  desc: boolean = false;
  recent: boolean = false;

  orderAsc(value: boolean) {
    if (!this.clients || !this.clientsAux) return;
    this.desc = false;
    this.recent = false;

    if (value) {
      this.clients = [...this.clients].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return;
    }

    this.clients = this.clientsAux;
  }

  orderDesc(value: boolean) {
    if (!this.clients || !this.clientsAux) return;
    this.asc = false;
    this.recent = false;

    if (value) {
      this.clients = [...this.clients].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      return;
    }

    this.clients = this.clientsAux;
  }

  orderRecent(value: boolean) {
    if (!this.clients || !this.clientsAux) return;

    this.asc = false;
    this.desc = false;

    if (value) {
      this.clients = [...this.clients].sort((a, b) => b.id - a.id);
      console.log(this.clients);
      return;
    }

    this.clients = this.clientsAux;
  }
}
