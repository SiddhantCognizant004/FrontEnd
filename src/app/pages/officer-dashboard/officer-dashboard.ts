import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { FarmerService } from '../../services/farmer.service';
import { DocumentService } from '../../services/document.service';
import { DisbursementService } from '../../services/disbursement.service';
import { UserResponse } from '../../models/user.model';
import { FarmerDocument } from '../../models/document.model';
import { Disbursement } from '../../models/subsidy.model';
import { UserRolePipe, userRoleColor } from '../../pipes/user-role.pipe';
import { UserStatusPipe, userStatusColor } from '../../pipes/user-status.pipe';
import { VerificationStatusPipe, verificationStatusColor } from '../../pipes/verification-status.pipe';
import { DocTypePipe, docTypeColor } from '../../pipes/doc-type.pipe';
import { DisbursementStatusPipe, getDisbursementBadgeColor } from '../../pipes/disbursement-status.pipe';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, UserRolePipe, UserStatusPipe, VerificationStatusPipe, DocTypePipe, DisbursementStatusPipe],
  templateUrl: './officer-dashboard.html',
  styleUrl: './officer-dashboard.css'
})
export class OfficerDashboardPage implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private farmerService = inject(FarmerService);
  private documentService = inject(DocumentService);
  private disbursementService = inject(DisbursementService);

  activeTab = signal('home');
  users = signal<UserResponse[]>([]);
  farmers = signal<any[]>([]);
  documents = signal<FarmerDocument[]>([]);
  disbursements = signal<Disbursement[]>([]);
  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  confirmDocId = signal<number | null>(null);
  confirmAction = signal<'VERIFIED' | 'REJECTED' | null>(null);

  userRoleColor = userRoleColor;
  userStatusColor = userStatusColor;
  verificationStatusColor = verificationStatusColor;
  docTypeColor = docTypeColor;
  getDisbursementBadgeColor = getDisbursementBadgeColor;

  get pendingDocs() { return this.documents().filter(d => d.verificationStatus === 'PENDING').length; }
  get verifiedToday() {
    const today = new Date().toDateString();
    return this.documents().filter(d => d.verificationStatus === 'VERIFIED').length;
  }
  get pendingApprovals() { return this.disbursements().filter(d => d.disbursementStatus === 'PENDING').length; }

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({ next: (u) => this.users.set(u), error: () => {} });
    this.farmerService.getAllFarmers().subscribe({ next: (f) => this.farmers.set(f), error: () => {} });
    this.documentService.getAllDocuments().subscribe({ next: (d) => { this.documents.set(d); this.loading.set(false); }, error: () => this.loading.set(false) });
    this.disbursementService.getAll().subscribe({ next: (d) => this.disbursements.set(d), error: () => {} });
  }

  openConfirm(docId: number, action: 'VERIFIED' | 'REJECTED') {
    this.confirmDocId.set(docId);
    this.confirmAction.set(action);
  }

  confirmVerify() {
    const id = this.confirmDocId();
    const action = this.confirmAction();
    if (!id || !action) return;
    this.documentService.verifyDocument(id, action).subscribe({
      next: () => {
        this.successMsg.set(`Document ${action === 'VERIFIED' ? 'verified' : 'rejected'} successfully.`);
        this.confirmDocId.set(null);
        this.loadAll();
      },
      error: () => { this.errorMsg.set('Action failed. Please try again.'); this.confirmDocId.set(null); }
    });
  }

  reviewApplication(id: number, status: 'COMPLETED' | 'REJECTED') {
    this.disbursementService.review(id, status).subscribe({
      next: () => { this.successMsg.set(`Application ${status === 'COMPLETED' ? 'approved' : 'rejected'}.`); this.loadAll(); },
      error: (err: any) => this.errorMsg.set(err.error?.message || 'Action failed.')
    });
  }

  setTab(tab: string) { this.activeTab.set(tab); this.successMsg.set(''); this.errorMsg.set(''); }
  logout() { this.authService.logout(); }
}
