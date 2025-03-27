import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebsettingService } from '../../../services/websetting/websetting.service';

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterLink {
  text: string;
  url: string;
}

interface WebsiteSettings {
  site_title: string;
  site_slogan: string;
  logo_url: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  social_links: SocialLink[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  footer_copyright: string;
  footer_links: FooterLink[];
}

@Component({
  selector: 'app-website-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './website-settings.component.html',
  styleUrl: './website-settings.component.css'
})
export class WebsiteSettingsComponent implements OnInit {
  tabs = [
    { id: 'general', name: 'Thông tin chung' },
    { id: 'contact', name: 'Liên hệ' },
    { id: 'seo', name: 'SEO' },
    { id: 'footer', name: 'Footer' },
  ];
  activeTab = 'general';
  settings: WebsiteSettings = {
    site_title: '',
    site_slogan: '',
    logo_url: '',
    contact_address: '',
    contact_phone: '',
    contact_email: '',
    social_links: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    footer_copyright: '',
    footer_links: [],
  };
  isSaving = false;

  constructor(
    private websiteSettingsService: WebsettingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.websiteSettingsService.getSettings().subscribe({
      next: (settings: any) => {
        this.settings = settings.data;
        console.log(this.settings);
        // Khởi tạo mảng nếu null
        if (!this.settings.social_links) this.settings.social_links = [];
        if (!this.settings.footer_links) this.settings.footer_links = [];
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Tải cài đặt thất bại');
      },
    });
  }

  addSocialLink(): void {
    this.settings.social_links.push({ platform: 'facebook', url: '' });
  }

  removeSocialLink(link: SocialLink): void {
    this.settings.social_links = this.settings.social_links.filter(
      (l) => l !== link
    );
  }

  addFooterLink(): void {
    this.settings.footer_links.push({ text: '', url: '' });
  }

  removeFooterLink(link: FooterLink): void {
    this.settings.footer_links = this.settings.footer_links.filter(
      (l) => l !== link
    );
  }

  saveSettings(): void {
    this.isSaving = true;
    this.websiteSettingsService.updateSettings(this.settings).subscribe({
      next: () => {
        this.toastr.success('Lưu cài đặt thành công');
        this.isSaving = false;
      },
      error: (err) => {
        this.toastr.error('Lưu cài đặt thất bại');
        this.isSaving = false;
      },
    });
  }

  resetSettings(): void {
    if (confirm('Bạn có chắc muốn đặt lại tất cả thay đổi?')) {
      this.loadSettings();
    }
  }
}
