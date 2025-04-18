import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../../services/users/user.service';



interface FormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar?: string;
}

interface DeleteConfirmation {
  email?: string;
  password?: string;
}

interface ChangePasswordForm {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

@Component({
  selector: 'app-profile-manage',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-manage.component.html',
  styleUrl: './profile-manage.component.css'
})
export class ProfileManageComponent implements OnInit {
  userID: any = {};
  users: any = {};
  isLoading = false;
  isDeleting: boolean = false;
  isDeleteConfirmationVisible: boolean = false;
  deleteConfirmation: DeleteConfirmation = {};
  isChangePasswordModalVisible: boolean = false;
  isChangingPassword: boolean = false;
  changePasswordForm: ChangePasswordForm = {};
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
    private toastr: ToastrService,
    private route: Router
  ) { }


  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    const userData = localStorage.getItem('user');
    this.userID = userData ? JSON.parse(userData) : null;
    this.userService.getCurrentUser(this.userID.id).subscribe((data) => {
      this.users = data;
      // console.log(this.users);
    })
    // console.log('userData: ' + this.users.id);

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

  public updateUser() {
    this.userService.updateUser(this.formData, this.formData.id!).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
        this.toastr.success('Cập nhật người dùng thành công', 'Thành công');
      },
      error: (err: any) => {
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

  initiateDelete() {
    this.isDeleteConfirmationVisible = true;
    this.deleteConfirmation = { email: this.formData.email, password: '' }; // Optionally pre-fill username
  }

  cancelDelete() {
    this.isDeleteConfirmationVisible = false;
    this.deleteConfirmation = {};
  }

  confirmDeleteUser() {
    console.log(this.deleteConfirmation.password);
    console.log(this.users.password); //null

    if (this.deleteConfirmation.password) {
      this.isDeleting = true;
      console.log('User deleted:', this.users.name);
      console.log(this.deleteConfirmation.password);

      this.userService.deleteUserConfirm(this.userID.id, this.deleteConfirmation.password).subscribe({
        next: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expiration');
          setTimeout(() => {
            this.isDeleting = false;
            this.isDeleteConfirmationVisible = false;
            console.log('User deleted:', this.users.name);
            this.resetForm();
            this.users = { id: 0, name: '', email: '', role: 'user', avatar: '' }; // Clear displayed user
            this.deleteConfirmation = {};
            this.route.navigate(['login']);
          }, 1000);
        }, error: (error) => {
          console.log("lỗi: " + error.error.error);
        }
      });
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng.');
      this.deleteConfirmation.password = ''; // Clear incorrect password
    }
  }

}
