import { CommonModule } from '@angular/common';
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
import { Clients } from '../../../../interfaces/clients';
import { newPay } from '../../../../interfaces/newPay';
import { NewPayService } from '../../../../services/newPay/new-pay.service';

type Status = 'loading' | 'nothing' | 'error' | 'success';
@Component({
  selector: 'app-add-pay',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-pay.component.html',
  styleUrl: './add-pay.component.css',
})
export class AddPayComponent {
  constructor(private newPayService: NewPayService) {}

  /* ---------- Inputs / Outputs ---------- */
  @Input() ShowModalPay: boolean = false;
  @Output() sendSignal = new EventEmitter<boolean>();
  @Output() signal = new EventEmitter<Clients>();
  @Output() pay = new EventEmitter<number>();

  /* ---------- ViewChilds ---------- */
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  /* ---------- Data ---------- */
  client: Clients | null = null;
  newPay: newPay | null = null;

  amount: number | null = null;
  Description: string | null = null;
  alert: boolean = false;
  Status: Status = 'nothing';
  AlertMsg:string = 'Debe completar todos los campos.'

  /* ---------- Dropdown ---------- */
  showDropDown: boolean = false;
  reasonSelected: string = 'Seleccionar método';
  methods: string[] = ['efectivo', 'transferencia'];

  /* ---------- Event Listeners ---------- */
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

  /* ---------- UI Methods ---------- */
  closeModal(): void {
    this.ShowModalPay = false;
    this.sendSignal.emit(false);
    this.reset();
  }

  enterPressed(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.blur();
  }

  /* ---------- Parent Communication ---------- */
  getUserInfo(data: Clients): void {
    this.client = data;
  }

  private reset() {
    setTimeout(() => {
      this.reasonSelected = 'Seleccionar método';
      this.amount = null;
      this.alert = false
    }, 500);
  }

  /* ---------- Form Submission ---------- */

  private buildNewPay() {
    if (!this.amount) return;

    this.newPay = {
      client_id: this.client?.id || 0,
      amount: this.amount,
      date: new Date().toLocaleString('sv', {
        timeZone: 'America/Argentina/Buenos_Aires',
      }),
      payment_method: this.reasonSelected.toLowerCase(),
      description: this.Description?.toLowerCase() || '',
    };
  }

  async submit() {
    if (
      this.reasonSelected === 'Seleccionar método' ||
      this.amount === null ||
      this.amount === 0 || !this.client
    ) {
      this.alert = true;
      this.AlertMsg = 'Debe completar todos los campos.'
      return;
    }

    

    if(this.amount >this.client?.debt){
      this.alert =  true
      this.AlertMsg = 'Está ingresando un pago mayor a la deuda.'
      return
    }

    this.alert = false;
    this.Status = 'loading';
    this.buildNewPay();

    try {
      if (!this.newPay) return;
      const data = await this.newPayService.saveNewPay(this.newPay);
      if (!this.client) return;
      const newDebt: number = this.client?.debt - this.newPay.amount;
      this.client.debt = newDebt;

      this.reset();
      this.signal.emit(this.client);
      this.closeModal();

      setTimeout(() => {
        this.Status = 'nothing';
        this.pay.emit(newDebt);
      }, 200);
    } catch (error: any) {
      this.Status = 'error';
      console.log(error);
    } finally {
      setTimeout(() => {
        this.Status = 'nothing';
      }, 5000);
    }
  }
}
