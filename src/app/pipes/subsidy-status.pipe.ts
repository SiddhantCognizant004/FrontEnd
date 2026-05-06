import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'subsidyStatus', standalone: true })
export class SubsidyStatusPipe implements PipeTransform {
  private labels: Record<string, string> = {
    PENDING: 'Active', VALIDATED: 'Closed — Budget Full', REJECTED: 'Programme Cancelled'
  };
  transform(value: string): string { return this.labels[value] ?? value; }
}

export function getSubsidyBadgeColor(status: string): string {
  const c: Record<string, string> = { PENDING: '#4CAF50', VALIDATED: '#9E9E9E', REJECTED: '#F44336' };
  return c[status] ?? '#9E9E9E';
}
