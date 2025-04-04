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
import { Select } from 'primeng/select';
import { ModalSubmitDeleteComponent } from "../../../../shared/components/modal-submit-delete/modal-submit-delete.component";
import { AvatarModule } from 'primeng/avatar';
import { AuthorsService } from '../../../../services/authors/authors.service';
import { SelectModule } from 'primeng/select';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RefuseReasonService } from '../../../../services/category/refuse-reason.service';
import { RefusesService } from '../../../../services/category/refuses.service';
import { LoginService } from '../../../../services/Auth/login.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [DatePicker, ProgressSpinner, ButtonModule, InputTextModule, SelectModule, AvatarModule, MatProgressBarModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, CommonModule, RouterLink, MatIconModule, FroalaEditorModule, FroalaViewModule, ButtonComponent, ModalSubmitDeleteComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private uploadServices: UploadService,
    private authorService: AuthorsService,
    private refuseReasonService: RefuseReasonService,
    private refuseService: RefusesService,
    private loginService: LoginService,
  ) { }
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
  authors: any[] = [];
  isLoading = false;
  isEditting = false;
  isDeleted = false;
  deletedSlug: string = '';
  statuses: any[] = [];
  selectedStatus: string = '';
  sanitizedContent: SafeHtml = '';
  selectedFile: File | null = null;
  visible: boolean = false;
  userRole: string | null = null;
  refuseReasons: any[] = [];
  selectedReason: number | null = null;
  showRefuseReason: boolean = false;
  refuses = {
    'post_id': null as number | null,
    'reason_id': null as number | null
  };
  selectedRefuseId: number | null = null;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  visiblePreview: boolean = false;

  ngOnInit(): void {
    if (this.post && this.post.status === 'rejected') {
      this.setLatestRefuseReason(this.post);
    }
    this.loadPosts();
    this.loadCategory();
    this.loadAuthors();
    this.loadRefuseReasons();
    this.isLoading = false;
    this.statuses = [
      // { label: 'Nháp', value: 'draft' },
      { label: 'Đang chờ', value: 'pending' },
      { label: 'Công khai', value: 'published' },
      { label: 'Lên lịch', value: 'scheduled' },
      { label: 'Lưu trữ', value: 'archived' },
      { label: 'Từ chối', value: 'rejected' },
      // { label: 'Đã xoá', value: 'deleted' }
    ];
    this.userRole = this.loginService.getRole();
    // datePicker
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setSeconds(0, 0);
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);
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

  loadPosts() {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log(slug);
    if (slug) {
      this.postService.show(slug).subscribe({
        next: (data) => {
          this.post = data;
          if (this.post.published_at) {
            this.post.published_at = new Date(this.post.published_at);
            console.log('Published At (Date):', this.post.published_at);
          } else {
            this.post.published_at = null; // Đảm bảo giá trị là null nếu không có
            console.log('Published At is null');
          }
          console.log(this.post);
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
          const foundedStatus = this.statuses.find(s => s.value === this.post.status || null);
          console.log(foundedStatus.value);
          this.selectedStatus = foundedStatus ? foundedStatus : '';
          console.log(this.selectedStatus);
        },
        error: (err) => console.error("Lỗi tải chi tiết bài viết", err)
      });
    } else {
      console.error("Không có bài viết này");
    }
  }

  loadAuthors() {
    this.authorService.getAllAuthors().subscribe({
      next: (data) => {
        this.authors = data;
      }, error: (error) => {
        console.log("Lỗi tải tác giả: " + error);
      }
    })
  }

  loadRefuseReasons() {
    this.refuseReasonService.getAllReason().subscribe({
      next: (data) => {
        this.refuseReasons = data;
        this.setLatestRefuseReason(this.post);
      }, error: (error) => {
        console.log("Lỗi: " + error.message);
      }
    })
  }


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

  updateStatus(value: any) {
    this.post.status = value.value;
    // console.log(this.post.status);
    if (this.post.status === 'rejected') {
      this.showRefuseReason = true;
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
    const slug = this.deletedSlug;
    this.isLoading = true;
    if (slug) {
      if (this.isDeleted) {
        this.postService.delete(slug).subscribe({
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
    const slug = this.route.snapshot.paramMap.get('slug');
    // console.log(this.selectedReason);

    if (slug) {
      if (this.selectedFile) {
        if (this.post.thumbnail) {
          const oldImageUrl = this.post.thumbnail;
          const publicId = this.getCloudinaryPublicId(oldImageUrl);
          this.deleteThumbnailInCloudinary(publicId);
          this.updateThumbnailInCloudinary(this.selectedFile, slug);
        } else {
          this.updateThumbnailInCloudinary(this.selectedFile, slug);
        }
      } else {
        this.savePost(slug);
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

  updateThumbnailInCloudinary(selectedFile: File, slug: string) {
    this.isLoading = true;
    this.uploadServices.uploadImage(selectedFile).subscribe({
      next: (response: any) => {
        this.post.thumbnail = response.secure_url;
        this.savePost(slug);
      },
      error: (error) => {
        this.toastr.error("Lỗi thêm ảnh mới", "Thất bại");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  savePost(slug: string) {
    if (this.post.published_at instanceof Date) {
      this.post.published_at = this.formatDate(this.post.published_at);
    }
    this.isLoading = true;
    const oldSlug = slug;
    if (this.userRole === 'author') {
      this.selectedRefuseId = null;
      this.selectedReason = null;
      this.post.status = 'pending';
    }
    if (!this.selectedReason && this.post.status === 'rejected') {
      this.toastr.warning("Lưu ý bạn phải chọn lý do từ chối", "Cảnh báo");
      this.isLoading = false;
      return;
    }
    if (this.selectedReason && this.post.status === 'rejected') {
      this.refuses.post_id = this.post.id;
      this.refuses.reason_id = this.selectedReason;
      // console.log(this.refuses.reason_id);
      if (this.selectedRefuseId) {
        this.refuseService.update(this.selectedRefuseId, this.refuses).subscribe({
          next: (respone) => {
            console.log(respone.message);
          }, error: (error) => {
            console.log("Lỗi cập nhật ràng buộc từ chối: " + error.message);
          }
        });
      } else {
        this.refuseService.create(this.refuses).subscribe({
          next: (respone) => {
            console.log(respone.message);
          }, error: (error) => {
            console.log("Lỗi tạo ràng buộc từ chối: " + error.message);
          }
        });
      }
    }

    this.postService.update((oldSlug), this.post).subscribe({
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
        this.setLatestRefuseReason(this.post);
        // this.router.navigate(['admin/list-post']);
      }
    });
    this.isLoading = false;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  getLatestRefuse(post: any) {
    if (!post || !Array.isArray(post.refuses) || post.refuses.length === 0) {
      return null; // Trả về null nếu không có dữ liệu
    }

    return post.refuses.reduce((latest: any, current: any) => {
      if (!latest || new Date(current.created_at).getTime() > new Date(latest.created_at).getTime()) {
        return current;
      }
      return latest;
    }, null);
  }

  setLatestRefuseReason(post: any) {
    const latestRefuse = this.getLatestRefuse(post);
    // console.log("lastest:" + latestRefuse.reason_id);
    // console.log("before reason:" + this.selectedReason);

    if (latestRefuse) {
      this.selectedRefuseId = latestRefuse.id;
      this.selectedReason = latestRefuse.reason_id ?? null;
    } else {
      this.selectedRefuseId = null;
      this.selectedReason = null;
    }
    // console.log("after reason:" + this.selectedReason);

  }


  editPost() {
    this.isEditting = !this.isEditting;
    this.setLatestRefuseReason(this.post);
  }

  deleteModal(slug: string) {
    this.isDeleted = true;
    this.deletedSlug = slug;
  }

}
