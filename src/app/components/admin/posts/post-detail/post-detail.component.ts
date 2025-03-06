import { Component } from '@angular/core';
import { Post, PostService } from '../../../../services/posts/post.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  constructor(private route: ActivatedRoute, private postService: PostService, private sanitizer: DomSanitizer) { }
  post: Post | null = null;
  sanitizedContent!: SafeHtml;
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    if (id && !isNaN(+id)) {  // Kiểm tra ID có hợp lệ không
      this.postService.show(+id).subscribe({
        next: (data) => {
          this.post = data,
            this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
        },
        error: (err) => console.error("Lỗi tải chi tiết bài viết", err)
      });
    } else {
      console.error("ID bài viết không hợp lệ!");
    }
    console.log(this.post);

  }
}
