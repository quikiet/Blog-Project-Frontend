import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token');
  const token_expiration = localStorage.getItem('token_expiration');

  if (token && token_expiration) {
    const now = new Date().getTime();
    if (now < parseInt(token_expiration)) {
      router.navigate(['/']);
      return false;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      localStorage.removeItem('user');
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      return false;
    }
  } else {
    return true;
  }

  return false;

};
