import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../../../shared/components/button/button.component";

import { DatePicker } from 'primeng/datepicker';
import { Fluid } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { StepperModule } from 'primeng/stepper';
import { AvatarModule } from 'primeng/avatar';
import { SelectModule } from 'primeng/select';
import { AuthorsService } from '../../../services/authors/authors.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ProgressSpinner, SelectModule, FroalaViewModule, AvatarModule, StepperModule, PanelModule, Dialog, ButtonModule, DatePicker, Fluid, MatProgressBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, CommonModule, FroalaEditorModule, FroalaViewModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

  categories: any[] = [];
  errorMessage = signal('');
  authorId: number = 0;
  userName: string = '';
  authorName: string = '';
  authorAvatar: string = '';
  selectedFile: File | null = null;
  postForm: FormGroup;
  isLoading = false;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  visiblePreview: boolean = false;
  authors: any[] | undefined;
  statuses: any[] = [];
  currentStatus: string = '';
  role: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private postService: PostService,
    private toastr: ToastrService,
    private cateServices: CategoryService,
    private loginService: LoginService,
    private authorService: AuthorsService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
      content: ['', Validators.required],
      summary: ['', Validators.required],
      thumbnail: [''],
      published_at: [new Date(), Validators.required],
      category_id: [0, Validators.required],
      status: [''],
      user_id: [0],
      author_id: [null],
    });

    merge(this.postForm.get('title')!.statusChanges, this.postForm.get('title')!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

  }

  ngOnInit(): void {
    this.loadCategory();
    this.loginService.getUser().subscribe({
      next: (res) => {
        console.log("Dữ liệu người dùng:", res);
        if (res?.user?.id) {
          this.authorId = res.user.id;
          this.userName = res.user.name;
          this.authorAvatar = res.user.avatar;
          this.role = res.user.role;
          this.postForm.controls['user_id'].setValue(this.authorId);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          console.error("Không tìm thấy user ID trong response");
        }
      },
      error: (err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        this.isLoading = false;
      }
    });
    this.loadAuthors();

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

    this.statuses = [
      // { label: 'Nháp', value: 'draft' },
      { label: 'Đang chờ', value: 'pending' },
      { label: 'Công khai', value: 'published' },
      { label: 'Lên lịch', value: 'scheduled' },
      { label: 'Lưu trữ', value: 'archived' },
      // { label: 'Từ chối', value: 'rejected' },
      // { label: 'Đã xoá', value: 'deleted' }
    ];
  }

  loadAuthors() {
    this.isLoading = false;
    this.authorService.getAllAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        this.isLoading = false;
      }, error: (error) => {
        console.log("Lỗi tải tác giả: " + error);
        this.isLoading = false;
      }, complete: () => {
        this.isLoading = false;
      }
    })
  }

  updateStatus(value: any) {
    this.postForm.patchValue({ status: value.value });
    this.currentStatus = value.value;
    console.log(this.currentStatus);

  }

  updateErrorMessage() {
    const titleControl = this.postForm.get('title');
    if (titleControl!.hasError('required')) {
      this.errorMessage.set('Tiêu đề không được để trống');
    } else if (titleControl!.hasError('minlength')) {
      this.errorMessage.set('Tiêu đề không được ngắn hơn 5 ký tự');
    } else if (titleControl!.hasError('maxlength')) {
      this.errorMessage.set('Tiêu đề của bạn quá dài');
    } else {
      this.errorMessage.set('');
    }
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return; // Nếu không có file, thoát ngay

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      this.toastr.warning("Chỉ chấp nhận ảnh JPEG, JPG, PNG, Webp", "Cảnh báo");
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


  loadCategory() {
    this.isLoading = true;
    this.cateServices.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      }, error: (error) => {
        this.isLoading = false;
        console.error("Lỗi tải danh mục", error);
      }, complete: () => {
        this.isLoading = false;
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
    // this.isLoading = true;
    if (this.postForm.invalid) {
      this.toastr.warning("Vui lòng điền đầy đủ thông tin", "Cảnh báo");
      this.isLoading = false;
      return;
    }
    const role = this.loginService.getRole();
    // console.log(role);
    let isDraft = false;
    if (role !== 'admin' && role !== 'author') {
      this.toastr.warning("Bạn không có quyền tạo bài viết", "Truy cập bị từ chối");
      this.isLoading = false;
      return;
    }
    console.log(this.postForm);
    if (this.selectedFile) {
      this.uploadService.uploadImage(this.selectedFile).subscribe({
        next: (response: any) => {
          this.postForm.patchValue({ thumbnail: response.secure_url });
          setTimeout(() => {
            this.submitCreate(this.postForm.value, role, isDraft);
          }, 100);
        },
        error: (error) => {
          this.toastr.error("Lỗi upload ảnh: " + error, "Thất bại");
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.submitCreate(this.postForm.value, role, isDraft);
    }

  }

  draftPost() {
    if (this.postForm.invalid) {
      this.toastr.warning("Vui lòng điền đầy đủ thông tin", "Cảnh báo");
      return;
    }

    const role = this.loginService.getRole();
    // console.log(role);
    let isDraft = true;

    if (role !== 'admin' && role !== 'author') {
      this.toastr.warning("Bạn không có quyền tạo bài viết", "Truy cập bị từ chối");
      return;
    }
    console.log(this.postForm);
    if (this.selectedFile) {
      this.uploadService.uploadImage(this.selectedFile).subscribe({
        next: (response: any) => {

          this.postForm.patchValue({ thumbnail: response.secure_url });

          setTimeout(() => {
            this.submitCreate(this.postForm.value, role, isDraft);
          }, 100);
        },
        error: (error) => {
          this.toastr.error("Lỗi upload ảnh: " + error, "Thất bại");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.submitCreate(this.postForm.value, role, isDraft);
    }

  }

  submitCreate(postData: any, role: string, isDraft: boolean) {
    // this.isLoading = true;
    postData.published_at = postData.published_at
      ? new Date(postData.published_at.getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
      : undefined;

    if (isDraft) {
      postData.status = 'draft';
    } else {
      if (postData.status !== 'deleted') {
        postData.status = role !== 'admin' ? 'pending' : postData.status;
      } else {
        postData.status = 'deleted';
      }
    }

    this.postService.create(postData).subscribe({
      next: (data) => {
        if (isDraft) {
          this.toastr.info("Tạo nháp bài báo thành công", "Thành công");
        } else {
          this.toastr.success("Thêm bài báo thành công", "Thành công");
        }
        this.postForm.reset();
        if (role === 'admin') {
          this.isLoading = false;
          this.router.navigate(['admin/list-post/all']);
        } else {
          this.isLoading = false;
          this.router.navigate(['user-posts']);
        }
      }, error: (error) => {
        this.toastr.error(error, "Thất bại");
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
    this.isLoading = false;
    // console.log(postData);
  }


  showDialogPreview() {
    this.visiblePreview = true;
  }

  getCategoryName(categoryId: any): string {
    const category = this.categories.find(cat => cat.id == categoryId);
    return category ? category.name : 'Chưa chọn';
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }

}
