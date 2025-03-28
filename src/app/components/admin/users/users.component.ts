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
  isLoading = false;
  formData = {
    id: null as number | null,
    name: '',
    email: '',
    password: '',
    avatar: '', // Thay đổi từ File sang string để lưu URL
    role: 'user',
  };

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUser().subscribe({
      next: (data) => (this.users = data),
      error: (err) =>
        this.toastr.error('Tải danh sách người dùng thất bại', 'Lỗi'),
    });
  }

  saveUser() {
    if (!this.validateForm()) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin hợp lệ', 'Lỗi');
      return;
    }

    // Kiểm tra trùng email
    const isDuplicate = this.users.some(
      (user) =>
        user.email === this.formData.email && user.id !== this.formData.id
    );

    if (isDuplicate) {
      this.toastr.error('Email đã tồn tại trong hệ thống', 'Lỗi');
      return;
    }
    console.log(this.formData);

    if (this.formData.id) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  // Sửa lại phương thức validateForm
  private validateForm(): boolean {
    // Kiểm tra URL avatar nếu có
    if (this.formData.avatar && !this.isValidUrl(this.formData.avatar)) {
      this.toastr.error('URL ảnh đại diện không hợp lệ', 'Lỗi');
      return false;
    }

    // Đảm bảo tất cả các điều kiện trả về boolean rõ ràng
    const isNameValid = this.formData.name.trim() !== '';
    const isEmailValid = this.formData.email.trim() !== '';
    const isPasswordValid = this.formData.password.trim() !== '';
    const isRoleValid = this.formData.role.trim() !== '';

    return isNameValid && isEmailValid && isPasswordValid && isRoleValid;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  private createUser() {
    this.userService.createUser(this.formData).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
        this.toastr.success('Tạo người dùng thành công', 'Thành công');
      },
      error: (err) => {
        this.handleError(err, 'tạo mới');
      },
    });
  }

  private updateUser() {
    this.userService.updateUser(this.formData, this.formData.id!).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
        this.toastr.success('Cập nhật người dùng thành công', 'Thành công');
      },
      error: (err) => {
        this.handleError(err, 'cập nhật');
      },
    });
  }

  private handleError(error: any, action: string) {
    console.error(`Lỗi khi ${action} người dùng:`, error);

    if (error.status === 409) {
      this.toastr.error('Email đã tồn tại trong hệ thống', 'Lỗi');
    } else if (error.error?.message) {
      this.toastr.error(error.error.message, 'Lỗi');
    } else {
      this.toastr.error(`Đã xảy ra lỗi khi ${action} người dùng`, 'Lỗi');
    }
  }

  editUser(user: any) {
    this.formData = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // Không hiển thị password cũ
      avatar: user.avatar || '',
      role: user.role,
    };
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.toastr.success('Xóa người dùng thành công', 'Thành công');
        },
        error: (err) => {
          this.toastr.error('Có lỗi xảy ra khi xóa người dùng', 'Lỗi');
        },
      });
    }
  }

  resetForm() {
    this.formData = {
      id: null,
      name: '',
      email: '',
      password: '',
      avatar: '',
      role: 'user',
    };
  }
  confirmDelete(userId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.deleteUser(userId);
    }
  }
}
