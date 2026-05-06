import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-dashboard-redirect',
  template: '',
  standalone: true
})
export class DashboardRedirectComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    const role = this.authService.loggedInUser()?.role;

    const routes: Record<string, string> = {
      FARMER: '/dashboard/farmer/home',
      OFFICER: '/dashboard/officer/home',
      MANAGER: '/dashboard/manager/home',
      ADMIN: '/dashboard/admin/home',
      AUDITOR: '/dashboard/auditor/home',
      TRADER: '/dashboard/trader',
      COMPLIANCE: '/dashboard/trader'
    };

    if (role && routes[role]) {
      this.router.navigate([routes[role]]);
    } else {
      this.router.navigate(['/welcome']);
    }
  }
}
