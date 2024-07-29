import React from 'react';

interface ResizeHandleProps {
  direction: 'left' | 'right' | 'top' | 'bottom';
  onMouseDown: (e: React.MouseEvent) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  onMouseDown,
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: '#4CAF50',
    zIndex: 10,
  };

  switch (direction) {
    case 'left':
      style.top = '50%';
      style.left = 0;
      style.transform = 'translateY(-50%)';
      style.cursor = 'w-resize';
      break;
    case 'right':
      style.top = '50%';
      style.right = 0;
      style.transform = 'translateY(-50%)';
      style.cursor = 'e-resize';
      break;
    case 'top':
      style.top = 0;
      style.left = '50%';
      style.transform = 'translateX(-50%)';
      style.cursor = 'n-resize';
      break;
    case 'bottom':
      style.bottom = 0;
      style.left = '50%';
      style.transform = 'translateX(-50%)';
      style.cursor = 's-resize';
      break;
  }

  return <div style={style} onMouseDown={onMouseDown} />;
};

export default ResizeHandle;
