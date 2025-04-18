import { ButtonComponent } from "../../../shared/components/button/button.component";
import { ModalSubmitDeleteComponent } from '../../../shared/components/modal-submit-delete/modal-submit-delete.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Post, PostService } from '../../../services/posts/post.service';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CategoryService } from "../../../services/category/category.service";

import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartsComponent } from "./charts/charts.component";
import { StatisticsService } from "../../../services/websetting/statistics.service";
import { AuthorsService } from "../../../services/authors/authors.service";
@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CarouselModule, ButtonModule, TagModule, ChartModule, ChartsComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  basicData: any;

  basicOptions: any;

  platformId = inject(PLATFORM_ID);

  postService = inject(PostService);
  cateService = inject(CategoryService);
  userService = inject(StatisticsService);
  authorService = inject(AuthorsService);

  dataPostByMonth: any;
  getDataPostByMonth: any;
  labelsPostByMonth: any;
  trendingPosts: any = [];

  totalUser = 0;
  totalPost = 0;
  totalAuthor = 0;
  totalCategory = 0;
  totalView = 0;

  constructor(private cd: ChangeDetectorRef) { }

  themeEffect = effect(() => {
    this.initChart();
  });

  ngOnInit() {
    this.loadCount();
    this.getPostByMonth();
    this.getTrendingPosts();
  }

  getTrendingPosts() {
    this.postService.getTrendingPosts().subscribe((data) => {
      this.trendingPosts = data;
    })
  }

  getPostByMonth() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      this.postService.getPostByMonth().subscribe(
        (res) => {
          this.labelsPostByMonth = res.labels;
          this.getDataPostByMonth = res.data;
          this.dataPostByMonth = {
            labels: this.labelsPostByMonth,
            datasets: [
              {
                label: 'Số bài viết được tạo',
                data: this.getDataPostByMonth
              },
            ]
          };
        }
      )
      this.cd.markForCheck()
    }
  }

  loadCount() {
    this.postService.countPost().subscribe((count) => {
      this.totalPost = count;
      this.updateChart();
    });

    this.cateService.countCategory().subscribe((count) => {
      this.totalCategory = count;
      this.updateChart();
    });

    this.authorService.countAuthors().subscribe((count) => {
      this.totalAuthor = count;
      this.updateChart();
    });

    this.userService.getStatistics().subscribe((res) => {
      this.totalUser = res.userStats.totalUsers;
      this.postService.getTotalView().subscribe((count) => {
        this.totalView = count.views;
      });
    });


  }

  updateChart() {
    this.basicData = {
      labels: ['Bài báo', 'Danh mục', 'Tác giả'],
      datasets: [
        {
          label: 'Thống kê tổng lượng',
          data: [this.totalPost, this.totalCategory, this.totalAuthor],
          backgroundColor: [
            'rgba(249, 115, 22, 0.2)',
            'rgba(6, 182, 212, 0.2)',
            'rgba(125, 255, 125, 0.2)',
          ],
          borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)'],
          borderWidth: 1,
        },
      ],
    };

  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.basicData = {
        labels: ['Bài báo', 'Danh mục'],
        datasets: [
          {
            label: 'Thống kê tổng lượng',
            data: [this.totalPost, this.totalCategory],
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              // 'rgb(107, 114, 128, 0.2)',
              // 'rgba(139, 92, 246, 0.2)',
            ],
            borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)'],
            borderWidth: 1,
          },
        ],
      };


    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' });
  }

}
