import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loading: boolean = false;

  mostrarLoading() {
    this.loading = true;
  }

  ocultarLoading() {
    this.loading = false;
  }
}
