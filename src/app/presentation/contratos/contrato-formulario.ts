import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContratoUseCases } from '../../core/application/use-cases/contrato.use-cases';
import { Contrato, EstadoContrato, ESTADOS_CONTRATO, TipoContrato, TIPOS_CONTRATO, Moneda, MONEDAS, generarCodigoContrato } from '../../core/domain/models/contrato';

@Component({
  selector: 'app-contrato-formulario',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './contrato-formulario.html',
  styleUrl: './contrato-formulario.scss',
})
export class ContratoFormulario implements OnInit {
  private readonly useCases = inject(ContratoUseCases);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly esEdicion = signal(false);
  readonly contratoId = signal<string | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly validandoCodigo = signal(false);

  readonly estados = ESTADOS_CONTRATO;
  readonly tipos = TIPOS_CONTRATO;
  readonly monedas = MONEDAS;

  readonly formulario = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.maxLength(30)]],
    titulo: ['', [Validators.required, Validators.maxLength(200)]],
    objeto: ['', Validators.maxLength(1000)],
    tipo: [TipoContrato.SERVICIOS, Validators.required],
    contratistaIdentificacion: ['', [Validators.required, Validators.maxLength(30)]],
    contratistaNombre: ['', [Validators.required, Validators.maxLength(200)]],
    contratistaContacto: ['', Validators.maxLength(200)],
    contratistaEmail: ['', [Validators.email, Validators.maxLength(100)]],
    contratistaTelefono: ['', Validators.maxLength(30)],
    areaId: ['', Validators.required],
    responsableId: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    valor: [0, [Validators.required, Validators.min(0)]],
    moneda: [Moneda.COP, Validators.required],
    estado: [EstadoContrato.BORRADOR, Validators.required],
    descripcion: ['', Validators.maxLength(2000)],
  }, { validators: this.validarFechas });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.esEdicion.set(true);
      this.contratoId.set(id);
      this.cargarContrato(id);
    } else {
      this.generarCodigo();
    }
  }

  generarCodigo(): void {
    this.formulario.patchValue({ codigo: generarCodigoContrato() });
  }

  cargarContrato(id: string): void {
    this.cargando.set(true);
    this.useCases.obtenerPorId(id).subscribe({
      next: c => {
        if (c) {
          this.formulario.patchValue({
            codigo: c.codigo,
            titulo: c.titulo,
            objeto: c.objeto || '',
            tipo: c.tipo,
            contratistaIdentificacion: c.contratista.identificacion,
            contratistaNombre: c.contratista.nombre,
            contratistaContacto: c.contratista.contacto || '',
            contratistaEmail: c.contratista.email || '',
            contratistaTelefono: c.contratista.telefono || '',
            areaId: c.areaId,
            responsableId: c.responsableId,
            fechaInicio: c.fechaInicio,
            fechaFin: c.fechaFin,
            valor: c.valor,
            moneda: c.moneda,
            estado: c.estado,
            descripcion: c.descripcion || '',
          });
          this.formulario.get('codigo')?.disable();
        }
        this.cargando.set(false);
      },
      error: e => {
        this.error.set(e.message || 'Error al cargar el contrato');
        this.cargando.set(false);
      },
    });
  }

  validarFechas(control: AbstractControl): ValidationErrors | null {
    const inicio = control.get('fechaInicio')?.value;
    const fin = control.get('fechaFin')?.value;
    if (inicio && fin) {
      const fInicio = new Date(inicio);
      const fFin = new Date(fin);
      fInicio.setHours(0, 0, 0, 0);
      fFin.setHours(0, 0, 0, 0);
      if (fFin <= fInicio) {
        return { fechasInvalidas: true };
      }
    }
    return null;
  }

  async guardar(comoBorrador = false): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const datos = this.formulario.getRawValue();
    const contrato: any = {
      ...datos,
      contratista: {
        identificacion: datos.contratistaIdentificacion,
        nombre: datos.contratistaNombre,
        contacto: datos.contratistaContacto,
        email: datos.contratistaEmail,
        telefono: datos.contratistaTelefono,
      },
      estado: comoBorrador ? EstadoContrato.BORRADOR : datos.estado,
    };

    if (this.esEdicion()) {
      contrato.id = this.contratoId();
    }

    try {
      await this.useCases.crear(contrato).toPromise();
      this.router.navigate(['/contratos']);
    } catch (e: any) {
      this.error.set(e.message || 'Error al guardar el contrato');
    } finally {
      this.guardando.set(false);
    }
  }

  cancelar(): void {
    this.router.navigate(['/contratos']);
  }

  obtenerColorEstado(estado: EstadoContrato): 'primary' | 'accent' | 'warn' | 'basic' {
    const e = this.estados.find(es => es.valor === estado);
    return e?.color || 'basic';
  }
}