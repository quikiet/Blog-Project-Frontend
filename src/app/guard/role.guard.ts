import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const expextedRole = route.data['role'];
  const router = new Router;
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  if (user && user.role === expextedRole)
    return true;
  else {
    router.navigate(['/']);
    return false;
  }
};
