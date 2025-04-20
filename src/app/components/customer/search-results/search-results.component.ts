import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { PostService, Post } from '../../../services/posts/post.service';
import { Subscription, of } from 'rxjs';
import { switchMap, finalize, catchError, tap } from 'rxjs/operators'; // Import thêm tap, catchError
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  allResults: Post[] = [];
  filteredResults: Post[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  private routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.pipe(
      tap(params => { // Sử dụng tap để lấy keyword và reset state trước khi gọi API
        this.searchTerm = params.get('keyword') || '';
        this.isLoading = true; // Bắt đầu loading ngay khi có keyword
        this.error = null;
        this.allResults = [];
        this.filteredResults = [];
        console.log('Search term from route:', this.searchTerm);
      }),
      switchMap(params => {
        // Kiểm tra keyword rỗng TRƯỚC KHI gọi service
        if (!this.searchTerm) {
          this.isLoading = false; // Dừng loading nếu không có keyword
          return of([]); // Trả về Observable rỗng
        }
        // Gọi service search (hàm gốc của bạn)
        return this.postService.search(this.searchTerm).pipe(
          // Xử lý lỗi NGAY TẠI ĐÂY vì service không xử lý
          catchError(err => {
            console.error("Error caught in component:", err);
            // Đặt thông báo lỗi để hiển thị trên UI
            this.error = "Không thể tải kết quả tìm kiếm. Vui lòng thử lại.";
            // Trả về một Observable rỗng để luồng không bị chết và subscribe có thể hoàn thành
            return of([]);
          }),
          // Luôn đặt finalize sau catchError để đảm bảo nó chạy cả khi có lỗi
          finalize(() => {
            this.isLoading = false; // Dừng loading khi API hoàn thành (thành công hoặc lỗi đã catch)
            console.log('API call finished. Loading set to false.');
          })
        );
      })
    ).subscribe((resultsFromService: Post[]) => {
      // Chỉ xử lý nếu không có lỗi được set trước đó
      if (!this.error) {
        this.allResults = resultsFromService || []; // Đảm bảo là mảng ngay cả khi API trả về null/undefined
        // LỌC KẾT QUẢ Ở ĐÂY
        this.filteredResults = this.allResults.filter(post => post.status === 'published');
        console.log('Received results:', this.allResults);
        console.log('Filtered results:', this.filteredResults);
        // Kiểm tra nếu không có kết quả sau khi lọc
        if (this.filteredResults.length === 0 && this.searchTerm) {
          console.log('No published posts found matching the criteria.');
          // Không cần set lỗi ở đây, template sẽ hiển thị thông báo "Không tìm thấy"
        }
      } else {
        // Nếu có lỗi đã được set trong catchError, không làm gì với results nữa
        console.log('Subscription received data, but an error was previously set.');
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}