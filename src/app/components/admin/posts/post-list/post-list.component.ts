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
  imports: [Tag, Image, CommonModule, RouterLink, FormsModule, DrawerModule, DropdownModule, ButtonModule, DatePicker, RouterLink, Tag, Image, TableModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule],
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
  @ViewChild('dt2') dt2!: Table; // Import từ Primeng


  ngOnInit(): void {
    this.loadPosts();
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
        published_at: post.published_at ? new Date(post.published_at) : null
      }));
      this.authors = Array.from(
        new Map(
          data
            .filter(post => post.posts_user) // Chỉ lấy những bài có user hợp lệ
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
    switch (status) {
      case 'draft': return { label: 'Nháp', severity: "primary" as const };
      case 'pending': return { label: 'Đang chờ duyệt', severity: 'warn' as const };
      case 'published': return { label: 'Đã được đăng', severity: 'success' as const };
      case 'scheduled': return { label: 'Đã lên lịch', severity: 'info' as const };
      case 'archived': return { label: 'Lưu trữ', severity: 'info' as const };
      case 'rejected': return { label: 'Từ chối', severity: 'danger' as const };
      case 'deleted': return { label: 'Đã xoá', severity: 'contrast' as const };
      default: return { label: 'Không xác định', severity: 'primary' as const };
    }
  }


}
