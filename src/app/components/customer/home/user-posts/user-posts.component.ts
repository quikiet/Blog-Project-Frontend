import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/Auth/login.service';
import { PostService } from '../../../../services/posts/post.service';
import { UserService } from '../../../../services/users/user.service';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [PaginatorModule, CommonModule],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css'
})
export class UserPostsComponent implements OnInit {

  users: any = {};
  user_posts: any[] = [];
  userId: number | null = null;
  isLoading = true;
  currentPage = 0;
  constructor(
    private loginService: LoginService,
    private postService: PostService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getUserPosts();
  }

  getUser() {
    this.users = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = this.users.id;
  }

  getUserPosts() {
    this.userService.getPostByUserId(this.userId!).subscribe((res: any) => {

      this.user_posts = res.posts?.data || [];
    });
    console.log(this.user_posts);

  }


  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.getUserPosts();
  }
}
