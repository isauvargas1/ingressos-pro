import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Users, Ticket, QrCode, Award } from '../Icons';

const StatCard: React.FC<{title: string, value: string, description: string, icon: React.ReactNode}> = ({ title, value, description, icon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export const DashboardPage: React.FC = () => {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral do seu evento.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total de Inscritos" value="1,250" description="+20.1% desde o último mês" icon={<Users className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Ingressos Gerados" value="1,200" description="96% do total" icon={<Ticket className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Check-ins Realizados" value="980" description="81.6% dos inscritos" icon={<QrCode className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Certificados Emitidos" value="950" description="Após o encerramento" icon={<Award className="h-4 w-4 text-muted-foreground" />} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Check-ins por Hora</CardTitle>
                    <CardDescription>Volume de entradas durante o evento.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for a chart library like Recharts */}
                    <div className="h-80 w-full bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Gráfico de check-ins virá aqui.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
