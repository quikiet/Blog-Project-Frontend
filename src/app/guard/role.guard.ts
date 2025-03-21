import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const expectedRole = route.data?.['role'];
  const token = localStorage.getItem('token');
  const token_expiration = localStorage.getItem('token_expiration');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  if (user && user.role === expectedRole)
    return true;
  else {
    router.navigate(['/']);
    return false;
  }
};
