import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'disbursementStatus', standalone: true })
export class DisbursementStatusPipe implements PipeTransform {
  private labels: Record<string, string> = {
    PENDING: 'Under Review', IN_PROGRESS: 'In Progress',
    COMPLETED: 'Approved', REJECTED: 'Rejected'
  };
  transform(value: string): string { return this.labels[value] ?? value; }
}

export function getDisbursementBadgeColor(status: string): string {
  const c: Record<string, string> = {
    PENDING: '#FFC107', IN_PROGRESS: '#2196F3', COMPLETED: '#4CAF50', REJECTED: '#F44336'
  };
  return c[status] ?? '#9E9E9E';
}
