export interface AuditLog {
  id: number;
  action: string;
  performedBy: string;
  role: string;
  details: string;
  timestamp: string;
}

export interface AuditLogPage {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AuditLogCreateRequest {
  performedBy: string;
  action: string;
  role?: string;
  details?: string;
  timestamp?: string;
}
