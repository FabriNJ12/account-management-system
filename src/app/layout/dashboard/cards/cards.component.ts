import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../../services/cards/cards.service';
import { late_debt } from '../../../interfaces/late_debt';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  ngOnInit(): void {
    this.cardsService.fetchDebt();
    this.cardsService.lateDebt();
    this.carrousel();
    this.getDetb();
    this.getOlderPayment();
  }

  getDetb() {
    this.cardsService.fetchDebt();
    this.cardsService.$totalDebt.subscribe((data) => {
      this.totalDebt = data;
    });
  }

  getOlderPayment() {
    this.cardsService.lateDebt().subscribe((data: late_debt | null) => {
      if(!data){
        this.skeleton =false
        return
      }
      
      this.skeleton =false
      this.older_payment = data
    });
  }
  older_payment: late_debt | null = null;
  totalDebt: number | null = null;

  slice: boolean = false;
  skeleton: boolean = true;
  constructor(private cardsService: CardsService) {}

  carrousel() {
    setInterval(() => {
      this.slice = !this.slice;
    }, 4000);
  }
}
