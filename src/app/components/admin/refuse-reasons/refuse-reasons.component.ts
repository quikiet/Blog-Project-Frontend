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
import { RefuseReasonService } from '../../../services/category/refuse-reason.service';
import { ProgressSpinner } from 'primeng/progressspinner';

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
  selector: 'app-refuse-reasons',
  standalone: true,
  imports: [ProgressSpinner, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, Ripple, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, DropdownModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './refuse-reasons.component.html',
  styleUrl: './refuse-reasons.component.css'
})
export class RefuseReasonsComponent implements OnInit {
  reasonDialog: boolean = false;
  reasons!: any[];
  originalReason: any = {};
  reason!: any;
  isEditting = false;
  selectedReasons: any[] = [];
  searchValue: string = '';
  submitted: boolean = false;
  isLoading = true;
  @ViewChild('tableReason') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  constructor(
    private reasonService: RefuseReasonService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.loadReasonData();
  }

  searchGlobal(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
  }

  clear(table: Table, searchValue: string) {
    this.searchValue = searchValue;
    table.clear();
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadReasonData() {
    this.reasonService.getAllReason().subscribe({
      next: (data) => {
        this.reasons = data;
        console.log(data);
        console.log(this.reason);
        this.cd.markForCheck();
      }, error: (error) => {
        console.error("Lỗi tải lý do từ chối", error);
        this.isLoading = false;
      }, complete: () => {
        this.isLoading = false;
      }
    });

    this.cols = [
      { field: 'id', header: 'Mã' },
      { field: 'reason', header: 'Lý do từ chối' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  openNew() {
    this.reason = {};
    this.submitted = false;
    this.reasonDialog = true;
    this.isEditting = false;
  }

  editAuthor(reason: any) {
    this.reason = { ...reason };
    this.originalReason = { ...reason };
    this.reasonDialog = true;
    this.isEditting = true;
  }

  updateReason(reason: any, id: number) {
    this.isLoading = true;
    if (this.isEditting) {
      const hasChanges = this.hasChanges(this.originalReason, reason);
      if (!hasChanges) {
        this.reasonDialog = false;
        this.isEditting = false;
        this.isLoading = false;
        return;
      }
      this.reasonService.update(id, reason).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật lý do' });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật lý do thất bại do: ' + error.error.error });
        },
        complete: () => {
          this.reasonDialog = false;
          this.isEditting = false;
          this.loadReasonData();
          this.isLoading = false;
        }
      });
    }
  }

  private hasChanges(original: any, updated: any) {
    if (original['reason'] !== updated['reason']) {
      return true;
    }
    return false;
  }

  getCloudinaryPublicId(url: string) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('.')[0];
  }

  deleteSelectedAuthors() {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các lý do đã chọn không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedReasons.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn ít nhất một lý do để xóa' });
          return;
        } if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedReasons.length} lý do?`)) {

          const selectedId = this.selectedReasons.map(reason => reason.id);
          console.log("IDs gửi đi: ", selectedId);

          this.reasonService.bulkDeleteRefuses(selectedId).subscribe({
            next: (response) => {
              this.messageService.add({ severity: 'success', summary: 'Thành công', detail: response.message });
              this.loadReasonData();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error.message });
              console.log(error.request);
              this.isLoading = false;
            },
            complete: () => {
              this.selectedReasons = [];
              this.isLoading = false;
            }
          });
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Hủy bỏ', detail: 'Hủy xóa lý do' });
        this.selectedReasons = [];
        this.isLoading = false;
      }
    });
  }

  deleteReason(reason: any) {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa lý do <span class="font-bold">${reason.reason}</span> không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reasonService.delete(reason.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: `Đã xóa lý do ${reason.reason}` });
            this.loadReasonData();
          }, error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Lỗi: ' + error });
            this.isLoading = false;
          }, complete: () => {
            this.isLoading = false;
          }
        });
      },
      reject: () => {
        this.isLoading = false;
      }
    });
  }

  hideDialog() {
    this.reasonDialog = false;
    this.submitted = false;
    this.reason = {};
    this.isEditting = false;
    this.isLoading = false;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.reasons.length; i++) {
      if (this.reasons[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  saveReason() {
    this.submitted = true;
    if (!this.reason.reason?.trim()) {
      return;
    }
    this.submitCreate(this.reason);
  }

  submitCreate(reason: any) {
    console.log(reason);
    this.isLoading = true;
    this.reasonService.create(reason).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã thêm mới 1 lý do' });
      }, error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: error });
        this.isLoading = false;
      }, complete: () => {
        this.reasonDialog = false;
        this.loadReasonData();
        this.isLoading = false;
      }
    })
  }
}
