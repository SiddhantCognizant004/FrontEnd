import { DocType, VerificationStatus } from './enum.model';

export interface FarmerDocument {
  id: number;
  docType: DocType;
  fileName: string;
  filePath: string;
  verificationStatus: VerificationStatus;
}
