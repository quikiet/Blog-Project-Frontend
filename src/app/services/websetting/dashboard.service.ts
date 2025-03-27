import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// dashboard.model.ts
export interface DashboardStats {
  userStats: UserStats;
  postStats: PostStats;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  userGrowthRate: number;
  activeUsersGrowth: number;
  roleCounts: {
    admin: number;
    author: number;
    user: number;
  };
  newUsersTrend: number[];
  activeUsersTrend: number[];
  recentUsers: RecentUser[];
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  created_at: string;
}

export interface PostStats {
  totalPosts: number;
  postGrowthRate: number;
  statusCounts: {
    draft: number;
    pending: number;
    published: number;
    scheduled: number;
    archived: number;
    rejected: number;
    deleted: number;
  };
  postsTrend: number[];
  recentPosts: RecentPost[];
}

export interface RecentPost {
  id: number;
  title: string;
  status: string;
  published_at: string;
  thumbnail: string | null;
  user: {
    id: number;
    name: string;
  };
}
@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  private apiUrl = 'http://127.0.0.1:8000/dashboard/stats';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}
