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
@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

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

  categories: any[] = [];
  constructor(private postService: PostService, private toastr: ToastrService, private cateServices: CategoryService) { }

  ngOnInit(): void {
    this.cateServices.getAll().subscribe((data) => {
      this.categories = data;
    });
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

    this.postService.create(this.newPost).subscribe({
      next: (data) => {
        this.resetFields();
        this.toastr.success("Thêm bài báo thành công", "Thành công");
      }, error: (error) => {
        this.toastr.error("Lỗi: " + error, "Thất bại");
      }
    })

  }
}
