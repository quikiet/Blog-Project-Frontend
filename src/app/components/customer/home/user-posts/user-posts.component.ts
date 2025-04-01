import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/Auth/login.service';
import { PostService } from '../../../../services/posts/post.service';
import { UserService } from '../../../../services/users/user.service';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [Tag, PaginatorModule, CommonModule, RouterLink],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css'
})
export class UserPostsComponent implements OnInit {

  users: any = {};
  user_posts: any[] = [];
  userId: number | null = null;
  isLoading = true;
  currentPage: number = 1;
  perPage: number = 10;
  tags: any[] = [];
  totalPosts: number = 0;
  constructor(
    private loginService: LoginService,
    private postService: PostService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getUserPosts();
    this.tags = [
      { label: 'Nháp', value: 'draft' },
      { label: 'Đang chờ', value: 'pending' },
      { label: 'Công khai', value: 'published' },
      { label: 'Lên lịch', value: 'scheduled' },
      { label: 'Lưu trữ', value: 'archived' },
      { label: 'Bị xoá', value: 'rejected' },
      { label: 'Đã xoá', value: 'deleted' }
    ];
  }

  getUser() {
    this.users = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = this.users.id;
  }

  getUserPosts(page: number = this.currentPage) {
    if (!this.userId) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.userService.getPostByUserId(this.userId, page, this.perPage).subscribe({
      next: (res: any) => {
        this.user_posts = res.data || [];
        this.currentPage = res.current_page;
        this.totalPosts = res.total;
        this.perPage = res.per_page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user posts:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG paginator bắt đầu từ 0
    this.perPage = event.rows;
    this.getUserPosts(this.currentPage);
  }

  getStatusLabel(status: string) {
    const statuses: Record<string, { label: string; severity: "warn" | "success" | "info" | "danger" | "contrast" | "secondary" }> = {
      draft: { label: 'Nháp', severity: "contrast" },
      pending: { label: 'Đang chờ duyệt', severity: "warn" },
      published: { label: 'Đã đăng', severity: "success" },
      scheduled: { label: 'Đã lên lịch', severity: "info" },
      archived: { label: 'Lưu trữ', severity: "info" },
      rejected: { label: 'Từ chối', severity: "danger" },
      deleted: { label: 'Đã xoá', severity: "danger" }
    };

    return statuses[status] ?? { label: 'Không xác định', severity: "secondary" };
  }
}
