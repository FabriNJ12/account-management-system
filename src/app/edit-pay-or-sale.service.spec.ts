import { TestBed } from '@angular/core/testing';

import { EditPayOrSaleService } from './services/editPayOrSale/edit-pay-or-sale.service';

describe('EditPayOrSaleService', () => {
  let service: EditPayOrSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditPayOrSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
