import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { stepGuard } from './core/guards/step.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'config',
    canActivate: [stepGuard],
    loadChildren: () => import('./features/config/config.module').then(m => m.ConfigModule)
  },
  {
    path: 'selection',
    canActivate: [stepGuard],
    loadChildren: () => import('./features/selection/selection.module').then(m => m.SelectionModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
