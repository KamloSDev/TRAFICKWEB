import { TestBed } from '@angular/core/testing';

import { CallnotifService } from './callnotif.service';

describe('CallnotifService', () => {
  let service: CallnotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallnotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
