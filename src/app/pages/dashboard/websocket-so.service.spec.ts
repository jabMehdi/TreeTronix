import { TestBed } from '@angular/core/testing';

import { WebsocketSoService } from './websocket-so.service';

describe('WebsocketSoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocketSoService = TestBed.get(WebsocketSoService);
    expect(service).toBeTruthy();
  });
});
