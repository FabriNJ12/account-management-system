import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { customers } from '../../../interfaces/customers';
import { EditCustomersService } from '../../../services/editCustomers/edit-customers.service';

type Status = 'loading' | 'nothing' | 'error' | 'success';

@Component({
  selector: 'app-edit-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-customers.component.html',
  styleUrl: './edit-customers.component.css',
})
export class EditCustomersComponent {
  constructor(private editCustomers: EditCustomersService) {}
  @Input() showModal: boolean = false;
  @Output() CloseEditCustomer = new EventEmitter<boolean>();

  customer: customers | null = null;

  closeModal() {
    this.showModal = false
    this.CloseEditCustomer.emit(false);
  }

  oldData: customers | null = null;
  newData: customers | null = null;
  disableBtn: boolean = false;

  getUser(data: customers) {
    this.oldData = { ...data };
    this.newData = { ...data }; 
    this.tel = data.tel;
    this.customerName = data.name;
  }

  ckeckData() {
    if (
      this.customerName.length === 0 ||
      this.tel === null ||
      this.tel.toString().length !== 10
    ) {
      this.alert = true;

      return;
    }
    if (!this.newData || !this.oldData) return;

    this.newData.name = this.customerName;
    this.newData.tel = Number(this.tel);

    if (JSON.stringify(this.newData) !== JSON.stringify(this.oldData)) {
      this.disableBtn = true;
    } else {
      this.disableBtn = false;
    }
  }

  @Output() signalToModal = new EventEmitter<void>
  async submit() {
    this.Status = 'loading'
    if (!this.newData) return;

    const result = await this.editCustomers.saveCustomer(this.newData);

    if (result.exists) {
      this.alert = true;
      this.alertMsg = 'Ese número ya está registrado.';
      this.Status = 'nothing';
    } else if (result.success) {
      setTimeout(() => {
        this.alert = false;
        this.closeModal();
        this.Status = 'nothing'
        this.signalToModal.emit()
      }, 500);
    }
  }

  Status: Status = 'nothing';
  alertMsg = 'hola amigo';
  tel: number = 0;
  customerName: string = '';
  alert: boolean = false;
}
