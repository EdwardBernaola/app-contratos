import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DocumentoUseCases } from '../../core/application/use-cases/documento.use-cases';
import { ArchivoSubida, validarArchivo, TAMANO_MAXIMO_ARCHIVO, formatearTamano } from '../../core/domain/models/archivo-adjunto';

interface DialogData {
  contratoId: string;
}

@Component({
  selector: 'app-documento-carga-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './documento-carga-dialog.html',
  styleUrl: './documento-carga-dialog.scss',
})
export class DocumentoCargaDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<DocumentoCargaDialog>);
  private readonly fb = inject(FormBuilder);
  private readonly docUseCases = inject(DocumentoUseCases);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly archivos = signal<File[]>([]);
  readonly subiendo = signal(false);
  readonly error = signal<string | null>(null);

  readonly formulario = this.fb.group({
    descripcion: [''],
  });

  ngOnInit(): void {}

  onArchivosSeleccionados(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const nuevos = Array.from(input.files);
      this.validarYAgregar(nuevos);
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      this.validarYAgregar(Array.from(event.dataTransfer.files));
    }
  }

  validarYAgregar(archivos: File[]): void {
    for (const archivo of archivos) {
      const validacion = validarArchivo(archivo);
      if (!validacion.valido) {
        this.error.set(validacion.error || 'Archivo inválido');
        setTimeout(() => this.error.set(null), 5000);
        continue;
      }
      if (this.archivos().some(a => a.name === archivo.name && a.size === archivo.size)) {
        this.error.set(`El archivo "${archivo.name}" ya está en la lista`);
        setTimeout(() => this.error.set(null), 5000);
        continue;
      }
      this.archivos.update(a => [...a, archivo]);
    }
  }

  eliminarArchivo(index: number): void {
    this.archivos.update(a => a.filter((_, i) => i !== index));
  }

  subir(): void {
    if (this.archivos().length === 0) {
      this.error.set('No hay archivos para subir');
      return;
    }

    this.subiendo.set(true);
    this.error.set(null);

    const promesas = this.archivos().map(archivo =>
      this.docUseCases.subir({ archivo, contratoId: this.data.contratoId }).toPromise()
    );

    Promise.all(promesas)
      .then(() => this.dialogRef.close(true))
      .catch((e: any) => {
        this.error.set(e.message || 'Error al subir archivos');
        this.subiendo.set(false);
      });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const tamaños = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamaños[i];
  }

  protected readonly TAMANO_MAXIMO_ARCHIVO = TAMANO_MAXIMO_ARCHIVO;
}