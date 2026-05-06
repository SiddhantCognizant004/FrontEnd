import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { UserService } from '../../../services/user.service';
import { AuditLogService } from '../../../services/audit-log.service';
import { UserResponse, UserUpdateRequest } from '../../../models/user.model';
import { AuditLog } from '../../../models/audit-log.model';
import { UserRolePipe, userRoleColor } from '../../../pipes/user-role.pipe';
import { UserStatusPipe, userStatusColor } from '../../../pipes/user-status.pipe';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule, UserRolePipe, UserStatusPipe],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHomePage implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private auditLogService = inject(AuditLogService);

  activeTab = signal('home');
  users = signal<UserResponse[]>([]);
  logs = signal<AuditLog[]>([]);
  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  page = signal(0);
  totalPages = signal(0);

  editUser = signal<UserResponse | null>(null);
  editForm: any = {};

  userRoleColor = userRoleColor;
  userStatusColor = userStatusColor;

  get activeUsers() { return this.users().filter(u => u.status === 'ACTIVE').length; }
  get inactiveUsers() { return this.users().filter(u => u.status !== 'ACTIVE').length; }
  get myEmail() { return this.authService.loggedInUser()?.email ?? ''; }

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.userService.getAllUsers().subscribe({ next: u => this.users.set(u), error: () => {} });
    this.loadLogs();
  }

  loadLogs() {
    this.auditLogService.getLogs(this.page(), 10).subscribe({
      next: r => { this.logs.set(r.content); this.totalPages.set(r.totalPages); },
      error: () => {}
    });
  }

  prevPage() { if (this.page() > 0) { this.page.update(p => p - 1); this.loadLogs(); } }
  nextPage() { if (this.page() < this.totalPages() - 1) { this.page.update(p => p + 1); this.loadLogs(); } }

  openEdit(user: UserResponse) {
    this.editUser.set(user);
    this.editForm = { name: user.name, email: user.email, phone: user.phone, password: '' };
  }

  saveUser() {
    const u = this.editUser();
    if (!u) return;
    const dto: UserUpdateRequest = {
      name: this.editForm.name,
      email: this.editForm.email,
      phone: this.editForm.phone,
      password: this.editForm.password
    };
    this.userService.updateUser(u.id, dto).subscribe({
      next: () => { this.successMsg.set('User updated successfully!'); this.editUser.set(null); this.loadAll(); },
      error: () => this.errorMsg.set('Update failed. Please try again.')
    });
  }

  deactivate(user: UserResponse) {
    if (user.status === 'INACTIVE') return;
    if (user.email === this.myEmail) { this.errorMsg.set('You cannot deactivate your own account.'); return; }
    if (!confirm(`Deactivate ${user.name}?`)) return;
    this.userService.deactivateUser(user.id).subscribe({
      next: () => { this.successMsg.set('User deactivated.'); this.loadAll(); },
      error: () => this.errorMsg.set('Deactivation failed.')
    });
  }

  truncate(s: string, n = 60) { return s?.length > n ? s.substring(0, n) + '...' : s; }
  getActionColor(action: string): string {
    if (action === 'LOGIN') return '#2196F3';
    if (action?.includes('UPDATE')) return '#FF9800';
    if (action?.includes('DELETE')) return '#F44336';
    return '#607D8B';
  }

  setTab(tab: string) { this.activeTab.set(tab); this.successMsg.set(''); this.errorMsg.set(''); }
  logout() { this.authService.logout(); }
}
