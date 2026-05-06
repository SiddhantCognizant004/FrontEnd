import { FarmerStatus, FarmerGender, DocType, VerificationStatus } from './enum.model';

export interface FarmerResponse {
  farmerId: number;
  userId: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  contactInfo: string;
  landDetails: string;
  status: string;
}

export interface FarmerDocumentCreate {
  docType: DocType;
  fileUri: string;
}

export interface FarmerCreateRequest {
  users: { id: number };
  name: string;
  dob: string;
  email: string;
  contactInfo: string;
  gender: FarmerGender;
  address: string;
  landDetails: string;
  status: FarmerStatus;
  documents: FarmerDocumentCreate[];
}
