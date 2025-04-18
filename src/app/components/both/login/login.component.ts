import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/Auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/Auth/register.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private registerService: RegisterService, private http: HttpClient, private loginService: LoginService, private toastr: ToastrService, private router: Router) { }
  loginFields = {
    email: '',
    password: ''
  };

  userData = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };
  userRole: string = '';
  tab: string = 'login';
  login(): void {
    if (this.loginFields.email === '' || this.loginFields.password === '') {
      this.toastr.error('Vui lòng nhập đầy đủ thông tin', 'Lỗi');
      return;
    }

    this.loginService.login(this.loginFields).subscribe({
      next: (res) => {
        // console.log(res);
        this.toastr.success('Đăng nhập thành công', 'Thành công');
        // Lưu token vào LocalStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token_expiration', res.expires_at.toString());
        this.userRole = this.loginService.getRole();
        // console.log('role' + this.userRole);

        if (this.userRole !== 'admin') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message, 'Lỗi');
      }
    });

  }

  loginWithGoogle() {
    console.log(1);
    window.location.href = 'http://localhost:8000/api/auth/google/redirect';
  }

  register() {
    try {

      this.registerService.register(this.userData).subscribe({
        next: (response) => {
          console.log("Đăng ký thành công!", response);
          alert("Chúc mừng bạn đã đăng ký tài khoản thành công!");
          this.tab = 'login';
        },
        error: (error) => {
          if (this.userData.password !== this.userData.password_confirmation) {
            this.toastr.warning("Mật khẩu không trùng khớp", 'Cảnh báo');
          } else {
            if (error.error.error === 'The email field must be lowercase.') {
              this.toastr.error("Email phải viết thường", 'Lỗi');
            } else {
              this.toastr.error("Email đã tồn tại", 'Lỗi');
            }
          }
          console.log("Đăng ký thất bại", error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
