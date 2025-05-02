import { Routes } from '@angular/router';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
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
import { PageNotFould404Component } from './shared/page-not-fould-404/page-not-fould-404.component';
import { ChartsComponent } from './components/admin/setting/charts/charts.component';
import { ProfileManageComponent } from './components/customer/profile-manage/profile-manage.component';
import { SearchResultsComponent } from './components/customer/search-results/search-results.component';
import { CategoryPostsComponent } from './components/customer/category-posts/category-posts.component';
import { PersonalInfomationComponent } from './components/customer/profile-manage/personal-infomation/personal-infomation.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent, canActivate: [isLoggedGuard] },
    {
        path: 'profile', component: ProfileManageComponent, canActivate: [outDateLoginGuard],
        children: [
            { path: '', redirectTo: 'thong-tin-ca-nhan', pathMatch: 'full' },
            { path: 'thong-tin-ca-nhan', component: PersonalInfomationComponent },
            { path: 'user-posts', component: UserPostsComponent, canActivate: [roleGuard], data: { role: 'author' } },
            { path: 'posts', component: PostsComponent, canActivate: [roleGuard], data: { role: 'author' } },

        ]
    },
    {
        path: '', component: HomeComponent, canActivate: [outDateLoginGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./components/customer/home/home-content/home-content.component').then(m => m.HomeContentComponent)
            },
            {
                path: 'category/:slug',
                component: CategoryPostsComponent
            },
            {
                path: 'search',
                component: SearchResultsComponent
            },
        ]
    },

    { path: 'post-detail-user/:slug', component: PostDetailUserComponent },


    {
        path: 'admin', component: DashboardComponent,
        canActivate: [roleGuard, outDateLoginGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'settings', pathMatch: 'full' },
            { path: 'settings', component: SettingComponent },
            { path: 'web-settings', component: WebsiteSettingsComponent },
            { path: 'scheduled', component: ChartsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'refuse-reasons', component: RefuseReasonsComponent },
            { path: 'posts', component: PostsComponent },
            { path: 'list-post/all', component: PostListComponent, data: { filter: 'all' } },
            { path: 'list-post/pending', component: PostListComponent, data: { filter: 'pending' } },
            { path: 'authors', component: AuthorsComponent },
            { path: 'tags/:slug', component: TagsComponent },
            { path: 'user-statistics', component: UserStatisticsComponent },
            { path: "**", component: PageNotFould404Component },
        ]
    },
    { path: 'post-detail/:slug', component: PostDetailComponent },
    { path: "**", component: PageNotFould404Component },


    { path: '404', component: PageNotFould404Component },

];
