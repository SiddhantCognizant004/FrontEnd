import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { DocumentService } from '../../services/document.service';
import { AuditLogService } from '../../services/audit-log.service';
import { SubsidyProgramService } from '../../services/subsidy-program.service';
import { UserResponse, UserUpdateRequest } from '../../models/user.model';
import { FarmerDocument } from '../../models/document.model';
import { AuditLog } from '../../models/audit-log.model';
import { SubsidyProgram } from '../../models/subsidy.model';
import { UserRolePipe, userRoleColor } from '../../pipes/user-role.pipe';
import { UserStatusPipe, userStatusColor } from '../../pipes/user-status.pipe';
import { DocTypePipe, docTypeColor } from '../../pipes/doc-type.pipe';
import { VerificationStatusPipe, verificationStatusColor } from '../../pipes/verification-status.pipe';
import { SubsidyStatusPipe, getSubsidyBadgeColor } from '../../pipes/subsidy-status.pipe';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, UserRolePipe, UserStatusPipe, DocTypePipe, VerificationStatusPipe, SubsidyStatusPipe],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css'
})
export class ManagerDashboardPage implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private documentService = inject(DocumentService);
  private auditLogService = inject(AuditLogService);
  private subsidyService = inject(SubsidyProgramService);

  activeTab = signal('home');
  users = signal<UserResponse[]>([]);
  documents = signal<FarmerDocument[]>([]);
  logs = signal<AuditLog[]>([]);
  programs = signal<SubsidyProgram[]>([]);
  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  page = signal(0); totalPages = signal(0);

  editUser = signal<UserResponse | null>(null);
  editForm: any = {};

  // Subsidy form
  showSubsidyForm = signal(false);
  editingProgram = signal<SubsidyProgram | null>(null);
  subsidyForm: any = { title: '', description: '', allottedBudget: 0, startDate: '', endDate: '', subsidyStatus: 'PENDING' };

  userRoleColor = userRoleColor; userStatusColor = userStatusColor;
  docTypeColor = docTypeColor; verificationStatusColor = verificationStatusColor;
  getSubsidyBadgeColor = getSubsidyBadgeColor;

  get activeUsers() { return this.users().filter(u => u.status === 'ACTIVE').length; }
  get totalBudget() { return this.programs().reduce((s, p) => s + (p.allottedBudget ?? 0), 0); }
  get activePrograms() { return this.programs().filter(p => p.subsidyStatus === 'PENDING').length; }

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.userService.getAllUsers().subscribe({ next: u => this.users.set(u) });
    this.documentService.getAllDocuments().subscribe({ next: d => this.documents.set(d) });
    this.subsidyService.getAll().subscribe({ next: p => this.programs.set(p) });
    this.loadLogs();
  }

  loadLogs() {
    this.auditLogService.getLogs(this.page(), 10).subscribe({
      next: r => { this.logs.set(r.content); this.totalPages.set(r.totalPages); }
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
    const dto: UserUpdateRequest = { name: this.editForm.name, email: this.editForm.email, phone: this.editForm.phone, password: this.editForm.password };
    this.userService.updateUser(u.id, dto).subscribe({
      next: () => { this.successMsg.set('User updated!'); this.editUser.set(null); this.loadAll(); },
      error: () => this.errorMsg.set('Update failed.')
    });
  }

  deactivate(user: UserResponse) {
    if (user.status === 'INACTIVE') return;
    this.userService.deactivateUser(user.id).subscribe({
      next: () => { this.successMsg.set('User deactivated.'); this.loadAll(); },
      error: () => this.errorMsg.set('Deactivation failed.')
    });
  }

  openCreateSubsidy() {
    this.editingProgram.set(null);
    this.subsidyForm = { title: '', description: '', allottedBudget: 0, startDate: '', endDate: '', subsidyStatus: 'VALIDATED' };
    this.showSubsidyForm.set(true);
  }

  openEditSubsidy(p: SubsidyProgram) {
    this.editingProgram.set(p);
    this.subsidyForm = { title: p.title, description: p.description, allottedBudget: p.allottedBudget, startDate: p.startDate, endDate: p.endDate, subsidyStatus: p.subsidyStatus };
    this.showSubsidyForm.set(true);
  }

  saveSubsidy() {
    const ep = this.editingProgram();
    if (ep) {
      this.subsidyService.update(ep.programID, { ...ep, ...this.subsidyForm }).subscribe({
        next: () => { this.successMsg.set('Program updated!'); this.showSubsidyForm.set(false); this.loadAll(); },
        error: () => this.errorMsg.set('Update failed.')
      });
    } else {
      this.subsidyService.create(this.subsidyForm).subscribe({
        next: () => { this.successMsg.set('Program created!'); this.showSubsidyForm.set(false); this.loadAll(); },
        error: () => this.errorMsg.set('Create failed.')
      });
    }
  }

  deleteSubsidy(id: number) {
    if (!confirm('Delete this program?')) return;
    this.subsidyService.delete(id).subscribe({
      next: () => { this.successMsg.set('Program deleted.'); this.loadAll(); },
      error: () => this.errorMsg.set('Delete failed.')
    });
  }

  truncate(s: string, n = 60) { return s?.length > n ? s.substring(0, n) + '...' : s; }
  setTab(tab: string) { this.activeTab.set(tab); this.successMsg.set(''); this.errorMsg.set(''); }
  logout() { this.authService.logout(); }
}
