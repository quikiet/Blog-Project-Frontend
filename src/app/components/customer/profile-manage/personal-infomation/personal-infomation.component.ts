import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterOutlet } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Drawer } from 'primeng/drawer';
import { AutoFocus } from 'primeng/autofocus';
import { Avatar } from 'primeng/avatar';
import { Ripple } from 'primeng/ripple';
import { UserService } from '../../../../services/users/user.service';
import { Skeleton } from 'primeng/skeleton';

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar?: string;
}

interface DeleteConfirmation {
  password?: string;
}

interface ChangePasswordForm {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

@Component({
  selector: 'app-personal-infomation',
  standalone: true,
  imports: [Skeleton, AutoFocus, FormsModule, CommonModule, Dialog, Button, InputGroup, InputGroupAddonModule],
  templateUrl: './personal-infomation.component.html',
  styleUrl: './personal-infomation.component.css'
})
export class PersonalInfomationComponent implements OnInit {
  userID: any = {};
  users: any = {};
  isLoading = true;
  isDeleting: boolean = false;
  isEditting: boolean = false;
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
    avatar: '',
    phone: '',
    address: '',
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
    this.isLoading = true;
    const userData = localStorage.getItem('user');
    this.userID = userData ? JSON.parse(userData) : null;
    this.userService.getCurrentUser(this.userID.id).subscribe((data) => {
      this.users = data.user;
      this.isLoading = false;
      // console.log('user' + this.users.address);
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

    const isNameValid = this.formData.name.trim() !== '';
    const isEmailValid = this.formData.email.trim() !== '';
    const isPasswordValid = this.formData.password.trim() !== '';

    return isNameValid && isEmailValid && isPasswordValid;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  updateUser() {
    // console.log('updated');
    // console.log(this.formData);
    this.isLoading = true;

    this.userService.updateUser(this.formData, this.formData.id!).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
        this.toastr.success('Cập nhật người dùng thành công', 'Thành công');
        this.isLoading = false;
      },
      error: (error: any) => {
        if (error.status === 409) {
          this.isLoading = false;
          this.toastr.error('Email đã tồn tại trong hệ thống', 'Lỗi');
        } else if (error.status === 402) {
          this.isLoading = false;
          this.toastr.error(error.errors, 'Lỗi');
        } else {
          this.isLoading = false;
          this.toastr.error(error.error.error, 'Lỗi');
        }
      },
    });
    this.isLoading = false;
    this.isEditting = false;
  }

  private handleError(error: any, action: string) {
    // console.error(`Lỗi khi ${action} người dùng:`, error);

    if (error.status === 409) {
      this.toastr.error('Email đã tồn tại trong hệ thống', 'Lỗi');
    } else if (error.error?.message) {
      this.toastr.error(error.error.message, 'Lỗi');
    } else {
      this.toastr.error(`Đã xảy ra lỗi khi ${action} người dùng`, 'Lỗi');
    }
  }

  editUser(user: any) {
    this.isEditting = true;
    this.formData = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      avatar: user.avatar || '',
      address: user.address || '',
      phone: user.phone || '',
    };
  }

  resetForm() {
    this.formData = {
      id: null,
      name: '',
      email: '',
      password: '',
      avatar: '',
      phone: '',
      address: '',
    };
    this.isEditting = false;
  }

  initiateDelete() {
    this.isDeleteConfirmationVisible = true;
    this.deleteConfirmation = { password: '' };
  }

  cancelDelete() {
    this.isDeleteConfirmationVisible = false;
    this.deleteConfirmation = {};
  }

  confirmDeleteUser() {
    // console.log(this.deleteConfirmation.password);
    // console.log(this.users.password); //null

    if (this.deleteConfirmation.password) {
      this.isDeleting = true;
      // console.log('User deleted:', this.users.name);
      // console.log(this.deleteConfirmation.password);

      this.userService.deleteUserConfirm(this.userID.id, this.deleteConfirmation.password).subscribe({
        next: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expiration');
          setTimeout(() => {
            this.isDeleting = false;
            this.isDeleteConfirmationVisible = false;
            // console.log('User deleted:', this.users.name);
            this.resetForm();
            this.deleteConfirmation = {};
            this.route.navigate(['login']);
          }, 1000);
        }, error: (error) => {
          console.log("lỗi: " + error.error.error);
        }
      });
    } else {
      alert('Mật khẩu không đúng.');
      this.deleteConfirmation.password = ''; // Clear incorrect password
    }
  }

}
