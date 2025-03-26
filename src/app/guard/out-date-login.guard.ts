import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const outDateLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const token_expiration = localStorage.getItem('token_expiration');
  const now = new Date().getTime();

  if (token && token_expiration) {
    if (now < parseInt(token_expiration)) {
      return true;
    } else {
      alert('Phiên đăng nhập đã hết hạn. Bạn có thể đăng nhập lại!');
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
