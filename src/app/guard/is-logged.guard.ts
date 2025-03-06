import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = new Router();

  if (token && (state.url === '/login' || state.url === '/register')) {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }


};
