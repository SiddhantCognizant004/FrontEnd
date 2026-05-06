import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { FarmerService } from '../../services/farmer.service';
import { DocumentService } from '../../services/document.service';
import { SubsidyProgramService } from '../../services/subsidy-program.service';
import { DisbursementService } from '../../services/disbursement.service';
import { UserService } from '../../services/user.service';
import { FarmerResponse } from '../../models/farmer.model';
import { FarmerDocument } from '../../models/document.model';
import { SubsidyProgram, Disbursement, DisbursementDTO } from '../../models/subsidy.model';
import { UserResponse } from '../../models/user.model';
import { FarmerStatusPipe, farmerStatusColor } from '../../pipes/farmer-status.pipe';
import { VerificationStatusPipe, verificationStatusColor } from '../../pipes/verification-status.pipe';
import { DocTypePipe, docTypeColor } from '../../pipes/doc-type.pipe';
import { FarmerGenderPipe } from '../../pipes/farmer-gender.pipe';
import { SubsidyStatusPipe, getSubsidyBadgeColor } from '../../pipes/subsidy-status.pipe';
import { DisbursementStatusPipe, getDisbursementBadgeColor } from '../../pipes/disbursement-status.pipe';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FarmerStatusPipe, VerificationStatusPipe, DocTypePipe, FarmerGenderPipe, SubsidyStatusPipe, DisbursementStatusPipe],
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardPage implements OnInit {
  private authService = inject(AuthService);
  private farmerService = inject(FarmerService);
  private documentService = inject(DocumentService);
  private subsidyService = inject(SubsidyProgramService);
  private disbursementService = inject(DisbursementService);
  private userService = inject(UserService);

  activeTab = signal('home');
  farmer = signal<FarmerResponse | null>(null);
  documents = signal<FarmerDocument[]>([]);
  subsidyPrograms = signal<SubsidyProgram[]>([]);
  myApplications = signal<Disbursement[]>([]);
  loading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  // Profile edit
  editForm: any = {};
  editMode = signal(false);

  // Document upload
  idProofFile: File | null = null;
  landRecordFile: File | null = null;
  idProofName = signal('');
  landRecordName = signal('');

  // Subsidy apply
  applyProgramId = signal<number | null>(null);
  applyAmount = signal<number>(0);
  showApplyModal = signal(false);
  selectedProgram = signal<SubsidyProgram | null>(null);

  farmerStatusColor = farmerStatusColor;
  verificationStatusColor = verificationStatusColor;
  docTypeColor = docTypeColor;
  getSubsidyBadgeColor = getSubsidyBadgeColor;
  getDisbursementBadgeColor = getDisbursementBadgeColor;

  get email() { return this.authService.loggedInUser()?.email ?? ''; }

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    this.farmerService.getAllFarmers().subscribe({
      next: (farmers: any[]) => {
        const mine = farmers.find((f: any) => f.email === this.email || f.contactInfo === this.authService.loggedInUser()?.email);
        if (mine) {
          const fid = mine.farmerId ?? mine.id;
          this.farmerService.getFarmerById(fid).subscribe({
            next: (f) => {
              this.farmer.set(f);
              this.editForm = { name: f.name, phone: f.contactInfo, address: f.address, landDetails: f.landDetails, password: '' };
              this.loadDocuments(f.farmerId);
              this.loadSubsidies(f.farmerId);
            }
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadDocuments(farmerId: number) {
    this.documentService.getDocumentsByFarmer(farmerId).subscribe({
      next: (docs) => this.documents.set(docs),
      error: () => {}
    });
  }

  loadSubsidies(farmerId: number) {
    this.subsidyService.getAll().subscribe({ next: (p) => this.subsidyPrograms.set(p) });
    this.disbursementService.getByFarmer(farmerId).subscribe({ next: (d) => this.myApplications.set(d) });
  }

  get pendingDocs() { return this.documents().filter(d => d.verificationStatus === 'PENDING').length; }
  get verifiedDocs() { return this.documents().filter(d => d.verificationStatus === 'VERIFIED').length; }
  get hasRejectedDocs() { return this.documents().some(d => d.verificationStatus === 'REJECTED'); }

  canUpload() { return this.farmer()?.status !== 'REJECTED'; }

  onIdProofChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) { this.idProofFile = input.files[0]; this.idProofName.set(input.files[0].name); }
  }
  onLandRecordChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) { this.landRecordFile = input.files[0]; this.landRecordName.set(input.files[0].name); }
  }

  uploadDoc(file: File, docType: string) {
    const fid = this.farmer()?.farmerId;
    if (!fid || !file) return;
    this.documentService.uploadDocument(fid, file, docType).subscribe({
      next: () => { this.successMsg.set(`${docType === 'ID_PROOF' ? 'ID Proof' : 'Land Record'} uploaded!`); this.loadDocuments(fid); },
      error: () => this.errorMsg.set('Upload failed. Please try again.')
    });
  }

  saveProfile() {
    const f = this.farmer();
    if (!f) return;
    const dto = { name: this.editForm.name, email: this.email, phone: this.editForm.phone, password: this.editForm.password, address: this.editForm.address, landDetails: this.editForm.landDetails };
    this.userService.updateUser(f.userId, dto).subscribe({
      next: () => { this.successMsg.set('Profile updated!'); this.editMode.set(false); this.loadAll(); },
      error: () => this.errorMsg.set('Update failed.')
    });
  }

  openApply(program: SubsidyProgram) {
    this.selectedProgram.set(program);
    this.applyAmount.set(0);
    this.showApplyModal.set(true);
  }

  alreadyApplied(programId: number): boolean {
    return this.myApplications().some(d => d.subsidyProgram?.programID === programId);
  }

  submitApplication() {
    const fid = this.farmer()?.farmerId;
    const prog = this.selectedProgram();
    if (!fid || !prog) return;
    const dto: DisbursementDTO = { farmerId: fid, programId: prog.programID, disbursementAmount: this.applyAmount() };
    this.disbursementService.apply(dto).subscribe({
      next: () => {
        this.showApplyModal.set(false);
        this.successMsg.set('Application submitted!');
        this.loadSubsidies(fid);
      },
      error: (err: any) => {
        this.showApplyModal.set(false);
        this.errorMsg.set(err.error?.message || 'Application failed.');
      }
    });
  }

  getStatusStep(status: string): number {
    const steps: Record<string, number> = { PENDING: 2, IN_PROGRESS: 3, COMPLETED: 4, REJECTED: 4 };
    return steps[status] ?? 1;
  }

  setTab(tab: string) { this.activeTab.set(tab); this.errorMsg.set(''); this.successMsg.set(''); }
  logout() { this.authService.logout(); }
}
