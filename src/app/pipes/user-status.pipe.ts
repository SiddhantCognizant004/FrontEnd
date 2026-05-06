import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userStatus', standalone: true })
export class UserStatusPipe implements PipeTransform {
  private labels: Record<string, string> = {
    ACTIVE: 'Active', INACTIVE: 'Inactive', DELETED: 'Deleted', SUSPENDED: 'Suspended'
  };
  transform(value: string): string { return this.labels[value] ?? value; }
}

export function userStatusColor(status: string): string {
  const c: Record<string, string> = {
    ACTIVE: '#4CAF50', INACTIVE: '#FF9800', DELETED: '#F44336', SUSPENDED: '#9C27B0'
  };
  return c[status] ?? '#9E9E9E';
}
