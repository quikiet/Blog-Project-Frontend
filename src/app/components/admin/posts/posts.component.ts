import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Post, PostService } from '../../../services/posts/post.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import 'froala-editor/js/plugins.pkgd.min.js';
import { LoginService } from '../../../services/Auth/login.service';
import { RouterOutlet } from '@angular/router';

// Import plugins one by one

// import 'froala-editor/js/plugins/align.min.js';

// import 'froala-editor/js/plugins/image.min.js';


@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, CommonModule, FroalaEditorModule, FroalaViewModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

  categories: any[] = [];
  constructor(private postService: PostService, private toastr: ToastrService, private cateServices: CategoryService, private loginService: LoginService) { }
  author: number = 0;
  ngOnInit(): void {
    this.loadCategory();
    this.loginService.getUser().subscribe({
      next: (res) => {
        this.author = res.user.id;
        if (this.author && this.author != 0) {
          this.newPost.user_id = this.author;
        }
      }
    });
  }

  newPost: Post = {
    id: 0,
    title: "",
    content: "",
    summary: "",
    thumbnail: "",
    published_at: undefined,
    category_id: 0,
    user_id: 0
  };
  selectedPost: Post = {
    id: 0,
    title: "",
    content: "",
    summary: "",
    thumbnail: "",
    published_at: undefined,
    category_id: 0,
    user_id: 0
  };

  loadCategory() {
    this.cateServices.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      }, error: (error) => {
        console.error("Lỗi tải danh mục", error);
      }
    })
  }

  resetFields() {
    this.newPost.id = 0;
    this.newPost.title = "";
    this.newPost.content = "";
    this.newPost.summary = "";
    this.newPost.thumbnail = "";
    this.newPost.published_at = undefined;
    this.newPost.category_id = 0;
    this.newPost.user_id = 0;
  }

  createPost() {
    if (!this.newPost.user_id) {
      this.toastr.warning("Không xác định được người dùng", "Cảnh báo");
      return;
    } else if (!this.newPost.title || !this.newPost.content || !this.newPost.category_id) {
      this.toastr.warning("Vui lòng điền đầy đủ thông tin cần thiết", "Cảnh báo");
      return;
    }

    const formattedDate = this.newPost.published_at
      ? new Date(this.newPost.published_at).toISOString().split('T')[0]
      : null;

    const postData = {
      ...this.newPost,
      published_at: formattedDate as unknown as Date
    };
    this.postService.create(postData).subscribe({
      next: (data) => {
        this.toastr.success("Thêm bài báo thành công", "Thành công");
      }, error: (error) => {
        this.toastr.error("Lỗi: " + error, "Thất bại");
      }
    })

  }
}
