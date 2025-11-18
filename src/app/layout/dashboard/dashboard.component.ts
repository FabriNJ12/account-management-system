import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientInfoComponent } from './client-info/client-info.component';
import { GetUsersService } from '../../services/getUsers/get-users.service';
import { Clients } from '../../interfaces/clients';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { CardsComponent } from './cards/cards.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    ClientInfoComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    CarouselModule,
    CardsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  // Estado general
  ShowModal = false;
  search = '';
  aux = 0;
  msg: boolean = false;

  // Datos de clientes
  clientsOriginal: Clients[] | null = null;
  clientsFiltered: Clients[] | null = null;

  // Referencia al componente hijo
  @ViewChild(ClientInfoComponent) client!: ClientInfoComponent;
  @ViewChild(CardsComponent) cardComponent!: CardsComponent;

  constructor(private getUsers: GetUsersService) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  /** Recarga la lista completa de clientes desde el servicio */
  async reload(): Promise<void> {
    this.clientsOriginal = await this.getUsers.getClients();
    if (this.clientsOriginal.length === 0) {
      this.msg = true;
    }
    this.clientsFiltered = this.clientsOriginal;
    this.loading = false;

    this.cardComponent.getDetb();
    this.cardComponent.getOlderPayment();
  }

  /** Abre el modal y envía los datos del cliente seleccionado */
  sendUser(data: Clients): void {
    this.ShowModal = !this.ShowModal;
    this.client.getData(data);
  }

  /** Filtra los clientes por nombre según el texto de búsqueda */

  sortAmount: boolean = false;

  sortPaid: boolean = false;

  sortUnpaid: boolean = false;

  loading: boolean = true;
  applyFiltersAndSearch() {
    if (!this.clientsOriginal || !this.clientsFiltered) return;

    let data = [...this.clientsOriginal];

    // --- 1) Filtro por búsqueda ---
    if (this.search.trim() !== '') {
      const term = this.search.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(term));
    }

    // --- 2) Filtro por deuda orden asc/desc ---
    if (this.sortAmount) {
      data = data.sort((a, b) => b.debt - a.debt);
    }

    // --- 3) Filtro por pagados ---
    if (this.sortPaid) {
      data = data.filter((c) => c.debt === 0 && c.total_sales > 0);
    }

    // --- 4) Filtro por impagos ---
    if (this.sortUnpaid) {
      data = data.filter((c) => c.debt !== 0 && c.total_sales > 0);
    }

    this.clientsFiltered = data;
  }

  searchFuncion() {
    this.applyFiltersAndSearch();
  }

  filterAmount() {
    this.sortAmount = !this.sortAmount;
    this.sortPaid = false;
    this.sortUnpaid = false;
    this.applyFiltersAndSearch();
  }

  filterPaid() {
    this.sortPaid = !this.sortPaid;
    this.sortAmount = false;
    this.sortUnpaid = false;
    this.applyFiltersAndSearch();
  }

  filterUnpaid() {
    this.sortUnpaid = !this.sortUnpaid;
    this.sortAmount = false;
    this.sortPaid = false;
    this.applyFiltersAndSearch();
  }
}
