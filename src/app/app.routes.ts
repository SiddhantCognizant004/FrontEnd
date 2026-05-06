import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminHomePage } from './pages/admin-dashboard/admin-home/admin-home';
import { AdminReports } from './pages/admin-dashboard/admin-reports/admin-reports';
import { AdminNotifications } from './pages/admin-dashboard/admin-notifications/admin-notifications';
import { TraderPage } from './pages/trader/trader';
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';
import { RegisterPage } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { MarketOfficer } from './pages/market-officer/market-officer';
import { DashboardRedirectComponent } from './guards/dashboard-redirect';
import { guestGuard } from './guards/guest-guard';
import { roleGuard } from './guards/role-guard';
import { FarmerDashboardPage } from './pages/farmer-dashboard/farmer-dashboard';
import { OfficerDashboardPage } from './pages/officer-dashboard/officer-dashboard';
import { ManagerDashboardPage } from './pages/manager-dashboard/manager-dashboard';
import { AuditorDashboardPage } from './pages/auditor-dashboard/auditor-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'welcome', component: WelcomePage },
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
      { path: '', pathMatch: 'full', redirectTo: '/welcome' }
    ]
  },

  // PROTECTED PAGES
  {
    path: 'dashboard',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: 'home', component: AdminHomePage },
          { path: 'reports', component: AdminReports },
          { path: 'notifications', component: AdminNotifications },
          { path: '', pathMatch: 'full', redirectTo: 'home' }
        ]
      },
      {
        path: 'farmer',
        canActivate: [roleGuard],
        data: { roles: ['FARMER'] },
        children: [
          { path: 'home', component: FarmerDashboardPage },
          { path: 'profile', component: FarmerDashboardPage },
          { path: 'documents', component: FarmerDashboardPage },
          { path: 'subsidies', component: FarmerDashboardPage },
          { path: 'applications', component: FarmerDashboardPage },
          { path: '', pathMatch: 'full', redirectTo: 'home' }
        ]
      },
      {
        path: 'officer',
        canActivate: [roleGuard],
        data: { roles: ['OFFICER'] },
        children: [
          { path: 'home', component: OfficerDashboardPage },
          { path: 'users', component: OfficerDashboardPage },
          { path: 'documents', component: OfficerDashboardPage },
          { path: 'subsidies', component: OfficerDashboardPage },
          { path: '', pathMatch: 'full', redirectTo: 'home' }
        ]
      },
      {
        path: 'manager',
        canActivate: [roleGuard],
        data: { roles: ['MANAGER', 'ADMIN'] },
        children: [
          { path: 'home', component: ManagerDashboardPage },
          { path: 'users', component: ManagerDashboardPage },
          { path: 'documents', component: ManagerDashboardPage },
          { path: 'subsidies', component: ManagerDashboardPage },
          { path: 'logs', component: ManagerDashboardPage },
          { path: '', pathMatch: 'full', redirectTo: 'home' }
        ]
      },
      {
        path: 'auditor',
        canActivate: [roleGuard],
        data: { roles: ['AUDITOR'] },
        children: [
          { path: 'home', component: AuditorDashboardPage },
          { path: 'users', component: AuditorDashboardPage },
          { path: 'logs', component: AuditorDashboardPage },
          { path: '', pathMatch: 'full', redirectTo: 'home' }
        ]
      },
      { path: 'trader', component: TraderPage },
      { path: 'market-officer', component: MarketOfficer },
      { path: '', pathMatch: 'full', component: DashboardRedirectComponent }
    ]
  }
];
