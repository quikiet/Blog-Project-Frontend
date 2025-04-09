import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/Auth/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsersComponent } from "../../admin/users/users.component";
import { PostListComponent } from "../../admin/posts/post-list/post-list.component";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { CategoryService } from '../../../services/category/category.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { PostService } from '../../../services/posts/post.service';
import { FooterComponent } from "../footer/footer.component";
import { LoadingComponent } from "../../../shared/loading/loading.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProgressSpinner, FormsModule, InputGroup, InputGroupAddonModule, InputTextModule, ButtonModule, CommonModule, UsersComponent, PostListComponent, RouterOutlet, RouterLink, RouterLinkActive, ButtonComponent, FooterComponent, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  token = localStorage.getItem('token');
  userRole: string | null = null;
  username: string = '';
  userAvatar: string = '';
  isLoading = true;
  categories: any[] = [];
  authors: any[] = [];

  posts: any[] = [];
  featurePost: any = [];
  subFeaturePosts: any[] = [];
  latestPosts: any[] = [];
  trendingPosts: any[] = [];

  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router,
    private categoryService: CategoryService,
    private postService: PostService,
  ) { }
  ngOnInit(): void {
    this.loadCategory();
    this.loadUser();
    this.loadPost();
    this.loadFeaturePost();
    this.loadSubFeatrurePost();
    this.loadLatestPosts();
    this.loadTrendingPosts();
  }

  loadUser() {
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
    this.userRole = this.loginService.getRole();

  }

  loadPost() {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data.map(post => ({
        ...post,
        published_at: post.published_at ? new Date(post.published_at) : null
      }));
      this.authors = Array.from(
        new Map(
          data
            .filter(post => post.posts_user) // Chỉ lấy những bài có user hợp lệ
            .map(post => [post.posts_user?.id, { label: post.posts_user?.name, value: post.posts_user?.id }])
        ).values()
      );
      this.isLoading = false;
    });

  }

  loadFeaturePost() {
    this.postService.getFeaturePost().subscribe({
      next: (data) => {
        this.featurePost = data;
      },
      error: (error) => {
        console.error('Error loading featured post:', error);
      }
    });
  }

  loadSubFeatrurePost() {
    this.postService.getSubFeatures().subscribe({
      next: (data) => {
        this.subFeaturePosts = data;
      },
      error: (error) => {
        console.error('Error loading sub-features post:', error);
      }
    });
  }

  loadLatestPosts() {
    this.postService.getLatestPosts().subscribe({
      next: (data) => {
        this.latestPosts = data;
      },
      error: (error) => {
        console.error('Error loading sub-features post:', error);
      }
    });
  }

  loadTrendingPosts() {
    this.postService.getTrendingPosts().subscribe({
      next: (data) => {
        this.trendingPosts = data;
      },
      error: (error) => {
        console.error('Error loading sub-features post:', error);
      }
    });
  }

  loadCategory() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      }, error: (error) => {
        console.error("Lỗi tải danh mục", error);
      }
    })
  }

  logout() {
    this.loginService.logout().subscribe({
      next: (res) => {
        this.toastr.success('Đăng xuất thành công', 'Thành công');
        this.router.navigate(['/login']);
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        localStorage.removeItem('user');
        this.userRole = null;
        this.username = '';
        this.userAvatar = '';
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message || 'Có lỗi xảy ra khi đăng xuất', 'Lỗi');
      }
    });
  }

  navigateToPost(slug: string) {
    this.router.navigate(['/post', slug]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}
