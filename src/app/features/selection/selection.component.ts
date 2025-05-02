import { Component } from '@angular/core';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent {
  loading: boolean = false;

  mostrarLoading() {
    this.loading = true;
    console.log('loading iniciado');
  }

  finalizoCarga() {
    console.log('📦 Lista cargada, desactivando loading...');
    this.loading = false;
  }
}
