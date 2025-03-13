import { Component, OnInit } from '@angular/core';
import { Post, PostService } from '../../../../services/posts/post.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../../services/upload.service';
import { throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon'
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CategoryService } from '../../../../services/category/category.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [MatProgressBarModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, CommonModule, RouterLink, MatIconModule, FroalaEditorModule, FroalaViewModule, ButtonComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute, private postService: PostService, private sanitizer: DomSanitizer, private toastr: ToastrService, private uploadServices: UploadService) { }
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
  isLoading = false;
  isEditting = false;
  isDeleted = false;
  sanitizedContent: SafeHtml = '';
  selectedFile: File | null = null;
  ngOnInit(): void {
    this.loadPosts();
    this.loadCategory();
    this.isLoading = false;
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return; // Nếu không có file, thoát ngay

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      this.toastr.warning("Chỉ chấp nhận ảnh JPEG, JPG, PNG", "Cảnh báo");
      return;
    }
    this.selectedFile = file;

    // const reader = new FileReader();
    // reader.onload = (event: any) => {
    //   this.post.thumbnail = event.target.result;
    // }
    // reader.readAsDataURL(file);

  }

  loadPosts() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {  // Kiểm tra ID có hợp lệ không
      this.postService.show(+id).subscribe({
        next: (data) => {
          this.post = data
          console.log(this.post);
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
        },
        error: (err) => console.error("Lỗi tải chi tiết bài viết", err)
      });
    } else {
      console.error("ID bài viết không hợp lệ!");
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

  deletePost() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    if (id && !isNaN(+id)) {
      if (this.isDeleted) {
        this.postService.delete(+id).subscribe({
          next: () => {
            if (this.post.thumbnail) {
              this.deleteThumbmail();
            }
            this.toastr.success("Xoá thành công", "Thành công");
            this.router.navigate(['/admin/list-post']);
          },
          error: (err) => {
            this.toastr.error("Đã xảy ra lỗi khi xoá", "Thất bại");
            throwError("Lỗi: ", err);
            this.router.navigate(['/admin/list-post']);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    } else {
      this.toastr.error("Không tìm thấy bài báo này nữa", "Không tìm thấy");
      this.router.navigate(['/admin/list-post']);
    }
  }

  updatePost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      if (this.selectedFile) {
        if (this.post.thumbnail) {
          const oldImageUrl = this.post.thumbnail;
          const publicId = this.getCloudinaryPublicId(oldImageUrl);
          this.deleteThumbnailInCloudinary(publicId);
          this.updateThumbnailInCloudinary(this.selectedFile, +id);
        } else {
          this.updateThumbnailInCloudinary(this.selectedFile, +id);
        }
      } else {
        this.savePost(+id);
      }
    } else {
      this.toastr.error("Không tìm thấy bài báo này nữa", "Không tìm thấy");
      this.router.navigate(['/admin/list-post']);
    }
  }

  deleteThumbmail() {
    this.isLoading = true;
    const publicId = this.getCloudinaryPublicId(this.post.thumbnail);
    console.log("Public ID:", publicId); // In ra để kiểm tra
    if (publicId) {
      this.uploadServices.deleteImage(publicId).subscribe({
        next: () => {
          this.post.thumbnail = '';
          this.savePost(this.post.id);
          this.toastr.success('Xoá ảnh thumbnail thành công', "Thành công");
        },
        error: (err) => {
          console.error("Lỗi xóa ảnh:", err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.warning("Bài viết không có thumbnail", "Cảnh báo");
    }

  }


  getCloudinaryPublicId(url: string) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('.')[0]; // Lấy tên file không có đuôi .jpg
  }

  deleteThumbnailInCloudinary(publicId: string) {
    console.log("🗑️ Xóa ảnh có publicId:", publicId);
    this.uploadServices.deleteImage(publicId).subscribe({
      next: () => {
        console.log("🗑️ Ảnh cũ đã được xóa!");
      },
      error: (error) => {
        console.error("❌ Không thể xóa ảnh cũ", error);
      }
    });
  }

  updateThumbnailInCloudinary(selectedFile: File, id: number) {
    this.isLoading = true;
    this.uploadServices.uploadImage(selectedFile).subscribe({
      next: (response: any) => {
        this.post.thumbnail = response.secure_url;
        this.savePost(id);
      },
      error: (error) => {
        this.toastr.error("Lỗi thêm ảnh mới", "Thất bại");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  savePost(id: number) {
    this.isLoading = true;
    this.postService.update((+id), this.post).subscribe({
      next: () => {
        this.toastr.success("Cập nhật bài báo thành công", "Thành công");
        this.isEditting = false;
      },
      error: (err) => {
        this.toastr.error("Đã có lỗi xảy ra trong quá trình cập nhật", "Lỗi");
        throwError("Lỗi: ", err);
      },
      complete: () => {
        this.isLoading = false;
        this.loadPosts();
      }
    });
  }

  editPost() {
    this.isEditting = !this.isEditting;
  }

  deleteModal() {
    this.isDeleted = true;
  }

}
