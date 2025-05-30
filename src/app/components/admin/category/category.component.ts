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
import { ProgressSpinner } from 'primeng/progressspinner';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [Tag, ProgressSpinner, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, CommonModule, FormsModule, MatPaginatorModule, ButtonComponent, ModalSubmitDeleteComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit, AfterViewInit {

  constructor(private categoryService: CategoryService, private toastr: ToastrService) { }
  private _liveAnnouncer = inject(LiveAnnouncer);
  displayedColumns: string[] = ['id', 'name', 'categories_posts_count', 'slug', 'actions'];
  categories = new MatTableDataSource<Category>;
  isLoading = true;
  newCategory: Category = {
    id: 0,
    name: '',
    slug: ''
  };
  currentCategory: Category = {
    id: 0,
    name: '',
    slug: ''
  };
  isSubmit = false;
  isEditting: Category | null = null;
  editting = false;
  isDeleted = false;
  filterValue = '';
  slugSelected: string = '';
  categoriesCount: any = [];

  @ViewChild('cateModal') cateModal!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  validateCategoryName = false;

  ngAfterViewInit(): void {
    this.categories.sort = this.sort;
    this.categories.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadCategories();
  }



  applyFilter() {
    this.categories.filter = this.filterValue.toLowerCase().trim();
  }

  deleteModal(slug: string) {
    this.slugSelected = slug;
    this.isDeleted = true;
  }

  resetForm() {
    this.currentCategory.name = '';
    this.currentCategory.slug = '';
    this.newCategory.name = '';
    this.newCategory.slug = '';
    this.editting = false;
    this.isLoading = false;
    this.validateCategoryName = false;
    this.isDeleted = false;
  }

  deleteCategory() {
    this.isLoading = true;
    if (!this.slugSelected) {
      this.toastr.error("Không có danh mục này", "Lỗi");
    }
    if (this.isDeleted) {
      this.categoryService.delete(this.slugSelected!).subscribe({
        next: () => {
          this.loadCategories();
          this.toastr.success("Xoá danh mục thành công", "Thành công");
          this.isDeleted = false;
        }, error: (error) => {
          this.toastr.error("Danh mục này hiện đang có bài báo", "Lỗi xoá");
          console.log(error);
          this.isLoading = false;
        }, complete: () => {
          this.isLoading = false;
        }
      });
    }
    this.isDeleted = false;
  }

  updateCategory(): void {
    this.isLoading = true;
    try {
      if (!this.currentCategory.name.trim()) {
        this.validateCategoryName = true;
        return;
      }
      this.validateCategoryName = false;

      const oldSlug = this.currentCategory.slug;

      this.categoryService.update(oldSlug, this.currentCategory).subscribe({
        next: () => {
          this.loadCategories(); // Load lại danh mục sau khi cập nhật
          this.toastr.success('Cập nhật danh mục thành công!', 'Thành công!');
          this.resetForm();
          this.cateModal.nativeElement.close(); // Đóng modal
        },
        error: (err) => {
          this.cateModal.nativeElement.close();
          this.toastr.error("Cập nhật không thành công", "Lỗi");
          console.log(err);
          this.isLoading = false;
        }, complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.toastr.error("Lỗi: " + error);
    }
    this.isLoading = false;
  }

  editCategory(category: Category) {
    this.editting = true;
    this.isEditting = { ...category };
    this.currentCategory = this.isEditting;
    this.cateModal.nativeElement.showModal();
  }

  // generateSlug(text: string): string {
  //   if (!text) return '';
  //   return text
  //     .toLowerCase() // Chuyển thành chữ thường
  //     .normalize('NFD') // Chuẩn hóa ký tự Unicode
  //     .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
  //     .replace(/[^a-z0-9]+/g, '-') // Thay tất cả ký tự không phải chữ/số bằng -
  //     .replace(/(^-|-$)/g, ''); // Xóa dấu - ở đầu và cuối
  // }

  createCategory() {
    this.isLoading = true;
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
      error: (error) => {
        this.toastr.error(error, 'Cảnh báo');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
