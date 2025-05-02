import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap, Observable, of } from 'rxjs'; // Import thêm Observable, of
import { ToastrService } from 'ngx-toastr';

// --- SỬA ĐƯỜNG DẪN IMPORT ---
import { CategoryService, Category } from '../../../services/category/category.service'; // Chỉ cần ../../../
import { Post } from '../../../services/posts/post.service';              // Chỉ cần ../../../
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { RelativeTimePipe } from '../../../pipe/relative-time.pipe';
interface CategoryWithPosts extends Category {
  // !!! QUAN TRỌNG: Đảm bảo tên thuộc tính này khớp với tên quan hệ trong Model Category.php
  categories_posts: Post[]; // Hoặc 'posts: Post[];' nếu tên quan hệ là 'posts'
}
@Component({
  selector: 'app-category-posts',
  standalone: true,
  imports: [CommonModule,
    RouterLink,
    LoadingComponent, RelativeTimePipe],
  templateUrl: './category-posts.component.html',
  styleUrl: './category-posts.component.css'
})
export class CategoryPostsComponent implements OnInit, OnDestroy {
  categoryInfo: Category | null = null;
  posts: Post[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('--- CategoryPostsComponent ngOnInit CALLED ---');
    this.routeSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        console.log('--- Slug from route params ---:', slug);
        this.isLoading = true;
        this.errorMessage = null;
        this.posts = [];
        this.categoryInfo = null;

        if (slug) {
          return this.categoryService.getPostsByCategory(slug);
        } else {
          this.errorMessage = "Không có bài viết";
          this.isLoading = false;
          return of(null); // Sử dụng 'of' từ RxJS để tạo Observable từ giá trị null
        }
      })
    ).subscribe({
      next: (data: CategoryWithPosts | null) => { // Thêm kiểu dữ liệu cho data ở đây
        if (data && data.id) { // Kiểm tra data không phải null và có id
          this.categoryInfo = { id: data.id, name: data.name, slug: data.slug };
          // !!! QUAN TRỌNG: Lấy danh sách posts từ đúng thuộc tính quan hệ
          this.posts = data.categories_posts || []; // Giả định tên là categories_posts
          if (this.posts.length === 0) {
            console.log(`Không có bài viết nào trong danh mục "${this.categoryInfo.name}".`);
          }
        } else if (!this.errorMessage) { // Chỉ đặt lỗi nếu chưa có lỗi từ trước (ví dụ: thiếu slug)
          this.errorMessage = `Không tìm thấy thông tin cho danh mục này.`;
          console.error("API response might be invalid or category not found:", data);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading posts for category:", err);
        if (err.status === 404) {
          this.errorMessage = `Danh mục này không tồn tại.`;
        } else {
          this.errorMessage = "Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại.";
        }
        this.toastr.error(this.errorMessage, 'Lỗi');
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'Ngày không xác định';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Ngày không xác định';
    }
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  cutText(text: string | null | undefined, wordLimit: number = 30): string {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }
}
