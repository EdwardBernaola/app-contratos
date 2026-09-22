import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ContratoUseCases } from '../../core/application/use-cases/contrato.use-cases';
import { DocumentoUseCases } from '../../core/application/use-cases/documento.use-cases';
import { Contrato, EstadoContrato, ESTADOS_CONTRATO, TipoContrato, TIPOS_CONTRATO, Moneda, MONEDAS } from '../../core/domain/models/contrato';
import { ArchivoAdjunto, formatearTamano, esPrevisualizable } from '../../core/domain/models/archivo-adjunto';
import { DocumentoCargaDialog } from './documento-carga-dialog';

@Component({
  selector: 'app-contrato-detalle',
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './contrato-detalle.html',
  styleUrl: './contrato-detalle.scss',
})
export class ContratoDetalle implements OnInit {
  private readonly useCases = inject(ContratoUseCases);
  private readonly docUseCases = inject(DocumentoUseCases);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly subiendo = signal(false);

  readonly contrato = signal<Contrato | null>(null);
  readonly archivos = signal<ArchivoAdjunto[]>([]);

  readonly estados = ESTADOS_CONTRATO;
  readonly tipos = TIPOS_CONTRATO;
  readonly monedas = MONEDAS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarContrato(id);
      this.cargarArchivos(id);
    }
  }

  cargarContrato(id: string): void {
    this.useCases.obtenerPorId(id).subscribe({
      next: c => {
        this.contrato.set(c);
        this.cargando.set(false);
      },
      error: e => {
        this.error.set(e.message || 'Error al cargar el contrato');
        this.cargando.set(false);
      },
    });
  }

  cargarArchivos(contratoId: string): void {
    this.docUseCases.listarPorContrato(contratoId).subscribe({
      next: a => this.archivos.set(a),
      error: () => {},
    });
  }

  volver(): void {
    this.router.navigate(['/contratos']);
  }

  editar(): void {
    const id = this.contrato()?.id;
    if (id) this.router.navigate(['/contratos', id, 'editar']);
  }

  async eliminar(): Promise<void> {
    const c = this.contrato();
    if (!c || !confirm('¿Eliminar este contrato? Se marcará como eliminado y se auditará.')) return;

    this.guardando.set(true);
    try {
      await this.useCases.eliminar(c.id).toPromise();
      this.router.navigate(['/contratos']);
    } catch (e: any) {
      this.error.set(e.message || 'Error al eliminar');
    } finally {
      this.guardando.set(false);
    }
  }

  abrirCargaArchivos(): void {
    const c = this.contrato();
    if (!c) return;
    const ref = this.dialog.open(DocumentoCargaDialog, {
      width: '600px',
      data: { contratoId: c.id },
    });
    ref.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarArchivos(c.id);
    });
  }

  descargar(archivo: ArchivoAdjunto): void {
    this.docUseCases.descargar(archivo.id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = archivo.nombreOriginal;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: e => console.error('Error al descargar', e),
    });
  }

  async eliminarArchivo(archivo: ArchivoAdjunto): Promise<void> {
    if (!confirm(`¿Eliminar "${archivo.nombreOriginal}"?`)) return;
    try {
      await this.docUseCases.eliminar(archivo.id).toPromise();
      this.archivos.update(a => a.filter(f => f.id !== archivo.id));
    } catch (e) {
      console.error('Error al eliminar archivo', e);
    }
  }

  previsualizar(archivo: ArchivoAdjunto): void {
    if (!esPrevisualizable(archivo.tipoMime)) return;
    this.docUseCases.descargar(archivo.id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
    });
  }

  obtenerColorEstado(estado: EstadoContrato): 'primary' | 'accent' | 'warn' | 'basic' {
    const e = ESTADOS_CONTRATO.find(es => es.valor === estado);
    return e?.color || 'basic';
  }

  getEstadoEtiqueta(estado: EstadoContrato): string {
    const e = ESTADOS_CONTRATO.find(es => es.valor === estado);
    return e?.etiqueta || estado;
  }

  obtenerSeveridadVencimiento(dias: number | undefined): 'normal' | 'alerta' | 'critico' {
    if (dias === undefined) return 'normal';
    if (dias < 0) return 'critico';
    if (dias <= 30) return 'alerta';
    return 'normal';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatearMoneda(valor: number, moneda: Moneda): string {
    const m = MONEDAS.find(m => m.valor === moneda);
    const simbolo = m?.simbolo || '$';
    return `${simbolo} ${valor.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  }

  formatearTamano = formatearTamano;
  esPrevisualizable = esPrevisualizable;
}