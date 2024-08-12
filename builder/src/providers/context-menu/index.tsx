import React, { createContext, useContext, useState } from 'react';
import { useAppContext } from '../app';
import { useClipboard } from '../clipboard';

interface ContextMenuContextType {
  handleContextMenu: (
    e: React.MouseEvent,
    type: 'component' | 'cell',
    componentId?: string,
    column?: number,
    row?: number
  ) => void;
  contextMenu: {
    x: number;
    y: number;
    type: 'component' | 'cell';
    componentId?: string;
    column?: number;
    row?: number;
  } | null;
  setContextMenu: React.Dispatch<
    React.SetStateAction<ContextMenuContextType['contextMenu']>
  >;
  handleCopy: () => void;
  handlePaste: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
  undefined
);

export const ContextMenuProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { currentPage: page, updatePage } = useAppContext();
  const { copyComponent, pasteComponent } = useClipboard();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'component' | 'cell';
    componentId?: string;
    column?: number;
    row?: number;
  } | null>(null);

  const handleContextMenu = (
    e: React.MouseEvent,
    type: 'component' | 'cell',
    componentId?: string,
    column?: number,
    row?: number
  ) => {
    console.log('context menu', type, componentId, column, row);

    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      componentId,
      column,
      row,
    });
  };

  const handleCopy = () => {
    if (contextMenu?.type === 'component' && contextMenu.componentId) {
      const component = page?.components?.find(
        (c) => c.id === contextMenu.componentId
      );
      if (component) {
        copyComponent(component);
      }
    }
    setContextMenu(null);
  };

  const handlePaste = () => {
    if (contextMenu?.type === 'cell' && contextMenu.column && contextMenu.row) {
      const pastedComponent = pasteComponent(
        contextMenu.column,
        contextMenu.row
      );
      if (pastedComponent) {
        const updatedComponents = [
          ...(page?.components || []),
          pastedComponent,
        ];
        updatePage({ ...page, components: updatedComponents });
      }
    }
    setContextMenu(null);
  };
  return (
    <ContextMenuContext.Provider
      value={{
        handleContextMenu,
        contextMenu,
        setContextMenu,
        handleCopy,
        handlePaste,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error('useContextMenu must be used within a AppProvider');
  }
  return context;
};
