import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category, CategoryService } from '../../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements AfterViewInit, OnInit {

  constructor(private categoryService: CategoryService) { }
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['id', 'name'];
  categories = new MatTableDataSource<Category>;
  isLoading = true;
  newCategory: Category = { name: '' };
  isSubmit = false;

  @ViewChild('cateModal') cateModal!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.loadCategories();
  }

  createCategory() {
    if (!this.newCategory.name.trim()) {
      console.log("k de trong");
      return;
    }
    this.isSubmit = true;
    this.categoryService.create(this.newCategory).subscribe({
      next: (data) => {
        this.loadCategories();
        this.newCategory.name = '';
        this.cateModal.nativeElement.close();
      },
      error: () => {
        console.error("error");
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

  ngAfterViewInit() {
    this.categories.sort = this.sort;
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
