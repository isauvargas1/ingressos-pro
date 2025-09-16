import React, { useEffect, useState } from 'react';
import { Participant, TicketStatus } from '../../types';
import { api } from '../../services/api';
import Button from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import Input from '../ui/Input';
import { UploadCloud, FileDown, CheckCircle2, Ticket, Users, Loader2 } from '../Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/Dialog';

const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
    const statusMap = {
        [TicketStatus.GENERATED]: { text: 'Gerado', color: 'bg-gray-200 text-gray-800' },
        [TicketStatus.SENT]: { text: 'Enviado', color: 'bg-blue-200 text-blue-800' },
        [TicketStatus.CHECKED_IN]: { text: 'Check-in', color: 'bg-green-200 text-green-800' },
    };
    const { text, color } = statusMap[status] || statusMap[TicketStatus.GENERATED];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>
}


export const ParticipantsPage: React.FC<{ eventId: string }> = ({ eventId }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isImporting, setIsImporting] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        const fetchParticipants = async () => {
            setLoading(true);
            try {
                const result = await api.participants.list(eventId, page, pageSize);
                setParticipants(result.data);
                setTotal(result.total);
            } catch (error) {
                console.error("Failed to fetch participants", error);
            } finally {
                setLoading(false);
            }
        };
        fetchParticipants();
    }, [eventId, page]);

    const totalPages = Math.ceil(total / pageSize);

    const handleGenerateTickets = async () => {
        // Mock implementation
        alert("Função 'Gerar Ingressos' chamada. No app real, isso chamaria a API.");
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Participantes</h1>
                    <p className="text-muted-foreground">Gerencie os participantes do seu evento.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => alert('Exportando...')}>
                        <FileDown className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button onClick={() => setIsImporting(true)}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Importar Planilha
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <Input placeholder="Buscar participante..." className="max-w-sm" />
                        <Button onClick={handleGenerateTickets}>Gerar Ingressos</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><input type="checkbox" /></TableHead>
                                <TableHead>Nome Completo</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status Ingresso</TableHead>
                                <TableHead>Data de Inscrição</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={5} className="h-12 text-center">Carregando...</TableCell></TableRow>
                                ))
                            ) : (
                                participants.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell><input type="checkbox" /></TableCell>
                                        <TableCell>{p.fullName}</TableCell>
                                        <TableCell>{p.email}</TableCell>
                                        <TableCell>{p.ticketStatus ? <StatusBadge status={p.ticketStatus} /> : '-'}</TableCell>
                                        <TableCell>{new Date(p.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    Anterior
                </Button>
                <span>Página {page} de {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    Próxima
                </Button>
            </div>
            
            <ImportWizard open={isImporting} onOpenChange={setIsImporting} eventId={eventId} />
        </>
    );
};

const ImportWizard: React.FC<{open: boolean, onOpenChange: (open: boolean) => void, eventId: string}> = ({open, onOpenChange, eventId}) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{inserted: number} | null>(null);

    const handleImport = async () => {
        setIsLoading(true);
        // In a real app, you'd get this from a file parsed with SheetJS
        const mockData = [{fullName: 'Novo Participante 1', email: 'novo1@email.com'}, {fullName: 'Novo Participante 2', email: 'novo2@email.com'}];
        try {
            const res = await api.participants.import(eventId, mockData);
            setResult(res);
            setStep(3);
        } catch(e) {
            console.error(e);
            alert("Falha na importação");
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStep(1);
            setResult(null);
        }, 300);
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader>
                <DialogTitle>Importar Participantes</DialogTitle>
                <DialogDescription>Siga os passos para adicionar participantes via planilha.</DialogDescription>
            </DialogHeader>
            <DialogContent>
                {step === 1 && (
                     <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold">Arraste e solte seu arquivo aqui</h3>
                        <p className="text-muted-foreground mt-2">ou</p>
                        <Button className="mt-4">Selecione o arquivo</Button>
                        <p className="text-xs text-muted-foreground mt-4">Suporta CSV e XLSX</p>
                    </div>
                )}
                {step === 2 && (
                    <div className="text-center">
                        <p>Pré-visualização e validação dos dados apareceriam aqui.</p>
                    </div>
                )}
                 {step === 3 && result && (
                    <div className="text-center flex flex-col items-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold">Importação Concluída!</h3>
                        <p className="text-muted-foreground">{result.inserted} participantes foram adicionados com sucesso.</p>
                    </div>
                )}
            </DialogContent>
            <DialogFooter>
                {step === 1 && <Button onClick={() => setStep(2)}>Avançar</Button>}
                {step === 2 && <Button onClick={handleImport} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Confirmar Importação</Button>}
                {step === 3 && <Button onClick={handleClose}>Fechar</Button>}
            </DialogFooter>
        </Dialog>
    )
}
