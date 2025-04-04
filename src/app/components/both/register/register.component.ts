import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegisterService } from '../../../services/Auth/register.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };
  constructor(private registerService: RegisterService, private router: Router) { }

  register() {
    try {
      this.registerService.register(this.userData).subscribe({
        next: (response) => {
          console.log("Đăng ký thành công!", response);
          alert("Chúc mừng bạn đã đăng ký tài khoản thành công!");
          this.router.navigate(['login']);
        },
        error: (error) => {
          console.log("Đăng ký thất bại", error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


}
