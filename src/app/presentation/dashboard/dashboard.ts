import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AuthSessionService } from '../../core/application/auth-session.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly usuario = this.authSession.usuario;

  readonly kpis = computed(() => {
    const u = this.usuario();
    if (!u) return [];
    return [
      { label: 'Total contratos', valor: '—', color: 'primary' },
      { label: 'Vigentes', valor: '—', color: 'accent' },
      { label: 'Por vencer', valor: '—', color: 'warn' },
      { label: 'Vencidos', valor: '—', color: 'warn' },
    ];
  });

  cerrarSesion(): void {
    this.authSession.cerrarSesion();
    this.router.navigate(['/login']);
  }
}