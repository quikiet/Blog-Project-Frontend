import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  formData = { id: null as number | null, name: '', student_code: '' };

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUser().subscribe((data) =>
      this.users = data
    );
  }

  saveUser() {
    if (this.formData.name !== '' && this.formData.student_code !== '') {
      const isDuplicate = this.users.some(user =>
        user.student_code === this.formData.student_code && user.id !== this.formData.id
      );

      if (isDuplicate) {
        this.toastr.error("Mã sinh viên đã tồn tại", "Lỗi");
        return;
      }
      if (this.formData.id && (this.formData.name !== '' && this.formData.student_code !== '')) {
        this.userService.updateUser(this.formData, this.formData.id).subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      } else {
        this.userService.createUser(this.formData).subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      }
      this.toastr.success("Thực hiện thành công", "Thành công");
    } else {
      this.toastr.error("Vui lòng điền đầy đủ", "Lỗi");
    }
  }

  editUser(user: any) {
    this.formData = { ...user };
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    this.toastr.success("Thực hiện thành công", "Thành công");
  }

  resetForm() {
    this.formData = { id: null, name: '', student_code: '' };
  }

}
