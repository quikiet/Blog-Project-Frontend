import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { AuthorsService } from '../../../services/authors/authors.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { UploadService } from '../../../services/upload.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { PostDetailComponent } from "../posts/post-detail/post-detail.component";
import { PostDetailUserComponent } from "../../customer/post-detail-user/post-detail-user.component";
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [AccordionModule, TextareaModule, AvatarModule, DrawerModule, ProgressSpinner, FileUpload, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, Ripple, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, DropdownModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, ButtonComponent, PostDetailComponent, PostDetailUserComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent implements OnInit {
  authorDialog: boolean = false;
  selectedFile: File | null = null;
  authors!: any[];
  originalAuthor: any = {};
  author!: any;
  isEditting = false;
  selectedAuthors: any[] = [];
  searchValue: string | undefined;
  submitted: boolean = false;
  isLoading = true;
  visibleDrawer: boolean = false;

  @ViewChild('tableAuthor') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  constructor(
    private authorServices: AuthorsService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.loadAuthorData();
  }


  searchGlobal(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadAuthorData() {
    this.authorServices.getAllAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        console.log(this.authors);

        this.cd.markForCheck();
      }, error: (error) => {
        console.error("Lỗi tải tác giả", error);
      }, complete: () => {
        this.isLoading = false;
      }
    });
    this.cols = [
      { field: 'id', header: 'Mã' },
      { field: 'name', header: 'Tên' },
      { field: 'avatar', header: 'Hình ảnh' },
      { field: 'email', header: 'Địa chỉ email' },
      { field: 'bio', header: 'Tiểu sử' }
    ];
    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    this.isLoading = false;

  }

  openNew() {
    this.author = {};
    this.submitted = false;
    this.authorDialog = true;
  }

  showAuthor(author: any) {
    this.author = { ...author };
    this.originalAuthor = { ...author };
    this.visibleDrawer = true;
    this.isEditting = false;
    this.selectedFile = null;
    console.log(this.author);

  }

  editAuthor() {
    if (this.isEditting) {
      this.updateAuthor();
    }
    this.isEditting = true;
  }


  updateAuthor() {
    this.isLoading = true;
    if (!this.isEditting) return;
    if (!this.author || !this.author.slug) {
      this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Dữ liệu không hợp lệ' });
      return;
    }

    const hasChanges = this.hasChanges(this.originalAuthor, this.author);
    if (!hasChanges && !this.selectedFile) {
      this.authorDialog = false;
      this.isEditting = false;
      this.isLoading = false;
      return;
    }

    if (this.selectedFile) {
      if (this.author.avatar) {
        const oldImageUrl = this.author.avatar;
        const publicId = this.getCloudinaryPublicId(oldImageUrl);
        this.deleteThumbnailInCloudinary(publicId);
        this.updateThumbnailInCloudinary(this.selectedFile, this.author.slug);
      } else {
        this.updateThumbnailInCloudinary(this.selectedFile, this.author.slug);
      }
    } else {
      this.authorServices.updateAuthor(this.author.slug, this.author).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật tác giả' });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật tác giả thất bại: ' + (error.error?.error || error.message) });
        },
        complete: () => {
          this.isLoading = false;
          this.authorDialog = false;
          this.isEditting = false;
          this.selectedFile = null;
          this.loadAuthorData();
        }
      });
    }
    this.isLoading = false;
  }

  private hasChanges(original: any, updated: any) {
    const fieldsToCompare = ['avatar', 'name', 'bio', 'email'];

    for (const field of fieldsToCompare) {
      if (original[field] !== updated[field]) {
        return true;
      }
    }
    if (this.selectedFile) {
      return true;
    }

    return false;
  }

  getCloudinaryPublicId(url: string) {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1].split('.')[0];
  }

  deleteThumbnailInCloudinary(publicId: string) {
    this.uploadService.deleteImage(publicId).subscribe({
      next: () => {
        console.log("🗑️ Ảnh cũ đã được xóa!");
      },
      error: (error) => {
        console.error("❌ Không thể xóa ảnh cũ", error);
      }, complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateThumbnailInCloudinary(selectedFile: File, slug: string): void {
    this.isLoading = true;
    this.uploadService.uploadImage(selectedFile).subscribe({
      next: (response: any) => {
        this.author.avatar = response.secure_url;
        const oldSlug = slug;
        this.authorServices.updateAuthor(oldSlug, this.author).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công tác giả' });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: error.error?.error || error.message });
          },
          complete: () => {
            this.isLoading = false;
            this.authorDialog = false;
            this.isEditting = false;
            this.selectedFile = null;
            this.loadAuthorData();

          }
        });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: error.error?.error || error.message });
        this.authorDialog = false;
        this.isEditting = false;
        this.selectedFile = null;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  deleteSelectedAuthors() {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các tác giả đã chọn không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedAuthors.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ít nhất một tác giả để xóa' });
          return;
        } if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedAuthors.length} tác giả?`)) {

          const avatarsToDelete = this.selectedAuthors.
            filter(author => author.avatar !== "https://res.cloudinary.com/djk2ys41m/image/upload/v1742972953/lvyrjwewxzjlht1leiqi.jpg")
            .map(author => this.getCloudinaryPublicId(author.avatar));
          const slugs = this.selectedAuthors.map(author => author.slug);

          this.authorServices.bulkDeleteAuthors(slugs).subscribe({
            next: (response) => {
              avatarsToDelete.forEach(publicId => {
                this.deleteThumbnailInCloudinary(publicId);
              })
              this.messageService.add({ severity: 'success', summary: 'Thành công', detail: response.message });
              this.loadAuthorData();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error.message });
            },
            complete: () => {
              this.selectedAuthors = [];
              this.isLoading = false;
            }
          });
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Hủy bỏ', detail: 'Hủy xóa tác giả' });
        this.selectedAuthors = [];
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  deleteAuthor(author: any) {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa tác giả <span class="font-bold">${author.name}</span> không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authorServices.deleteAuthor(author.slug).subscribe({
          next: () => {
            if (author.avatar) {
              const publicId = this.getCloudinaryPublicId(author.avatar);
              this.deleteThumbnailInCloudinary(publicId);
            }
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa tác giả' });
            this.loadAuthorData();
          }, error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Lỗi: ' + error });
          }, complete: () => {
            this.isLoading = true;
          }
        });
      },
      reject: () => {
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  hideDialog() {
    this.authorDialog = false;
    this.submitted = false;
    this.isLoading = false;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.authors.length; i++) {
      if (this.authors[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  saveAuthor() {
    this.submitted = true;
    if (!this.author.name?.trim()) {
      return;
    }
    if (this.selectedFile) {
      this.uploadService.uploadImage(this.selectedFile).subscribe({
        next: (response: any) => {
          this.author.avatar = response.secure_url;
          setTimeout(() => {
            this.submitCreate(this.author);
          }, 100)
        }, error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Upload ảnh thất bại' });
          this.authorDialog = false;
        }
      })
    } else {
      this.submitCreate(this.author);
    }
  }

  submitCreate(author: any) {
    this.isLoading = true;
    this.authorServices.createAuthor(author).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã lưu tác giả' });
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: error });
        const publicId = this.getCloudinaryPublicId(author.avatar);
        this.deleteThumbnailInCloudinary(publicId);
      }, complete: () => {
        this.isLoading = false;
        this.authorDialog = false;
        this.selectedFile = null;
        this.loadAuthorData();
      }
    });
    this.isLoading = false;
  }

  onFileSelected(event: any) {
    console.log(1);
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }


  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }


}
