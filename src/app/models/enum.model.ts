export enum UserRole {
  FARMER = 'FARMER',
  TRADER = 'TRADER',
  OFFICER = 'OFFICER',
  MANAGER = 'MANAGER',
  COMPLIANCE = 'COMPLIANCE',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED'
}

export enum FarmerStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE'
}

export enum FarmerGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum DocType {
  ID_PROOF = 'ID_PROOF',
  LAND_RECORD = 'LAND_RECORD'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum SubsidyStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED'
}

export enum DisbursementStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export enum CropListingStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  SOLD_OUT = 'SOLD_OUT'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD'
}

export enum NotificationCategory {
  ALERT = 'ALERT',
  VERIFICATION = 'VERIFICATION',
  BROADCAST = 'BROADCAST'
}
