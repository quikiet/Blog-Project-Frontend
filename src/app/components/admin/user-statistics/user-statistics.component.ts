import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../../services/websetting/statistics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.css'
})
export class UserStatisticsComponent implements OnInit {
  stats: any;
  isLoading = true;
  error: string | null = null;

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.error = null;

    this.statisticsService.getStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load statistics. Please try again later.';
        this.isLoading = false;
        console.error('Error loading statistics:', err);
      },
    });
  }

  getRoleCount(role: string): number {
    return this.stats?.userStats?.roleCounts[role] || 0;
  }

  getStatusCount(status: string): number {
    return this.stats?.postStats?.statusCounts[status] || 0;
  }

  refreshData(): void {
    this.loadStatistics();
  }
}
