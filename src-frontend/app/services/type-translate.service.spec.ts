import { TestBed } from '@angular/core/testing';

import { TypeTranslateService } from './type-translate.service';

describe('TypeTranslateService', () => {
  let service: TypeTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
