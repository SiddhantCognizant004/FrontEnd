import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'farmerStatus', standalone: true })
export class FarmerStatusPipe implements PipeTransform {
  private labels: Record<string, string> = {
    ACTIVE: 'Active', PENDING_VERIFICATION: 'Pending Verification',
    APPROVED: 'Approved', REJECTED: 'Rejected', INACTIVE: 'Inactive'
  };
  transform(value: string): string { return this.labels[value] ?? value; }
}

export function farmerStatusColor(status: string): string {
  const c: Record<string, string> = {
    ACTIVE: '#4CAF50', PENDING_VERIFICATION: '#FFC107',
    APPROVED: '#2196F3', REJECTED: '#F44336', INACTIVE: '#9E9E9E'
  };
  return c[status] ?? '#9E9E9E';
}
