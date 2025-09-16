// FIX: Add React import for React.ReactNode
import React from 'react';

export enum EventStatus {
  DRAFT = "rascunho",
  PUBLISHED = "publicado",
  FINISHED = "encerrado",
}

export enum TicketStatus {
  GENERATED = "gerado",
  SENT = "enviado",
  CHECKED_IN = "checkin",
}

export enum UserRole {
  ADMIN = "admin",
  ORGANIZER = "organizer",
  STAFF = "staff",
  VIEWER = "viewer",
}

export interface EventBrand {
  colors: {
    primary: string;
    secondary: string;
  };
  logoURL: string;
}

export interface Event {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  location: string;
  description: string;
  status: EventStatus;
  brand: EventBrand;
  certificateTemplatePath?: string;
}

export interface Participant {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  cpf?: string;
  phone?: string;
  institution?: string;
  createdAt: Date;
  ticketStatus?: TicketStatus;
}

export interface Ticket {
  id: string;
  eventId: string;
  participantId: string;
  participant?: Participant;
  qrToken: string;
  status: TicketStatus;
  sentAt?: Date;
}

export interface Checkin {
  id: string;
  eventId: string;
  ticketId: string;
  scannedAt: Date;
  scannedBy: string; // userId
  deviceInfo: string;
}

export interface Certificate {
  id: string;
  eventId: string;
  participantId: string;
  ticketId: string;
  storagePath: string;
  availableAt: Date;
  signedHash: string;
  views: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface ColumnDef<T> {
    accessorKey: keyof T | string;
    header: string;
    cell?: (props: { row: { original: T } }) => React.ReactNode;
}