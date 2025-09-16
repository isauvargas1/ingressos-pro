import { Event, Participant, Ticket, TicketStatus, User, UserRole, EventStatus } from '../types';
import { ROLE_PERMISSIONS } from '../constants';

// Mock data
const MOCK_USERS: User[] = [
    { id: 'user-1', displayName: 'Admin User', email: 'admin@evento.pro', role: UserRole.ADMIN, permissions: ROLE_PERMISSIONS.admin, createdAt: new Date(), lastLoginAt: new Date() },
    { id: 'user-2', displayName: 'Organizador User', email: 'org@evento.pro', role: UserRole.ORGANIZER, permissions: ROLE_PERMISSIONS.organizer, createdAt: new Date(), lastLoginAt: new Date() },
];

const MOCK_EVENTS: Event[] = [
    { id: 'event-1', name: 'Conferência de Tecnologia 2024', status: EventStatus.PUBLISHED, startAt: new Date('2024-10-26T09:00:00'), endAt: new Date('2024-10-27T18:00:00'), location: 'Centro de Convenções', description: 'A maior conferência de tecnologia da América Latina.', brand: { colors: { primary: '#007BFF', secondary: '#6C757D'}, logoURL: 'https://picsum.photos/100' } },
    { id: 'event-2', name: 'Workshop de Design Thinking', status: EventStatus.DRAFT, startAt: new Date('2024-11-15T10:00:00'), endAt: new Date('2024-11-15T17:00:00'), location: 'InovaHub', description: 'Workshop prático sobre Design Thinking.', brand: { colors: { primary: '#28A745', secondary: '#343A40'}, logoURL: 'https://picsum.photos/101' } },
];

let MOCK_PARTICIPANTS: Participant[] = Array.from({ length: 55 }, (_, i) => ({
    id: `p-${i + 1}`,
    eventId: 'event-1',
    fullName: `Participante ${i + 1}`,
    email: `participante${i + 1}@email.com`,
    cpf: `123.456.789-0${i % 10}`,
    institution: 'Universidade Exemplo',
    createdAt: new Date(),
    ticketStatus: i % 4 === 0 ? TicketStatus.CHECKED_IN : i % 3 === 0 ? TicketStatus.SENT : TicketStatus.GENERATED
}));

let MOCK_TICKETS: Ticket[] = MOCK_PARTICIPANTS.map(p => ({
    id: `t-${p.id}`,
    eventId: p.eventId,
    participantId: p.id,
    qrToken: `${p.id}-qr-token-${Math.random().toString(36).substring(7)}`,
    status: p.ticketStatus!,
    sentAt: p.ticketStatus === TicketStatus.SENT || p.ticketStatus === TicketStatus.CHECKED_IN ? new Date() : undefined,
}));

// API simulation
const simulateNetwork = (delay = 500) => new Promise(res => setTimeout(res, delay));

export const api = {
    auth: {
        login: async (email: string): Promise<User> => {
            await simulateNetwork();
            const user = MOCK_USERS.find(u => u.email === email);
            if (!user) throw new Error('Usuário não encontrado');
            return user;
        },
        logout: async (): Promise<void> => {
            await simulateNetwork(100);
        },
        getMe: async (): Promise<User> => {
            await simulateNetwork(100);
            return MOCK_USERS[1]; // Assume logged in as organizer
        }
    },
    events: {
        list: async (): Promise<Event[]> => {
            await simulateNetwork();
            return MOCK_EVENTS;
        },
        get: async (eventId: string): Promise<Event | undefined> => {
            await simulateNetwork();
            return MOCK_EVENTS.find(e => e.id === eventId);
        }
    },
    participants: {
        list: async (eventId: string, page: number, pageSize: number): Promise<{ data: Participant[], total: number }> => {
            await simulateNetwork();
            const eventParticipants = MOCK_PARTICIPANTS.filter(p => p.eventId === eventId);
            const data = eventParticipants.slice((page - 1) * pageSize, page * pageSize);
            return { data, total: eventParticipants.length };
        },
        import: async (eventId: string, rows: any[]): Promise<{ inserted: number, updated: number, duplicated: number, errors: any[] }> => {
            await simulateNetwork(1500);
            const newParticipants = rows.map((row, i) => ({
                id: `new-p-${Date.now()}-${i}`,
                eventId,
                fullName: row.fullName,
                email: row.email,
                createdAt: new Date(),
                ticketStatus: TicketStatus.GENERATED
            }));
            MOCK_PARTICIPANTS = [...MOCK_PARTICIPANTS, ...newParticipants];
            return { inserted: rows.length, updated: 0, duplicated: 0, errors: [] };
        }
    },
    tickets: {
        get: async (qrToken: string): Promise<Ticket | undefined> => {
            await simulateNetwork();
            const ticket = MOCK_TICKETS.find(t => t.qrToken === qrToken);
            if(ticket) {
                ticket.participant = MOCK_PARTICIPANTS.find(p => p.id === ticket.participantId);
            }
            return ticket;
        },
        generate: async (eventId: string, participantIds: string[]): Promise<{ created: number }> => {
            await simulateNetwork();
            participantIds.forEach(pId => {
                const participant = MOCK_PARTICIPANTS.find(p => p.id === pId);
                if (participant) participant.ticketStatus = TicketStatus.GENERATED;
            });
            return { created: participantIds.length };
        }
    },
    checkin: {
        confirm: async (qrToken: string): Promise<{ ok: true, checkin: any }> => {
            await simulateNetwork(300);
            const ticket = MOCK_TICKETS.find(t => t.qrToken === qrToken);
            if (!ticket) throw new Error("Ticket inválido");
            if (ticket.status === TicketStatus.CHECKED_IN) throw new Error("Ticket já utilizado");
            
            ticket.status = TicketStatus.CHECKED_IN;
            const participant = MOCK_PARTICIPANTS.find(p => p.id === ticket.participantId);
            if(participant) participant.ticketStatus = TicketStatus.CHECKED_IN;

            const checkin = { ticketId: ticket.id, scannedAt: new Date() };
            return { ok: true, checkin };
        }
    },
    reports: {
        getCheckinsByHour: async (eventId: string): Promise<{ series: { time: string, count: number }[] }> => {
            await simulateNetwork();
            return {
                series: [
                    { time: '08:00', count: 10 },
                    { time: '09:00', count: 45 },
                    { time: '10:00', count: 30 },
                    { time: '11:00', count: 15 },
                ]
            }
        }
    }
};
