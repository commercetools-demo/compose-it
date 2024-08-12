import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useContextMenu } from '../../../providers/context-menu';
import { useClipboard } from '../../../providers/clipboard';

const MenuContainer = styled.div`
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: black;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ContextMenu: React.FC = () => {
  const { contextMenu, setContextMenu, handleCopy, handlePaste } =
    useContextMenu();
  const { hasClipboardContent } = useClipboard();
  const menuRef = useRef<HTMLDivElement>(null);

  const onCopy = useCallback(() => {
    if (contextMenu?.type === 'component') {
      handleCopy();
    }
  }, [contextMenu]);

  const onPaste = useCallback(() => {
    if (contextMenu?.type === 'cell') {
      handlePaste();
    }
  }, [contextMenu]);

  const onClose = useCallback(() => {
    setContextMenu(null);
  }, [contextMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!contextMenu) return null;

  return (
    <MenuContainer
      ref={menuRef}
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      {onCopy && <MenuItem onClick={onCopy}>Copy</MenuItem>}
      {onPaste && !!hasClipboardContent && (
        <MenuItem onClick={onPaste}>Paste</MenuItem>
      )}
    </MenuContainer>
  );
};

export default ContextMenu;
