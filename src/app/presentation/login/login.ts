import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoginUseCase } from '../../core/application/use-cases/login.use-case';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly ocultarContrasena = signal(true);

  readonly formulario = this.formBuilder.nonNullable.group({
    usuario: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    recordarme: [false],
  });

  alternarContrasena(): void {
    this.ocultarContrasena.update((ocultar) => !ocultar);
  }

  ingresar(): void {
    this.error.set(null);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    this.loginUseCase.ejecutar(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (fallo: unknown) => {
        this.cargando.set(false);
        this.error.set(
          fallo instanceof Error ? fallo.message : 'No se pudo iniciar sesión',
        );
      },
    });
  }
}