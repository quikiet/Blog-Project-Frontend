import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Post, PostService } from '../../../services/posts/post.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryService } from '../../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import 'froala-editor/js/plugins.pkgd.min.js';
import { LoginService } from '../../../services/Auth/login.service';
import { Route, Router, RouterOutlet } from '@angular/router';
import { UploadService } from '../../../services/upload.service';
import { cloudinaryConfig } from '../../../app.config';

// Import plugins one by one

import 'froala-editor/js/plugins/align.min.js';

import 'froala-editor/js/plugins/image.min.js';

import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatProgressBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, CommonModule, FroalaEditorModule, FroalaViewModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

  categories: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private postService: PostService,
    private toastr: ToastrService,
    private cateServices: CategoryService,
    private loginService: LoginService
  ) {
    this.postForm = fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      summary: ['', Validators.required],
      thumbnail: [''],
      published_at: [''],
      category_id: [0, Validators.required],
      user_id: [0]
    })
  }
  author: number = 0;
  selectedFile: File | null = null;
  postForm: FormGroup;
  isLoading = false;


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return; // Nếu không có file, thoát ngay

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      this.toastr.warning("Chỉ chấp nhận ảnh JPEG, JPG, PNG", "Cảnh báo");
      return;
    }

    this.selectedFile = file;

    // Hiển thị ảnh tạm thời trước khi upload
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   this.postForm.patchValue({ thumbnail: e.target.result });
    // };
    // reader.readAsDataURL(file);
  }


  ngOnInit(): void {
    this.loadCategory();
    this.loginService.getUser().subscribe({
      next: (res) => {
        console.log("Dữ liệu người dùng:", res);
        if (res?.user?.id) {
          this.author = res.user.id;
          this.postForm.controls['user_id'].setValue(this.author); // Cập nhật user_id an toàn
          console.log("User ID sau khi cập nhật form:", this.postForm.value.user_id);
        } else {
          console.error("Không tìm thấy user ID trong response");
        }
      },
      error: (err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    });
  }




  loadCategory() {
    this.cateServices.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      }, error: (error) => {
        console.error("Lỗi tải danh mục", error);
      }
    })
  }

  options: Object = {
    imageUploadURL: 'http://127.0.0.1:8000/api/upload-image',
    imageUploadParams: { file: 'file' }, // Đặt đúng tên tham số
    imageUploadMethod: 'POST',
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events: {
      'image.uploaded': function (response: any) {
        let jsonResponse = JSON.parse(response);
        if (jsonResponse.link) {
          console.log("✅ Ảnh đã upload:", jsonResponse.link);
          const editorInstance = this as any;
          editorInstance.image.insert(jsonResponse.link, true, null, editorInstance.image.get(), null);
        } else {
          console.error("❌ Không tìm thấy link ảnh!", jsonResponse);
        }
      },
    }
  };


  createPost() {
    console.log("Dữ liệu form trước khi submit:", this.postForm.value);
    if (this.postForm.invalid) {
      this.toastr.warning("Vui lòng điền đầy đủ thông tin", "Cảnh báo");
      return;
    }

    if (this.selectedFile) {
      this.uploadService.uploadImage(this.selectedFile).subscribe({
        next: (response: any) => {

          this.postForm.patchValue({ thumbnail: response.secure_url });

          setTimeout(() => {
            this.submitCreate(this.postForm.value);
          }, 100);
        },
        error: (error) => {
          this.toastr.error("Lỗi upload ảnh: " + error, "Thất bại");
        }
      });
    } else {
      console.log("⚠️ Kiểm tra content trước khi gửi:", this.postForm.get('content')?.value);
      this.submitCreate(this.postForm.value);
    }

  }





  submitCreate(postData: any) {
    this.isLoading = true;
    postData.published_at = postData.published_at ? new Date(postData.published_at).toISOString().split('T')[0] : undefined;

    this.postService.create(postData).subscribe({
      next: (data) => {
        this.toastr.success("Thêm bài báo thành công", "Thành công");
        this.postForm.reset();
        this.router.navigate(['admin/list-post']);
      }, error: (error) => {
        this.toastr.error("Lỗi: " + error, "Thất bại");
      },
      complete: () => {
        this.isLoading = false;
      }
    })
    this.isLoading = false;
  }


}
