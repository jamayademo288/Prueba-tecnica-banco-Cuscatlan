import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/core/models/user-data.model';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  perfilForm!: FormGroup;
  hasImage: boolean = true;
  fileName: string = '';
  imagenBase64: string | null = null;
  userData!: UserData;
  @Output() loadingStart = new EventEmitter<void>();
  @Output() loadingEnd = new EventEmitter<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly userDataService: UserDataService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      pasatiempo: [''],
      cumpleanos: ['', Validators.required],
      documento: ['', [Validators.required, Validators.pattern(/^\d{8}-\d{1}$/)]],
      imageAvatar: ['', Validators.required],
    });

    this.perfilForm.get('cumpleanos')?.valueChanges.subscribe(value => {
      if(!this.isMayorDe18(value)){
        this.perfilForm.get('documento')?.clearValidators();
        this.perfilForm.get('documento')?.updateValueAndValidity();
      }

    });

    this.obtener();
  }

  obtener() {
    this.userData = this.userDataService.obtener()!;
    console.log('Equipo guardado:', this.userData);

    if (this.userData) {
      this.perfilForm.patchValue({
        nombre: this.userData.nombre || '',
        pasatiempo: this.userData.pasatiempo || '',
        cumpleanos: this.userData.cumpleanos || '',
        documento: this.userData.documentos || '',
        imageAvatar: this.userData.imagen || ''
      });
      this.imagenBase64 = this.userData.imagen
      this.hasImage = false;
      this.fileName = this.userData.nombre;
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.warn('Archivo no es una imagen válida');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenBase64 = reader.result as string;
      this.hasImage = false;
      this.fileName = file.name;
    };
    reader.readAsDataURL(file);
  }

  eliminarImagen(): void {
    this.imagenBase64 = null;
    this.hasImage = true;
    this.fileName = '';
  }

  onDocumentoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 9) value = value.slice(0, 9);

    let formatted = value;
    if (value.length >= 9) {
      formatted = `${value.slice(0, 8)}-${value.slice(8)}`;
    }

    this.perfilForm.get('documento')?.setValue(formatted, { emitEvent: true });
    this.perfilForm.get('documento')?.markAsTouched();
    this.perfilForm.get('documento')?.updateValueAndValidity();
  }


  onFechaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.perfilForm.get('cumpleanos')?.setValue(value);
    //console.log('Fecha detectada:', value);
  }

  isMayorDe18(fecha: string): boolean {
    const [dia, mes, anio] = fecha.split('/').map(Number);
    const fechaNacimiento = new Date(anio, mes - 1, dia);
    const hoy = new Date();

    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    if (
      mesActual < fechaNacimiento.getMonth() ||
      (mesActual === fechaNacimiento.getMonth() && diaActual < fechaNacimiento.getDate())
    ) {
      return edad - 1 >= 18;
    }

    return edad >= 18;
  }

  onSaveUser() {
    if (this.perfilForm.invalid) return;

    const itemUser = this.perfilForm.getRawValue();

    const datos: UserData = {
      nombre: itemUser.nombre,
      pasatiempo: itemUser.pasatiempo,
      imagen: this.imagenBase64!,
      cumpleanos: itemUser.cumpleanos,
      documentos: itemUser.documento,
      ...(this.userData?.pokemonesSeleccionados?.length ? { pokemonesSeleccionados: this.userData.pokemonesSeleccionados } : {})
    };

    this.loadingStart.emit();

    timer(500).pipe(
      tap(() => this.userDataService.guardar(datos)),
      tap(() => this.loadingEnd.emit()),
      tap(() => this.router.navigate(['selection']))
    ).subscribe();
  }
}
