import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/Auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../../../services/Auth/register.service';
import { LoginByGoogleServiceService } from '../../../services/Auth/login-by-google.service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private loginByGoogleService: LoginByGoogleServiceService, private registerService: RegisterService, private http: HttpClient, private loginService: LoginService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute,) { }
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['google'] === 'true') {
        const token = params['token'];
        const user = params['user']
          ? JSON.parse(decodeURIComponent(params['user']))
          : null;
        const expiresAt = params['expires_at'];

        if (token && user && expiresAt) {
          // Lưu thông tin vào localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token_expiration', expiresAt);

          this.userRole = this.loginService.getRole();

          this.toastr.success('Đăng nhập bằng Google thành công', 'Thành công');

          if (this.userRole !== 'admin') {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/admin']);
          }
        } else {
          this.toastr.error('Đăng nhập bằng Google thất bại', 'Lỗi');
        }
      }
    });
  }

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

  loginWithGoogle(): void {
    console.log(1);

    window.location.href = this.loginByGoogleService.getGoogleRedirectUrl();
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
