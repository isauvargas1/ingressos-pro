import React from 'react';
import { X } from '../Icons';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)}></div>
      <div className="relative z-10 bg-card rounded-lg shadow-lg w-full max-w-lg">
        {children}
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  );
};

const DialogHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 ${className}`}>
    {children}
  </div>
);

const DialogTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>
);

const DialogDescription: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

const DialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const DialogFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 ${className}`}>{children}</div>
);

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter };
