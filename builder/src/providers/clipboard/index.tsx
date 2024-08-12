import React, { createContext, useContext, useState } from 'react';
import { ComponentConfig } from '../../components/library/general';

interface ClipboardContextType {
  copyComponent: (component: ComponentConfig) => void;
  pasteComponent: (target: number, row: number) => ComponentConfig | null;
  hasClipboardContent: boolean;
}

const ClipboardContext = createContext<ClipboardContextType | undefined>(
  undefined
);

export const ClipboardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [clipboard, setClipboard] = useState<ComponentConfig | null>(null);

  const copyComponent = (component: ComponentConfig) => {
    // Create a deep copy of the component to avoid reference issues
    const componentCopy = JSON.parse(JSON.stringify(component));

    // Generate a new ID for the copied component
    componentCopy.id = `${componentCopy.id}-copy-${Date.now()}`;

    setClipboard(componentCopy);
  };

  const pasteComponent = (
    targetColumn: number,
    targetRow: number
  ): ComponentConfig | null => {
    if (!clipboard) return null;

    const pastedComponent = {
      ...clipboard,
      layout: {
        ...clipboard.layout,
        gridColumn: targetColumn,
        gridRow: targetRow,
      },
    };

    return pastedComponent;
  };

  return (
    <ClipboardContext.Provider
      value={{
        copyComponent,
        pasteComponent,
        hasClipboardContent: !!clipboard,
      }}
    >
      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = () => {
  const context = useContext(ClipboardContext);
  if (context === undefined) {
    throw new Error('useClipboard must be used within App');
  }
  return context;
};
