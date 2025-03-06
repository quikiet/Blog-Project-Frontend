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



@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, CommonModule, FormsModule, MatPaginatorModule],
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
  filterValue = '';

  @ViewChild('cateModal') cateModal!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


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

  resetForm() {
    this.currentCategory.name = '';
    this.newCategory.name = '';
    this.isSubmit = false;
    this.editting = false;
    this.isLoading = false;
  }

  deleteCategory(id: number) {
    if (!id) {
      this.toastr.error("Không có danh mục này", "Lỗi");
    }
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.loadCategories();
        this.toastr.success("Xoá danh mục thành công", "Thành công");
      }, error: () => {
        this.toastr.error("Không xoá được danh mục này", "Lỗi");
      }
    });

  }

  updateCategory(): void {
    if (!this.isEditting || !this.isEditting.name.trim() || this.isEditting.id === undefined) {
      this.toastr.error("Không sửa được danh mục này", "Lỗi");
    }
    this.isSubmit = true;
    this.categoryService.update(this.currentCategory.id!, this.currentCategory).subscribe({
      next: () => {
        this.loadCategories(); // Load lại danh mục sau khi cập nhật
        this.toastr.success('Cập nhật danh mục thành công!', 'Thành công!');
        this.resetForm();
        this.cateModal.nativeElement.close(); // Đóng modal
      },
      error: (err) => {
        this.toastr.error('Đã có danh mục này!', 'Cảnh báo');
        console.error("Lỗi khi cập nhật danh mục", err);
      },
      complete: () => this.isSubmit = false
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
      this.toastr.warning('Tên danh mục không được để trống!', 'Cảnh báo');
      return;
    }
    this.isSubmit = true;
    this.categoryService.create(this.newCategory).subscribe({
      next: (data) => {
        this.loadCategories();
        this.newCategory.name = '';
        this.showSuccess();
        this.cateModal.nativeElement.close();
        this.resetForm();
      },
      error: () => {
        this.toastr.error('Đã có danh mục này!', 'Cảnh báo');

      },
      complete: () => this.isSubmit = false
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

  showSuccess() {
    this.toastr.success('Thêm danh mục thành công!', 'Thành công!');
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
