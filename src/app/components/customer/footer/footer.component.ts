import { Component, OnInit } from '@angular/core';
import { WebsettingService } from '../../../services/websetting/websetting.service';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../../admin/posts/post-list/post-list.component';

interface FooterLink {
  text: string;
  url: string;
}

interface FooterSettings {
  copyright: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, PostListComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  footerSettings: FooterSettings = {
    copyright: '© 2024 Default Copyright',
    links: []
  };
  isLoading: boolean = true;

  constructor(
    private websiteSettingsService: WebsettingService
  ) { }

  ngOnInit(): void {
    this.loadFooterSettings();
  }

  private loadFooterSettings(): void {
    this.websiteSettingsService.getSettings().subscribe({
      next: (res: any) => {
        this.footerSettings = {
          copyright: res.data?.footer_copyright || '© 2024 Default Copyright',
          links: res.data?.footer_links || []
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Footer settings error:', error);
        this.isLoading = false;
      }
    });
  }

}

