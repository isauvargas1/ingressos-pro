import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { QrCode } from './Icons';

interface QrScannerProps {
    onScan: (qrToken: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan }) => {
    const [manualToken, setManualToken] = useState('');
    const [isManualEntry, setIsManualEntry] = useState(false);

    // TODO: Integrate with a real QR scanner library like html5-qrcode
    const handleSimulateScan = () => {
        onScan(`p-1-qr-token-${Math.random().toString(36).substring(7)}`);
    };
    
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(manualToken.trim()) {
            onScan(manualToken.trim());
            setManualToken('');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-6 h-6" />
                    Leitor de QR Code
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!isManualEntry ? (
                    <div className="space-y-4">
                        <div className="w-full h-64 bg-slate-900 rounded-md flex items-center justify-center text-white">
                            <p>Visualização da câmera desativada no mock</p>
                        </div>
                        <Button onClick={handleSimulateScan} className="w-full">
                            Simular Leitura de QR Code
                        </Button>
                         <Button variant="link" onClick={() => setIsManualEntry(true)} className="w-full">
                            Digitar código manualmente
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <Input 
                            value={manualToken}
                            onChange={e => setManualToken(e.target.value)}
                            placeholder="Insira o código do ingresso"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1">Confirmar</Button>
                            <Button variant="outline" onClick={() => setIsManualEntry(false)} className="flex-1">
                                Voltar para a Câmera
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};
