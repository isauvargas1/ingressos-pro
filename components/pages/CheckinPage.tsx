import React, { useState } from 'react';
import { Ticket } from '../../types';
import { api } from '../../services/api';
import { QrScanner } from '../QrScanner';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Loader2, CheckCircle2, X } from '../Icons';

export const CheckinPage: React.FC = () => {
    const [scannedTicket, setScannedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkinSuccess, setCheckinSuccess] = useState(false);

    const handleScan = async (qrToken: string) => {
        setIsLoading(true);
        setError(null);
        setScannedTicket(null);
        setCheckinSuccess(false);
        try {
            const ticket = await api.tickets.get(qrToken);
            if (!ticket) {
                throw new Error("Ingresso não encontrado.");
            }
            setScannedTicket(ticket);
        } catch (e: any) {
            setError(e.message || "Ocorreu um erro ao buscar o ingresso.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmCheckin = async () => {
        if (!scannedTicket) return;
        setIsLoading(true);
        setError(null);
        try {
            await api.checkin.confirm(scannedTicket.qrToken);
            setCheckinSuccess(true);
        } catch (e: any) {
            setError(e.message || "Não foi possível realizar o check-in.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const reset = () => {
        setScannedTicket(null);
        setError(null);
        setCheckinSuccess(false);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <QrScanner onScan={handleScan} />

            <div className="mt-8 md:mt-0">
                <h2 className="text-2xl font-bold mb-4">Resultado</h2>
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {error && (
                     <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2"><X className="h-6 w-6"/>Erro no Check-in</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{error}</p>
                            <Button onClick={reset} className="mt-4 w-full">Nova leitura</Button>
                        </CardContent>
                    </Card>
                )}

                {checkinSuccess && scannedTicket && (
                    <Card className="border-green-500">
                        <CardHeader>
                            <CardTitle className="text-green-600 flex items-center gap-2"><CheckCircle2 className="h-6 w-6"/>Check-in Realizado!</CardTitle>
                            <CardDescription>Participante liberado.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="font-bold text-lg">{scannedTicket.participant?.fullName}</p>
                            <p className="text-muted-foreground">{scannedTicket.participant?.email}</p>
                            <Button onClick={reset} className="mt-4 w-full">Nova leitura</Button>
                        </CardContent>
                    </Card>
                )}

                {!isLoading && !error && !checkinSuccess && scannedTicket && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{scannedTicket.participant?.fullName}</CardTitle>
                            <CardDescription>{scannedTicket.participant?.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Status do Ingresso</h4>
                                <p className="capitalize">{scannedTicket.status}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleConfirmCheckin} className="w-full">Confirmar Check-in</Button>
                                <Button onClick={reset} variant="outline" className="w-full">Cancelar</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!isLoading && !error && !scannedTicket && !checkinSuccess && (
                     <Card className="border-dashed">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Aguardando leitura do QR code...
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
