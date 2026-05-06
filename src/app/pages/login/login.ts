import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WebNameElement } from '../../elements/web-name';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-login',
  imports: [RouterLink, WebNameElement, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  themeService = inject(ThemeService);

  account_method = signal('login');
  errorMsg = signal('');
  loading = signal(false);

  constructor() {
    this.themeService.themeChange('FARMER');
  }

  role_selected = computed(() => this.themeService.themeRole());

  formData = {
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  };

  private readonly roleRoutes: Record<string, string> = {
    FARMER: '/dashboard/farmer/home',
    OFFICER: '/dashboard/officer/home',
    MANAGER: '/dashboard/manager/home',
    ADMIN: '/dashboard/admin/home',
    AUDITOR: '/dashboard/auditor/home',
    TRADER: '/dashboard/trader',
    COMPLIANCE: '/dashboard/trader'
  };

  onSubmit() {
    this.errorMsg.set('');
    this.loading.set(true);

    if (this.account_method() === 'login') {
      this.authService.onLogin({
        email: this.formData.email,
        password: this.formData.password
      }).subscribe({
        next: () => {
          this.loading.set(false);
          const loggedUser = this.authService.loggedInUser();
          if (loggedUser) {
            this.themeService.themeChange(loggedUser.role);
            const route = this.roleRoutes[loggedUser.role] ?? '/dashboard';
            this.router.navigate([route]);
          }
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 409) {
            this.errorMsg.set(err.error?.message || 'Incorrect email or password.');
          } else if (err.status === 404) {
            this.errorMsg.set('User account not found.');
          } else {
            this.errorMsg.set('An unexpected error occurred. Please try again.');
          }
        }
      });
    } else {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMsg.set('Passwords do not match!');
        this.loading.set(false);
        return;
      }
      const payload = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        password: this.formData.password,
        role: this.themeService.role_selected()
      };
      this.authService.onRegister(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.errorMsg.set('');
          this.onAccountMethodChange('login');
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err.error?.message || 'Registration failed. Please try again.');
        }
      });
    }
  }

  onAccountMethodChange(newMethod: string) {
    this.account_method.set(newMethod);
    this.errorMsg.set('');
    this.onRoleChange('FARMER');
  }

  onRoleChange(newRole: string) {
    this.themeService.themeChange(newRole);
  }
}
