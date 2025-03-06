import { Component, OnInit } from '@angular/core';
import { Post, PostService } from '../../../../services/posts/post.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {

  constructor(private postService: PostService) { }
  posts: any[] = [];
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (res) => {
        this.posts = res;
        console.log("Lấy dữ liệu bài báo thành công");
        return;
      },
      error: (error) => {
        console.log("Đã có lỗi xảy ra khi lấy bài báo");
        //có thể cho thêm thuộc tính isloading
      }

    })
  }
}
