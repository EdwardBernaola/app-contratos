import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ContratoUseCases } from '../../core/application/use-cases/contrato.use-cases';
import { Contrato, ContratoFiltros, ContratoPaginado, EstadoContrato, ESTADOS_CONTRATO, TipoContrato, TIPOS_CONTRATO } from '../../core/domain/models/contrato';

type ColumnasTabla = 'codigo' | 'titulo' | 'tipo' | 'area' | 'responsable' | 'fechaInicio' | 'fechaFin' | 'estado' | 'diasParaVencer' | 'acciones';

@Component({
  selector: 'app-contratos-lista',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './contratos-lista.html',
  styleUrl: './contratos-lista.scss',
})
export class ContratosLista implements OnInit {
  private readonly useCases = inject(ContratoUseCases);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly filtros = this.fb.group({
    busqueda: [''],
    estado: ['' as EstadoContrato | ''],
    tipo: ['' as TipoContrato | ''],
    areaId: [''],
    responsableId: [''],
    fechaInicioDesde: [''],
    fechaInicioHasta: [''],
    fechaFinDesde: [''],
    fechaFinHasta: [''],
  });

  readonly dataSource = signal<Contrato[]>([]);
  readonly totalElementos = signal(0);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly columnas: ColumnasTabla[] = ['codigo', 'titulo', 'tipo', 'area', 'responsable', 'fechaInicio', 'fechaFin', 'estado', 'diasParaVencer', 'acciones'];

  readonly estados = ESTADOS_CONTRATO;
  readonly tipos = TIPOS_CONTRATO;

  readonly stats = signal({ total: 0, porEstado: {}, porVencer: 0, vencidos: 0 });

  ngOnInit(): void {
    this.cargar();
    this.cargarEstadisticas();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    const f = this.filtros.getRawValue();
    const params: ContratoFiltros = {
      busqueda: f.busqueda || undefined,
      estado: f.estado || undefined,
      tipo: f.tipo || undefined,
      areaId: f.areaId || undefined,
      responsableId: f.responsableId || undefined,
      fechaInicioDesde: f.fechaInicioDesde || undefined,
      fechaInicioHasta: f.fechaInicioHasta || undefined,
      fechaFinDesde: f.fechaFinDesde || undefined,
      fechaFinHasta: f.fechaFinHasta || undefined,
      page: this.pageIndex(),
      size: this.pageSize(),
    };

    this.useCases.listar(params).subscribe({
      next: res => {
        this.dataSource.set(res.contenido);
        this.totalElementos.set(res.totalElementos);
        this.cargando.set(false);
      },
      error: e => {
        this.error.set(e.message || 'Error al cargar contratos');
        this.cargando.set(false);
      },
    });
  }

  cargarEstadisticas(): void {
    this.useCases.obtenerEstadisticas().subscribe({
      next: s => this.stats.set(s),
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.cargar();
  }

  onSortChange(sort: Sort): void {
    // El mock no implementa ordenamiento real; en backend sí
  }

  limpiarFiltros(): void {
    this.filtros.reset({ busqueda: '', estado: '', tipo: '', areaId: '', responsableId: '', fechaInicioDesde: '', fechaInicioHasta: '', fechaFinDesde: '', fechaFinHasta: '' });
    this.pageIndex.set(0);
    this.cargar();
  }

  nueva(): void {
    this.router.navigate(['/contratos/nuevo']);
  }

  ver(id: string): void {
    this.router.navigate(['/contratos', id]);
  }

  editar(id: string): void {
    this.router.navigate(['/contratos', id, 'editar']);
  }

  async eliminar(id: string): Promise<void> {
    if (!confirm('¿Está seguro de eliminar este contrato? Se marcará como eliminado y se auditará.')) return;
    this.cargando.set(true);
    try {
      await this.useCases.eliminar(id).toPromise();
      this.cargar();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      this.cargando.set(false);
    }
  }

  obtenerColorEstado(estado: EstadoContrato): 'primary' | 'accent' | 'warn' | 'basic' {
    const e = this.estados.find(es => es.valor === estado);
    return e?.color || 'basic';
  }

  obtenerSeveridadVencimiento(dias: number): 'normal' | 'alerta' | 'critico' {
    if (dias < 0) return 'critico';
    if (dias <= 30) return 'alerta';
    return 'normal';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO');
  }
}