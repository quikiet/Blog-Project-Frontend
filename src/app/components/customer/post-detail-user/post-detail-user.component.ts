import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { PostService } from '../../../services/posts/post.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CategoryService } from '../../../services/category/category.service';
import { throwError } from 'rxjs';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-post-detail-user',
  standalone: true,
  imports: [FroalaEditorModule, FroalaViewModule, AvatarModule, CommonModule, FooterComponent, RouterLink],
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
  categories: any[] = [];
  sanitizedContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,

  ) { }

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategory();
  }

  loadPosts() {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log(slug);
    if (slug) {
      this.postService.show(slug).subscribe({
        next: (data) => {
          this.post = data
          console.log(this.post);
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
        },
        error: (err) => console.error("Lỗi tải chi tiết bài viết", err)
      });
    } else {
      console.error("Không có bài viết này");
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

}
