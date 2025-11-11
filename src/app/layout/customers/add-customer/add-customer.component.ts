import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { newCustomer } from '../../../interfaces/newCustomer';
import { NewCustomerService } from '../../../services/newCustomer/new-customer.service';

type Status = 'loading' | 'nothing' | 'error' | 'success';

@Component({
  selector: 'app-add-customer',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css',
})
export class AddCustomerComponent {
  @Input() ShowModalClient: boolean = false;
  @Output() closeSignal = new EventEmitter<boolean>();
  @Output() signalToAlert = new EventEmitter<void>();

  constructor(private newCustomerService: NewCustomerService) {}

  Status: Status = 'nothing';
  customerName: string = '';
  tel: number | null = null;
  alert: boolean = false;
  alertMsg: string = '';

  closeModal(): void {
    this.ShowModalClient = false;
    this.closeSignal.emit(false);
    this.alert = false;
    this.customerName = '';
    this.tel = null;
    this.Status = 'nothing';
  }

  isValid: boolean = false;
  validateTel() {
    if (!this.tel) return;

    const number = this.tel.toString();
    if (number.length === 10) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }
  newCustomer: newCustomer | null = null;

  submit(): void {
    if (this.customerName === '' || !this.isValid || !this.tel) {
      this.alert = true;
      this.alertMsg = 'Debe completar todos los campos.';
      return;
    }

    this.newCustomer = {
      name: this.customerName.toLowerCase(),
      tel: this.tel,
    };

    this.Status = 'loading';
    this.response();
    this.alert = false;
  }

  async response() {
    if (!this.newCustomer) return;

    const result = await this.newCustomerService.saveNewCustomer(
      this.newCustomer
    );

    if (result.exists) {
      this.alert = true
      this.alertMsg = 'Ese número ya está registrado.';
      this.Status = 'nothing';
    } else if (result.success) {
      setTimeout(() => {
        this.alert = false;
        this.closeModal();
        this.signalToAlert.emit();
        this.Status = 'nothing';
      }, 500);
    }
  }
}
