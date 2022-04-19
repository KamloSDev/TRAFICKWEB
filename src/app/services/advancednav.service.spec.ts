import { TestBed } from '@angular/core/testing';

import { AdvancednavService } from './advancednav.service';

describe('AdvancednavService', () => {
  let service: AdvancednavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancednavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
