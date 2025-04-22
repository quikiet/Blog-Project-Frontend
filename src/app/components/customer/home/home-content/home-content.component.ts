import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { LoginService } from '../../../../services/Auth/login.service';
import { CategoryService } from '../../../../services/category/category.service';
import { PostService } from '../../../../services/posts/post.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { forkJoin } from 'rxjs';
import { Skeleton } from 'primeng/skeleton';
@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [Skeleton, ButtonComponent, FormsModule, InputGroupAddonModule, InputTextModule, ButtonModule, CommonModule, RouterLink, ButtonComponent],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent implements OnInit, OnDestroy {
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
  archivedPosts: any[] = [];
  isMobileMenuOpen = false;
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router,
    private categoryService: CategoryService,
    private postService: PostService
  ) {

  }

  ngOnInit(): void {
    this.loadUser();
    this.userRole = this.loginService.getRole();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.loadCategory();

    forkJoin({
      // posts: this.postService.getAllPosts(),
      featurePost: this.postService.getFeaturePost(),
      subFeaturePosts: this.postService.getSubFeatures(),
      latestPosts: this.postService.getLatestPosts(),
      trendingPosts: this.postService.getTrendingPosts(),
      archivedPosts: this.postService.getArchivedPosts()
    }).subscribe({
      next: (res) => {
        // this.posts = res.posts.map(post => ({
        //   ...post,
        //   published_at: post.published_at ? new Date(post.published_at) : null
        // }));
        this.featurePost = res.featurePost;
        this.subFeaturePosts = res.subFeaturePosts;
        this.latestPosts = res.latestPosts;
        this.trendingPosts = res.trendingPosts;
        this.archivedPosts = res.archivedPosts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Lỗi tải dữ liệu", error);
        this.isLoading = false;
      }
    });
  }

  loadUser() {
    this.loginService.getUser().subscribe({
      next: (res) => {
        this.username = res.user.name;
        console.log(res.user);

        this.userAvatar = res.user.avatar;
      },
      error: (error) => {
        console.log(error);
        return;
      }
    });
    this.userRole = this.loginService.getRole();

  }

  // loadPost() {
  //   this.postService.getAllPosts().subscribe((data) => {
  //     this.posts = data.map(post => ({
  //       ...post,
  //       published_at: post.published_at ? new Date(post.published_at) : null
  //     }));
  //     this.authors = Array.from(
  //       new Map(
  //         data
  //           .filter(post => post.posts_user) // Chỉ lấy những bài có user hợp lệ
  //           .map(post => [post.posts_user?.id, { label: post.posts_user?.name, value: post.posts_user?.id }])
  //       ).values()
  //     );
  //     this.isLoading = false;
  //   });

  // }

  // loadFeaturePost() {
  //   this.postService.getFeaturePost().subscribe({
  //     next: (data) => {
  //       this.featurePost = data;
  //     },
  //     error: (error) => {
  //       console.error('Error loading featured post:', error);
  //     }
  //   });
  // }

  // loadSubFeatrurePost() {
  //   this.postService.getSubFeatures().subscribe({
  //     next: (data) => {
  //       this.subFeaturePosts = data;
  //     },
  //     error: (error) => {
  //       console.error('Error loading sub-features post:', error);
  //     }
  //   });
  // }

  // loadLatestPosts() {
  //   this.postService.getLatestPosts().subscribe({
  //     next: (data) => {
  //       this.latestPosts = data;
  //     },
  //     error: (error) => {
  //       console.error('Error loading sub-features post:', error);
  //     }
  //   });
  // }

  // loadTrendingPosts() {
  //   this.postService.getTrendingPosts().subscribe({
  //     next: (data) => {
  //       this.trendingPosts = data;
  //     },
  //     error: (error) => {
  //       console.error('Error loading sub-features post:', error);
  //     }
  //   });
  // }

  // loadArchivedPosts() {
  //   this.postService.getArchivedPosts().subscribe({
  //     next: (data) => {
  //       this.trendingPosts = data;
  //     },
  //     error: (error) => {
  //       console.error('Error loading sub-features post:', error);
  //     }
  //   });
  // }

  loadCategory() {
    const cachedData = localStorage.getItem('categories');
    const cachedTime = localStorage.getItem('categories_cache_time');
    const cacheExpiration = 60 * 60 * 1000; // 1 giờ

    if (cachedData && cachedTime && (Date.now() - Number(cachedTime)) < cacheExpiration) {
      this.categories = JSON.parse(cachedData);
    } else {
      this.categoryService.getAll().subscribe({
        next: (data) => {
          this.categories = data;
          localStorage.setItem('categories', JSON.stringify(data)); // Lưu vào cache
          localStorage.setItem('categories_cache_time', Date.now().toString()); // Lưu thời gian cache
        },
        error: (error) => {
          console.error("Lỗi tải danh mục", error);
        }
      });
    }
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        console.log(this.categories);

        localStorage.setItem('categories', JSON.stringify(data)); // Lưu vào cache
        localStorage.setItem('categories_cache_time', Date.now().toString()); // Lưu thời gian cache
      },
      error: (error) => {
        console.error("Lỗi tải danh mục", error);
      }
    });
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


  ngOnDestroy(): void {
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = '';
    }
  }

  // --- Mobile Menu Logic (Giữ nguyên) ---
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
