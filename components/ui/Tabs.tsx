import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{ value: string; onValueChange: (value: string) => void; } | null>(null);

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
    {children}
  </div>
);

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, ...props }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within a Tabs component");

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-background text-foreground shadow-sm' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};


interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}
const TabsContent: React.FC<TabsContentProps> = ({ value, children, ...props }) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within a Tabs component");
    if (context.value !== value) return null;

    return <div {...props}>{children}</div>
};


export { Tabs, TabsList, TabsTrigger, TabsContent };
