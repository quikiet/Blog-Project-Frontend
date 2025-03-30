import { Component, OnInit, ViewChild } from '@angular/core';
import { Post, PostService } from '../../../../services/posts/post.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { Table, TableModule } from 'primeng/table';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    Tag, Image,
    CommonModule, RouterLink,
    FormsModule, DrawerModule,
    DropdownModule, ButtonModule, DatePicker,
    RouterLink, Tag, Image, TableModule,
    IconFieldModule, InputTextModule, InputIconModule,
    MultiSelectModule, SelectModule
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {

  constructor(private postService: PostService) { }
  posts: any[] = [];
  authors: any[] = [];
  status: any[] = [];
  filterMenu: boolean = false;
  loading: boolean = true;
  tags: any[] = [];

  @ViewChild('dt2') dt2!: Table; // Import từ Primeng


  ngOnInit(): void {
    this.loadPosts();
    this.tags = [
      { label: 'Nháp', value: 'draft' },
      { label: 'Đang chờ', value: 'pending' },
      { label: 'Công khai', value: 'published' },
      { label: 'Lên lịch', value: 'scheduled' },
      { label: 'Lưu trữ', value: 'archived' },
      { label: 'Bị xoá', value: 'rejected' },
      { label: 'Đã xoá', value: 'deleted' }
    ];
  }

  clear(table: Table) {
    table.clear();
  }

  searchGlobal(event: any) {
    if (this.dt2) {
      this.dt2.filterGlobal(event.target.value, 'contains');
    }
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data.map(post => ({
        ...post,
        published_at: post.published_at ? this.formatDate(new Date(post.published_at)) : null
      }));
      this.authors = Array.from(
        new Map(
          data
            .filter(post => post.posts_user)
            .map(post => [post.posts_user?.id, { label: post.posts_user?.name, value: post.posts_user?.id }])
        ).values()
      );
      this.loading = false;
    });

    this.status = [
      { label: 'Nháp', value: 'draft' },
      { label: 'Đang chờ', value: 'pending' },
      { label: 'Công khai', value: 'published' },
      { label: 'Lên lịch', value: 'scheduled' },
      { label: 'Lưu trữ', value: 'archived' },
      { label: 'Bị xoá', value: 'rejected' },
      { label: 'Đã xoá', value: 'deleted' }
    ];
  }

  getStatusLabel(status: string) {
    const statuses: Record<string, { label: string; severity: "warn" | "success" | "info" | "danger" | "contrast" | "secondary" }> = {
      draft: { label: 'Nháp', severity: "contrast" },
      pending: { label: 'Đang chờ duyệt', severity: "warn" },
      published: { label: 'Đã đăng', severity: "success" },
      scheduled: { label: 'Đã lên lịch', severity: "info" },
      archived: { label: 'Lưu trữ', severity: "info" },
      rejected: { label: 'Từ chối', severity: "danger" },
      deleted: { label: 'Đã xoá', severity: "danger" }
    };

    return statuses[status] ?? { label: 'Không xác định', severity: "secondary" };
  }

  filterByDate(event: Date) {
    if (!event) return;
    const formattedDate = this.formatDate(event);
    this.dt2.filter(formattedDate, 'published_at', 'equals');
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


}
