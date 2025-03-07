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


@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, CommonModule, FroalaEditorModule, FroalaViewModule],
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



  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return; // Nếu không có file, thoát ngay

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      this.toastr.warning("Chỉ chấp nhận ảnh JPEG, JPG, PNG", "Cảnh báo");
      return;
    }

    this.selectedFile = file;

    // Hiển thị ảnh tạm thời trước khi upload
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.postForm.patchValue({ thumbnail: e.target.result });
    };
    reader.readAsDataURL(file);
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
    imageUploadParam: 'file',
    imageUploadURL: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    imageUploadParams: {
      upload_preset: cloudinaryConfig.uploadPreset, // Bắt buộc (Cloudinary cần để upload)
      folder: "froala_uploads" // Tuỳ chọn: Lưu ảnh vào thư mục "froala_uploads"
    },
    imageUploadMethod: 'POST',
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events: {
      'image.uploaded': function (response: any) {
        console.log("📥 Response từ Cloudinary:", response);

        try {
          let jsonResponse = typeof response === "string" ? JSON.parse(response) : response;
          const imageUrl = jsonResponse?.secure_url; // Lấy link ảnh

          if (imageUrl) {
            console.log("✅ Ảnh đã upload thành công:", imageUrl);

            // Lấy instance của Froala Editor
            const editorInstance = this as any;

            if (editorInstance?.image?.insert) {
              setTimeout(() => {
                const imgNode = editorInstance.image.insert(imageUrl, true, null, editorInstance.image.get(), null);

                if (imgNode) {
                  console.log("🖼️ Ảnh đã chèn thành công:", imageUrl);
                  imgNode.classList.remove("fr-error"); // Xóa class báo lỗi nếu có
                } else {
                  console.error("❌ Không thể chèn ảnh vào Froala!");
                }
              }, 100);
            } else {
              console.error("❌ Không tìm thấy phương thức insert của Froala Editor!");
            }
          } else {
            console.error("❌ Không tìm thấy link ảnh trong phản hồi!", jsonResponse);
          }
        } catch (error) {
          console.error("❌ Lỗi parse JSON response:", error);
        }
      },
      'image.inserted': function ($img: any, response: any) {
        console.log("🖼️ Xác nhận ảnh đã chèn:", $img, response);

        setTimeout(() => {
          if ($img?.length && $img.hasClass("fr-error")) {
            console.warn("⚠️ Ảnh bị đánh dấu lỗi! Đang thử sửa...");
            $img.removeClass("fr-error"); // Xóa class báo lỗi
            $img.removeAttr("draggable"); // Tránh lỗi kéo thả ảnh
          }
        }, 100);
      },


      'image.error': function (error: any, response: any) {
        console.error("❌ Lỗi upload ảnh:", error, response);
      }
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
          console.log("Ảnh upload thành công:", response.secure_url);

          this.postForm.patchValue({ thumbnail: response.secure_url });

          setTimeout(() => {
            console.log("Dữ liệu form sau khi cập nhật thumbnail:", this.postForm.value);
            console.log("⚠️ Kiểm tra content trước khi gửi:", this.postForm.get('content')?.value);
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

    postData.published_at = postData.published_at ? new Date(postData.published_at).toISOString().split('T')[0] : undefined;

    this.postService.create(postData).subscribe({
      next: (data) => {
        this.toastr.success("Thêm bài báo thành công", "Thành công");
        this.postForm.reset();
        this.router.navigate(['admin/list-post']);
      }, error: (error) => {
        this.toastr.error("Lỗi: " + error, "Thất bại");
      }
    })

  }


}
