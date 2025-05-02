import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const stepGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userData = localStorage.getItem('userData'); // cambia la key si usas otra

  if (!userData) {
    router.navigate(['home']);
    return false;
  }

  return true;
};
