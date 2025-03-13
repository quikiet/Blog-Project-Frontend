import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category, CategoryService } from '../../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalSubmitDeleteComponent } from "../../../shared/components/modal-submit-delete/modal-submit-delete.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, CommonModule, FormsModule, MatPaginatorModule, ButtonComponent, ModalSubmitDeleteComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements AfterViewInit, OnInit {

  constructor(private categoryService: CategoryService, private toastr: ToastrService) { }
  private _liveAnnouncer = inject(LiveAnnouncer);
  displayedColumns: string[] = ['id', 'name', 'actions'];
  categories = new MatTableDataSource<Category>;
  isLoading = true;
  newCategory: Category = {
    id: 0,
    name: ''
  };
  currentCategory: Category = {
    id: 0,
    name: ''
  };
  isSubmit = false;
  isEditting: Category | null = null;
  editting = false;
  isDeleted = false;
  filterValue = '';
  idSelected: number | null = null;
  @ViewChild('cateModal') cateModal!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  validateCategoryName = false;

  ngOnInit(): void {
    this.loadCategories();
  }


  ngAfterViewInit() {
    this.categories.sort = this.sort;
    this.categories.paginator = this.paginator;
  }


  applyFilter() {
    this.categories.filter = this.filterValue.toLowerCase().trim();
  }

  deleteModal(id: number) {
    this.idSelected = id;
    this.isDeleted = true;
  }

  resetForm() {
    this.currentCategory.name = '';
    this.newCategory.name = '';
    this.editting = false;
    this.isLoading = false;
    this.validateCategoryName = false;
    this.isDeleted = false;
  }

  deleteCategory() {
    if (!this.idSelected) {
      this.toastr.error("Không có danh mục này", "Lỗi");
    }
    this.categoryService.delete(this.idSelected!).subscribe({
      next: () => {
        this.loadCategories();
        this.toastr.success("Xoá danh mục thành công", "Thành công");
        this.isDeleted = false;
      }, error: () => {
        this.toastr.error("Danh mục này hiện đang được sử dụng", "Lỗi xoá");
      }
    });
    this.isDeleted = false;
  }

  updateCategory(): void {
    if (!this.currentCategory.name.trim()) {
      this.validateCategoryName = true;
      return;
    }
    this.validateCategoryName = false;

    if (!this.isEditting || !this.isEditting.name.trim() || this.isEditting.id === undefined) {
      this.toastr.error("Không sửa được danh mục này", "Lỗi");
    }
    this.categoryService.update(this.currentCategory.id!, this.currentCategory).subscribe({
      next: () => {
        this.loadCategories(); // Load lại danh mục sau khi cập nhật
        this.toastr.success('Cập nhật danh mục thành công!', 'Thành công!');
        this.resetForm();
        this.cateModal.nativeElement.close(); // Đóng modal
      },
      error: (err) => {
        this.cateModal.nativeElement.close();
        console.error("Lỗi khi cập nhật danh mục", err);
      },
      complete: () => {
      }
    });

  }

  editCategory(category: Category) {
    this.editting = true;
    this.isEditting = { ...category }; // Copy object tránh thay đổi trực tiếp
    this.currentCategory = this.isEditting; // Trỏ đến category đang sửa
    this.cateModal.nativeElement.showModal();
  }

  createCategory() {
    if (!this.newCategory.name.trim()) {
      this.validateCategoryName = true;
      return;
    }
    this.categoryService.create(this.newCategory).subscribe({
      next: (data) => {
        this.loadCategories();
        this.toastr.success('Thêm danh mục thành công', 'Thành công');
        this.cateModal.nativeElement.close();
        this.resetForm();
      },
      error: () => {
        this.toastr.error('Đã có danh mục này!', 'Cảnh báo');

      },
      complete: () => {
        this.validateCategoryName = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.data = data;
        this.isLoading = false;
      }, error: (error) => {
        console.error("Lỗi tải danh mục", error);
        this.isLoading = false;
      }
    });
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
