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
  ShowModal: boolean = false;

  constructor(private getUsers: GetUsersService) {}

  @ViewChild(ClientInfoComponent) client!: ClientInfoComponent;
  clients: Clients[] | null = null;
  clientsAux: Clients[] | null = null;

  async ngOnInit() {
    this.reload(); 
  }

  async reload() {
    this.clientsAux = await this.getUsers.getClients();
    this.clients = this.clientsAux
    console.log(this.clients)
  }

  sendUser(data: Clients) {
    this.ShowModal = !this.ShowModal;
    this.client.getData(data);
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
