import React, { useState, useEffect } from 'react';
import { Event, User } from '../types';
import { api } from '../services/api';
import Button from './ui/Button';
import { Card } from './ui/Card';
import { LogOut, Settings, Users, Ticket, QrCode, Award } from './Icons';

interface LayoutProps {
  user: User | null;
  children: React.ReactNode;
  onLogout: () => void;
}

interface EventSelectorProps {
    events: Event[];
    selectedEventId: string | null;
    onSelectEvent: (eventId: string) => void;
}

const EventSelector: React.FC<EventSelectorProps> = ({ events, selectedEventId, onSelectEvent }) => {
    return (
        <select
            value={selectedEventId || ''}
            onChange={(e) => onSelectEvent(e.target.value)}
            className="w-full md:w-64 p-2 border rounded-md bg-secondary text-secondary-foreground"
        >
            {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
            ))}
        </select>
    );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode; icon: React.ReactNode }> = ({ href, children, icon }) => {
  const isActive = window.location.hash === href || (window.location.hash.startsWith(href) && href !== '#/');
  return (
    <a href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
        {icon}
        {children}
    </a>
  );
};


export const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        api.events.list().then(data => {
            setEvents(data);
            if (data.length > 0) {
                setSelectedEventId(data[0].id);
            }
        });
    }, []);

    const handleEventChange = (eventId: string) => {
        setSelectedEventId(eventId);
        // Usually you would refetch data related to the event here
        // or use a global state management library to notify components.
        window.location.hash = `#/events/${eventId}/participants`;
    };
    
    const eventIdFromHash = window.location.hash.split('/')[2];

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <a href="#/" className="flex items-center gap-2 font-semibold">
                            <Ticket className="h-6 w-6" />
                            <span>Evento.Pro</span>
                        </a>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <NavLink href={`#/events/${eventIdFromHash}/participants`} icon={<Users className="h-4 w-4" />}>Participantes</NavLink>
                            <NavLink href={`#/events/${eventIdFromHash}/tickets`} icon={<Ticket className="h-4 w-4" />}>Ingressos</NavLink>
                            <NavLink href={`#/events/${eventIdFromHash}/checkin`} icon={<QrCode className="h-4 w-4" />}>Check-in</NavLink>
                            <NavLink href={`#/events/${eventIdFromHash}/certificates`} icon={<Award className="h-4 w-4" />}>Certificados</NavLink>
                            <NavLink href={`#/events/${eventIdFromHash}/settings`} icon={<Settings className="h-4 w-4" />}>Configurações</NavLink>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1">
                       {events.length > 0 && selectedEventId && (
                           <EventSelector events={events} selectedEventId={eventIdFromHash} onSelectEvent={handleEventChange} />
                       )}
                    </div>
                     <div className="relative">
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </div>
                    <div>{user?.displayName}</div>
                    <Button variant="ghost" size="icon" onClick={onLogout}>
                        <LogOut className="h-5 w-5"/>
                    </Button>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
