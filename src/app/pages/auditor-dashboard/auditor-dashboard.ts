import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { AuditLogService } from '../../services/audit-log.service';
import { UserResponse } from '../../models/user.model';
import { AuditLog } from '../../models/audit-log.model';
import { UserRolePipe, userRoleColor } from '../../pipes/user-role.pipe';
import { UserStatusPipe, userStatusColor } from '../../pipes/user-status.pipe';

@Component({
  selector: 'app-auditor-dashboard',
  standalone: true,
  imports: [CommonModule, UserRolePipe, UserStatusPipe],
  templateUrl: './auditor-dashboard.html',
  styleUrl: './auditor-dashboard.css'
})
export class AuditorDashboardPage implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private auditLogService = inject(AuditLogService);

  activeTab = signal('home');
  users = signal<UserResponse[]>([]);
  logs = signal<AuditLog[]>([]);
  page = signal(0);
  totalPages = signal(0);

  userRoleColor = userRoleColor;
  userStatusColor = userStatusColor;

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

  truncate(s: string, n = 60) { return s?.length > n ? s.substring(0, n) + '...' : s; }

  getActionColor(action: string): string {
    if (action === 'LOGIN') return '#2196F3';
    if (action?.includes('UPDATE')) return '#FF9800';
    if (action?.includes('DELETE')) return '#F44336';
    return '#607D8B';
  }

  exportLogs() {
    const rows = [['ID', 'Action', 'Performed By', 'Role', 'Details', 'Timestamp'],
      ...this.logs().map(l => [l.id, l.action, l.performedBy, l.role, l.details, l.timestamp])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit-logs.csv'; a.click();
  }

  setTab(tab: string) { this.activeTab.set(tab); }
  logout() { this.authService.logout(); }
}
