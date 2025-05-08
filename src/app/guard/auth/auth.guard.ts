import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const isAuthenticated = localStorage.getItem('user');
  if (!isAuthenticated) {
    // Navigate to login page and return false
    return router.createUrlTree(['/login']);
  }
  return true;
};

