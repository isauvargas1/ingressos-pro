import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { api } from '../../services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ParticipantsPage } from './ParticipantsPage';
import { CheckinPage } from './CheckinPage';
import { Skeleton } from '../ui/Skeleton';

const getActiveTabFromHash = (eventId: string) => {
    const hash = window.location.hash;
    const parts = hash.split('/');
    if (parts[1] === 'events' && parts[2] === eventId && parts[3]) {
        return parts[3];
    }
    return 'participants';
};


export const EventDetailPage: React.FC<{ eventId: string }> = ({ eventId }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(() => getActiveTabFromHash(eventId));

    useEffect(() => {
        const handleHashChange = () => setActiveTab(getActiveTabFromHash(eventId));
        window.addEventListener('hashchange', handleHashChange);
        
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const data = await api.events.get(eventId);
                setEvent(data || null);
            } catch (err) {
                console.error("Failed to fetch event details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
        
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [eventId]);

    const handleTabChange = (tab: string) => {
        window.location.hash = `#/events/${eventId}/${tab}`;
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (!event) {
        return <div>Evento não encontrado.</div>;
    }

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                    <TabsTrigger value="participants">Participantes</TabsTrigger>
                    <TabsTrigger value="tickets">Ingressos</TabsTrigger>
                    <TabsTrigger value="checkin">Check-in</TabsTrigger>
                    <TabsTrigger value="certificates">Certificados</TabsTrigger>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>

                <TabsContent value="participants">
                    <ParticipantsPage eventId={eventId} />
                </TabsContent>
                <TabsContent value="tickets">
                    <div>Gerenciamento de Ingressos (UI a ser implementada)</div>
                </TabsContent>
                <TabsContent value="checkin">
                    <CheckinPage />
                </TabsContent>
                <TabsContent value="certificates">
                    <div>Gerenciamento de Certificados (UI a ser implementada)</div>
                </TabsContent>
                 <TabsContent value="settings">
                    <div>Configurações do Evento (UI a ser implementada)</div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
