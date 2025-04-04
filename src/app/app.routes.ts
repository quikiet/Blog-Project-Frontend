import { Routes } from '@angular/router';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { RegisterComponent } from './components/both/register/register.component';
import { CategoryComponent } from './components/admin/category/category.component';
import { SettingComponent } from './components/admin/setting/setting.component';
import { PostsComponent } from './components/admin/posts/posts.component';
import { LoginComponent } from './components/both/login/login.component';
import { HomeComponent } from './components/customer/home/home.component';
import { roleGuard } from './guard/role.guard';
import { isLoggedGuard } from './guard/is-logged.guard';
import { PostListComponent } from './components/admin/posts/post-list/post-list.component';
import { PostDetailComponent } from './components/admin/posts/post-detail/post-detail.component';
import { UsersComponent } from './components/admin/users/users.component';
import { AuthorsComponent } from './components/admin/authors/authors.component';
import { TagsComponent } from './components/admin/tags/tags.component';
import { outDateLoginGuard } from './guard/out-date-login.guard';
import { WebsiteSettingsComponent } from './components/admin/website-settings/website-settings.component';
import { UserStatisticsComponent } from './components/admin/user-statistics/user-statistics.component';
import { RefuseReasonsComponent } from './components/admin/refuse-reasons/refuse-reasons.component';
import { HomeContentComponent } from './components/customer/home/home-content/home-content.component';
import { UserPostsComponent } from './components/customer/home/user-posts/user-posts.component';
import { PostDetailUserComponent } from './components/customer/post-detail-user/post-detail-user.component';
import { filter } from 'rxjs';

export const routes: Routes = [

    { path: 'register', component: RegisterComponent, canActivate: [isLoggedGuard] },
    { path: 'login', component: LoginComponent, canActivate: [isLoggedGuard] },
    {
        path: '', component: HomeComponent, canActivate: [outDateLoginGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./components/customer/home/home-content/home-content.component').then(m => m.HomeContentComponent)
            },
            { path: 'user-posts', component: UserPostsComponent, canActivate: [roleGuard], data: { role: 'author' } },
            { path: 'posts', component: PostsComponent, canActivate: [roleGuard], data: { role: 'author' } },
        ]
    },

    {
        path: 'admin', component: DashboardComponent,
        canActivate: [roleGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'settings', pathMatch: 'full' },
            { path: 'settings', component: SettingComponent },
            { path: 'web-settings', component: WebsiteSettingsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'refuse-reasons', component: RefuseReasonsComponent },
            { path: 'posts', component: PostsComponent },
            { path: 'list-post/all', component: PostListComponent, data: { filter: 'all' } },
            { path: 'list-post/pending', component: PostListComponent, data: { filter: 'pending' } },
            { path: 'authors', component: AuthorsComponent },
            { path: 'tags/:slug', component: TagsComponent },
            { path: 'user-statistics', component: UserStatisticsComponent },
        ]
    },
    { path: 'post-detail/:slug', component: PostDetailComponent },
    { path: 'post-detail-user/:slug', component: PostDetailUserComponent },

    { path: "**", redirectTo: "", pathMatch: 'full' },

];
