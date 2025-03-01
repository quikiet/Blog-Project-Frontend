import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, private toastr: ToastrService) { }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
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

}
