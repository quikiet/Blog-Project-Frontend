import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token');
  const token_expiration = localStorage.getItem('token_expiration');

  if (token && token_expiration) {
    const now = new Date().getTime();

    console.log("now: " + now / 1000);
    console.log(token_expiration);

    if ((now / 1000) < parseInt(token_expiration)) {
      router.navigate(['/']);

    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      localStorage.removeItem('user');
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    }
  } else {
    return true;
  }

  return false;

};
