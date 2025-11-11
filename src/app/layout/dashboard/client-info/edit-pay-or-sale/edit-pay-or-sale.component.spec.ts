import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPayOrSaleComponent } from './edit-pay-or-sale.component';

describe('EditPayOrSaleComponent', () => {
  let component: EditPayOrSaleComponent;
  let fixture: ComponentFixture<EditPayOrSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPayOrSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPayOrSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
