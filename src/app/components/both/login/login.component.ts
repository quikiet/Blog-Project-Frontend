import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/Auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor(private http: HttpClient, private loginService: LoginService, private toastr: ToastrService, private router: Router) { }
  loginFields = {
    email: '',
    password: ''
  };

  login(): void {
    if (this.loginFields.email === '' || this.loginFields.password === '') {
      this.toastr.error('Vui lòng nhập đầy đủ thông tin', 'Lỗi');
      return;
    }

    this.loginService.login(this.loginFields).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Đăng nhập thành công', 'Thành công');
        // Lưu token vào LocalStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token_expiration', res.expires_at.toString());

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message, 'Lỗi');
      }
    });
  }

}
