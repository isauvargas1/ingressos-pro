import { UserRole } from './types';

export const APP_NAME = "Gerenciador de Eventos Pro";

export const PERMISSIONS = {
  CAN_MANAGE_USERS: 'canManageUsers',
  CAN_CREATE_EVENTS: 'canCreateEvents',
  CAN_EDIT_EVENTS: 'canEditEvents',
  CAN_DELETE_EVENTS: 'canDeleteEvents',
  CAN_MANAGE_PARTICIPANTS: 'canManageParticipants',
  CAN_GENERATE_TICKETS: 'canGenerateTickets',
  CAN_SEND_EMAILS: 'canSendEmails',
  CAN_PERFORM_CHECKIN: 'canPerformCheckin',
  CAN_MANAGE_CERTIFICATES: 'canManageCertificates',
  CAN_EXPORT_DATA: 'canExportData',
  CAN_VIEW_REPORTS: 'canViewReports',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: Object.values(PERMISSIONS),
  [UserRole.ORGANIZER]: [
    PERMISSIONS.CAN_CREATE_EVENTS,
    PERMISSIONS.CAN_EDIT_EVENTS,
    PERMISSIONS.CAN_MANAGE_PARTICIPANTS,
    PERMISSIONS.CAN_GENERATE_TICKETS,
    PERMISSIONS.CAN_SEND_EMAILS,
    PERMISSIONS.CAN_PERFORM_CHECKIN,
    PERMISSIONS.CAN_MANAGE_CERTIFICATES,
    PERMISSIONS.CAN_EXPORT_DATA,
    PERMISSIONS.CAN_VIEW_REPORTS,
  ],
  [UserRole.STAFF]: [
    PERMISSIONS.CAN_PERFORM_CHECKIN,
    PERMISSIONS.CAN_VIEW_REPORTS,
  ],
  [UserRole.VIEWER]: [
    PERMISSIONS.CAN_VIEW_REPORTS,
  ],
};
