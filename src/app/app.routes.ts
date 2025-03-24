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

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'users', component: UsersComponent },
    { path: 'register', component: RegisterComponent, canActivate: [isLoggedGuard] },
    { path: 'login', component: LoginComponent, canActivate: [isLoggedGuard] },
    {
        path: 'admin', component: DashboardComponent,
        canActivate: [roleGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'settings', pathMatch: 'full' },
            { path: 'settings', component: SettingComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'posts', component: PostsComponent },
            { path: 'list-post', component: PostListComponent },
            { path: 'authors', component: AuthorsComponent },
            { path: 'tags/:slug', component: TagsComponent },
        ]
    },
    { path: 'post-detail/:slug', component: PostDetailComponent },
    { path: "**", component: HomeComponent, pathMatch: 'full' },

];
