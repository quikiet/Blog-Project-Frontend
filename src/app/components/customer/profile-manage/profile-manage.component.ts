import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../../services/users/user.service';



@Component({
  selector: 'app-profile-manage',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './profile-manage.component.html',
  styleUrl: './profile-manage.component.css'
})
export class ProfileManageComponent implements OnInit {
  user: any = {};
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    const userID = userData ? JSON.parse(userData) : null;
    this.userService.getCurrentUser(userID).subscribe((data) => {
      this.user = data.user;
    })
  }
}
