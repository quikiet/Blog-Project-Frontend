import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/Auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsersComponent } from "../../admin/users/users.component";
import { PostListComponent } from "../../admin/posts/post-list/post-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UsersComponent, PostListComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  token = localStorage.getItem('token');
  currentUser: string | null = null;
  username: string = '';

  constructor(private loginService: LoginService, private toastr: ToastrService, private router: Router) { }
  ngOnInit(): void {
    this.loginService.getUser().subscribe({
      next: (res) => {
        this.username = res.user.name;
      },
      error: (error) => {
        console.log(error);
        return;
      }
    });
    this.currentUser = this.loginService.getRole();
  }

  logout() {
    this.loginService.logout().subscribe({
      next: (res) => {
        this.toastr.success('Đăng xuất thành công', 'Thành công');
        this.router.navigate(['/login']);
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        localStorage.removeItem('user');
        this.currentUser = null;
        this.username = '';
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message || 'Có lỗi xảy ra khi đăng xuất', 'Lỗi');
      }
    });
  }

}
