import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/core/models/user-data.model';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-image-uploaded',
  templateUrl: './image-uploaded.component.html',
  styleUrls: ['./image-uploaded.component.css']
})
export class ImageUploadedComponent implements OnInit{
  imagenBase64: string = '';
  userData!: UserData;
  edad: string = '';
  isTrainer: boolean = false;
  @Output() name = new EventEmitter<string>();

  constructor(
    private readonly userDataService : UserDataService,
    private readonly router : Router
  ){}

  ngOnInit(){

    this.userData = this.userDataService.obtener()!;
    this.imagenBase64 = this.userData.imagen;
    this.edad = this.calcularEdad(this.userData.cumpleanos);
    if (this.router.url === '/config') {
      //console.log('/config');
      this.isTrainer = true
      this.name.emit(this.userData.nombre);
    }
  }

  calcularEdad(fecha: string): string {
    const [dia, mes, anio] = fecha.split('/').map(Number);
    const nacimiento = new Date(anio, mes - 1, dia); // mes -1 porque en JS enero es 0
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    // Resta un año si todavía no ha cumplido este año
    if (
      mesActual < nacimiento.getMonth() ||
      (mesActual === nacimiento.getMonth() && diaActual < nacimiento.getDate())
    ) {
      edad--;
    }

    return String(edad);
  }

}
