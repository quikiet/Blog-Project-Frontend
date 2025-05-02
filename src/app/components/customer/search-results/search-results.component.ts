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
      tap(params => {
        this.searchTerm = params.get('keyword') || '';
        this.isLoading = true;
        this.error = null;
        this.allResults = [];
        this.filteredResults = [];
      }),
      switchMap(params => {
        if (!this.searchTerm) {
          this.isLoading = false;
          return of([]);
        }
        return this.postService.search(this.searchTerm).pipe(
          catchError(err => {
            this.error = "Không thể tải kết quả tìm kiếm. Vui lòng thử lại.";
            return of([]);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        );
      })
    ).subscribe((resultsFromService: Post[]) => {
      if (!this.error) {
        this.allResults = resultsFromService || [];
        this.filteredResults = this.allResults;
        if (this.filteredResults.length === 0 && this.searchTerm) {
          console.log('No published posts found matching the criteria.');
        }
      } else {
        console.log('Subscription received data, but an error was previously set.');
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}