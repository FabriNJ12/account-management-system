import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddOrderComponent } from './add-order/add-order.component';
import { OrdersService } from '../../services/ordersModule/orders/orders.service';
import { orders } from '../../interfaces/orders';
import { DeleteOrderService } from '../../services/ordersModule/deleteOrders/delete-order.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, AddOrderComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  @ViewChild(AddOrderComponent) addOrder!: AddOrderComponent;

  constructor(
    private ordersService: OrdersService,
    private deleteOrderService: DeleteOrderService
  ) {}

  // ---------------------------
  //   PROPIEDADES
  // ---------------------------

  // Lista de encargos obtenidos de la BD
  encargos: orders[] | null = null;

  // Control del modal para agregar pedidos
  showModal: boolean = false;

  // Control de notificación (animación)
  showNotification: boolean = false;

  // ID del encargo que está mostrando spinner de carga
  spinnerId: number | null = null;

  // ---------------------------
  //   CICLO DE VIDA
  // ---------------------------
  ngOnInit(): void {
    // Cargar listado de encargos al iniciar
    this.ordersService.callbd().subscribe((data) => {
      setTimeout(() => {
        this.encargos = data;
      }, 300);
      
    });

    // Obtener clientes y guardarlos en el observable global
    this.ordersService.getClients().subscribe((data) => {
      this.ordersService._clients$.next(data);
    });
  }

  // ---------------------------
  //   MÉTODOS DEL MODAL
  // ---------------------------
  openAddModal() {
    this.showModal = true;
    this.addOrder.getNames(); // Cargar nombres en el modal
  }

  // ---------------------------
  //   MÉTODOS DE ACTUALIZACIÓN
  // ---------------------------
  // Actualizar lista cuando se agrega un encargo nuevo
  update(data: orders[]) {
    if (!this.encargos) return;
    this.encargos.push(...data);
  }

  // Quitar un encargo de la lista cuando fue eliminado
  private updateOrders(data: orders) {
    if (!data || !this.encargos) return;
    this.encargos = this.encargos.filter((e) => e.id !== data.id);
  }

  // ---------------------------
  //   ELIMINAR ENCARGO
  // ---------------------------
  delete(ref: orders, id: number) {
    // Verificar datos válidos
    if (!this.encargos || !ref.id) return;

    // Marcar qué botón muestra el spinner
    this.spinnerId = id;

    this.deleteOrderService.dltOrder(ref.id).subscribe({
      next: (data: orders) => {
        // Dar un pequeño delay para suavizar la animación
        setTimeout(() => {
          this.updateOrders(data); // Actualizar lista
          this.spinnerId = null; // Ocultar spinner
        }, 300);
      },
    });
  }

  // ---------------------------
  //   ANIMACIÓN DE NOTIFICACIÓN
  // ---------------------------
  animate() {
    // Delay para sincronizar con transiciones
    setTimeout(() => {
      this.showNotification = true;
      setTimeout(() => (this.showNotification = false), 3000);
    }, 200);
  }
}
