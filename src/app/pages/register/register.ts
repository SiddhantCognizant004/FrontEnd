import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { FarmerService } from '../../services/farmer.service';
import { DocumentService } from '../../services/document.service';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterPage {
  private authService = inject(AuthService);
  private farmerService = inject(FarmerService);
  private documentService = inject(DocumentService);
  private router = inject(Router);
  themeService = inject(ThemeService);

  step = signal(1); // 1 = account details, 2 = farmer details + docs, 3 = success
  loading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  selectedRole = signal('FARMER');

  formData = {
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    dob: '', gender: 'MALE', address: '', landDetails: ''
  };

  idProofFile: File | null = null;
  landRecordFile: File | null = null;
  idProofName = signal('');
  landRecordName = signal('');

  registeredUserId = signal<number | null>(null);
  registeredFarmerId = signal<number | null>(null);

  onRoleChange(role: string) {
    this.selectedRole.set(role);
    this.themeService.themeChange(role);
  }

  onIdProofChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.idProofFile = input.files[0];
      this.idProofName.set(input.files[0].name);
    }
  }

  onLandRecordChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.landRecordFile = input.files[0];
      this.landRecordName.set(input.files[0].name);
    }
  }

  // Step 1: Register user account
  onRegisterAccount() {
    this.errorMsg.set('');
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMsg.set('Passwords do not match!');
      return;
    }
    if (this.formData.phone.length !== 10) {
      this.errorMsg.set('Phone number must be exactly 10 digits.');
      return;
    }

    const payload: any = {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      password: this.formData.password,
      role: this.selectedRole()
    };

    if (this.selectedRole() === 'FARMER') {
      payload.dob = this.formData.dob;
      payload.gender = this.formData.gender;
      payload.address = this.formData.address;
      payload.landDetails = this.formData.landDetails;
    }

    this.loading.set(true);
    this.authService.onRegister(payload).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        if (this.selectedRole() === 'FARMER') {
          // Login to get token, then get farmer profile for upload
          this.authService.onLogin({ email: this.formData.email, password: this.formData.password }).subscribe({
            next: () => {
              // Get farmer profile to get farmerId
              this.farmerService.getAllFarmers().subscribe({
                next: (farmers: any[]) => {
                  const loggedUser = this.authService.loggedInUser();
                  const myFarmer = farmers.find((f: any) =>
                    f.email === this.formData.email || f.contactInfo === this.formData.phone
                  );
                  if (myFarmer) {
                    this.registeredFarmerId.set(myFarmer.farmerId || myFarmer.id);
                    this.step.set(2);
                  } else {
                    this.step.set(3);
                    this.successMsg.set('Account created successfully! You can upload documents after logging in.');
                  }
                },
                error: () => { this.step.set(3); this.successMsg.set('Account created! Please login.'); }
              });
            },
            error: () => { this.step.set(3); this.successMsg.set('Account created! Please login.'); }
          });
        } else {
          this.step.set(3);
          this.successMsg.set('Account created successfully! Please login.');
        }
      },
      error: (err: any) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.errorMsg.set(err.error?.message || 'Email or phone already registered.');
        } else {
          this.errorMsg.set('Registration failed. Please try again.');
        }
      }
    });
  }

  // Step 2: Upload documents
  onUploadDocuments() {
    const fid = this.registeredFarmerId();
    if (!fid) { this.errorMsg.set('Farmer ID not found.'); return; }
    if (!this.idProofFile || !this.landRecordFile) {
      this.errorMsg.set('Please select both ID Proof and Land Record documents.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    this.documentService.uploadDocument(fid, this.idProofFile, 'ID_PROOF').subscribe({
      next: () => {
        this.documentService.uploadDocument(fid!, this.landRecordFile!, 'LAND_RECORD').subscribe({
          next: () => {
            this.loading.set(false);
            this.step.set(3);
            this.successMsg.set('Registration complete! Documents uploaded successfully. Please login.');
            this.authService.logout(false);
          },
          error: () => {
            this.loading.set(false);
            this.errorMsg.set('Land Record upload failed. Please upload it after login from your dashboard.');
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('ID Proof upload failed. Please upload documents after login from your dashboard.');
      }
    });
  }

  skipUpload() {
    this.authService.logout(false);
    this.step.set(3);
    this.successMsg.set('Account created! You can upload documents from your dashboard after login.');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
