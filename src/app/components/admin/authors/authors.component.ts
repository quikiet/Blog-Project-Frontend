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
  imports: [FileUpload, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, Ripple, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, DropdownModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule],
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
  }

  openNew() {
    this.author = {};
    this.submitted = false;
    this.authorDialog = true;
  }

  editAuthor(author: any) {
    this.author = { ...author };
    this.originalAuthor = { ...author };
    this.authorDialog = true;
    this.isEditting = true;
  }

  updateAuthor(author: any, slug: string) {
    if (this.isEditting) {

      const hasChanges = this.hasChanges(this.originalAuthor, author);
      if (!hasChanges) {
        // Nếu không có thay đổi, chỉ đóng dialog và đặt lại trạng thái
        this.authorDialog = false;
        this.isEditting = false;
        return;
      }
      this.authorServices.updateAuthor(slug, author).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật tác giả' });

        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật tác giả thất bại do: ' + error.error.error });
        },
        complete: () => {
          this.authorDialog = false;
          this.isEditting = false;
          this.loadAuthorData();
        }
      });
    }
  }

  private hasChanges(original: any, updated: any) {
    const fieldsToCompare = ['name', 'bio', 'email', 'avatar'];

    for (const field of fieldsToCompare) {
      if (original[field] !== updated[field]) {
        return true;
      }
    }
    return false;
  }

  deleteSelectedAuthors() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các tác giả đã chọn không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedAuthors.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ít nhất một tác giả để xóa' });
          return;
        } if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedAuthors.length} tác giả?`)) {
          const slugs = this.selectedAuthors.map(author => author.slug);

          this.authorServices.bulkDeleteAuthors(slugs).subscribe({
            next: (response) => {
              this.messageService.add({ severity: 'success', summary: 'Thành công', detail: response.message });
              this.loadAuthorData();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error.message });
            },
            complete: () => {
              this.selectedAuthors = [];
            }
          });
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Hủy bỏ', detail: 'Hủy xóa tác giả' });
        this.selectedAuthors = [];

      }
    });
  }

  hideDialog() {
    this.authorDialog = false;
    this.submitted = false;
  }

  deleteAuthor(author: any) {
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa tác giả ${author.name} không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authorServices.deleteAuthor(author.slug).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa tác giả' });
            this.loadAuthorData();
          }, error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Lỗi: ' + error });
          }
        });
      },
      // reject: () => {
      //   this.messageService.add({ severity: 'info', summary: 'Hủy bỏ', detail: 'Hủy xóa tác giả' });
      // }
    });
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
          }, 500)
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
    console.log(author);

    this.authorServices.createAuthor(author).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã lưu tác giả' });
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: error });
      }, complete: () => {
        this.authorDialog = false;
        this.loadAuthorData();
      }
    })
  }

  onFileSelected(event: any) {
    console.log(1);
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }
}
