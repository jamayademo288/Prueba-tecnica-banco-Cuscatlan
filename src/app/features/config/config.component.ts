import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  loading: boolean = false;
  nameTrainer: string = '';

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  mostrarLoading() {
    this.loading = true;
    console.log('loading iniciado');
  }

  finalizoCarga() {
    console.log('📦 Lista cargada, desactivando loading...');
    this.loading = false;
  }

  name(value: string) {
    this.nameTrainer = value;
    this.cdr.detectChanges();
    console.log(this.nameTrainer);
  }

  editProfile(){
    this.router.navigate(['home']);
  }
}
