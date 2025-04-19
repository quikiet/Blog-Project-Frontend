import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'
})
export class AuthCallbackComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('access_token', token);
      this.router.navigate(['/']); // về trang chính hoặc dashboard
    } else {
      alert("Đăng nhập thất bại");
      this.router.navigate(['/login']);
    }
  }
}
