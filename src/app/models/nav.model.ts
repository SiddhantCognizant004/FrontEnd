export interface NavLink {
  label: string;
  path: string;
  icon?: string;
}

export const ROLE_CONFIG: Record<string, NavLink[]> = {
  FARMER: [
    { label: 'Home', path: '/dashboard/farmer/home' },
    { label: 'Profile', path: '/dashboard/farmer/profile' },
    { label: 'Documents', path: '/dashboard/farmer/documents' },
    { label: 'Subsidies', path: '/dashboard/farmer/subsidies' }
  ],
  OFFICER: [
    { label: 'Home', path: '/dashboard/officer/home' },
    { label: 'Users', path: '/dashboard/officer/users' },
    { label: 'Documents', path: '/dashboard/officer/documents' },
    { label: 'Subsidies', path: '/dashboard/officer/subsidies' }
  ],
  MANAGER: [
    { label: 'Home', path: '/dashboard/manager/home' },
    { label: 'Users', path: '/dashboard/manager/users' },
    { label: 'Subsidies', path: '/dashboard/manager/subsidies' },
    { label: 'Audit Logs', path: '/dashboard/manager/logs' }
  ],
  ADMIN: [
    { label: 'Home', path: '/dashboard/admin/home' },
    { label: 'Users', path: '/dashboard/admin/users' },
    { label: 'Audit Logs', path: '/dashboard/admin/logs' },
    { label: 'Reports', path: '/dashboard/admin/reports' },
    { label: 'Notifications', path: '/dashboard/admin/notifications' }
  ],
  AUDITOR: [
    { label: 'Home', path: '/dashboard/auditor/home' },
    { label: 'Users', path: '/dashboard/auditor/users' },
    { label: 'Audit Logs', path: '/dashboard/auditor/logs' }
  ],
  TRADER: [
    { label: 'Home', path: '/dashboard/trader' }
  ],
  COMPLIANCE: [
    { label: 'Home', path: '/dashboard/compliance' }
  ]
};
