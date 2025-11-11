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
import { HistoryClient } from '../../../../interfaces/historyClient';
import { EditPayOrSaleService } from '../../../../services/editPayOrSale/edit-pay-or-sale.service';

type Status = 'loading' | 'nothing' | 'error' | 'success';

@Component({
  selector: 'app-edit-pay-or-sale',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-pay-or-sale.component.html',
  styleUrl: './edit-pay-or-sale.component.css',
})
export class EditPayOrSaleComponent {
  constructor(private editPayOrSale: EditPayOrSaleService) {}
  // ──────────────── Estado general ────────────────
  Status: Status = 'nothing';
  disableBtn: boolean = true;
  alert: boolean = false;
  movementType: string = 'Venta';
  reasonSelected: string | null = null;
  showDropDown: boolean = false;

  // ──────────────── Inputs / Outputs ────────────────
  @Input() showMovementModal: boolean = false;
  @Output() signalOut = new EventEmitter<boolean>();
  @Output() signalToReload = new EventEmitter<void>();
  @Output() newDebt = new EventEmitter<number>();
  @Output() updateHistory = new EventEmitter<number | null>();

  // ──────────────── Referencias del template ────────────────
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  // ──────────────── Datos del cliente ────────────────

  methods: string[] = ['efectivo', 'transferencia'];
  oldData: HistoryClient | null = null;
  newData: HistoryClient | null = null;
  id_client: number | null = null;

  // ──────────────── Métodos del componente ────────────────

  /** Cierra la modal y notifica al componente padre */
  closeModal(): void {
    this.showMovementModal = false;
    this.signalOut.emit(this.showMovementModal);
    setTimeout(() => {
      this.reset();
    }, 300);
  }

  private reset(): void {
    this.oldData = null;
    this.newData = null;
    this.Status = 'nothing';
    this.disableBtn = true;
    this.reasonSelected = null;
    this.alert = false;
  }

  /** Carga la información del movimiento seleccionado */
  getInfo(data: HistoryClient, id_client: number): void {
    this.movementType = data.type;
    this.reasonSelected = data.description;
    this.oldData = { ...data };
    this.newData = { ...data };
    this.id_client = id_client;
  }

  checkDifference() {
    if (!this.oldData || !this.newData) return;

    if (
      !this.newData.description ||
      this.newData.description.length < 5 ||
      !this.newData.amount ||
      this.newData.amount.toString().length < 3 ||
      this.newData.amount === 0
    ) {
      // this.alert = true;
      this.disableBtn = true;
      return;
    }

    const normalizedNewData = {
      ...this.newData,
      description: this.newData.description.toLowerCase(),
      description2: this.newData.description2.toLowerCase(),
    };

    if (JSON.stringify(this.oldData) !== JSON.stringify(normalizedNewData)) {
      this.disableBtn = false;
    } else {
      this.disableBtn = true;
    }
  }

  async submit(): Promise<void> {
    if (!this.newData || !this.id_client) return;

    this.Status = 'loading';

    const response = await this.editPayOrSale.saveChanges(
      this.newData,
      this.id_client
    );

    this.Status = 'nothing';

    if (!response.success) return;

    this.newDebt.emit(response.debt);
    this.updateHistory.emit(this.id_client);
    this.closeModal();
  }

  /** Cierra el dropdown al hacer click fuera */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (
      this.showDropDown &&
      !this.dropdownMenu.nativeElement.contains(event.target)
    ) {
      this.showDropDown = false;
    }
  }
}
