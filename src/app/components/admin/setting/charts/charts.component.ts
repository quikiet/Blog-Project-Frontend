import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PostService } from '../../../../services/posts/post.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Tag } from 'primeng/tag';
@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [FullCalendarModule, RouterLink, CommonModule, FormsModule, Tag],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {

  constructor(private postService: PostService) { }
  eventPosts: any = [];
  selectedPost: any = null;
  showModal: boolean = false;
  filterStatus: string = 'all';
  isLoading = true;
  totalPost: number = 0;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    // dateClick: (arg) => this.handleDateClick(arg),
    eventClick: (arg) => this.handleEventClick(arg),
    events: [],
  };
  statusColors: { status: string; color: string; label: string; count?: number }[] = [
    { status: 'scheduled', color: '#3b82f6', label: 'Đã lên lịch' },
    { status: 'published', color: '#10b981', label: 'Đã xuất bản' },
    { status: 'deleted', color: '#F87272', label: 'Đã xóa' },
    { status: 'rejected', color: '#F87272', label: 'Bị từ chối' },
    { status: 'pending', color: '#F59E0B', label: 'Đang chờ duyệt' },
    { status: 'archived', color: '#804544', label: 'Đã lưu trữ' },
    { status: 'draft', color: '#6B7280', label: 'Nháp' },
  ];
  statusCounts: { [key: string]: number } = {};

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.eventPosts = data;
        this.calendarOptions.events = this.eventPosts.map((post: any) => ({
          title: post.title,
          date: post.published_at.split(' ')[0],
          backgroundColor: this.getEventColor(post.status),
          borderColor: this.getEventColor(post.status),
          extendedProps: {
            id: post.id,
            slug: post.slug,
            content: post.content,
            summary: post.summary,
            thumbnail: post.thumbnail,
            published_at: post.published_at,
            category_id: post.category_id,
            user_id: post.user_id,
            posts_user: post.posts_user,
            status: post.status,
          },
        }));
        this.isLoading = false;
        this.applyFilter();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching scheduled posts:', error);
      },
      complete: () => {
        this.isLoading = false;
        console.log('Completed fetching scheduled posts');
      },
    });
    this.postService.countPost().subscribe(count => {
      this.totalPost = count;
    })
    const statuses = this.statusColors.map(item => item.status);
    forkJoin(statuses.map(status => this.postService.countPostByStatus(status))).subscribe({
      next: (counts: any[]) => {
        this.statusColors = this.statusColors.map((item, index) => ({
          ...item,
          count: counts[index]?.count ?? 0
        }));
      },
      error: (error) => console.error('Error fetching status counts:', error)
    });
  }

  applyFilter() {
    this.calendarOptions.events = this.eventPosts
      .filter((post: any) => this.filterStatus === 'all' || post.status === this.filterStatus)
      .map((post: any) => ({
        title: post.title,
        date: post.published_at.split(' ')[0],
        backgroundColor: this.getEventColor(post.status),
        borderColor: this.getEventColor(post.status),
        extendedProps: {
          id: post.id,
          slug: post.slug,
          content: post.content,
          summary: post.summary,
          thumbnail: post.thumbnail,
          published_at: post.published_at,
          category_id: post.category_id,
          user_id: post.user_id,
          posts_user: post.posts_user,
          status: post.status,
        },
      }));
  }

  changeFilter(value: string) {
    this.filterStatus = value;
    if (this.filterStatus)
      this.applyFilter();
  }

  handleEventClick(arg: any) {
    this.selectedPost = {
      title: arg.event.title,
      published_at: arg.event.extendedProps.published_at,
      summary: arg.event.extendedProps.summary,
      thumbnail: arg.event.extendedProps.thumbnail,
      posts_user: arg.event.extendedProps.posts_user,
      status: arg.event.extendedProps.status || 'default',
      id: arg.event.extendedProps.id,
      slug: arg.event.extendedProps.slug,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPost = null;
  }

  getEventColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return '#3b82f6'; // Xanh dương sáng
      case 'published':
        return '#10b981'; // Xanh lá cây
      case 'deleted':
        return '#F87272'; // Đỏ
      case 'rejected':
        return '#F87272'; // Đỏ nhạt
      case 'pending':
        return '#F59E0B'; // Cam nhạt 
      case 'archived':
        return '#804544'; // nâu 
      default:
        return '#6B7280'; // Xám đậm (màu mặc định)
    }
  }
}
