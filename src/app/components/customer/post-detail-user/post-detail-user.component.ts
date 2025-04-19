import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { PostService } from '../../../services/posts/post.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CategoryService } from '../../../services/category/category.service';
import { throwError } from 'rxjs';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FooterComponent } from "../footer/footer.component";
import { ProgressSpinner } from 'primeng/progressspinner';
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { RelativeTimePipe } from '../../../pipe/relative-time.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-detail-user',
  standalone: true,
  imports: [RelativeTimePipe, ProgressSpinner, FroalaEditorModule, FroalaViewModule, AvatarModule, CommonModule, FooterComponent, RouterLink, LoadingComponent],
  templateUrl: './post-detail-user.component.html',
  styleUrl: './post-detail-user.component.css'
})
export class PostDetailUserComponent implements OnInit {

  post: any = {
    title: '',
    content: '',
    summary: '',
    thumbnail: '',
    published_at: '',
    category_id: 0,
    user_id: 0
  };
  postView: number = 0;
  categories: any[] = [];
  sanitizedContent: SafeHtml = '';
  isLoading = true;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategory();
  }

  loadPosts() {
    this.isLoading = true;
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log(slug);
    if (slug) {
      this.postService.show(slug).subscribe({
        next: (data) => {
          this.post = data
          console.log(this.post);
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
          if (this.post) {
            this.postService.recordView(this.post.id).subscribe(
              () => {
                this.postService.getPostView(this.post.id).subscribe(
                  (viewRecordResponse) => {
                    this.postView = viewRecordResponse.views;
                  }
                );
              });
          }
        },
        error: (err) => {
          console.error("Lỗi tải chi tiết bài viết", err);
          this.router.navigate(['/404']);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      console.error("Không có bài viết này");
      this.router.navigate(['/404']);
    }
  }

  loadCategory() {
    this.categoryService.getAll().subscribe({
      next: (respone: any) => {
        this.categories = respone;
        console.log("Get category data successful");
      }, error: (error) => {
        throwError("Error to get category", error);
      }
    });
  }

  getCategoryName(categoryId: any): string {
    const category = this.categories.find(cat => cat.id == categoryId);
    return category ? category.name : 'Chưa có';
  }

  getCurrentPageUrl(): string {
    if (typeof window !== 'undefined' && window.location) { return window.location.href; }
    return '';
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(this.getCurrentPageUrl());
    if (url) { window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400,noopener,noreferrer'); }
    else { this.toastr.error('Không thể lấy URL để chia sẻ.'); }
  }

  copyLink(): void {

    const url = this.getCurrentPageUrl();
    if (!url) { this.toastr.error('Không thể lấy URL để sao chép.'); return; }
    if (!navigator.clipboard) { this.toastr.error('Trình duyệt không hỗ trợ sao chép tự động.'); return; }

    navigator.clipboard.writeText(url)
      .then(() => { this.toastr.success('Đã sao chép liên kết!'); })
      .catch(err => { this.toastr.error('Không thể sao chép liên kết.'); });
  }
}
