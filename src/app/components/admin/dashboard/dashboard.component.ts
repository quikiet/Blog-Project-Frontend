import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../services/Auth/login.service';
import { MatIconModule } from '@angular/material/icon'
import { PostService } from '../../../services/posts/post.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { BadgeModule } from 'primeng/badge';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BadgeModule, OverlayBadgeModule, RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnInit {
  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
    private postService: PostService,
  ) { }
  token = localStorage.getItem('token');
  username: string = '';
  userAvatar: string = '';
  pendingPost: number = 0;
  disableDot: boolean = false;
  ngOnInit(): void {
    this.loginService.getUser().subscribe({
      next: (res) => {
        this.username = res.user.name;
        this.userAvatar = res.user.avatar;
      },
      error: (error) => {
        console.log(error);
        return;
      }
    });
    this.countPendingPost();
  }

  countPendingPost() {
    this.postService.countPendingPost().subscribe(data => {
      this.pendingPost = data;
      if (this.pendingPost === 0) {
        this.disableDot = true;
      }
    })
  }

  ngAfterViewInit(): void {
    const mobileMenuButton = this.renderer.selectRootElement('.mobile-menu-button', true);
    const sidebar = this.renderer.selectRootElement('.sidebar', true);
    const overlay = this.renderer.selectRootElement('.overlay', true);

    this.renderer.listen(overlay, 'click', () => {
      this.toggleMobileMenu(sidebar, overlay);
    });

    this.renderer.listen(mobileMenuButton, 'click', () => {
      this.toggleMobileMenu(sidebar, overlay);
    });

    // Xử lý sự kiện resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && sidebar.classList.contains('translate-x-0')) {
        this.toggleMobileMenu(sidebar, overlay);
      }
    });
  }

  toggleMobileMenu(sidebar: HTMLElement, overlay: HTMLElement): void {
    sidebar.classList.toggle('translate-x-0');
    overlay.classList.toggle('hidden');
    setTimeout(() => overlay.classList.toggle('opacity-0'), 0);
    document.body.style.overflow = sidebar.classList.contains('translate-x-0') ? 'hidden' : '';
  }

  logout() {
    this.loginService.logout().subscribe({
      next: (res) => {
        this.toastr.success('Đăng xuất thành công', 'Thành công');
        this.router.navigate(['/login']);
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        localStorage.removeItem('user');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message || 'Có lỗi xảy ra khi đăng xuất', 'Lỗi');
      }
    });
  }
}
