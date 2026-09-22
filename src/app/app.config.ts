import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { AuthRepository } from './core/domain/ports/auth.repository';
import { TokenStoragePort } from './core/domain/ports/token-storage.port';
import { ContratoRepository } from './core/domain/ports/contrato.repository';
import { DocumentoRepository } from './core/domain/ports/documento.repository';
import { AuthMockRepository } from './infrastructure/repositories/auth-mock.repository';
import { AuthHttpRepository } from './infrastructure/repositories/auth-http.repository';
import { ContratoMockRepository } from './infrastructure/repositories/contrato-mock.repository';
import { ContratoHttpRepository } from './infrastructure/repositories/contrato-http.repository';
import { DocumentoMockRepository } from './infrastructure/repositories/documento-mock.repository';
import { DocumentoHttpRepository } from './infrastructure/repositories/documento-http.repository';
import { LocalStorageTokenStorage } from './infrastructure/storage/token-storage.service';
import { authInterceptor } from './infrastructure/interceptors/auth.interceptor';
import { environment } from './infrastructure/config/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    { provide: AuthRepository, useClass: environment.usarAuthMock ? AuthMockRepository : AuthHttpRepository },
    { provide: ContratoRepository, useClass: environment.usarAuthMock ? ContratoMockRepository : ContratoHttpRepository },
    { provide: DocumentoRepository, useClass: environment.usarAuthMock ? DocumentoMockRepository : DocumentoHttpRepository },
    { provide: TokenStoragePort, useClass: LocalStorageTokenStorage },
  ],
};