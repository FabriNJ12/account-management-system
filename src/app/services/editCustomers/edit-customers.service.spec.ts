import { TestBed } from '@angular/core/testing';

import { EditCustomersService } from './edit-customers.service';

describe('EditCustomersService', () => {
  let service: EditCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
