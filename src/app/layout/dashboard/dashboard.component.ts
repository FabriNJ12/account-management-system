import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientInfoComponent } from './client-info/client-info.component';
import { GetUsersService } from '../../services/getUsers/get-users.service';
import { Clients } from '../../interfaces/clients';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [ClientInfoComponent, CommonModule, FormsModule],
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
  clients: Clients[] | null = null;
  clientsAux: Clients[] | null = null;

  // Referencia al componente hijo
  @ViewChild(ClientInfoComponent) client!: ClientInfoComponent;

  constructor(private getUsers: GetUsersService) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  /** Recarga la lista completa de clientes desde el servicio */
  async reload(): Promise<void> {
    this.clientsAux = await this.getUsers.getClients();
    if (this.clientsAux.length === 0) {
      this.msg = true;
      console.log('entro', this.msg);
    }
    this.clients = this.clientsAux;
  }

  /** Abre el modal y envía los datos del cliente seleccionado */
  sendUser(data: Clients): void {
    this.ShowModal = !this.ShowModal;
    this.client.getData(data);
  }

  /** Filtra los clientes por nombre según el texto de búsqueda */
  searchFuncion(): void {
    if (!this.clients || !this.clientsAux) return;

    // Si el input está vacío, restaurar lista original
    if (this.search.trim() === '') {
      this.clients = this.clientsAux;
      this.aux = 0;
      return;
    }

    this.aux += 1;

    // Filtrado según longitud del texto buscado
    if (this.aux !== this.search.length) {
      this.clients = this.clientsAux.filter((e) =>
        e.name.toLowerCase().includes(this.search.toLowerCase())
      );
      this.aux = this.clients.length;
      return;
    }

    if (this.aux === this.search.length) {
      this.clients = this.clients.filter((e) =>
        e.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  }

  sortAmount: boolean = false;

  sortPaid: boolean = false;

  sortUnpaid: boolean = false;

  filter(value: string) {
    if (!this.clients || !this.clientsAux) return;

    this.clients = this.clientsAux;

    if (value === 'desc') {
      this.sortPaid = false;
      this.sortUnpaid = false;
      if (!this.sortAmount) {
        this.clients = [...this.clients].sort((a, b) => b.debt - a.debt);
        this.sortAmount = !this.sortAmount;
        return;
      }

      this.clients = this.clientsAux;
      this.sortAmount = !this.sortAmount;
      return;
    }

    if (value === 'paid') {
      this.sortAmount = false;
      this.sortUnpaid = false;
      if (!this.sortPaid) {
        this.clients = [...this.clients].filter(
          (e) => e.debt === 0 && e.total_sales > 0
        );
        this.sortPaid = !this.sortPaid;
        return;
      }

      this.clients = this.clientsAux;
      this.sortPaid = !this.sortPaid;
      return;
    }

    if (value === 'unpaid') {
      this.sortPaid = false;
      this.sortAmount = false;
      if (!this.sortUnpaid) {
        this.clients = [...this.clients].filter(
          (e) => e.debt !== 0 && e.total_sales > 0
        );
        this.sortUnpaid = !this.sortUnpaid;
        console.log('entro aqui');
        return;
      }
      this.clients = this.clientsAux;
      this.sortUnpaid = !this.sortUnpaid;
      return;
    }
  }

  useInput() {
    if (this.sortAmount || this.sortPaid || this.sortUnpaid) {
      this.sortAmount = false;
      this.sortPaid = false;
      this.sortUnpaid = false;
      return;
    }

    this.clients = this.clientsAux;
  }
}
