import { Routes } from '@angular/router';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { RegisterComponent } from './components/both/register/register.component';
import { CategoryComponent } from './components/admin/category/category.component';
import { SettingComponent } from './components/admin/setting/setting.component';
import { PostsComponent } from './components/admin/posts/posts.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin', component: DashboardComponent, children: [
            { path: '', redirectTo: 'settings', pathMatch: 'full' },
            { path: 'settings', component: SettingComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'posts', component: PostsComponent },
        ]
    },
];
